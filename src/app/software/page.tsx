import Link from "next/link";
import { catalogue, taxonomy } from "@/lib/repository";
import { search } from "@/lib/discovery";
import { SearchSoftware, CatalogueSearchForm } from "@/components/search";
import { Breadcrumbs, SoftwareCard, EmptyState, JsonLd } from "@/components/ui";
import { metadata as meta, itemList } from "@/lib/seo";
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ searchParams }: Props) {
  return meta(
    "Explore software",
    "Browse sourced software and discover your next tool.",
    "/software",
    Object.keys(await searchParams).length > 0,
  );
}
export default async function Directory({ searchParams }: Props) {
  const p = await searchParams;
  const query = typeof p.q === "string" ? p.q : "";
  const cat = typeof p.category === "string" ? p.category : "";
  const all = catalogue();
  const matches = search(all, query).filter(
    (s) => !cat || s.categories.includes(cat),
  );
  const pages = Math.ceil(matches.length / 12) || 1;
  const page = Math.max(1, Math.min(pages, Math.floor(Number(p.page)) || 1));
  const items = matches.slice((page - 1) * 12, page * 12);
  const pageUrl = (n: number) =>
    "/software?" +
    new URLSearchParams({ q: query, category: cat, page: String(n) });
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: "Software", href: "/software" }]} />
      <div className="page-intro">
        <span className="eyebrow">THE SOFTWARE DIRECTORY</span>
        <h1>A better fit for the way you work.</h1>
        <p>
          Explore {all.length} tools. Compare verified features and discover
          your options.
        </p>
        <SearchSoftware
          items={all.map(({ slug, name, aliases, color }) => ({
            slug,
            name,
            aliases,
            color,
          }))}
        />
      </div>
      <CatalogueSearchForm
        items={all.map(({ slug, name, aliases, color, categories }) => ({
          slug,
          name,
          aliases,
          color,
          categories,
        }))}
      >
        <label className="form-field">
          Search catalogue
          <input
            name="q"
            defaultValue={query}
            placeholder="Name or alias"
            maxLength={100}
          />
        </label>
        <label className="form-field">
          Category
          <select name="category" defaultValue={cat}>
            <option value="">All categories</option>
            {taxonomy("categories").map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button className="button" type="submit">
          Apply search
        </button>
        <Link className="button secondary" href="/software">
          Reset
        </Link>
      </CatalogueSearchForm>
      <p aria-live="polite">
        {matches.length} results{query ? " for “" + query + "”" : ""}
      </p>
      {items.length ? (
        <div className="software-grid">
          {items.map((s) => (
            <SoftwareCard key={s.slug} s={s} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      <div className="pagination">
        {page > 1 ? <Link href={pageUrl(page - 1)}>← Previous</Link> : <span />}
        <span>
          Page {page} of {pages}
        </span>
        {page < pages ? <Link href={pageUrl(page + 1)}>Next →</Link> : <span />}
      </div>
      <JsonLd value={itemList(items)} />
    </div>
  );
}
