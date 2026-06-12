import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { mockClients } from "@/data/saas-mock";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminClientsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);

  return (
    <>
      <SaasPageHeader title={dict.admin.nav.clients} />
      <SaasMockTable
        headers={["ID", locale === "es" ? "Nombre" : "Name", locale === "es" ? "País" : "Country", "Email"]}
        rows={mockClients.map((c) => [
          c.id,
          c.name,
          dict.countries[c.country] ?? c.country,
          c.email,
        ])}
      />
    </>
  );
}
