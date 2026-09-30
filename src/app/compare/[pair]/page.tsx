import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { getSoftware, relations } from "@/lib/repository";
import { comparisonSlug } from "@/lib/discovery";
import { Breadcrumbs, ComparisonTable, ProsCons } from "@/components/ui";
import { PageEvent } from "@/components/analytics";
import { metadata as meta } from "@/lib/seo";
type Props = { params: Promise<{ pair: string }> };
function data(pair: string) {
  const [a, b, ...rest] = pair.split("-vs-");
  if (rest.length || !a || !b) return null;
  const relation = relations().find(
    (r) =>
      r.comparison &&
      ((r.from === a && r.to === b) || (r.from === b && r.to === a)),
  );
  const left = getSoftware(a),
    right = getSoftware(b);
  return relation && left && right
    ? { left, right, relation, canonical: comparisonSlug(a, b) }
    : null;
}
export async function generateMetadata({ params }: Props) {
  const d = data((await params).pair);
  return d
    ? meta(
        d.left.name + " vs " + d.right.name,
        d.relation.reason,
        "/compare/" + d.canonical,
      )
    : meta(
        "Comparison not found",
        "This comparison is not available.",
        "/compare",
        true,
      );
}
export default async function Comparison({ params }: Props) {
  const pair = (await params).pair;
  const d = data(pair);
  if (!d) notFound();
  if (pair !== d.canonical) permanentRedirect("/compare/" + d.canonical);
  return (
    <div className="container page-content">
      <Breadcrumbs
        items={[
          { label: "Compare", href: "/compare" },
          {
            label: d.left.name + " vs " + d.right.name,
            href: "/compare/" + pair,
          },
        ]}
      />
      <div className="page-intro">
        <span className="eyebrow">A CLOSER LOOK</span>
        <h1>
          {d.left.name} vs {d.right.name}
        </h1>
        <p>{d.relation.reason}</p>
        <p className="small">
          Unknown fields are not negative results. Prices reflect the documented
          plan and billing terms.
        </p>
      </div>
      <ComparisonTable items={[d.left, d.right]} />
      {[d.left, d.right].map((s) => (
        <section key={s.slug}>
          <h2>{s.name}: the trade-offs</h2>
          <p>{s.shortDescription}</p>
          <ProsCons s={s} />
          <p>
            <Link href={"/software/" + s.slug + "#sources"}>
              Check {s.name} sources and pricing terms ↗
            </Link>
          </p>
        </section>
      ))}
      <PageEvent name="comparison_view" slug={pair} />
    </div>
  );
}
