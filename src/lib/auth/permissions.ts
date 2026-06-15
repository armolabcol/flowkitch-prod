import type { AuthProfile } from "@/lib/auth/types";
import type { UserRole } from "@/types/saas";

export type StaffCountry = "CO" | "US";

export type StaffScope =
  | { kind: "global" }
  | { kind: "country"; country: StaffCountry }
  | { kind: "portfolio"; clientIds: string[]; userId: string };

export type ClientScopeInput = {
  id: string;
  country: string;
  assigned_sales_agent_id?: string | null;
};

const STAFF_ROLES: UserRole[] = [
  "super_admin",
  "regional_admin",
  "billing_admin",
  "support_agent",
  "sales_agent",
];

const CLIENT_ROLES: UserRole[] = ["client_user", "client_owner", "client_billing"];

export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role);
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === "super_admin";
}

export function isRegionalAdmin(role: UserRole): boolean {
  return role === "regional_admin";
}

export function isSalesAgent(role: UserRole): boolean {
  return role === "sales_agent";
}

export function isClientPortalRole(role: UserRole): boolean {
  return CLIENT_ROLES.includes(role);
}

export function resolveStaffScope(
  profile: AuthProfile,
  portfolioClientIds: string[] = [],
): StaffScope | null {
  if (!isStaffRole(profile.role)) return null;

  if (
    profile.role === "super_admin" ||
    profile.role === "billing_admin" ||
    profile.role === "support_agent"
  ) {
    return { kind: "global" };
  }

  if (profile.role === "regional_admin" && profile.assigned_country) {
    return { kind: "country", country: profile.assigned_country };
  }

  if (profile.role === "sales_agent") {
    return {
      kind: "portfolio",
      clientIds: portfolioClientIds,
      userId: profile.id,
    };
  }

  return null;
}

export function canReadClient(
  scope: StaffScope,
  client: ClientScopeInput,
): boolean {
  if (scope.kind === "global") return true;
  if (scope.kind === "country") return client.country === scope.country;
  return scope.clientIds.includes(client.id);
}

export function canWriteClient(
  scope: StaffScope,
  client: ClientScopeInput,
): boolean {
  if (scope.kind === "global") return true;
  if (scope.kind === "country") return client.country === scope.country;
  return false;
}

export function canCreateClientInCountry(
  scope: StaffScope,
  country: StaffCountry,
): boolean {
  if (scope.kind === "global") return true;
  if (scope.kind === "country") return scope.country === country;
  return false;
}

export function canManageStaff(
  actor: AuthProfile,
  targetRole: UserRole,
  targetCountry?: StaffCountry | null,
): boolean {
  if (isSuperAdmin(actor.role)) {
    return (
      targetRole === "regional_admin" ||
      targetRole === "sales_agent" ||
      targetRole === "client_user" ||
      targetRole === "client_owner" ||
      targetRole === "client_billing"
    );
  }

  if (isRegionalAdmin(actor.role) && actor.assigned_country) {
    if (targetRole === "sales_agent") {
      return !targetCountry || targetCountry === actor.assigned_country;
    }
    if (
      targetRole === "client_user" ||
      targetRole === "client_owner" ||
      targetRole === "client_billing"
    ) {
      return true;
    }
    return false;
  }

  return false;
}

export type AdminRouteKey =
  | "dashboard"
  | "onboarding"
  | "clients"
  | "users"
  | "restaurants"
  | "installations"
  | "licenses"
  | "leads"
  | "maintenance"
  | "settings";

export function canAccessAdminRoute(
  profile: AuthProfile,
  route: AdminRouteKey,
): boolean {
  const role = profile.role;

  if (isSuperAdmin(role) || role === "billing_admin" || role === "support_agent") {
    return true;
  }

  if (isRegionalAdmin(role)) {
    return route !== "settings";
  }

  if (isSalesAgent(role)) {
    return ["dashboard", "clients", "installations", "licenses"].includes(route);
  }

  return false;
}

export function canManageBillingSettings(role: UserRole): boolean {
  return isSuperAdmin(role);
}

export function canInvitePortalUser(
  scope: StaffScope,
  client: ClientScopeInput,
): boolean {
  if (scope.kind === "portfolio") {
    return scope.clientIds.includes(client.id);
  }
  return canReadClient(scope, client);
}

export function canRotateApiKeys(scope: StaffScope): boolean {
  return scope.kind === "global" || scope.kind === "country";
}

export function roleLabel(role: UserRole, locale: "es" | "en"): string {
  const labels: Record<string, { es: string; en: string }> = {
    super_admin: { es: "Super administrador", en: "Super admin" },
    regional_admin: { es: "Admin regional", en: "Regional admin" },
    sales_agent: { es: "Agente comercial", en: "Sales agent" },
    billing_admin: { es: "Admin facturación", en: "Billing admin" },
    support_agent: { es: "Soporte", en: "Support" },
    client_user: { es: "Cliente", en: "Client" },
  };
  return labels[role]?.[locale] ?? role;
}
