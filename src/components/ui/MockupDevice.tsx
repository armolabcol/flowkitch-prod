import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type DeviceVariant = "phone" | "tablet" | "kitchen" | "manager";

const frames: Record<
  DeviceVariant,
  { shell: string; notch?: boolean; label?: string }
> = {
  phone: {
    shell: "max-w-[220px] rounded-[2rem] border border-white/10 p-2 sm:max-w-[240px]",
    notch: true,
  },
  tablet: {
    shell: "max-w-[320px] rounded-3xl border border-white/10 p-2 sm:max-w-[360px]",
  },
  kitchen: {
    shell: "w-full max-w-[520px] rounded-2xl border border-white/10 p-3",
  },
  manager: {
    shell: "w-full max-w-[560px] rounded-2xl border border-white/10 p-3",
  },
};

export function MockupDevice({
  variant,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant: DeviceVariant;
  children: ReactNode;
}) {
  const cfg = frames[variant];

  return (
    <div
      className={cn(
        "relative bg-gradient-to-b from-kitch-elevated to-kitch-surface shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
        cfg.shell,
        className,
      )}
      {...props}
    >
      {cfg.notch && (
        <div className="mx-auto mb-2 h-5 w-24 rounded-full bg-black/40" aria-hidden />
      )}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-kitch-bg">
        {children}
      </div>
    </div>
  );
}
