import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const API_KEY_PREFIX = "kitch_live_";
const API_KEY_BYTES = 32;

/** Generate a new API key (store only the hash in DB). */
export function generateApiKey(): string {
  const raw = randomBytes(API_KEY_BYTES).toString("base64url");
  return `${API_KEY_PREFIX}${raw}`;
}

/** SHA-256 hash of an API key for storage. */
export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex");
}

/** Mask API key for display — never expose full key in frontend. */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return "••••";
  return `••••${apiKey.slice(-4)}`;
}

/** Extract last 4 characters for public views. */
export function apiKeyLast4(apiKey: string): string {
  return apiKey.slice(-4);
}

/** Constant-time string comparison to prevent timing attacks. */
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Verify plugin HMAC signature.
 * Header: X-Kitch-Signature: sha256=<hex>
 */
export function verifyHmacSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const provided = signatureHeader.slice("sha256=".length);
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return timingSafeCompare(expected, provided);
}
