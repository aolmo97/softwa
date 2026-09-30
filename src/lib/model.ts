import { z } from "zod";
export const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .refine((v) => !v.includes("-vs-"), "Slugs cannot contain -vs-");
export const flags = [
  "freePlan",
  "freeTrial",
  "openSource",
  "selfHosted",
  "offlineSupport",
  "apiAvailable",
  "aiFeatures",
  "cloud",
  "commercialUse",
  "beginnerFriendly",
  "professional",
] as const;
export type Flag = (typeof flags)[number];
export const flagLabels: Record<Flag, string> = {
  freePlan: "Free plan",
  freeTrial: "Free trial",
  openSource: "Open source",
  selfHosted: "Self-hosted",
  offlineSupport: "Offline",
  apiAvailable: "API",
  aiFeatures: "AI features",
  cloud: "Cloud",
  commercialUse: "Commercial use",
  beginnerFriendly: "Beginner friendly",
  professional: "Professional",
};
export const safeUrl = z
  .string()
  .url()
  .max(2000)
  .refine((v) => {
    const u = new URL(v);
    return u.protocol === "https:" && !u.username && !u.password;
  }, "Use an HTTPS URL without credentials");
const text = z.string().trim().min(1).max(200);
const bools = Object.fromEntries(
  flags.map((k) => [k, z.boolean().nullable()]),
) as Record<Flag, z.ZodNullable<z.ZodBoolean>>;
export const sourceSchema = z
  .object({
    id: slugSchema,
    title: text,
    url: safeUrl,
    accessedAt: z.iso.date(),
    verifiedAt: z.iso.date().nullable(),
    fields: z.array(z.string().min(1).max(120)).min(1).max(100),
    notes: z.string().max(2000),
    status: z.enum(["VERIFIED", "UNVERIFIED"]),
  })
  .strict()
  .superRefine((v, c) => {
    const today = new Date().toISOString().slice(0, 10);
    if (
      v.accessedAt > today ||
      (v.verifiedAt && (v.verifiedAt > v.accessedAt || v.verifiedAt > today))
    )
      c.addIssue({
        code: "custom",
        message: "Verification dates must not be in the future or after access",
        path: ["verifiedAt"],
      });
    if (v.status === "VERIFIED" && !v.verifiedAt)
      c.addIssue({
        code: "custom",
        message: "Verified evidence needs a verification date",
        path: ["verifiedAt"],
      });
  });
export const planSchema = z
  .object({
    id: slugSchema,
    name: text,
    amount: z.number().min(0).max(1000000).nullable(),
    currency: z.enum(["USD", "EUR", "GBP"]).nullable(),
    period: z.enum(["free", "month", "year", "one-time", "unknown"]),
    notes: z.string().max(500),
  })
  .strict()
  .refine(
    (v) => v.amount === null || v.currency !== null,
    "Known prices require a currency",
  );
export const softwareSchema = z
  .object({
    slug: slugSchema,
    name: text,
    shortDescription: z.string().min(12).max(220),
    description: z.string().min(20).max(4000),
    company: z.string().max(160).nullable(),
    website: safeUrl,
    logo: safeUrl.nullable(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    aliases: z.array(text).max(15),
    categories: z.array(slugSchema).min(1).max(5),
    flags: z.object(bools).strict(),
    platforms: z.array(slugSchema).max(20),
    features: z.array(slugSchema).max(30),
    pricingModel: z.enum([
      "free",
      "freemium",
      "subscription",
      "one-time",
      "unknown",
    ]),
    license: z.string().max(100).nullable(),
    plans: z.array(planSchema).max(20),
    pros: z.array(z.string().min(1).max(300)).max(10),
    cons: z.array(z.string().min(1).max(300)).max(10),
    useCases: z.array(text).max(12),
    sources: z.array(sourceSchema).min(1).max(30),
    published: z.boolean(),
    premium: z.boolean(),
    sponsored: z.boolean(),
    version: z.number().int().nonnegative(),
  })
  .strict()
  .superRefine((v, c) => {
    const verified = new Set(
      v.sources
        .filter((s) => s.status === "VERIFIED" && s.verifiedAt)
        .flatMap((s) => s.fields),
    );
    const fields = [
      ...(v.published ? ["description"] : []),
      ...flags.filter((k) => v.flags[k] !== null),
      ...v.platforms.map((k) => "platform:" + k),
      ...v.features.map((k) => "feature:" + k),
      ...v.plans
        .filter((p) => p.amount !== null || p.period !== "unknown")
        .map((p) => "plan:" + p.id),
    ];
    if (v.pricingModel !== "unknown") fields.push("pricingModel");
    if (v.license !== null) fields.push("license");
    for (const field of fields)
      if (!verified.has(field))
        c.addIssue({
          code: "custom",
          message: "Known fact requires verified source: " + field,
          path: ["sources"],
        });
    for (const key of [
      "categories",
      "platforms",
      "features",
      "aliases",
    ] as const)
      if (new Set(v[key]).size !== v[key].length)
        c.addIssue({
          code: "custom",
          message: "Duplicate " + key,
          path: [key],
        });
    for (const key of ["sources", "plans"] as const)
      if (new Set(v[key].map((x) => x.id)).size !== v[key].length)
        c.addIssue({ code: "custom", message: "Duplicate IDs", path: [key] });
  });
export type SoftwareInput = z.infer<typeof softwareSchema>;
export type Software = SoftwareInput & {
  createdAt: string;
  updatedAt: string;
  dataLastVerifiedAt: string | null;
};
export type Source = z.infer<typeof sourceSchema>;
export const taxonomySchema = z
  .object({ slug: slugSchema, name: text, description: z.string().max(500) })
  .strict();
export type Taxonomy = z.infer<typeof taxonomySchema>;
export const relationSchema = z
  .object({
    id: slugSchema,
    from: slugSchema,
    to: slugSchema,
    reason: z.string().min(20).max(1000),
    comparison: z.boolean(),
  })
  .strict()
  .refine((v) => v.from !== v.to, "Select two different products");
export type Relation = z.infer<typeof relationSchema>;
export const filterIds = [
  "free",
  "paid",
  "open-source",
  "windows",
  "macos",
  "linux",
  "web",
  "android",
  "ios",
  "one-time",
  "subscription",
  "no-subscription",
  "ai",
  "offline",
  "self-hosted",
  "cloud",
  "commercial",
  "beginner",
  "professional",
] as const;
export type FilterId = (typeof filterIds)[number];
export const landingSchema = z
  .object({
    id: slugSchema,
    software: slugSchema,
    filter: z.enum(filterIds),
    title: text,
    intro: z.string().min(120).max(3000),
    guidance: z.string().min(120).max(3000),
    published: z.boolean(),
  })
  .strict();
export type Landing = z.infer<typeof landingSchema>;
export const affiliateSchema = z
  .object({
    id: slugSchema,
    software: slugSchema,
    url: safeUrl,
    provider: text,
    enabled: z.boolean(),
    commissionNotes: z.string().max(1000),
  })
  .strict();
export type Affiliate = z.infer<typeof affiliateSchema>;
export const resourceSchemas = {
  software: softwareSchema,
  categories: taxonomySchema,
  platforms: taxonomySchema,
  features: taxonomySchema,
  relationships: relationSchema,
  landings: landingSchema,
  affiliates: affiliateSchema,
};
export type Resource = keyof typeof resourceSchemas;
export function isResource(v: string): v is Resource {
  return Object.hasOwn(resourceSchemas, v);
}
export function slugify(v: string) {
  return v
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export const emptyFlags = () =>
  Object.fromEntries(flags.map((k) => [k, null])) as Record<
    Flag,
    boolean | null
  >;
export function known(v: boolean | null) {
  return v === null ? "Unknown" : v ? "Yes" : "No";
}
export function pricing(s: SoftwareInput) {
  const p =
    s.plans.find((p) => p.amount === 0) ??
    s.plans.find((p) => p.amount !== null);
  return p
    ? new Intl.NumberFormat("en", {
        style: "currency",
        currency: p.currency ?? "USD",
        maximumFractionDigits: 2,
      }).format(p.amount!) +
        (p.period === "month"
          ? "/mo"
          : p.period === "year"
            ? "/yr"
            : p.period === "one-time"
              ? " once"
              : "")
    : s.flags.freePlan === true
      ? "Free plan"
      : "Price unverified";
}
