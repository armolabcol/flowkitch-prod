"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PluginTestPanel } from "@/components/saas/PluginTestPanel";

type OnboardingResult = {
  clientId: string;
  installationId: string;
  apiKey: string;
  apiKeyLast4: string;
  portalUser?: { action: string; email?: string; reason?: string };
};

type Props = { locale: "es" | "en" };

export function OnboardingForm({ locale }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OnboardingResult | null>(null);
  const [siteUrl, setSiteUrl] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const fd = new FormData(e.currentTarget);
    const site = String(fd.get("siteUrl") ?? "").trim();
    setSiteUrl(site);

    const payload = {
      client: {
        name: String(fd.get("clientName") ?? ""),
        email: String(fd.get("clientEmail") ?? ""),
        country: String(fd.get("country") ?? "CO"),
        taxId: String(fd.get("taxId") ?? "") || undefined,
      },
      restaurant: {
        name: String(fd.get("restaurantName") ?? ""),
        city: String(fd.get("city") ?? ""),
      },
      installation: {
        siteUrl: site,
        licenseDays: Number(fd.get("licenseDays") ?? 30),
      },
      portalUser: String(fd.get("portalEmail") ?? "").trim()
        ? {
            email: String(fd.get("portalEmail")),
            fullName: String(fd.get("portalName") ?? "") || undefined,
          }
        : undefined,
    };

    try {
      const res = await fetch("/api/admin/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as OnboardingResult & {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.message ?? "Error");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-kitch-bg/80 px-3 py-2 text-sm text-kitch-fg";

  if (result) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <h3 className="text-lg font-medium text-emerald-100">
            {locale === "es" ? "Cliente creado" : "Client provisioned"}
          </h3>
          <p className="mt-2 text-sm text-emerald-100/80">
            {locale === "es"
              ? "Copia la API key ahora — no se volverá a mostrar completa."
              : "Copy the API key now — it won't be shown again."}
          </p>
          <code className="mt-4 block break-all rounded-lg border border-emerald-500/20 bg-black/30 p-3 text-sm text-white">
            {result.apiKey}
          </code>
          <p className="mt-3 text-xs text-kitch-muted">
            installation: {result.installationId} · last4: ••••{result.apiKeyLast4}
          </p>
          {result.portalUser && (
            <p className="mt-2 text-xs text-kitch-muted">
              Portal: {result.portalUser.action}
              {result.portalUser.email ? ` — ${result.portalUser.email}` : ""}
              {result.portalUser.reason ? ` (${result.portalUser.reason})` : ""}
            </p>
          )}
        </div>
        <PluginTestPanel apiKey={result.apiKey} siteUrl={siteUrl} locale={locale} />
        <p className="text-sm text-kitch-muted">
          {locale === "es"
            ? "En WordPress: URL https://flowkitch.com + API key arriba. Ver docs/plugin-api-integration.md"
            : "In WordPress: URL https://flowkitch.com + API key above."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-white/[0.08] bg-kitch-surface/60 p-6 sm:grid-cols-2"
    >
      <h3 className="sm:col-span-2 text-sm font-medium text-white">
        {locale === "es" ? "Datos del cliente" : "Client details"}
      </h3>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Nombre empresa" : "Company name"}
        <input name="clientName" required className={fieldClass} />
      </label>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Email facturación" : "Billing email"}
        <input name="clientEmail" type="email" required className={fieldClass} />
      </label>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "País" : "Country"}
        <select name="country" className={fieldClass} defaultValue="CO">
          <option value="CO">Colombia</option>
          <option value="US">USA</option>
        </select>
      </label>
      <label className="text-xs text-kitch-muted">
        NIT / Tax ID
        <input name="taxId" className={fieldClass} />
      </label>

      <h3 className="sm:col-span-2 mt-2 text-sm font-medium text-white">
        {locale === "es" ? "Restaurante e instalación" : "Restaurant & installation"}
      </h3>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Nombre sede" : "Venue name"}
        <input name="restaurantName" required className={fieldClass} />
      </label>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Ciudad" : "City"}
        <input name="city" required className={fieldClass} />
      </label>
      <label className="sm:col-span-2 text-xs text-kitch-muted">
        {locale === "es" ? "URL del sitio WordPress" : "WordPress site URL"}
        <input
          name="siteUrl"
          required
          placeholder="https://mi-restaurante.com"
          className={fieldClass}
        />
      </label>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Días de licencia" : "License days"}
        <input name="licenseDays" type="number" defaultValue={30} min={1} className={fieldClass} />
      </label>

      <h3 className="sm:col-span-2 mt-2 text-sm font-medium text-white">
        {locale === "es" ? "Usuario portal (opcional)" : "Portal user (optional)"}
      </h3>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Email portal" : "Portal email"}
        <input name="portalEmail" type="email" className={fieldClass} />
      </label>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Nombre contacto" : "Contact name"}
        <input name="portalName" className={fieldClass} />
      </label>

      <div className="sm:col-span-2 flex items-center gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? locale === "es"
              ? "Creando…"
              : "Creating…"
            : locale === "es"
              ? "Crear cliente completo"
              : "Provision full client"}
        </Button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </form>
  );
}
