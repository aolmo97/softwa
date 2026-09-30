import Link from "next/link";
import { guides } from "@/lib/guides";
import { Breadcrumbs } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Software guides",
  "Practical guides for choosing and switching software: evaluation frameworks, licence labels, self-hosting and migration checklists.",
  "/guides",
);
export default function Guides() {
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }]} />
      <div className="page-intro">
        <span className="eyebrow">EDITORIAL</span>
        <h1>Guides for choosing and switching software</h1>
        <p>
          Independent, plain-language advice that sits beside our sourced
          catalogue. Guides explain how to think about a decision; the catalogue
          records what each product officially says.
        </p>
      </div>
      <div className="guide-grid">
        {guides.map((g) => (
          <article className="guide-card" key={g.slug}>
            <span className="eyebrow">{g.topic.toUpperCase()}</span>
            <h2>
              <Link href={"/guides/" + g.slug}>{g.title}</Link>
            </h2>
            <p>{g.description}</p>
            <Link href={"/guides/" + g.slug}>Read the guide →</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
