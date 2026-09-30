import { admin, sameOrigin, readJson } from "@/lib/auth";
import { isResource, resourceSchemas } from "@/lib/model";
import { listResource, saveResource, ConflictError } from "@/lib/repository";
type Context = { params: Promise<{ resource: string }> };
export async function GET(request: Request, { params }: Context) {
  if (!(await admin()))
    return Response.json({ error: "Sign in required." }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource))
    return Response.json({ error: "Unknown resource." }, { status: 404 });
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").toLowerCase().slice(0, 100);
  const review = url.searchParams.get("review") === "true";
  const list = listResource(resource)
    .filter((r) => JSON.stringify(r).toLowerCase().includes(q))
    .filter(
      (r) =>
        !review ||
        ("flags" in r &&
          (Object.values(r.flags).some((v) => v === null) ||
            r.sources.some(
              (s) =>
                s.status === "UNVERIFIED" ||
                !s.verifiedAt ||
                Date.now() - Date.parse(s.verifiedAt) > 90 * 86400000,
            ))),
    );
  const page = Math.max(
    1,
    Math.min(
      Math.ceil(list.length / 10) || 1,
      Number(url.searchParams.get("page")) || 1,
    ),
  );
  return Response.json(
    { items: list.slice((page - 1) * 10, page * 10), total: list.length, page },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request, { params }: Context) {
  if (!sameOrigin(request))
    return Response.json({ error: "Origin denied." }, { status: 403 });
  const actor = await admin();
  if (!actor)
    return Response.json({ error: "Sign in required." }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource))
    return Response.json({ error: "Unknown resource." }, { status: 404 });
  try {
    const parsed = resourceSchemas[resource].safeParse(await readJson(request));
    if (!parsed.success)
      return Response.json(
        {
          error: parsed.error.issues
            .map((i) => i.path.join(".") + ": " + i.message)
            .join("; "),
        },
        { status: 400 },
      );
    const item = saveResource(resource, parsed.data, actor);
    return Response.json(
      { item },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ConflictError)
      return Response.json({ error: error.message }, { status: 409 });
    return Response.json(
      {
        error:
          "Unable to save. Check referenced IDs, unique values and request format.",
      },
      { status: 400 },
    );
  }
}
