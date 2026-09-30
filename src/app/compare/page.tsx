import Link from "next/link";
import { catalogue, relations } from "@/lib/repository";
import { comparisonSlug } from "@/lib/discovery";
import { Breadcrumbs, Mark } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Software comparisons",
  "Meaningful software comparisons with sourced facts and transparent unknowns.",
  "/compare",
);
export default function Comparisons() {
  const all = catalogue();
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: "Comparisons", href: "/compare" }]} />
      <div className="page-intro">
        <h1>Make the differences clear.</h1>
        <p>Relevant pairs. Comparable facts. No universal winner.</p>
      </div>
      <div className="comparison-grid">
        {relations()
          .filter((r) => r.comparison)
          .map((r) => {
            const a = all.find((s) => s.slug === r.from),
              b = all.find((s) => s.slug === r.to);
            return a && b ? (
              <Link
                className="comparison-card"
                href={"/compare/" + comparisonSlug(a.slug, b.slug)}
                key={r.id}
              >
                <div>
                  <Mark s={a} />
                  <span className="versus">vs</span>
                  <Mark s={b} />
                </div>
                <h2 style={{ fontSize: 18 }}>
                  {a.name} vs {b.name}
                </h2>
                <p>{r.reason}</p>
                <span className="text-link">Compare the details ↗</span>
              </Link>
            ) : null;
          })}
      </div>
    </div>
  );
}
