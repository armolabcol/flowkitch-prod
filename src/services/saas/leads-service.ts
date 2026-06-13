import { getServerSaasClient, getServiceSaasClient } from "@/services/saas/db";

export type DemoLead = {
  id: string;
  name: string;
  restaurant: string;
  country: string;
  city: string;
  email: string;
  whatsapp: string | null;
  tables: number | null;
  uses_pos: string;
  locale: string;
  created_at: string;
};

export async function saveDemoLead(payload: {
  name: string;
  restaurant: string;
  country: string;
  city: string;
  email: string;
  whatsapp?: string;
  tables?: number | null;
  uses_pos: string;
  locale: "es" | "en";
}): Promise<boolean> {
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

export async function listDemoLeads(limit = 100): Promise<DemoLead[]> {
  const supabase = await getServerSaasClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("demo_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as DemoLead[];
}
