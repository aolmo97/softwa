"use client";
import Link from "next/link";
import { useState } from "react";
import { type FilterId, type Software } from "@/lib/model";
import { filterSoftware, recommend, type Criterion } from "@/lib/discovery";
import { FilterPanel } from "./filters";
import {
  ComparisonTable,
  EmptyState,
  Mark,
  PricingBadge,
  SponsoredBadge,
} from "./ui";
import { TrackedLink } from "./analytics";
export function AlternativesExplorer({
  original,
  items,
  initial = [],
  reasons,
}: {
  original: Software;
  items: Software[];
  initial?: FilterId[];
  reasons: Record<string, string>;
}) {
  const [selected, setSelected] = useState(initial);
  const [view, setView] = useState("cards");
  const criteria: Criterion[] = original.features.map((f) => ({
    kind: "feature",
    key: f,
    value: f,
    hard: false,
    weight: 1,
  }));
  const results = recommend(filterSoftware(items, selected), criteria);
  function update(next: FilterId[]) {
    setSelected(next);
    const url = new URL(window.location.href);
    if (next.length) url.searchParams.set("filters", next.join(","));
    else url.searchParams.delete("filters");
    window.history.replaceState(null, "", url);
  }
  return (
    <div className="with-sidebar">
      <FilterPanel selected={selected} onChange={update} />
      <div>
        <div className="results-toolbar">
          <p aria-live="polite">
            <strong>{results.length}</strong> alternatives
          </p>
          <div className="segmented">
            <button
              aria-pressed={view === "cards"}
              onClick={() => setView("cards")}
            >
              Overview
            </button>
            <button
              aria-pressed={view === "table"}
              onClick={() => setView("table")}
            >
              Compare table
            </button>
          </div>
        </div>
        <p className="small muted">
          Feature overlap uses {original.features.length} verified features in{" "}
          {original.name}. Unknown features earn no points.{" "}
          <Link href="/methodology">How matching works</Link>.
        </p>
        {!results.length ? (
          <EmptyState />
        ) : view === "table" ? (
          <ComparisonTable items={results.map((r) => r.software)} />
        ) : (
          <div className="alternative-list">
            {results.map((r) => (
              <article className="alternative-card" key={r.software.slug}>
                <div className="alternative-title">
                  <Mark s={r.software} />
                  <div>
                    <h2>
                      <Link href={"/software/" + r.software.slug}>
                        {r.software.name}
                      </Link>
                    </h2>
                    <PricingBadge s={r.software} />
                    {r.software.sponsored && <SponsoredBadge />}
                  </div>
                  <div className="match-score">
                    {r.score === null ? "—" : r.score + "%"}
                    <small>feature overlap</small>
                  </div>
                </div>
                <p>{r.software.shortDescription}</p>
                <p className="editorial">{reasons[r.software.slug]}</p>
                <details>
                  <summary>
                    Why this result · {r.coverage}% data coverage
                  </summary>
                  <ul className="factor-list">
                    {r.factors.map((f) => (
                      <li key={f.label}>
                        {f.state === "met" ? "✓" : "?"} {f.label}{" "}
                        <span>
                          {f.state === "met" ? "Verified" : "Unknown"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
                <div className="card-actions">
                  <Link
                    className="button secondary"
                    href={"/software/" + r.software.slug}
                  >
                    View details
                  </Link>
                  <TrackedLink
                    href={r.software.website}
                    event="external_website_click"
                    slug={r.software.slug}
                  >
                    Official website ↗
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
