export function countryToCurrency(country: "CO" | "US"): "COP" | "USD" {
  return country === "US" ? "USD" : "COP";
}

export function defaultAmountDisplay(country: "CO" | "US"): string {
  return country === "US" ? "299" : "119000";
}

/** Human input → cents (COP integer, USD × 100) */
export function parseAmountToCents(value: string, currency: "COP" | "USD"): number {
  const normalized = value.replace(/,/g, "").trim();
  const num = Number(normalized);
  if (!Number.isFinite(num) || num <= 0) return 0;
  if (currency === "USD") return Math.round(num * 100);
  return Math.round(num);
}

export function formatMembershipAmount(
  amountCents: number,
  currency: string,
  locale: "es" | "en" = "es",
): string {
  if (currency === "USD") {
    return new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(amountCents / 100);
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amountCents);
}

export function paymentProviderLabel(
  provider: string | null,
  locale: "es" | "en" = "es",
): string {
  if (provider === "stripe") return "Stripe";
  if (provider === "wompi") return "Wompi";
  if (provider === "payu") return "PayU";
  return locale === "es" ? "Sin definir" : "Not set";
}
