import { HomeSectionShell } from "@/components/home/v2/HomeSectionShell";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

export function OperationalProblem({ content }: HomepageV2SectionProps) {
  return (
    <HomeSectionShell
      content={content}
      layout="split-start"
      mediaAspect="wide"
    />
  );
}
