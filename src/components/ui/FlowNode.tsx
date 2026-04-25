import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FlowNodeProps = HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
  done?: boolean;
  size?: "default" | "lg";
};

export function FlowNode({
  className,
  active,
  done,
  size = "default",
  children,
  ...props
}: FlowNodeProps) {
  const large = size === "lg";

  return (
    <div
      className={cn(
        "relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border px-3 py-2.5 text-center",
        large && "min-h-[52px] rounded-[1.1rem] px-3.5 py-3 text-sm font-medium sm:text-[15px]",
        "border-kitch-border bg-kitch-elevated/90 text-kitch-muted backdrop-blur-sm",
        active && "border-kitch-accent/55 text-kitch-fg shadow-[0_0_28px_rgba(230,57,70,0.14)]",
        done && "border-kitch-accent/35 text-kitch-fg/95",
        className,
      )}
      {...props}
    >
      {active && (
        <span
          className="absolute -right-1 -top-1 size-2.5 rounded-full bg-kitch-accent shadow-[0_0_14px_rgba(230,57,70,0.9)]"
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
