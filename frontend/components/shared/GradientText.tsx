"use client";

import { ReactNode } from "react";

interface GradientTextProps {
    children: ReactNode;
    className?: string;
    variant?: "brand" | "accent" | "success" | "multi";
}

export default function GradientText({
    children,
    className = "",
    variant = "brand"
}: GradientTextProps) {
    const gradients = {
        brand: "from-brand-400 via-brand-300 to-brand-500",
        accent: "from-accent via-accent-light to-accent-dark",
        success: "from-success via-emerald-400 to-teal-500",
        multi: "from-brand-400 via-accent to-warning",
    };

    return (
        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${gradients[variant]} ${className}`}>
            {children}
        </span>
    );
}