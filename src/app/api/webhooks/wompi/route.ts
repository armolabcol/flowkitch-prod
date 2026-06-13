import { NextResponse } from "next/server";
import { handleWompiWebhookEvent } from "@/services/saas/webhook-service";

export async function POST(request: Request) {
  const rawBody = await request.text();

  let event: Parameters<typeof handleWompiWebhookEvent>[0];
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const result = await handleWompiWebhookEvent(event);
  return NextResponse.json(result);
}
