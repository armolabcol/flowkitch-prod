import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { writeAuditLog } from "@/services/audit-service";
import { sendLicenseAlertEmail } from "@/services/saas/alert-email-service";
import { getExpiringInstallations } from "@/services/saas/webhook-service";

/**
 * License expiry alert endpoint — call from external cron (daily).
 * Protect with CRON_SECRET header. No email provider required; logs audit + JSON response.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (secret && token !== secret) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const expiring = await getExpiringInstallations(30);
  const emailSent = await sendLicenseAlertEmail(expiring);

  await writeAuditLog({
    action: "cron.license_alerts",
    entityType: "system",
    entityId: "license-alerts",
    metadata: {
      count: expiring.length,
      siteUrl: env.siteUrl,
      items: expiring.map((e) => ({
        id: e.id,
        restaurant: e.restaurantName,
        expires: e.license_expires_at,
        email: e.clientEmail,
      })),
      emailSent,
    },
  });

  return NextResponse.json({
    ok: true,
    expiringCount: expiring.length,
    emailSent,
    expiring,
  });
}
