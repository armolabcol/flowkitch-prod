import {
  buildInstallationWithDetails,
  mapClient,
  mapSubscription,
  pickActiveApiKeyLast4,
} from "@/services/saas/mappers";
import { getServerSaasClient } from "@/services/saas/db";
import type {
  Client,
  InstallationWithDetails,
  Subscription,
} from "@/types/saas";
import type { Database } from "@/lib/supabase/types";

export interface PortalData {
  client: Client | null;
  installation: InstallationWithDetails | null;
  subscription: Subscription | null;
}

export async function getClientPortalData(
  clientId: string | null,
): Promise<PortalData> {
  const supabase = await getServerSaasClient();
  if (!supabase || !clientId) {
    return { client: null, installation: null, subscription: null };
  }

  const { data: clientRow } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle<Database["public"]["Tables"]["clients"]["Row"]>();

  if (!clientRow) {
    return { client: null, installation: null, subscription: null };
  }

  const { data: subscriptionRow } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("client_id", clientId)
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle<Database["public"]["Tables"]["subscriptions"]["Row"]>();

  const { data: installationRows } = await supabase
    .from("plugin_installations")
    .select(
      `
      *,
      restaurants!inner (
        *,
        clients!inner (*)
      )
    `,
    )
    .eq("restaurants.client_id", clientId)
    .order("last_sync_at", { ascending: false, nullsFirst: false })
    .limit(1);

  const installationRow = installationRows?.[0] as
    | (Database["public"]["Tables"]["plugin_installations"]["Row"] & {
        restaurants: Database["public"]["Tables"]["restaurants"]["Row"] & {
          clients: Database["public"]["Tables"]["clients"]["Row"];
        };
      })
    | undefined;

  let installation: InstallationWithDetails | null = null;

  if (installationRow?.restaurants?.clients) {
    const { data: keys } = await supabase
      .from("api_keys")
      .select("last4, status")
      .eq("installation_id", installationRow.id);

    installation = buildInstallationWithDetails(
      installationRow,
      installationRow.restaurants,
      installationRow.restaurants.clients,
      pickActiveApiKeyLast4(keys ?? []),
    );
  }

  return {
    client: mapClient(clientRow),
    installation,
    subscription: subscriptionRow ? mapSubscription(subscriptionRow) : null,
  };
}
