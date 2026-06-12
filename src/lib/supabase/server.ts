import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  env,
  isSupabaseServiceConfigured,
} from "@/lib/env";
import type { Database } from "./types";

/**
 * Service-role client for trusted server operations only.
 * Never import this from client components.
 */
export function createServiceSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseServiceConfigured()) return null;

  return createClient<Database>(
    env.supabaseUrl!,
    env.supabaseServiceRoleKey!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

/** @deprecated Use createSupabaseServerClient from @/lib/auth/session */
export { createSupabaseServerClient as createServerSupabaseClient } from "@/lib/auth/session";
