import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white px-7 py-3.5 text-base rounded-lg shadow-button hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-0 active:shadow-button",
        secondary:
          "bg-transparent border border-border-light text-text-primary px-7 py-3.5 text-base rounded-lg hover:bg-background-secondary hover:border-border-medium hover:-translate-y-0.5 active:bg-background-tertiary",
        outline:
          "bg-transparent border border-border-light text-text-primary px-7 py-3.5 text-base rounded-lg hover:bg-background-secondary hover:border-border-medium hover:-translate-y-0.5 active:bg-background-tertiary",
        ghost: "bg-transparent text-primary px-5 py-3 text-base rounded-lg hover:bg-primary-light hover:-translate-y-0.5",
        destructive: "bg-status-error text-white px-7 py-3.5 text-base rounded-lg hover:bg-red-600",
        link: "h-auto p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-7 py-3.5 text-base rounded-lg",
        sm: "px-4 py-2 text-sm rounded-md",
        lg: "px-8 py-4 text-lg rounded-xl",
        icon: "h-10 w-10 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
