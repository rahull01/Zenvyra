"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreDisplayProps {
    score: number;
    previousScore?: number;
    size?: "sm" | "md" | "lg";
}

export default function ScoreDisplay({ score, previousScore, size = "lg" }: ScoreDisplayProps) {
    const getScoreColor = (s: number) => {
        if (s >= 80) return { stroke: "var(--success)", text: "text-success", bg: "bg-success/20" };
        if (s >= 60) return { stroke: "var(--warning)", text: "text-warning", bg: "bg-warning/20" };
        return { stroke: "var(--danger)", text: "text-error", bg: "bg-error/20" };
    };

    const getScoreLabel = (s: number) => {
        if (s >= 90) return "Excellent";
        if (s >= 80) return "Good";
        if (s >= 60) return "Needs Work";
        return "Critical";
    };

    const colors = getScoreColor(score);
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference * (1 - score / 100);

    const sizeClasses = {
        sm: { container: "w-20 h-20", text: "text-2xl", label: "text-xs" },
        md: { container: "w-28 h-28", text: "text-3xl", label: "text-sm" },
        lg: { container: "w-40 h-40", text: "text-5xl", label: "text-base" },
    };

    const classes = sizeClasses[size];

    const trend = previousScore !== undefined ? score - previousScore : 0;

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${classes.container}`}>
                <svg className="w-full h-full -rotate-90">
                    <defs>
                        <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.stroke} />
                            <stop offset="100%" stopColor={score >= 60 ? "var(--success)" : "var(--danger)"} />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="50%"
                        cy="50%"
                        r="70"
                        fill="none"
                        stroke="var(--bg-tertiary)"
                        strokeWidth="12"
                    />
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="70"
                        fill="none"
                        stroke={`url(#scoreGradient-${score})`}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`${classes.text} font-bold ${colors.text}`}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs text-surface-500">/100</span>
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className={`font-semibold ${colors.text}`}>{getScoreLabel(score)}</p>
                {previousScore !== undefined && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                        {trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                        ) : trend < 0 ? (
                            <TrendingDown className="w-4 h-4 text-error" />
                        ) : (
                            <Minus className="w-4 h-4 text-surface-500" />
                        )}
                        <span className={`text-sm ${trend > 0 ? "text-success" : trend < 0 ? "text-error" : "text-surface-500"
                            }`}>
                            {trend > 0 ? "+" : ""}{trend} from last scan
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}