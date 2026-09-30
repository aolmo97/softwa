import { db } from "@/lib/db";
export async function GET() {
  try {
    const row = db()
      .prepare("SELECT COUNT(*) AS count FROM software WHERE published=1")
      .get() as { count: number };
    return Response.json(
      { status: row.count ? "ok" : "empty", catalogue: row.count },
      {
        status: row.count ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
