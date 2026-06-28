import { HomeSectionShell } from "@/components/home/v2/HomeSectionShell";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

export function HomepageCTA({ content }: HomepageV2SectionProps) {
  return (
    <HomeSectionShell
      content={content}
      layout="centered"
      showMedia={false}
      className="border-b-0"
    />
  );
}
