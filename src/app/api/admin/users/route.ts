import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import {
  invitePortalUser,
  linkPortalUser,
  updateProfileAdmin,
} from "@/services/saas/profiles-admin-service";

type Body = {
  action?: "link" | "invite" | "update";
  email?: string;
  clientId?: string;
  fullName?: string;
  profileId?: string;
  role?: string;
};

export async function POST(request: Request) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (body.action === "update") {
    const profileId = body.profileId?.trim();
    if (!profileId) {
      return NextResponse.json({ ok: false, message: "profileId required" }, { status: 400 });
    }

    const ok = await updateProfileAdmin({
      profileId,
      role: body.role,
      clientId: body.clientId,
      fullName: body.fullName,
      actorId: session.userId,
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

  if (body.action === "link") {
    const result = await linkPortalUser({
      email,
      clientId,
      fullName: body.fullName,
      actorId: session.userId,
    });
    return NextResponse.json({ ok: result.action !== "skipped", result });
  }

  const result = await invitePortalUser({
    email,
    clientId,
    fullName: body.fullName,
    actorId: session.userId,
  });

  return NextResponse.json({
    ok: result.action === "invited" || result.action === "linked",
    result,
  });
}
