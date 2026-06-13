"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type BillingSettings = {
  coProvider: "wompi" | "payu";
  defaultPlanName: string;
  canEdit: boolean;
  providers: {
    stripe: boolean;
    wompi: boolean;
    payu: boolean;
  };
};

export function BillingSettingsPanel({ locale }: { locale: "es" | "en" }) {
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [coProvider, setCoProvider] = useState<"wompi" | "payu">("wompi");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/billing")
      .then((r) => r.json())
      .then((data: BillingSettings & { ok?: boolean }) => {
        if (data.ok !== false) {
          setSettings(data);
          setCoProvider(data.coProvider);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coProvider }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Error");
      setSettings((s) => (s ? { ...s, coProvider: data.coProvider } : s));
      setMsg(locale === "es" ? "Guardado" : "Saved");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-kitch-muted">
        {locale === "es" ? "Cargando…" : "Loading…"}
      </p>
    );
  }

  if (!settings) return null;

  const providerLabels = [
    { key: "stripe", label: "Stripe (USA)", ok: settings.providers.stripe },
    { key: "wompi", label: "Wompi (Colombia)", ok: settings.providers.wompi },
    { key: "payu", label: "PayU (Colombia)", ok: settings.providers.payu },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-kitch-surface/60 p-6 space-y-4">
      <h3 className="text-sm font-medium text-white">
        {locale === "es" ? "Pasarelas de pago" : "Payment providers"}
      </h3>
      <p className="text-xs text-kitch-muted">
        {locale === "es"
          ? "Los clientes nuevos en Colombia usarán la pasarela seleccionada. USA siempre usa Stripe."
          : "New Colombia clients use the selected provider. USA always uses Stripe."}
      </p>

      <div className="space-y-2">
        {providerLabels.map((p) => (
          <div
            key={p.key}
            className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3"
          >
            <span className="text-sm text-kitch-muted">{p.label}</span>
            <span className={`text-xs ${p.ok ? "text-emerald-400" : "text-amber-400"}`}>
              {p.ok
                ? locale === "es"
                  ? "Configurado"
                  : "Configured"
                : locale === "es"
                  ? "Pendiente env"
                  : "Env pending"}
            </span>
          </div>
        ))}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs text-kitch-muted">
          {locale === "es" ? "Pasarela Colombia (clientes nuevos)" : "Colombia provider (new clients)"}
        </legend>
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="radio"
            name="coProvider"
            value="wompi"
            checked={coProvider === "wompi"}
            disabled={!settings.canEdit}
            onChange={() => setCoProvider("wompi")}
          />
          Wompi
        </label>
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="radio"
            name="coProvider"
            value="payu"
            checked={coProvider === "payu"}
            disabled={!settings.canEdit}
            onChange={() => setCoProvider("payu")}
          />
          PayU
        </label>
      </fieldset>

      {settings.canEdit ? (
        <Button type="button" size="sm" disabled={saving} onClick={handleSave}>
          {saving ? "…" : locale === "es" ? "Guardar" : "Save"}
        </Button>
      ) : (
        <p className="text-xs text-kitch-muted">
          {locale === "es"
            ? "Solo super_admin o billing_admin pueden cambiar la pasarela."
            : "Only super_admin or billing_admin can change the provider."}
        </p>
      )}
      {msg && <p className="text-xs text-kitch-muted">{msg}</p>}
    </div>
  );
}
