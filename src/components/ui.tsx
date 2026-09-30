import Image from "next/image";
import Link from "next/link";
import {
  flagLabels,
  flags,
  known,
  pricing,
  type SoftwareInput,
  type Software,
  type Affiliate,
} from "@/lib/model";
import { jsonLd, siteUrl } from "@/lib/seo";
import { TrackedLink } from "./analytics";
export function Mark({
  s,
  large = false,
}: {
  s: Pick<SoftwareInput, "name" | "color" | "logo">;
  large?: boolean;
}) {
  return s.logo ? (
    <Image
      src={s.logo}
      alt=""
      width={large ? 78 : 43}
      height={large ? 78 : 43}
      unoptimized
      className={"app-mark" + (large ? " large" : "")}
    />
  ) : (
    <span
      className={"app-mark" + (large ? " large" : "")}
      style={{ background: s.color }}
      aria-hidden="true"
    >
      {s.name.replace(/^Adobe /, "").slice(0, 2)}
    </span>
  );
}
export function SponsoredBadge() {
  return <span className="badge sponsored">Sponsored</span>;
}
export function PricingBadge({ s }: { s: SoftwareInput }) {
  return (
    <span className={"badge " + (s.flags.freePlan === true ? "green" : "")}>
      {pricing(s)}
    </span>
  );
}
export function SoftwareCard({ s }: { s: SoftwareInput }) {
  return (
    <article className="software-card">
      <div className="card-top">
        <Mark s={s} />
        <PricingBadge s={s} />
      </div>
      <h3>
        <Link href={"/software/" + s.slug}>{s.name}</Link>
      </h3>
      <p>{s.shortDescription}</p>
      <div className="tags">
        {s.flags.openSource === true && <span>Open source</span>}
        {s.flags.offlineSupport === true && <span>Offline</span>}
        {s.sponsored && <SponsoredBadge />}
      </div>
      <TrackedLink
        className="card-bottom"
        href={"/alternatives/" + s.slug}
        event="alternative_click"
        slug={s.slug}
      >
        Explore alternatives <span aria-hidden="true">↗</span>
      </TrackedLink>
    </article>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {all.map((i, n) => (
            <li key={i.href}>
              {n === all.length - 1 ? (
                <span aria-current="page">{i.label}</span>
              ) : (
                <Link href={i.href}>{i.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((x, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: x.label,
            item: siteUrl() + x.href,
          })),
        }}
      />
    </>
  );
}
export function JsonLd({ value }: { value: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(value) }}
    />
  );
}
export function EmptyState({
  title = "No matching software",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <span aria-hidden="true">⌕</span>
      <h2>{title}</h2>
      <p>
        {children ??
          "Try a broader search or remove a filter. Unknown data never counts as a verified match."}
      </p>
      <Link className="button secondary" href="/software">
        Browse the catalogue
      </Link>
    </div>
  );
}
export function AffiliateDisclosure() {
  return (
    <p className="muted small">
      Some outbound links may earn a commission. Sponsored placements are
      labeled and never change match scores.{" "}
      <Link href="/affiliate-disclosure">How we fund this site</Link>.
    </p>
  );
}
export function AffiliateButton({
  s,
  affiliate,
}: {
  s: SoftwareInput;
  affiliate?: Affiliate;
}) {
  const active = affiliate?.enabled;
  return (
    <TrackedLink
      className="button"
      href={active ? affiliate.url : s.website}
      rel={active ? "sponsored nofollow noopener" : "noopener"}
      event={active ? "affiliate_click" : "external_website_click"}
      slug={s.slug}
    >
      {active ? "Visit partner website" : "Visit official website"}{" "}
      <span aria-hidden="true">↗</span>
    </TrackedLink>
  );
}
export function AdSlot({
  enabled = false,
  children,
}: {
  enabled?: boolean;
  children?: React.ReactNode;
}) {
  return enabled && children ? (
    <aside className="ad-slot" aria-label="Advertisement">
      <span>Advertisement</span>
      {children}
    </aside>
  ) : null;
}
export function LastUpdated({ s }: { s: Software }) {
  return (
    <p className="muted small">
      Sources last checked {s.dataLastVerifiedAt ?? "not yet verified"} ·{" "}
      <a href="#sources">See individual evidence</a>
    </p>
  );
}
export function SourceReference({ s }: { s: SoftwareInput }) {
  return (
    <section id="sources">
      <div className="section-heading">
        <div>
          <span className="eyebrow">TRACEABLE DATA</span>
          <h2>Sources & verification</h2>
        </div>
      </div>
      <p className="muted">
        Verification applies only to the fields listed below. An unlisted
        feature or platform is unknown, not unsupported.
      </p>
      {s.sources.map((x) => (
        <article className="source" key={x.id}>
          <h3>
            <a href={x.url} rel="noopener">
              {x.title} ↗
            </a>
          </h3>
          <p>{x.notes}</p>
          <p className="small muted">
            Accessed {x.accessedAt} ·{" "}
            {x.status === "VERIFIED"
              ? "Verified " + x.verifiedAt
              : "Unverified"}
          </p>
          <details>
            <summary>Evidence fields ({x.fields.length})</summary>
            <p className="small">{x.fields.join(" · ")}</p>
          </details>
        </article>
      ))}
    </section>
  );
}
export function FeatureList({ s, onlyKnown = false, onlyUnknown = false }: { s: SoftwareInput; onlyKnown?: boolean; onlyUnknown?: boolean }) {
  return (
    <dl className="facts">
      {flags.filter((f) => (!onlyKnown || s.flags[f] !== null) && (!onlyUnknown || s.flags[f] === null)).map((f) => (
        <div key={f}>
          <dt>{flagLabels[f]}</dt>
          <dd
            className={
              s.flags[f] === null ? "unknown" : s.flags[f] ? "yes" : ""
            }
          >
            {known(s.flags[f])}
          </dd>
        </div>
      ))}
    </dl>
  );
}
export function ComparisonTable({ items }: { items: SoftwareInput[] }) {
  const rows: [string, (s: SoftwareInput) => string][] = [
    ["Entry price", pricing],
    [
      "Pricing model",
      (s) => (s.pricingModel === "unknown" ? "Unknown" : s.pricingModel),
    ],
    ["Verified platforms", (s) => s.platforms.join(", ") || "Unknown"],
    ...flags.map(
      (f) =>
        [flagLabels[f], (s: SoftwareInput) => known(s.flags[f])] as [
          string,
          (s: SoftwareInput) => string,
        ],
    ),
    ["License", (s) => s.license ?? "Unknown"],
    [
      "Verified features",
      (s) =>
        s.features.map((f) => f.replaceAll("-", " ")).join(", ") || "Unknown",
    ],
    ["Use cases", (s) => s.useCases.join(", ") || "Not reviewed"],
  ];
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label="Software comparison"
      tabIndex={0}
    >
      <table>
        <caption>Published facts · plan and edition limits may apply</caption>
        <thead>
          <tr>
            <th scope="col">Compare</th>
            {items.map((s) => (
              <th key={s.slug} scope="col">
                <Link href={"/software/" + s.slug}>{s.name}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, fn]) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              {items.map((s) => (
                <td
                  key={s.slug}
                  className={fn(s) === "Unknown" ? "unknown" : ""}
                >
                  {fn(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function ProsCons({ s }: { s: SoftwareInput }) {
  const pros = s.pros.length
    ? s.pros
    : [
        ...s.features
          .slice(0, 3)
          .map((f) => "Verified " + f.replaceAll("-", " ")),
        ...(s.flags.freePlan === true
          ? ["A free entry option is available"]
          : []),
      ];
  return (
    <div className="two-col">
      <div className="panel">
        <h3>What it offers</h3>
        {pros.length ? (
          <ul className="check-list">
            {pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : (
          <p>Editorial strengths have not been reviewed.</p>
        )}
      </div>
      <div className="panel">
        <h3>What to check</h3>
        {s.cons.length ? (
          <ul>
            {s.cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p>
            Product limitations have not been independently reviewed. Test your
            own workflow and confirm edition limits with the vendor.
          </p>
        )}
        <p className="small muted">
          Editorial guidance, not a hands-on review or a guarantee of
          compatibility.
        </p>
      </div>
    </div>
  );
}
