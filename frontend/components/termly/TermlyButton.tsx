import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const termlyButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] px-5 py-3 text-[14px] font-bold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-surface-gradient text-white shadow-all-2 hover:-translate-y-0.5 hover:shadow-all-lift active:scale-[0.97] active:translate-y-0",
        secondary:
          "bg-all-surface text-white shadow-all-2 hover:-translate-y-0.5 hover:shadow-all-lift active:scale-[0.97] active:translate-y-0",
        secondarySolid:
          "bg-all-surface-muted text-white shadow-all-2 hover:-translate-y-0.5 hover:shadow-all-lift active:scale-[0.97] active:translate-y-0",
        outline:
          "border border-all-surface bg-transparent text-all-surface hover:bg-accent-bg-dim active:bg-accent-bg",
        ghost:
          "bg-transparent text-all-text hover:bg-accent-bg-dim active:bg-accent-bg",
        link: "h-auto p-0 text-accent-text underline-offset-4 hover:underline",
      },
      size: {
        default: "px-5 py-3",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface TermlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof termlyButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const TermlyButton = React.forwardRef<HTMLButtonElement, TermlyButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(termlyButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
            <span className="text-sm">Loading…</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
TermlyButton.displayName = "TermlyButton";

export { TermlyButton, termlyButtonVariants };
