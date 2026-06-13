import { getInstallationByApiKey } from "@/services/saas/installations-service";
import { getServiceSaasClient } from "@/services/saas/db";
import type { Database } from "@/lib/supabase/types";

export type TelemetrySubmitRequest = {
  api_key: string;
  date: string;
  orders_count: number;
  revenue_cents: number;
  average_ticket_cents: number;
  plugin_version: string;
};

export async function submitDailyTelemetry(
  body: TelemetrySubmitRequest,
): Promise<{ ok: boolean; message: string }> {
  const installation = await getInstallationByApiKey(body.api_key);
  if (!installation) {
    return { ok: false, message: "Invalid API key" };
  }

  const supabase = getServiceSaasClient();
  if (!supabase) {
    return { ok: false, message: "Service unavailable" };
  }

  const row: Database["public"]["Tables"]["telemetry_daily"]["Insert"] = {
    installation_id: installation.id,
    date: body.date,
    orders_count: body.orders_count,
    revenue_cents: body.revenue_cents,
    average_ticket_cents: body.average_ticket_cents,
    plugin_version: body.plugin_version,
  };

  const { error: telemetryError } = await supabase
    .from("telemetry_daily")
    .upsert(row as never, { onConflict: "installation_id,date" });

  if (telemetryError) {
    return { ok: false, message: "Failed to store telemetry" };
  }

  await supabase
    .from("plugin_installations")
    .update({
      orders_month: body.orders_count,
      revenue_month: body.revenue_cents,
      average_ticket: body.average_ticket_cents,
      plugin_version: body.plugin_version,
      last_sync_at: new Date().toISOString(),
    } as never)
    .eq("id", installation.id);

  return { ok: true, message: "Telemetry recorded" };
}
