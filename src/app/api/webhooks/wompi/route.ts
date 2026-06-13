import { NextResponse } from "next/server";
import { handleWompiWebhookEvent } from "@/services/saas/webhook-service";
import { verifyWompiEventSignature } from "@/services/saas/wompi-checkout-service";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-event-checksum");

  if (!verifyWompiEventSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
  }

  let event: Parameters<typeof handleWompiWebhookEvent>[0];
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const result = await handleWompiWebhookEvent(event);
  return NextResponse.json(result);
}
