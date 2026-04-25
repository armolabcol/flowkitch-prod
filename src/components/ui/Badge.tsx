import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-kitch-border bg-kitch-surface px-3 py-1 text-xs font-medium uppercase tracking-wider text-kitch-muted",
        className,
      )}
      {...props}
    />
  );
}
