"use client";

import { useRef, useState } from "react";
import type {
  HomepageV2SectionProps,
  HomepageV2VideoDemo,
} from "@/components/home/v2/types";
import "@/styles/section-video-demo.css";

type VideoStatus = "loading" | "ready" | "missing";

function SignalStrip({ text }: { text: string }) {
  const items = text.split("·").map((item) => item.trim());

  return (
    <div className="video-demo-signal-strip">
      <ul className="video-demo-signal-strip__list">
        {items.map((item, index) => (
          <li key={item} className="video-demo-signal-strip__item-row">
            {index > 0 ? (
              <span className="video-demo-signal-strip__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="video-demo-signal-strip__item">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideoDemoStage({ demo }: { demo: HomepageV2VideoDemo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<VideoStatus>("loading");

  return (
    <div className="kitch-video-demo">
      <div className="kitch-video-demo__overlay" aria-hidden>
        <p className="kitch-video-demo__overlay-title">{demo.overlayTitle}</p>
        <p className="kitch-video-demo__overlay-flow">{demo.overlayFlow}</p>
      </div>

      {status !== "ready" ? (
        <div
          className="kitch-video-demo__fallback"
          role="img"
          aria-label={demo.videoAriaLabel}
        >
          <span className="kitch-video-demo__play" aria-hidden>
            <span className="kitch-video-demo__play-icon">▶</span>
          </span>
          <span className="kitch-video-demo__fallback-label">
            {demo.placeholderPendingLabel}
          </span>
          <span className="kitch-video-demo__fallback-file">
            {demo.placeholderFileLabel}
          </span>
        </div>
      ) : null}

      <video
        ref={videoRef}
        className="kitch-video-demo__video"
        poster={demo.poster}
        controls={status === "ready"}
        preload="metadata"
        playsInline
        aria-label={demo.videoAriaLabel}
        style={{ display: status === "ready" ? "block" : "none" }}
        onLoadedData={() => setStatus("ready")}
        onError={() => setStatus("missing")}
      >
        <source src={demo.webm} type="video/webm" />
        <source src={demo.mp4} type="video/mp4" />
      </video>
    </div>
  );
}

export function VideoDemoSection({ content }: HomepageV2SectionProps) {
  const demo = content.videoDemo;
  const stageRef = useRef<HTMLDivElement>(null);

  const handleWatchVideo = () => {
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    const video = stageRef.current?.querySelector("video.kitch-video-demo__video");
    if (video instanceof HTMLVideoElement && !video.controls) {
      return;
    }
    if (video instanceof HTMLVideoElement) {
      void video.play().catch(() => undefined);
    }
  };

  return (
    <section
      id={content.id}
      className="video-demo-section"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="video-demo-section__inner">
        <header className="video-demo-section__header">
          {content.eyebrow ? (
            <p className="video-demo-section__eyebrow">{content.eyebrow}</p>
          ) : null}

          <h2 id={`${content.id}-title`} className="video-demo-section__headline">
            <span className="video-demo-section__headline-primary">
              {content.title}
            </span>
            {content.titleLine2 ? (
              <span className="video-demo-section__headline-line2">
                {content.titleLine2}
              </span>
            ) : null}
          </h2>

          <p className="video-demo-section__body">{content.description}</p>

          {content.footerStrip ? (
            <SignalStrip text={content.footerStrip} />
          ) : null}

          {content.cta?.primaryLabel ? (
            <div className="video-demo-section__cta">
              <button
                type="button"
                className="video-demo-section__cta-btn"
                onClick={handleWatchVideo}
              >
                <span className="video-demo-section__cta-icon" aria-hidden>
                  ▶
                </span>
                {content.cta.primaryLabel}
              </button>
            </div>
          ) : null}
        </header>

        {demo ? (
          <div ref={stageRef} className="video-demo-section__stage-wrap">
            <VideoDemoStage demo={demo} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
