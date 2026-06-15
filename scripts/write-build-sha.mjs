import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

let sha = "unknown";
try {
  sha = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
} catch {
  sha = process.env.BUILD_GIT_SHA ?? process.env.GITHUB_SHA?.slice(0, 7) ?? "unknown";
}

writeFileSync(".build-sha", sha, "utf8");
console.log(`[write-build-sha] ${sha}`);
