import { createSupabaseServerClient } from "@/lib/auth/session";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export async function getServerSaasClient(): Promise<SupabaseClient<Database> | null> {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseServerClient();
}

export function getServiceSaasClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  return createServiceSupabaseClient();
}

export const EMPTY_ADMIN_STATS = {
  totalClients: 0,
  activeInstallations: 0,
  expiringSoon: 0,
  suspendedInstallations: 0,
  totalOrdersMonth: 0,
  totalRevenueMonth: 0,
  installations: [] as never[],
};
