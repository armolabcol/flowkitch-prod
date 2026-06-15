"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Client = { id: string; name: string };

export function AdminUserActions({
  profileId,
  currentClientId,
  currentRole,
  clients,
  locale,
  canEditRoles,
}: {
  profileId: string;
  currentClientId: string | null;
  currentRole: string;
  clients: Client[];
  locale: "es" | "en";
  canEditRoles: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isStaffRole = [
    "super_admin",
    "regional_admin",
    "sales_agent",
    "billing_admin",
    "support_agent",
  ].includes(currentRole);

  async function save(clientId: string, role: string) {
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        profileId,
        clientId: clientId || null,
        role,
      }),
    });
    router.refresh();
    setLoading(false);
  }

  if (isStaffRole) {
    return <span className="text-xs text-kitch-muted">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        defaultValue={currentClientId ?? ""}
        disabled={loading}
        className="rounded-lg border border-white/10 bg-kitch-bg/80 px-2 py-1 text-xs"
        onChange={(e) => save(e.target.value, currentRole)}
      >
        <option value="">{locale === "es" ? "Sin cliente" : "No client"}</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {canEditRoles && (
        <select
          defaultValue={currentRole}
          disabled={loading}
          className="rounded-lg border border-white/10 bg-kitch-bg/80 px-2 py-1 text-xs"
          onChange={(e) => save(currentClientId ?? "", e.target.value)}
        >
          <option value="client_user">client_user</option>
          <option value="client_owner">client_owner</option>
          <option value="client_billing">client_billing</option>
        </select>
      )}
    </div>
  );
}
