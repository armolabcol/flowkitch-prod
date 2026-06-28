"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HERO_ASSETS } from "@/lib/hero-assets";
import { cn } from "@/lib/cn";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type HeroAssetImageProps = {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
};

function HeroAssetImage({
  src,
  alt,
  className,
  placeholderClassName,
}: HeroAssetImageProps) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-white/10 bg-[#242424]/80",
          placeholderClassName,
        )}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setOk(false)}
      loading="lazy"
    />
  );
}

export function HeroMockupStack() {
  const reduce = useReducedMotion();

  const visualMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: 0.45, ease: EASE },
      };

  return (
    <motion.div
      className="relative mx-auto hidden h-[min(520px,58vh)] w-full max-w-[540px] md:block lg:max-w-none"
      {...visualMotion}
      aria-hidden
    >
      {/* Future red flow line layer */}
      <svg
        className="absolute inset-0 z-0 h-full w-full opacity-40"
        viewBox="0 0 400 500"
        fill="none"
        aria-hidden
        data-slot="flow-line-placeholder"
      >
        <path
          d="M 20 420 Q 120 280 200 320 T 380 80"
          stroke="#e63946"
          strokeWidth="2"
          strokeDasharray="8 10"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      <HeroAssetImage
        src={HERO_ASSETS.android}
        alt=""
        className="absolute right-0 top-8 z-[1] h-[72%] w-auto max-w-[58%] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
        placeholderClassName="absolute right-0 top-8 z-[1] h-[72%] w-[52%]"
      />

      <HeroAssetImage
        src={HERO_ASSETS.mockups.manager}
        alt=""
        className="absolute right-[8%] top-0 z-[2] h-[38%] w-auto max-w-[48%] rounded-xl object-contain opacity-90 shadow-2xl"
        placeholderClassName="absolute right-[8%] top-0 z-[2] h-[38%] w-[44%]"
      />

      <HeroAssetImage
        src={HERO_ASSETS.mockups.waiter}
        alt=""
        className="absolute bottom-[6%] left-[4%] z-[3] h-[46%] w-auto max-w-[52%] rounded-xl object-contain shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        placeholderClassName="absolute bottom-[6%] left-[4%] z-[3] h-[46%] w-[48%]"
      />

      <HeroAssetImage
        src={HERO_ASSETS.mockups.customer}
        alt=""
        className="absolute bottom-0 left-[22%] z-[4] h-[52%] w-auto max-w-[42%] rounded-2xl object-contain shadow-[0_24px_56px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
        placeholderClassName="absolute bottom-0 left-[22%] z-[4] h-[52%] w-[38%]"
      />
    </motion.div>
  );
}
