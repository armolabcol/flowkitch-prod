import {
  env,
  isStripeCheckoutConfigured,
} from "@/lib/env";
import { getWhatsAppLeadHref } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n";

export type CheckoutResult =
  | { mode: "stripe"; url: string }
  | { mode: "whatsapp"; url: string; message: string };

export async function createRenewalCheckout(params: {
  clientId: string;
  clientEmail: string;
  country: string;
  locale: Locale;
}): Promise<CheckoutResult> {
  if (params.country === "US" && isStripeCheckoutConfigured()) {
    const url = await createStripeCheckoutSession({
      clientId: params.clientId,
      clientEmail: params.clientEmail,
      locale: params.locale,
    });
    if (url) {
      return { mode: "stripe", url };
    }
  }

  const waUrl = getWhatsAppLeadHref(params.locale);
  return {
    mode: "whatsapp",
    url: waUrl,
    message:
      params.locale === "es"
        ? "Pagos en línea próximamente. Te redirigimos a WhatsApp para renovar."
        : "Online checkout coming soon. Redirecting to WhatsApp to renew.",
  };
}

async function createStripeCheckoutSession(params: {
  clientId: string;
  clientEmail: string;
  locale: Locale;
}): Promise<string | null> {
  const secret = env.stripeSecretKey!;
  const priceId = env.stripePriceIdUsd!;
  const successUrl = `${env.siteUrl}/${params.locale}/portal/membership?renewed=1`;
  const cancelUrl = `${env.siteUrl}/${params.locale}/portal/membership`;

  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: params.clientEmail,
    "metadata[client_id]": params.clientId,
    "subscription_data[metadata][client_id]": params.clientId,
  });

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}
