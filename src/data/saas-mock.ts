import { hashApiKey } from "@/lib/security/api-keys";
import type {
  ApiKeyPublicView,
  Client,
  InstallationWithDetails,
  MaintenanceLog,
  Payment,
  PluginInstallation,
  Restaurant,
  Subscription,
  TelemetryDaily,
} from "@/types/saas";

/** Mock API keys — full keys for server-side validation only */
export const MOCK_API_KEYS: Record<string, string> = {
  inst_001: "kitch_live_mock_active_col_7x9k",
  inst_002: "kitch_live_mock_pastdue_usa_3m2p",
  inst_003: "kitch_live_mock_suspended_co_8f1q",
  inst_004: "kitch_live_mock_grace_usa_5n4r",
  inst_005: "kitch_live_mock_active_usa_2w8t",
};

export const mockClients: Client[] = [
  {
    id: "cli_001",
    name: "Grupo Sabores del Valle",
    country: "CO",
    email: "ops@saboresdelvalle.co",
    created_at: "2024-03-15T10:00:00.000Z",
  },
  {
    id: "cli_002",
    name: "Coastal Dining Group",
    country: "US",
    email: "billing@coastaldining.com",
    created_at: "2024-06-01T14:30:00.000Z",
  },
  {
    id: "cli_003",
    name: "Andes Kitchen Collective",
    country: "CO",
    email: "admin@andeskitchen.co",
    created_at: "2025-01-10T09:00:00.000Z",
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: "rest_001",
    client_id: "cli_001",
    name: "La Terraza Medellín",
    country: "CO",
    city: "Medellín",
    timezone: "America/Bogota",
  },
  {
    id: "rest_002",
    client_id: "cli_001",
    name: "Sabores Envigado",
    country: "CO",
    city: "Envigado",
    timezone: "America/Bogota",
  },
  {
    id: "rest_003",
    client_id: "cli_002",
    name: "Harbor Table Miami",
    country: "US",
    city: "Miami",
    timezone: "America/New_York",
  },
  {
    id: "rest_004",
    client_id: "cli_002",
    name: "Sunset Grill Orlando",
    country: "US",
    city: "Orlando",
    timezone: "America/New_York",
  },
  {
    id: "rest_005",
    client_id: "cli_003",
    name: "Andes Kitchen Bogotá",
    country: "CO",
    city: "Bogotá",
    timezone: "America/Bogota",
  },
];

export const mockInstallations: PluginInstallation[] = [
  {
    id: "inst_001",
    restaurant_id: "rest_001",
    site_url: "https://laterraza-medellin.com",
    plugin_version: "3.0.1",
    license_status: "active",
    license_expires_at: "2026-09-15T00:00:00.000Z",
    grace_until: null,
    last_sync_at: "2026-06-11T22:45:00.000Z",
    last_license_check_at: "2026-06-11T23:00:00.000Z",
    orders_month: 2840,
    revenue_month: 42850000,
    average_ticket: 15088,
    created_at: "2024-04-01T00:00:00.000Z",
  },
  {
    id: "inst_002",
    restaurant_id: "rest_003",
    site_url: "https://harbortable.miami",
    plugin_version: "2.9.8",
    license_status: "past_due",
    license_expires_at: "2026-06-01T00:00:00.000Z",
    grace_until: "2026-06-15T00:00:00.000Z",
    last_sync_at: "2026-06-10T18:30:00.000Z",
    last_license_check_at: "2026-06-11T08:00:00.000Z",
    orders_month: 1920,
    revenue_month: 86400,
    average_ticket: 45,
    created_at: "2024-07-15T00:00:00.000Z",
  },
  {
    id: "inst_003",
    restaurant_id: "rest_002",
    site_url: "https://sabores-envigado.co",
    plugin_version: "3.0.0",
    license_status: "suspended",
    license_expires_at: "2026-03-01T00:00:00.000Z",
    grace_until: null,
    last_sync_at: "2026-05-28T12:00:00.000Z",
    last_license_check_at: "2026-06-01T00:00:00.000Z",
    orders_month: 0,
    revenue_month: 0,
    average_ticket: 0,
    created_at: "2024-05-20T00:00:00.000Z",
  },
  {
    id: "inst_004",
    restaurant_id: "rest_004",
    site_url: "https://sunsetgrillorlando.com",
    plugin_version: "3.0.1",
    license_status: "grace_period",
    license_expires_at: "2026-06-05T00:00:00.000Z",
    grace_until: "2026-06-20T00:00:00.000Z",
    last_sync_at: "2026-06-11T20:15:00.000Z",
    last_license_check_at: "2026-06-11T20:30:00.000Z",
    orders_month: 1560,
    revenue_month: 70200,
    average_ticket: 45,
    created_at: "2024-08-10T00:00:00.000Z",
  },
  {
    id: "inst_005",
    restaurant_id: "rest_005",
    site_url: "https://andeskitchen.co",
    plugin_version: "3.0.1",
    license_status: "active",
    license_expires_at: "2026-12-01T00:00:00.000Z",
    grace_until: null,
    last_sync_at: "2026-06-11T23:10:00.000Z",
    last_license_check_at: "2026-06-11T23:15:00.000Z",
    orders_month: 3100,
    revenue_month: 46500000,
    average_ticket: 15000,
    created_at: "2025-02-01T00:00:00.000Z",
  },
];

export const mockApiKeyViews: ApiKeyPublicView[] = Object.entries(
  MOCK_API_KEYS,
).map(([installationId, key], i) => ({
  id: `key_${String(i + 1).padStart(3, "0")}`,
  installation_id: installationId,
  last4: key.slice(-4),
  status: installationId === "inst_003" ? "revoked" : "active",
  created_at: "2024-04-01T00:00:00.000Z",
  revoked_at: installationId === "inst_003" ? "2026-05-01T00:00:00.000Z" : null,
}));

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub_001",
    client_id: "cli_001",
    status: "active",
    plan_name: "Kitch Pro",
    current_period_end: "2026-09-15T00:00:00.000Z",
    grace_until: null,
    amount_cents: 29900,
    currency: "USD",
  },
  {
    id: "sub_002",
    client_id: "cli_002",
    status: "past_due",
    plan_name: "Kitch Pro",
    current_period_end: "2026-06-01T00:00:00.000Z",
    grace_until: "2026-06-15T00:00:00.000Z",
    amount_cents: 29900,
    currency: "USD",
  },
  {
    id: "sub_003",
    client_id: "cli_003",
    status: "active",
    plan_name: "Kitch Pro",
    current_period_end: "2026-12-01T00:00:00.000Z",
    grace_until: null,
    amount_cents: 119000,
    currency: "COP",
  },
];

export const mockPayments: Payment[] = [
  {
    id: "pay_001",
    client_id: "cli_001",
    amount_cents: 29900,
    currency: "USD",
    status: "paid",
    paid_at: "2026-03-15T10:00:00.000Z",
    description: "Kitch Pro — Mar 2026",
  },
  {
    id: "pay_002",
    client_id: "cli_001",
    amount_cents: 29900,
    currency: "USD",
    status: "paid",
    paid_at: "2026-02-15T10:00:00.000Z",
    description: "Kitch Pro — Feb 2026",
  },
  {
    id: "pay_003",
    client_id: "cli_002",
    amount_cents: 29900,
    currency: "USD",
    status: "failed",
    paid_at: null,
    description: "Kitch Pro — Jun 2026 (retry pending)",
  },
];

export const mockMaintenanceLogs: MaintenanceLog[] = [
  {
    id: "mnt_001",
    installation_id: "inst_003",
    title: "Database migration 3.0",
    status: "scheduled",
    scheduled_at: "2026-06-20T10:00:00.000Z",
    completed_at: null,
    notes: "Pending client confirmation",
  },
];

export const mockTelemetry: TelemetryDaily[] = [
  {
    id: "tel_001",
    installation_id: "inst_001",
    date: "2026-06-11",
    orders_count: 98,
    revenue_cents: 1478400,
    average_ticket_cents: 15088,
    plugin_version: "3.0.1",
  },
];

/** Map of hashed API keys to installation IDs */
export const mockApiKeyHashIndex: Record<string, string> = Object.fromEntries(
  Object.entries(MOCK_API_KEYS).map(([instId, key]) => [
    hashApiKey(key),
    instId,
  ]),
);

export function getInstallationWithDetails(
  installationId: string,
): InstallationWithDetails | null {
  const installation = mockInstallations.find((i) => i.id === installationId);
  if (!installation) return null;

  const restaurant = mockRestaurants.find(
    (r) => r.id === installation.restaurant_id,
  );
  if (!restaurant) return null;

  const client = mockClients.find((c) => c.id === restaurant.client_id);
  if (!client) return null;

  const apiKey = MOCK_API_KEYS[installationId];
  return {
    ...installation,
    restaurant,
    client,
    api_key_last4: apiKey?.slice(-4) ?? "????",
  };
}

export function getAllInstallationsWithDetails(): InstallationWithDetails[] {
  return mockInstallations
    .map((i) => getInstallationWithDetails(i.id))
    .filter((i): i is InstallationWithDetails => i !== null);
}

/** Default client user mock — Harbor Table Miami */
export const MOCK_CLIENT_USER = {
  role: "client_user" as const,
  client_id: "cli_002",
  restaurant_id: "rest_003",
  installation_id: "inst_002",
  email: "manager@harbortable.miami",
};

export function getAdminDashboardStats() {
  const installations = getAllInstallationsWithDetails();
  const now = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return {
    totalClients: mockClients.length,
    activeInstallations: installations.filter(
      (i) => i.license_status === "active" || i.license_status === "grace_period",
    ).length,
    expiringSoon: installations.filter((i) => {
      const expires = new Date(i.license_expires_at).getTime();
      return expires - now.getTime() < thirtyDays && expires > now.getTime();
    }).length,
    suspendedInstallations: installations.filter(
      (i) => i.license_status === "suspended",
    ).length,
    totalOrdersMonth: installations.reduce((s, i) => s + i.orders_month, 0),
    totalRevenueMonth: installations.reduce((s, i) => s + i.revenue_month, 0),
    installations,
  };
}

export function getClientPortalData(clientId: string = MOCK_CLIENT_USER.client_id) {
  const client = mockClients.find((c) => c.id === clientId);
  const installation = getInstallationWithDetails(MOCK_CLIENT_USER.installation_id);
  const subscription = mockSubscriptions.find((s) => s.client_id === clientId);
  const payments = mockPayments.filter((p) => p.client_id === clientId);

  return { client, installation, subscription, payments };
}
