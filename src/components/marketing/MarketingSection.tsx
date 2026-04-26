import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

type MarketingSectionProps = {
  id?: string;
  label?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function MarketingSection({
  id,
  label,
  title,
  subtitle,
  children,
  className,
  containerClassName,
}: MarketingSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-14 sm:py-16 lg:py-20", className)}>
      <Container className={cn("max-w-6xl", containerClassName)}>
        {label ? <SectionLabel>{label}</SectionLabel> : null}
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        <div className={subtitle ? "mt-10" : "mt-8"}>{children}</div>
      </Container>
    </section>
  );
}
