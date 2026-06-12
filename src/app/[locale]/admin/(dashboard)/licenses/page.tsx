import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getAllInstallationsWithDetails } from "@/data/saas-mock";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminLicensesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const installations = getAllInstallationsWithDetails();

  return (
    <>
      <SaasPageHeader title={dict.admin.nav.licenses} />
      <SaasMockTable
        headers={[
          dict.admin.table.restaurant,
          dict.admin.table.licenseStatus,
          dict.admin.table.expiresAt,
          locale === "es" ? "Gracia hasta" : "Grace until",
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
        ])}
      />
    </>
  );
}
