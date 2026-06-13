import { getServerSaasClient, getServiceSaasClient } from "@/services/saas/db";
import type { Json } from "@/lib/supabase/types";

export async function writeAuditLog(params: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const supabase = getServiceSaasClient();
  if (!supabase) return;

  await supabase.from("audit_logs").insert({
    actor_id: params.actorId ?? null,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    metadata: (params.metadata ?? {}) as Json,
  } as never);
}

export async function listRecentAuditLogs(limit = 50) {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}
