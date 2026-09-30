export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const messages = {
  en: {
    unknown: "Unknown",
    verified: "Verified",
    search: "Find an alternative to",
    noResults: "No matching software",
  },
};
export function translate(
  key: keyof typeof messages.en,
  locale: Locale = defaultLocale,
) {
  return messages[locale][key];
}
