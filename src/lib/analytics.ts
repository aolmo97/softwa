import { createHash, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import { z } from "zod";
import { db } from "./db";
import { filterIds } from "./model";

export const visitorCookie = "sa_visitor";
export const analyticsSessionCookie = "sa_visit";
export const consentCookie = "sa_analytics";
export const retentionDays = 180;
export const analyticsInputSchema = z
  .object({
    id: z.string().uuid(),
    name: z.enum([
      "page_view",
      "search",
      "alternative_click",
      "filter_used",
      "affiliate_click",
      "external_website_click",
      "match_completed",
    ]),
    path: z
      .string()
      .max(300)
      .regex(/^\/(?:[a-z0-9-]+\/?)*$/),
    slug: z
      .string()
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    results: z.number().int().min(0).max(10000).optional(),
    filter: z.enum(filterIds).optional(),
    enabled: z.boolean().optional(),
    referrer: z.string().max(300).optional(),
    device: z.enum(["desktop", "tablet", "mobile", "unknown"]).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      ["search", "match_completed"].includes(value.name) &&
      value.results === undefined
    )
      ctx.addIssue({ code: "custom", message: "Result count is required" });
    if (
      [
        "alternative_click",
        "affiliate_click",
        "external_website_click",
        "match_completed",
      ].includes(value.name) &&
      !value.slug
    )
      ctx.addIssue({ code: "custom", message: "Product is required" });
    if (
      value.name === "filter_used" &&
      (!value.filter || value.enabled === undefined)
    )
      ctx.addIssue({
        code: "custom",
        message: "Filter and state are required",
      });
  });
export type AnalyticsInput = z.infer<typeof analyticsInputSchema>;
export const newVisitorToken = () => randomBytes(24).toString("hex");
export const validToken = (value: string | undefined): value is string =>
  !!value && /^[a-f0-9]{48}$/.test(value);
export const visitorHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
const dayOf = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (day: string, amount: number) =>
  dayOf(new Date(Date.parse(day) + amount * 86400000));
const earliestDay = (now: Date) => addDays(dayOf(now), 1 - retentionDays);

export function publicAnalyticsPath(path: string) {
  if (
    [
      "/",
      "/software",
      "/categories",
      "/compare",
      "/find",
      "/about",
      "/methodology",
      "/contact",
      "/privacy",
      "/cookies",
      "/terms",
      "/affiliate-disclosure",
    ].includes(path)
  )
    return true;
  const [, type, slug, filter, extra] = path.split("/");
  if (!slug || extra) return false;
  if (type === "categories" && !filter)
    return !!db().prepare("SELECT 1 FROM categories WHERE slug=?").get(slug);
  if (type === "compare" && !filter) {
    const pair = slug.split("-vs-");
    if (pair.length !== 2) return false;
    return !!db()
      .prepare(
        "SELECT 1 FROM relationships r JOIN software a ON a.slug=r.from_slug JOIN software b ON b.slug=r.to_slug WHERE r.comparison=1 AND a.published=1 AND b.published=1 AND ((r.from_slug=? AND r.to_slug=?) OR (r.from_slug=? AND r.to_slug=?))",
      )
      .get(pair[0], pair[1], pair[1], pair[0]);
  }
  if (!["software", "alternatives"].includes(type)) return false;
  if (
    !db()
      .prepare("SELECT 1 FROM software WHERE slug=? AND published=1")
      .get(slug)
  )
    return false;
  if (!filter) return true;
  return (
    type === "alternatives" &&
    !!db()
      .prepare(
        "SELECT 1 FROM landings WHERE software=? AND filter=? AND published=1",
      )
      .get(slug, filter)
  );
}
export function referrerDomain(value: string | undefined) {
  if (!value) return "Direct";
  try {
    const url = new URL(value);
    const ownHost = new URL(process.env.SITE_URL ?? "http://localhost:3000")
      .hostname;
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.hostname === ownHost ||
      isIP(url.hostname) ||
      url.hostname.includes(":")
    )
      return "Direct";
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}
export function pruneAnalytics(now = new Date()) {
  const d = db();
  const today = dayOf(now);
  const previous = d
    .prepare("SELECT value FROM analytics_state WHERE key='cleanup'")
    .get() as { value: string } | undefined;
  if (previous?.value === today) return;
  d.transaction(() => {
    d.prepare("DELETE FROM analytics_events WHERE day < ?").run(
      earliestDay(now),
    );
    d.prepare(
      "INSERT INTO analytics_state VALUES('cleanup',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
    ).run(today);
  })();
}
export function recordEvent(
  raw: AnalyticsInput,
  visitor: string,
  session: string,
  now = new Date(),
) {
  const input = analyticsInputSchema.parse(raw);
  if (!publicAnalyticsPath(input.path)) return false;
  if (
    input.slug &&
    !db()
      .prepare("SELECT 1 FROM software WHERE slug=? AND published=1")
      .get(input.slug)
  )
    return false;
  pruneAnalytics(now);
  const metadata = {
    ...(input.results !== undefined ? { results: input.results } : {}),
    ...(input.filter ? { filter: input.filter, enabled: input.enabled } : {}),
  };
  const derivedSlug = input.path.startsWith("/software/")
    ? input.path.split("/")[2]
    : null;
  const result = db()
    .prepare(
      "INSERT OR IGNORE INTO analytics_events(occurred_at,day,visitor_hash,event,path,slug,query,metadata,event_id,session_hash,referrer,device) VALUES(?,?,?,?,?,?,NULL,?,?,?,?,?)",
    )
    .run(
      now.toISOString(),
      dayOf(now),
      visitorHash(visitor),
      input.name,
      input.path,
      input.slug ?? derivedSlug,
      JSON.stringify(metadata),
      input.id,
      visitorHash(session),
      referrerDomain(input.referrer),
      input.device ?? "unknown",
    );
  if (result.changes)
    db()
      .prepare("INSERT OR IGNORE INTO analytics_state VALUES('started_at',?)")
      .run(now.toISOString());
  return !!result.changes;
}

export type AnalyticsOptions = {
  range?: string;
  from?: string;
  to?: string;
  group?: string;
};
export function analyticsWindow(options: AnalyticsOptions, now = new Date()) {
  const range = options.range ?? "month";
  if (!["day", "week", "month", "all", "custom"].includes(range))
    throw new Error("Invalid period");
  const group = options.group ?? "day";
  if (!["day", "week", "month"].includes(group))
    throw new Error("Invalid grouping");
  const to = range === "custom" ? z.iso.date().parse(options.to) : dayOf(now);
  const from =
    range === "custom"
      ? z.iso.date().parse(options.from)
      : addDays(
          to,
          1 -
            (range === "day"
              ? 1
              : range === "week"
                ? 7
                : range === "month"
                  ? 30
                  : retentionDays),
        );
  if (from > to || to > dayOf(now) || from < earliestDay(now))
    throw new Error("Choose dates within the last 180 days");
  return { range, from, to, group: group as "day" | "week" | "month" };
}
function bucket(day: string, group: "day" | "week" | "month") {
  if (group === "month") return day.slice(0, 7) + "-01";
  if (group === "week")
    return addDays(day, -((new Date(day).getUTCDay() + 6) % 7));
  return day;
}
export function analyticsSummary(
  options: AnalyticsOptions = {},
  now = new Date(),
) {
  pruneAnalytics(now);
  const window = analyticsWindow(options, now);
  const d = db();
  const args = [window.from, window.to];
  const totals = d
    .prepare(
      `SELECT
    COUNT(DISTINCT visitor_hash) visitors,
    COUNT(DISTINCT session_hash) sessions,
    COUNT(CASE WHEN event='page_view' THEN 1 END) pageViews,
    COUNT(CASE WHEN event='search' THEN 1 END) searches,
    COUNT(CASE WHEN event='search' AND json_extract(metadata,'$.results')=0 THEN 1 END) noResultSearches,
    COUNT(CASE WHEN event='match_completed' THEN 1 END) matches,
    COUNT(CASE WHEN event='match_completed' AND json_extract(metadata,'$.results')=0 THEN 1 END) noResultMatches,
    COUNT(CASE WHEN event IN ('external_website_click','affiliate_click') THEN 1 END) outbound,
    COUNT(CASE WHEN event='affiliate_click' THEN 1 END) affiliate,
    COUNT(CASE WHEN event='page_view' AND path LIKE '/compare/%' THEN 1 END) comparisons
    FROM analytics_events WHERE day BETWEEN ? AND ?`,
    )
    .get(...args) as Record<
    | "visitors"
    | "sessions"
    | "pageViews"
    | "searches"
    | "noResultSearches"
    | "matches"
    | "noResultMatches"
    | "outbound"
    | "affiliate"
    | "comparisons",
    number
  >;
  const top = (sql: string) =>
    d.prepare(sql).all(...args) as Array<{ label: string; count: number }>;
  const bucketSQL =
    window.group === "month"
      ? "substr(day,1,7)||'-01'"
      : window.group === "week"
        ? "date(day,'-'||((CAST(strftime('%w',day) AS INTEGER)+6)%7)||' days')"
        : "day";
  const rows = d
    .prepare(
      `SELECT ${bucketSQL} label, COUNT(CASE WHEN event='page_view' THEN 1 END) pageViews, COUNT(DISTINCT visitor_hash) visitors, COUNT(DISTINCT session_hash) sessions FROM analytics_events WHERE day BETWEEN ? AND ? GROUP BY label ORDER BY label`,
    )
    .all(...args) as Array<{
    label: string;
    pageViews: number;
    visitors: number;
    sessions: number;
  }>;
  const labels = new Set<string>();
  for (let day = window.from; day <= window.to; day = addDays(day, 1))
    labels.add(bucket(day, window.group));
  const trend = [...labels].map(
    (label) =>
      rows.find((row) => row.label === label) ?? {
        label,
        visitors: 0,
        sessions: 0,
        pageViews: 0,
      },
  );
  const started = d
    .prepare("SELECT value FROM analytics_state WHERE key='started_at'")
    .get() as { value: string } | undefined;
  return {
    ...window,
    totals,
    trend,
    startedAt: started?.value ?? null,
    retentionDays,
    topSearched: top(
      "SELECT COALESCE(s.name,e.slug) label,COUNT(*) count FROM analytics_events e LEFT JOIN software s ON s.slug=e.slug WHERE e.day BETWEEN ? AND ? AND e.event='search' AND e.slug IS NOT NULL GROUP BY e.slug ORDER BY count DESC,label LIMIT 15",
    ),
    topViewed: top(
      "SELECT COALESCE(s.name,e.slug) label,COUNT(*) count FROM analytics_events e LEFT JOIN software s ON s.slug=e.slug WHERE e.day BETWEEN ? AND ? AND e.event='page_view' AND e.path LIKE '/software/%' GROUP BY e.slug ORDER BY count DESC,label LIMIT 15",
    ),
    pages: top(
      "SELECT path label,COUNT(*) count FROM analytics_events WHERE day BETWEEN ? AND ? AND event='page_view' GROUP BY path ORDER BY count DESC,path LIMIT 15",
    ),
    filters: top(
      "SELECT json_extract(metadata,'$.filter') label,COUNT(*) count FROM analytics_events WHERE day BETWEEN ? AND ? AND event='filter_used' AND json_extract(metadata,'$.enabled')=1 GROUP BY label ORDER BY count DESC,label LIMIT 15",
    ),
    outboundTools: top(
      "SELECT COALESCE(s.name,e.slug) label,COUNT(*) count FROM analytics_events e LEFT JOIN software s ON s.slug=e.slug WHERE e.day BETWEEN ? AND ? AND e.event IN ('external_website_click','affiliate_click') GROUP BY e.slug ORDER BY count DESC,label LIMIT 15",
    ),
    referrers: top(
      "SELECT referrer label,COUNT(*) count FROM analytics_events WHERE id IN (SELECT MIN(id) FROM analytics_events WHERE day BETWEEN ? AND ? GROUP BY session_hash) GROUP BY referrer ORDER BY count DESC,label LIMIT 15",
    ),
    devices: top(
      "SELECT device label,COUNT(*) count FROM analytics_events WHERE id IN (SELECT MIN(id) FROM analytics_events WHERE day BETWEEN ? AND ? GROUP BY session_hash) GROUP BY device ORDER BY count DESC,label",
    ),
  };
}
export type AnalyticsSummary = ReturnType<typeof analyticsSummary>;
export function analyticsCsv(data: AnalyticsSummary) {
  const cell = (value: string | number) => {
    const text = String(value);
    return (
      '"' +
      (/^[=+@\-\t\r]/.test(text) ? "'" : "") +
      text.replaceAll('"', '""') +
      '"'
    );
  };
  const rows: Array<Array<string | number>> = [
    ["section", "label", "value", "sessions", "page_views"],
    ["period", data.from, data.to],
    ...Object.entries(data.totals).map(([key, value]) => ["total", key, value]),
    ...data.trend.map((row) => [
      "trend",
      row.label,
      row.visitors,
      row.sessions,
      row.pageViews,
    ]),
  ];
  for (const key of [
    "topSearched",
    "topViewed",
    "pages",
    "filters",
    "outboundTools",
    "referrers",
    "devices",
  ] as const)
    for (const row of data[key]) rows.push([key, row.label, row.count]);
  return rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
