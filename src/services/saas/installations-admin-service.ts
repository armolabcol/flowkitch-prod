import { getServiceSaasClient } from "@/services/saas/db";
import { writeAuditLog } from "@/services/audit-service";
import type { Database } from "@/lib/supabase/types";
import type { LicenseStatus } from "@/types/saas";

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export async function createInstallationRecord(params: {
  restaurantId: string;
  siteUrl: string;
  pluginVersion?: string;
  licenseDays?: number;
  actorId?: string | null;
}): Promise<{ id: string } | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const siteUrl = params.siteUrl.trim().replace(/\/+$/, "");
  const row: Database["public"]["Tables"]["plugin_installations"]["Insert"] = {
    restaurant_id: params.restaurantId,
    site_url: siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`,
    plugin_version: params.pluginVersion ?? "3.0.0",
    license_status: "active",
    license_expires_at: addDays(params.licenseDays ?? 30),
    orders_month: 0,
    revenue_month: 0,
    average_ticket: 0,
  };

  const { data, error } = await supabase
    .from("plugin_installations")
    .insert(row as never)
    .select("id")
    .single<{ id: string }>();

  if (error || !data) return null;

  await writeAuditLog({
    actorId: params.actorId,
    action: "installation.created",
    entityType: "installation",
    entityId: data.id,
    metadata: { restaurantId: params.restaurantId, siteUrl: row.site_url },
  });

  return data;
}

export async function updateInstallationDetails(
  installationId: string,
  updates: {
    site_url?: string;
    plugin_version?: string;
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
  if (updates.site_url) {
    const url = updates.site_url.trim().replace(/\/+$/, "");
    patch.site_url = url.startsWith("http") ? url : `https://${url}`;
  }
  if (updates.plugin_version) patch.plugin_version = updates.plugin_version;
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
    action: "installation.updated",
    entityType: "installation",
    entityId: installationId,
    metadata: updates as Record<string, unknown>,
  });

  return true;
}

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
