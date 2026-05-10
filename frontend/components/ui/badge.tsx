import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-brand-500/20 text-brand-400 hover:bg-brand-500/30",
                secondary:
                    "border-transparent bg-surface-800 text-surface-400 hover:bg-surface-700",
                destructive:
                    "border-transparent bg-error/20 text-error hover:bg-error/30",
                outline: "text-surface-400 border-surface-700",
                success:
                    "border-transparent bg-success/20 text-success hover:bg-success/30",
                warning:
                    "border-transparent bg-warning/20 text-warning hover:bg-warning/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }