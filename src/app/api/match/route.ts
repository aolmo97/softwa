import { catalogue, relations } from "@/lib/repository";
import {
  alternativeCandidates,
  matchRequestSchema,
  recommend,
} from "@/lib/discovery";
import { rateLimit, readJson } from "@/lib/auth";
export async function POST(request: Request) {
  if (!rateLimit("match-global", 300, 60000))
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  try {
    const parsed = matchRequestSchema.safeParse(await readJson(request, 15000));
    if (!parsed.success)
      return Response.json(
        { error: "Invalid matching criteria." },
        { status: 400 },
      );
    const all = catalogue();
    if (!all.some((s) => s.slug === parsed.data.current))
      return Response.json(
        { error: "Choose a published product." },
        { status: 404 },
      );
    const items = alternativeCandidates(parsed.data.current, all, relations());
    const results = recommend(items, parsed.data.criteria);
    return Response.json(
      { results, excluded: items.length - results.length },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Unable to process matching request." },
      { status: 400 },
    );
  }
}
