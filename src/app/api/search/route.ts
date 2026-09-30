import { catalogue } from "@/lib/repository";
import { search } from "@/lib/discovery";
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  if (q.length > 100)
    return Response.json({ error: "Query is too long." }, { status: 400 });
  return Response.json(
    {
      results: search(catalogue(), q)
        .slice(0, 10)
        .map(({ slug, name, shortDescription, color }) => ({
          slug,
          name,
          shortDescription,
          color,
        })),
    },
    { headers: { "Cache-Control": "public, max-age=30" } },
  );
}
