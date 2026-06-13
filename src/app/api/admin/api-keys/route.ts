import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import { rotateApiKey, revokeActiveApiKeys } from "@/services/api-key-service";

type Body = {
  action?: "rotate" | "revoke";
  installationId?: string;
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
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const installationId = body.installationId?.trim();
  if (!installationId || (body.action !== "rotate" && body.action !== "revoke")) {
    return NextResponse.json(
      { ok: false, message: "Required: action (rotate|revoke), installationId" },
      { status: 400 },
    );
  }

  if (body.action === "revoke") {
    const ok = await revokeActiveApiKeys(installationId, session.userId);
    return NextResponse.json(
      ok ? { ok: true, message: "API keys revoked" } : { ok: false, message: "Revoke failed" },
      { status: ok ? 200 : 500 },
    );
  }

  const result = await rotateApiKey(installationId, session.userId);
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
