/**
 * Production start for Hostinger: single-process standalone server.
 * Falls back to `next start` when standalone output is missing (local).
 */
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

const standaloneServer = ".next/standalone/server.js";

const env = {
  ...process.env,
  HOSTNAME: process.env.HOSTNAME ?? "0.0.0.0",
  NODE_ENV: process.env.NODE_ENV ?? "production",
};

function runNode(args) {
  const child = spawn(process.execPath, args, {
    stdio: "inherit",
    env,
  });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
}

if (existsSync(standaloneServer)) {
  runNode([standaloneServer]);
} else {
  const nextBin = "node_modules/next/dist/bin/next";
  runNode([nextBin, "start", "-H", "0.0.0.0"]);
}
