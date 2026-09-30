import { admin } from "@/lib/auth";
import { analyticsSummary, analyticsCsv } from "@/lib/analytics";
export async function GET(request: Request) {
  if (!(await admin()))
    return Response.json({ error: "Sign in required." }, { status: 401 });
  const params = new URL(request.url).searchParams;
  try {
    const data = analyticsSummary({
      range: params.get("range") ?? undefined,
      from: params.get("from") ?? undefined,
      to: params.get("to") ?? undefined,
      group: params.get("group") ?? undefined,
    });
    if (params.get("format") === "csv")
      return new Response(analyticsCsv(data), {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="analytics-' +
            data.from +
            "-to-" +
            data.to +
            '.csv"',
        },
      });
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "Choose a valid period within the last 180 days." },
      { status: 400 },
    );
  }
}
