import Link from "next/link";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { AdminUserActions } from "@/components/saas/AdminUserActions";
import { listProfiles } from "@/services/saas/profiles-admin-service";
import { listClients } from "@/services/saas/admin-service";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { withLocale, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminUsersPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const profiles = await listProfiles();
  const clients = await listClients();
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.users}
        description={
          locale === "es"
            ? "Vincular usuarios al portal y asignar clientes."
            : "Link portal users and assign clients."
        }
      />
      <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase text-kitch-subtle">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">{locale === "es" ? "Cliente" : "Client"}</th>
              <th className="px-4 py-3">{locale === "es" ? "Acciones" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-white/[0.04]">
                <td className="px-4 py-3 text-white">{p.email}</td>
                <td className="px-4 py-3 text-kitch-muted">{p.role}</td>
                <td className="px-4 py-3 text-kitch-muted">
                  {p.client_id ? (
                    <Link
                      href={withLocale(locale, `/admin/clients/${p.client_id}`)}
                      className="hover:text-white"
                    >
                      {clientMap[p.client_id] ?? p.client_id.slice(0, 8)}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <AdminUserActions
                    profileId={p.id}
                    currentClientId={p.client_id}
                    currentRole={p.role}
                    clients={clients}
                    locale={locale}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
