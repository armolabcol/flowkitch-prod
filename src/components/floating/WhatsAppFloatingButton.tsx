"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/lib/dictionaries";
import { getWhatsAppLeadHref } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n";

export function WhatsAppFloatingButton({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const reduce = useReducedMotion();
  const href = getWhatsAppLeadHref(locale);

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-[60] sm:bottom-5 sm:right-5"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -2, 0] }}
        transition={
          reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-kitch-accent px-3 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-colors hover:bg-[#ff4d5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kitch-accent sm:px-5"
          aria-label={dictionary.contact.whatsappCta}
        >
          <MessageCircle
            className="size-5 transition-transform duration-300 group-hover:scale-105"
            strokeWidth={1.8}
          />
          <span className="hidden sm:inline">{dictionary.contact.whatsappCta}</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
