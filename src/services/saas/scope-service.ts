import { getServiceSaasClient } from "@/services/saas/db";
import type { ClientScopeInput, StaffScope } from "@/lib/auth/permissions";
import type { Client } from "@/types/saas";

export async function getPortfolioClientIds(agentId: string): Promise<string[]> {
  const supabase = getServiceSaasClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("clients")
    .select("id")
    .eq("assigned_sales_agent_id", agentId);

  return (data ?? []).map((r) => r.id);
}

export async function getAllowedClientIds(
  scope: StaffScope,
): Promise<string[] | null> {
  if (scope.kind === "global") return null;

  const supabase = getServiceSaasClient();
  if (!supabase) return [];

  if (scope.kind === "country") {
    const { data } = await supabase
      .from("clients")
      .select("id")
      .eq("country", scope.country);
    return (data ?? []).map((r) => r.id);
  }

  return scope.clientIds;
}

export function filterClientsByScope<T extends ClientScopeInput>(
  clients: T[],
  scope: StaffScope,
): T[] {
  if (scope.kind === "global") return clients;
  if (scope.kind === "country") {
    return clients.filter((c) => c.country === scope.country);
  }
  return clients.filter((c) => scope.clientIds.includes(c.id));
}

export function filterByClientIds<T extends { client_id?: string; id?: string }>(
  rows: T[],
  clientIds: string[] | null,
  clientIdKey: "client_id" | "id" = "client_id",
): T[] {
  if (clientIds === null) return rows;
  if (clientIds.length === 0) return [];
  return rows.filter((r) => {
    const cid = clientIdKey === "id" ? r.id : r.client_id;
    return cid && clientIds.includes(cid);
  });
}

export async function getClientScopeRow(
  clientId: string,
): Promise<ClientScopeInput | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("clients")
    .select("id, country, assigned_sales_agent_id")
    .eq("id", clientId)
    .maybeSingle<{
      id: string;
      country: string;
      assigned_sales_agent_id: string | null;
    }>();

  return data;
}

export async function assertClientInScope(
  scope: StaffScope,
  clientId: string,
): Promise<ClientScopeInput | null> {
  const row = await getClientScopeRow(clientId);
  if (!row) return null;

  const { canReadClient } = await import("@/lib/auth/permissions");
  if (!canReadClient(scope, row)) return null;
  return row;
}

export async function listSalesAgentsForCountry(
  country: "CO" | "US",
): Promise<{ id: string; email: string; full_name: string | null }[]> {
  const supabase = getServiceSaasClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("role", "sales_agent");

  return (data ?? []).filter(() => true);
}

export async function getClientIdForRestaurant(
  restaurantId: string,
): Promise<string | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("restaurants")
    .select("client_id")
    .eq("id", restaurantId)
    .maybeSingle<{ client_id: string }>();
  return data?.client_id ?? null;
}

export async function getClientIdForInstallation(
  installationId: string,
): Promise<string | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("plugin_installations")
    .select("restaurant_id")
    .eq("id", installationId)
    .maybeSingle<{ restaurant_id: string }>();
  if (!data) return null;
  return getClientIdForRestaurant(data.restaurant_id);
}

export async function getClientIdForSubscription(
  subscriptionId: string,
): Promise<string | null> {
  const supabase = getServiceSaasClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("subscriptions")
    .select("client_id")
    .eq("id", subscriptionId)
    .maybeSingle<{ client_id: string }>();
  return data?.client_id ?? null;
}
