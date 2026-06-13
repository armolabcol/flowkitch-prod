import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import { validateLicenseCheck } from "@/services/license-service";
import { submitDailyTelemetry } from "@/services/saas/plugin-telemetry-service";

type Body = {
  apiKey?: string;
  siteUrl?: string;
};

export async function POST(request: Request) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const apiKey = body.apiKey?.trim();
  const siteUrl = body.siteUrl?.trim();
  if (!apiKey || !siteUrl) {
    return NextResponse.json(
      { ok: false, message: "apiKey and siteUrl required" },
      { status: 400 },
    );
  }

  const license = await validateLicenseCheck({
    api_key: apiKey,
    site_url: siteUrl,
    plugin_version: "3.0.0",
  });

  const telemetry = await submitDailyTelemetry({
    api_key: apiKey,
    date: new Date().toISOString().slice(0, 10),
    orders_count: 1,
    revenue_cents: 100,
    average_ticket_cents: 100,
    plugin_version: "3.0.0",
  });

  const licenseOk = license.status !== "license_unknown";

  return NextResponse.json({
    ok: licenseOk && telemetry.ok,
    license,
    telemetry,
  });
}
