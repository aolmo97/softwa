import { describe, it, expect } from "vitest";
import { seedProducts } from "../src/lib/seed";
import {
  score,
  evaluate,
  recommend,
  search,
  filterSoftware,
  parseFilters,
  matchesFilter,
  alternativeCandidates,
  indexableLanding,
  comparisonSlug,
  matchRequestSchema,
  type Criterion,
} from "../src/lib/discovery";
import {
  softwareSchema,
  slugSchema,
  slugify,
  flags,
  type Landing,
} from "../src/lib/model";
import { jsonLd, metadata, softwareJson } from "../src/lib/seo";
const products = seedProducts();
const gimp = products.find((s) => s.slug === "gimp")!;
const flag = (
  key: string,
  value = true,
  hard = false,
  weight = 1,
): Criterion => ({ kind: "flag", key, value, hard, weight });
const copy = () => structuredClone(gimp);
describe("reproducible matching", () => {
  it("awards full weight for verified matches", () => {
    expect(score(gimp, [flag("freePlan"), flag("openSource")])).toMatchObject({
      score: 100,
      coverage: 100,
      eligible: true,
    });
  });
  it("does not satisfy hard requirements with unknown data", () => {
    expect(score(gimp, [flag("offlineSupport", true, true)])).toMatchObject({
      eligible: false,
      score: 0,
      coverage: 0,
    });
  });
  it("rejects verified hard mismatches", () => {
    const s = copy();
    s.flags.offlineSupport = false;
    expect(score(s, [flag("offlineSupport", true, true)]).eligible).toBe(false);
  });
  it("applies weighted mismatch penalties", () => {
    const s = copy();
    s.flags.aiFeatures = false;
    const r = score(s, [
      flag("freePlan", true, false, 3),
      flag("aiFeatures", true, false, 1),
    ]);
    expect(r.score).toBe(69);
    expect(r.factors[1]).toMatchObject({ earned: 0, penalty: 0.25 });
  });
  it("does not inflate scores by ignoring unknowns", () => {
    expect(
      score(gimp, [flag("freePlan"), flag("offlineSupport")]),
    ).toMatchObject({ score: 50, coverage: 50 });
  });
  it("matches negative preferences only with known false data", () => {
    const s = copy();
    s.flags.aiFeatures = false;
    expect(score(s, [flag("aiFeatures", false)]).score).toBe(100);
    expect(score(gimp, [flag("aiFeatures", false)]).score).toBe(0);
  });
  it("returns no score when no requirements are selected", () =>
    expect(score(gimp, []).score).toBeNull());
  it("excludes unknown platforms and missing features when mandatory", () => {
    for (const kind of ["platform", "feature"] as const)
      expect(
        score(gimp, [
          { kind, key: "missing", value: "missing", weight: 1, hard: true },
        ]).eligible,
      ).toBe(false);
  });
  it("matches a verified platform", () =>
    expect(
      score(gimp, [
        {
          kind: "platform",
          key: "linux",
          value: "linux",
          weight: 2,
          hard: true,
        },
      ]).score,
    ).toBe(100));
  it("normalizes annual USD budgets and leaves unsupported currencies unknown", () => {
    const s = copy();
    s.flags.freePlan = false;
    s.plans = [
      {
        id: "annual",
        name: "Annual",
        amount: 120,
        currency: "USD",
        period: "year",
        notes: "",
      },
    ];
    const c: Criterion = {
      kind: "budget",
      key: "USD",
      value: 10,
      weight: 2,
      hard: true,
    };
    expect(evaluate(s, c).state).toBe("met");
    expect(evaluate(s, { ...c, value: 9 }).state).toBe("unmet");
    s.plans[0].currency = "EUR";
    expect(evaluate(s, c).state).toBe("unknown");
    s.plans[0].currency = "USD";
    s.plans[0].period = "one-time";
    expect(evaluate(s, c).state).toBe("unknown");
  });
  it("treats a free entry option as a zero monthly cost", () =>
    expect(
      evaluate(gimp, {
        kind: "budget",
        key: "USD",
        value: 0,
        weight: 1,
        hard: true,
      }).state,
    ).toBe("met"));
  it("handles payment model requirements", () => {
    expect(
      evaluate(gimp, {
        kind: "pricing",
        key: "payment",
        value: "no-subscription",
        weight: 1,
        hard: true,
      }).state,
    ).toBe("met");
    expect(
      evaluate(gimp, {
        kind: "pricing",
        key: "payment",
        value: "subscription",
        weight: 1,
        hard: true,
      }).state,
    ).toBe("unmet");
  });
  it("is independent of sponsored, premium and input order", () => {
    const list = [
      copy(),
      { ...copy(), slug: "aaa", sponsored: true, premium: true },
    ];
    expect(
      recommend(list, [flag("freePlan")]).map((r) => r.software.slug),
    ).toEqual(["aaa", "gimp"]);
    expect(
      recommend(list.reverse(), [flag("freePlan")]).map((r) => r.software.slug),
    ).toEqual(["aaa", "gimp"]);
  });
  it("has bounded scores and reconstructible factors for every state combination", () => {
    for (const a of [true, false, null])
      for (const b of [true, false, null])
        for (const weight of [1, 2, 10]) {
          const s = copy();
          s.flags.freePlan = a;
          s.flags.openSource = b;
          const r = score(s, [
            flag("freePlan", true, false, weight),
            flag("openSource"),
          ]);
          const earned = r.factors.reduce(
            (n, f) => n + f.earned - f.penalty,
            0,
          );
          expect(r.score).toBe(
            Math.max(0, Math.round((100 * earned) / (weight + 1))),
          );
          expect(r.score).toBeGreaterThanOrEqual(0);
          expect(r.score).toBeLessThanOrEqual(100);
        }
  });
  it("rejects repeated requirements even when their client keys differ", () => {
    for (const kind of ["platform", "feature", "pricing"] as const) {
      const value =
        kind === "platform"
          ? "linux"
          : kind === "feature"
            ? "notes"
            : "one-time";
      const criterion: Criterion = {
        kind,
        key: "first",
        value,
        hard: false,
        weight: 1,
      };
      expect(
        matchRequestSchema.safeParse({
          current: "gimp",
          criteria: [criterion, { ...criterion, key: "second", weight: 10 }],
        }).success,
      ).toBe(false);
    }
    expect(
      matchRequestSchema.safeParse({
        current: "gimp",
        criteria: [
          {
            kind: "feature",
            key: "first",
            value: "notes",
            hard: false,
            weight: 1,
          },
          {
            kind: "feature",
            key: "second",
            value: "markdown",
            hard: false,
            weight: 2,
          },
        ],
      }).success,
    ).toBe(true);
  });
  it("rejects malformed, infinite, duplicate and unsupported requirements", () => {
    for (const c of [
      { ...flag("freePlan"), weight: -1 },
      { ...flag("freePlan"), weight: Infinity },
      { ...flag("freePlan"), key: "invented" },
      { ...flag("freePlan"), value: "true" },
    ])
      expect(
        matchRequestSchema.safeParse({ current: "gimp", criteria: [c] })
          .success,
      ).toBe(false);
    expect(
      matchRequestSchema.safeParse({
        current: "gimp",
        criteria: [flag("freePlan"), flag("freePlan")],
      }).success,
    ).toBe(false);
  });
});
describe("search", () => {
  it.each([
    ["photosop", "photoshop"],
    ["premiere", "premiere-pro"],
    ["vs code", "visual-studio-code"],
    ["GNU Image Manipulation Program", "gimp"],
    ["OBSIdian", "obsidian"],
  ])("finds %s", (q, slug) => expect(search(products, q)[0].slug).toBe(slug));
  it("returns no arbitrary fuzzy matches", () =>
    expect(search(products, "zqxvblah")).toEqual([]));
  it("orders exact matches before partial", () =>
    expect(search(products, "Krita")[0].slug).toBe("krita"));
  it("bounds huge input", () =>
    expect(search(products, "z".repeat(10000))).toEqual([]));
});
describe("filters and editorial relationships", () => {
  it("combines filters with AND", () => {
    const r = filterSoftware(products, ["free", "linux", "open-source"]);
    expect(r.some((s) => s.slug === "gimp")).toBe(true);
    expect(r.some((s) => s.slug === "canva")).toBe(false);
  });
  it("does not count unknown facts", () =>
    expect(matchesFilter(gimp, "offline")).toBe(false));
  it("deduplicates and ignores unsupported filter IDs", () =>
    expect(parseFilters("free,free,nope,linux")).toEqual(["free", "linux"]));
  it("only includes explicitly related published products", () => {
    const r = alternativeCandidates("photoshop", products, [
      {
        id: "r",
        from: "gimp",
        to: "photoshop",
        reason: "Photo editing workflow",
        comparison: true,
      },
    ]);
    expect(r.map((s) => s.slug)).toEqual(["gimp"]);
  });
  it("requires publication, content and three results to index a landing", () => {
    const l: Landing = {
      id: "test",
      software: "photoshop",
      filter: "free",
      title: "Free options",
      intro: "a".repeat(120),
      guidance: "b".repeat(120),
      published: true,
    };
    const eligible = products.filter((s) => s.flags.freePlan);
    expect(indexableLanding(l, eligible)).toBe(true);
    expect(indexableLanding(l, eligible.slice(0, 2))).toBe(false);
    expect(indexableLanding({ ...l, published: false }, eligible)).toBe(false);
    expect(indexableLanding({ ...l, intro: "thin" }, eligible)).toBe(false);
  });
});
describe("data and SEO", () => {
  it("validates all 39 seed records", () => {
    expect(products).toHaveLength(39);
    for (const s of products)
      expect(softwareSchema.safeParse(s).success, s.slug).toBe(true);
  });
  it("rejects unsupported claims, unsafe URLs, duplicates and invented future dates", () => {
    const s = copy();
    s.flags.selfHosted = true;
    expect(softwareSchema.safeParse(s).success).toBe(false);
    s.flags.selfHosted = null;
    s.website = "javascript:alert(1)";
    expect(softwareSchema.safeParse(s).success).toBe(false);
    s.website = gimp.website;
    s.categories.push(s.categories[0]);
    expect(softwareSchema.safeParse(s).success).toBe(false);
    s.categories = gimp.categories;
    s.sources[0].verifiedAt = "2099-01-01";
    expect(softwareSchema.safeParse(s).success).toBe(false);
  });
  it("requires evidence for billing periods even when the amount is unknown", () => {
    const s = copy();
    s.plans = [
      {
        id: "unverified-plan",
        name: "Pending plan",
        amount: null,
        currency: null,
        period: "unknown",
        notes: "Awaiting evidence.",
      },
    ];
    expect(softwareSchema.safeParse(s).success).toBe(true);
    for (const period of ["free", "month", "year", "one-time"] as const) {
      s.plans[0].period = period;
      expect(softwareSchema.safeParse(s).success, period).toBe(false);
    }
    s.sources[0].fields.push("plan:unverified-plan");
    expect(softwareSchema.safeParse(s).success).toBe(true);
    s.sources[0].status = "UNVERIFIED";
    expect(softwareSchema.safeParse(s).success).toBe(false);
  });
  it("preserves unknowns instead of inventing missing claims", () =>
    expect(flags.some((f) => gimp.flags[f] === null)).toBe(true));
  it("normalizes slugs and reserves comparison separators", () => {
    expect(slugify("Café Tool + Pro")).toBe("cafe-tool-pro");
    expect(slugSchema.safeParse("../etc").success).toBe(false);
    expect(slugSchema.safeParse("a-vs-b").success).toBe(false);
    expect(comparisonSlug("notion", "obsidian")).toBe(
      comparisonSlug("obsidian", "notion"),
    );
  });
  it("escapes script breakers in structured data", () => {
    const text = jsonLd({ name: "</script><script>alert(1)</script>" });
    expect(text).not.toContain("<");
    expect(JSON.parse(text).name).toContain("</script>");
  });
  it("sets canonical and noindex explicitly", () => {
    const m = metadata("Title", "Description", "/software", true);
    expect(m.alternates?.canonical).toContain("/software");
    expect(m.robots).toMatchObject({ index: false, follow: true });
  });
  it("does not invent reviews or offers in schema", () => {
    const data = softwareJson(gimp);
    expect(data["@type"]).toBe("SoftwareApplication");
    expect(data).not.toHaveProperty("aggregateRating");
    expect(data).not.toHaveProperty("offers");
  });
});
