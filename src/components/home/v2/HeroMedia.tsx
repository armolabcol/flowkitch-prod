"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HERO_ASSETS } from "@/lib/hero-assets";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

export function HeroMedia() {
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [posterOk, setPosterOk] = useState(true);
  const [videoOk, setVideoOk] = useState(false);

  const showVideo = isMobile === false && videoOk;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#1c1c1c]">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.5 }}
      >
        {posterOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={HERO_ASSETS.poster}
            alt=""
            aria-hidden
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              showVideo && "opacity-0",
            )}
            onError={() => setPosterOk(false)}
          />
        ) : (
          <div
            className="absolute inset-0 bg-[#1c1c1c]"
            aria-hidden
          />
        )}

        {isMobile === false ? (
          <video
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              showVideo ? "opacity-100" : "opacity-0",
            )}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_ASSETS.poster}
            onLoadedData={() => setVideoOk(true)}
            onError={() => setVideoOk(false)}
          >
            <source src={HERO_ASSETS.video} type="video/mp4" />
          </video>
        ) : null}
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c]/95 via-[#1c1c1c]/75 to-[#1c1c1c]/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/80 via-transparent to-[#1c1c1c]/30"
        aria-hidden
      />

      <div
        className="absolute -right-24 top-1/3 h-[420px] w-[420px] rounded-full bg-[#e63946]/[0.12] blur-[120px]"
        aria-hidden
      />
    </div>
  );
}
