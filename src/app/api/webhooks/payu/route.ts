import { NextResponse } from "next/server";
import { handlePayuWebhookEvent } from "@/services/saas/webhook-service";
import { verifyPayuConfirmationSignature } from "@/services/saas/payu-checkout-service";

function formToRecord(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  form.forEach((value, key) => {
    out[key] = String(value);
  });
  return out;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let payload: Record<string, string>;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    payload = formToRecord(form);
  } else {
    try {
      payload = (await request.json()) as Record<string, string>;
    } catch {
      return NextResponse.json({ ok: false, message: "Invalid body" }, { status: 400 });
    }
  }

  const sign = payload.sign ?? "";
  const merchantId = payload.merchant_id ?? payload.merchantId ?? "";
  const referenceCode = payload.reference_sale ?? payload.referenceCode ?? "";
  const value = payload.value ?? "";
  const currency = payload.currency ?? "COP";
  const statePol = payload.state_pol ?? payload.statePol ?? "";

  if (
    sign &&
    !verifyPayuConfirmationSignature({
      merchantId,
      referenceCode,
      value,
      currency,
      statePol,
      sign,
    })
  ) {
    return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
  }

  const result = await handlePayuWebhookEvent(payload);
  return NextResponse.json(result);
}
