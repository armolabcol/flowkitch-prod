import { NextResponse } from "next/server";
import { writeAuditLog } from "@/services/audit-service";
import { env } from "@/lib/env";

/**
 * Stripe webhook stub — validates presence of stripe-signature when secret is set.
 * Full payment reconciliation requires STRIPE_WEBHOOK_SECRET + client mapping.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret && !signature) {
    return NextResponse.json({ ok: false, message: "Missing stripe-signature" }, { status: 400 });
  }

  let event: { type?: string; id?: string };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  await writeAuditLog({
    action: "webhook.stripe.received",
    entityType: "webhook",
    entityId: event.id ?? "unknown",
    metadata: {
      type: event.type,
      siteUrl: env.siteUrl,
      note: "Stub — map event to client_id and call recordPaymentFromWebhook",
    },
  });

  return NextResponse.json({ ok: true, received: true });
}
