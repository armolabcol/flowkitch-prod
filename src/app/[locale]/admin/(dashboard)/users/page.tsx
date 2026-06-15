import Link from "next/link";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { AdminStaffActions } from "@/components/saas/AdminStaffActions";
import { AdminUserActions } from "@/components/saas/AdminUserActions";
import { StaffInviteForm } from "@/components/saas/StaffInviteForm";
import {
  listProfiles,
  listRegionalAdmins,
} from "@/services/saas/profiles-admin-service";
import { listClients } from "@/services/saas/admin-service";
import { requireAdminRoute } from "@/lib/auth/page-scope";
import {
  canManageAnyUser,
  isRegionalAdmin,
  isSuperAdmin,
  roleLabel,
} from "@/lib/auth/permissions";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { withLocale, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

const STAFF_ROLES = new Set([
  "super_admin",
  "regional_admin",
  "sales_agent",
  "billing_admin",
  "support_agent",
]);

export default async function AdminUsersPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const { scope, session } = await requireAdminRoute(locale, "users");
  const profile = session.profile!;
  const profiles = await listProfiles(300);
  const clients = await listClients(scope);
  const regionalAdmins = await listRegionalAdmins();
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));
  const regionalMap = Object.fromEntries(
    regionalAdmins.map((r) => [r.id, r.full_name ?? r.email]),
  );

  const canInviteStaff =
    isSuperAdmin(profile.role) || isRegionalAdmin(profile.role);
  const superAdmin = canManageAnyUser(profile);

  const visibleProfiles = profiles.filter((p) => {
    if (p.role === "super_admin" && !isSuperAdmin(profile.role)) return false;
    if (p.role === "regional_admin" && !isSuperAdmin(profile.role)) return false;
    if (p.client_id && !clientMap[p.client_id] && !superAdmin) return false;
    if (
      isRegionalAdmin(profile.role) &&
      p.role === "sales_agent" &&
      p.managed_by_regional_admin_id &&
      p.managed_by_regional_admin_id !== profile.id
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.users}
        description={
          locale === "es"
            ? "Crear usuarios, asignar roles y vincular dependencias (agentes, clientes, admins regionales)."
            : "Create users, assign roles, and link dependencies (agents, clients, regional admins)."
        }
      />
      {canInviteStaff && (
        <StaffInviteForm
          locale={locale}
          actorRole={profile.role}
          actorCountry={profile.assigned_country}
          actorId={profile.id}
          regionalAdmins={regionalAdmins}
          clients={clients}
        />
      )}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase text-kitch-subtle">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">
                {locale === "es" ? "País / Cliente / Dependencia" : "Country / Client / Reports to"}
              </th>
              <th className="px-4 py-3">{locale === "es" ? "Acciones" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {visibleProfiles.map((p) => (
              <tr key={p.id} className="border-b border-white/[0.04]">
                <td className="px-4 py-3 text-white">{p.email}</td>
                <td className="px-4 py-3 text-kitch-muted">
                  {roleLabel(p.role as never, locale)}
                </td>
                <td className="px-4 py-3 text-kitch-muted">
                  {p.assigned_country && <span>{p.assigned_country}</span>}
                  {p.managed_by_regional_admin_id && (
                    <span className="block text-xs">
                      {locale === "es" ? "Admin regional" : "Regional admin"}:{" "}
                      {regionalMap[p.managed_by_regional_admin_id] ??
                        p.managed_by_regional_admin_id.slice(0, 8)}
                    </span>
                  )}
                  {p.client_id && (
                    <Link
                      href={withLocale(locale, `/admin/clients/${p.client_id}`)}
                      className="block hover:text-white"
                    >
                      {clientMap[p.client_id] ?? p.client_id.slice(0, 8)}
                    </Link>
                  )}
                  {!p.assigned_country &&
                    !p.managed_by_regional_admin_id &&
                    !p.client_id &&
                    "—"}
                </td>
                <td className="px-4 py-3">
                  {superAdmin && STAFF_ROLES.has(p.role) && p.id !== profile.id ? (
                    <AdminStaffActions
                      profileId={p.id}
                      currentRole={p.role}
                      currentCountry={p.assigned_country}
                      currentRegionalAdminId={p.managed_by_regional_admin_id}
                      regionalAdmins={regionalAdmins}
                      clients={clients}
                      locale={locale}
                    />
                  ) : (
                    <AdminUserActions
                      profileId={p.id}
                      currentClientId={p.client_id}
                      currentRole={p.role}
                      clients={clients}
                      locale={locale}
                      canEditRoles={superAdmin}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
