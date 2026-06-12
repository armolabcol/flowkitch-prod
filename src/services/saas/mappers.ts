import type {
  ApiKeyStatus,
  Client,
  InstallationWithDetails,
  LicenseStatus,
  MaintenanceLog,
  PluginInstallation,
  Restaurant,
  Subscription,
  SubscriptionStatus,
  TelemetryDaily,
} from "@/types/saas";
import type { Database } from "@/lib/supabase/types";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type RestaurantRow = Database["public"]["Tables"]["restaurants"]["Row"];
type InstallationRow = Database["public"]["Tables"]["plugin_installations"]["Row"];
type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];
type MaintenanceRow = Database["public"]["Tables"]["maintenance_logs"]["Row"];
type TelemetryRow = Database["public"]["Tables"]["telemetry_daily"]["Row"];

export function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    email: row.email,
    created_at: row.created_at,
  };
}

export function mapRestaurant(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    client_id: row.client_id,
    name: row.name,
    country: row.country,
    city: row.city,
    timezone: row.timezone,
  };
}

export function mapInstallation(row: InstallationRow): PluginInstallation {
  return {
    id: row.id,
    restaurant_id: row.restaurant_id,
    site_url: row.site_url,
    plugin_version: row.plugin_version,
    license_status: row.license_status as LicenseStatus,
    license_expires_at: row.license_expires_at,
    grace_until: row.grace_until,
    last_sync_at: row.last_sync_at,
    last_license_check_at: row.last_license_check_at,
    orders_month: row.orders_month,
    revenue_month: Number(row.revenue_month),
    average_ticket: row.average_ticket,
    created_at: row.created_at,
  };
}

export function mapSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    client_id: row.client_id,
    status: row.status as SubscriptionStatus,
    plan_name: row.plan_name,
    current_period_end: row.current_period_end,
    grace_until: row.grace_until,
    amount_cents: row.amount_cents,
    currency: row.currency,
  };
}

export function mapMaintenanceLog(row: MaintenanceRow): MaintenanceLog {
  return {
    id: row.id,
    installation_id: row.installation_id,
    title: row.title,
    status: row.status as MaintenanceLog["status"],
    scheduled_at: row.scheduled_at,
    completed_at: row.completed_at,
    notes: row.notes,
  };
}

export function mapTelemetry(row: TelemetryRow): TelemetryDaily {
  return {
    id: row.id,
    installation_id: row.installation_id,
    date: row.date,
    orders_count: row.orders_count,
    revenue_cents: Number(row.revenue_cents),
    average_ticket_cents: row.average_ticket_cents,
    plugin_version: row.plugin_version,
  };
}

export function buildInstallationWithDetails(
  installation: InstallationRow,
  restaurant: RestaurantRow,
  client: ClientRow,
  apiKeyLast4: string,
): InstallationWithDetails {
  return {
    ...mapInstallation(installation),
    restaurant: mapRestaurant(restaurant),
    client: mapClient(client),
    api_key_last4: apiKeyLast4,
  };
}

export type ApiKeyMeta = {
  last4: string;
  status: ApiKeyStatus;
};

export function pickActiveApiKeyLast4(
  keys: { last4: string; status: string }[],
): string {
  const active = keys.find((k) => k.status === "active");
  return active?.last4 ?? keys[0]?.last4 ?? "????";
}
