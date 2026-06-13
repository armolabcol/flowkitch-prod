import { getServerSaasClient, getServiceSaasClient } from "@/services/saas/db";
import type { Payment } from "@/types/saas";
import type { Database } from "@/lib/supabase/types";

function mapPayment(
  row: Database["public"]["Tables"]["payments"]["Row"],
): Payment {
  return {
    id: row.id,
    client_id: row.client_id,
    amount_cents: row.amount_cents,
    currency: row.currency,
    status: row.status as Payment["status"],
    paid_at: row.paid_at,
    description: row.description,
  };
}

export async function listPaymentsForClient(
  clientId: string,
): Promise<Payment[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("client_id", clientId)
    .order("paid_at", { ascending: false, nullsFirst: false })
    .limit(24);

  if (error || !data) return [];
  return data.map(mapPayment);
}

export async function recordPaymentFromWebhook(params: {
  clientId: string;
  subscriptionId?: string | null;
  amountCents: number;
  currency: string;
  status: Payment["status"];
  provider: string;
  providerPaymentId: string;
  description: string;
  paidAt?: string | null;
}): Promise<string | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("payments")
    .insert({
      client_id: params.clientId,
      subscription_id: params.subscriptionId ?? null,
      amount_cents: params.amountCents,
      currency: params.currency,
      status: params.status,
      provider: params.provider,
      provider_payment_id: params.providerPaymentId,
      description: params.description,
      paid_at: params.paidAt ?? null,
    } as never)
    .select("id")
    .single<{ id: string }>();

  if (error) return null;
  return data.id;
}
