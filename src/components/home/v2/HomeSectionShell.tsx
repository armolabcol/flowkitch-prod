import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { HomepageV2SectionContent } from "@/components/home/v2/types";
import {
  AnimationPlaceholder,
  CtaPlaceholder,
  MediaPlaceholder,
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
} from "@/components/home/v2/placeholders";

type Layout = "centered" | "split-start" | "split-end" | "stack";

export function HomeSectionShell({
  content,
  layout = "split-start",
  mediaAspect = "video",
  showMedia = true,
  children,
  className,
}: {
  content: HomepageV2SectionContent;
  layout?: Layout;
  mediaAspect?: "video" | "square" | "wide" | "device";
  showMedia?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const isCentered = layout === "centered";
  const isStack = layout === "stack";

  return (
    <section
      id={content.id}
      className={cn(
        "relative flex min-h-[100svh] flex-col justify-center border-b border-white/[0.06] py-16 sm:py-20 lg:py-28",
        className,
      )}
      aria-labelledby={`${content.id}-title`}
    >
      <Container>
        <div
          className={cn(
            isCentered && "mx-auto flex max-w-3xl flex-col items-center text-center",
            isStack && "flex flex-col gap-12 lg:gap-16",
            !isCentered &&
              !isStack &&
              "grid items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28",
            layout === "split-end" && "lg:[&>*:first-child]:order-2",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-6 lg:gap-8",
              isCentered && "items-center",
            )}
          >
            {content.eyebrow && <SectionEyebrow>{content.eyebrow}</SectionEyebrow>}
            <SectionTitle>
              <span id={`${content.id}-title`}>{content.title}</span>
            </SectionTitle>
            <SectionDescription>{content.description}</SectionDescription>
            {content.cta && (
              <CtaPlaceholder
                primaryLabel={content.cta.primaryLabel}
                secondaryLabel={content.cta.secondaryLabel}
              />
            )}
            <AnimationPlaceholder label={content.animationPlaceholder} />
          </div>

          {showMedia && content.mediaPlaceholder !== "—" && (
            <div className={cn(isCentered && "w-full max-w-2xl", isStack && "w-full")}>
              {children ?? (
                <MediaPlaceholder label={content.mediaPlaceholder} aspect={mediaAspect} />
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
