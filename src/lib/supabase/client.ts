import { createBrowserClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "./types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createBrowserSupabaseClient() {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      env.supabaseUrl!,
      env.supabaseAnonKey!,
    );
  }

  return browserClient;
}
