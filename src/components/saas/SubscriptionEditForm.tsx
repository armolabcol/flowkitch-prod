"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { parseAmountToCents } from "@/lib/billing-utils";

export function SubscriptionEditForm({
  subscriptionId,
  planName,
  amountCents,
  currency,
  locale,
}: {
  subscriptionId: string;
  planName: string;
  amountCents: number;
  currency: string;
  locale: "es" | "en";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const displayAmount =
    currency === "USD" ? (amountCents / 100).toFixed(2) : String(amountCents);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const amount = parseAmountToCents(
      String(fd.get("amount") ?? ""),
      currency as "USD" | "COP",
    );
    if (amount <= 0) {
      setMsg(locale === "es" ? "Monto inválido" : "Invalid amount");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId,
          planName: String(fd.get("planName") ?? planName),
          amountCents: amount,
          currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Error");
      setMsg(locale === "es" ? "Actualizado" : "Updated");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-kitch-bg/80 px-3 py-2 text-sm";

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-3 max-w-2xl">
      <label className="text-xs text-kitch-muted">
        Plan
        <input name="planName" defaultValue={planName} className={fieldClass} />
      </label>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Costo" : "Amount"} ({currency})
        <input
          name="amount"
          type="number"
          step={currency === "USD" ? "0.01" : "1"}
          defaultValue={displayAmount}
          className={fieldClass}
        />
      </label>
      <div className="flex items-end">
        <Button type="submit" size="sm" disabled={loading}>
          {locale === "es" ? "Guardar" : "Save"}
        </Button>
      </div>
      {msg && <p className="sm:col-span-3 text-xs text-kitch-muted">{msg}</p>}
    </form>
  );
}
