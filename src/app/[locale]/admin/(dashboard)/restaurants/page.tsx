import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { mockClients, mockRestaurants } from "@/data/saas-mock";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminRestaurantsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);

  const clientMap = Object.fromEntries(mockClients.map((c) => [c.id, c.name]));

  return (
    <>
      <SaasPageHeader title={dict.admin.nav.restaurants} />
      <SaasMockTable
        headers={[
          locale === "es" ? "Restaurante" : "Restaurant",
          locale === "es" ? "Cliente" : "Client",
          locale === "es" ? "Ciudad" : "City",
          locale === "es" ? "País" : "Country",
        ]}
        rows={mockRestaurants.map((r) => [
          r.name,
          clientMap[r.client_id] ?? r.client_id,
          r.city,
          dict.countries[r.country] ?? r.country,
        ])}
      />
    </>
  );
}
