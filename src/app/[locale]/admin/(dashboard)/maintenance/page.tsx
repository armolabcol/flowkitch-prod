import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { listMaintenanceLogs } from "@/services/saas/admin-service";
import { getPageAdminScope, requireAdminRoute } from "@/lib/auth/page-scope";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminMaintenancePage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const { scope } = await requireAdminRoute(locale, "maintenance");
  const logs = await listMaintenanceLogs(scope);

  return (
    <>
      <SaasPageHeader title={dict.admin.nav.maintenance} />
      <SaasMockTable
        headers={[
          locale === "es" ? "Título" : "Title",
          locale === "es" ? "Estado" : "Status",
          locale === "es" ? "Programado" : "Scheduled",
          locale === "es" ? "Notas" : "Notes",
        ]}
        rows={logs.map((m) => [
          m.title,
          m.status,
          formatSaasDate(m.scheduled_at, locale),
          m.notes,
        ])}
      />
    </>
  );
}
