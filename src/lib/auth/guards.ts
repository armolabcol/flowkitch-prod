import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { getAuthSession } from "@/lib/auth/session";
import { isAdminRole, isClientRole, isKnownRole } from "@/lib/auth/roles";
import { withLocale, type Locale } from "@/lib/i18n";
import type { UserRole } from "@/types/saas";

/**
 * When Supabase is not configured, SaaS areas stay in mock/open mode.
 */
export function isAuthEnforced(): boolean {
  return isSupabaseConfigured();
}

function normalizeRole(role: string): UserRole | null {
  const normalized = role === "armo_admin" ? "super_admin" : role;
  return isKnownRole(normalized) ? (normalized as UserRole) : null;
}

/** Home route after sign-in or "Portal" nav click. */
export function homePathForRole(role: UserRole): "/admin" | "/portal" {
  return isAdminRole(role) ? "/admin" : "/portal";
}

/** Redirect authenticated users away from login / public entry. */
export async function redirectIfAuthenticated(locale: Locale): Promise<void> {
  if (!isAuthEnforced()) return;

  const session = await getAuthSession();
  if (!session?.profile) return;

  const role = normalizeRole(session.profile.role);
  if (!role) return;

  redirect(withLocale(locale, homePathForRole(role)));
}

export async function requireAdminAccess(locale: Locale): Promise<void> {
  if (!isAuthEnforced()) return;

  const session = await getAuthSession();
  if (!session) {
    redirect(withLocale(locale, "/portal/login"));
  }

  if (!session.profile || !isAdminRole(session.profile.role)) {
    redirect(withLocale(locale, "/portal"));
  }
}

export async function requirePortalAccess(locale: Locale): Promise<void> {
  if (!isAuthEnforced()) return;

  const session = await getAuthSession();
  if (!session) {
    redirect(withLocale(locale, "/portal/login"));
  }

  if (!session.profile || !isClientRole(session.profile.role)) {
    redirect(withLocale(locale, "/admin"));
  }
}

export async function getPortalClientId(): Promise<string | null> {
  if (!isAuthEnforced()) return null;
  const session = await getAuthSession();
  return session?.profile?.client_id ?? null;
}
