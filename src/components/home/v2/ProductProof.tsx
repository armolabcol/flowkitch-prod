import { HomeSectionShell } from "@/components/home/v2/HomeSectionShell";
import { MediaPlaceholder } from "@/components/home/v2/placeholders";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

export function ProductProof({ content }: HomepageV2SectionProps) {
  return (
    <HomeSectionShell content={content} layout="stack" mediaAspect="wide">
      <MediaPlaceholder
        label={content.mediaPlaceholder}
        aspect="wide"
        className="min-h-[280px] sm:min-h-[360px] lg:min-h-[480px]"
      />
    </HomeSectionShell>
  );
}
