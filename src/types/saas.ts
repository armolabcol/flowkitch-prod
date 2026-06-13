/** User roles — extensible for future RBAC */
export type UserRole =
  | "armo_admin"
  | "client_user"
  | "super_admin"
  | "billing_admin"
  | "support_agent"
  | "sales_agent"
  | "client_owner"
  | "client_billing";

export type LicenseStatus =
  | "active"
  | "past_due"
  | "grace_period"
  | "suspended"
  | "cancelled"
  | "maintenance_required"
  | "license_unknown";

export type ApiKeyStatus = "active" | "revoked";

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "grace_period"
  | "cancelled"
  | "trialing";

export type PaymentProvider = "stripe" | "wompi" | "payu";

export interface Client {
  id: string;
  name: string;
  country: string;
  email: string;
  payment_provider: PaymentProvider | null;
  created_at: string;
}

export interface Restaurant {
  id: string;
  client_id: string;
  name: string;
  country: string;
  city: string;
  timezone: string;
}

export interface PluginInstallation {
  id: string;
  restaurant_id: string;
  site_url: string;
  plugin_version: string;
  license_status: LicenseStatus;
  license_expires_at: string;
  grace_until: string | null;
  last_sync_at: string | null;
  last_license_check_at: string | null;
  orders_month: number;
  revenue_month: number;
  average_ticket: number;
  created_at: string;
}

export interface ApiKeyPublicView {
  id: string;
  installation_id: string;
  last4: string;
  status: ApiKeyStatus;
  created_at: string;
  revoked_at: string | null;
}

export interface Subscription {
  id: string;
  client_id: string;
  status: SubscriptionStatus;
  plan_name: string;
  current_period_end: string;
  grace_until: string | null;
  amount_cents: number;
  currency: string;
}

export interface Payment {
  id: string;
  client_id: string;
  amount_cents: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  paid_at: string | null;
  description: string;
}

export interface MaintenanceLog {
  id: string;
  installation_id: string;
  title: string;
  status: "scheduled" | "in_progress" | "completed";
  scheduled_at: string;
  completed_at: string | null;
  notes: string;
}

export interface TelemetryDaily {
  id: string;
  installation_id: string;
  date: string;
  orders_count: number;
  revenue_cents: number;
  average_ticket_cents: number;
  plugin_version: string;
}

export interface LicenseCheckRequest {
  api_key: string;
  site_url: string;
  plugin_version: string;
}

export interface LicenseCheckResponse {
  status: LicenseStatus;
  license_expires_at?: string;
  grace_until?: string | null;
  check_interval_hours?: number;
  message: string;
}

export interface InstallationWithDetails extends PluginInstallation {
  restaurant: Restaurant;
  client: Client;
  api_key_last4: string;
}
