"use client";

import { motion } from "framer-motion";
import {
    Shield, Globe, FileText, AlertTriangle,
    TrendingUp, TrendingDown, Minus, Zap,
    ArrowUpRight, Activity, ShieldCheck, Lock
} from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import ComplianceChart from "@/components/dashboard/ComplianceChart";
import RecentScans from "@/components/dashboard/RecentScans";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import QuickActions from "@/components/dashboard/QuickActions";
import ComplianceScore from "@/components/dashboard/ComplianceScore";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            {/* Premium Hero Section */}
            <motion.div 
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 backdrop-blur-xl p-8 sm:p-12 shadow-premium"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 rounded-full mb-6">
                            <Zap className="w-4 h-4 text-brand-600" />
                            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">Real-time Analysis</span>
                        </div>
                        <h1 className="text-display-2 font-display font-extrabold text-slate-900 mb-6 leading-tight">
                            Global Compliance <br/> 
                            <span className="text-brand-600">Overview</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Your enterprise-grade compliance engine is actively monitoring 12 global regions. 
                            Security protocols are operating at peak efficiency.
                        </p>
                        
                        <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <button className="premium-button">
                                Run Deep Scan
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                            <button className="secondary-button">
                                View Full Report
                            </button>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <ComplianceScore score={88} />
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <StatsCards />
            </motion.div>

            {/* Main Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Intelligence */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <div className="premium-card p-8 group">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-heading-3 font-display font-bold text-slate-900 mb-1">Compliance Performance</h2>
                                <p className="text-sm text-slate-400 font-medium">Global trend analysis over 30 days</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                <Activity className="w-4 h-4 text-brand-500" />
                                <span className="text-xs font-bold text-slate-500 tracking-wide">Live Stream</span>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            <ComplianceChart />
                        </div>
                    </div>
                </motion.div>

                {/* Critical Alerts */}
                <motion.div variants={itemVariants}>
                    <AlertsPanel />
                </motion.div>
            </div>

            {/* Insights & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                <motion.div variants={itemVariants}>
                    <RecentScans />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <QuickActions />
                </motion.div>
            </div>
        </motion.div>
    );
}