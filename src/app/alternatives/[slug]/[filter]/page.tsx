import { notFound } from "next/navigation";
import { catalogue, getSoftware, relations, landings } from "@/lib/repository";
import {
  alternativeCandidates,
  filterSoftware,
  indexableLanding,
} from "@/lib/discovery";
import { metadata as meta, itemList } from "@/lib/seo";
import {
  Breadcrumbs,
  SoftwareCard,
  ComparisonTable,
  JsonLd,
} from "@/components/ui";
type Props = {
  params: Promise<{ slug: string; filter: string }>;
  searchParams: Promise<Record<string, string>>;
};
function data(slug: string, filter: string) {
  const s = getSoftware(slug);
  const l = landings().find((l) => l.software === slug && l.filter === filter);
  if (!s || !l) return null;
  const candidates = alternativeCandidates(slug, catalogue(), relations());
  if (!indexableLanding(l, candidates)) return null;
  return { s, l, items: filterSoftware(candidates, [l.filter]) };
}
export async function generateMetadata({ params, searchParams }: Props) {
  const p = await params;
  const d = data(p.slug, p.filter);
  return d
    ? meta(
        d.l.title,
        d.l.intro.slice(0, 160),
        "/alternatives/" + p.slug + "/" + p.filter,
        Object.keys(await searchParams).length > 0,
      )
    : meta(
        "Not found",
        "This editorial guide is not available.",
        "/software",
        true,
      );
}
export default async function Landing({ params }: Props) {
  const p = await params;
  const d = data(p.slug, p.filter);
  if (!d) notFound();
  return (
    <div className="container page-content">
      <Breadcrumbs
        items={[
          {
            label: d.s.name + " alternatives",
            href: "/alternatives/" + p.slug,
          },
          {
            label: d.l.filter,
            href: "/alternatives/" + p.slug + "/" + p.filter,
          },
        ]}
      />
      <div className="page-intro">
        <span className="eyebrow">THE FOCUSED GUIDE</span>
        <h1>{d.l.title}</h1>
        <p>{d.l.intro}</p>
      </div>
      <div className="software-grid">
        {d.items.map((s) => (
          <SoftwareCard key={s.slug} s={s} />
        ))}
      </div>
      <section className="prose">
        <h2>Choose by workflow</h2>
        <p>{d.l.guidance}</p>
      </section>
      <ComparisonTable items={d.items} />
      <JsonLd value={itemList(d.items)} />
    </div>
  );
}
