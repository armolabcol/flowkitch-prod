"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function PortalRenewButton({
  label,
  locale,
  amountLabel,
}: {
  label: string;
  locale: "es" | "en";
  amountLabel?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRenew() {
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/checkout?locale=${locale}`, {
        method: "POST",
      });
      const data = (await res.json()) as {
        ok?: boolean;
        url?: string;
        message?: string;
      };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.message ?? (locale === "es" ? "No disponible" : "Unavailable"));
    } catch {
      alert(locale === "es" ? "Error de red" : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {amountLabel && (
        <span className="text-xs text-kitch-muted">
          {locale === "es" ? "Total" : "Total"}: {amountLabel}
        </span>
      )}
      <Button type="button" size="md" disabled={loading} onClick={handleRenew}>
        {loading ? (locale === "es" ? "Cargando…" : "Loading…") : label}
      </Button>
    </div>
  );
}
