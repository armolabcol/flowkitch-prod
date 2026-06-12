import { NextResponse } from "next/server";
import { maskApiKey } from "@/lib/security/api-keys";
import {
  checkRateLimit,
  validateLicenseCheck,
} from "@/services/license-service";
import type { LicenseCheckRequest } from "@/types/saas";

function isValidRequestBody(body: unknown): body is LicenseCheckRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.api_key === "string" &&
    b.api_key.length >= 8 &&
    typeof b.site_url === "string" &&
    b.site_url.length > 0 &&
    typeof b.plugin_version === "string" &&
    b.plugin_version.length > 0
  );
}

export async function POST(request: Request) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { status: "license_unknown", message: "Rate limit exceeded" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "license_unknown", message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!isValidRequestBody(body)) {
    return NextResponse.json(
      {
        status: "license_unknown",
        message: "Missing or invalid fields: api_key, site_url, plugin_version",
      },
      { status: 400 },
    );
  }

  // Log masked key only — never the full API key
  if (process.env.NODE_ENV === "development") {
    console.log(
      "[license/check]",
      maskApiKey(body.api_key),
      body.site_url,
      body.plugin_version,
    );
  }

  // TODO: Verify X-Kitch-Signature HMAC when KITCH_API_HMAC_SECRET is set

  const response = await validateLicenseCheck(body);
  const statusCode = response.status === "license_unknown" ? 401 : 200;

  return NextResponse.json(response, { status: statusCode });
}
