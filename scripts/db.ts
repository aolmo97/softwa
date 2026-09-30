import { config } from "dotenv";
config({ quiet: true });
import { db, migrate } from "../src/lib/db";
import { seed } from "../src/lib/seed";
import { mkdirSync } from "node:fs";
async function main() {
  const command = process.argv[2];
  if (command === "migrate") {
    migrate();
    console.log("Migrations applied.");
  } else if (command === "seed") {
    migrate();
    seed();
    console.log("Catalogue seeded (existing records preserved).");
  } else if (command === "backup") {
    mkdirSync("data/backups", { recursive: true });
    const path =
      "data/backups/catalogue-" +
      new Date().toISOString().replace(/[:.]/g, "-") +
      ".sqlite";
    await db().backup(path);
    console.log("Consistent SQLite backup: " + path);
  } else throw new Error("Use migrate, seed or backup");
  db().close();
}
main().catch(() => {
  console.error(
    "Database command failed. Check schema, data and file permissions.",
  );
  process.exitCode = 1;
});
