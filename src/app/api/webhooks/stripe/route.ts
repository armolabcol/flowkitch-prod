import { NextResponse } from "next/server";
import { handleStripeWebhookEvent } from "@/services/saas/webhook-service";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret && !signature) {
    return NextResponse.json(
      { ok: false, message: "Missing stripe-signature" },
      { status: 400 },
    );
  }

  let event: Parameters<typeof handleStripeWebhookEvent>[0];
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const result = await handleStripeWebhookEvent(event);
  return NextResponse.json(result);
}
