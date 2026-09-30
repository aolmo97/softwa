import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep, basename } from "node:path";
import { db, migrate, closeDb } from "../src/lib/db";
import { seed } from "../src/lib/seed";
import {
  catalogue,
  listResource,
  getSoftware,
  saveResource,
  ConflictError,
  history,
} from "../src/lib/repository";
import {
  passwordHash,
  verifyPassword,
  createSession,
  sessionFor,
  rateLimit,
  sameOrigin,
  readJson,
} from "../src/lib/auth";
import type { SoftwareInput } from "../src/lib/model";
const dir = mkdtempSync(join(tmpdir(), "software-alternative-test-"));
beforeAll(() => {
  process.env.DATABASE_PATH = join(dir, "test.sqlite");
  migrate();
  seed();
});
afterAll(() => {
  closeDb();
  if (
    !resolve(dir).startsWith(resolve(tmpdir()) + sep) ||
    !basename(dir).startsWith("software-alternative-test-")
  )
    throw new Error("Unsafe temporary cleanup path");
  rmSync(dir, { recursive: true, force: true });
});
describe("database and editorial validation", () => {
  it("applies migrations and seed idempotently", () => {
    migrate();
    seed();
    expect(catalogue()).toHaveLength(39);
    expect(db().prepare("SELECT COUNT(*) n FROM migrations").get()).toEqual({
      n: 3,
    });
    expect(db().pragma("foreign_key_check")).toEqual([]);
  });
  it("persists edits with before/after history and version protection", () => {
    const s = listResource("software").find(
      (s) => "slug" in s && s.slug === "gimp",
    ) as SoftwareInput;
    const updated = saveResource(
      "software",
      {
        ...s,
        shortDescription:
          "An edited, sourced description for the image editor.",
      },
      "test-editor",
    ) as SoftwareInput;
    expect(updated.version).toBe(s.version + 1);
    expect(getSoftware("gimp")?.shortDescription).toContain("edited");
    expect(() => saveResource("software", s, "test-editor")).toThrow(
      ConflictError,
    );
    expect(history()).toContainEqual(
      expect.objectContaining({ actor: "test-editor", record_id: "gimp" }),
    );
    seed();
    expect(getSoftware("gimp")?.shortDescription).toContain("edited");
  });
  it("rolls back invalid references atomically", () => {
    const s = listResource("software").find(
      (s) => "slug" in s && s.slug === "gimp",
    ) as SoftwareInput;
    expect(() =>
      saveResource("software", { ...s, categories: ["not-real"] }, "test"),
    ).toThrow();
    expect(getSoftware("gimp")?.version).toBe(s.version);
    expect(getSoftware("gimp")?.categories).toEqual(s.categories);
  });
  it("preserves data after reconnect", () => {
    closeDb();
    expect(catalogue()).toHaveLength(39);
  });
  it("enforces evidence and source dates before writes", () => {
    const s = listResource("software").find(
      (s) => "slug" in s && s.slug === "gimp",
    ) as SoftwareInput;
    expect(() =>
      saveResource(
        "software",
        { ...s, flags: { ...s.flags, aiFeatures: true } },
        "test",
      ),
    ).toThrow();
  });
  it("supports taxonomy, affiliate, landing and relationship management", () => {
    saveResource(
      "categories",
      {
        slug: "test-category",
        name: "Test category",
        description: "Editorial category",
      },
      "test",
    );
    expect(listResource("categories")).toContainEqual(
      expect.objectContaining({ slug: "test-category" }),
    );
    saveResource(
      "affiliates",
      {
        id: "gimp-partner",
        software: "gimp",
        url: "https://example.com/partner",
        provider: "Test",
        enabled: false,
        commissionNotes: "Test only",
      },
      "test",
    );
    expect(listResource("affiliates")).toHaveLength(1);
  });
});
describe("security", () => {
  it("salts password hashes and rejects incorrect passwords", () => {
    const a = passwordHash("long random test password");
    const b = passwordHash("long random test password");
    expect(a).not.toBe(b);
    expect(verifyPassword("long random test password", a)).toBe(true);
    expect(verifyPassword("wrong", a)).toBe(false);
    expect(verifyPassword("wrong", "bad")).toBe(false);
  });
  it("accepts only valid nonexpired opaque sessions", () => {
    db()
      .prepare("INSERT INTO admins VALUES(?,?,?)")
      .run(
        "test-admin",
        passwordHash("test password"),
        new Date().toISOString(),
      );
    const token = createSession("test-admin");
    expect(sessionFor(token)).toBe("test-admin");
    expect(sessionFor("fake")).toBeNull();
    expect(sessionFor(undefined)).toBeNull();
    db().prepare("UPDATE sessions SET expires_at=0").run();
    expect(sessionFor(token)).toBeNull();
  });
  it("persists rate limits and resets only after expiry", () => {
    const now = Date.now();
    expect(rateLimit("test-key", 2, 1000, now)).toBe(true);
    expect(rateLimit("test-key", 2, 1000, now)).toBe(true);
    closeDb();
    expect(rateLimit("test-key", 2, 1000, now)).toBe(false);
    expect(rateLimit("test-key", 2, 1000, now + 1001)).toBe(true);
  });
  it("denies cross-origin and missing-origin mutations", () => {
    process.env.SITE_URL = "http://localhost:3000";
    expect(
      sameOrigin(
        new Request("http://localhost:3000/api", {
          headers: { origin: "https://evil.test" },
        }),
      ),
    ).toBe(false);
    expect(sameOrigin(new Request("http://localhost:3000/api"))).toBe(false);
    expect(
      sameOrigin(
        new Request("http://localhost:3000/api", {
          headers: { origin: "http://localhost:3000" },
        }),
      ),
    ).toBe(true);
  });
  it("limits streaming bodies and rejects bad formats", async () => {
    await expect(
      readJson(
        new Request("http://localhost", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ large: "a".repeat(100) }),
        }),
        20,
      ),
    ).rejects.toThrow("Request too large");
    await expect(
      readJson(new Request("http://localhost", { method: "POST", body: "{}" })),
    ).rejects.toThrow();
  });
});
