import { describe, it, expect } from "vitest";
import { guides, guideWordCount } from "../src/lib/guides";
import { categoryNotes } from "../src/lib/category-notes";
import { seedProducts } from "../src/lib/seed";

const products = seedProducts();
const slugs = new Set(products.map((p) => p.slug));
const categorySlugs = new Set(products.flatMap((p) => p.categories));

describe("editorial guides", () => {
  it("have unique slugs, dates and enough original text", () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
    for (const g of guides) {
      expect(g.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(g.description.length).toBeGreaterThan(60);
      expect(g.description.length).toBeLessThanOrEqual(200);
      expect(guideWordCount(g), g.slug).toBeGreaterThanOrEqual(800);
    }
  });
  it("only reference catalogue products, comparisons and categories", () => {
    for (const g of guides) {
      for (const s of g.software) expect(slugs.has(s), g.slug + ":" + s).toBe(true);
      for (const pair of g.compare) {
        const [a, b] = pair.split("-vs-");
        expect(slugs.has(a) && slugs.has(b), g.slug + ":" + pair).toBe(true);
      }
      for (const c of g.categories)
        expect(categorySlugs.has(c), g.slug + ":" + c).toBe(true);
    }
  });
  it("have a buying note for every active category", () => {
    for (const c of categorySlugs) expect(categoryNotes[c], c).toBeDefined();
  });
});
