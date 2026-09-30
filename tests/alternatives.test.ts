import { describe, it, expect } from "vitest";
import {
  alternativeInsights,
  indexableAlternatives,
  minIndexableAlternatives,
} from "../src/lib/discovery";
import { guideForCategories } from "../src/lib/guides";
import { seedProducts } from "../src/lib/seed";

const products = seedProducts();
const by = (slug: string) => products.find((p) => p.slug === slug)!;

describe("alternatives pages", () => {
  it("are only offered to search engines with at least two candidates", () => {
    expect(minIndexableAlternatives).toBe(2);
    expect(indexableAlternatives(0)).toBe(false);
    expect(indexableAlternatives(1)).toBe(false);
    expect(indexableAlternatives(2)).toBe(true);
  });
  it("group only verified facts and list unverified platforms separately", () => {
    const { groups, unverifiedPlatforms } = alternativeInsights([
      by("gimp"),
      by("krita"),
      by("canva"),
    ]);
    const free = groups.find((g) => g.label === "Free entry option");
    expect(free?.names).toEqual(expect.arrayContaining(["GIMP", "Krita"]));
    expect(groups.find((g) => g.label === "Open source")?.names).toContain(
      "GIMP",
    );
    // Canva has no verified platforms, so it must not appear under any OS.
    for (const label of ["Windows", "macOS", "Linux", "Web"])
      expect(groups.find((g) => g.label === label)?.names ?? []).not.toContain(
        "Canva",
      );
    expect(unverifiedPlatforms).toContain("Canva");
  });
  it("maps categories to a relevant guide with a sensible fallback", () => {
    expect(guideForCategories(["photo-editing"])?.slug).toBe(
      "switching-from-photoshop",
    );
    expect(guideForCategories(["analytics"])?.slug).toBe(
      "how-to-evaluate-a-software-alternative",
    );
  });
});
