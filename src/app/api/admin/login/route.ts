import { z } from "zod";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  sameOrigin,
  readJson,
  rateLimit,
  verifyPassword,
  createSession,
  sessionCookie,
  secureCookie,
  passwordHash,
} from "@/lib/auth";
const schema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(40)
      .regex(/^[a-z0-9-]+$/),
    password: z.string().min(1).max(200),
  })
  .strict();
const dummy = passwordHash("timing-only-placeholder-not-an-account");
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Origin denied." }, { status: 403 });
  if (!rateLimit("login-global", 30, 15 * 60000))
    return Response.json(
      { error: "Too many sign-in attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  try {
    const parsed = schema.safeParse(await readJson(request, 2000));
    if (!parsed.success)
      return Response.json({ error: "Invalid credentials." }, { status: 401 });
    const { username, password } = parsed.data;
    if (!rateLimit("login:" + username, 8, 15 * 60000))
      return Response.json(
        { error: "Too many sign-in attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    const row = db()
      .prepare("SELECT password_hash FROM admins WHERE id=?")
      .get(username) as { password_hash: string } | undefined;
    const valid = verifyPassword(password, row?.password_hash ?? dummy);
    if (!row || !valid)
      return Response.json({ error: "Invalid credentials." }, { status: 401 });
    const token = createSession(username);
    (await cookies()).set(sessionCookie, token, {
      httpOnly: true,
      secure: secureCookie(),
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 3600,
    });
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
