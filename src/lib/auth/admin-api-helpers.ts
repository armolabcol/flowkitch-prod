import { NextResponse } from "next/server";
import { requireAdminScope } from "@/lib/auth/admin-scope";
import {
  canCreateClientInCountry,
  canInvitePortalUser,
  canManageAnyUser,
  canManageStaff,
  canReadClient,
  canRotateApiKeys,
  canWriteClient,
} from "@/lib/auth/permissions";
import { assertClientInScope } from "@/services/saas/scope-service";
import type { StaffCountry } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/saas";

export function unauthorized() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ ok: false, message }, { status: 403 });
}

export async function requireScopedAdmin() {
  const ctx = await requireAdminScope();
  if (!ctx) return null;
  return ctx;
}

export async function requireClientAccess(clientId: string) {
  const ctx = await requireAdminScope();
  if (!ctx) return { error: unauthorized() as Response };
  const row = await assertClientInScope(ctx.scope, clientId);
  if (!row) return { error: forbidden("Client out of scope") as Response };
  return { ...ctx, client: row };
}

export async function requireClientWrite(clientId: string) {
  const result = await requireClientAccess(clientId);
  if ("error" in result) return result;
  if (!canWriteClient(result.scope, result.client)) {
    return { error: forbidden("Read-only for this client") };
  }
  return result;
}

export {
  canCreateClientInCountry,
  canInvitePortalUser,
  canManageAnyUser,
  canManageStaff,
  canReadClient,
  canRotateApiKeys,
  canWriteClient,
};
export type { StaffCountry, UserRole };
