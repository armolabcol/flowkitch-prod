import { Container } from "@/components/ui/Container";
import {
  AnimationPlaceholder,
  MediaPlaceholder,
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
} from "@/components/home/v2/placeholders";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

const FLOW_STEPS = 5;

export function OperationalFlow({ content }: HomepageV2SectionProps) {
  return (
    <section
      id={content.id}
      className="flex min-h-[100svh] flex-col justify-center border-b border-white/[0.06] py-16 sm:py-20 lg:py-28"
      aria-labelledby={`${content.id}-title`}
    >
      <Container className="flex flex-col gap-10 lg:gap-14">
        <div className="max-w-2xl space-y-6 lg:space-y-8">
          {content.eyebrow && <SectionEyebrow>{content.eyebrow}</SectionEyebrow>}
          <SectionTitle>
            <span id={`${content.id}-title`}>{content.title}</span>
          </SectionTitle>
          <SectionDescription>{content.description}</SectionDescription>
        </div>

        <MediaPlaceholder
          label={content.mediaPlaceholder}
          aspect="wide"
          className="hidden lg:flex"
        />

        <div className="flex gap-4 overflow-x-auto pb-2 lg:hidden" data-slot="flow-mobile">
          {Array.from({ length: FLOW_STEPS }, (_, i) => (
            <div
              key={i}
              className="flex h-40 w-36 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/15 bg-kitch-surface/30 text-[10px] uppercase tracking-wider text-kitch-subtle"
            >
              Step {i + 1}
            </div>
          ))}
        </div>

        <div
          className="hidden grid-cols-5 gap-4 lg:grid"
          data-slot="flow-desktop"
        >
          {Array.from({ length: FLOW_STEPS }, (_, i) => (
            <div
              key={i}
              className="flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed border-white/15 bg-kitch-surface/30 text-[10px] uppercase tracking-wider text-kitch-subtle"
            >
              Step {i + 1}
            </div>
          ))}
        </div>

        <AnimationPlaceholder label={content.animationPlaceholder} />
      </Container>
    </section>
  );
}
