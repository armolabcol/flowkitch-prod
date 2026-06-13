import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { isClientRole } from "@/lib/auth/roles";
import { createRenewalCheckout } from "@/services/saas/checkout-service";
import { getClientPortalData } from "@/services/saas/portal-service";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.profile || !isClientRole(session.profile.role)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const clientId = session.profile.client_id;
  if (!clientId) {
    return NextResponse.json(
      { ok: false, message: "No client linked to profile" },
      { status: 400 },
    );
  }

  const { client } = await getClientPortalData(clientId);
  if (!client) {
    return NextResponse.json({ ok: false, message: "Client not found" }, { status: 404 });
  }

  const localeHeader = request.headers.get("accept-language") ?? "";
  const locale: Locale = localeHeader.startsWith("en") ? "en" : defaultLocale;
  const urlLocale = new URL(request.url).searchParams.get("locale");
  const resolvedLocale: Locale =
    urlLocale && isLocale(urlLocale) ? urlLocale : locale;

  const result = await createRenewalCheckout({
    clientId,
    clientEmail: client.email,
    country: client.country,
    locale: resolvedLocale,
  });

  return NextResponse.json({
    ok: true,
    mode: result.mode,
    url: result.url,
    message: result.mode === "whatsapp" ? result.message : undefined,
  });
}
