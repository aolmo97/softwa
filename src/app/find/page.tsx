import { catalogue, taxonomy } from "@/lib/repository";
import { Matcher } from "@/components/matcher";
import { Breadcrumbs } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Find my alternative",
  "Get software recommendations based on your budget, platform and priorities.",
  "/find",
  true,
);
export default async function Find({
  searchParams,
}: {
  searchParams: Promise<{ current?: string }>;
}) {
  const all = catalogue();
  const current = (await searchParams).current ?? "";
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: "Find my alternative", href: "/find" }]} />
      <div className="page-intro">
        <span className="eyebrow">BUILT AROUND YOUR NEEDS</span>
        <h1>Let’s find your fit.</h1>
        <p>
          Your budget. Your platform. Your non-negotiables. Get an explainable
          match from published product data.
        </p>
      </div>
      <Matcher
        items={all}
        features={taxonomy("features")}
        initial={all.some((s) => s.slug === current) ? current : ""}
      />
    </div>
  );
}
