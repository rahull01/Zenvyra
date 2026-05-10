"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface ComplianceScoreProps {
    score: number;
}

export default function ComplianceScore({ score = 88 }: ComplianceScoreProps) {
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center py-12">
            {/* Background Glows */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-brand-500/20 blur-[100px] animate-pulse" />
                <div className="absolute w-48 h-48 bg-accent-500/10 blur-[80px] translate-x-12 -translate-y-12" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* SVG Circular Progress */}
                <div className="relative w-64 h-64">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="128"
                            cy="128"
                            r="90"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-100"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="128"
                            cy="128"
                            r="90"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            fill="transparent"
                            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Inner Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-6xl font-display font-bold text-slate-900 leading-none">
                                {score}%
                            </span>
                            <span className="text-sm font-bold text-brand-600 uppercase tracking-widest mt-2">
                                Secure
                            </span>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="mt-8 flex items-center gap-3 px-6 py-2.5 bg-white shadow-card border border-slate-100 rounded-full"
                >
                    <Shield className="w-4 h-4 text-brand-600" />
                    <span className="text-sm font-semibold text-slate-600">Enterprise Protocol Active</span>
                </motion.div>
            </div>
        </div>
    );
}
