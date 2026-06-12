import { hashApiKey } from "@/lib/security/api-keys";
import { mapInstallation } from "@/services/saas/mappers";
import { getServiceSaasClient } from "@/services/saas/db";
import type { PluginInstallation } from "@/types/saas";
import type { Database } from "@/lib/supabase/types";

/**
 * Look up installation by API key using service role (plugin API — no user session).
 */
export async function getInstallationByApiKey(
  apiKey: string,
): Promise<PluginInstallation | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const keyHash = hashApiKey(apiKey);

  const { data: keyRow } = await supabase
    .from("api_keys")
    .select("installation_id, status")
    .eq("key_hash", keyHash)
    .eq("status", "active")
    .maybeSingle<{ installation_id: string; status: string }>();

  if (!keyRow) return null;

  const { data: installation } = await supabase
    .from("plugin_installations")
    .select("*")
    .eq("id", keyRow.installation_id)
    .maybeSingle<Database["public"]["Tables"]["plugin_installations"]["Row"]>();

  if (!installation) return null;

  return mapInstallation(installation);
}

export async function recordLicenseCheck(
  installationId: string,
  pluginVersion: string,
  siteUrl: string,
): Promise<void> {
  const supabase = getServiceSaasClient();
  if (!supabase) return;

  await supabase
    .from("plugin_installations")
    .update({
      last_license_check_at: new Date().toISOString(),
      plugin_version: pluginVersion,
    })
    .eq("id", installationId);

  // site_url validation logged for future audit table
  void siteUrl;
}
