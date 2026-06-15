"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function StaffInviteForm({
  locale,
  actorRole,
  actorCountry,
}: {
  locale: "es" | "en";
  actorRole: string;
  actorCountry?: "CO" | "US" | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const isSuper = actorRole === "super_admin" || actorRole === "billing_admin";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invite_staff",
          email: fd.get("email"),
          fullName: fd.get("fullName") || undefined,
          role: fd.get("role"),
          assignedCountry: fd.get("assignedCountry") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Error");
      setMsg(locale === "es" ? "Invitación enviada" : "Invitation sent");
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
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-2xl border border-white/[0.08] bg-kitch-surface/40 p-4 sm:grid-cols-2"
    >
      <h3 className="sm:col-span-2 text-sm font-medium text-white">
        {locale === "es" ? "Invitar usuario staff" : "Invite staff user"}
      </h3>
      <label className="text-xs text-kitch-muted">
        Email
        <input name="email" type="email" required className={fieldClass} />
      </label>
      <label className="text-xs text-kitch-muted">
        {locale === "es" ? "Nombre" : "Name"}
        <input name="fullName" className={fieldClass} />
      </label>
      <label className="text-xs text-kitch-muted">
        Rol
        <select name="role" className={fieldClass} defaultValue="sales_agent">
          {isSuper && (
            <option value="regional_admin">
              {locale === "es" ? "Admin regional" : "Regional admin"}
            </option>
          )}
          <option value="sales_agent">
            {locale === "es" ? "Agente comercial" : "Sales agent"}
          </option>
        </select>
      </label>
      {isSuper && (
        <label className="text-xs text-kitch-muted">
          {locale === "es" ? "País (admin regional)" : "Country (regional admin)"}
          <select name="assignedCountry" className={fieldClass} defaultValue="CO">
            <option value="CO">Colombia</option>
            <option value="US">USA</option>
          </select>
        </label>
      )}
      {!isSuper && actorCountry && (
        <input type="hidden" name="assignedCountry" value={actorCountry} />
      )}
      <div className="sm:col-span-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "…" : locale === "es" ? "Invitar" : "Invite"}
        </Button>
        {msg && <p className="mt-2 text-xs text-kitch-muted">{msg}</p>}
      </div>
    </form>
  );
}
