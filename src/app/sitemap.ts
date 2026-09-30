import type { MetadataRoute } from "next";
import { catalogue, taxonomy, relations, landings } from "@/lib/repository";
import {
  alternativeCandidates,
  indexableLanding,
  comparisonSlug,
} from "@/lib/discovery";
import { siteUrl } from "@/lib/seo";
import { operatorDetailsComplete } from "@/lib/legal";
import { guides } from "@/lib/guides";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  const all = catalogue();
  const rel = relations();
  const paths = [
    "/",
    "/software",
    "/categories",
    "/compare",
    "/about",
    "/methodology",
    "/guides",
    ...guides.map((g) => "/guides/" + g.slug),
    ...(operatorDetailsComplete()
      ? ["/privacy", "/cookies", "/terms", "/contact"]
      : []),
    ...all.flatMap((s) => ["/software/" + s.slug, "/alternatives/" + s.slug]),
    ...taxonomy("categories")
      .filter((c) => all.some((s) => s.categories.includes(c.slug)))
      .map((c) => "/categories/" + c.slug),
    ...rel
      .filter(
        (r) =>
          r.comparison &&
          all.some((s) => s.slug === r.from) &&
          all.some((s) => s.slug === r.to),
      )
      .map((r) => "/compare/" + comparisonSlug(r.from, r.to)),
    ...landings()
      .filter(
        (l) =>
          all.some((s) => s.slug === l.software) &&
          indexableLanding(l, alternativeCandidates(l.software, all, rel)),
      )
      .map((l) => "/alternatives/" + l.software + "/" + l.filter),
  ];
  return [...new Set(paths)].map((path) => ({
    url: siteUrl() + path,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
