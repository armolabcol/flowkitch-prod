import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { getAuthSession } from "@/lib/auth/session";
import { isAdminRole, isClientRole } from "@/lib/auth/roles";
import { withLocale, type Locale } from "@/lib/i18n";

/**
 * When Supabase is not configured, SaaS areas stay in mock/open mode.
 */
export function isAuthEnforced(): boolean {
  return isSupabaseConfigured();
}

export async function requireAdminAccess(locale: Locale): Promise<void> {
  if (!isAuthEnforced()) return;

  const session = await getAuthSession();
  if (!session) {
    redirect(withLocale(locale, "/admin/login"));
  }

  if (!session.profile || !isAdminRole(session.profile.role)) {
    redirect(withLocale(locale, "/portal/login"));
  }
}

export async function requirePortalAccess(locale: Locale): Promise<void> {
  if (!isAuthEnforced()) return;

  const session = await getAuthSession();
  if (!session) {
    redirect(withLocale(locale, "/portal/login"));
  }

  if (!session.profile || !isClientRole(session.profile.role)) {
    redirect(withLocale(locale, "/admin/login"));
  }
}

export async function getPortalClientId(): Promise<string | null> {
  if (!isAuthEnforced()) return null;
  const session = await getAuthSession();
  return session?.profile?.client_id ?? null;
}
