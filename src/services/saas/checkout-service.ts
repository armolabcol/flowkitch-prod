import {
  env,
  isPayuCheckoutConfigured,
  isStripeCheckoutConfigured,
  isWompiCheckoutConfigured,
} from "@/lib/env";
import { getWhatsAppLeadHref } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n";
import type { PaymentProvider, Subscription } from "@/types/saas";
import { createPayuCheckoutSession } from "@/services/saas/payu-checkout-service";
import { createWompiCheckoutSession } from "@/services/saas/wompi-checkout-service";

export type CheckoutResult =
  | { mode: "stripe"; url: string }
  | { mode: "wompi"; url: string }
  | { mode: "payu"; url: string }
  | { mode: "whatsapp"; url: string; message: string };

export async function createRenewalCheckout(params: {
  clientId: string;
  clientEmail: string;
  country: string;
  paymentProvider: PaymentProvider | null;
  subscription: Subscription | null;
  locale: Locale;
}): Promise<CheckoutResult> {
  const amountCents = params.subscription?.amount_cents ?? 0;
  if (amountCents <= 0) {
    return whatsappFallback(params.locale, params.country);
  }

  if (params.country === "US") {
    if (isStripeCheckoutConfigured()) {
      const url = await createStripeCheckoutSession({
        clientId: params.clientId,
        clientEmail: params.clientEmail,
        amountCents,
        currency: "USD",
        locale: params.locale,
      });
      if (url) return { mode: "stripe", url };
    }
    return whatsappFallback(params.locale, params.country);
  }

  const provider = params.paymentProvider ?? "wompi";

  if (provider === "wompi" && isWompiCheckoutConfigured()) {
    const url = await createWompiCheckoutSession({
      clientId: params.clientId,
      clientEmail: params.clientEmail,
      amountCents,
      locale: params.locale,
    });
    if (url) return { mode: "wompi", url };
  }

  if (provider === "payu" && isPayuCheckoutConfigured()) {
    const url = await createPayuCheckoutSession({
      clientId: params.clientId,
      clientEmail: params.clientEmail,
      amountCents,
      locale: params.locale,
    });
    if (url) return { mode: "payu", url };
  }

  return whatsappFallback(params.locale, params.country);
}

function whatsappFallback(locale: Locale, country: string): CheckoutResult {
  const waUrl = getWhatsAppLeadHref(locale);
  return {
    mode: "whatsapp",
    url: waUrl,
    message:
      locale === "es"
        ? `Pagos en línea ${country === "CO" ? "Colombia" : "USA"} próximamente o sin credenciales. Te redirigimos a WhatsApp.`
        : "Online checkout unavailable. Redirecting to WhatsApp.",
  };
}

async function createStripeCheckoutSession(params: {
  clientId: string;
  clientEmail: string;
  amountCents: number;
  currency: "USD";
  locale: Locale;
}): Promise<string | null> {
  const secret = env.stripeSecretKey!;
  const successUrl = `${env.siteUrl}/${params.locale}/portal/membership?renewed=1`;
  const cancelUrl = `${env.siteUrl}/${params.locale}/portal/membership`;

  const body = new URLSearchParams({
    mode: "payment",
    "line_items[0][price_data][currency]": params.currency.toLowerCase(),
    "line_items[0][price_data][unit_amount]": String(params.amountCents),
    "line_items[0][price_data][product_data][name]": "Kitch Pro Membership",
    "line_items[0][quantity]": "1",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: params.clientEmail,
    "metadata[client_id]": params.clientId,
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
