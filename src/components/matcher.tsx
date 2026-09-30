"use client";
import Link from "next/link";
import { useState } from "react";
import {
  type Software,
  type Taxonomy,
  flagLabels,
  type Flag,
} from "@/lib/model";
import { type Criterion, type Factor } from "@/lib/discovery";
import { Mark, PricingBadge, EmptyState, SponsoredBadge } from "./ui";
import { track } from "./analytics";
type Result = {
  software: Software;
  score: number | null;
  coverage: number;
  factors: Factor[];
};
const preferences: Flag[] = [
  "openSource",
  "commercialUse",
  "aiFeatures",
  "offlineSupport",
  "selfHosted",
  "beginnerFriendly",
  "professional",
];
export function Matcher({
  items,
  features,
  initial,
}: {
  items: Software[];
  features: Taxonomy[];
  initial: string;
}) {
  const [current, setCurrent] = useState(initial);
  const [result, setResult] = useState<Result[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [prefs, setPrefs] = useState<Record<string, string>>({});
  const [weights, setWeights] = useState<Record<string, number>>({});
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const criteria: Criterion[] = [];
    const add = (
      kind: Criterion["kind"],
      key: string,
      value: Criterion["value"],
      hard: boolean,
      weight = 1,
    ) => criteria.push({ kind, key, value, hard, weight });
    if (form.get("budget") !== "")
      add(
        "budget",
        "USD",
        Number(form.get("budget")),
        form.get("budgetHard") === "on",
        2,
      );
    if (form.get("platform"))
      add(
        "platform",
        String(form.get("platform")),
        String(form.get("platform")),
        true,
        2,
      );
    if (form.get("pricing"))
      add(
        "pricing",
        "payment",
        String(form.get("pricing")),
        form.get("pricingHard") === "on",
        2,
      );
    for (const f of preferences) {
      const p = prefs[f];
      if (p && p !== "ignore")
        add("flag", f, p !== "avoid", p === "require", weights[f] ?? 1);
    }
    for (const f of form.getAll("features"))
      add(
        "feature",
        String(f),
        String(f),
        form.get("featuresHard") === "on",
        2,
      );
    setBusy(true);
    setMessage("");
    setResult(null);
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, criteria }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Matching failed.");
      setResult(data.results);
      track("match_completed", {
        current,
        criteria: criteria.length,
        results: data.results.length,
      });
      if (!criteria.length)
        setMessage(
          "No preferences selected. Relevant alternatives are listed alphabetically without a match score.",
        );
      else
        setMessage(
          data.excluded +
            " alternatives excluded by mandatory requirements. Unknown facts cannot satisfy a mandatory requirement.",
        );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not calculate matches. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const relevant = items.find((s) => s.slug === current)?.features ?? [];
  return (
    <div className="matcher">
      <form className="panel" onSubmit={submit}>
        <div className="form-grid">
          <label className="form-field span-two">
            Software you use
            <select
              name="current"
              value={current}
              onChange={(e) => {
                setCurrent(e.target.value);
                setResult(null);
              }}
              required
            >
              <option value="">Choose software</option>
              {items.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            Monthly budget (USD)
            <input
              name="budget"
              type="number"
              min="0"
              max="1000000"
              step="0.01"
              placeholder="Any budget"
            />
            <small>
              Free entry plans count as $0. Annual plans are divided by 12.
              One-time prices are not converted.
            </small>
          </label>
          <label className="form-field">
            Operating system
            <select name="platform">
              <option value="">Any platform</option>
              {["windows", "macos", "linux", "web", "android", "ios"].map(
                (p) => (
                  <option key={p} value={p}>
                    {p === "macos"
                      ? "macOS"
                      : p === "ios"
                        ? "iOS"
                        : p[0].toUpperCase() + p.slice(1)}
                  </option>
                ),
              )}
            </select>
            <small>A selected platform is mandatory.</small>
          </label>
          <label className="checkbox">
            <input type="checkbox" name="budgetHard" />
            Budget is mandatory
          </label>
          <span />
          <label className="form-field">
            Payment preference
            <select name="pricing">
              <option value="">Any pricing model</option>
              <option value="no-subscription">
                No subscription (free tiers included)
              </option>
              <option value="one-time">One-time payment</option>
              <option value="subscription">Subscription</option>
            </select>
          </label>
          <label className="checkbox">
            <input type="checkbox" name="pricingHard" />
            Payment model is mandatory
          </label>
        </div>
        <fieldset>
          <legend>What matters to you?</legend>
          <p className="small">
            “Prefer” earns points. “Must have” excludes unverified or
            incompatible tools. Higher weights make a preference more important.
          </p>
          {preferences.map((f) => (
            <div className="requirement-row" key={f}>
              <label htmlFor={"pref-" + f}>{flagLabels[f]}</label>
              <select
                id={"pref-" + f}
                value={prefs[f] ?? "ignore"}
                onChange={(e) => setPrefs({ ...prefs, [f]: e.target.value })}
              >
                <option value="ignore">No preference</option>
                <option value="prefer">Prefer</option>
                <option value="require">Must have</option>
                {f === "aiFeatures" && (
                  <option value="avoid">Prefer no AI</option>
                )}
              </select>
              <label className="weight-label">
                Weight
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={weights[f] ?? 1}
                  aria-label={flagLabels[f] + " weight"}
                  onChange={(e) =>
                    setWeights({
                      ...weights,
                      [f]: Math.max(
                        1,
                        Math.min(10, Number(e.target.value) || 1),
                      ),
                    })
                  }
                />
              </label>
            </div>
          ))}
        </fieldset>
        <fieldset key={current}>
          <legend>Important features</legend>
          {features
            .filter((f) => relevant.includes(f.slug))
            .map((f) => (
              <label className="checkbox" key={f.slug}>
                <input type="checkbox" name="features" value={f.slug} />
                {f.name}
              </label>
            ))}
          {!relevant.length && (
            <p>Choose a product to see its verified features.</p>
          )}
          <label className="checkbox">
            <input type="checkbox" name="featuresHard" />
            All selected features are mandatory
          </label>
        </fieldset>
        <button className="button" type="submit" disabled={busy || !current}>
          {busy ? "Finding your matches…" : "Find my alternatives"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </form>
      <div role="status" aria-live="polite">
        {message && <p className="form-message">{message}</p>}
      </div>
      {result !== null && (
        <section>
          <div className="section-heading">
            <h2>Your alternatives</h2>
            <Link href="/methodology">How scores work ↗</Link>
          </div>
          {result.length === 0 ? (
            <EmptyState title="No verified match for these requirements">
              Try making one of your mandatory requirements a preference. We
              never fill gaps in product data with assumptions.
            </EmptyState>
          ) : (
            <div className="alternative-list">
              {result.map((r) => (
                <article className="alternative-card" key={r.software.slug}>
                  <div className="alternative-title">
                    <Mark s={r.software} />
                    <div>
                      <h3>
                        <Link href={"/software/" + r.software.slug}>
                          {r.software.name}
                        </Link>
                      </h3>
                      <PricingBadge s={r.software} />
                      {r.software.sponsored && <SponsoredBadge />}
                    </div>
                    <div className="match-score">
                      {r.score === null ? "—" : r.score + "%"}
                      <small>preference match</small>
                    </div>
                  </div>
                  <p>{r.software.shortDescription}</p>
                  <p className="small">
                    {r.coverage}% weighted data coverage · Scores describe the
                    recorded product, not a guaranteed plan entitlement.
                  </p>
                  <ul className="factor-list">
                    {r.factors.map((f, i) => (
                      <li key={i}>
                        <span>
                          {f.state === "met"
                            ? "✓"
                            : f.state === "unmet"
                              ? "×"
                              : "?"}{" "}
                          {f.label}
                          {f.hard ? " (required)" : ""}
                        </span>
                        <span>
                          {f.state} · {f.earned - f.penalty}/{f.weight}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="button secondary"
                    href={"/software/" + r.software.slug}
                  >
                    Review features & sources
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
