import { HomeSectionShell } from "@/components/home/v2/HomeSectionShell";
import { MediaPlaceholder } from "@/components/home/v2/placeholders";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

export function AndroidSection({ content }: HomepageV2SectionProps) {
  return (
    <HomeSectionShell
      content={content}
      layout="split-start"
      mediaAspect="device"
    >
      <div className="flex justify-center lg:justify-end">
        <MediaPlaceholder
          label={content.mediaPlaceholder}
          aspect="device"
        />
      </div>
    </HomeSectionShell>
  );
}
