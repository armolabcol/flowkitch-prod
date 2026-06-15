import { NextResponse } from "next/server";
import { requireScopedAdmin, forbidden, unauthorized } from "@/lib/auth/admin-api-helpers";
import { canManageBillingSettings } from "@/lib/auth/permissions";
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
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  const settings = await getBillingSettings();

  return NextResponse.json({
    ok: true,
    ...settings,
    canEdit: canManageBillingSettings(ctx.session.profile!.role),
    providers: {
      stripe: isStripeCheckoutConfigured(),
      wompi: isWompiCheckoutConfigured(),
      payu: isPayuCheckoutConfigured(),
    },
  });
}

type PatchBody = { coProvider?: string };

export async function PATCH(request: Request) {
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  if (!canManageBillingSettings(ctx.session.profile!.role)) {
    return forbidden();
  }

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const coProvider = body.coProvider === "payu" ? "payu" : "wompi";
  const ok = await setCoPaymentProvider(coProvider as CoPaymentProvider, ctx.session.userId);

  if (!ok) {
    return NextResponse.json({ ok: false, message: "Failed to save" }, { status: 500 });
  }

  const settings = await getBillingSettings();
  return NextResponse.json({ ok: true, ...settings });
}
