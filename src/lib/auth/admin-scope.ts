import { getAdminApiSession } from "@/lib/auth/admin-api";
import {
  resolveStaffScope,
  type StaffScope,
  isStaffRole,
} from "@/lib/auth/permissions";
import type { AuthSession } from "@/lib/auth/types";
import { getPortfolioClientIds } from "@/services/saas/scope-service";

export async function requireAdminScope(): Promise<
  | { session: AuthSession; scope: StaffScope }
  | null
> {
  const session = await getAdminApiSession();
  if (!session?.profile || !isStaffRole(session.profile.role)) {
    return null;
  }

  let portfolioIds: string[] = [];
  if (session.profile.role === "sales_agent") {
    portfolioIds = await getPortfolioClientIds(session.userId);
  }

  const scope = resolveStaffScope(session.profile, portfolioIds);
  if (!scope) return null;

  return { session, scope };
}

export async function getAdminScopeForPages(): Promise<{
  session: AuthSession;
  scope: StaffScope;
} | null> {
  return requireAdminScope();
}
