import { db } from "./db";
import {
  softwareSchema,
  resourceSchemas,
  emptyFlags,
  type Software,
  type SoftwareInput,
  type Resource,
  type Taxonomy,
  type Relation,
  type Landing,
  type Affiliate,
} from "./model";
type Row = Record<string, string | number | null>;
export function catalogue(includeDrafts = false): Software[] {
  const d = db();
  const rows = d
    .prepare(
      "SELECT * FROM software " +
        (includeDrafts ? "" : "WHERE published=1 ") +
        "ORDER BY name",
    )
    .all() as Row[];
  const categories = d
    .prepare("SELECT * FROM software_categories")
    .all() as Row[];
  const platforms = d
    .prepare("SELECT * FROM software_platforms")
    .all() as Row[];
  const features = d.prepare("SELECT * FROM software_features").all() as Row[];
  const facts = d.prepare("SELECT * FROM software_facts").all() as Row[];
  const texts = d
    .prepare("SELECT * FROM software_text ORDER BY position")
    .all() as Row[];
  const plans = d.prepare("SELECT * FROM pricing_plans").all() as Row[];
  const sources = d.prepare("SELECT * FROM sources").all() as Row[];
  return rows.map((r) => {
    const slug = String(r.slug);
    const flagValues = emptyFlags();
    for (const f of facts.filter((f) => f.software === slug))
      flagValues[f.field as keyof typeof flagValues] =
        f.value === null ? null : !!f.value;
    const sourceValues = sources
      .filter((s) => s.software === slug)
      .map((s) => ({
        id: String(s.id),
        title: String(s.title),
        url: String(s.url),
        accessedAt: String(s.accessed_at),
        verifiedAt: s.verified_at as string | null,
        fields: JSON.parse(String(s.fields)) as string[],
        notes: String(s.notes),
        status: s.status as "VERIFIED" | "UNVERIFIED",
      }));
    const dates = sourceValues
      .filter((s) => s.status === "VERIFIED")
      .map((s) => s.verifiedAt)
      .filter((s): s is string => !!s)
      .sort();
    const txt = (kind: string) =>
      texts
        .filter((t) => t.software === slug && t.kind === kind)
        .map((t) => String(t.value));
    return {
      slug,
      name: String(r.name),
      shortDescription: String(r.short_description),
      description: String(r.description),
      company: r.company as string | null,
      website: String(r.website),
      logo: r.logo as string | null,
      color: String(r.color),
      pricingModel: r.pricing_model as Software["pricingModel"],
      license: r.license as string | null,
      published: !!r.published,
      premium: !!r.premium,
      sponsored: !!r.sponsored,
      version: Number(r.version),
      createdAt: String(r.created_at),
      updatedAt: String(r.updated_at),
      dataLastVerifiedAt: dates.at(-1) ?? null,
      flags: flagValues,
      categories: categories
        .filter((x) => x.software === slug)
        .map((x) => String(x.category)),
      platforms: platforms
        .filter((x) => x.software === slug)
        .map((x) => String(x.platform)),
      features: features
        .filter((x) => x.software === slug)
        .map((x) => String(x.feature)),
      aliases: txt("aliases"),
      pros: txt("pros"),
      cons: txt("cons"),
      useCases: txt("useCases"),
      plans: plans
        .filter((p) => p.software === slug)
        .map((p) => ({
          id: String(p.id),
          name: String(p.name),
          amount: p.amount as number | null,
          currency: p.currency as "USD" | "EUR" | "GBP" | null,
          period: p.period as Software["plans"][number]["period"],
          notes: String(p.notes),
        })),
      sources: sourceValues,
    };
  });
}
export function getSoftware(slug: string, includeDrafts = false) {
  return catalogue(includeDrafts).find((s) => s.slug === slug);
}
export function taxonomy(
  resource: "categories" | "features" | "platforms",
): Taxonomy[] {
  return db()
    .prepare("SELECT * FROM " + resource + " ORDER BY name")
    .all() as Taxonomy[];
}
export function relations(): Relation[] {
  return (db().prepare("SELECT * FROM relationships").all() as Row[]).map(
    (r) => ({
      id: String(r.id),
      from: String(r.from_slug),
      to: String(r.to_slug),
      reason: String(r.reason),
      comparison: !!r.comparison,
    }),
  );
}
export function landings(): Landing[] {
  return (db().prepare("SELECT * FROM landings").all() as Row[]).map((r) => ({
    id: String(r.id),
    software: String(r.software),
    filter: r.filter as Landing["filter"],
    title: String(r.title),
    intro: String(r.intro),
    guidance: String(r.guidance),
    published: !!r.published,
  }));
}
export function affiliates(): Affiliate[] {
  return (db().prepare("SELECT * FROM affiliates").all() as Row[]).map((r) => ({
    id: String(r.id),
    software: String(r.software),
    url: String(r.url),
    provider: String(r.provider),
    enabled: !!r.enabled,
    commissionNotes: String(r.commission_notes),
  }));
}
export function listResource(
  resource: Resource,
): Array<SoftwareInput | Taxonomy | Relation | Landing | Affiliate> {
  if (resource === "software")
    return catalogue(true).map(
      ({ createdAt: _c, updatedAt: _u, dataLastVerifiedAt: _d, ...s }) => {
        void _c;
        void _u;
        void _d;
        return s;
      },
    );
  if (resource === "relationships") return relations();
  if (resource === "landings") return landings();
  if (resource === "affiliates") return affiliates();
  return taxonomy(resource);
}
export class ConflictError extends Error {}
export function saveSoftware(input: SoftwareInput, actor: string) {
  return saveResource("software", input, actor);
}
export function saveResource(
  resource: Resource,
  input: unknown,
  actor: string,
) {
  const value = resourceSchemas[resource].parse(input);
  const key = "slug" in value ? value.slug : value.id;
  const d = db();
  return d.transaction(() => {
    const before = listResource(resource).find(
      (r) => ("slug" in r ? r.slug : r.id) === key,
    );
    if (resource === "software") {
      const s = softwareSchema.parse(value);
      if (before && "version" in before && before.version !== s.version)
        throw new ConflictError(
          "This product changed. Reload it before saving.",
        );
      if (!before && s.version !== 0)
        throw new ConflictError("New products must start at version 0.");
      const now = new Date().toISOString();
      if (s.license)
        d.prepare("INSERT OR IGNORE INTO licenses VALUES(?)").run(s.license);
      d.prepare(
        `INSERT INTO software VALUES(@slug,@name,@shortDescription,@description,@company,@website,@logo,@color,@pricingModel,@license,@published,@premium,@sponsored,@version,@createdAt,@updatedAt)
 ON CONFLICT(slug) DO UPDATE SET name=excluded.name,short_description=excluded.short_description,description=excluded.description,company=excluded.company,website=excluded.website,logo=excluded.logo,color=excluded.color,pricing_model=excluded.pricing_model,license=excluded.license,published=excluded.published,premium=excluded.premium,sponsored=excluded.sponsored,version=excluded.version,updated_at=excluded.updated_at`,
      ).run({
        ...s,
        published: +s.published,
        premium: +s.premium,
        sponsored: +s.sponsored,
        version: s.version + 1,
        createdAt: now,
        updatedAt: now,
      });
      for (const table of [
        "software_categories",
        "software_platforms",
        "software_features",
        "software_facts",
        "software_text",
        "pricing_plans",
        "sources",
      ])
        d.prepare("DELETE FROM " + table + " WHERE software=?").run(s.slug);
      for (const [table, items] of [
        ["software_categories", s.categories],
        ["software_platforms", s.platforms],
        ["software_features", s.features],
      ] as const)
        for (const id of items)
          d.prepare("INSERT INTO " + table + " VALUES(?,?)").run(s.slug, id);
      for (const [field, v] of Object.entries(s.flags))
        d.prepare("INSERT INTO software_facts VALUES(?,?,?)").run(
          s.slug,
          field,
          v === null ? null : +v,
        );
      for (const kind of ["aliases", "pros", "cons", "useCases"] as const)
        s[kind].forEach((v, i) =>
          d
            .prepare("INSERT INTO software_text VALUES(?,?,?,?)")
            .run(s.slug, kind, i, v),
        );
      for (const p of s.plans)
        d.prepare("INSERT INTO pricing_plans VALUES(?,?,?,?,?,?,?)").run(
          s.slug,
          p.id,
          p.name,
          p.amount,
          p.currency,
          p.period,
          p.notes,
        );
      for (const p of s.sources)
        d.prepare("INSERT INTO sources VALUES(?,?,?,?,?,?,?,?,?)").run(
          s.slug,
          p.id,
          p.title,
          p.url,
          p.accessedAt,
          p.verifiedAt,
          JSON.stringify(p.fields),
          p.notes,
          p.status,
        );
    } else if (
      resource === "categories" ||
      resource === "platforms" ||
      resource === "features"
    ) {
      const v = value as Taxonomy;
      d.prepare(
        "INSERT INTO " +
          resource +
          " VALUES(?,?,?) ON CONFLICT(slug) DO UPDATE SET name=excluded.name,description=excluded.description",
      ).run(v.slug, v.name, v.description);
    } else if (resource === "relationships") {
      const v = value as Relation;
      d.prepare(
        "INSERT INTO relationships VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET from_slug=excluded.from_slug,to_slug=excluded.to_slug,reason=excluded.reason,comparison=excluded.comparison",
      ).run(v.id, v.from, v.to, v.reason, +v.comparison);
    } else if (resource === "landings") {
      const v = value as Landing;
      d.prepare(
        "INSERT INTO landings VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET software=excluded.software,filter=excluded.filter,title=excluded.title,intro=excluded.intro,guidance=excluded.guidance,published=excluded.published",
      ).run(
        v.id,
        v.software,
        v.filter,
        v.title,
        v.intro,
        v.guidance,
        +v.published,
      );
    } else {
      const v = value as Affiliate;
      d.prepare(
        "INSERT INTO affiliates VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET software=excluded.software,url=excluded.url,provider=excluded.provider,enabled=excluded.enabled,commission_notes=excluded.commission_notes",
      ).run(v.id, v.software, v.url, v.provider, +v.enabled, v.commissionNotes);
    }
    const after = listResource(resource).find(
      (r) => ("slug" in r ? r.slug : r.id) === key,
    );
    d.prepare(
      "INSERT INTO change_history(resource,record_id,actor,before_json,after_json,created_at) VALUES(?,?,?,?,?,?)",
    ).run(
      resource,
      key,
      actor,
      before ? JSON.stringify(before) : null,
      JSON.stringify(after),
      new Date().toISOString(),
    );
    return after;
  })();
}
export function history() {
  return db()
    .prepare("SELECT * FROM change_history ORDER BY id DESC LIMIT 100")
    .all();
}
