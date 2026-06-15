import { NextResponse } from "next/server";
import {
  forbidden,
  requireClientWrite,
  requireScopedAdmin,
  unauthorized,
} from "@/lib/auth/admin-api-helpers";
import { getClientIdForSubscription } from "@/services/saas/scope-service";
import { updateSubscriptionRecord } from "@/services/saas/subscriptions-admin-service";

type PatchBody = {
  subscriptionId?: string;
  planName?: string;
  amountCents?: number;
  currency?: string;
};

export async function PATCH(request: Request) {
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  if (ctx.scope.kind === "portfolio") {
    return forbidden("Sales agents cannot edit subscriptions");
  }

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const subscriptionId = body.subscriptionId?.trim();
  if (!subscriptionId) {
    return NextResponse.json(
      { ok: false, message: "subscriptionId required" },
      { status: 400 },
    );
  }

  const clientId = await getClientIdForSubscription(subscriptionId);
  if (!clientId) {
    return NextResponse.json({ ok: false, message: "Subscription not found" }, { status: 404 });
  }

  const access = await requireClientWrite(clientId);
  if ("error" in access && access.error) return access.error;

  const currency =
    body.currency === "USD" || body.currency === "COP" ? body.currency : undefined;

  if (body.amountCents !== undefined && body.amountCents <= 0) {
    return NextResponse.json(
      { ok: false, message: "amountCents must be positive" },
      { status: 400 },
    );
  }

  const ok = await updateSubscriptionRecord(
    subscriptionId,
    {
      planName: body.planName?.trim(),
      amountCents: body.amountCents,
      currency,
    },
    access.session.userId,
  );

  if (!ok) {
    return NextResponse.json({ ok: false, message: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
