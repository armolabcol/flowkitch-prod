import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "./types";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Browser Supabase client. Returns null when credentials are not configured.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient<Database>(
      env.supabaseUrl!,
      env.supabaseAnonKey!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    );
  }

  return browserClient;
}
