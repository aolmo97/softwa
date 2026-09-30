import Database from "better-sqlite3";
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
let instance: Database.Database | undefined;
export function db() {
  if (!instance) {
    const path = resolve(
      process.env.DATABASE_PATH ?? "./data/catalogue.sqlite",
    );
    mkdirSync(dirname(path), { recursive: true });
    instance = new Database(path);
    instance.pragma("journal_mode = WAL");
    instance.pragma("foreign_keys = ON");
    instance.pragma("busy_timeout = 5000");
  }
  return instance;
}
export function migrate() {
  const d = db();
  d.exec(
    "CREATE TABLE IF NOT EXISTS migrations(name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)",
  );
  for (const name of readdirSync(resolve("migrations"))
    .filter((n) => n.endsWith(".sql"))
    .sort()) {
    if (!d.prepare("SELECT 1 FROM migrations WHERE name=?").get(name))
      d.transaction(() => {
        d.exec(readFileSync(resolve("migrations", name), "utf8"));
        d.prepare("INSERT INTO migrations VALUES(?,?)").run(
          name,
          new Date().toISOString(),
        );
      })();
  }
}
export function closeDb() {
  instance?.close();
  instance = undefined;
}
