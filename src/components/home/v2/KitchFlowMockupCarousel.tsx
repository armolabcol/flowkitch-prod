"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type {
  HomepageV2FlowStep,
  HomepageV2OperatingSystemUi,
} from "@/components/home/v2/types";

const CAROUSEL_BASE = "/assets/sections/operating-system/carousel/";
const AUTOPLAY_MS = 6000;
const LIGHT_SWEEP_MS = 720;

type KitchFlowMockupCarouselProps = {
  steps: HomepageV2FlowStep[];
  activeIndex: number;
  onActiveChange: (index: number | ((current: number) => number)) => void;
  labels: HomepageV2OperatingSystemUi;
};

function formatStepAria(template: string, title: string, step: string) {
  return template.replace("{title}", title).replace("{step}", step);
}

function resolveDirection(
  from: number,
  to: number,
  slideCount: number,
): 1 | -1 {
  if (from === to) return 1;
  const forward = (to - from + slideCount) % slideCount;
  const backward = (from - to + slideCount) % slideCount;
  return forward <= backward ? 1 : -1;
}

function CarouselMedia({
  step,
  isActive,
  isAnimating,
  placeholderLabel,
  imageAlt,
}: {
  step: HomepageV2FlowStep;
  isActive: boolean;
  isAnimating: boolean;
  placeholderLabel: string;
  imageAlt: string;
}) {
  const [imageOk, setImageOk] = useState(true);
  const src = `${CAROUSEL_BASE}${step.asset}`;

  return (
    <div
      className={`kitch-flow-carousel__slide${isActive ? " is-active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="kitch-flow-carousel__media">
        <div
          className={`kitch-flow-carousel__media-frame${
            isActive && isAnimating ? " is-animating" : ""
          }`}
        >
          {imageOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={step.step}
              src={src}
              alt={isActive ? imageAlt : ""}
              className="kitch-flow-carousel__image"
              loading="lazy"
              onError={() => setImageOk(false)}
            />
          ) : (
            <div
              key={`placeholder-${step.step}`}
              className="kitch-flow-carousel__placeholder kitch-flow-carousel__image"
            >
              <span className="kitch-flow-carousel__placeholder-file">
                {step.asset}
              </span>
              <span className="kitch-flow-carousel__placeholder-label">
                {placeholderLabel}
              </span>
            </div>
          )}
        </div>
        <div className="kitch-flow-carousel__media-overlay" aria-hidden />
      </div>
    </div>
  );
}

export function KitchFlowMockupCarousel({
  steps,
  activeIndex,
  onActiveChange,
  labels,
}: KitchFlowMockupCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [mediaAnimating, setMediaAnimating] = useState(false);

  const slideCount = steps.length;
  const activeStep = steps[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      const next = ((index % slideCount) + slideCount) % slideCount;
      setDirection(resolveDirection(activeIndex, next, slideCount));
      onActiveChange(next);
      setIsPaused(true);
    },
    [activeIndex, onActiveChange, slideCount],
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
    const onVisibility = () => setIsTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setMediaAnimating(false);
      return;
    }

    setMediaAnimating(true);
    const timer = window.setTimeout(() => setMediaAnimating(false), LIGHT_SWEEP_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || isPaused || isTabHidden || slideCount < 2) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      onActiveChange((current) => (current + 1) % slideCount);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [
    activeIndex,
    isPaused,
    isTabHidden,
    onActiveChange,
    reducedMotion,
    slideCount,
  ]);

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

  if (!activeStep || slideCount === 0) return null;

  const directionClass =
    direction > 0
      ? "kitch-flow-carousel__viewport--dir-next"
      : "kitch-flow-carousel__viewport--dir-prev";

  return (
    <div
      ref={rootRef}
      className="kitch-flow-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.carouselAriaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={`kitch-flow-carousel__viewport ${directionClass}`}>
        {steps.map((step, index) => (
          <CarouselMedia
            key={step.asset}
            step={step}
            isActive={index === activeIndex}
            isAnimating={mediaAnimating}
            placeholderLabel={labels.placeholderLabel}
            imageAlt={formatStepAria(
              labels.stepAriaTemplate,
              step.title,
              step.step,
            )}
          />
        ))}
      </div>

      <div className="kitch-flow-carousel__content">
        <div
          key={activeIndex}
          className="kitch-flow-carousel__content-motion"
        >
          <div className="kitch-flow-carousel__meta">
            <span className="kitch-flow-carousel__step">{activeStep.step}</span>
            <span className="kitch-flow-carousel__badge">{activeStep.badge}</span>
          </div>

          <h3 className="kitch-flow-carousel__title">{activeStep.title}</h3>
          <p className="kitch-flow-carousel__description">
            {activeStep.description}
          </p>
        </div>

        <div className="kitch-flow-carousel__steps" role="tablist">
          {steps.map((step, index) => (
            <button
              key={step.stepLabel}
              type="button"
              role="tab"
              className={`kitch-flow-carousel__step-pill${
                index === activeIndex ? " is-active" : ""
              }`}
              aria-selected={index === activeIndex}
              onClick={() => goTo(index)}
            >
              {step.stepLabel}
            </button>
          ))}
        </div>

        <div className="kitch-flow-carousel__footer">
          <div className="kitch-flow-carousel__controls">
            <button
              type="button"
              className="kitch-flow-carousel__button"
              onClick={goPrev}
              aria-label={labels.prevStepLabel}
            >
              <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              className="kitch-flow-carousel__button"
              onClick={goNext}
              aria-label={labels.nextStepLabel}
            >
              <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
            </button>
          </div>

          <div
            className="kitch-flow-carousel__dots"
            role="tablist"
            aria-label={labels.flowStepsAriaLabel}
          >
            {steps.map((step, index) => (
              <button
                key={step.asset}
                type="button"
                role="tab"
                className={`kitch-flow-carousel__dot${
                  index === activeIndex ? " is-active" : ""
                }`}
                aria-label={formatStepAria(
                  labels.stepAriaTemplate,
                  step.title,
                  step.step,
                )}
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
