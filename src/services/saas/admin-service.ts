import {
  buildInstallationWithDetails,
  mapClient,
  mapMaintenanceLog,
  pickActiveApiKeyLast4,
} from "@/services/saas/mappers";
import { getServerSaasClient, EMPTY_ADMIN_STATS } from "@/services/saas/db";
import {
  filterClientsByScope,
  getAllowedClientIds,
} from "@/services/saas/scope-service";
import type { StaffScope } from "@/lib/auth/permissions";
import {
  daysUntil,
  earliestDate,
  toMembershipStatus,
} from "@/lib/client-membership";
import type {
  Client,
  ClientListItem,
  InstallationWithDetails,
  MaintenanceLog,
  OperationHubRow,
  Restaurant,
} from "@/types/saas";
import type { Database } from "@/lib/supabase/types";

type InstallationJoined = Database["public"]["Tables"]["plugin_installations"]["Row"] & {
  restaurants: Database["public"]["Tables"]["restaurants"]["Row"] & {
    clients: Database["public"]["Tables"]["clients"]["Row"];
  };
};

async function fetchInstallationsJoined(
  scope: StaffScope,
): Promise<InstallationWithDetails[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const allowedIds = await getAllowedClientIds(scope);

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

  const filtered = installations.filter((row) => {
    const client = row.restaurants?.clients;
    if (!client) return false;
    if (allowedIds === null) return true;
    return allowedIds.includes(client.id);
  });

  const ids = filtered.map((i) => i.id);
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

  return filtered.map((row) =>
    buildInstallationWithDetails(
      row,
      row.restaurants,
      row.restaurants.clients,
      pickActiveApiKeyLast4(keysByInstallation.get(row.id) ?? []),
    ),
  );
}

export async function getAdminDashboardStats(scope: StaffScope) {
  const supabase = await getServerSaasClient();
  if (!supabase) return { ...EMPTY_ADMIN_STATS, installations: [] };

  const clients = await listClients(scope);
  const installations = await fetchInstallationsJoined(scope);
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return {
    totalClients: clients.length,
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
    assignedClients: clients.length,
  };
}

export async function listClients(scope: StaffScope): Promise<Client[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  if (error || !data) return [];
  return filterClientsByScope(data.map(mapClient), scope);
}

export async function listClientsWithMembership(
  scope: StaffScope,
): Promise<ClientListItem[]> {
  const clients = await listClients(scope);
  if (clients.length === 0) return [];

  const supabase = await getServerSaasClient();
  if (!supabase) {
    return clients.map((client) => ({
      ...client,
      membershipStatus: "license_unknown",
      planName: null,
      expiresAt: null,
      daysRemaining: null,
      restaurantCount: 0,
      installationCount: 0,
    }));
  }

  const clientIds = clients.map((client) => client.id);
  const [{ data: restaurants }, { data: subscriptions }] = await Promise.all([
    supabase.from("restaurants").select("id, client_id").in("client_id", clientIds),
    supabase
      .from("subscriptions")
      .select("client_id, status, plan_name, current_period_end")
      .in("client_id", clientIds)
      .order("current_period_end", { ascending: false }),
  ]);

  const restaurantsByClient = new Map<string, string[]>();
  for (const restaurant of restaurants ?? []) {
    const list = restaurantsByClient.get(restaurant.client_id) ?? [];
    list.push(restaurant.id);
    restaurantsByClient.set(restaurant.client_id, list);
  }

  const restaurantIds = (restaurants ?? []).map((restaurant) => restaurant.id);
  const installationsByRestaurant = new Map<
    string,
    Array<{ license_status: string; license_expires_at: string }>
  >();

  if (restaurantIds.length > 0) {
    const { data: installations } = await supabase
      .from("plugin_installations")
      .select("restaurant_id, license_status, license_expires_at")
      .in("restaurant_id", restaurantIds);

    for (const installation of installations ?? []) {
      const list = installationsByRestaurant.get(installation.restaurant_id) ?? [];
      list.push({
        license_status: installation.license_status,
        license_expires_at: installation.license_expires_at,
      });
      installationsByRestaurant.set(installation.restaurant_id, list);
    }
  }

  const subscriptionByClient = new Map<
    string,
    { status: string; plan_name: string; current_period_end: string }
  >();
  for (const subscription of subscriptions ?? []) {
    if (!subscriptionByClient.has(subscription.client_id)) {
      subscriptionByClient.set(subscription.client_id, subscription);
    }
  }

  return clients.map((client) => {
    const restaurantIdsForClient = restaurantsByClient.get(client.id) ?? [];
    const installations = restaurantIdsForClient.flatMap(
      (restaurantId) => installationsByRestaurant.get(restaurantId) ?? [],
    );
    const subscription = subscriptionByClient.get(client.id);
    const expiresAt = earliestDate([
      subscription?.current_period_end,
      ...installations.map((installation) => installation.license_expires_at),
    ]);

    return {
      ...client,
      membershipStatus: toMembershipStatus([
        subscription?.status,
        ...installations.map((installation) => installation.license_status),
      ]),
      planName: subscription?.plan_name ?? null,
      expiresAt,
      daysRemaining: daysUntil(expiresAt),
      restaurantCount: restaurantIdsForClient.length,
      installationCount: installations.length,
    };
  });
}

export async function listRestaurants(scope: StaffScope): Promise<Restaurant[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const allowedIds = await getAllowedClientIds(scope);

  let query = supabase.from("restaurants").select("*").order("name");
  if (allowedIds !== null) {
    if (allowedIds.length === 0) return [];
    query = query.in("client_id", allowedIds);
  }

  const { data, error } = await query;

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

export async function listOperationHubRows(
  scope: StaffScope,
): Promise<OperationHubRow[]> {
  const [restaurants, installations, clients] = await Promise.all([
    listRestaurants(scope),
    listInstallationsWithDetails(scope),
    listClientsWithMembership(scope),
  ]);

  const clientById = new Map(clients.map((client) => [client.id, client]));
  const installationsByRestaurant = new Map<string, InstallationWithDetails[]>();
  for (const installation of installations) {
    const list = installationsByRestaurant.get(installation.restaurant_id) ?? [];
    list.push(installation);
    installationsByRestaurant.set(installation.restaurant_id, list);
  }

  const rows: OperationHubRow[] = [];

  for (const restaurant of restaurants) {
    const client = clientById.get(restaurant.client_id);
    const restaurantInstallations =
      installationsByRestaurant.get(restaurant.id) ?? [];

    if (restaurantInstallations.length === 0) {
      rows.push({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        city: restaurant.city,
        country: restaurant.country,
        clientId: restaurant.client_id,
        clientName: client?.name ?? "—",
        clientEmail: client?.email ?? "",
        siteUrl: null,
        installationId: null,
        membershipStatus: client?.membershipStatus ?? "license_unknown",
        planName: client?.planName ?? null,
        expiresAt: client?.expiresAt ?? null,
        daysRemaining: client?.daysRemaining ?? null,
        apiKeyLast4: null,
      });
      continue;
    }

    for (const installation of restaurantInstallations) {
      rows.push({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        city: restaurant.city,
        country: restaurant.country,
        clientId: restaurant.client_id,
        clientName: client?.name ?? installation.client.name,
        clientEmail: client?.email ?? installation.client.email,
        siteUrl: installation.site_url,
        installationId: installation.id,
        membershipStatus: installation.license_status,
        planName: client?.planName ?? null,
        expiresAt: installation.license_expires_at,
        daysRemaining: daysUntil(installation.license_expires_at),
        apiKeyLast4: installation.api_key_last4,
      });
    }
  }

  return rows.sort((a, b) =>
    `${a.clientName} ${a.restaurantName}`.localeCompare(
      `${b.clientName} ${b.restaurantName}`,
      "es",
    ),
  );
}

export async function listInstallationsWithDetails(
  scope: StaffScope,
): Promise<InstallationWithDetails[]> {
  return fetchInstallationsJoined(scope);
}

export async function listMaintenanceLogs(
  scope: StaffScope,
): Promise<MaintenanceLog[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const installations = await fetchInstallationsJoined(scope);
  const instIds = installations.map((i) => i.id);
  if (instIds.length === 0) return [];

  const { data, error } = await supabase
    .from("maintenance_logs")
    .select("*")
    .in("installation_id", instIds)
    .order("scheduled_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapMaintenanceLog);
}

export async function getClientsMap(scope: StaffScope): Promise<Record<string, string>> {
  const clients = await listClients(scope);
  return Object.fromEntries(clients.map((c) => [c.id, c.name]));
}
