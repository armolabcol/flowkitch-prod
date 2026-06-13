"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  apiKey: string;
  siteUrl: string;
  locale: "es" | "en";
};

export function PluginTestPanel({ apiKey, siteUrl, locale }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function runTest() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/plugin-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, siteUrl }),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setResult(locale === "es" ? "Error de red" : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-kitch-surface/60 p-5">
      <h3 className="text-sm font-medium text-white">
        {locale === "es" ? "Probar conexión plugin" : "Test plugin connection"}
      </h3>
      <Button type="button" size="sm" disabled={loading} onClick={runTest}>
        {loading
          ? locale === "es"
            ? "Probando…"
            : "Testing…"
          : locale === "es"
            ? "Probar license + telemetry"
            : "Test license + telemetry"}
      </Button>
      {result && (
        <pre className="max-h-48 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-kitch-muted">
          {result}
        </pre>
      )}
    </div>
  );
}
