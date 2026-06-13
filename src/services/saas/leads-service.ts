import { getServiceSaasClient } from "@/services/saas/db";

export type DemoLeadPayload = {
  name: string;
  restaurant: string;
  country: string;
  city: string;
  email: string;
  whatsapp?: string;
  tables?: number | null;
  uses_pos: string;
  locale: "es" | "en";
};

export async function saveDemoLead(payload: DemoLeadPayload): Promise<boolean> {
  const supabase = getServiceSaasClient();
  if (!supabase) return false;

  const { error } = await supabase.from("demo_leads").insert({
    name: payload.name,
    restaurant: payload.restaurant,
    country: payload.country,
    city: payload.city,
    email: payload.email,
    whatsapp: payload.whatsapp || null,
    tables: payload.tables ?? null,
    uses_pos: payload.uses_pos,
    locale: payload.locale,
    source: "demo_form",
  } as never);

  return !error;
}
