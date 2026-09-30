import { describe, it, expect } from "vitest";
import {
  adsTxt,
  adsensePublisherId,
  analyticsMeasurementId,
} from "../src/lib/google";

describe("optional Google integrations", () => {
  it("accepts only well-formed GA4 measurement IDs", () => {
    expect(analyticsMeasurementId("G-EKBRTT19R2")).toBe("G-EKBRTT19R2");
    expect(analyticsMeasurementId(" G-EKBRTT19R2 ")).toBe("G-EKBRTT19R2");
    for (const bad of [
      undefined,
      "",
      "UA-12345-1",
      "g-ekbrtt19r2",
      'G-ABC123"><script>',
      "G-",
    ])
      expect(analyticsMeasurementId(bad)).toBeUndefined();
  });
  it("normalises AdSense publisher IDs and rejects malformed ones", () => {
    expect(adsensePublisherId("pub-8400214805838883")).toBe(
      "pub-8400214805838883",
    );
    expect(adsensePublisherId("ca-pub-8400214805838883")).toBe(
      "pub-8400214805838883",
    );
    for (const bad of [undefined, "", "8400214805838883", "pub-12", "pub-abc"])
      expect(adsensePublisherId(bad)).toBeUndefined();
  });
  it("builds ads.txt only for a valid publisher", () => {
    expect(adsTxt("pub-8400214805838883")).toBe(
      "google.com, pub-8400214805838883, DIRECT, f08c47fec0942fa0\n",
    );
    expect(adsTxt(undefined)).toBeUndefined();
  });
});
