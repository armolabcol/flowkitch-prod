import { getServiceSaasClient } from "@/services/saas/db";
import { writeAuditLog } from "@/services/audit-service";
import type { Database } from "@/lib/supabase/types";

export async function createSubscriptionRecord(params: {
  clientId: string;
  planName?: string;
  amountCents?: number;
  currency?: "USD" | "COP";
  periodDays?: number;
  actorId?: string | null;
}): Promise<{ id: string } | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + (params.periodDays ?? 30));

  const row: Database["public"]["Tables"]["subscriptions"]["Insert"] = {
    client_id: params.clientId,
    status: "active",
    plan_name: params.planName ?? "Kitch Pro",
    current_period_end: periodEnd.toISOString(),
    amount_cents: params.amountCents ?? 119000,
    currency: params.currency ?? "COP",
  };

  const { data, error } = await supabase
    .from("subscriptions")
    .insert(row as never)
    .select("id")
    .single<{ id: string }>();

  if (error || !data) return null;

  await writeAuditLog({
    actorId: params.actorId,
    action: "subscription.created",
    entityType: "subscription",
    entityId: data.id,
    metadata: { clientId: params.clientId },
  });

  return data;
}
