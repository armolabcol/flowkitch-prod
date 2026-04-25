import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/data/navigation";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

function navLabel(
  dictionary: Dictionary,
  key: (typeof mainNav)[number]["key"],
) {
  const map = dictionary.nav;
  switch (key) {
    case "product":
      return map.product;
    case "restaurants":
      return map.restaurants;
    case "waiters":
      return map.waiters;
    case "kitchen":
      return map.kitchen;
    case "manager":
      return map.manager;
    case "demo":
      return map.demo;
    case "portal":
      return map.portal;
    default:
      return key;
  }
}

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-gradient-to-b from-kitch-surface/40 to-kitch-bg">
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-kitch-accent/25 to-transparent"
        aria-hidden
      />
      <Container className="max-w-7xl py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-start gap-3">
              <span
                className="mt-1.5 size-2.5 shrink-0 rounded-full bg-kitch-accent shadow-[0_0_16px_rgba(230,57,70,0.75)]"
                aria-hidden
              />
              <div>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  {dictionary.brand.name}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-kitch-subtle">
                  {dictionary.brand.byArmo}
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-kitch-muted">
                  {dictionary.brand.slogan}
                </p>
                <p className="mt-5 text-xs font-medium text-kitch-subtle">
                  {dictionary.footer.colombia} · {dictionary.footer.unitedStates}
                </p>
              </div>
            </div>
          </div>

          <nav className="lg:col-span-4" aria-label="Footer">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kitch-subtle">
              {locale === "es" ? "Navegación" : "Navigation"}
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2">
              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={withLocale(locale, item.href)}
                    className="text-sm text-kitch-muted transition-colors hover:text-white"
                  >
                    {navLabel(dictionary, item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kitch-subtle">
              {locale === "es" ? "Legal" : "Legal"}
            </p>
            <p className="mt-5 text-xs leading-relaxed text-kitch-subtle">
              {dictionary.footer.legal}
            </p>
            <p className="mt-8 text-xs text-kitch-subtle">
              © {year} {dictionary.brand.name}. {dictionary.brand.byArmo}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
