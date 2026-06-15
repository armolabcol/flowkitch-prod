import { getServiceSaasClient } from "@/services/saas/db";
import { pickActiveApiKeyLast4 } from "@/services/saas/mappers";
import { assertClientInScope } from "@/services/saas/scope-service";
import type { StaffScope } from "@/lib/auth/permissions";

export async function getClientDetail(clientId: string, scope: StaffScope) {
  const inScope = await assertClientInScope(scope, clientId);
  if (!inScope) return null;

  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();

  if (!client) return null;

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("client_id", clientId)
    .order("name");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("client_id", clientId)
    .order("current_period_end", { ascending: false });

  const restaurantIds = (restaurants ?? []).map((r) => r.id);
  let installations: Array<{
    id: string;
    site_url: string;
    license_status: string;
    license_expires_at: string;
    restaurant_id: string;
    api_key_last4: string;
  }> = [];

  if (restaurantIds.length > 0) {
    const { data: instRows } = await supabase
      .from("plugin_installations")
      .select("*")
      .in("restaurant_id", restaurantIds);

    const ids = (instRows ?? []).map((i) => i.id);
    const { data: keys } = ids.length
      ? await supabase
          .from("api_keys")
          .select("installation_id, last4, status")
          .in("installation_id", ids)
      : { data: [] };

    const keysByInst = new Map<string, { last4: string; status: string }[]>();
    for (const k of keys ?? []) {
      const list = keysByInst.get(k.installation_id) ?? [];
      list.push({ last4: k.last4, status: k.status });
      keysByInst.set(k.installation_id, list);
    }

    installations = (instRows ?? []).map((i) => ({
      id: i.id,
      site_url: i.site_url,
      license_status: i.license_status,
      license_expires_at: i.license_expires_at,
      restaurant_id: i.restaurant_id,
      api_key_last4: pickActiveApiKeyLast4(keysByInst.get(i.id) ?? []),
    }));
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role, full_name")
    .eq("client_id", clientId);

  let assignedAgent: { id: string; email: string; full_name: string | null } | null =
    null;
  if (client.assigned_sales_agent_id) {
    const { data: agent } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", client.assigned_sales_agent_id)
      .maybeSingle();
    assignedAgent = agent;
  }

  return {
    client,
    restaurants: restaurants ?? [],
    subscriptions: subscriptions ?? [],
    installations,
    profiles: profiles ?? [],
    assignedAgent,
  };
}
