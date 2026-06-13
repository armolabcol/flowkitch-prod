import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { listDemoLeads } from "@/services/saas/leads-service";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminLeadsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const leads = await listDemoLeads();

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.leads}
        description={
          locale === "es"
            ? "Solicitudes del formulario /demo"
            : "Requests from the /demo form"
        }
      />
      <SaasMockTable
        headers={[
          locale === "es" ? "Fecha" : "Date",
          locale === "es" ? "Nombre" : "Name",
          locale === "es" ? "Restaurante" : "Restaurant",
          locale === "es" ? "Ciudad" : "City",
          "Email",
          "WhatsApp",
          "POS",
        ]}
        rows={leads.map((l) => [
          l.created_at.slice(0, 10),
          l.name,
          l.restaurant,
          `${l.city}, ${l.country}`,
          l.email,
          l.whatsapp ?? "—",
          l.uses_pos,
        ])}
      />
    </>
  );
}
