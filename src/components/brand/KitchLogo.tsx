import Link from "next/link";
import { cn } from "@/lib/cn";
import { withLocale, type Locale } from "@/lib/i18n";

type KitchLogoProps = {
  locale: Locale;
  className?: string;
  showByline?: boolean;
  variant?: "header" | "hero";
};

export function KitchLogo({
  locale,
  className,
  showByline = true,
  variant = "header",
}: KitchLogoProps) {
  const isHero = variant === "hero";

  return (
    <Link
      href={withLocale(locale, "/")}
      className={cn(
        "group inline-flex items-baseline gap-2.5",
        isHero && "flex-col items-start gap-1 sm:gap-1.5",
        className,
      )}
    >
      <span
        className={cn(
          "relative font-semibold tracking-tight text-white",
          isHero && "text-4xl sm:text-5xl lg:text-6xl",
        )}
      >
        <span className={cn(isHero ? "" : "text-[1.35rem] font-semibold sm:text-2xl")}>
          Kitch
        </span>
        <span
          className={cn(
            "absolute rounded-full bg-kitch-accent shadow-[0_0_14px_rgba(230,57,70,0.85)] transition-transform group-hover:scale-110",
            isHero
              ? "-right-2 top-2 size-2.5 sm:top-2.5 sm:size-3 lg:top-3 lg:size-3.5"
              : "-right-1.5 top-1 size-2",
          )}
          aria-hidden
        />
      </span>
      {showByline && (
        <span
          className={cn(
            "font-medium uppercase tracking-[0.18em] text-kitch-subtle",
            isHero
              ? "text-xs sm:text-sm"
              : "text-[11px] sm:text-xs",
          )}
        >
          By Armo
        </span>
      )}
    </Link>
  );
}
