import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { listClients } from "@/services/saas/admin-service";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminClientsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const clients = await listClients();

  return (
    <>
      <SaasPageHeader title={dict.admin.nav.clients} />
      <SaasMockTable
        headers={["ID", locale === "es" ? "Nombre" : "Name", locale === "es" ? "País" : "Country", "Email"]}
        rows={clients.map((c) => [
          c.id.slice(0, 8) + "…",
          c.name,
          dict.countries[c.country] ?? c.country,
          c.email,
        ])}
      />
    </>
  );
}
