import { readFileSync } from "node:fs";
import { NextResponse } from "next/server";

function buildSha(): string {
  try {
    return readFileSync(".build-sha", "utf8").trim();
  } catch {
    return process.env.BUILD_GIT_SHA ?? "dev";
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "kitch",
    build: buildSha(),
  });
}
