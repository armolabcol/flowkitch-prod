import {
  buildInstallationWithDetails,
  mapClient,
  mapMaintenanceLog,
  pickActiveApiKeyLast4,
} from "@/services/saas/mappers";
import { getServerSaasClient, EMPTY_ADMIN_STATS } from "@/services/saas/db";
import type {
  Client,
  InstallationWithDetails,
  MaintenanceLog,
  Restaurant,
} from "@/types/saas";
import type { Database } from "@/lib/supabase/types";

type InstallationJoined = Database["public"]["Tables"]["plugin_installations"]["Row"] & {
  restaurants: Database["public"]["Tables"]["restaurants"]["Row"] & {
    clients: Database["public"]["Tables"]["clients"]["Row"];
  };
};

async function fetchInstallationsJoined(): Promise<InstallationWithDetails[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data: rawInstallations, error } = await supabase
    .from("plugin_installations")
    .select(
      `
      *,
      restaurants (
        *,
        clients (*)
      )
    `,
    )
    .order("created_at", { ascending: false });

  const installations = rawInstallations as InstallationJoined[] | null;

  if (error || !installations?.length) return [];

  const ids = installations.map((i) => i.id);
  const { data: rawKeys } = await supabase
    .from("api_keys")
    .select("installation_id, last4, status")
    .in("installation_id", ids);

  const keys = rawKeys as
    | { installation_id: string; last4: string; status: string }[]
    | null;

  const keysByInstallation = new Map<string, { last4: string; status: string }[]>();
  for (const key of keys ?? []) {
    const list = keysByInstallation.get(key.installation_id) ?? [];
    list.push({ last4: key.last4, status: key.status });
    keysByInstallation.set(key.installation_id, list);
  }

  return (installations as InstallationJoined[])
    .filter((row) => row.restaurants?.clients)
    .map((row) =>
      buildInstallationWithDetails(
        row,
        row.restaurants,
        row.restaurants.clients,
        pickActiveApiKeyLast4(keysByInstallation.get(row.id) ?? []),
      ),
    );
}

export async function getAdminDashboardStats() {
  const supabase = await getServerSaasClient();
  if (!supabase) return { ...EMPTY_ADMIN_STATS, installations: [] };

  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  const installations = await fetchInstallationsJoined();
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return {
    totalClients: totalClients ?? 0,
    activeInstallations: installations.filter(
      (i) =>
        i.license_status === "active" || i.license_status === "grace_period",
    ).length,
    expiringSoon: installations.filter((i) => {
      const expires = new Date(i.license_expires_at).getTime();
      return expires - now < thirtyDays && expires > now;
    }).length,
    suspendedInstallations: installations.filter(
      (i) => i.license_status === "suspended",
    ).length,
    totalOrdersMonth: installations.reduce((s, i) => s + i.orders_month, 0),
    totalRevenueMonth: installations.reduce((s, i) => s + i.revenue_month, 0),
    installations,
  };
}

export async function listClients(): Promise<Client[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  if (error || !data) return [];
  return data.map(mapClient);
}

export async function listRestaurants(): Promise<Restaurant[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("name");

  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    client_id: r.client_id,
    name: r.name,
    country: r.country,
    city: r.city,
    timezone: r.timezone,
  }));
}

export async function listInstallationsWithDetails(): Promise<InstallationWithDetails[]> {
  return fetchInstallationsJoined();
}

export async function listMaintenanceLogs(): Promise<MaintenanceLog[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("maintenance_logs")
    .select("*")
    .order("scheduled_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapMaintenanceLog);
}

export async function getClientsMap(): Promise<Record<string, string>> {
  const clients = await listClients();
  return Object.fromEntries(clients.map((c) => [c.id, c.name]));
}
