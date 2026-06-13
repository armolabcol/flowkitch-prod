import { createHash } from "crypto";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n";

const WOMPI_API = "https://production.wompi.co/v1";

export async function createWompiCheckoutSession(params: {
  clientId: string;
  clientEmail: string;
  amountCents: number;
  locale: Locale;
}): Promise<string | null> {
  const privateKey = env.wompiPrivateKey;
  const integritySecret = env.wompiIntegritySecret;
  if (!privateKey || !integritySecret) return null;

  const reference = `kitch-${params.clientId}-${Date.now()}`;
  const redirectUrl = `${env.siteUrl}/${params.locale}/portal/membership?renewed=1`;

  const signature = createHash("sha256")
    .update(`${reference}${params.amountCents}COP${integritySecret}`)
    .digest("hex");

  const payload = {
    name: "Kitch Pro — Membresía",
    description: `Renovación membresía cliente ${params.clientId.slice(0, 8)}`,
    single_use: true,
    collect_shipping: false,
    amount_in_cents: params.amountCents,
    currency: "COP",
    reference,
    customer_email: params.clientEmail,
    redirect_url: redirectUrl,
    signature: `sha256=${signature}`,
  };

  try {
    const res = await fetch(`${WOMPI_API}/payment_links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${privateKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { data?: { id?: string } };
    const linkId = data.data?.id;
    if (!linkId) return null;
    return `https://checkout.wompi.co/l/${linkId}`;
  } catch {
    return null;
  }
}

export function verifyWompiEventSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secret = env.wompiEventsSecret;
  if (!secret) return true;
  if (!signatureHeader) return false;

  const expected = createHash("sha256")
    .update(`${rawBody}${secret}`)
    .digest("hex");

  return signatureHeader === expected || signatureHeader === `sha256=${expected}`;
}

export function parseClientIdFromReference(reference: string | undefined): string | null {
  if (!reference?.startsWith("kitch-")) return null;
  const withoutPrefix = reference.slice(6);
  const lastDash = withoutPrefix.lastIndexOf("-");
  if (lastDash <= 0) return null;
  const suffix = withoutPrefix.slice(lastDash + 1);
  if (!/^\d+$/.test(suffix)) return null;
  return withoutPrefix.slice(0, lastDash);
}
