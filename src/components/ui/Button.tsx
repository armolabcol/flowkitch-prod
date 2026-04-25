import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-kitch-accent text-white shadow-[0_0_24px_rgba(230,57,70,0.25)] hover:bg-[#ff4d5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kitch-accent",
  secondary:
    "border border-kitch-border bg-kitch-elevated text-kitch-fg hover:border-kitch-accent/40 hover:bg-kitch-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
  ghost:
    "text-kitch-muted hover:text-kitch-fg hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30",
};

const sizeClass = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm font-medium rounded-xl",
  lg: "h-12 px-6 text-base font-medium rounded-xl",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizeClass;
  asChild?: boolean;
  children?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      asChild,
      children,
      ...props
    },
    ref,
  ) {
    const composed = cn(
      "inline-flex items-center justify-center gap-2 transition-colors disabled:pointer-events-none disabled:opacity-50",
      variantClass[variant],
      sizeClass[size],
      className,
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<{ className?: string }>, {
        className: cn(composed, (children as ReactElement<{ className?: string }>).props.className),
      });
    }

    return (
      <button ref={ref} type={type} className={composed} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
