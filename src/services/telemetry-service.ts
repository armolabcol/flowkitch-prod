import {
  getAllInstallationsWithDetails,
  mockTelemetry,
} from "@/data/saas-mock";
import type { TelemetryDaily } from "@/types/saas";

/**
 * Record daily telemetry from plugin heartbeat.
 * TODO: Upsert into plugin_telemetry_daily via Supabase.
 */
export function recordDailyTelemetry(
  installationId: string,
  data: Omit<TelemetryDaily, "id" | "installation_id" | "date"> & {
    date?: string;
  },
): TelemetryDaily {
  return {
    id: `tel_${Date.now()}`,
    installation_id: installationId,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    orders_count: data.orders_count,
    revenue_cents: data.revenue_cents,
    average_ticket_cents: data.average_ticket_cents,
    plugin_version: data.plugin_version,
  };
}

export function getTelemetryForInstallation(
  installationId: string,
): TelemetryDaily[] {
  return mockTelemetry.filter((t) => t.installation_id === installationId);
}

export function getAggregatedMonthlyMetrics() {
  const installations = getAllInstallationsWithDetails();
  return {
    totalOrders: installations.reduce((s, i) => s + i.orders_month, 0),
    totalRevenue: installations.reduce((s, i) => s + i.revenue_month, 0),
    averageTicket:
      installations.length > 0
        ? Math.round(
            installations.reduce((s, i) => s + i.average_ticket, 0) /
              installations.length,
          )
        : 0,
    installationsCount: installations.length,
  };
}
