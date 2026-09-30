import Link from "next/link";
import { notFound } from "next/navigation";
import { guideBySlug } from "@/lib/guides";
import { catalogue, taxonomy } from "@/lib/repository";
import { Breadcrumbs, JsonLd } from "@/components/ui";
import { metadata as meta, articleJson } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const g = guideBySlug((await params).slug);
  return g
    ? meta(g.title, g.description, "/guides/" + g.slug)
    : meta("Not found", "Guide not found.", "/guides", true);
}
export default async function Guide({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const all = catalogue();
  const name = (slug: string) => all.find((s) => s.slug === slug)?.name;
  const cats = taxonomy("categories");
  const software = g.software.filter((s) => name(s));
  const compare = g.compare.flatMap((pair) => {
    const [a, b] = pair.split("-vs-");
    return name(a) && name(b)
      ? [{ pair, label: name(a) + " vs " + name(b) }]
      : [];
  });
  const categories = g.categories.flatMap((c) => {
    const found = cats.find((x) => x.slug === c);
    return found ? [{ slug: c, name: found.name }] : [];
  });
  return (
    <div className="container page-content">
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: g.title, href: "/guides/" + g.slug },
        ]}
      />
      <div className="page-intro">
        <span className="eyebrow">{g.topic.toUpperCase()}</span>
        <h1>{g.title}</h1>
        <p>{g.description}</p>
        <p className="guide-meta">
          By the Software Alternative editorial team · Published {g.published}
        </p>
      </div>
      <article className="prose">
        {g.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.bullets && (
              <ul>
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <p className="notice">
          This guide gives general advice and is not a hands-on review. Product
          details come from the official sources recorded in our catalogue and
          can change, so check each vendor&apos;s current terms before you
          decide. See our <Link href="/methodology">methodology</Link> for how
          we handle unknown information.
        </p>
      </article>
      <aside className="guide-related" aria-label="Related pages">
        {software.length > 0 && (
          <>
            <h2>Products mentioned</h2>
            <ul>
              {software.map((s) => (
                <li key={s}>
                  <Link href={"/software/" + s}>{name(s)}</Link> ·{" "}
                  <Link href={"/alternatives/" + s}>
                    alternatives to {name(s)}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        {compare.length > 0 && (
          <>
            <h2>Side-by-side comparisons</h2>
            <ul>
              {compare.map((c) => (
                <li key={c.pair}>
                  <Link href={"/compare/" + c.pair}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        {categories.length > 0 && (
          <>
            <h2>Browse categories</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={"/categories/" + c.slug}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>
      <JsonLd
        value={articleJson({
          title: g.title,
          description: g.description,
          path: "/guides/" + g.slug,
          published: g.published,
        })}
      />
    </div>
  );
}
