import { getInstallationByApiKey } from "@/services/api-key-service";
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

/**
 * Build standardized license check response for the WordPress plugin.
 */
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

/**
 * Validate a license check request from the WordPress plugin.
 *
 * Security notes:
 * - Never log full API keys (use maskApiKey)
 * - TODO: Verify HMAC signature when KITCH_API_HMAC_SECRET is set
 * - TODO: Rate limit per IP + per key hash (see docs/saas-data-model.md)
 */
export function validateLicenseCheck(
  body: LicenseCheckRequest,
): LicenseCheckResponse {
  const installation = getInstallationByApiKey(body.api_key);

  if (!installation) {
    return buildUnknownLicenseResponse();
  }

  if (installation.license_status === "cancelled") {
    return buildLicenseResponse(installation);
  }

  // TODO: Validate site_url matches installation.site_url (with normalization)
  // TODO: Record license_checks row in Supabase
  // TODO: Update last_license_check_at and plugin_version

  return buildLicenseResponse(installation);
}

/**
 * TODO: Rate limiting placeholder.
 * Recommended: 60 req/min per IP, 10 req/min per key hash.
 * Implement with Upstash Redis or Supabase edge function.
 */
export function checkRateLimit(_identifier: string): boolean {
  return true;
}
