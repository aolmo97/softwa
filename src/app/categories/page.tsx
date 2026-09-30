import Link from "next/link";
import { catalogue, taxonomy } from "@/lib/repository";
import { Breadcrumbs } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Software categories",
  "Explore design, productivity, development, communication and more.",
  "/categories",
);
export default function Categories() {
  const all = catalogue();
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: "Categories", href: "/categories" }]} />
      <div className="page-intro">
        <h1>Every workflow has a category.</h1>
        <p>
          Start with what you want to do. We’re growing this catalogue
          carefully, one sourced product at a time.
        </p>
      </div>
      <div className="category-grid">
        {taxonomy("categories").map((c) => (
          <Link
            className="category-card"
            key={c.slug}
            href={"/categories/" + c.slug}
          >
            <div>
              <h2 style={{ fontSize: 18 }}>{c.name}</h2>
              <p>
                {all.filter((s) => s.categories.includes(c.slug)).length} tools
              </p>
            </div>
            <span>↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
