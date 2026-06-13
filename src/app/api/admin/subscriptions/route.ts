import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import { updateSubscriptionRecord } from "@/services/saas/subscriptions-admin-service";

type PatchBody = {
  subscriptionId?: string;
  planName?: string;
  amountCents?: number;
  currency?: string;
};

export async function PATCH(request: Request) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
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
    session.userId,
  );

  if (!ok) {
    return NextResponse.json({ ok: false, message: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
