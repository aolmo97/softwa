import { config } from "dotenv";
config({ quiet: true });
import { randomBytes } from "node:crypto";
import { migrate, db } from "../src/lib/db";
import { passwordHash } from "../src/lib/auth";
migrate();
const id = process.argv[2] ?? "editor";
if (!/^[a-z0-9-]{3,40}$/.test(id))
  throw new Error(
    "Admin name must be 3–40 lowercase letters, digits or hyphens",
  );
if (db().prepare("SELECT 1 FROM admins WHERE id=?").get(id))
  throw new Error(
    "Admin already exists. Use a different account name; no password was changed.",
  );
const password = randomBytes(24).toString("base64url");
db()
  .prepare("INSERT INTO admins VALUES(?,?,?)")
  .run(id, passwordHash(password), new Date().toISOString());
console.log(
  "Admin created: " +
    id +
    "\nOne-time password display: " +
    password +
    "\nStore this in your password manager. Sign in at /admin.",
);
db().close();
