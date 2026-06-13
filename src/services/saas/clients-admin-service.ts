import { getServiceSaasClient } from "@/services/saas/db";
import { writeAuditLog } from "@/services/audit-service";
import type { Database } from "@/lib/supabase/types";

export async function createClientRecord(params: {
  name: string;
  country: "CO" | "US";
  email: string;
  taxId?: string | null;
  actorId?: string | null;
}): Promise<{ id: string } | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const row: Database["public"]["Tables"]["clients"]["Insert"] = {
    name: params.name.trim(),
    country: params.country,
    email: params.email.trim().toLowerCase(),
    tax_id: params.taxId?.trim() || null,
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
