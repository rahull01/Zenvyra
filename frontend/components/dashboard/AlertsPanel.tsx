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
            case "warning": return <ShieldAlert className="w-5 h-5 text-accent" />;
            case "success": return <CheckCircle className="w-5 h-5 text-success" />;
            default: return <Info className="w-5 h-5 text-info" />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case "warning": return "bg-accent/5 border-accent/10 text-accent";
            case "success": return "bg-success/5 border-success/10 text-success";
            default: return "bg-info/5 border-info/10 text-info";
        }
    };

    return (
        <div className="rounded-[2rem] p-8 flex flex-col h-full bg-bg-secondary border border-bg-tertiary shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bg-primary border border-bg-tertiary flex items-center justify-center shadow-lg">
                        <Bell className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary leading-none">Security Feed</h3>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-2">Active Notifications</p>
                    </div>
                </div>
                <div className="relative">
                    <span className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {alerts.length} Pending
                    </span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-bg-secondary animate-ping" />
                </div>
            </div>

            <div className="flex-1 space-y-4 relative z-10">
                {alerts.map((alert, index) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-500 hover:border-accent/30 ${getColors(alert.type)}`}
                    >
                        <div className="mt-0.5 p-2 bg-bg-primary rounded-xl border border-bg-tertiary shadow-sm group-hover:scale-110 transition-transform duration-500">
                            {getIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-bold text-text-primary truncate">{alert.title}</p>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{alert.time}</span>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed truncate group-hover:text-text-primary transition-colors">
                                {alert.message}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Link
                href="/dashboard/monitoring"
                className="mt-8 flex items-center justify-center gap-3 py-4 bg-bg-primary border border-bg-tertiary rounded-2xl text-[10px] font-black text-text-primary uppercase tracking-[0.25em] hover:bg-bg-secondary hover:border-accent/40 transition-all duration-500 group relative z-10"
            >
                Intelligence Archive
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent" />
            </Link>
        </div>
    );
}
