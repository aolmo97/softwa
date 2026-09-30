import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";
export const sessionCookie = "sa_admin";
export const secureCookie = () => process.env.COOKIE_SECURE !== "false";
export function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
export function verifyPassword(password: string, hash: string) {
  const [salt, stored] = hash.split(":");
  if (!salt || !stored) return false;
  const expected = Buffer.from(stored, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export function createSession(admin: string) {
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db()
    .prepare("INSERT INTO sessions VALUES(?,?,?)")
    .run(tokenHash(token), admin, Date.now() + 8 * 60 * 60 * 1000);
  return token;
}
export function sessionFor(token: string | undefined) {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = db()
    .prepare(
      "SELECT admin_id FROM sessions WHERE token_hash=? AND expires_at>?",
    )
    .get(tokenHash(token), Date.now()) as { admin_id: string } | undefined;
  return row?.admin_id ?? null;
}
export async function admin() {
  return sessionFor((await cookies()).get(sessionCookie)?.value);
}
export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
  now = Date.now(),
) {
  return db().transaction(() => {
    db().prepare("DELETE FROM rate_limits WHERE reset_at < ?").run(now);
    const row = db()
      .prepare("SELECT count FROM rate_limits WHERE key=?")
      .get(key) as { count: number } | undefined;
    if (row && row.count >= max) return false;
    db()
      .prepare(
        "INSERT INTO rate_limits VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
      )
      .run(key, now + windowMs);
    return true;
  })();
}
export function sameOrigin(request: Request) {
  const expected = new URL(process.env.SITE_URL ?? request.url).origin;
  return request.headers.get("origin") === expected;
}
export async function readJson(request: Request, maxBytes = 100000) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("Expected application/json");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new Error("Request too large");
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } finally {
    await reader.cancel();
  }
}
