import { describe, it, expect } from "vitest";
import {
  ADDITIONS_REVIEWED_ON,
  additionProducts,
  additionRelations,
} from "../src/lib/catalogue-additions";
import { seedProducts } from "../src/lib/seed";
import { softwareSchema } from "../src/lib/model";

const added = additionProducts();
const all = seedProducts();
const slugs = new Set(all.map((p) => p.slug));

describe("catalogue additions", () => {
  it("validate and use their real consultation date", () => {
    expect(added).toHaveLength(15);
    for (const p of added) {
      expect(softwareSchema.safeParse(p).success, p.slug).toBe(true);
      for (const s of p.sources) {
        expect(s.accessedAt, p.slug).toBe(ADDITIONS_REVIEWED_ON);
        expect(s.verifiedAt, p.slug).toBe(ADDITIONS_REVIEWED_ON);
        expect(s.url.startsWith("https://"), p.slug).toBe(true);
      }
    }
    // The earlier review date must never be reused for products reviewed later.
    expect(ADDITIONS_REVIEWED_ON > "2026-09-29").toBe(true);
  });
  it("have unique slugs that do not collide with existing products", () => {
    expect(new Set(all.map((p) => p.slug)).size).toBe(all.length);
  });
  it("relate to existing or added products and give every addition an alternative", () => {
    for (const [from, to, reason] of additionRelations) {
      expect(slugs.has(from), from).toBe(true);
      expect(slugs.has(to), to).toBe(true);
      expect(reason.length).toBeGreaterThanOrEqual(20);
    }
    for (const p of added)
      expect(
        additionRelations.some(([a, b]) => a === p.slug || b === p.slug),
        p.slug,
      ).toBe(true);
  });
  it("never invent unknown facts: unspecified prices and licences stay unknown", () => {
    const bySlug = Object.fromEntries(added.map((p) => [p.slug, p]));
    expect(bySlug["cinema-4d"].plans).toHaveLength(0);
    expect(bySlug["darktable"].pricingModel).toBe("unknown");
    expect(bySlug["shotcut"].license).toBeNull();
    for (const plan of bySlug["proton-pass"].plans.filter((x) => x.id !== "free"))
      expect(plan.amount).toBeNull();
    expect(bySlug["adobe-audition"].platforms).toHaveLength(0);
  });
});
