"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RegionalAdmin = {
  id: string;
  email: string;
  full_name: string | null;
  assigned_country: string | null;
};

type Client = { id: string; name: string };

const STAFF_ROLES = [
  "super_admin",
  "regional_admin",
  "sales_agent",
  "billing_admin",
  "support_agent",
] as const;

const CLIENT_ROLES = ["client_user", "client_owner", "client_billing"] as const;

export function AdminStaffActions({
  profileId,
  currentRole,
  currentCountry,
  currentRegionalAdminId,
  regionalAdmins,
  clients,
  locale,
}: {
  profileId: string;
  currentRole: string;
  currentCountry: string | null;
  currentRegionalAdminId: string | null;
  regionalAdmins: RegionalAdmin[];
  clients: Client[];
  locale: "es" | "en";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(currentRole);

  const selectClass =
    "rounded-lg border border-white/10 bg-kitch-bg/80 px-2 py-1 text-xs";

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", profileId, ...body }),
    });
    router.refresh();
    setLoading(false);
  }

  const isStaff = STAFF_ROLES.includes(currentRole as (typeof STAFF_ROLES)[number]);
  const isClient = CLIENT_ROLES.includes(currentRole as (typeof CLIENT_ROLES)[number]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className={selectClass}
        disabled={loading}
        value={role}
        onChange={(e) => {
          const next = e.target.value;
          setRole(next);
          void patch({ role: next });
        }}
      >
        <optgroup label={locale === "es" ? "Staff" : "Staff"}>
          {STAFF_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </optgroup>
        <optgroup label={locale === "es" ? "Portal cliente" : "Portal client"}>
          {CLIENT_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </optgroup>
      </select>

      {(role === "regional_admin" || role === "sales_agent") && (
        <select
          className={selectClass}
          disabled={loading}
          defaultValue={currentCountry ?? "CO"}
          onChange={(e) =>
            void patch({
              role,
              assignedCountry: e.target.value === "US" ? "US" : "CO",
            })
          }
        >
          <option value="CO">CO</option>
          <option value="US">US</option>
        </select>
      )}

      {role === "sales_agent" && (
        <select
          className={selectClass}
          disabled={loading}
          defaultValue={currentRegionalAdminId ?? ""}
          onChange={(e) =>
            void patch({
              role,
              managedByRegionalAdminId: e.target.value || null,
            })
          }
        >
          <option value="">
            {locale === "es" ? "Sin admin regional" : "No regional admin"}
          </option>
          {regionalAdmins.map((ra) => (
            <option key={ra.id} value={ra.id}>
              {ra.full_name ?? ra.email} ({ra.assigned_country ?? "?"})
            </option>
          ))}
        </select>
      )}

      {(isClient || CLIENT_ROLES.includes(role as (typeof CLIENT_ROLES)[number])) && (
        <select
          className={selectClass}
          disabled={loading}
          defaultValue=""
          onChange={(e) => {
            const clientId = e.target.value;
            if (!clientId) return;
            void patch({ role, clientId });
          }}
        >
          <option value="">
            {locale === "es" ? "Asignar cliente…" : "Assign client…"}
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {isStaff && !CLIENT_ROLES.includes(role as (typeof CLIENT_ROLES)[number]) && (
        <span className="text-[10px] text-kitch-subtle">
          {locale === "es" ? "staff" : "staff"}
        </span>
      )}
    </div>
  );
}
