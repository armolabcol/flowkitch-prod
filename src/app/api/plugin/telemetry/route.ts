import { NextResponse } from "next/server";
import { env, isHmacConfigured } from "@/lib/env";
import { verifyHmacSignature } from "@/lib/security/api-keys";
import { checkIpRateLimit } from "@/lib/security/rate-limit";
import {
  submitDailyTelemetry,
  type TelemetrySubmitRequest,
} from "@/services/saas/plugin-telemetry-service";

function isValidBody(body: unknown): body is TelemetrySubmitRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.api_key === "string" &&
    b.api_key.length >= 8 &&
    typeof b.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    typeof b.orders_count === "number" &&
    b.orders_count >= 0 &&
    typeof b.revenue_cents === "number" &&
    b.revenue_cents >= 0 &&
    typeof b.average_ticket_cents === "number" &&
    b.average_ticket_cents >= 0 &&
    typeof b.plugin_version === "string" &&
    b.plugin_version.length > 0
  );
}

export async function POST(request: Request) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkIpRateLimit(clientIp)) {
    return NextResponse.json({ ok: false, message: "Rate limit exceeded" }, { status: 429 });
  }

  const rawBody = await request.text();

  if (isHmacConfigured()) {
    const signature = request.headers.get("x-kitch-signature");
    if (!verifyHmacSignature(rawBody, signature, env.kitchApiHmacSecret!)) {
      return NextResponse.json({ ok: false, message: "Invalid HMAC signature" }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Invalid fields: api_key, date (YYYY-MM-DD), orders_count, revenue_cents, average_ticket_cents, plugin_version",
      },
      { status: 400 },
    );
  }

  const result = await submitDailyTelemetry(body);
  return NextResponse.json(result, { status: result.ok ? 200 : 401 });
}
