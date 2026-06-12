import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  env,
  isSupabaseConfigured,
  isSupabaseServiceConfigured,
} from "@/lib/env";
import type { Database } from "./types";

/**
 * Server-side Supabase client with anon key (respects RLS).
 * Returns null when credentials are not configured.
 */
export function createServerSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;

  return createClient<Database>(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

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
