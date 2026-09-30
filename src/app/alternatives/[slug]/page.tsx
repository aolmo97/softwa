import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogue, getSoftware, relations, landings } from "@/lib/repository";
import {
  alternativeCandidates,
  comparisonSlug,
  indexableAlternatives,
  parseFilters,
  indexableLanding,
} from "@/lib/discovery";
import { metadata as meta, itemList } from "@/lib/seo";
import { Breadcrumbs, JsonLd, AffiliateDisclosure } from "@/components/ui";
import { AlternativesExplorer } from "@/components/alternatives";
import { AlternativesGuide } from "@/components/alternatives-guide";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const s = getSoftware((await params).slug);
  const count = s
    ? alternativeCandidates(s.slug, catalogue(), relations()).length
    : 0;
  return s
    ? meta(
        s.name + " alternatives",
        "Compare alternatives to " +
          s.name +
          " by verified features, price, platform and licensing.",
        "/alternatives/" + s.slug,
        Object.keys(await searchParams).length > 0 ||
          !indexableAlternatives(count),
      )
    : meta("Not found", "Software not found.", "/software", true);
}
export default async function Alternatives({ params, searchParams }: Props) {
  const s = getSoftware((await params).slug);
  if (!s) notFound();
  const rel = relations();
  const items = alternativeCandidates(s.slug, catalogue(), rel);
  const reasons = Object.fromEntries(
    items.map((a) => [
      a.slug,
      rel.find(
        (r) =>
          (r.from === s.slug && r.to === a.slug) ||
          (r.to === s.slug && r.from === a.slug),
      )?.reason ?? "",
    ]),
  );
  const comparisons = rel
    .filter((r) => r.comparison && (r.from === s.slug || r.to === s.slug))
    .flatMap((r) => {
      const other = catalogue().find(
        (x) => x.slug === (r.from === s.slug ? r.to : r.from),
      );
      return other
        ? [
            {
              slug: comparisonSlug(r.from, r.to),
              label: s.name + " vs " + other.name,
            },
          ]
        : [];
    });
  const editorial = landings().filter(
    (l) => l.software === s.slug && indexableLanding(l, items),
  );
  return (
    <div className="container page-content">
      <Breadcrumbs
        items={[
          { label: s.name, href: "/software/" + s.slug },
          { label: "Alternatives", href: "/alternatives/" + s.slug },
        ]}
      />
      <div className="page-intro">
        <span className="eyebrow">EXPLORE YOUR OPTIONS</span>
        <h1>{s.name} alternatives</h1>
        <p>
          Find a different way to work. Compare relevant tools, then narrow the
          list to what matters to you.
        </p>
        <Link className="text-link" href={"/find?current=" + s.slug}>
          Get a personalized match ↗
        </Link>
        {editorial.map((l) => (
          <p key={l.id}>
            <Link href={"/alternatives/" + s.slug + "/" + l.filter}>
              {l.title} ↗
            </Link>
          </p>
        ))}
      </div>
      <AlternativesExplorer
        original={s}
        items={items}
        reasons={reasons}
        initial={parseFilters((await searchParams).filters)}
      />
      <AlternativesGuide original={s} items={items} comparisons={comparisons} />
      <AffiliateDisclosure />
      <JsonLd value={itemList(items)} />
    </div>
  );
}
