import { cookies } from "next/headers";
import {
  admin,
  readJson,
  rateLimit,
  sameOrigin,
  secureCookie,
} from "@/lib/auth";
import {
  analyticsInputSchema,
  analyticsSessionCookie,
  consentCookie,
  newVisitorToken,
  recordEvent,
  validToken,
  visitorCookie,
  visitorHash,
  retentionDays,
} from "@/lib/analytics";

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Origin denied." }, { status: 403 });
  const jar = await cookies();
  if (
    jar.get(consentCookie)?.value !== "accepted" ||
    request.headers.get("dnt") === "1" ||
    request.headers.get("sec-gpc") === "1" ||
    /bot|spider|crawler|preview/i.test(
      request.headers.get("user-agent") ?? "",
    ) ||
    (await admin())
  )
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  try {
    const parsed = analyticsInputSchema.safeParse(
      await readJson(request, 2500),
    );
    if (!parsed.success)
      return Response.json({ error: "Invalid event." }, { status: 400 });
    const previousVisitor = jar.get(visitorCookie)?.value;
    const previousSession = jar.get(analyticsSessionCookie)?.value;
    const visitor = validToken(previousVisitor)
      ? previousVisitor
      : newVisitorToken();
    const session = validToken(previousSession)
      ? previousSession
      : newVisitorToken();
    if (
      !rateLimit("analytics-global", 6000, 60000) ||
      !rateLimit("analytics:" + visitorHash(visitor), 240, 60000)
    )
      return Response.json({ error: "Rate limited." }, { status: 429 });
    const recorded = recordEvent(parsed.data, visitor, session);
    if (recorded) {
      const options = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: secureCookie(),
        path: "/",
      };
      if (!validToken(previousVisitor))
        jar.set(visitorCookie, visitor, {
          ...options,
          maxAge: retentionDays * 86400,
        });
      jar.set(analyticsSessionCookie, session, { ...options, maxAge: 30 * 60 });
    }
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "Unable to record event." }, { status: 400 });
  }
}
