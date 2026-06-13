import { getServiceSaasClient } from "@/services/saas/db";
import { writeAuditLog } from "@/services/audit-service";
import type { Database } from "@/lib/supabase/types";

export async function createClientRecord(params: {
  name: string;
  country: "CO" | "US";
  email: string;
  taxId?: string | null;
  paymentProvider?: "stripe" | "wompi" | "payu" | null;
  actorId?: string | null;
}): Promise<{ id: string } | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const row: Database["public"]["Tables"]["clients"]["Insert"] = {
    name: params.name.trim(),
    country: params.country,
    email: params.email.trim().toLowerCase(),
    tax_id: params.taxId?.trim() || null,
    payment_provider: params.paymentProvider ?? null,
  };

  const { data, error } = await supabase
    .from("clients")
    .insert(row as never)
    .select("id")
    .single<{ id: string }>();

  if (error || !data) return null;

  await writeAuditLog({
    actorId: params.actorId,
    action: "client.created",
    entityType: "client",
    entityId: data.id,
    metadata: { name: params.name, country: params.country },
  });

  return data;
}

export async function updateClientRecord(
  clientId: string,
  updates: {
    name?: string;
    email?: string;
    country?: "CO" | "US";
    taxId?: string | null;
    stripeCustomerId?: string | null;
    wompiCustomerEmail?: string | null;
    payuBuyerEmail?: string | null;
    paymentProvider?: "stripe" | "wompi" | "payu" | null;
  },
  actorId?: string | null,
): Promise<boolean> {
  const supabase = getServiceSaasClient();
  if (!supabase) return false;

  const patch: Database["public"]["Tables"]["clients"]["Update"] = {};
  if (updates.name) patch.name = updates.name.trim();
  if (updates.email) patch.email = updates.email.trim().toLowerCase();
  if (updates.country) patch.country = updates.country;
  if (updates.taxId !== undefined) patch.tax_id = updates.taxId?.trim() || null;
  if (updates.stripeCustomerId !== undefined) {
    patch.stripe_customer_id = updates.stripeCustomerId;
  }
  if (updates.wompiCustomerEmail !== undefined) {
    patch.wompi_customer_email = updates.wompiCustomerEmail;
  }
  if (updates.payuBuyerEmail !== undefined) {
    patch.payu_buyer_email = updates.payuBuyerEmail;
  }
  if (updates.paymentProvider !== undefined) {
    patch.payment_provider = updates.paymentProvider;
  }

  const { error } = await supabase
    .from("clients")
    .update(patch as never)
    .eq("id", clientId);

  if (error) return false;

  await writeAuditLog({
    actorId,
    action: "client.updated",
    entityType: "client",
    entityId: clientId,
    metadata: updates as Record<string, unknown>,
  });

  return true;
}

export async function getClientById(clientId: string) {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle<Database["public"]["Tables"]["clients"]["Row"]>();

  return data;
}
