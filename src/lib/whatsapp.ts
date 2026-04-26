import type { Locale } from "@/lib/i18n";

const TEXT_PARAM_ES = "Hola%20quiero%20información%20sobre%20Kitch";

function textParam(locale: Locale): string {
  if (locale === "es") return TEXT_PARAM_ES;
  return encodeURIComponent("Hi, I would like information about Kitch");
}

/**
 * WhatsApp lead link. Prefer `NEXT_PUBLIC_WHATSAPP_WA_LINK` (full URL) in production.
 * Otherwise builds `https://wa.me/{NEXT_PUBLIC_WHATSAPP_E164}?text=…` (digits only, country code included).
 */
export function getWhatsAppLeadHref(locale: Locale): string {
  const full = process.env.NEXT_PUBLIC_WHATSAPP_WA_LINK?.trim();
  if (full) return full;

  const digits = process.env.NEXT_PUBLIC_WHATSAPP_E164?.replace(/\D/g, "") ?? "";
  if (digits.length >= 8) {
    return `https://wa.me/${digits}?text=${textParam(locale)}`;
  }

  // Spec default (replace via env for a working number)
  return `https://wa.me/XXXXXXXXXXX?text=${TEXT_PARAM_ES}`;
}
