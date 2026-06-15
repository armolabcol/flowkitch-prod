import { NextResponse } from "next/server";
import {
  canInvitePortalUser,
  canManageAnyUser,
  canManageStaff,
  forbidden,
  requireClientAccess,
  requireScopedAdmin,
  unauthorized,
} from "@/lib/auth/admin-api-helpers";
import { isRegionalAdmin } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/saas";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  invitePortalUser,
  inviteStaffUser,
  linkPortalUser,
  updateProfileAdmin,
  type StaffInviteRole,
} from "@/services/saas/profiles-admin-service";

type Body = {
  action?: "link" | "invite" | "update" | "invite_staff";
  email?: string;
  clientId?: string;
  fullName?: string;
  profileId?: string;
  role?: string;
  assignedCountry?: string;
  managedByRegionalAdminId?: string | null;
};

const STAFF_INVITE_ROLES: StaffInviteRole[] = [
  "super_admin",
  "regional_admin",
  "sales_agent",
  "billing_admin",
  "support_agent",
];

async function assertRegionalAdminId(id: string | null | undefined) {
  if (!id) return true;
  const supabase = createServiceSupabaseClient();
  if (!supabase) return false;
  const { data } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", id)
    .eq("role", "regional_admin")
    .maybeSingle();
  return Boolean(data);
}

export async function POST(request: Request) {
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const actor = ctx.session.profile!;

  if (body.action === "invite_staff") {
    if (ctx.scope.kind === "portfolio") {
      return forbidden("Sales agents cannot invite staff");
    }

    const email = body.email?.trim();
    const role = body.role as StaffInviteRole | undefined;
    const assignedCountry =
      body.assignedCountry === "US" ? "US" : body.assignedCountry === "CO" ? "CO" : null;
    const managedByRegionalAdminId = body.managedByRegionalAdminId?.trim() || null;

    if (!email || !role || !STAFF_INVITE_ROLES.includes(role)) {
      return NextResponse.json(
        { ok: false, message: "email and valid staff role required" },
        { status: 400 },
      );
    }

    if (!canManageStaff(actor, role as UserRole, assignedCountry)) {
      return forbidden("Cannot invite this role");
    }

    if (role === "regional_admin" && !assignedCountry) {
      return NextResponse.json(
        { ok: false, message: "assignedCountry required for regional_admin" },
        { status: 400 },
      );
    }

    if (role === "sales_agent" && isRegionalAdmin(actor.role)) {
      if (managedByRegionalAdminId && managedByRegionalAdminId !== actor.id) {
        return forbidden("Regional admin can only assign agents to themselves");
      }
    }

    if (managedByRegionalAdminId && !(await assertRegionalAdminId(managedByRegionalAdminId))) {
      return NextResponse.json(
        { ok: false, message: "Invalid regional admin" },
        { status: 400 },
      );
    }

    const effectiveManagedBy =
      role === "sales_agent"
        ? managedByRegionalAdminId ??
          (isRegionalAdmin(actor.role) ? actor.id : null)
        : null;

    const result = await inviteStaffUser({
      email,
      role,
      fullName: body.fullName,
      assignedCountry:
        role === "regional_admin" || role === "sales_agent" ? assignedCountry : null,
      managedByRegionalAdminId: effectiveManagedBy,
      actorId: ctx.session.userId,
    });

    return NextResponse.json({
      ok: result.action === "invited" || result.action === "linked",
      result,
    });
  }

  if (body.action === "update") {
    if (!canManageAnyUser(actor)) {
      return forbidden("Only super admin can edit user assignments");
    }

    const profileId = body.profileId?.trim();
    if (!profileId) {
      return NextResponse.json({ ok: false, message: "profileId required" }, { status: 400 });
    }

    if (profileId === actor.id && body.role && body.role !== actor.role) {
      return forbidden("Cannot change your own role");
    }

    if (body.role && !canManageStaff(actor, body.role as UserRole)) {
      return forbidden("Cannot assign this role");
    }

    const assignedCountry =
      body.assignedCountry === "US"
        ? "US"
        : body.assignedCountry === "CO"
          ? "CO"
          : body.assignedCountry === null
            ? null
            : undefined;

    const managedBy =
      body.managedByRegionalAdminId === null
        ? null
        : body.managedByRegionalAdminId?.trim() || undefined;

    if (managedBy && !(await assertRegionalAdminId(managedBy))) {
      return NextResponse.json(
        { ok: false, message: "Invalid regional admin" },
        { status: 400 },
      );
    }

    if (body.clientId) {
      const access = await requireClientAccess(body.clientId);
      if ("error" in access && access.error) return access.error;
    }

    const ok = await updateProfileAdmin({
      profileId,
      role: body.role,
      clientId: body.clientId,
      fullName: body.fullName,
      assignedCountry,
      managedByRegionalAdminId: managedBy,
      actorId: ctx.session.userId,
    });

    return NextResponse.json(
      ok ? { ok: true } : { ok: false, message: "Update failed" },
      { status: ok ? 200 : 500 },
    );
  }

  const email = body.email?.trim();
  const clientId = body.clientId?.trim();
  if (!email || !clientId) {
    return NextResponse.json(
      { ok: false, message: "email and clientId required" },
      { status: 400 },
    );
  }

  const access = await requireClientAccess(clientId);
  if ("error" in access && access.error) return access.error;

  if (!canInvitePortalUser(ctx.scope, access.client)) {
    return forbidden("Cannot invite users for this client");
  }

  const portalRole = body.role as UserRole | undefined;

  if (body.action === "link") {
    const result = await linkPortalUser({
      email,
      clientId,
      fullName: body.fullName,
      actorId: ctx.session.userId,
    });
    if (
      result.action !== "skipped" &&
      portalRole &&
      portalRole !== "client_user" &&
      "userId" in result &&
      result.userId
    ) {
      await updateProfileAdmin({
        profileId: result.userId,
        role: portalRole,
        actorId: ctx.session.userId,
      });
    }
    return NextResponse.json({ ok: result.action !== "skipped", result });
  }

  const result = await invitePortalUser({
    email,
    clientId,
    fullName: body.fullName,
    actorId: ctx.session.userId,
  });

  if (
    (result.action === "invited" || result.action === "linked") &&
    portalRole &&
    portalRole !== "client_user"
  ) {
    const userId = "userId" in result ? result.userId : undefined;
    if (userId) {
      await updateProfileAdmin({
        profileId: userId,
        role: portalRole,
        actorId: ctx.session.userId,
      });
    }
  }

  return NextResponse.json({
    ok: result.action === "invited" || result.action === "linked",
    result,
  });
}
