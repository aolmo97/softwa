import { notFound } from "next/navigation";
import { catalogue, taxonomy } from "@/lib/repository";
import { Breadcrumbs, SoftwareCard, EmptyState, JsonLd } from "@/components/ui";
import { metadata as meta, itemList } from "@/lib/seo";
import { categoryNotes } from "@/lib/category-notes";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const c = taxonomy("categories").find((c) => c.slug === slug);
  return c
    ? meta(
        c.name + " software",
        c.description,
        "/categories/" + slug,
        !catalogue().some((s) => s.categories.includes(slug)),
      )
    : meta("Not found", "Category not found.", "/categories", true);
}
export default async function Category({ params }: Props) {
  const slug = (await params).slug;
  const c = taxonomy("categories").find((c) => c.slug === slug);
  if (!c) notFound();
  const items = catalogue().filter((s) => s.categories.includes(slug));
  const note = categoryNotes[slug];
  return (
    <div className="container page-content">
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/categories" },
          { label: c.name, href: "/categories/" + slug },
        ]}
      />
      <div className="page-intro">
        <h1>{c.name} software</h1>
        <p>{c.description}</p>
      </div>
      {items.length ? (
        <div className="software-grid">
          {items.map((s) => (
            <SoftwareCard s={s} key={s.slug} />
          ))}
        </div>
      ) : (
        <EmptyState title="This category is growing">
          No products have been published here yet. Explore an active category
          in the catalogue.
        </EmptyState>
      )}
      {note && items.length > 0 && (
        <section className="prose">
          <h2>How to choose {c.name.toLowerCase()} software</h2>
          <p>{note.intro}</p>
          <p>Questions worth answering before you decide:</p>
          <ul>
            {note.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>
      )}
      <JsonLd value={itemList(items)} />
    </div>
  );
}
