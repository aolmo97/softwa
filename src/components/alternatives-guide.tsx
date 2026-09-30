import Link from "next/link";
import type { SoftwareInput } from "@/lib/model";
import { alternativeInsights } from "@/lib/discovery";
import { guideForCategories } from "@/lib/guides";
export function AlternativesGuide({
  original,
  items,
  comparisons,
}: {
  original: SoftwareInput;
  items: SoftwareInput[];
  comparisons: { slug: string; label: string }[];
}) {
  const insights = alternativeInsights(items);
  const guide = guideForCategories(original.categories);
  return (
    <section className="prose" aria-label={"Choosing an alternative to " + original.name}>
      <h2>Choosing an alternative to {original.name}</h2>
      <p>
        These points are drawn only from the verified records in our catalogue.
        A product missing from a list is not necessarily unsupported: it may
        simply not have verified data for that point yet.
      </p>
      {insights.groups.length > 0 && (
        <>
          <h3>What the verified data shows</h3>
          <ul>
            {insights.groups.map((g) => (
              <li key={g.label}>
                <strong>{g.label}:</strong> {g.names.join(", ")}
              </li>
            ))}
          </ul>
        </>
      )}
      {insights.unverifiedPlatforms.length > 0 && (
        <p>
          Platform support is not yet verified for{" "}
          {insights.unverifiedPlatforms.join(", ")}; check the vendor before
          relying on it.
        </p>
      )}
      {original.cons.length > 0 && (
        <>
          <h3>Before you switch from {original.name}</h3>
          <p>
            Points recorded from its official sources that are worth checking
            against your own workflow:
          </p>
          <ul>
            {original.cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}
      {comparisons.length > 0 && (
        <>
          <h3>Side-by-side comparisons</h3>
          <ul>
            {comparisons.map((c) => (
              <li key={c.slug}>
                <Link href={"/compare/" + c.slug}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {guide && (
        <p>
          Related guide: <Link href={"/guides/" + guide.slug}>{guide.title}</Link>
        </p>
      )}
    </section>
  );
}
