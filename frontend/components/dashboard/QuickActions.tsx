"use client";

import { motion } from "framer-motion";
import {
    Scan, FileText, Globe, Users,
    ArrowRight, Sparkles, Plus, Zap, Cpu
} from "lucide-react";
import Link from "next/link";

const actions = [
    {
        label: "AI System Inventory",
        description: "Catalog AI features, models, and users to assess EU AI Act risk",
        icon: Cpu,
        href: "/dashboard/ai-act",
        color: "text-accent",
        glow: "bg-accent/10",
    },
    {
        label: "Risk Assessment",
        description: "Classify systems and identify compliance gaps",
        icon: Zap,
        href: "/dashboard/ai-act",
        color: "text-brand-600",
        glow: "bg-brand-500/10",
    },
    {
        label: "Compliance Scan",
        description: "Website scan for privacy, cookies, and AI transparency",
        icon: Scan,
        href: "/dashboard/scanner",
        color: "text-emerald-600",
        glow: "bg-emerald-500/10",
    },
    {
        label: "Generate Notices",
        description: "Create required AI Act transparency documents",
        icon: FileText,
        href: "/dashboard/policies",
        color: "text-amber-500",
        glow: "bg-amber-500/10",
    },
];

export default function QuickActions() {
    return (
        <div className="premium-card p-8 h-full bg-white/40 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-heading-3 font-display font-bold text-slate-900 leading-none">System Actions</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Core Operations</p>
                    </div>
                </div>
                <div className="p-2 bg-brand-50 rounded-xl">
                    <Sparkles className="w-5 h-5 text-brand-500 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            href={action.href}
                            className="group relative flex flex-col items-start gap-4 p-6 rounded-3xl bg-white border border-slate-100 hover:shadow-premium hover:-translate-y-1.5 hover:border-brand-500/10 transition-all duration-500 overflow-hidden"
                        >
                            {/* Hover Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className={`relative z-10 w-12 h-12 rounded-2xl ${action.glow} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                <action.icon className={`w-6 h-6 ${action.color}`} />
                            </div>
                            
                            <div className="relative z-10 flex-1">
                                <p className="text-sm font-black text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
                                    {action.label}
                                </p>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed group-hover:text-slate-500 transition-colors">
                                    {action.description}
                                </p>
                            </div>
                            
                            <div className="relative z-10 mt-2 flex items-center gap-2 text-[10px] font-black text-brand-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                                Execute
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-slate-900 rounded-2xl flex items-center justify-between group cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-[0.2em]">New Protocol</span>
                </div>
                <ArrowRight className="relative z-10 w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            </div>
        </div>
    );
}