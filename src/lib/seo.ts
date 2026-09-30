import type { Metadata } from "next";
import type { SoftwareInput } from "./model";
export function siteUrl() {
  const value = process.env.SITE_URL ?? "http://localhost:3000";
  return new URL(value).origin;
}
export function metadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: siteUrl() + path },
    robots: { index: !noindex, follow: true },
    openGraph: {
      title,
      description,
      url: siteUrl() + path,
      siteName: "Software Alternative",
      type: "website",
      locale: "en_US",
      images: [{ url: "/og", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
export function softwareJson(s: SoftwareInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: s.name,
    description: s.shortDescription,
    url: siteUrl() + "/software/" + s.slug,
    sameAs: s.website,
    applicationCategory: s.categories[0],
    ...(s.platforms.length ? { operatingSystem: s.platforms.join(", ") } : {}),
    ...(s.license ? { license: s.license } : {}),
    ...(s.logo ? { image: s.logo } : {}),
  };
}
export function itemList(items: SoftwareInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: siteUrl() + "/software/" + s.slug,
    })),
  };
}
export function articleJson(a: {
  title: string;
  description: string;
  path: string;
  published: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.published,
    dateModified: a.published,
    mainEntityOfPage: siteUrl() + a.path,
    author: { "@type": "Organization", name: "Software Alternative" },
    publisher: { "@type": "Organization", name: "Software Alternative" },
  };
}
