import Link from "next/link";
import { catalogue, relations, taxonomy } from "@/lib/repository";
import { comparisonSlug } from "@/lib/discovery";
import { SearchSoftware } from "@/components/search";
import { SoftwareCard, Mark, JsonLd } from "@/components/ui";
import { itemList, metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Find the best software alternative for your needs",
  "Discover and compare software by price, platform, open source and the features that matter to you.",
  "/",
);
export default function Home() {
  const all = catalogue();
  const featured = [
    "photoshop",
    "notion",
    "figma",
    "slack",
    "premiere-pro",
    "1password",
  ]
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s) => !!s);
  const categories = taxonomy("categories").filter((c) =>
    all.some((s) => s.categories.includes(c.slug)),
  );
  const comparisons = relations().filter(
    (r) =>
      r.comparison &&
      [
        "notion-to-obsidian",
        "figma-to-penpot",
        "1password-to-bitwarden",
      ].includes(r.id),
  );
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="pill">
              <span className="status-dot" /> A better tool is out there
            </span>
            <h1>
              Find an alternative
              <br />
              to <span className="serif-accent">business as usual.</span>
            </h1>
            <p>
              Your workflow deserves the right software. Discover, compare, and
              find the tools that fit the way you work.
            </p>
            <SearchSoftware
              items={all.map(({ slug, name, aliases, color }) => ({
                slug,
                name,
                aliases,
                color,
              }))}
              hero
            />
            <div className="quick-search">
              <span>Try an alternative to</span>
              {["Photoshop", "Notion", "Figma"].map((n) => (
                <Link key={n} href={"/alternatives/" + n.toLowerCase()}>
                  {n} ↗
                </Link>
              ))}
            </div>
            <div className="hero-proof">
              <span>✓ Transparent comparisons</span>
              <span>✓ Sources you can check</span>
              <span>✓ Your needs come first</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="visual-caption">A NEW WAY TO FIND YOUR FIT</span>
            <div className="floating-tool tool-a">
              <span className="visual-logo purple">N</span>
              <span>
                Organize your ideas<small>Make room for a new way</small>
              </span>
            </div>
            <div className="center-node">↗</div>
            <div className="floating-tool tool-b">
              <span className="visual-logo blue">Ps</span>
              <span>
                Bring ideas to life<small>Explore your creative options</small>
              </span>
            </div>
            <div className="floating-tool tool-c">
              <span className="visual-logo green">✓</span>
              <span>
                Built around you<small>Your budget. Your workflow.</small>
              </span>
            </div>
            <span className="orbit-label">
              LESS COMPROMISE. MORE POSSIBILITY.
            </span>
          </div>
        </div>
      </section>
      <div className="catalogue-strip">
        <div className="container">
          <span>
            <strong>{all.length}</strong> carefully selected tools
          </span>
          <span>
            <strong>{categories.length}</strong> active categories
          </span>
          <span>Open source to enterprise</span>
          <Link href="/methodology">
            Independent matching <span>↗</span>
          </Link>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A GOOD PLACE TO START</span>
            <h2>Popular software. Fresh possibilities.</h2>
            <p>Know what you use? See what else is out there.</p>
          </div>
          <Link className="text-link" href="/software">
            Explore all software ↗
          </Link>
        </div>
        <div className="software-grid">
          {featured.map((s) => (
            <SoftwareCard s={s} key={s.slug} />
          ))}
        </div>
      </section>
      <section className="category-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE YOUR NEXT POSSIBILITY</span>
              <h2>Find your corner of the software world.</h2>
            </div>
            <Link className="text-link" href="/categories">
              All categories ↗
            </Link>
          </div>
          <div className="category-grid">
            {categories.slice(0, 8).map((c, i) => (
              <Link
                className="category-card"
                key={c.slug}
                href={"/categories/" + c.slug}
              >
                <span className="category-icon" aria-hidden="true">
                  {["◈", "⌘", "◎", "▧", "◇", "⌑", "⊞", "▹"][i]}
                </span>
                <div>
                  <h3>{c.name}</h3>
                  <p>
                    {all.filter((s) => s.categories.includes(c.slug)).length}{" "}
                    tools to explore
                  </p>
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SIDE BY SIDE</span>
            <h2>Less tab hopping. More clarity.</h2>
            <p>Compare the details that make a difference.</p>
          </div>
          <Link className="text-link" href="/compare">
            All comparisons ↗
          </Link>
        </div>
        <div className="comparison-grid">
          {comparisons.map((r) => {
            const a = all.find((s) => s.slug === r.from),
              b = all.find((s) => s.slug === r.to);
            if (!a || !b) return null;
            return (
              <Link
                className="comparison-card"
                key={r.id}
                href={"/compare/" + comparisonSlug(a.slug, b.slug)}
              >
                <div>
                  <Mark s={a} />
                  <span className="versus">vs</span>
                  <Mark s={b} />
                </div>
                <h3>
                  {a.name} <span>vs</span> {b.name}
                </h3>
                <p>Features, pricing & the trade-offs</p>
                <span className="text-link">See the comparison ↗</span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="container">
        <div className="find-banner">
          <div>
            <span className="eyebrow">YOUR WORKFLOW IS PERSONAL</span>
            <h2>
              Your next favorite tool
              <br />
              starts with what matters to you.
            </h2>
            <p>Tell us what you need. We’ll help you find the fit.</p>
          </div>
          <Link className="button light" href="/find">
            Find my alternative <span aria-hidden="true">↗</span>
          </Link>
          <span className="banner-art" aria-hidden="true">
            ↗
          </span>
        </div>
      </section>
      <section className="container trust-row">
        <div>
          <span>01 /</span>
          <h3>Facts with a source</h3>
          <p>
            Check where the details come from. Unknown data stays clearly
            marked.
          </p>
        </div>
        <div>
          <span>02 /</span>
          <h3>Matches you can understand</h3>
          <p>
            Every score comes from your preferences and published product data.
          </p>
        </div>
        <div>
          <span>03 /</span>
          <h3>Choices without the noise</h3>
          <p>
            Paid placements are labeled. Your match score is never for sale.
          </p>
        </div>
      </section>
      <JsonLd value={itemList(featured)} />
    </>
  );
}
