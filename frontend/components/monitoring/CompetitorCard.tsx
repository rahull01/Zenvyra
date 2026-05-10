"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown, Minus, ExternalLink, BarChart3 } from "lucide-react";
import Link from "next/link";

interface CompetitorCardProps {
    competitor: {
        id: string;
        name: string;
        url: string;
        score: number;
        previousScore: number;
        industry: string;
        lastScan: string;
        metrics: {
            privacy: number;
            cookies: number;
            ssl: number;
            accessibility: number;
            performance: number;
        };
    };
}

export default function CompetitorCard({ competitor }: CompetitorCardProps) {
    const trend = competitor.score - competitor.previousScore;
    const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    const trendColor = trend > 0 ? "text-success" : trend < 0 ? "text-error" : "text-surface-500";

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-success";
        if (score >= 60) return "text-warning";
        return "text-error";
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-800 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-surface-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-surface-100">{competitor.name}</h4>
                        <p className="text-xs text-surface-500">{competitor.industry}</p>
                    </div>
                </div>
                <a
                    href={competitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                >
                    <ExternalLink className="w-4 h-4 text-surface-400" />
                </a>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 mb-6">
                <div className={`text-4xl font-bold ${getScoreColor(competitor.score)}`}>
                    {competitor.score}
                </div>
                <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{trend > 0 ? "+" : ""}{trend}</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3 mb-4">
                {Object.entries(competitor.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                        <span className="text-xs text-surface-500 capitalize w-24">{key}</span>
                        <div className="flex-1 h-2 bg-surface-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full rounded-full ${value >= 80 ? "bg-success" :
                                        value >= 60 ? "bg-warning" :
                                            "bg-error"
                                    }`}
                            />
                        </div>
                        <span className="text-xs text-surface-400 w-8 text-right">{value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-surface-800/50">
                <span className="text-xs text-surface-500">
                    Last scan: {competitor.lastScan}
                </span>
                <Link
                    href={`/competitors/${competitor.id}`}
                    className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
                >
                    <BarChart3 className="w-4 h-4" />
                    Details
                </Link>
            </div>
        </motion.div>
    );
}