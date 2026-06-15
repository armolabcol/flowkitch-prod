import { NextResponse } from "next/server";
import {
  canRotateApiKeys,
  forbidden,
  requireClientAccess,
  requireScopedAdmin,
  unauthorized,
} from "@/lib/auth/admin-api-helpers";
import { getClientIdForInstallation } from "@/services/saas/scope-service";
import { rotateApiKey, revokeActiveApiKeys } from "@/services/api-key-service";

type Body = {
  action?: "rotate" | "revoke";
  installationId?: string;
};

export async function POST(request: Request) {
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  if (!canRotateApiKeys(ctx.scope)) {
    return forbidden("Cannot rotate API keys");
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const installationId = body.installationId?.trim();
  if (!installationId || (body.action !== "rotate" && body.action !== "revoke")) {
    return NextResponse.json(
      { ok: false, message: "Required: action (rotate|revoke), installationId" },
      { status: 400 },
    );
  }

  const clientId = await getClientIdForInstallation(installationId);
  if (!clientId) {
    return NextResponse.json({ ok: false, message: "Installation not found" }, { status: 404 });
  }

  const access = await requireClientAccess(clientId);
  if ("error" in access && access.error) return access.error;

  if (body.action === "revoke") {
    const ok = await revokeActiveApiKeys(installationId, ctx.session.userId);
    return NextResponse.json(
      ok ? { ok: true, message: "API keys revoked" } : { ok: false, message: "Revoke failed" },
      { status: ok ? 200 : 500 },
    );
  }

  const result = await rotateApiKey(installationId, ctx.session.userId);
  if (!result) {
    return NextResponse.json({ ok: false, message: "Rotate failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "API key rotated — copy now, it will not be shown again",
    apiKey: result.apiKey,
    last4: result.publicView.last4,
  });
}
