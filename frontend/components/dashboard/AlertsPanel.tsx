"use client";

import { motion } from "framer-motion";
import { Bell, AlertTriangle, CheckCircle, Info, ArrowRight, Zap, ShieldAlert } from "lucide-react";
import Link from "next/link";

const alerts = [
    {
        id: "1",
        type: "warning",
        title: "SSL Protocol Alert",
        message: "shop.acme.com certificate expires in 7 days",
        time: "1 hour ago",
    },
    {
        id: "2",
        type: "success",
        title: "Autonomous Resolution",
        message: "Cookie banner fixed on blog.acme.com",
        time: "3 hours ago",
    },
    {
        id: "3",
        type: "info",
        title: "Market Intelligence",
        message: "competitor-a.com score dropped to 72",
        time: "5 hours ago",
    },
];

export default function AlertsPanel() {
    const getIcon = (type: string) => {
        switch (type) {
            case "warning": return <ShieldAlert className="w-5 h-5 text-amber-600" />;
            case "success": return <CheckCircle className="w-5 h-5 text-emerald-600" />;
            default: return <Info className="w-5 h-5 text-brand-600" />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case "warning": return "bg-amber-500/10 border-amber-100 text-amber-600";
            case "success": return "bg-emerald-500/10 border-emerald-100 text-emerald-600";
            default: return "bg-brand-500/10 border-brand-100 text-brand-600";
        }
    };

    return (
        <div className="premium-card p-8 flex flex-col h-full bg-white/40 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-heading-3 font-display font-bold text-slate-900 leading-none">Security Feed</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Active Notifications</p>
                    </div>
                </div>
                <div className="relative">
                    <span className="px-3 py-1.5 bg-brand-500/10 text-brand-600 border border-brand-100 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        {alerts.length} Pending
                    </span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-white animate-ping" />
                </div>
            </div>

            <div className="flex-1 space-y-4">
                {alerts.map((alert, index) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-500 hover:shadow-card hover:bg-white ${getColors(alert.type)}`}
                    >
                        <div className="mt-0.5 p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                            {getIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-bold text-slate-900 truncate">{alert.title}</p>
                                <span className="text-[10px] font-medium text-slate-400">{alert.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed truncate group-hover:text-slate-700 transition-colors">
                                {alert.message}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Link
                href="/dashboard/monitoring"
                className="mt-8 flex items-center justify-center gap-3 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 uppercase tracking-widest hover:bg-slate-100 hover:border-slate-200 transition-all duration-500 group"
            >
                Intelligence Archive
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
