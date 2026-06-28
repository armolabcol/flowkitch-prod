import { cn } from "@/lib/cn";

export function MediaPlaceholder({
  label,
  className,
  aspect = "video",
}: {
  label: string;
  className?: string;
  aspect?: "video" | "square" | "wide" | "device";
}) {
  const aspectClass =
    aspect === "square"
      ? "aspect-square max-w-md"
      : aspect === "wide"
        ? "aspect-[21/9] w-full"
        : aspect === "device"
          ? "aspect-[9/16] max-w-[280px]"
          : "aspect-video w-full";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl border border-dashed border-white/15 bg-kitch-surface/40",
        aspectClass,
        className,
      )}
      data-slot="media-placeholder"
      aria-hidden
    >
      <span className="max-w-[85%] text-center text-xs font-medium uppercase tracking-widest text-kitch-subtle">
        {label}
      </span>
    </div>
  );
}

export function AnimationPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-12 items-center justify-center rounded-xl border border-dotted border-white/10 bg-white/[0.02] px-4 py-3",
        className,
      )}
      data-slot="animation-placeholder"
      aria-hidden
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-kitch-subtle/80">
        {label}
      </span>
    </div>
  );
}

export function CtaPlaceholder({
  primaryLabel,
  secondaryLabel,
}: {
  primaryLabel: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center" data-slot="cta-placeholder">
      <span className="inline-flex h-12 min-w-[12rem] items-center justify-center rounded-xl border border-kitch-accent/40 bg-kitch-accent/10 px-6 text-sm font-medium text-kitch-fg">
        {primaryLabel}
      </span>
      {secondaryLabel && (
        <span className="inline-flex h-12 min-w-[12rem] items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-kitch-muted">
          {secondaryLabel}
        </span>
      )}
    </div>
  );
}

export function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kitch-subtle">
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.08]">
      {children}
    </h2>
  );
}

export function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg lg:text-xl lg:leading-relaxed">
      {children}
    </p>
  );
}
