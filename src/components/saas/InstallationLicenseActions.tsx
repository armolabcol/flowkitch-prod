"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { LicenseStatus } from "@/types/saas";

const STATUSES: LicenseStatus[] = [
  "active",
  "past_due",
  "grace_period",
  "suspended",
  "cancelled",
  "maintenance_required",
];

type Props = {
  installationId: string;
  currentStatus: LicenseStatus;
  locale: "es" | "en";
  statusLabels: Record<LicenseStatus, string>;
};

export function InstallationLicenseActions({
  installationId,
  currentStatus,
  locale,
  statusLabels,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function run(
    action: "update" | "extend",
    extra?: Record<string, unknown>,
  ) {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/installations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, installationId, ...extra }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) throw new Error(data.message);
      setMessage(data.message ?? "OK");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 min-w-[140px]">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as LicenseStatus)}
        className="rounded-lg border border-white/10 bg-kitch-bg/80 px-2 py-1.5 text-xs text-kitch-fg"
        disabled={loading}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-1">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={loading}
          onClick={() => run("update", { license_status: status })}
        >
          {locale === "es" ? "Guardar" : "Save"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={loading}
          onClick={() => run("extend", { days: 30 })}
        >
          +30d
        </Button>
      </div>
      {message && <p className="text-[10px] text-kitch-muted">{message}</p>}
    </div>
  );
}
