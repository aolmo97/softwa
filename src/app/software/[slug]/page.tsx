import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogue, getSoftware, relations, affiliates, taxonomy } from "@/lib/repository";
import { alternativeCandidates } from "@/lib/discovery";
import { flags, pricing } from "@/lib/model";
import { metadata as meta, softwareJson } from "@/lib/seo";
import { Breadcrumbs, Mark, JsonLd, FeatureList, ProsCons, LastUpdated, SourceReference, AffiliateButton, AffiliateDisclosure, SoftwareCard, SponsoredBadge } from "@/components/ui";
import { PageEvent } from "@/components/analytics";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const s = getSoftware((await params).slug);
  return s ? meta(s.name + " — features, pricing & alternatives", s.shortDescription, "/software/" + s.slug)
    : meta("Software not found", "This software could not be found.", "/software", true);
}
export default async function SoftwarePage({ params }: Props) {
  const s = getSoftware((await params).slug);
  if (!s) notFound();
  const related = alternativeCandidates(s.slug, catalogue(), relations());
  const unknown = flags.filter((k) => s.flags[k] === null).length;
  const category = taxonomy("categories").find((c) => c.slug === s.categories[0]);
  const platforms = taxonomy("platforms");
  const features = taxonomy("features");
  const planEvidence = (id: string) => [...s.sources].reverse().find((source) => source.status === "VERIFIED" && source.fields.includes("plan:" + id));
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: "Software", href: "/software" }, { label: s.name, href: "/software/" + s.slug }]} />
      <section>
        <div className="product-heading">
          <Mark s={s} large />
          <div><span className="eyebrow">{category?.name}</span><h1>{s.name}</h1>{s.sponsored && <SponsoredBadge />}</div>
          <AffiliateButton s={s} affiliate={affiliates().find((a) => a.software === s.slug)} />
        </div>
        <p className="product-description">{s.shortDescription}</p>
        <LastUpdated s={s} />
        <div className="product-actions">
          <Link className="button" href={"/alternatives/" + s.slug}>Explore {related.length} alternatives ↗</Link>
          <Link className="button secondary" href={"/find?current=" + s.slug}>Find my match</Link>
        </div>
      </section>
      <nav className="product-nav" aria-label="On this page">
        <a href="#overview">Overview</a><a href="#use-cases">Use cases</a><a href="#strengths">Strengths & considerations</a><a href="#pricing">Pricing</a><a href="#capabilities">Capabilities</a><a href="#sources">Sources</a>
      </nav>
      <section id="overview" className="product-overview">
        <div className="product-copy">
          <span className="eyebrow">GET TO KNOW THE TOOL</span>
          <h2>What is {s.name}?</h2>
          {s.description.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          <a className="small" href="#sources">Based on official product documentation ↗</a>
        </div>
        <aside className="panel product-summary" aria-label="Product summary">
          <h2>At a glance</h2>
          <dl>
            <div><dt>Developer / publisher</dt><dd>{s.company ?? "Not yet verified"}</dd></div>
            <div><dt>Entry option</dt><dd>{pricing(s)}</dd></div>
            <div><dt>Pricing model</dt><dd>{s.pricingModel === "unknown" ? "See deployment and plan notes" : s.pricingModel}</dd></div>
            <div><dt>Verified platforms</dt><dd>{s.platforms.map((p) => platforms.find((t) => t.slug === p)?.name ?? p).join(", ") || "Not yet verified"}</dd></div>
            {s.license && <div><dt>License</dt><dd>{s.license}</dd></div>}
          </dl>
        </aside>
      </section>
      <section id="use-cases">
        <h2>When to consider {s.name}</h2>
        <p className="muted">Typical uses based on its documented tools. Check the requirements of your own project.</p>
        <ul className="use-case-grid">{s.useCases.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section id="strengths"><h2>Strengths & considerations</h2><ProsCons s={s} /></section>
      <section id="pricing">
        <div className="section-heading"><div><span className="eyebrow">UNDERSTAND THE COST</span><h2>Plans & pricing</h2></div></div>
        <p className="muted">Listed amounts use the source currency. Check billing commitments, taxes, region and edition limits before subscribing.</p>
        <div className="plan-grid">
          {s.plans.length ? s.plans.map((p) => {
            const evidence = planEvidence(p.id);
            return <article className="panel plan-card" key={p.id}>
              <h3>{p.name}</h3>
              <p className="plan-amount">{p.amount === null ? "See provider pricing" : p.amount === 0 ? "Free" : new Intl.NumberFormat("en", {style: "currency", currency: p.currency ?? "USD"}).format(p.amount)}
                {p.amount !== null && p.amount > 0 && <span> / {p.period === "one-time" ? "one-time purchase" : p.period}</span>}
              </p>
              <p>{p.notes}</p>
              {evidence && <p className="small muted">Checked {evidence.verifiedAt}</p>}
              <a href={evidence?.url ?? s.website} rel="noopener">Check official plan details ↗</a>
            </article>;
          }) : <p>Plan pricing has not been verified. <a href={s.website}>Check the official website ↗</a></p>}
        </div>
      </section>
      <section id="capabilities">
        <h2>Features & capabilities</h2>
        <div className="tags product-feature-tags">{s.features.map((f) => <span key={f}>{features.find((t) => t.slug === f)?.name ?? f.replaceAll("-", " ")}</span>)}</div>
        <p className="muted">Verified capabilities may belong to different editions or optional services. Read the plan and source notes.</p>
        <FeatureList s={s} onlyKnown />
        {unknown > 0 && <details className="unknown-details"><summary>{unknown} other capabilities have not yet been verified</summary><p>Unknown means we have no confirmed evidence for this field. It does not mean the product lacks the capability.</p><FeatureList s={s} onlyUnknown /></details>}
      </section>
      <SourceReference s={s} />
      {related.length > 0 && <section>
        <div className="section-heading"><h2>Consider these alternatives</h2><Link href={"/alternatives/" + s.slug}>Compare all ↗</Link></div>
        <div className="software-grid">{related.slice(0, 3).map((r) => <SoftwareCard key={r.slug} s={r} />)}</div>
      </section>}
      <AffiliateDisclosure />
      <JsonLd value={softwareJson(s)} /><PageEvent name="software_view" slug={s.slug} />
    </div>
  );
}
