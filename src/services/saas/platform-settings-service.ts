import { writeAuditLog } from "@/services/audit-service";
import { getServiceSaasClient } from "@/services/saas/db";

export type CoPaymentProvider = "wompi" | "payu";
export type PaymentProvider = "stripe" | "wompi" | "payu";

const CO_PROVIDER_KEY = "billing.co_provider";
const DEFAULT_PLAN_KEY = "billing.default_plan_name";

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = getServiceSaasClient();
  if (!supabase) return fallback;

  const { data } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle<{ value: unknown }>();

  if (!data?.value) return fallback;
  return data.value as T;
}

async function setSetting(key: string, value: unknown, actorId?: string | null) {
  const supabase = getServiceSaasClient();
  if (!supabase) return false;

  const { error } = await supabase.from("platform_settings").upsert(
    {
      key,
      value: value as never,
      updated_at: new Date().toISOString(),
      updated_by: actorId ?? null,
    } as never,
    { onConflict: "key" },
  );

  return !error;
}

export async function getCoPaymentProvider(): Promise<CoPaymentProvider> {
  const value = await getSetting<string>(CO_PROVIDER_KEY, "wompi");
  return value === "payu" ? "payu" : "wompi";
}

export async function setCoPaymentProvider(
  provider: CoPaymentProvider,
  actorId?: string | null,
): Promise<boolean> {
  const ok = await setSetting(CO_PROVIDER_KEY, provider, actorId);
  if (ok) {
    await writeAuditLog({
      actorId,
      action: "settings.billing.co_provider.updated",
      entityType: "settings",
      entityId: CO_PROVIDER_KEY,
      metadata: { provider },
    });
  }
  return ok;
}

export async function getDefaultPlanName(): Promise<string> {
  return getSetting<string>(DEFAULT_PLAN_KEY, "Kitch Pro");
}

export async function resolvePaymentProviderForCountry(
  country: "CO" | "US",
): Promise<PaymentProvider> {
  if (country === "US") return "stripe";
  return getCoPaymentProvider();
}

export async function getBillingSettings() {
  const coProvider = await getCoPaymentProvider();
  const defaultPlanName = await getDefaultPlanName();
  return { coProvider, defaultPlanName };
}
