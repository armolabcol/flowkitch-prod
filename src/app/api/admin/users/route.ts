import { NextResponse } from "next/server";
import {
  canInvitePortalUser,
  canManageStaff,
  forbidden,
  requireClientAccess,
  requireScopedAdmin,
  unauthorized,
} from "@/lib/auth/admin-api-helpers";
import { isSalesAgent } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/saas";
import {
  invitePortalUser,
  inviteStaffUser,
  linkPortalUser,
  updateProfileAdmin,
} from "@/services/saas/profiles-admin-service";

type Body = {
  action?: "link" | "invite" | "update" | "invite_staff";
  email?: string;
  clientId?: string;
  fullName?: string;
  profileId?: string;
  role?: string;
  assignedCountry?: string;
};

export async function POST(request: Request) {
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  if (isSalesAgent(ctx.session.profile!.role) && ctx.scope.kind === "portfolio") {
    // sales can invite portal users to assigned clients only — handled per action
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (body.action === "invite_staff") {
    if (ctx.scope.kind === "portfolio") {
      return forbidden("Sales agents cannot invite staff");
    }

    const email = body.email?.trim();
    const role = body.role as "regional_admin" | "sales_agent" | undefined;
    const assignedCountry =
      body.assignedCountry === "US" ? "US" : body.assignedCountry === "CO" ? "CO" : null;

    if (!email || !role) {
      return NextResponse.json(
        { ok: false, message: "email and role required" },
        { status: 400 },
      );
    }

    if (
      !canManageStaff(ctx.session.profile!, role as UserRole, assignedCountry)
    ) {
      return forbidden("Cannot invite this role");
    }

    if (role === "regional_admin" && !assignedCountry) {
      return NextResponse.json(
        { ok: false, message: "assignedCountry required for regional_admin" },
        { status: 400 },
      );
    }

    const result = await inviteStaffUser({
      email,
      role,
      fullName: body.fullName,
      assignedCountry: role === "regional_admin" ? assignedCountry : null,
      actorId: ctx.session.userId,
    });

    return NextResponse.json({
      ok: result.action === "invited" || result.action === "linked",
      result,
    });
  }

  if (body.action === "update") {
    const profileId = body.profileId?.trim();
    if (!profileId) {
      return NextResponse.json({ ok: false, message: "profileId required" }, { status: 400 });
    }

    if (body.role && !canManageStaff(ctx.session.profile!, body.role as UserRole)) {
      return forbidden("Cannot assign this role");
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

  if (body.action === "link") {
    const result = await linkPortalUser({
      email,
      clientId,
      fullName: body.fullName,
      actorId: ctx.session.userId,
    });
    return NextResponse.json({ ok: result.action !== "skipped", result });
  }

  const result = await invitePortalUser({
    email,
    clientId,
    fullName: body.fullName,
    actorId: ctx.session.userId,
  });

  return NextResponse.json({
    ok: result.action === "invited" || result.action === "linked",
    result,
  });
}
