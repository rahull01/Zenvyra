"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Shield, Activity, Bell, Clock, Globe,
    AlertTriangle, CheckCircle, TrendingUp,
    Pause, Play, Settings, Download
} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

const guardianData = [
    { time: "00:00", status: 1 },
    { time: "04:00", status: 1 },
    { time: "08:00", status: 0.5 },
    { time: "12:00", status: 1 },
    { time: "16:00", status: 1 },
    { time: "20:00", status: 0.8 },
    { time: "24:00", status: 1 },
];

const changeAlerts = [
    {
        id: "1",
        website: "northline.app",
        type: "privacy_policy",
        description: "Privacy policy missing",
        detectedAt: "12 minutes ago",
        severity: "high",
        status: "unread",
    },
    {
        id: "2",
        website: "checkout.northline.app",
        type: "cookie_banner",
        description: "Cookie banner issue detected",
        detectedAt: "47 minutes ago",
        severity: "high",
        status: "unread",
    },
    {
        id: "3",
        website: "docs.northline.app",
        type: "new_tracker",
        description: "New third-party tracker detected before consent",
        detectedAt: "2 hours ago",
        severity: "medium",
        status: "read",
    },
    {
        id: "4",
        website: "northline.app",
        type: "policy_update",
        description: "Privacy page updated without DSAR contact details",
        detectedAt: "4 hours ago",
        severity: "medium",
        status: "read",
    },
];

export default function MonitoringPage() {
    const [guardianActive, setGuardianActive] = useState(true);
    const [selectedWebsite, setSelectedWebsite] = useState("all");
    const [alerts, setAlerts] = useState(changeAlerts);

    const toggleGuardian = () => {
        setGuardianActive(!guardianActive);
        // API call to toggle monitoring
    };

    const markAsRead = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "read" } : a));
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high": return "text-accent bg-accent/20";
            case "medium": return "text-warning bg-warning/20";
            default: return "text-surface-400 bg-surface-800";
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-display-3 font-display text-surface-100 mb-2">
                        24/7 Guardian
                    </h1>
                    <p className="text-surface-400">
                        Continuous monitoring and change detection
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleGuardian}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${guardianActive
                                ? "bg-success/20 text-success"
                                : "bg-surface-800 text-surface-500"
                            }`}
                    >
                        {guardianActive ? (
                            <>
                                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                <Play className="w-4 h-4" />
                                Active
                            </>
                        ) : (
                            <>
                                <Pause className="w-4 h-4" />
                                Paused
                            </>
                        )}
                    </button>
                    <button className="p-2 hover:bg-surface-800 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-surface-400" />
                    </button>
                </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        label: "Uptime",
                        value: "99.9%",
                        icon: Activity,
                        color: "text-success",
                        bg: "bg-success/20",
                    },
                    {
                        label: "Scans Today",
                        value: "1,247",
                        icon: Shield,
                        color: "text-brand-400",
                        bg: "bg-brand-500/20",
                    },
                    {
                        label: "Changes Detected",
                        value: "3",
                        icon: Bell,
                        color: "text-warning",
                        bg: "bg-warning/20",
                    },
                    {
                        label: "Avg Response Time",
                        value: "234ms",
                        icon: Clock,
                        color: "text-surface-400",
                        bg: "bg-surface-800",
                    },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-surface-100 mb-1">{stat.value}</p>
                        <p className="text-sm text-surface-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Guardian Status Chart */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-heading-3 mb-1">Guardian Status</h3>
                        <p className="text-sm text-surface-500">24-hour monitoring status</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-sm text-success">
                            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            Operational
                        </span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={guardianData}>
                        <defs>
                            <linearGradient id="guardianGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                border: "1px solid #1e293b",
                                borderRadius: "12px",
                            }}
                        />
                        <Area
                            type="step"
                            dataKey="status"
                            stroke="#10b981"
                            fill="url(#guardianGradient)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Change Alerts */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-heading-3 mb-1">Change Alerts</h3>
                        <p className="text-sm text-surface-500">
                            {alerts.filter(a => a.status === "unread").length} unread alerts
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedWebsite}
                            onChange={(e) => setSelectedWebsite(e.target.value)}
                            className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-surface-300 focus:outline-none"
                        >
                            <option value="all">All Websites</option>
                            <option value="acme.com">acme.com</option>
                            <option value="shop.acme.com">shop.acme.com</option>
                            <option value="blog.acme.com">blog.acme.com</option>
                        </select>
                        <button className="p-2 hover:bg-surface-800 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-surface-400" />
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${alert.status === "unread"
                                    ? "bg-brand-500/5 border border-brand-500/20"
                                    : "bg-surface-800/30 border border-transparent"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(alert.severity)}`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-medium text-surface-200">{alert.description}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-surface-500">
                                    <span className="flex items-center gap-1">
                                        <Globe className="w-3 h-3" />
                                        {alert.website}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {alert.detectedAt}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Activity className="w-3 h-3" />
                                        {alert.type}
                                    </span>
                                </div>
                            </div>
                            {alert.status === "unread" && (
                                <button
                                    onClick={() => markAsRead(alert.id)}
                                    className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                    title="Mark as read"
                                >
                                    <CheckCircle className="w-5 h-5 text-surface-400 hover:text-success transition-colors" />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Monitored Websites */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-heading-3 mb-6">Monitored Websites</h3>
                <div className="space-y-4">
                    {[
                        { name: "acme.com", url: "https://acme.com", status: "active", lastCheck: "2 min ago", score: 87 },
                        { name: "shop.acme.com", url: "https://shop.acme.com", status: "active", lastCheck: "5 min ago", score: 64 },
                        { name: "blog.acme.com", url: "https://blog.acme.com", status: "active", lastCheck: "10 min ago", score: 92 },
                    ].map((site) => (
                        <div
                            key={site.name}
                            className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30 hover:bg-surface-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-brand-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-surface-200">{site.name}</p>
                                    <p className="text-sm text-surface-500">{site.lastCheck}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${site.score >= 80 ? "text-success" :
                                            site.score >= 60 ? "text-warning" :
                                                "text-error"
                                        }`}>
                                        {site.score}
                                    </p>
                                    <p className="text-xs text-surface-500">Score</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1 px-3 py-1 bg-success/20 text-success rounded-full text-xs font-medium">
                                        <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                                        {site.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
