"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type RegionalAdmin = {
  id: string;
  email: string;
  full_name: string | null;
  assigned_country: string | null;
};

type Client = { id: string; name: string };

const SUPER_STAFF_ROLES = [
  { value: "super_admin", es: "Super administrador", en: "Super admin" },
  { value: "regional_admin", es: "Admin regional", en: "Regional admin" },
  { value: "sales_agent", es: "Agente comercial", en: "Sales agent" },
  { value: "billing_admin", es: "Admin facturación", en: "Billing admin" },
  { value: "support_agent", es: "Soporte", en: "Support agent" },
  { value: "client_user", es: "Usuario portal", en: "Portal user" },
  { value: "client_owner", es: "Dueño cliente", en: "Client owner" },
  { value: "client_billing", es: "Facturación cliente", en: "Client billing" },
] as const;

export function StaffInviteForm({
  locale,
  actorRole,
  actorCountry,
  actorId,
  regionalAdmins = [],
  clients = [],
}: {
  locale: "es" | "en";
  actorRole: string;
  actorCountry?: "CO" | "US" | null;
  actorId?: string;
  regionalAdmins?: RegionalAdmin[];
  clients?: Client[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState(
    actorRole === "super_admin" ? "sales_agent" : "sales_agent",
  );

  const isSuper = actorRole === "super_admin";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const role = String(fd.get("role") ?? "sales_agent");
    const email = String(fd.get("email") ?? "").trim();
    const fullName = String(fd.get("fullName") ?? "").trim() || undefined;
    const assignedCountry =
      fd.get("assignedCountry") === "US"
        ? "US"
        : fd.get("assignedCountry") === "CO"
          ? "CO"
          : undefined;
    const managedBy =
      String(fd.get("managedByRegionalAdminId") ?? "").trim() || undefined;
    const clientId = String(fd.get("clientId") ?? "").trim() || undefined;

    try {
      const isClientRole = ["client_user", "client_owner", "client_billing"].includes(role);
      const body = isClientRole
        ? {
            action: "invite",
            email,
            fullName,
            clientId,
            role,
          }
        : {
            action: "invite_staff",
            email,
            fullName,
            role,
            assignedCountry:
              role === "regional_admin" || role === "sales_agent"
                ? assignedCountry ?? actorCountry ?? "CO"
                : undefined,
            managedByRegionalAdminId:
              role === "sales_agent"
                ? managedBy ?? (actorRole === "regional_admin" ? actorId : undefined)
                : undefined,
          };

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  const roleOptions = isSuper
    ? SUPER_STAFF_ROLES
    : SUPER_STAFF_ROLES.filter((r) => r.value === "sales_agent");

  const showCountry =
    isSuper &&
    (selectedRole === "regional_admin" || selectedRole === "sales_agent");
  const showRegionalAdmin =
    isSuper && selectedRole === "sales_agent";
  const showClient =
    isSuper &&
    ["client_user", "client_owner", "client_billing"].includes(selectedRole);

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-2xl border border-white/[0.08] bg-kitch-surface/40 p-4 sm:grid-cols-2"
    >
      <h3 className="sm:col-span-2 text-sm font-medium text-white">
        {locale === "es" ? "Invitar usuario" : "Invite user"}
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
        <select
          name="role"
          className={fieldClass}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roleOptions.map((r) => (
            <option key={r.value} value={r.value}>
              {locale === "es" ? r.es : r.en}
            </option>
          ))}
        </select>
      </label>
      {showCountry && (
        <label className="text-xs text-kitch-muted">
          {locale === "es" ? "País" : "Country"}
          <select name="assignedCountry" className={fieldClass} defaultValue="CO">
            <option value="CO">Colombia</option>
            <option value="US">USA</option>
          </select>
        </label>
      )}
      {showRegionalAdmin && (
        <label className="text-xs text-kitch-muted">
          {locale === "es" ? "Admin regional" : "Regional admin"}
          <select name="managedByRegionalAdminId" className={fieldClass} defaultValue="">
            <option value="">
              {locale === "es" ? "Sin asignar" : "Unassigned"}
            </option>
            {regionalAdmins.map((ra) => (
              <option key={ra.id} value={ra.id}>
                {ra.full_name ?? ra.email} ({ra.assigned_country ?? "?"})
              </option>
            ))}
          </select>
        </label>
      )}
      {showClient && (
        <label className="text-xs text-kitch-muted sm:col-span-2">
          Cliente
          <select name="clientId" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              {locale === "es" ? "Seleccionar cliente" : "Select client"}
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
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
