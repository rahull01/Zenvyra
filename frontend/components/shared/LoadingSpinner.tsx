"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    fullScreen?: boolean;
}

export default function LoadingSpinner({
    size = "md",
    text = "Loading...",
    fullScreen = false
}: LoadingSpinnerProps) {
    const sizes = {
        sm: { container: "w-8 h-8", icon: "w-4 h-4" },
        md: { container: "w-12 h-12", icon: "w-6 h-6" },
        lg: { container: "w-20 h-20", icon: "w-10 h-10" },
    };

    const s = sizes[size];

    const spinner = (
        <div className="flex flex-col items-center gap-4">
            <div className={`relative ${s.container}`}>
                <motion.div
                    className="absolute inset-0 border-4 border-surface-800 rounded-full"
                />
                <motion.div
                    className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-0 border-4 border-accent/30 rounded-full border-b-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className={`${s.icon} text-brand-400`} />
                </div>
            </div>
            {text && <p className="text-sm text-surface-500 animate-pulse">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-surface-950/90 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}