import { NextResponse } from "next/server";
import {
  forbidden,
  requireScopedAdmin,
  unauthorized,
} from "@/lib/auth/admin-api-helpers";
import {
  daysUntil,
  operationalExpiry,
  toMembershipStatus,
} from "@/lib/client-membership";
import { getClientDetail } from "@/services/saas/client-detail-service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  const { id } = await context.params;
  const detail = await getClientDetail(id, ctx.scope);
  if (!detail) return forbidden("Client out of scope");

  const subscription = detail.subscriptions[0] ?? null;
  const licenseExpiresAt = operationalExpiry({
    licenseDates: detail.installations.map(
      (installation) => installation.license_expires_at,
    ),
    billingPeriodEnd: subscription?.current_period_end,
  });

  return NextResponse.json({
    ok: true,
    client: {
      id: detail.client.id,
      name: detail.client.name,
      email: detail.client.email,
      country: detail.client.country,
      payment_provider: detail.client.payment_provider,
      tax_id: detail.client.tax_id,
    },
    membership: {
      status: toMembershipStatus([
        subscription?.status,
        ...detail.installations.map((installation) => installation.license_status),
      ]),
      planName: subscription?.plan_name ?? null,
      amountCents: subscription?.amount_cents ?? null,
      currency: subscription?.currency ?? null,
      periodEnd: subscription?.current_period_end ?? null,
      expiresAt: licenseExpiresAt,
      daysRemaining: daysUntil(licenseExpiresAt),
      subscriptionId: subscription?.id ?? null,
    },
    restaurants: detail.restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      city: restaurant.city,
    })),
    installations: detail.installations,
    assignedAgent: detail.assignedAgent,
  });
}
