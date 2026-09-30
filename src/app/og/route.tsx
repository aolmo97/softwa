import { ImageResponse } from "next/og";
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#edf2e6",
          padding: "75px",
          color: "#182e29",
        }}
      >
        <div style={{ fontSize: 34, marginBottom: 65 }}>
          ↗ softwarealternative.
        </div>
        <div style={{ fontSize: 80, lineHeight: 1.1 }}>Find your next</div>
        <div style={{ fontSize: 86, lineHeight: 1.2, color: "#467455" }}>
          favorite tool.
        </div>
        <div style={{ fontSize: 27, marginTop: 55, color: "#63716a" }}>
          Discover. Compare. Find your fit.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400" },
    },
  );
}
