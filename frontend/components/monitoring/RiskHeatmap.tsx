"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Shield, Info } from "lucide-react";
import { useState } from "react";

interface RiskItem {
    id: string;
    website: string;
    category: string;
    risk: "low" | "medium" | "high" | "critical";
    impact: string;
    probability: number;
    lastChecked: string;
}

const mockRisks: RiskItem[] = [
    { id: "1", website: "acme.com", category: "GDPR", risk: "medium", impact: "Cookie banner missing", probability: 75, lastChecked: "2h ago" },
    { id: "2", website: "shop.acme.com", category: "CCPA", risk: "high", impact: "Opt-out link broken", probability: 90, lastChecked: "1h ago" },
    { id: "3", website: "blog.acme.com", category: "Accessibility", risk: "low", impact: "Alt text missing", probability: 30, lastChecked: "4h ago" },
    { id: "4", website: "acme.com", category: "SSL", risk: "critical", impact: "Certificate expiring", probability: 95, lastChecked: "30m ago" },
    { id: "5", website: "api.acme.com", category: "Privacy", risk: "medium", impact: "Data retention policy", probability: 60, lastChecked: "6h ago" },
];

const riskConfig = {
    low: { color: "bg-success/20 text-success", dot: "bg-success", label: "Low" },
    medium: { color: "bg-warning/20 text-warning", dot: "bg-warning", label: "Medium" },
    high: { color: "bg-accent/20 text-accent", dot: "bg-accent", label: "High" },
    critical: { color: "bg-error/20 text-error", dot: "bg-error", label: "Critical" },
};

export default function RiskHeatmap() {
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    const websites = Array.from(new Set(mockRisks.map(r => r.website)));
    const categories = Array.from(new Set(mockRisks.map(r => r.category)));

    const getRiskForCell = (website: string, category: string) => {
        return mockRisks.find(r => r.website === website && r.category === category);
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-error/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-error" />
                    </div>
                    <div>
                        <h3 className="text-heading-3">Risk Heatmap</h3>
                        <p className="text-sm text-surface-500">Compliance risk by website and category</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {Object.entries(riskConfig).map(([key, config]) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                            <span className="text-xs text-surface-500">{config.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* Header */}
                    <div className="grid grid-cols-[150px_repeat(4,1fr)] gap-2 mb-2">
                        <div className="text-xs text-surface-500 font-medium">Website</div>
                        {categories.map(cat => (
                            <div key={cat} className="text-xs text-surface-500 font-medium text-center">{cat}</div>
                        ))}
                    </div>

                    {/* Rows */}
                    {websites.map((website) => (
                        <div key={website} className="grid grid-cols-[150px_repeat(4,1fr)] gap-2 mb-2">
                            <div className="flex items-center text-sm text-surface-300 font-medium">
                                <Shield className="w-4 h-4 text-surface-500 mr-2" />
                                {website}
                            </div>
                            {categories.map((category) => {
                                const risk = getRiskForCell(website, category);
                                const cellId = `${website}-${category}`;
                                const isHovered = hoveredCell === cellId;

                                return (
                                    <motion.div
                                        key={cellId}
                                        onMouseEnter={() => setHoveredCell(cellId)}
                                        onMouseLeave={() => setHoveredCell(null)}
                                        className={`relative h-16 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${risk ? riskConfig[risk.risk].color : "bg-surface-800/30"
                                            } ${isHovered ? "scale-105 z-10 shadow-lg" : ""}`}
                                    >
                                        {risk ? (
                                            <div className="text-center">
                                                <span className="text-lg font-bold">{risk.probability}%</span>
                                            </div>
                                        ) : (
                                            <span className="text-surface-600">-</span>
                                        )}

                                        {/* Tooltip */}
                                        {isHovered && risk && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 bg-surface-900 border border-surface-700 rounded-xl shadow-xl z-20"
                                            >
                                                <p className="text-sm font-medium text-surface-200 mb-1">{risk.impact}</p>
                                                <p className="text-xs text-surface-500">Probability: {risk.probability}%</p>
                                                <p className="text-xs text-surface-600 mt-1">Checked {risk.lastChecked}</p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 rounded-xl bg-surface-800/30">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-surface-500" />
                    <span className="text-sm font-medium text-surface-400">Risk Calculation</span>
                </div>
                <p className="text-xs text-surface-500">
                    Risk = Impact × Probability. Higher values indicate urgent attention needed.
                    Critical risks (&gt;90%) trigger immediate alerts.
                </p>
            </div>
        </div>
    );
}