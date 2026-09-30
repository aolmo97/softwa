import type { Flag, SoftwareInput, Source } from "./model";
import { content0 } from "./catalogue-content-0";
import { content1 } from "./catalogue-content-1";
import { content2 } from "./catalogue-content-2";

export type CatalogueContent = {
  company: string;
  description: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  plans?: SoftwareInput["plans"];
  pricingModel?: SoftwareInput["pricingModel"];
  license?: string;
  facts?: Partial<Record<Flag, boolean>>;
  platforms?: string[];
  features?: string[];
  url: string;
  pricingUrl?: string;
  platformUrl?: string;
  extraUrl?: string;
  note: string;
};
export const CONTENT_REVISION = "catalogue-review-2026-09-29";
export const catalogueContent = { ...content0, ...content1, ...content2 };

export function enrichProduct(original: SoftwareInput): SoftwareInput {
  const content = catalogueContent[original.slug];
  if (!content) return original;
  const source = (id: string, title: string, url: string, fields: string[]): Source => ({
    id, title, url, fields,
    accessedAt: "2026-09-29",
    verifiedAt: "2026-09-29",
    status: "VERIFIED",
    notes: content.note,
  });
  const coreFields = [
    "description", "company", "pros", "cons", "useCases",
    ...(content.license ? ["license"] : []),
    ...Object.keys(content.facts ?? {}),
    ...(content.features ?? []).map((f) => "feature:" + f),
  ];
  const planFields = [
    ...(content.pricingModel ? ["pricingModel"] : []),
    ...(content.plans ?? []).map((p) => "plan:" + p.id),
  ];
  const platformFields = (content.platforms ?? []).map((p) => "platform:" + p);
  const reviewed: Source[] = [
    source(CONTENT_REVISION, original.name + " — product and editorial review", content.url, [
      ...coreFields,
      ...(!content.pricingUrl ? planFields : []),
      ...(!content.platformUrl ? platformFields : []),
    ]),
  ];
  if (content.pricingUrl) reviewed.push(source(CONTENT_REVISION + "-plans", original.name + " — plans and limits", content.pricingUrl, [...planFields, "pros", "cons"]));
  if (content.platformUrl) reviewed.push(source(CONTENT_REVISION + "-platforms", original.name + " — downloads and requirements", content.platformUrl, platformFields));
  if (content.extraUrl) reviewed.push(source(CONTENT_REVISION + "-context", original.name + " — additional product documentation", content.extraUrl, ["description", "pros", "cons", ...(original.slug === "discord" ? ["freePlan", "plan:base", "pricingModel"] : [])]));
  return {
    ...original,
    company: content.company,
    description: content.description,
    pros: content.pros,
    cons: content.cons,
    useCases: content.useCases,
    plans: content.plans ?? original.plans,
    pricingModel: content.pricingModel ?? original.pricingModel,
    license: content.license ?? original.license,
    flags: { ...original.flags, ...content.facts },
    platforms: [...new Set([...original.platforms, ...(content.platforms ?? [])])],
    features: [...new Set([...original.features, ...(content.features ?? [])])],
    sources: [...original.sources, ...reviewed],
  };
}
