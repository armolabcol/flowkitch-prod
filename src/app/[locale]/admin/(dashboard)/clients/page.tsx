import { Suspense } from "react";
import Link from "next/link";
import { AdminClientCreateForm } from "@/components/saas/AdminClientCreateForm";
import { AdminClientHub } from "@/components/saas/AdminClientHub";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { listOperationHubRows } from "@/services/saas/admin-service";
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
  const rows = await listOperationHubRows(scope);
  const canOnboard = canAccessAdminRoute(session.profile!, "onboarding");
  const canManage = canRotateApiKeys(scope);

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.clients}
        description={
          locale === "es"
            ? "Clientes, restaurantes e instalaciones en un solo lugar. La URL muestra a qué sitio apunta cada API / membresía."
            : "Clients, restaurants, and installations in one place. The URL shows where each API / membership is installed."
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
          rows={rows}
          locale={locale}
          canManageLicense={canManage}
          canWrite={canManage}
          initialClientId={initialClientId}
        />
      </Suspense>
    </>
  );
}
