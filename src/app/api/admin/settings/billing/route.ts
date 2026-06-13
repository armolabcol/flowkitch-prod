import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import { isBillingSettingsRole } from "@/lib/auth/roles";
import {
  isPayuCheckoutConfigured,
  isStripeCheckoutConfigured,
  isWompiCheckoutConfigured,
} from "@/lib/env";
import {
  getBillingSettings,
  setCoPaymentProvider,
  type CoPaymentProvider,
} from "@/services/saas/platform-settings-service";

export async function GET() {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const settings = await getBillingSettings();

  return NextResponse.json({
    ok: true,
    ...settings,
    canEdit: session.profile
      ? isBillingSettingsRole(session.profile.role)
      : false,
    providers: {
      stripe: isStripeCheckoutConfigured(),
      wompi: isWompiCheckoutConfigured(),
      payu: isPayuCheckoutConfigured(),
    },
  });
}

type PatchBody = { coProvider?: string };

export async function PATCH(request: Request) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!session?.profile || !isBillingSettingsRole(session.profile.role)) {
    return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
  }

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const coProvider = body.coProvider === "payu" ? "payu" : "wompi";
  const ok = await setCoPaymentProvider(coProvider as CoPaymentProvider, session.userId);

  if (!ok) {
    return NextResponse.json({ ok: false, message: "Failed to save" }, { status: 500 });
  }

  const settings = await getBillingSettings();
  return NextResponse.json({ ok: true, ...settings });
}
