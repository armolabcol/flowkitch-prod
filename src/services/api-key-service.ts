import {
  apiKeyLast4,
  generateApiKey,
  hashApiKey,
  maskApiKey,
} from "@/lib/security/api-keys";
import {
  getInstallationWithDetails,
  mockApiKeyHashIndex,
  mockInstallations,
} from "@/data/saas-mock";
import type { PluginInstallation } from "@/types/saas";

export { maskApiKey, hashApiKey };

/**
 * Look up installation by API key.
 * TODO: Replace with Supabase query on api_keys.key_hash
 */
export function getInstallationByApiKey(
  apiKey: string,
): PluginInstallation | null {
  const keyHash = hashApiKey(apiKey);
  const installationId = mockApiKeyHashIndex[keyHash];
  if (!installationId) return null;

  return mockInstallations.find((i) => i.id === installationId) ?? null;
}

export function getInstallationDetailsByApiKey(apiKey: string) {
  const installation = getInstallationByApiKey(apiKey);
  if (!installation) return null;
  return getInstallationWithDetails(installation.id);
}

/**
 * Generate a new API key record (mock).
 * TODO: Persist hashed key via Supabase service client.
 */
export function createApiKeyRecord(_installationId: string): {
  apiKey: string;
  publicView: { last4: string; created_at: string; status: "active" };
} {
  const apiKey = generateApiKey();
  return {
    apiKey,
    publicView: {
      last4: apiKeyLast4(apiKey),
      created_at: new Date().toISOString(),
      status: "active",
    },
  };
}
