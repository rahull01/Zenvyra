import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-1 text-caption font-semibold transition-colors focus:outline-none",
    {
        variants: {
            variant: {
                default:
                    "bg-primary-light text-primary",
                secondary:
                    "bg-background-tertiary text-text-secondary",
                destructive:
                    "bg-status-error-light text-status-error border border-status-error",
                outline: "border border-border-light text-text-secondary",
                success:
                    "bg-status-success-light text-status-success border border-status-success",
                warning:
                    "bg-status-warning-light text-status-warning border border-status-warning",
                info:
                    "bg-status-info-light text-status-info border border-status-info",
                pending:
                    "bg-status-info-light text-status-info border border-status-info",
                draft:
                    "bg-status-warning-light text-status-warning border border-status-warning",
                expired:
                    "bg-status-error-light text-status-error border border-status-error",
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