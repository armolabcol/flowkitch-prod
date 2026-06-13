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
import { writeAuditLog } from "@/services/audit-service";
import { getServiceSaasClient } from "@/services/saas/db";
import type { Database } from "@/lib/supabase/types";

/**
 * Generate and persist a new API key for an installation (admin operation).
 */
export async function createApiKeyRecord(
  installationId: string,
  actorId?: string | null,
): Promise<{
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

  await writeAuditLog({
    actorId,
    action: "api_key.created",
    entityType: "installation",
    entityId: installationId,
    metadata: { last4 },
  });

  return {
    apiKey,
    publicView: { last4, created_at, status: "active" },
  };
}

export async function revokeActiveApiKeys(
  installationId: string,
  actorId?: string | null,
): Promise<boolean> {
  const supabase = getServiceSaasClient();
  if (!supabase) return false;

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("api_keys")
    .update({ status: "revoked", revoked_at: now } as never)
    .eq("installation_id", installationId)
    .eq("status", "active");

  if (error) return false;

  await writeAuditLog({
    actorId,
    action: "api_key.revoked",
    entityType: "installation",
    entityId: installationId,
  });

  return true;
}

export async function rotateApiKey(
  installationId: string,
  actorId?: string | null,
): Promise<{
  apiKey: string;
  publicView: { last4: string; created_at: string; status: "active" };
} | null> {
  const revoked = await revokeActiveApiKeys(installationId, actorId);
  if (!revoked) return null;
  return createApiKeyRecord(installationId, actorId);
}
