export {
  getInstallationByApiKey,
  recordLicenseCheck,
} from "@/services/saas/installations-service";

export {
  apiKeyLast4,
  generateApiKey,
  hashApiKey,
  maskApiKey,
} from "@/lib/security/api-keys";

import {
  apiKeyLast4,
  generateApiKey,
  hashApiKey,
} from "@/lib/security/api-keys";
import { getServiceSaasClient } from "@/services/saas/db";
import type { Database } from "@/lib/supabase/types";

/**
 * Generate and persist a new API key for an installation (admin operation).
 */
export async function createApiKeyRecord(installationId: string): Promise<{
  apiKey: string;
  publicView: { last4: string; created_at: string; status: "active" };
} | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);
  const last4 = apiKeyLast4(apiKey);
  const created_at = new Date().toISOString();

  const row: Database["public"]["Tables"]["api_keys"]["Insert"] = {
    installation_id: installationId,
    key_hash: keyHash,
    last4,
    status: "active",
  };

  const { error } = await supabase.from("api_keys").insert(row as never);

  if (error) return null;

  return {
    apiKey,
    publicView: { last4, created_at, status: "active" },
  };
}
