import type { Metadata } from "next";
import { AdminShell } from "@/components/saas/AdminShell";
import { requireAdminAccess } from "@/lib/auth/guards";
import { getPageAdminScope } from "@/lib/auth/page-scope";
import {
  canAccessAdminRoute,
  roleLabel,
  type AdminRouteKey,
} from "@/lib/auth/permissions";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

const ALL_ROUTES: AdminRouteKey[] = [
  "dashboard",
  "onboarding",
  "clients",
  "users",
  "restaurants",
  "installations",
  "licenses",
  "leads",
  "maintenance",
  "settings",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  return {
    title: `${dict.admin.title} | Kitch`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  await requireAdminAccess(locale);
  const dictionary = getSaasDictionary(locale);
  const ctx = await getPageAdminScope(locale);
  const profile = ctx.session.profile!;

  const allowedRoutes = ALL_ROUTES.filter((route) =>
    canAccessAdminRoute(profile, route),
  );

  return (
    <AdminShell
      locale={locale}
      dictionary={dictionary}
      roleBadge={roleLabel(profile.role, locale)}
      allowedRoutes={allowedRoutes}
    >
      {children}
    </AdminShell>
  );
}
