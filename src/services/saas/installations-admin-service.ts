import { getServiceSaasClient } from "@/services/saas/db";
import { writeAuditLog } from "@/services/audit-service";
import type { Database } from "@/lib/supabase/types";
import type { LicenseStatus } from "@/types/saas";

export async function updateInstallationLicense(
  installationId: string,
  updates: {
    license_status?: LicenseStatus;
    license_expires_at?: string;
    grace_until?: string | null;
  },
  actorId?: string | null,
): Promise<boolean> {
  const supabase = getServiceSaasClient();
  if (!supabase) return false;

  const patch: Database["public"]["Tables"]["plugin_installations"]["Update"] =
    {};
  if (updates.license_status) patch.license_status = updates.license_status;
  if (updates.license_expires_at) {
    patch.license_expires_at = updates.license_expires_at;
  }
  if (updates.grace_until !== undefined) patch.grace_until = updates.grace_until;

  const { error } = await supabase
    .from("plugin_installations")
    .update(patch as never)
    .eq("id", installationId);

  if (error) return false;

  await writeAuditLog({
    actorId,
    action: "installation.license_updated",
    entityType: "installation",
    entityId: installationId,
    metadata: updates as Record<string, unknown>,
  });

  return true;
}

export async function extendInstallationLicense(
  installationId: string,
  days: number,
  actorId?: string | null,
): Promise<boolean> {
  const supabase = getServiceSaasClient();
  if (!supabase) return false;

  const { data } = await supabase
    .from("plugin_installations")
    .select("license_expires_at")
    .eq("id", installationId)
    .maybeSingle<{ license_expires_at: string }>();

  if (!data) return false;

  const base = new Date(data.license_expires_at);
  const now = new Date();
  const start = base > now ? base : now;
  start.setDate(start.getDate() + days);

  return updateInstallationLicense(
    installationId,
    {
      license_expires_at: start.toISOString(),
      license_status: "active",
      grace_until: null,
    },
    actorId,
  );
}
