import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { InstallationLicenseActions } from "@/components/saas/InstallationLicenseActions";
import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getPageAdminScope } from "@/lib/auth/page-scope";
import { canRotateApiKeys } from "@/lib/auth/permissions";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import { listInstallationsWithDetails } from "@/services/saas/admin-service";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminLicensesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const { scope } = await getPageAdminScope(locale);
  const installations = await listInstallationsWithDetails(scope);
  const showActions = canRotateApiKeys(scope);

  return (
    <>
      <SaasPageHeader title={dict.admin.nav.licenses} />
      <SaasMockTable
        headers={[
          dict.admin.table.restaurant,
          dict.admin.table.licenseStatus,
          dict.admin.table.expiresAt,
          locale === "es" ? "Gracia hasta" : "Grace until",
          locale === "es" ? "Acciones" : "Actions",
        ]}
        rows={installations.map((i) => [
          i.restaurant.name,
          <LicenseStatusBadge
            key={i.id}
            status={i.license_status}
            label={dict.licenseStatus[i.license_status]}
          />,
          formatSaasDate(i.license_expires_at, locale),
          formatSaasDate(i.grace_until, locale),
          showActions ? (
            <InstallationLicenseActions
              key={`lic-${i.id}`}
              installationId={i.id}
              currentStatus={i.license_status}
              locale={locale}
              statusLabels={dict.licenseStatus}
            />
          ) : (
            "—"
          ),
        ])}
      />
    </>
  );
}
