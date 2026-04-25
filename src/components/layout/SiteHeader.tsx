"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { KitchLogo } from "@/components/brand/KitchLogo";
import { LanguageSwitcher } from "@/components/brand/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/data/navigation";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  const navLabel = (key: (typeof mainNav)[number]["key"]) => {
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
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-kitch-bg/65 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-[4.25rem] max-w-7xl items-center justify-between gap-4">
        <KitchLogo locale={locale} className="shrink-0" showByline={false} />

        <nav
          className="hidden items-center gap-1.5 lg:flex"
          aria-label="Primary"
        >
          {mainNav.map((item) => (
            <Link
              key={item.key}
              href={withLocale(locale, item.href)}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-kitch-muted transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              {navLabel(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button
            asChild
            variant="primary"
            size="sm"
            className="hidden font-semibold shadow-[0_0_36px_rgba(230,57,70,0.28)] ring-1 ring-white/10 hover:bg-[#ff4d5c] sm:inline-flex sm:min-w-[8rem]"
          >
            <Link href={withLocale(locale, "/demo")}>
              {dictionary.header.requestDemo}
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="hidden border-white/10 bg-transparent font-semibold text-kitch-muted hover:bg-white/[0.06] hover:text-white md:inline-flex md:min-w-[6.5rem]"
          >
            <Link href={withLocale(locale, "/portal/login")}>
              {dictionary.header.portalLogin}
            </Link>
          </Button>

          <LanguageSwitcher className="sm:hidden" />

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-kitch-surface/80 text-kitch-fg shadow-sm lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? dictionary.header.closeMenu : dictionary.header.openMenu}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-white/[0.06] bg-kitch-bg/95 backdrop-blur-xl lg:hidden"
          >
            <Container className="max-w-7xl py-4">
              <div className="flex flex-col gap-1">
                {mainNav.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.2 }}
                  >
                    <Link
                      href={withLocale(locale, item.href)}
                      className="block rounded-xl px-3 py-3 text-sm font-medium text-kitch-fg hover:bg-white/[0.05]"
                      onClick={() => setOpen(false)}
                    >
                      {navLabel(item.key)}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                <Button
                  asChild
                  variant="primary"
                  size="md"
                  className="font-semibold shadow-[0_0_24px_rgba(230,57,70,0.2)]"
                >
                  <Link
                    href={withLocale(locale, "/demo")}
                    onClick={() => setOpen(false)}
                  >
                    {dictionary.header.requestDemo}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="md"
                  className="border-white/10 bg-white/[0.05] font-semibold"
                >
                  <Link
                    href={withLocale(locale, "/portal/login")}
                    onClick={() => setOpen(false)}
                  >
                    {dictionary.header.portalLogin}
                  </Link>
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
