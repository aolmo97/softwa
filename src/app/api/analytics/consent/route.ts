import { cookies } from "next/headers";
import { z } from "zod";
import { readJson, sameOrigin, secureCookie } from "@/lib/auth";
import {
  consentCookie,
  visitorCookie,
  analyticsSessionCookie,
  retentionDays,
} from "@/lib/analytics";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Origin denied." }, { status: 403 });
  try {
    const { choice } = z
      .object({ choice: z.enum(["accepted", "declined"]) })
      .strict()
      .parse(await readJson(request, 500));
    const jar = await cookies();
    const options = {
      sameSite: "lax" as const,
      secure: secureCookie(),
      path: "/",
    };
    jar.set(consentCookie, choice, {
      ...options,
      maxAge: retentionDays * 86400,
    });
    if (choice === "declined")
      for (const name of [visitorCookie, analyticsSessionCookie])
        jar.set(name, "", { ...options, httpOnly: true, maxAge: 0 });
    return Response.json(
      { choice },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Invalid preference." }, { status: 400 });
  }
}
