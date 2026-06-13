"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InstallationApiKeyActions } from "@/components/saas/InstallationApiKeyActions";

export function ClientUserLinkForm({
  clientId,
  locale,
}: {
  clientId: string;
  locale: "es" | "en";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const action = String(fd.get("action") ?? "invite");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          email: fd.get("email"),
          clientId,
          fullName: fd.get("fullName") || undefined,
        }),
      });
      const data = await res.json();
      setMsg(JSON.stringify(data.result ?? data));
      router.refresh();
    } catch {
      setMsg("Error");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-kitch-bg/80 px-3 py-2 text-sm";

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-3">
      <input name="email" type="email" required placeholder="email" className={fieldClass} />
      <input name="fullName" placeholder={locale === "es" ? "Nombre" : "Name"} className={fieldClass} />
      <select name="action" className={fieldClass} defaultValue="invite">
        <option value="invite">{locale === "es" ? "Invitar" : "Invite"}</option>
        <option value="link">{locale === "es" ? "Vincular" : "Link"}</option>
      </select>
      <Button type="submit" size="sm" disabled={loading} className="sm:col-span-3 w-fit">
        {locale === "es" ? "Asignar usuario portal" : "Assign portal user"}
      </Button>
      {msg && <p className="sm:col-span-3 text-xs text-kitch-muted">{msg}</p>}
    </form>
  );
}

export function AddRestaurantForm({
  clientId,
  country,
  locale,
}: {
  clientId: string;
  country: string;
  locale: "es" | "en";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/admin/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        name: fd.get("name"),
        city: fd.get("city"),
        country,
      }),
    });
    router.refresh();
    setLoading(false);
  }

  const fieldClass =
    "rounded-lg border border-white/10 bg-kitch-bg/80 px-2 py-1.5 text-xs";

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
      <input name="name" required placeholder={locale === "es" ? "Sede" : "Venue"} className={fieldClass} />
      <input name="city" required placeholder={locale === "es" ? "Ciudad" : "City"} className={fieldClass} />
      <Button type="submit" size="sm" disabled={loading}>
        + {locale === "es" ? "Restaurante" : "Restaurant"}
      </Button>
    </form>
  );
}

export function AddInstallationForm({
  restaurantId,
  locale,
}: {
  restaurantId: string;
  locale: "es" | "en";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setNewKey(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/installations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        restaurantId,
        siteUrl: fd.get("siteUrl"),
      }),
    });
    const data = await res.json();
    if (data.apiKey) setNewKey(data.apiKey);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input
          name="siteUrl"
          required
          placeholder="https://..."
          className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-kitch-bg/80 px-2 py-1.5 text-xs"
        />
        <Button type="submit" size="sm" disabled={loading}>
          + {locale === "es" ? "Instalación" : "Installation"}
        </Button>
      </form>
      {newKey && (
        <code className="block break-all text-xs text-amber-200">{newKey}</code>
      )}
    </div>
  );
}

export { InstallationApiKeyActions };
