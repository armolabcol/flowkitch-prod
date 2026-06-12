import { getServerSaasClient } from "@/services/saas/db";
import { mapTelemetry } from "@/services/saas/mappers";
import type { TelemetryDaily } from "@/types/saas";
import type { Database } from "@/lib/supabase/types";

export async function getTelemetryForInstallation(
  installationId: string,
): Promise<TelemetryDaily[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("telemetry_daily")
    .select("*")
    .eq("installation_id", installationId)
    .order("date", { ascending: false })
    .limit(30);

  if (error || !data) return [];
  return data.map(mapTelemetry);
}

export async function getAggregatedMonthlyMetrics() {
  const supabase = await getServerSaasClient();
  if (!supabase) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      averageTicket: 0,
      installationsCount: 0,
    };
  }

  const { data } = await supabase
    .from("plugin_installations")
    .select("orders_month, revenue_month, average_ticket");

  const rows = (data ?? []) as Pick<
    Database["public"]["Tables"]["plugin_installations"]["Row"],
    "orders_month" | "revenue_month" | "average_ticket"
  >[];

  return {
    totalOrders: rows.reduce((s, r) => s + r.orders_month, 0),
    totalRevenue: rows.reduce((s, r) => s + Number(r.revenue_month), 0),
    averageTicket:
      rows.length > 0
        ? Math.round(
            rows.reduce((s, r) => s + r.average_ticket, 0) / rows.length,
          )
        : 0,
    installationsCount: rows.length,
  };
}
