/**
 * Centralized environment access with safe fallbacks.
 * Missing Supabase credentials must NOT break build or runtime.
 */

function readEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

/** Supabase project URL only — never /rest/v1 or trailing slash */
function normalizeSupabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}

export const env = {
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "https://flowkitch.com",
  supabaseUrl: normalizeSupabaseUrl(readEnv("NEXT_PUBLIC_SUPABASE_URL")),
  supabaseAnonKey:
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  supabaseServiceRoleKey:
    readEnv("SUPABASE_SERVICE_ROLE_KEY") ??
    readEnv("SUPABASE_SECRET_KEY"),
  kitchApiHmacSecret: readEnv("KITCH_API_HMAC_SECRET"),
  stripeSecretKey: readEnv("STRIPE_SECRET_KEY"),
  stripePriceIdUsd: readEnv("STRIPE_PRICE_ID_USD"),
  wompiPublicKey: readEnv("WOMPI_PUBLIC_KEY"),
  resendApiKey: readEnv("RESEND_API_KEY"),
  alertEmailTo: readEnv("ALERT_EMAIL_TO"),
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function isSupabaseServiceConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function isHmacConfigured(): boolean {
  return Boolean(env.kitchApiHmacSecret);
}

export function isStripeCheckoutConfigured(): boolean {
  return Boolean(env.stripeSecretKey && env.stripePriceIdUsd);
}

export function isResendConfigured(): boolean {
  return Boolean(env.resendApiKey && env.alertEmailTo);
}
