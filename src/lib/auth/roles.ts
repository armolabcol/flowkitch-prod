import type { UserRole } from "@/types/saas";

/** Roles with access to /admin */
export const ADMIN_ROLES: readonly UserRole[] = [
  "armo_admin",
  "super_admin",
  "billing_admin",
  "support_agent",
  "sales_agent",
] as const;

/** Roles with access to /portal */
export const CLIENT_ROLES: readonly UserRole[] = [
  "client_user",
  "client_owner",
  "client_billing",
] as const;

export function isAdminRole(role: UserRole): boolean {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}

export function isClientRole(role: UserRole): boolean {
  return (CLIENT_ROLES as readonly string[]).includes(role);
}

export function isKnownRole(role: string): role is UserRole {
  return isAdminRole(role as UserRole) || isClientRole(role as UserRole);
}

export function isBillingSettingsRole(role: UserRole): boolean {
  return role === "super_admin" || role === "billing_admin";
}
