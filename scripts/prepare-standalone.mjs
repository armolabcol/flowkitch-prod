/**
 * Copies public assets and static chunks into the standalone output.
 * Required for self-hosted / Hostinger standalone deployments.
 */
import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";

const standaloneDir = ".next/standalone";

if (!existsSync(standaloneDir)) {
  console.log("[prepare-standalone] No standalone output — skipping.");
  process.exit(0);
}

if (existsSync("public")) {
  cpSync("public", join(standaloneDir, "public"), { recursive: true });
}

const staticDir = ".next/static";
if (existsSync(staticDir)) {
  cpSync(staticDir, join(standaloneDir, ".next/static"), { recursive: true });
}

console.log("[prepare-standalone] Assets copied into standalone bundle.");
