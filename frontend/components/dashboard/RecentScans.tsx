"use client";

import { motion } from "framer-motion";
import { Globe, ArrowRight, CheckCircle, AlertTriangle, Clock, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

const recentScans = [
    {
        id: "1",
        url: "https://northline.app",
        score: 91,
        issues: 2,
        status: "completed",
        scannedAt: "4 min ago",
    },
    {
        id: "2",
        url: "https://api.northline.app",
        score: 84,
        issues: 5,
        status: "completed",
        scannedAt: "38 min ago",
    },
    {
        id: "3",
        url: "https://docs.northline.app",
        score: 88,
        issues: 3,
        status: "completed",
        scannedAt: "2 hours ago",
    },
    {
        id: "4",
        url: "https://checkout.northline.app",
        score: 76,
        issues: 7,
        status: "completed",
        scannedAt: "5 hours ago",
    },
];

export default function RecentScans() {
    const getScoreStyles = (score: number) => {
        if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-100";
        if (score >= 80) return "text-brand-600 bg-brand-50 border-brand-100";
        if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-100";
        return "text-red-600 bg-red-50 border-red-100";
    };

    return (
        <div className="premium-card p-8 h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-heading-3 font-display font-bold text-slate-900 leading-none">Diagnostic Log</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Historical Scans</p>
                    </div>
                </div>
                <Link
                    href="/scan"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all duration-500"
                >
                    Registry
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="space-y-4">
                {recentScans.map((scan, index) => (
                    <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex items-center gap-5 p-5 rounded-2xl bg-white border border-slate-100 hover:shadow-premium hover:-translate-y-1 hover:border-brand-500/10 transition-all duration-500 cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                            <Globe className="w-6 h-6 text-slate-400 group-hover:text-brand-600 transition-colors" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{scan.url}</p>
                                <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {scan.scannedAt}
                                </span>
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md">
                                    {scan.issues} Deviations
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <div className={`px-4 py-1.5 rounded-full text-xs font-black border ${getScoreStyles(scan.score)}`}>
                                {scan.score}%
                            </div>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Protocol</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Active Monitoring Enabled</span>
                    <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
