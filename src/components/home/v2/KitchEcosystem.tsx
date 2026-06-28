import { Container } from "@/components/ui/Container";
import {
  AnimationPlaceholder,
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
} from "@/components/home/v2/placeholders";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

const ECOSYSTEM_SLOTS = 6;

export function KitchEcosystem({ content }: HomepageV2SectionProps) {
  return (
    <section
      id={content.id}
      className="flex min-h-[100svh] flex-col justify-center border-b border-white/[0.06] py-16 sm:py-20 lg:py-28"
      aria-labelledby={`${content.id}-title`}
    >
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="mx-auto max-w-2xl space-y-6 text-center lg:space-y-8">
          {content.eyebrow && <SectionEyebrow>{content.eyebrow}</SectionEyebrow>}
          <SectionTitle>
            <span id={`${content.id}-title`}>{content.title}</span>
          </SectionTitle>
          <SectionDescription>{content.description}</SectionDescription>
        </div>

        <div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 lg:gap-6"
          data-slot="ecosystem-grid"
        >
          {Array.from({ length: ECOSYSTEM_SLOTS }, (_, i) => (
            <div
              key={i}
              className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/12 bg-kitch-surface/25 p-6 sm:min-h-[180px]"
            >
              <span className="text-[10px] font-medium uppercase tracking-widest text-kitch-subtle">
                {content.mediaPlaceholder}
              </span>
              <span className="text-xs text-kitch-muted">Module {i + 1}</span>
            </div>
          ))}
        </div>

        <AnimationPlaceholder label={content.animationPlaceholder} />
      </Container>
    </section>
  );
}
