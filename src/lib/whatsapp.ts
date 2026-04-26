import type { Locale } from "@/lib/i18n";

const DEFAULT_WHATSAPP_E164 = "XXXXXXXXXXX";
const TEXT_PARAM_ES = encodeURIComponent("Hola, quiero información sobre Kitch");

function textParam(locale: Locale): string {
  if (locale === "es") return TEXT_PARAM_ES;
  return encodeURIComponent("Hi, I would like information about Kitch");
}

/**
 * WhatsApp lead link. Prefer `NEXT_PUBLIC_WHATSAPP_WA_LINK` (full URL) in production.
 * Otherwise builds `https://wa.me/{NEXT_PUBLIC_WHATSAPP_E164}?text=...` (digits only, country code included).
 */
export function getWhatsAppLeadHref(locale: Locale): string {
  const full = process.env.NEXT_PUBLIC_WHATSAPP_WA_LINK?.trim();
  if (full) return full;

  const digits = process.env.NEXT_PUBLIC_WHATSAPP_E164?.replace(/\D/g, "") ?? "";
  if (digits.length >= 8) {
    return `https://wa.me/${digits}?text=${textParam(locale)}`;
  }

  // Replace the fallback through env before launch with the real commercial number.
  return `https://wa.me/${DEFAULT_WHATSAPP_E164}?text=${textParam(locale)}`;
}
