import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { withLocale, type Locale } from "@/lib/i18n";

const LOGO_SRC = "/brand/kitch-logo-slogan.webp";

type KitchLogoProps = {
  locale: Locale;
  className?: string;
  showByline?: boolean;
  variant?: "header" | "hero";
};

export function KitchLogo({
  locale,
  className,
  showByline = false,
  variant = "header",
}: KitchLogoProps) {
  const isHero = variant === "hero";

  return (
    <Link
      href={withLocale(locale, "/")}
      className={cn(
        "group inline-flex flex-col items-start gap-1",
        className,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt="Kitch — The flow behind great service"
        width={isHero ? 320 : 160}
        height={isHero ? 96 : 48}
        priority={isHero}
        className={cn(
          "h-auto w-auto object-contain transition-opacity group-hover:opacity-90",
          isHero ? "max-h-20 sm:max-h-24 lg:max-h-28" : "max-h-9 sm:max-h-10",
        )}
      />
      {showByline && (
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-kitch-subtle sm:text-xs">
          By Armo
        </span>
      )}
    </Link>
  );
}
