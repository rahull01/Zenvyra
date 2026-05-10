"use client";

import { motion } from "framer-motion";
import {
    Globe, FileText, Lock, Code, AlertTriangle,
    CheckCircle, Clock, ExternalLink, Bell
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChangeAlert {
    id: string;
    website: string;
    type: "content" | "script" | "ssl" | "policy";
    title: string;
    description: string;
    detectedAt: string;
    severity: "critical" | "warning" | "info";
    status: "new" | "acknowledged" | "resolved";
    diff?: string;
}

const mockAlerts: ChangeAlert[] = [
    {
        id: "1",
        website: "acme.com",
        type: "script",
        title: "New Third-Party Script",
        description: "analytics-new.js was added to homepage",
        detectedAt: "5 minutes ago",
        severity: "warning",
        status: "new",
    },
    {
        id: "2",
        website: "shop.acme.com",
        type: "ssl",
        title: "SSL Certificate Change",
        description: "Certificate renewed with new issuer",
        detectedAt: "1 hour ago",
        severity: "info",
        status: "acknowledged",
    },
    {
        id: "3",
        website: "acme.com",
        type: "policy",
        title: "Privacy Policy Updated",
        description: "Privacy policy content changed by 23%",
        detectedAt: "3 hours ago",
        severity: "critical",
        status: "new",
    },
];

const typeIcons = {
    content: FileText,
    script: Code,
    ssl: Lock,
    policy: FileText,
};

const severityConfig = {
    critical: { color: "text-error bg-error/20", dot: "bg-error" },
    warning: { color: "text-warning bg-warning/20", dot: "bg-warning" },
    info: { color: "text-brand-400 bg-brand-500/20", dot: "bg-brand-400" },
};

export default function ChangeAlerts() {
    const [alerts, setAlerts] = useState<ChangeAlert[]>(mockAlerts);
    const [filter, setFilter] = useState<"all" | "new" | "acknowledged">("all");

    const acknowledgeAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "acknowledged" } : a));
        toast.success("Alert acknowledged");
    };

    const resolveAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" } : a));
        toast.success("Alert resolved");
    };

    const filteredAlerts = alerts.filter(a => filter === "all" || a.status === filter);

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-heading-3">Change Alerts</h3>
                        <p className="text-sm text-surface-500">
                            {alerts.filter(a => a.status === "new").length} unacknowledged
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {(["all", "new", "acknowledged"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f
                                    ? "bg-brand-500/20 text-brand-400"
                                    : "text-surface-500 hover:bg-surface-800"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filteredAlerts.map((alert, index) => {
                    const Icon = typeIcons[alert.type];
                    const sev = severityConfig[alert.severity];

                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-xl border transition-all ${alert.status === "new"
                                    ? "bg-brand-500/5 border-brand-500/20"
                                    : "bg-surface-800/30 border-transparent"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-lg ${sev.color} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-medium text-surface-200">{alert.title}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sev.color}`}>
                                            {alert.severity}
                                        </span>
                                        {alert.status === "new" && (
                                            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-sm text-surface-400 mb-2">{alert.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-surface-500">
                                        <span className="flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            {alert.website}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {alert.detectedAt}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {alert.status === "new" && (
                                        <button
                                            onClick={() => acknowledgeAlert(alert.id)}
                                            className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                            title="Acknowledge"
                                        >
                                            <CheckCircle className="w-4 h-4 text-surface-400 hover:text-success" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => resolveAlert(alert.id)}
                                        className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                        title="Resolve"
                                    >
                                        <ExternalLink className="w-4 h-4 text-surface-400" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}