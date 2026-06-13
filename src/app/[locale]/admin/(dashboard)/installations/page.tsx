import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { InstallationApiKeyActions } from "@/components/saas/InstallationApiKeyActions";
import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { listInstallationsWithDetails } from "@/services/saas/admin-service";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminInstallationsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const installations = await listInstallationsWithDetails();

  return (
    <>
      <SaasPageHeader title={dict.admin.nav.installations} />
      <SaasMockTable
        headers={[
          "ID",
          dict.admin.table.restaurant,
          dict.admin.table.licenseStatus,
          dict.admin.table.pluginVersion,
          `API Key (${locale === "es" ? "últimos 4" : "last 4"})`,
          locale === "es" ? "Acciones" : "Actions",
        ]}
        rows={installations.map((i) => [
          i.id.slice(0, 8) + "…",
          i.restaurant.name,
          <LicenseStatusBadge
            key={i.id}
            status={i.license_status}
            label={dict.licenseStatus[i.license_status]}
          />,
          `v${i.plugin_version}`,
          `••••${i.api_key_last4}`,
          <InstallationApiKeyActions
            key={`actions-${i.id}`}
            installationId={i.id}
            locale={locale}
          />,
        ])}
      />
    </>
  );
}
