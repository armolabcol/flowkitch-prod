import { createHash, randomBytes } from "crypto";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n";

const PAYU_API = env.payuTestMode
  ? "https://sandbox.api.payulatam.com/payments-api/v4.3"
  : "https://api.payulatam.com/payments-api/v4.3";

const PAYU_CHECKOUT = env.payuTestMode
  ? "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
  : "https://checkout.payulatam.com/ppp-web-gateway-payu/";

export async function createPayuCheckoutSession(params: {
  clientId: string;
  clientEmail: string;
  amountCents: number;
  locale: Locale;
}): Promise<string | null> {
  const apiLogin = env.payuApiLogin;
  const apiKey = env.payuApiKey;
  const merchantId = env.payuMerchantId;
  const accountId = env.payuAccountId;
  if (!apiLogin || !apiKey || !merchantId || !accountId) return null;

  const referenceCode = `kitch-${params.clientId}-${Date.now()}`;
  const amount = (params.amountCents / 100).toFixed(2);
  const signature = createHash("md5")
    .update(`${apiKey}~${merchantId}~${referenceCode}~${amount}~COP`)
    .digest("hex");

  const responseUrl = `${env.siteUrl}/${params.locale}/portal/membership?renewed=1`;
  const confirmationUrl = `${env.siteUrl}/api/webhooks/payu`;

  const query = new URLSearchParams({
    merchantId,
    accountId,
    description: "Kitch Pro Membresía",
    referenceCode,
    amount,
    currency: "COP",
    signature,
    test: env.payuTestMode ? "1" : "0",
    buyerEmail: params.clientEmail,
    responseUrl,
    confirmationUrl,
    extra1: params.clientId,
  });

  return `${PAYU_CHECKOUT}?${query.toString()}`;
}

export function verifyPayuConfirmationSignature(params: {
  merchantId: string;
  referenceCode: string;
  value: string;
  currency: string;
  statePol: string;
  sign: string;
}): boolean {
  const apiKey = env.payuApiKey;
  if (!apiKey) return false;

  const expected = createHash("md5")
    .update(
      `${apiKey}~${params.merchantId}~${params.referenceCode}~${params.value}~${params.currency}~${params.statePol}`,
    )
    .digest("hex");

  return expected === params.sign;
}

export function parseClientIdFromPayuReference(reference: string | undefined): string | null {
  if (!reference?.startsWith("kitch-")) return null;
  const withoutPrefix = reference.slice(6);
  const lastDash = withoutPrefix.lastIndexOf("-");
  if (lastDash <= 0) return null;
  const suffix = withoutPrefix.slice(lastDash + 1);
  if (!/^\d+$/.test(suffix)) return null;
  return withoutPrefix.slice(0, lastDash);
}

export function generatePayuNonce(): string {
  return randomBytes(8).toString("hex");
}
