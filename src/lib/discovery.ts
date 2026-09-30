import { z } from "zod";
import {
  flags,
  flagLabels,
  filterIds,
  type Flag,
  type FilterId,
  type SoftwareInput,
  type Relation,
  type Landing,
} from "./model";
export const filterLabels: Record<FilterId, string> = {
  free: "Free",
  paid: "Paid",
  "open-source": "Open source",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  web: "Web",
  android: "Android",
  ios: "iOS",
  "one-time": "One-time payment",
  subscription: "Subscription",
  "no-subscription": "No subscription",
  ai: "AI features",
  offline: "Offline",
  "self-hosted": "Self-hosted",
  cloud: "Cloud",
  commercial: "Commercial use",
  beginner: "Beginner friendly",
  professional: "Professional",
};
const filterFlags: Partial<Record<FilterId, Flag>> = {
  free: "freePlan",
  "open-source": "openSource",
  ai: "aiFeatures",
  offline: "offlineSupport",
  "self-hosted": "selfHosted",
  cloud: "cloud",
  commercial: "commercialUse",
  beginner: "beginnerFriendly",
  professional: "professional",
};
export function matchesFilter(s: SoftwareInput, id: FilterId) {
  const flag = filterFlags[id];
  if (flag) return s.flags[flag] === true;
  if (["windows", "macos", "linux", "web", "android", "ios"].includes(id))
    return s.platforms.includes(id);
  if (id === "paid")
    return ["subscription", "one-time", "freemium"].includes(s.pricingModel);
  if (id === "no-subscription")
    return (
      s.flags.freePlan === true ||
      s.pricingModel === "free" ||
      s.pricingModel === "one-time"
    );
  if (id === "one-time")
    return (
      s.pricingModel === "one-time" ||
      s.plans.some((p) => p.period === "one-time")
    );
  if (id === "subscription")
    return ["subscription", "freemium"].includes(s.pricingModel);
  return false;
}
export function parseFilters(value: string | string[] | undefined): FilterId[] {
  return [
    ...new Set(
      (Array.isArray(value) ? value.join(",") : (value ?? ""))
        .split(",")
        .filter((v): v is FilterId =>
          (filterIds as readonly string[]).includes(v),
        ),
    ),
  ];
}
export function filterSoftware<T extends SoftwareInput>(
  items: T[],
  filters: FilterId[],
) {
  return items.filter((s) => filters.every((f) => matchesFilter(s, f)));
}
function normalize(v: string) {
  return v
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}
export function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const prev = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = prev;
    }
  }
  return row[b.length];
}
export function search<
  T extends Pick<SoftwareInput, "name" | "slug" | "aliases">,
>(items: T[], query: string) {
  const q = normalize(query.slice(0, 100));
  if (!q) return items;
  return items
    .map((s) => {
      const terms = [s.name, s.slug, ...s.aliases].map(normalize);
      const rank = Math.max(
        ...terms.map((t) =>
          t === q
            ? 100
            : t.startsWith(q)
              ? 80
              : t.includes(q)
                ? 60
                : q.length >= 4 &&
                    distance(q, t) <= Math.min(2, Math.floor(q.length / 4))
                  ? 40
                  : 0,
        ),
      );
      return { s, rank };
    })
    .filter((r) => r.rank > 0)
    .sort((a, b) => b.rank - a.rank || a.s.slug.localeCompare(b.s.slug))
    .map((r) => r.s);
}
export const criterionSchema = z
  .object({
    kind: z.enum(["flag", "platform", "feature", "budget", "pricing"]),
    key: z.string().min(1).max(80),
    value: z.union([
      z.boolean(),
      z.number().min(0).max(1000000),
      z.string().max(80),
    ]),
    hard: z.boolean(),
    weight: z.number().finite().min(0.1).max(10),
  })
  .strict()
  .superRefine((v, c) => {
    const valid =
      v.kind === "flag"
        ? (flags as readonly string[]).includes(v.key) &&
          typeof v.value === "boolean"
        : v.kind === "budget"
          ? v.key === "USD" && typeof v.value === "number"
          : v.kind === "pricing"
            ? ["no-subscription", "one-time", "subscription"].includes(
                String(v.value),
              )
            : typeof v.value === "string" &&
              /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.value);
    if (!valid) c.addIssue({ code: "custom", message: "Invalid criterion" });
  });
export const matchRequestSchema = z
  .object({
    current: z.string().max(80),
    criteria: z.array(criterionSchema).max(30),
  })
  .strict()
  .superRefine((v, c) => {
    const ids = v.criteria.map((x) => {
      if (x.kind === "pricing") return "pricing:payment";
      if (x.kind === "platform" || x.kind === "feature")
        return x.kind + ":" + x.value;
      return x.kind + ":" + x.key;
    });
    if (new Set(ids).size !== ids.length)
      c.addIssue({ code: "custom", message: "Duplicate criteria" });
  });
export type Criterion = z.infer<typeof criterionSchema>;
export type Factor = {
  label: string;
  state: "met" | "unmet" | "unknown";
  weight: number;
  earned: number;
  penalty: number;
  hard: boolean;
};
export function evaluate(s: SoftwareInput, c: Criterion): Factor {
  let value: boolean | null = null;
  let label = c.key;
  if (c.kind === "flag") {
    label = flagLabels[c.key as Flag] + (c.value === false ? " absent" : "");
    const known = s.flags[c.key as Flag];
    value = known === null ? null : known === c.value;
  }
  if (c.kind === "platform") {
    label = filterLabels[c.value as FilterId] ?? String(c.value);
    value = s.platforms.includes(String(c.value)) ? true : null;
  }
  if (c.kind === "feature") {
    label = String(c.value).replaceAll("-", " ");
    value = s.features.includes(String(c.value)) ? true : null;
  }
  if (c.kind === "pricing") {
    label = filterLabels[c.value as FilterId];
    value = matchesFilter(s, c.value as FilterId)
      ? true
      : s.pricingModel === "unknown"
        ? null
        : false;
  }
  if (c.kind === "budget") {
    label = "Within US$" + c.value + "/month";
    if (s.flags.freePlan === true) value = true;
    else {
      const costs = s.plans
        .filter(
          (p) =>
            p.amount !== null &&
            p.currency === "USD" &&
            ["month", "year", "free"].includes(p.period),
        )
        .map((p) => p.amount! / (p.period === "year" ? 12 : 1));
      value = costs.length ? Math.min(...costs) <= Number(c.value) : null;
    }
  }
  return {
    label,
    state: value === null ? "unknown" : value ? "met" : "unmet",
    weight: c.weight,
    earned: value === true ? c.weight : 0,
    penalty: value === false ? c.weight * 0.25 : 0,
    hard: c.hard,
  };
}
export function score(s: SoftwareInput, criteria: Criterion[]) {
  const factors = criteria.map((c) => evaluate(s, criterionSchema.parse(c)));
  const total = factors.reduce((n, f) => n + f.weight, 0);
  const earned = factors.reduce((n, f) => n + f.earned - f.penalty, 0);
  return {
    eligible: factors.every((f) => !f.hard || f.state === "met"),
    score: total
      ? Math.max(0, Math.min(100, Math.round((100 * earned) / total)))
      : null,
    coverage: total
      ? Math.round(
          (100 *
            factors
              .filter((f) => f.state !== "unknown")
              .reduce((n, f) => n + f.weight, 0)) /
            total,
        )
      : 0,
    factors,
  };
}
export function alternativeCandidates<T extends SoftwareInput>(
  current: string,
  items: T[],
  relations: Relation[],
) {
  const ids = new Set(
    relations.flatMap((r) =>
      r.from === current ? [r.to] : r.to === current ? [r.from] : [],
    ),
  );
  return items.filter(
    (s) => s.published && s.slug !== current && ids.has(s.slug),
  );
}
export function recommend<T extends SoftwareInput>(
  items: T[],
  criteria: Criterion[],
) {
  return items
    .map((software) => ({ software, ...score(software, criteria) }))
    .filter((s) => s.eligible)
    .sort(
      (a, b) =>
        (b.score ?? -1) - (a.score ?? -1) ||
        b.coverage - a.coverage ||
        a.software.slug.localeCompare(b.software.slug),
    );
}
export function indexableLanding(landing: Landing, items: SoftwareInput[]) {
  return (
    landing.published &&
    landing.intro.length >= 120 &&
    landing.guidance.length >= 120 &&
    filterSoftware(items, [landing.filter]).length >= 3
  );
}
export function comparisonSlug(a: string, b: string) {
  return [a, b].sort().join("-vs-");
}
// Alternatives pages with a single candidate mostly repeat the comparison page,
// so they stay reachable but are not offered to search engines.
export const minIndexableAlternatives = 2;
export function indexableAlternatives(count: number) {
  return count >= minIndexableAlternatives;
}
// Facts grouped from verified records only. A missing value is never treated
// as "no": products without verified platforms are listed separately.
export function alternativeInsights(items: SoftwareInput[]) {
  const names = (test: (s: SoftwareInput) => boolean) =>
    items.filter(test).map((s) => s.name);
  const groups = [
    ["Free entry option", names((s) => s.flags.freePlan === true)],
    ["Open source", names((s) => s.flags.openSource === true)],
    ["Can be self-hosted", names((s) => s.flags.selfHosted === true)],
    ["Free trial", names((s) => s.flags.freeTrial === true)],
    ["Windows", names((s) => s.platforms.includes("windows"))],
    ["macOS", names((s) => s.platforms.includes("macos"))],
    ["Linux", names((s) => s.platforms.includes("linux"))],
    ["Web", names((s) => s.platforms.includes("web"))],
  ] as const;
  return {
    groups: groups
      .filter(([, list]) => list.length > 0)
      .map(([label, list]) => ({ label, names: list })),
    unverifiedPlatforms: names((s) => s.platforms.length === 0),
  };
}
