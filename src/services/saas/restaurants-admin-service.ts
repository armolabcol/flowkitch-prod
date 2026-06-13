import { getServiceSaasClient } from "@/services/saas/db";
import { writeAuditLog } from "@/services/audit-service";
import type { Database } from "@/lib/supabase/types";

const DEFAULT_TIMEZONE: Record<string, string> = {
  CO: "America/Bogota",
  US: "America/New_York",
};

export async function createRestaurantRecord(params: {
  clientId: string;
  name: string;
  country: "CO" | "US";
  city: string;
  timezone?: string;
  actorId?: string | null;
}): Promise<{ id: string } | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const row: Database["public"]["Tables"]["restaurants"]["Insert"] = {
    client_id: params.clientId,
    name: params.name.trim(),
    country: params.country,
    city: params.city.trim(),
    timezone: params.timezone ?? DEFAULT_TIMEZONE[params.country],
  };

  const { data, error } = await supabase
    .from("restaurants")
    .insert(row as never)
    .select("id")
    .single<{ id: string }>();

  if (error || !data) return null;

  await writeAuditLog({
    actorId: params.actorId,
    action: "restaurant.created",
    entityType: "restaurant",
    entityId: data.id,
    metadata: { clientId: params.clientId, name: params.name },
  });

  return data;
}

export async function updateRestaurantRecord(
  restaurantId: string,
  updates: { name?: string; city?: string },
  actorId?: string | null,
): Promise<boolean> {
  const supabase = getServiceSaasClient();
  if (!supabase) return false;

  const patch: Database["public"]["Tables"]["restaurants"]["Update"] = {};
  if (updates.name) patch.name = updates.name.trim();
  if (updates.city) patch.city = updates.city.trim();

  const { error } = await supabase
    .from("restaurants")
    .update(patch as never)
    .eq("id", restaurantId);

  if (error) return false;

  await writeAuditLog({
    actorId,
    action: "restaurant.updated",
    entityType: "restaurant",
    entityId: restaurantId,
    metadata: updates,
  });

  return true;
}
