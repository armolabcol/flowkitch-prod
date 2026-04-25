import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function SectionLabel({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-kitch-accent",
        className,
      )}
      {...props}
    />
  );
}
