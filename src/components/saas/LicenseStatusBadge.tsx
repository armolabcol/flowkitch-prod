import type { LicenseStatus } from "@/types/saas";
import { cn } from "@/lib/cn";

const statusStyles: Record<LicenseStatus, string> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  past_due: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  grace_period: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
  suspended: "border-red-500/30 bg-red-500/10 text-red-300",
  cancelled: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  maintenance_required: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  license_unknown: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
};

export function LicenseStatusBadge({
  status,
  label,
  className,
}: {
  status: LicenseStatus;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {label}
    </span>
  );
}
