"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { HERO_ASSETS } from "@/lib/hero-assets";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

export function HeroMedia() {
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [posterOk, setPosterOk] = useState(true);
  const [videoOk, setVideoOk] = useState(false);

  const posterSrc = useMemo(
    () =>
      isMobile === true
        ? HERO_ASSETS.posterMobile
        : HERO_ASSETS.posterDesktop,
    [isMobile],
  );

  const enableVideo = isMobile === false && !reduce;
  const showVideo = enableVideo && videoOk;

  return (
    <div
      className="pointer-events-none absolute inset-0 isolate overflow-hidden bg-[#1c1c1c]"
      aria-hidden
    >
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.5 }}
      >
        {posterOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={posterSrc}
            src={posterSrc}
            alt=""
            aria-hidden
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-center",
              showVideo && "opacity-0",
            )}
            onError={() => setPosterOk(false)}
          />
        ) : (
          <div className="absolute inset-0 bg-[#1c1c1c]" aria-hidden />
        )}

        {enableVideo ? (
          <video
            className={cn(
              "kitch-hero-video absolute inset-0 z-[-3] h-full w-full object-cover object-center transition-opacity duration-700 max-md:hidden",
              showVideo ? "opacity-100" : "opacity-0",
            )}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_ASSETS.posterDesktop}
            aria-hidden
            onLoadedData={() => setVideoOk(true)}
            onError={() => setVideoOk(false)}
          >
            <source src={HERO_ASSETS.video} type="video/mp4" />
          </video>
        ) : null}
      </motion.div>

      <div
        className="absolute inset-0 z-[-2]"
        style={{
          background: `
            linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.58) 34%, rgba(0,0,0,0.22) 68%, rgba(0,0,0,0.34) 100%),
            linear-gradient(180deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.18) 46%, rgba(0,0,0,0.48) 100%)
          `,
        }}
        aria-hidden
      />

      <div
        className="absolute -right-24 top-1/3 h-[420px] w-[420px] rounded-full bg-[#e63946]/[0.12] blur-[120px]"
        aria-hidden
      />

      {enableVideo && showVideo ? (
        <div
          className="kitch-hero-brand-badge absolute bottom-[22px] left-1/2 z-[2] hidden -translate-x-1/2 rounded-full border border-white/16 bg-black/[0.42] px-3.5 py-2 text-[13px] font-semibold tracking-[0.04em] text-white backdrop-blur-[10px] md:block"
          aria-hidden
        >
          <span>Kitch</span>
        </div>
      ) : null}
    </div>
  );
}
