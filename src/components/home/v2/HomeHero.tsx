import { HomeSectionShell } from "@/components/home/v2/HomeSectionShell";
import { MediaPlaceholder } from "@/components/home/v2/placeholders";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

export function HomeHero({ content }: HomepageV2SectionProps) {
  return (
    <HomeSectionShell
      content={content}
      layout="split-start"
      mediaAspect="video"
      className="min-h-[min(100svh,920px)] pt-8 lg:pt-12"
    >
      <MediaPlaceholder
        label={content.mediaPlaceholder}
        aspect="video"
        className="lg:min-h-[420px]"
      />
    </HomeSectionShell>
  );
}
