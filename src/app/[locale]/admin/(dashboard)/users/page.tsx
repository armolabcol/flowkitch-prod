import Link from "next/link";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { AdminUserActions } from "@/components/saas/AdminUserActions";
import { StaffInviteForm } from "@/components/saas/StaffInviteForm";
import { listProfiles } from "@/services/saas/profiles-admin-service";
import { listClients } from "@/services/saas/admin-service";
import { requireAdminRoute } from "@/lib/auth/page-scope";
import { isRegionalAdmin, isSuperAdmin } from "@/lib/auth/permissions";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { withLocale, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminUsersPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const { scope, session } = await requireAdminRoute(locale, "users");
  const profile = session.profile!;
  const profiles = await listProfiles(200);
  const clients = await listClients(scope);
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const canInviteStaff =
    isSuperAdmin(profile.role) || isRegionalAdmin(profile.role);
  const canEditRoles = isSuperAdmin(profile.role);

  const visibleProfiles = profiles.filter((p) => {
    if (p.role === "super_admin" && !isSuperAdmin(profile.role)) return false;
    if (p.role === "regional_admin" && !isSuperAdmin(profile.role)) return false;
    if (p.client_id && !clientMap[p.client_id]) return false;
    return true;
  });

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.users}
        description={
          locale === "es"
            ? "Invitar staff y vincular usuarios portal a clientes."
            : "Invite staff and link portal users to clients."
        }
      />
      {canInviteStaff && (
        <StaffInviteForm
          locale={locale}
          actorRole={profile.role}
          actorCountry={profile.assigned_country}
        />
      )}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase text-kitch-subtle">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">{locale === "es" ? "País / Cliente" : "Country / Client"}</th>
              <th className="px-4 py-3">{locale === "es" ? "Acciones" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {visibleProfiles.map((p) => (
              <tr key={p.id} className="border-b border-white/[0.04]">
                <td className="px-4 py-3 text-white">{p.email}</td>
                <td className="px-4 py-3 text-kitch-muted">{p.role}</td>
                <td className="px-4 py-3 text-kitch-muted">
                  {p.assigned_country ??
                    (p.client_id ? (
                      <Link
                        href={withLocale(locale, `/admin/clients/${p.client_id}`)}
                        className="hover:text-white"
                      >
                        {clientMap[p.client_id] ?? p.client_id.slice(0, 8)}
                      </Link>
                    ) : (
                      "—"
                    ))}
                </td>
                <td className="px-4 py-3">
                  <AdminUserActions
                    profileId={p.id}
                    currentClientId={p.client_id}
                    currentRole={p.role}
                    clients={clients}
                    locale={locale}
                    canEditRoles={canEditRoles}
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
