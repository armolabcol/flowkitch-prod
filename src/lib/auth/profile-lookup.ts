import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = {
  id: string;
  email: string;
  role: string;
  client_id: string | null;
  full_name: string | null;
};

/**
 * Server-only profile reads. Prefer service role to avoid broken RLS policies
 * until migration 004_fix_profiles_rls.sql is applied in Supabase.
 */
export async function fetchProfileByUserId(
  userId: string,
  userClient?: SupabaseClient<Database> | null,
): Promise<{ profile: ProfileRow | null; error: string | null }> {
  const service = createServiceSupabaseClient();
  const client = service ?? userClient;

  if (!client) {
    return { profile: null, error: "Database not configured" };
  }

  const { data, error } = await client
    .from("profiles")
    .select("id, email, role, client_id, full_name")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: data ?? null, error: null };
}

export async function fetchProfileRole(
  userId: string,
  userClient?: SupabaseClient<Database> | null,
): Promise<{ role: string | null; error: string | null }> {
  const { profile, error } = await fetchProfileByUserId(userId, userClient);
  return { role: profile?.role ?? null, error };
}
