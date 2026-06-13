import Link from "next/link";
import { AdminClientCreateForm } from "@/components/saas/AdminClientCreateForm";
import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { listClients } from "@/services/saas/admin-service";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { withLocale, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminClientsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const clients = await listClients();

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.clients}
        description={
          locale === "es"
            ? "Usa Alta cliente para el piloto completo, o crea solo el cliente aquí."
            : "Use New client for full provisioning, or create client only here."
        }
      />
      <p className="mb-4 text-sm">
        <Link
          href={withLocale(locale, "/admin/onboarding")}
          className="text-kitch-accent hover:underline"
        >
          → {dict.admin.nav.onboarding}
        </Link>
      </p>
      <AdminClientCreateForm locale={locale} />
      <SaasMockTable
        headers={["ID", locale === "es" ? "Nombre" : "Name", locale === "es" ? "País" : "Country", "Email"]}
        rows={clients.map((c) => [
          <Link
            key={c.id}
            href={withLocale(locale, `/admin/clients/${c.id}`)}
            className="text-kitch-accent hover:underline"
          >
            {c.id.slice(0, 8) + "…"}
          </Link>,
          c.name,
          dict.countries[c.country] ?? c.country,
          c.email,
        ])}
      />
    </>
  );
}
