import { NextResponse } from "next/server";
import { writeAuditLog } from "@/services/audit-service";
import { env } from "@/lib/env";

/**
 * Wompi webhook stub — logs events for Colombia payments integration.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();

  let event: { event?: string; data?: { transaction?: { id?: string } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const txId = event.data?.transaction?.id ?? "unknown";

  await writeAuditLog({
    action: "webhook.wompi.received",
    entityType: "webhook",
    entityId: txId,
    metadata: {
      event: event.event,
      siteUrl: env.siteUrl,
      note: "Stub — verify Wompi signature and map to client_id",
    },
  });

  return NextResponse.json({ ok: true, received: true });
}
