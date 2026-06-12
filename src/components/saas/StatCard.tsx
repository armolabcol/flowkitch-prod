import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-kitch-surface/80 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-kitch-subtle">
          {label}
        </p>
        {icon && (
          <span className="text-kitch-accent/80" aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {value}
      </p>
    </div>
  );
}
