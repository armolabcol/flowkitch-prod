import { Container } from "@/components/ui/Container";
import {
  AnimationPlaceholder,
  MediaPlaceholder,
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
} from "@/components/home/v2/placeholders";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

const METRIC_SLOTS = 3;

export function ResultsSection({ content }: HomepageV2SectionProps) {
  return (
    <section
      id={content.id}
      className="flex min-h-[100svh] flex-col justify-center border-b border-white/[0.06] py-16 sm:py-20 lg:py-28"
      aria-labelledby={`${content.id}-title`}
    >
      <Container className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="space-y-6 lg:space-y-8">
          {content.eyebrow && <SectionEyebrow>{content.eyebrow}</SectionEyebrow>}
          <SectionTitle>
            <span id={`${content.id}-title`}>{content.title}</span>
          </SectionTitle>
          <SectionDescription>{content.description}</SectionDescription>
          <AnimationPlaceholder label={content.animationPlaceholder} />
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1 lg:gap-8">
            {Array.from({ length: METRIC_SLOTS }, (_, i) => (
              <div
                key={i}
                className="border-l-2 border-kitch-accent/50 py-2 pl-6"
                data-slot="metric-placeholder"
              >
                <p className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                  —
                </p>
                <p className="mt-2 text-sm text-kitch-muted">
                  {content.mediaPlaceholder} · {i + 1}
                </p>
              </div>
            ))}
          </div>
          <MediaPlaceholder
            label={content.mediaPlaceholder}
            aspect="wide"
            className="lg:hidden"
          />
        </div>
      </Container>
    </section>
  );
}
