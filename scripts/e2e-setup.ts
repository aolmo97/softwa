import { db } from "../src/lib/db";
import { passwordHash } from "../src/lib/auth";
import { randomBytes } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
if (resolve(process.env.DATABASE_PATH ?? "") !== resolve(".tmp/e2e.sqlite"))
  throw new Error("E2E setup requires its isolated database");
const password = randomBytes(24).toString("hex");
db()
  .prepare(
    "INSERT INTO admins VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET password_hash=excluded.password_hash",
  )
  .run("e2e-editor", passwordHash(password), new Date().toISOString());
db().prepare("DELETE FROM rate_limits").run();
db().prepare("DELETE FROM sessions").run();
mkdirSync(".tmp", { recursive: true });
writeFileSync(
  ".tmp/e2e-credentials.json",
  JSON.stringify({ username: "e2e-editor", password }),
);
db().close();
