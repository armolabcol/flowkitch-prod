"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/lib/dictionaries";

const WHATSAPP_URL = "https://wa.me/XXXXXXXXXXX";

export function WhatsAppFloatingButton({ dictionary }: { dictionary: Dictionary }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-[60]"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <Link
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-full bg-kitch-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-transform hover:-translate-y-0.5 hover:bg-[#ff4d5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kitch-accent"
        aria-label={dictionary.contact.whatsappCta}
      >
        <MessageCircle className="size-5" strokeWidth={1.8} />
        <span className="hidden sm:inline">{dictionary.contact.whatsappCta}</span>
      </Link>
    </motion.div>
  );
}

