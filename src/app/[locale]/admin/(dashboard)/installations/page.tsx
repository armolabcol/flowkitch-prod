import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getAllInstallationsWithDetails } from "@/data/saas-mock";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminInstallationsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const installations = getAllInstallationsWithDetails();

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
        ]}
        rows={installations.map((i) => [
          i.id,
          i.restaurant.name,
          <LicenseStatusBadge
            key={i.id}
            status={i.license_status}
            label={dict.licenseStatus[i.license_status]}
          />,
          `v${i.plugin_version}`,
          `••••${i.api_key_last4}`,
        ])}
      />
    </>
  );
}
