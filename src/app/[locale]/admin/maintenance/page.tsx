import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { mockMaintenanceLogs } from "@/data/saas-mock";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminMaintenancePage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);

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
        rows={mockMaintenanceLogs.map((m) => [
          m.title,
          m.status,
          formatSaasDate(m.scheduled_at, locale),
          m.notes,
        ])}
      />
    </>
  );
}
