"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import Link from "next/link";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    animated?: boolean;
}

export default function Logo({ size = "md", showText = true, animated = true }: LogoProps) {
    const sizes = {
        sm: { icon: 8, text: "text-lg" },
        md: { icon: 10, text: "text-xl" },
        lg: { icon: 14, text: "text-2xl" },
    };

    const s = sizes[size];

    const LogoContent = (
        <div className="flex items-center gap-3">
            <motion.div
                animate={animated ? {
                    rotate: [0, 5, -5, 0],
                } : {}}
                transition={animated ? {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                } : {}}
                className={`w-${s.icon} h-${s.icon} rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow`}
            >
                <Shield className={`w-${s.icon === 8 ? 5 : s.icon === 10 ? 6 : 8} h-${s.icon === 8 ? 5 : s.icon === 10 ? 6 : 8} text-white`} />
            </motion.div>
            {showText && (
                <div>
                    <span className={`${s.text} font-display font-bold text-surface-100`}>
                        Zenvyra
                    </span>
                    <span className="ml-1.5 text-[10px] text-brand-400 font-medium tracking-wider uppercase">
                        Pro
                    </span>
                </div>
            )}
        </div>
    );

    if (showText) {
        return <Link href="/" className="inline-flex">{LogoContent}</Link>;
    }

    return LogoContent;
}