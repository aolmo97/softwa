/* Start the production artifact with the workspace database and static assets. */
const { config } = require("dotenv");
const { cpSync, existsSync } = require("node:fs");
const { resolve, join } = require("node:path");
config({ quiet: true });
const standalone = resolve(".next/standalone");
if (!existsSync(join(standalone, "server.js"))) {
  throw new Error("Run npm run build before starting production.");
}
process.env.DATABASE_PATH = resolve(process.env.DATABASE_PATH ?? "./data/catalogue.sqlite");
const args = process.argv.slice(2);
const portFlag = args.findIndex((arg) => arg === "--port" || arg === "-p");
if (portFlag !== -1) process.env.PORT = args[portFlag + 1];
if (process.env.PORT && !/^[0-9]+$/.test(process.env.PORT)) throw new Error("Invalid port");
cpSync(resolve("public"), join(standalone, "public"), { recursive: true });
cpSync(resolve(".next/static"), join(standalone, ".next/static"), { recursive: true });
require(join(standalone, "server.js"));
