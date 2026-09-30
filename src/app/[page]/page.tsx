import { notFound } from "next/navigation";
import { legalPages } from "@/lib/legal";
import { Breadcrumbs } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
type Props = { params: Promise<{ page: string }> };
export async function generateMetadata({ params }: Props) {
  const slug = (await params).page;
  const p = legalPages[slug];
  return p
    ? meta(
        p.title,
        p.paragraphs[0].slice(0, 160),
        "/" + slug,
        !!p.ownerRequired,
      )
    : meta("Not found", "Page not found.", "/", true);
}
export default async function Information({ params }: Props) {
  const slug = (await params).page;
  const page = legalPages[slug];
  if (!page) notFound();
  const email = process.env.CONTACT_EMAIL;
  const operator = process.env.SITE_OPERATOR;
  return (
    <div className="container page-content">
      <Breadcrumbs
        items={[{ label: slug.replaceAll("-", " "), href: "/" + slug }]}
      />
      <div className="page-intro">
        <span className="eyebrow">SOFTWARE ALTERNATIVE</span>
        <h1>{page.title}</h1>
      </div>
      <article className="prose">
        {page.ownerRequired && (
          <p className="notice">
            Publication draft: operator details, hosting information and
            applicable legal terms need to be completed and reviewed before
            public launch.
          </p>
        )}
        {page.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {operator && <p>Operator: {operator}</p>}
        {email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
          <p>
            Contact: <a href={"mailto:" + email}>{email}</a>
          </p>
        )}
      </article>
    </div>
  );
}
