/**
 * Hostinger start — ONE Node process, correct cwd for standalone server.
 * Run via: node scripts/hostinger-start.cjs
 * Or set hPanel: Output dir = .next/standalone, Start = node server.js
 */
const { existsSync } = require("node:fs");
const { join } = require("node:path");

const standaloneDir = join(__dirname, "..", ".next", "standalone");
const serverEntry = join(standaloneDir, "server.js");

if (!existsSync(serverEntry)) {
  console.error("[hostinger-start] Missing", serverEntry);
  console.error("[hostinger-start] Run: npm run build");
  process.exit(1);
}

process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || "1";

process.chdir(standaloneDir);
require(serverEntry);
