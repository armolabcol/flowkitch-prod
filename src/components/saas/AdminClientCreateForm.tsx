"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AdminClientCreateForm({ locale }: { locale: "es" | "en" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      country: String(fd.get("country") ?? "CO"),
      taxId: String(fd.get("taxId") ?? ""),
    };

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) throw new Error(data.message);
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-kitch-bg/80 px-3 py-2 text-sm text-kitch-fg";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-2xl border border-white/[0.08] bg-kitch-surface/60 p-5 sm:grid-cols-2"
    >
      <h3 className="sm:col-span-2 text-sm font-medium text-white">
        {locale === "es" ? "Nuevo cliente" : "New client"}
      </h3>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Nombre" : "Name"}
        <input name="name" required className={fieldClass} />
      </label>
      <label className="text-xs text-kitch-muted">
        Email
        <input name="email" type="email" required className={fieldClass} />
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
      <div className="sm:col-span-2 flex items-center gap-3">
        <Button type="submit" size="sm" disabled={loading}>
          {locale === "es" ? "Crear cliente" : "Create client"}
        </Button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </form>
  );
}
