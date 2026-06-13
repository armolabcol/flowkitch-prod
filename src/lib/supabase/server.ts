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
let serviceClient: SupabaseClient<Database> | null = null;

export function createServiceSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseServiceConfigured()) return null;

  if (!serviceClient) {
    serviceClient = createClient<Database>(
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

  return serviceClient;
}

/** @deprecated Use createSupabaseServerClient from @/lib/auth/session */
export { createSupabaseServerClient as createServerSupabaseClient } from "@/lib/auth/session";
