import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import { provisionClientStack } from "@/services/saas/onboarding-service";

type Body = {
  client?: {
    name?: string;
    email?: string;
    country?: string;
    taxId?: string;
  };
  restaurant?: {
    name?: string;
    city?: string;
    timezone?: string;
  };
  installation?: {
    siteUrl?: string;
    pluginVersion?: string;
    licenseDays?: number;
  };
  subscription?: {
    planName?: string;
    amountCents?: number;
    currency?: string;
    periodDays?: number;
  };
  portalUser?: {
    email?: string;
    fullName?: string;
  };
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

  const clientName = body.client?.name?.trim();
  const clientEmail = body.client?.email?.trim();
  const restaurantName = body.restaurant?.name?.trim();
  const city = body.restaurant?.city?.trim();
  const siteUrl = body.installation?.siteUrl?.trim();

  if (!clientName || !clientEmail || !restaurantName || !city || !siteUrl) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Required: client.name, client.email, restaurant.name, restaurant.city, installation.siteUrl",
      },
      { status: 400 },
    );
  }

  const country = body.client?.country === "US" ? "US" : "CO";
  const expectedCurrency = country === "US" ? "USD" : "COP";
  const currency =
    body.subscription?.currency === "USD" || body.subscription?.currency === "COP"
      ? body.subscription.currency
      : expectedCurrency;

  if (
    body.subscription?.currency &&
    body.subscription.currency !== expectedCurrency
  ) {
    return NextResponse.json(
      {
        ok: false,
        message: `Currency must be ${expectedCurrency} for country ${country}`,
      },
      { status: 400 },
    );
  }

  if (
    body.subscription?.amountCents !== undefined &&
    (body.subscription.amountCents <= 0 || !Number.isFinite(body.subscription.amountCents))
  ) {
    return NextResponse.json(
      { ok: false, message: "subscription.amountCents must be a positive number" },
      { status: 400 },
    );
  }

  const result = await provisionClientStack({
    client: {
      name: clientName,
      email: clientEmail,
      country,
      taxId: body.client?.taxId,
    },
    restaurant: {
      name: restaurantName,
      city,
      timezone: body.restaurant?.timezone,
    },
    installation: {
      siteUrl,
      pluginVersion: body.installation?.pluginVersion,
      licenseDays: body.installation?.licenseDays,
    },
    subscription: {
          planName: body.subscription?.planName,
          amountCents: body.subscription?.amountCents,
          currency,
          periodDays: body.subscription?.periodDays,
        },
    portalUser: body.portalUser?.email
      ? {
          email: body.portalUser.email,
          fullName: body.portalUser.fullName,
        }
      : undefined,
    actorId: session.userId,
  });

  if ("error" in result) {
    return NextResponse.json({ ok: false, message: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ...result });
}
