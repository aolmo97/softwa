// Optional Google integrations. Both identifiers are read at runtime and are
// ignored unless they match Google's published formats, so a typo can never
// inject arbitrary markup or script URLs.
export function analyticsMeasurementId(
  value = process.env.GA_MEASUREMENT_ID,
): string | undefined {
  const id = value?.trim();
  return id && /^G-[A-Z0-9]{6,14}$/.test(id) ? id : undefined;
}
export function adsensePublisherId(
  value = process.env.ADSENSE_PUBLISHER_ID,
): string | undefined {
  const id = value?.trim().replace(/^ca-/, "");
  return id && /^pub-\d{10,20}$/.test(id) ? id : undefined;
}
// Authorised-seller declaration; f08c47fec0942fa0 is Google's fixed
// certification authority ID for AdSense.
export function adsTxt(publisher = adsensePublisherId()): string | undefined {
  return publisher
    ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`
    : undefined;
}
// The AdSense tag also delivers Google's consent message (the certified CMP).
// It is opt-in through ADSENSE_ENABLE_TAG=true. No ad unit is rendered by it:
// AdSlot stays disabled until the site is approved.
export function adsenseTagUrl(
  publisher = adsensePublisherId(),
  enabled = process.env.ADSENSE_ENABLE_TAG === "true",
): string | undefined {
  return publisher && enabled
    ? "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-" +
        publisher
    : undefined;
}
