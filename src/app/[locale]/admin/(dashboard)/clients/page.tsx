import { Suspense } from "react";
import Link from "next/link";
import { AdminClientCreateForm } from "@/components/saas/AdminClientCreateForm";
import { AdminClientHub } from "@/components/saas/AdminClientHub";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { listClientsWithMembership } from "@/services/saas/admin-service";
import { getPageAdminScope } from "@/lib/auth/page-scope";
import { canAccessAdminRoute, canRotateApiKeys } from "@/lib/auth/permissions";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { withLocale, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ client?: string }>;
};

export default async function AdminClientsPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const { client: initialClientId } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const { scope, session } = await getPageAdminScope(locale);
  const clients = await listClientsWithMembership(scope);
  const canOnboard = canAccessAdminRoute(session.profile!, "onboarding");
  const canManageLicense = canRotateApiKeys(scope);

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.clients}
        description={
          locale === "es"
            ? "Un solo listado: abre cualquier cliente para ver membresía, API, facturación y vencimiento."
            : "One list: open any client to see membership, API, billing, and renewal."
        }
      />
      {canOnboard && (
        <>
          <p className="mb-4 text-sm">
            <Link
              href={withLocale(locale, "/admin/onboarding")}
              className="text-kitch-accent hover:underline"
            >
              → {dict.admin.nav.onboarding}
            </Link>
          </p>
          <AdminClientCreateForm locale={locale} />
        </>
      )}
      <Suspense fallback={null}>
        <AdminClientHub
          clients={clients}
          locale={locale}
          canManageLicense={canManageLicense}
          initialClientId={initialClientId}
        />
      </Suspense>
    </>
  );
}
