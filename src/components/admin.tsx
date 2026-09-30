"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { flags, flagLabels, emptyFlags, type Resource } from "@/lib/model";
import { AnalyticsDashboard } from "./analytics-dashboard";
type RecordValue = Record<string, unknown>;
const resources: Resource[] = [
  "software",
  "categories",
  "features",
  "platforms",
  "relationships",
  "affiliates",
  "landings",
];
const keyOf = (r: RecordValue) => String(r.slug ?? r.id ?? "");
function template(resource: Resource): RecordValue {
  if (resource === "software")
    return {
      slug: "new-product",
      name: "New product",
      shortDescription: "Description awaiting editorial review.",
      description: "Editorial description awaiting source verification.",
      company: null,
      website: "https://example.com",
      logo: null,
      color: "#255c48",
      aliases: [],
      categories: ["productivity"],
      flags: emptyFlags(),
      platforms: [],
      features: [],
      pricingModel: "unknown",
      license: null,
      plans: [],
      pros: [],
      cons: [],
      useCases: [],
      sources: [
        {
          id: "official",
          title: "Official source",
          url: "https://example.com",
          accessedAt: new Date().toISOString().slice(0, 10),
          verifiedAt: null,
          fields: ["description"],
          notes: "Awaiting verification.",
          status: "UNVERIFIED",
        },
      ],
      published: false,
      premium: false,
      sponsored: false,
      version: 0,
    };
  if (["categories", "features", "platforms"].includes(resource))
    return { slug: "new-entry", name: "New entry", description: "" };
  if (resource === "relationships")
    return {
      id: "new-relationship",
      from: "photoshop",
      to: "gimp",
      reason:
        "Describe the specific shared workflow and the limits of this alternative.",
      comparison: false,
    };
  if (resource === "affiliates")
    return {
      id: "new-program",
      software: "gimp",
      url: "https://example.com",
      provider: "Provider name",
      enabled: false,
      commissionNotes: "",
    };
  return {
    id: "new-guide",
    software: "photoshop",
    filter: "free",
    title: "Editorial guide title",
    intro: "",
    guidance: "",
    published: false,
  };
}
export function Login() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel login-panel" onSubmit={submit}>
      <span className="eyebrow">EDITORIAL WORKSPACE</span>
      <h1 style={{ fontSize: 30 }}>Welcome back.</h1>
      <p>Sign in to manage the catalogue.</p>
      <label className="form-field">
        Username
        <input
          name="username"
          autoComplete="username"
          required
          maxLength={40}
        />
      </label>
      <label className="form-field">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
        />
      </label>
      <button type="submit" className="button" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      {error && (
        <p role="alert" className="form-message error-message">
          {error}
        </p>
      )}
    </form>
  );
}
export function AdminEditor({
  initial,
  history,
}: {
  initial: RecordValue[];
  history: RecordValue[];
}) {
  const router = useRouter();
  const [resource, setResource] = useState<Resource>("software");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [items, setItems] = useState(initial.slice(0, 10));
  const [total, setTotal] = useState(initial.length);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [review, setReview] = useState(false);
  const [text, setText] = useState(
    JSON.stringify(initial[0] ?? template("software"), null, 2),
  );
  const [selected, setSelected] = useState(keyOf(initial[0] ?? {}));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  let record: RecordValue | null = null;
  try {
    record = JSON.parse(text);
  } catch {}
  function update(key: string, value: unknown) {
    if (record) setText(JSON.stringify({ ...record, [key]: value }, null, 2));
  }
  async function load(r = resource, p = 1, q = query, rev = review) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        "/api/admin/" +
          r +
          "?" +
          new URLSearchParams({ q, page: String(p), review: String(rev) }),
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "Loading failed.");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    setMessage("");
    setError(false);
    try {
      const body = JSON.parse(text);
      const response = await fetch("/api/admin/" + resource, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setText(JSON.stringify(data.item, null, 2));
      setSelected(keyOf(data.item));
      await load();
      setMessage("Saved. Changes and evidence recorded in the audit history.");
      router.refresh();
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "Invalid data.");
    } finally {
      setBusy(false);
    }
  }
  function switchResource(r: Resource) {
    setResource(r);
    setSelected("");
    setText(JSON.stringify(template(r), null, 2));
    setQuery("");
    setReview(false);
    void load(r, 1, "", false);
  }
  return (
    <>
      <div className="results-toolbar">
        <div>
          <span className="eyebrow">EDITORIAL WORKSPACE</span>
          <h1 style={{ fontSize: 36 }}>
            {showAnalytics ? "Site analytics" : "Catalogue manager"}
          </h1>
        </div>
        <button
          className="button secondary"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            router.refresh();
          }}
        >
          Sign out
        </button>
      </div>
      <div className="admin-tabs" role="group" aria-label="Manage resource">
        <button
          aria-pressed={showAnalytics}
          onClick={() => setShowAnalytics(true)}
        >
          Analytics
        </button>
        {resources.map((r) => (
          <button
            key={r}
            aria-pressed={!showAnalytics && resource === r}
            onClick={() => {
              setShowAnalytics(false);
              switchResource(r);
            }}
          >
            {r}
          </button>
        ))}
      </div>
      {showAnalytics ? (
        <AnalyticsDashboard />
      ) : (
        <>
          <div className="admin-layout">
            <aside className="panel">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void load();
                }}
              >
                <label className="form-field">
                  Search records
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    maxLength={100}
                  />
                </label>
                {resource === "software" && (
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={review}
                      onChange={(e) => setReview(e.target.checked)}
                    />
                    Needs verification
                  </label>
                )}
                <button
                  className="button secondary"
                  type="submit"
                  disabled={busy}
                >
                  Search / filter
                </button>
              </form>
              <p className="small">{total} records</p>
              <button
                className="button"
                onClick={() => {
                  setSelected("");
                  setText(JSON.stringify(template(resource), null, 2));
                  setMessage("");
                }}
              >
                Create {resource === "software" ? "software" : "record"}
              </button>
              <div className="admin-list">
                {items.map((r) => (
                  <button
                    key={keyOf(r)}
                    aria-pressed={selected === keyOf(r)}
                    onClick={() => {
                      setText(JSON.stringify(r, null, 2));
                      setSelected(keyOf(r));
                      setMessage("");
                    }}
                  >
                    {String(r.name ?? r.title ?? keyOf(r))}
                    <small>
                      {keyOf(r)}
                      {"published" in r
                        ? r.published
                          ? " · Published"
                          : " · Draft"
                        : ""}
                    </small>
                  </button>
                ))}
              </div>
              <div className="pagination">
                <button
                  disabled={page <= 1 || busy}
                  onClick={() => load(resource, page - 1)}
                >
                  ←
                </button>
                <span>
                  {page} / {Math.ceil(total / 10) || 1}
                </span>
                <button
                  disabled={page * 10 >= total || busy}
                  onClick={() => load(resource, page + 1)}
                >
                  →
                </button>
              </div>
            </aside>
            <section className="panel" style={{ margin: 0 }}>
              <h2>{selected ? "Edit record" : "Create a record"}</h2>
              <p className="admin-help">
                IDs reference existing catalogue entries. Software slugs are
                permanent. Save taxonomy entries before referencing them.
                Published facts need verified evidence; use null for unknown
                fields.
              </p>
              {record && (
                <div className="form-grid">
                  {Object.entries(record)
                    .filter(
                      ([key, value]) =>
                        ["string", "boolean", "number"].includes(
                          typeof value,
                        ) &&
                        ![
                          "description",
                          "intro",
                          "guidance",
                          "reason",
                          "version",
                        ].includes(key),
                    )
                    .map(([key, value]) =>
                      typeof value === "boolean" ? (
                        <label className="checkbox" key={key}>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => update(key, e.target.checked)}
                          />
                          {key}
                        </label>
                      ) : (
                        <label className="form-field" key={key}>
                          {key}
                          <input
                            value={String(value)}
                            readOnly={
                              !!selected && ["slug", "id"].includes(key)
                            }
                            onChange={(e) =>
                              update(
                                key,
                                typeof value === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                          />
                        </label>
                      ),
                    )}
                  {["description", "intro", "guidance", "reason"]
                    .filter((k) => typeof record![k] === "string")
                    .map((k) => (
                      <label key={k} className="form-field span-two">
                        {k}
                        <textarea
                          value={String(record![k])}
                          onChange={(e) => update(k, e.target.value)}
                        />
                      </label>
                    ))}
                </div>
              )}
              {resource === "software" && !!record?.flags && (
                <fieldset>
                  <legend>Verified capabilities</legend>
                  <div className="form-grid">
                    {flags.map((f) => (
                      <label className="form-field" key={f}>
                        {flagLabels[f]}
                        <select
                          value={String((record!.flags as RecordValue)[f])}
                          onChange={(e) =>
                            update("flags", {
                              ...(record!.flags as RecordValue),
                              [f]:
                                e.target.value === "null"
                                  ? null
                                  : e.target.value === "true",
                            })
                          }
                        >
                          <option value="null">Unknown</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <details open={resource !== "software"}>
                <summary>
                  Structured data: sources, pricing, features & relationships
                </summary>
                <p className="admin-help">
                  Edit the complete record below. Source fields use names such
                  as freePlan, platform:linux, feature:notes and plan:base.
                  Source status must be VERIFIED with a checked date before the
                  related fact can be published. Collections are JSON arrays.
                </p>
                <label className="form-field">
                  Record JSON
                  <textarea
                    className="code-editor"
                    value={text}
                    spellCheck={false}
                    onChange={(e) => setText(e.target.value)}
                  />
                </label>
              </details>
              {message && (
                <p
                  role={error ? "alert" : "status"}
                  className={"form-message" + (error ? " error-message" : "")}
                >
                  {message}
                </p>
              )}
              <button
                className="button"
                onClick={save}
                disabled={busy || !record}
              >
                {busy ? "Working…" : "Save record"}
              </button>
            </section>
          </div>
          <section>
            <h2>Recent changes</h2>
            <p className="small">
              Latest 100 audit records. Full before/after snapshots are retained
              in the database.
            </p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Record</th>
                    <th>Editor</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 15).map((r) => (
                    <tr key={String(r.id)}>
                      <td>{String(r.resource)}</td>
                      <td>{String(r.record_id)}</td>
                      <td>{String(r.actor)}</td>
                      <td>{String(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
