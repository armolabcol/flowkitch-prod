import { parseClientIdFromReference } from "@/services/saas/wompi-checkout-service";
import { parseClientIdFromPayuReference } from "@/services/saas/payu-checkout-service";
import { getServiceSaasClient } from "@/services/saas/db";
import { writeAuditLog } from "@/services/audit-service";
import { recordPaymentFromWebhook } from "@/services/saas/payments-service";
import type { Payment } from "@/types/saas";

type StripeEvent = {
  id?: string;
  type?: string;
  data?: {
    object?: {
      id?: string;
      customer?: string;
      amount_total?: number;
      amount_paid?: number;
      currency?: string;
      status?: string;
      metadata?: Record<string, string>;
      customer_email?: string;
    };
  };
};

type WompiEvent = {
  event?: string;
  data?: {
    transaction?: {
      id?: string;
      status?: string;
      amount_in_cents?: number;
      currency?: string;
      customer_email?: string;
      reference?: string;
    };
  };
};

async function persistStripeCustomerId(
  clientId: string,
  customerId: string,
): Promise<void> {
  const supabase = getServiceSaasClient();
  if (!supabase) return;

  await supabase
    .from("clients")
    .update({ stripe_customer_id: customerId } as never)
    .eq("id", clientId)
    .is("stripe_customer_id", null);
}

async function persistWompiCustomerEmail(
  clientId: string,
  email: string,
): Promise<void> {
  const supabase = getServiceSaasClient();
  if (!supabase) return;

  await supabase
    .from("clients")
    .update({ wompi_customer_email: email.trim().toLowerCase() } as never)
    .eq("id", clientId);
}

async function persistPayuBuyerEmail(
  clientId: string,
  email: string,
): Promise<void> {
  const supabase = getServiceSaasClient();
  if (!supabase) return;

  await supabase
    .from("clients")
    .update({ payu_buyer_email: email.trim().toLowerCase() } as never)
    .eq("id", clientId);
}

async function resolveClientIdByStripeCustomer(
  customerId: string,
): Promise<string | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("clients")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle<{ id: string }>();

  return data?.id ?? null;
}

async function resolveClientIdByEmail(email: string): Promise<string | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("clients")
    .select("id")
    .ilike("email", email.trim())
    .maybeSingle<{ id: string }>();

  return data?.id ?? null;
}

async function activateClientSubscription(clientId: string): Promise<void> {
  const supabase = getServiceSaasClient();
  if (!supabase) return;

  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  const periodEndIso = periodEnd.toISOString();

  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      current_period_end: periodEndIso,
    } as never)
    .eq("client_id", clientId);

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id")
    .eq("client_id", clientId);

  const restaurantIds = (restaurants ?? []).map((r: { id: string }) => r.id);
  if (restaurantIds.length === 0) return;

  await supabase
    .from("plugin_installations")
    .update({
      license_status: "active",
      license_expires_at: periodEndIso,
      grace_until: null,
    } as never)
    .in("restaurant_id", restaurantIds);
}

export async function handleStripeWebhookEvent(
  event: StripeEvent,
): Promise<{ ok: boolean; message: string }> {
  const type = event.type ?? "unknown";
  const obj = event.data?.object;

  await writeAuditLog({
    action: "webhook.stripe.received",
    entityType: "webhook",
    entityId: event.id ?? "unknown",
    metadata: { type },
  });

  if (
    type !== "checkout.session.completed" &&
    type !== "invoice.payment_succeeded"
  ) {
    return { ok: true, message: `Ignored event type: ${type}` };
  }

  let clientId = obj?.metadata?.client_id ?? null;
  if (!clientId && obj?.customer) {
    clientId = await resolveClientIdByStripeCustomer(String(obj.customer));
  }
  if (!clientId && obj?.customer_email) {
    clientId = await resolveClientIdByEmail(obj.customer_email);
  }

  if (!clientId) {
    return { ok: true, message: "No client_id mapping — logged only" };
  }

  const amountCents =
    obj?.amount_total ?? obj?.amount_paid ?? 0;
  const currency = (obj?.currency ?? "usd").toUpperCase();
  const providerPaymentId = obj?.id ?? event.id ?? `stripe-${Date.now()}`;

  const paymentId = await recordPaymentFromWebhook({
    clientId,
    amountCents,
    currency: currency === "USD" || currency === "COP" ? currency : "USD",
    status: "paid" satisfies Payment["status"],
    provider: "stripe",
    providerPaymentId,
    description: `Stripe ${type}`,
    paidAt: new Date().toISOString(),
  });

  if (paymentId) {
    if (obj?.customer) {
      await persistStripeCustomerId(clientId, String(obj.customer));
    }
    await activateClientSubscription(clientId);
  }

  return { ok: true, message: paymentId ? "Payment recorded" : "Duplicate or failed" };
}

export async function handleWompiWebhookEvent(
  event: WompiEvent,
): Promise<{ ok: boolean; message: string }> {
  const tx = event.data?.transaction;
  const txId = tx?.id ?? "unknown";

  await writeAuditLog({
    action: "webhook.wompi.received",
    entityType: "webhook",
    entityId: txId,
    metadata: { event: event.event, status: tx?.status },
  });

  if (tx?.status !== "APPROVED") {
    return { ok: true, message: `Ignored status: ${tx?.status ?? "none"}` };
  }

  let clientId: string | null = parseClientIdFromReference(tx?.reference);
  if (!clientId && tx?.customer_email) {
    clientId = await resolveClientIdByEmail(tx.customer_email);
  }

  if (!clientId) {
    return { ok: true, message: "No client mapping — logged only" };
  }

  const paymentId = await recordPaymentFromWebhook({
    clientId,
    amountCents: tx.amount_in_cents ?? 0,
    currency: tx.currency === "COP" ? "COP" : "COP",
    status: "paid",
    provider: "wompi",
    providerPaymentId: txId,
    description: `Wompi ${event.event ?? "transaction"}`,
    paidAt: new Date().toISOString(),
  });

  if (paymentId) {
    if (tx.customer_email) {
      await persistWompiCustomerEmail(clientId, tx.customer_email);
    }
    await activateClientSubscription(clientId);
  }

  return { ok: true, message: paymentId ? "Payment recorded" : "Duplicate or failed" };
}

export type PayuConfirmation = {
  merchant_id?: string;
  merchantId?: string;
  reference_sale?: string;
  referenceCode?: string;
  value?: string;
  currency?: string;
  state_pol?: string;
  statePol?: string;
  sign?: string;
  buyerEmail?: string;
  email_buyer?: string;
  extra1?: string;
};

export async function handlePayuWebhookEvent(
  payload: PayuConfirmation,
): Promise<{ ok: boolean; message: string }> {
  const reference =
    payload.reference_sale ?? payload.referenceCode ?? "unknown";
  const statePol = String(payload.state_pol ?? payload.statePol ?? "");

  await writeAuditLog({
    action: "webhook.payu.received",
    entityType: "webhook",
    entityId: reference,
    metadata: { statePol },
  });

  if (statePol !== "4") {
    return { ok: true, message: `Ignored state_pol: ${statePol}` };
  }

  let clientId =
    payload.extra1?.trim() ||
    parseClientIdFromPayuReference(reference) ||
    null;

  const buyerEmail = payload.buyerEmail ?? payload.email_buyer;
  if (!clientId && buyerEmail) {
    clientId = await resolveClientIdByEmail(buyerEmail);
  }

  if (!clientId) {
    return { ok: true, message: "No client mapping — logged only" };
  }

  const valueStr = payload.value ?? "0";
  const amountCents = Math.round(parseFloat(valueStr) * 100);

  const paymentId = await recordPaymentFromWebhook({
    clientId,
    amountCents: Number.isFinite(amountCents) ? amountCents : 0,
    currency: payload.currency === "USD" ? "USD" : "COP",
    status: "paid",
    provider: "payu",
    providerPaymentId: reference,
    description: "PayU confirmation",
    paidAt: new Date().toISOString(),
  });

  if (paymentId) {
    if (buyerEmail) {
      await persistPayuBuyerEmail(clientId, buyerEmail);
    }
    await activateClientSubscription(clientId);
  }

  return { ok: true, message: paymentId ? "Payment recorded" : "Duplicate or failed" };
}

export async function getExpiringInstallations(withinDays = 30) {
  const supabase = getServiceSaasClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("plugin_installations")
    .select(
      `
      id,
      license_expires_at,
      license_status,
      restaurants ( name, clients ( name, email ) )
    `,
    )
    .in("license_status", ["active", "grace_period", "past_due"])
    .order("license_expires_at", { ascending: true });

  const now = Date.now();
  const windowMs = withinDays * 24 * 60 * 60 * 1000;

  return (data ?? [])
    .filter((row) => {
      const expires = new Date(
        (row as { license_expires_at: string }).license_expires_at,
      ).getTime();
      return expires - now < windowMs && expires > now;
    })
    .map((row) => {
      const r = row as {
        id: string;
        license_expires_at: string;
        license_status: string;
        restaurants: { name: string; clients: { name: string; email: string } };
      };
      return {
        id: r.id,
        license_expires_at: r.license_expires_at,
        license_status: r.license_status,
        restaurantName: r.restaurants?.name ?? "—",
        clientName: r.restaurants?.clients?.name ?? "—",
        clientEmail: r.restaurants?.clients?.email ?? "",
      };
    });
}
