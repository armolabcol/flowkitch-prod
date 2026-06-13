import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";
import type { AuthProfile, AuthSession } from "@/lib/auth/types";
import { isKnownRole } from "@/lib/auth/roles";
import { fetchProfileByUserId } from "@/lib/auth/profile-lookup";
import type { UserRole } from "@/types/saas";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.supabaseUrl!,
    env.supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from Server Component — safe to ignore when proxy refreshes session.
          }
        },
      },
    },
  );
}

function mapProfile(row: {
  id: string;
  email: string;
  role: string;
  client_id: string | null;
  full_name: string | null;
}): AuthProfile | null {
  if (!isKnownRole(row.role)) return null;
  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    client_id: row.client_id,
    full_name: row.full_name,
  };
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) return null;

  const { profile: profileRow } = await fetchProfileByUserId(user.id, supabase);

  return {
    userId: user.id,
    email: user.email,
    profile: profileRow ? mapProfile(profileRow) : null,
  };
}
