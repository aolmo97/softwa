import { beforeAll, beforeEach, afterAll, describe, it, expect } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep, basename } from "node:path";
import { randomUUID } from "node:crypto";
import { db, migrate, closeDb } from "../src/lib/db";
import { seed } from "../src/lib/seed";
import {
  recordEvent,
  analyticsSummary,
  analyticsWindow,
  analyticsCsv,
  referrerDomain,
  analyticsInputSchema,
  pruneAnalytics,
  type AnalyticsInput,
} from "../src/lib/analytics";
const dir = mkdtempSync(join(tmpdir(), "software-analytics-test-"));
const now = new Date("2026-09-30T12:00:00Z");
const event = (overrides: Partial<AnalyticsInput> = {}): AnalyticsInput => ({
  id: randomUUID(),
  name: "page_view",
  path: "/",
  ...overrides,
});
beforeAll(() => {
  process.env.DATABASE_PATH = join(dir, "analytics.sqlite");
  migrate();
  seed();
});
beforeEach(() => {
  db().exec("DELETE FROM analytics_events; DELETE FROM analytics_state;");
});
afterAll(() => {
  closeDb();
  if (
    !resolve(dir).startsWith(resolve(tmpdir()) + sep) ||
    !basename(dir).startsWith("software-analytics-test-")
  )
    throw new Error("Unsafe cleanup path");
  rmSync(dir, { recursive: true, force: true });
});
describe("first-party analytics", () => {
  it("separates visitors, sessions, page views and actions and deduplicates retries", () => {
    const home = event();
    expect(recordEvent(home, "visitor-a", "session-a", now)).toBe(true);
    expect(recordEvent(home, "visitor-a", "session-a", now)).toBe(false);
    recordEvent(
      event({ path: "/software/gimp" }),
      "visitor-a",
      "session-a",
      now,
    );
    recordEvent(
      event({ name: "search", slug: "gimp", results: 1 }),
      "visitor-a",
      "session-a",
      now,
    );
    recordEvent(event(), "visitor-a", "session-b", now);
    recordEvent(event(), "visitor-b", "session-c", now);
    const summary = analyticsSummary({ range: "day" }, now);
    expect(summary.totals).toMatchObject({
      visitors: 2,
      sessions: 3,
      pageViews: 4,
      searches: 1,
    });
    expect(summary.topSearched).toEqual([{ label: "GIMP", count: 1 }]);
    expect(summary.topViewed).toEqual([{ label: "GIMP", count: 1 }]);
    const stored = db()
      .prepare("SELECT * FROM analytics_events LIMIT 1")
      .get() as Record<string, string>;
    expect(stored.visitor_hash).not.toBe("visitor-a");
    expect(stored.session_hash).not.toBe("session-a");
    expect(stored.query).toBeNull();
    expect(summary.startedAt).toBe(now.toISOString());
  });
  it("deduplicates visitors across days and groups by Monday weeks and calendar months", () => {
    recordEvent(event(), "one", "s1", new Date("2026-09-27T23:59:59Z"));
    recordEvent(event(), "one", "s2", new Date("2026-09-28T00:00:00Z"));
    recordEvent(event(), "two", "s3", now);
    const weekly = analyticsSummary({ range: "week", group: "week" }, now);
    expect(weekly.totals.visitors).toBe(2);
    expect(weekly.trend.map((row) => [row.label, row.visitors])).toEqual([
      ["2026-09-21", 1],
      ["2026-09-28", 2],
    ]);
    expect(
      analyticsSummary({ range: "month", group: "month" }, now).trend,
    ).toEqual([
      { label: "2026-09-01", visitors: 2, sessions: 3, pageViews: 3 },
    ]);
    const daily = analyticsSummary({ range: "week" }, now);
    expect(daily.trend).toHaveLength(7);
    expect(daily.trend[0].visitors).toBe(0);
  });
  it("uses UTC boundaries and includes both custom endpoints", () => {
    recordEvent(event(), "one", "s1", new Date("2026-09-30T23:59:59Z"));
    const tomorrow = new Date("2026-10-01T01:00:00Z");
    recordEvent(event(), "one", "s1", new Date("2026-10-01T00:00:00Z"));
    expect(analyticsSummary({ range: "day" }, tomorrow).totals.pageViews).toBe(
      1,
    );
    expect(
      analyticsSummary(
        { range: "custom", from: "2026-09-30", to: "2026-10-01" },
        tomorrow,
      ).totals.pageViews,
    ).toBe(2);
  });
  it("counts unsuccessful searches, matches, filters and clicks separately", () => {
    for (const input of [
      event({ name: "search", results: 0 }),
      event({ name: "match_completed", slug: "photoshop", results: 0 }),
      event({ name: "filter_used", filter: "linux", enabled: true }),
      event({ name: "filter_used", filter: "linux", enabled: false }),
      event({ name: "external_website_click", slug: "gimp" }),
      event({ name: "affiliate_click", slug: "gimp" }),
    ])
      recordEvent(input, "one", "session", now);
    const summary = analyticsSummary({}, now);
    expect(summary.totals).toMatchObject({
      pageViews: 0,
      visitors: 0,
      noResultSearches: 1,
      matches: 1,
      noResultMatches: 1,
      outbound: 2,
      affiliate: 1,
    });
    expect(summary.filters).toEqual([{ label: "linux", count: 1 }]);
  });
  it("never accepts raw search text, arbitrary properties, private routes or unknown tools", () => {
    expect(
      analyticsInputSchema.safeParse({
        ...event(),
        query: "private@example.com",
      }).success,
    ).toBe(false);
    expect(
      analyticsInputSchema.safeParse({
        ...event(),
        properties: { ip: "1.2.3.4" },
      }).success,
    ).toBe(false);
    expect(
      analyticsInputSchema.safeParse(event({ path: "/?secret=abc" })).success,
    ).toBe(false);
    for (const path of [
      "/admin",
      "/api/admin/software",
      "/software/not-real",
      "/private-token",
    ])
      expect(recordEvent(event({ path }), "one", "one", now)).toBe(false);
    expect(
      recordEvent(
        event({ name: "search", slug: "not-real", results: 1 }),
        "one",
        "one",
        now,
      ),
    ).toBe(false);
    expect(analyticsSummary({}, now).startedAt).toBeNull();
  });
  it("stores referrer domains only and counts each session once by its entry", () => {
    recordEvent(
      event({
        referrer: "https://www.example.com/search?q=secret",
        device: "mobile",
      }),
      "one",
      "session",
      now,
    );
    recordEvent(
      event({ path: "/software/gimp", device: "desktop" }),
      "one",
      "session",
      now,
    );
    const summary = analyticsSummary({}, now);
    expect(summary.referrers).toEqual([{ label: "example.com", count: 1 }]);
    expect(summary.devices).toEqual([{ label: "mobile", count: 1 }]);
    for (const value of [
      "https://user:pass@example.com",
      "http://127.0.0.1/path",
      "javascript:alert(1)",
      "http://localhost:3000/a",
    ])
      expect(referrerDomain(value)).toBe("Direct");
  });
  it("purges data older than 180 days, retains the cutoff and survives reconnection", () => {
    const cutoff = analyticsWindow({ range: "all" }, now).from;
    recordEvent(event(), "old", "old", new Date(Date.parse(cutoff) - 86400000));
    recordEvent(event(), "edge", "edge", new Date(cutoff));
    pruneAnalytics(now);
    closeDb();
    expect(
      db().prepare("SELECT COUNT(*) n FROM analytics_events").get(),
    ).toEqual({ n: 1 });
    expect(analyticsSummary({ range: "all" }, now).totals.visitors).toBe(1);
  });
  it("rejects invalid, reversed, future and unbounded reporting windows", () => {
    for (const options of [
      { range: "unexpected" },
      { group: "year" },
      { range: "custom", from: "2026-09-31", to: "2026-09-30" },
      { range: "custom", from: "2026-09-30", to: "2026-09-29" },
      { range: "custom", from: "2026-09-30", to: "2026-10-01" },
      { range: "custom", from: "2020-01-01", to: "2026-09-30" },
    ])
      expect(() => analyticsWindow(options, now)).toThrow();
  });
  it("exports totals and all rankings with spreadsheet-safe quoted values", () => {
    recordEvent(event(), "one", "one", now);
    const summary = analyticsSummary({}, now);
    summary.topSearched = [{ label: '=HYPERLINK("bad")', count: 3 }];
    const csv = analyticsCsv(summary);
    expect(csv).toContain('"total","visitors","1"');
    expect(csv).toContain('"\'=HYPERLINK(""bad"")"');
    expect(csv).toContain('"trend"');
  });
});
