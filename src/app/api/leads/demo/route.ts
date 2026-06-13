import { NextResponse } from "next/server";
import { checkIpRateLimit } from "@/lib/security/rate-limit";
import { saveDemoLead } from "@/services/saas/leads-service";
import { isSupabaseServiceConfigured } from "@/lib/env";

type DemoLeadBody = {
  name?: string;
  restaurant?: string;
  country?: string;
  city?: string;
  email?: string;
  whatsapp?: string;
  tables?: string;
  uses_pos?: string;
  locale?: string;
};

function parseBody(body: DemoLeadBody) {
  const name = String(body.name ?? "").trim();
  const restaurant = String(body.restaurant ?? "").trim();
  const country = String(body.country ?? "").trim();
  const city = String(body.city ?? "").trim();
  const email = String(body.email ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();
  const uses_pos = String(body.uses_pos ?? "").trim();
  const locale = body.locale === "en" ? "en" : "es";
  const tablesRaw = String(body.tables ?? "").trim();
  const tables = tablesRaw ? Number(tablesRaw) : null;

  return { name, restaurant, country, city, email, whatsapp, uses_pos, locale, tables };
}

export async function POST(request: Request) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkIpRateLimit(clientIp)) {
    return NextResponse.json({ ok: false, message: "Rate limit exceeded" }, { status: 429 });
  }

  let body: DemoLeadBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseBody(body);
  if (
    !parsed.name ||
    !parsed.restaurant ||
    !parsed.country ||
    !parsed.city ||
    !parsed.email ||
    !parsed.uses_pos
  ) {
    return NextResponse.json({ ok: false, message: "Missing required fields" }, { status: 400 });
  }

  if (!isSupabaseServiceConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.log("[demo-lead] Supabase not configured:", parsed.email);
    }
    return NextResponse.json({ ok: true, message: "Lead accepted (dev mode)" });
  }

  const saved = await saveDemoLead({
    name: parsed.name,
    restaurant: parsed.restaurant,
    country: parsed.country,
    city: parsed.city,
    email: parsed.email,
    whatsapp: parsed.whatsapp || undefined,
    tables:
      parsed.tables !== null && Number.isFinite(parsed.tables) && parsed.tables >= 1
        ? parsed.tables
        : null,
    uses_pos: parsed.uses_pos,
    locale: parsed.locale as "es" | "en",
  });

  if (!saved) {
    return NextResponse.json({ ok: false, message: "Failed to save lead" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Lead saved" });
}
