"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AssignSalesAgentForm({
  clientId,
  currentAgentId,
  agents,
  locale,
  canEdit,
}: {
  clientId: string;
  currentAgentId: string | null;
  agents: { id: string; email: string; full_name: string | null }[];
  locale: "es" | "en";
  canEdit: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!canEdit) {
    const agent = agents.find((a) => a.id === currentAgentId);
    return (
      <p className="text-sm text-kitch-muted">
        {locale === "es" ? "Agente comercial" : "Sales agent"}:{" "}
        {agent?.email ?? (locale === "es" ? "Sin asignar" : "Unassigned")}
      </p>
    );
  }

  async function handleChange(agentId: string) {
    setLoading(true);
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        assignedSalesAgentId: agentId || null,
      }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <label className="text-xs text-kitch-muted block max-w-md">
      {locale === "es" ? "Agente comercial" : "Sales agent"}
      <select
        className="mt-1 w-full rounded-xl border border-white/10 bg-kitch-bg/80 px-3 py-2 text-sm"
        disabled={loading}
        defaultValue={currentAgentId ?? ""}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">{locale === "es" ? "Sin asignar" : "Unassigned"}</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.full_name ?? a.email}
          </option>
        ))}
      </select>
    </label>
  );
}
