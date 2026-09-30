import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sameOrigin, sessionCookie, tokenHash } from "@/lib/auth";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Origin denied." }, { status: 403 });
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  if (token)
    db()
      .prepare("DELETE FROM sessions WHERE token_hash=?")
      .run(tokenHash(token));
  jar.delete(sessionCookie);
  return Response.json({ ok: true });
}
