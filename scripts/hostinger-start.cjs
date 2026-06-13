/**
 * Hostinger start — ONE Node process, correct cwd for standalone server.
 * Run via: node scripts/hostinger-start.cjs
 * Or set hPanel: Output dir = .next/standalone, Start = node server.js
 */
const { existsSync } = require("node:fs");
const { join } = require("node:path");

const standaloneDir = join(__dirname, "..", ".next", "standalone");
const serverEntry = join(standaloneDir, "server.js");

// #region agent log
function agentLog(message, data, hypothesisId) {
  const payload = {
    sessionId: "cef2d7",
    location: "hostinger-start.cjs",
    message,
    data,
    hypothesisId,
    timestamp: Date.now(),
    runId: process.env.DEBUG_RUN_ID || "pre-fix",
  };
  console.log("[hostinger-start]", JSON.stringify(payload));
  fetch("http://127.0.0.1:7493/ingest/e5d215f0-1ce8-484d-9bde-d15e54771def", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "cef2d7",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
// #endregion

// #region agent log
agentLog("start invoked", {
  cwd: process.cwd(),
  nodeVersion: process.version,
  pid: process.pid,
  port: process.env.PORT || "(default)",
  hostname: process.env.HOSTNAME,
  uvThreadpool: process.env.UV_THREADPOOL_SIZE,
}, "C");
// #endregion

if (!existsSync(serverEntry)) {
  // #region agent log
  agentLog("server.js missing — build not run", { serverEntry, standaloneDir }, "D");
  // #endregion
  console.error("[hostinger-start] Missing", serverEntry);
  console.error("[hostinger-start] Run: npm run build");
  process.exit(1);
}

process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || "1";

// #region agent log
agentLog("chdir before require", { standaloneDir, serverEntry }, "B");
// #endregion

process.chdir(standaloneDir);

try {
  require(serverEntry);
  // #region agent log
  agentLog("server.js required OK", { cwd: process.cwd() }, "B");
  // #endregion
} catch (err) {
  // #region agent log
  agentLog("server.js require failed", {
    name: err?.name,
    message: err?.message,
    code: err?.code,
  }, "A");
  // #endregion
  throw err;
}
