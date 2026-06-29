"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { HomepageV2FlowCarouselSlide } from "@/components/home/v2/types";

const CAROUSEL_BASE = "/assets/sections/operating-system/carousel/";
const AUTOPLAY_MS = 5500;

type KitchFlowMockupCarouselProps = {
  slides: HomepageV2FlowCarouselSlide[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  placeholderLabel?: string;
};

function CarouselMedia({
  slide,
  isActive,
  placeholderLabel,
}: {
  slide: HomepageV2FlowCarouselSlide;
  isActive: boolean;
  placeholderLabel: string;
}) {
  const [imageOk, setImageOk] = useState(true);
  const src = `${CAROUSEL_BASE}${slide.asset}`;

  return (
    <div
      className={`kitch-flow-carousel__slide${isActive ? " is-active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="kitch-flow-carousel__media">
        {imageOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="kitch-flow-carousel__img"
            loading="lazy"
            onError={() => setImageOk(false)}
          />
        ) : (
          <div className="kitch-flow-carousel__placeholder">
            <span className="kitch-flow-carousel__placeholder-file">
              {slide.asset}
            </span>
            <span className="kitch-flow-carousel__placeholder-label">
              {placeholderLabel}
            </span>
          </div>
        )}
        <div className="kitch-flow-carousel__media-overlay" aria-hidden />
      </div>
    </div>
  );
}

export function KitchFlowMockupCarousel({
  slides,
  activeIndex,
  onActiveChange,
  placeholderLabel = "Mockup pendiente",
}: KitchFlowMockupCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const slideCount = slides.length;
  const activeSlide = slides[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      const next = ((index % slideCount) + slideCount) % slideCount;
      onActiveChange(next);
      setIsPaused(true);
    },
    [onActiveChange, slideCount],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused || slideCount < 2) return;

    const timer = window.setInterval(() => {
      onActiveChange((activeIndex + 1) % slideCount);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused, onActiveChange, reducedMotion, slideCount]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  if (!activeSlide || slideCount === 0) return null;

  return (
    <div
      ref={rootRef}
      className="kitch-flow-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Demostración del flujo operativo Kitch"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="kitch-flow-carousel__viewport">
        {slides.map((slide, index) => (
          <CarouselMedia
            key={slide.asset}
            slide={slide}
            isActive={index === activeIndex}
            placeholderLabel={placeholderLabel}
          />
        ))}
      </div>

      <div className="kitch-flow-carousel__content">
        <div className="kitch-flow-carousel__meta">
          <span className="kitch-flow-carousel__step">{activeSlide.step}</span>
          <span className="kitch-flow-carousel__badge">{activeSlide.badge}</span>
        </div>

        <h3 key={`title-${activeIndex}`} className="kitch-flow-carousel__title">
          {activeSlide.title}
        </h3>
        <p
          key={`desc-${activeIndex}`}
          className="kitch-flow-carousel__description"
        >
          {activeSlide.description}
        </p>

        <div className="kitch-flow-carousel__steps" aria-hidden>
          {slides.map((slide, index) => (
            <span
              key={slide.stepLabel}
              className={`kitch-flow-carousel__step-pill${
                index === activeIndex ? " is-active" : ""
              }`}
            >
              {slide.stepLabel}
            </span>
          ))}
        </div>

        <div className="kitch-flow-carousel__footer">
          <div className="kitch-flow-carousel__controls">
            <button
              type="button"
              className="kitch-flow-carousel__button"
              onClick={goPrev}
              aria-label="Paso anterior"
            >
              <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              className="kitch-flow-carousel__button"
              onClick={goNext}
              aria-label="Paso siguiente"
            >
              <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
            </button>
          </div>

          <div
            className="kitch-flow-carousel__dots"
            role="tablist"
            aria-label="Pasos del flujo"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.asset}
                type="button"
                role="tab"
                className={`kitch-flow-carousel__dot${
                  index === activeIndex ? " is-active" : ""
                }`}
                aria-label={`${slide.title} — paso ${slide.step}`}
                aria-selected={index === activeIndex}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
