import { redirect } from "next/navigation";
import { getAdminScopeForPages } from "@/lib/auth/admin-scope";
import { canAccessAdminRoute, type AdminRouteKey } from "@/lib/auth/permissions";
import { withLocale, type Locale } from "@/lib/i18n";

export async function getPageAdminScope(locale: Locale) {
  const ctx = await getAdminScopeForPages();
  if (!ctx?.session.profile) {
    redirect(withLocale(locale, "/portal/login"));
  }
  return ctx;
}

export async function requireAdminRoute(locale: Locale, route: AdminRouteKey) {
  const ctx = await getPageAdminScope(locale);
  if (!canAccessAdminRoute(ctx.session.profile!, route)) {
    redirect(withLocale(locale, "/admin"));
  }
  return ctx;
}
