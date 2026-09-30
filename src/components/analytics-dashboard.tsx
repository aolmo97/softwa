"use client";
import { useEffect, useState } from "react";
import type { AnalyticsSummary } from "@/lib/analytics";
type Row = { label: string; count: number };
function Ranking({
  title,
  rows,
  note,
}: {
  title: string;
  rows: Row[];
  note?: string;
}) {
  const maximum = Math.max(1, ...rows.map((row) => row.count));
  return (
    <section className="panel analytics-ranking">
      <h3>{title}</h3>
      {note && <p className="small muted">{note}</p>}
      {rows.length ? (
        <ol className="analytics-list">
          {rows.map((row) => (
            <li key={row.label}>
              <span>
                {row.label}
                <span
                  className="analytics-meter"
                  aria-hidden="true"
                  style={{ width: (row.count / maximum) * 100 + "%" }}
                />
              </span>
              <strong>{row.count.toLocaleString("en")}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="muted">No activity recorded in this period.</p>
      )}
    </section>
  );
}
export function AnalyticsDashboard() {
  const [range, setRange] = useState("month");
  const [group, setGroup] = useState("day");
  const [request, setRequest] = useState("range=month&group=day");
  const [loaded, setLoaded] = useState<{
    request: string;
    data: AnalyticsSummary;
  } | null>(null);
  const [failure, setFailure] = useState<{
    request: string;
    message: string;
  } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/analytics?" + request, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error ?? "Unable to load analytics.");
        if (!controller.signal.aborted) setLoaded({ request, data });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setFailure({
            request,
            message:
              error instanceof Error
                ? error.message
                : "Unable to load analytics.",
          });
      });
    return () => controller.abort();
  }, [request]);
  const data = loaded?.request === request ? loaded.data : null;
  const error = failure?.request === request ? failure.message : "";
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const earliest = new Date(Date.parse(today) - 179 * 86400000)
    .toISOString()
    .slice(0, 10);
  const cards: Array<[string, number | undefined, string]> = [
    [
      "Unique visitors",
      data?.totals.visitors,
      "Consenting browsers; not a count of individual people",
    ],
    [
      "Visits",
      data?.totals.sessions,
      "Sessions restart after 30 minutes of inactivity",
    ],
    [
      "Page views",
      data?.totals.pageViews,
      "Public pages, including the homepage",
    ],
    [
      "Searches",
      data?.totals.searches,
      "Submitted searches, not autocomplete keystrokes",
    ],
    [
      "Searches with no results",
      data?.totals.noResultSearches,
      "Unmatched searches without storing their text",
    ],
    [
      "Completed matches",
      data?.totals.matches,
      (data?.totals.noResultMatches ?? 0) + " returned no matches",
    ],
    [
      "Comparison views",
      data?.totals.comparisons,
      "Views of individual comparison pages",
    ],
    [
      "Outbound clicks",
      data?.totals.outbound,
      (data?.totals.affiliate ?? 0) + " were affiliate clicks",
    ],
  ];
  return (
    <section aria-label="Analytics dashboard">
      <div className="section-heading">
        <div>
          <span className="eyebrow">AUDIENCE AND DISCOVERY</span>
          <h2>Understand how visitors find their next tool.</h2>
          <p>Visits, search demand and activity across your catalogue.</p>
        </div>
      </div>
      <form
        className="panel analytics-controls"
        onSubmit={(event) => {
          event.preventDefault();
          const fields = new FormData(event.currentTarget);
          const params = new URLSearchParams({
            range,
            group,
            refresh: String(Date.now()),
          });
          if (range === "custom") {
            params.set("from", String(fields.get("from")));
            params.set("to", String(fields.get("to")));
          }
          setRequest(params.toString());
        }}
      >
        <label className="form-field">
          Period
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
          >
            <option value="day">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="all">Last 180 days</option>
            <option value="custom">Custom dates</option>
          </select>
        </label>
        <label className="form-field">
          Group by
          <select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </label>
        {range === "custom" && (
          <>
            <label className="form-field">
              From
              <input
                type="date"
                name="from"
                min={earliest}
                max={today}
                defaultValue={today}
                required
              />
            </label>
            <label className="form-field">
              To
              <input
                type="date"
                name="to"
                min={earliest}
                max={today}
                defaultValue={today}
                required
              />
            </label>
          </>
        )}
        <button className="button" type="submit">
          Update statistics
        </button>
        {data && (
          <a
            className="button secondary"
            href={"/api/admin/analytics?" + request + "&format=csv"}
          >
            Download CSV
          </a>
        )}
      </form>
      {error ? (
        <p role="alert" className="form-message error-message">
          {error} Select another period or retry.
        </p>
      ) : !data ? (
        <p role="status">Loading analytics…</p>
      ) : (
        <>
          <p className="small muted">
            Showing {data.from} to {data.to} · UTC · Weeks begin Monday.{" "}
            {data.startedAt
              ? "First recorded activity: " + data.startedAt.slice(0, 10) + "."
              : "No activity has been recorded yet."}
          </p>
          {!data.totals.pageViews && (
            <div className="panel">
              <h3>No visits recorded in this period</h3>
              <p>
                Statistics begin when a visitor allows analytics. Earlier
                traffic cannot be reconstructed. Signed-in editors are excluded;
                use a private browser window to check collection.
              </p>
            </div>
          )}
          <div className="stats-grid">
            {cards.map(([label, value, note]) => (
              <div className="panel analytics-stat" key={label}>
                <span className="eyebrow">{label}</span>
                <strong>{value?.toLocaleString("en") ?? 0}</strong>
                <p className="small muted">{note}</p>
              </div>
            ))}
          </div>
          <section className="panel">
            <h3>Visitors by {data.group}</h3>
            <div
              className="analytics-chart"
              role="img"
              aria-label={
                "Unique visitors by " +
                data.group +
                ". Exact figures are available in the table below."
              }
            >
              <div className="analytics-bars">
                {data.trend.map((row) => (
                  <div
                    className="analytics-bar-column"
                    key={row.label}
                    title={row.label + ": " + row.visitors + " visitors"}
                  >
                    <span
                      style={{
                        height: Math.max(
                          1,
                          (row.visitors /
                            Math.max(
                              1,
                              ...data.trend.map((point) => point.visitors),
                            )) *
                            150,
                        ),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <p className="small muted">
              The same visitor can appear in several rows. The period total
              counts each browser once. The first and last week or month may be
              partial.
            </p>
            <details>
              <summary>View figures as a table</summary>
              <div className="table-scroll">
                <table>
                  <caption>Traffic grouped by {data.group} in UTC</caption>
                  <thead>
                    <tr>
                      <th scope="col">Period starts</th>
                      <th scope="col">Visitors</th>
                      <th scope="col">Visits</th>
                      <th scope="col">Page views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.trend.map((row) => (
                      <tr key={row.label}>
                        <th scope="row">{row.label}</th>
                        <td>{row.visitors}</td>
                        <td>{row.sessions}</td>
                        <td>{row.pageViews}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </section>
          <div className="analytics-grid">
            <Ranking
              title="Most searched tools"
              rows={data.topSearched}
              note="Selected tool or first catalogue result for each submitted search. Raw search text is not stored."
            />
            <Ranking title="Most viewed tools" rows={data.topViewed} />
            <Ranking title="Most visited pages" rows={data.pages} />
            <Ranking
              title="Most used filters"
              rows={data.filters}
              note="Counts filters being enabled."
            />
            <Ranking
              title="Tools receiving outbound clicks"
              rows={data.outboundTools}
            />
            <Ranking
              title="Entry referrers"
              rows={data.referrers}
              note="Sessions by referring domain. Direct includes missing or withheld referrers."
            />
            <Ranking
              title="Device size"
              rows={data.devices}
              note="Sessions by initial viewport size; no device fingerprinting."
            />
          </div>
          <p className="small muted">
            Only consenting browsers are measured. Cookie deletion, other
            devices, blockers and browser privacy signals affect the counts.
            Editors and recognised bots are excluded. Events are retained for{" "}
            {data.retentionDays} days. Statistics never influence recommendation
            scores.
          </p>
        </>
      )}
    </section>
  );
}
