/**
 * Centralized environment access with safe fallbacks.
 * Missing Supabase credentials must NOT break build or runtime.
 */

function readEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const env = {
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "https://flowkitch.com",
  supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  kitchApiHmacSecret: readEnv("KITCH_API_HMAC_SECRET"),
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
