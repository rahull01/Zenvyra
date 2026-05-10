"use client";

import { motion } from "framer-motion";
import { Shield, Globe, AlertTriangle, TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";

const stats = [
    {
        label: "Compliance Score",
        value: "89",
        change: "+7",
        trend: "up",
        icon: Shield,
        color: "text-brand-600",
        glow: "bg-brand-500/10",
    },
    {
        label: "Websites Monitored",
        value: "18",
        change: "+3",
        trend: "up",
        icon: Globe,
        color: "text-blue-600",
        glow: "bg-blue-500/10",
    },
    {
        label: "Active Issues",
        value: "14",
        change: "-8",
        trend: "down",
        icon: AlertTriangle,
        color: "text-amber-600",
        glow: "bg-amber-500/10",
    },
    {
        label: "Fix Success Rate",
        value: "93%",
        change: "+4",
        trend: "up",
        icon: TrendingUp,
        color: "text-emerald-600",
        glow: "bg-emerald-500/10",
    },
];

export default function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="premium-card p-8 group cursor-pointer"
                >
                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/5 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl ${stat.glow} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-tight ${
                                stat.trend === "up" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                stat.trend === "down" ? "bg-red-50 text-red-600 border border-red-100" :
                                "bg-slate-50 text-slate-500 border border-slate-100"
                            }`}>
                                {stat.trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> :
                                 stat.trend === "down" ? <TrendingDown className="w-3.5 h-3.5" /> :
                                 <Minus className="w-3.5 h-3.5" />}
                                {stat.change}
                            </div>
                        </div>

                        <div>
                            <p className="text-4xl font-display font-black text-slate-900 mb-2 group-hover:translate-x-1 transition-transform duration-500">
                                {stat.value}
                            </p>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                {stat.label}
                                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-1" />
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
