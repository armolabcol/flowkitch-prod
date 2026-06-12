import {
  getInstallationByApiKey,
  recordLicenseCheck,
} from "@/services/saas/installations-service";
import type {
  LicenseCheckRequest,
  LicenseCheckResponse,
  LicenseStatus,
  PluginInstallation,
} from "@/types/saas";

const DEFAULT_CHECK_INTERVAL_HOURS = 24;

const STATUS_MESSAGES: Record<LicenseStatus, string> = {
  active: "License active",
  past_due: "Payment past due — please renew",
  grace_period: "License in grace period",
  suspended: "License suspended — contact support",
  cancelled: "License cancelled",
  maintenance_required: "Maintenance required before continued use",
  license_unknown: "Invalid or unknown API key",
};

export function buildLicenseResponse(
  installation: PluginInstallation,
): LicenseCheckResponse {
  const status = installation.license_status;

  return {
    status,
    license_expires_at: installation.license_expires_at,
    grace_until: installation.grace_until,
    check_interval_hours: DEFAULT_CHECK_INTERVAL_HOURS,
    message: STATUS_MESSAGES[status] ?? "License status unknown",
  };
}

export function buildUnknownLicenseResponse(): LicenseCheckResponse {
  return {
    status: "license_unknown",
    message: STATUS_MESSAGES.license_unknown,
  };
}

export async function validateLicenseCheck(
  body: LicenseCheckRequest,
): Promise<LicenseCheckResponse> {
  const installation = await getInstallationByApiKey(body.api_key);

  if (!installation) {
    return buildUnknownLicenseResponse();
  }

  if (installation.license_status === "cancelled") {
    return buildLicenseResponse(installation);
  }

  await recordLicenseCheck(
    installation.id,
    body.plugin_version,
    body.site_url,
  );

  return buildLicenseResponse(installation);
}

export function checkRateLimit(_identifier: string): boolean {
  return true;
}
