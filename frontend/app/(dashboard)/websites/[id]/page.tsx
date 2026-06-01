"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft, Globe, Shield, AlertTriangle, CheckCircle,
    Clock, TrendingUp, FileText, Scan, Settings, Bell,
    Download, Share2, RefreshCw
} from "lucide-react";
import Link from "next/link";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";

const scoreHistory = [
    { date: "Jan 1", score: 72 },
    { date: "Jan 5", score: 75 },
    { date: "Jan 10", score: 78 },
    { date: "Jan 15", score: 82 },
    { date: "Jan 20", score: 80 },
    { date: "Jan 25", score: 85 },
    { date: "Jan 30", score: 87 },
];

const issuesBreakdown = [
    { category: "Cookies", count: 2, color: "var(--accent)" },
    { category: "Privacy", count: 1, color: "var(--danger)" },
    { category: "SSL", count: 0, color: "var(--success)" },
    { category: "Accessibility", count: 3, color: "var(--danger)" },
    { category: "Performance", count: 1, color: "var(--info)" },
];

const recentIssues = [
    {
        id: "1",
        type: "missing_cookie_banner",
        severity: "high",
        title: "Missing Cookie Consent Banner",
        description: "Your website does not display a cookie consent banner, which is required under GDPR.",
        detectedAt: "2 hours ago",
        status: "open",
        autoFixable: true,
    },
    {
        id: "2",
        type: "privacy_policy_outdated",
        severity: "medium",
        title: "Privacy Policy Outdated",
        description: "Your privacy policy was last updated 6 months ago. Consider reviewing for new regulations.",
        detectedAt: "1 day ago",
        status: "open",
        autoFixable: false,
    },
    {
        id: "3",
        type: "alt_text_missing",
        severity: "low",
        title: "Images Missing Alt Text",
        description: "3 images on your homepage are missing alt text, affecting accessibility compliance.",
        detectedAt: "2 days ago",
        status: "in_progress",
        autoFixable: true,
    },
];

export default function WebsiteDetailPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState("overview");
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = async () => {
        setIsScanning(true);
        // Simulate scan
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsScanning(false);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical": return "text-status-error bg-status-error/10";
            case "high": return "text-status-warning bg-status-warning/10";
            case "medium": return "text-status-warning bg-status-warning/10";
            default: return "text-status-success bg-status-success/10";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "open": return <AlertTriangle className="w-4 h-4 text-status-warning" />;
            case "in_progress": return <Clock className="w-4 h-4 text-primary" />;
            case "resolved": return <CheckCircle className="w-4 h-4 text-status-success" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Breadcrumb + Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/websites"
                        className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-text-tertiary" />
                    </Link>
                    <div>
                        <h1 className="text-display-3 font-display text-text-primary">
                            Acme Main Site
                        </h1>
                        <a
                            href="https://acme.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-text-tertiary hover:text-primary flex items-center gap-1 transition-colors"
                        >
                            <Globe className="w-3 h-3" />
                            https://acme.com
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all duration-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
                        {isScanning ? "Scanning..." : "Scan Now"}
                    </button>
                    <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-text-tertiary" />
                    </button>
                    <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-text-tertiary" />
                    </button>
                </div>
            </div>

            {/* Score Overview */}
            <div className="glass-card rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Score Circle */}
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                fill="none"
                                stroke="var(--bg-secondary)"
                                strokeWidth="12"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                fill="none"
                                stroke="url(#scoreGradient)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 70}`}
                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - 87 / 100)}`}
                                className="transition-all duration-1000"
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--accent)" />
                                    <stop offset="100%" stopColor="var(--success)" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-text-primary">87</span>
                            <span className="text-sm text-text-tertiary">/100</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "Issues", value: "6", change: "-2", trend: "down" },
                            { label: "Last Scan", value: "2m ago", change: "Auto", trend: "stable" },
                            { label: "Uptime", value: "99.9%", change: "+0.1%", trend: "up" },
                            { label: "Next Scan", value: "22h", change: "Scheduled", trend: "stable" },
                        ].map((stat) => (
                            <div key={stat.label} className="p-4 rounded-xl bg-background-tertiary/50">
                                <p className="text-sm text-text-tertiary mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                                <p className={`text-caption mt-1 ${stat.trend === "up" ? "text-status-success" :
                                        stat.trend === "down" ? "text-status-success" :
                                            "text-text-tertiary"
                                    }`}>
                                    {stat.change}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-background-tertiary/50 rounded-xl w-fit">
                {[
                    { id: "overview", label: "Overview", icon: Shield },
                    { id: "issues", label: "Issues", icon: AlertTriangle },
                    { id: "history", label: "History", icon: Clock },
                    { id: "settings", label: "Settings", icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? "bg-primary/10 text-primary"
                                : "text-text-tertiary hover:text-text-secondary"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Score Trend Chart */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-heading-3">Score Trend</h3>
                            <div className="flex items-center gap-2 text-status-success text-sm">
                                <TrendingUp className="w-4 h-4" />
                                +15% this month
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={scoreHistory}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-secondary)" />
                                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--bg-secondary)",
                                        border: "1px solid var(--border-light)",
                                        borderRadius: "12px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="var(--accent)"
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Issues Breakdown */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-h3 mb-6">Issues by Category</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={issuesBreakdown} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-secondary)" />
                                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis dataKey="category" type="category" stroke="var(--text-muted)" fontSize={12} width={80} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--bg-secondary)",
                                        border: "1px solid var(--border-light)",
                                        borderRadius: "12px",
                                    }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {issuesBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {activeTab === "issues" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {recentIssues.map((issue) => (
                        <div
                            key={issue.id}
                            className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(issue.severity)}`}>
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-semibold text-text-primary">{issue.title}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${getSeverityColor(issue.severity)}`}>
                                                {issue.severity}
                                            </span>
                                            {issue.autoFixable && (
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-caption font-medium">
                                                    Auto-fixable
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-secondary mb-2">{issue.description}</p>
                                        <div className="flex items-center gap-4 text-caption text-text-tertiary">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {issue.detectedAt}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                {getStatusIcon(issue.status)}
                                                {issue.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {issue.autoFixable && (
                                        <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-all duration-200">
                                            Auto-Fix
                                        </button>
                                    )}
                                    <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                                        <FileText className="w-4 h-4 text-text-tertiary" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}

            {activeTab === "history" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl overflow-hidden"
                >
                    <table className="w-full">
                        <thead className="bg-background-tertiary/50">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-text-tertiary">Date</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-text-tertiary">Score</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-text-tertiary">Issues</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-text-tertiary">Changes</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-text-tertiary">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {scoreHistory.map((entry, i) => (
                                <tr key={i} className="hover:bg-background-tertiary/30 transition-colors">
                                    <td className="px-6 py-4 text-sm text-text-secondary">{entry.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${entry.score >= 80 ? "bg-status-success/10 text-status-success" :
                                                entry.score >= 60 ? "bg-status-warning/10 text-status-warning" :
                                                    "bg-status-error/10 text-status-error"
                                            }`}>
                                            {entry.score}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-tertiary">{Math.floor(Math.random() * 10)} issues</td>
                                    <td className="px-6 py-4 text-sm text-text-tertiary">
                                        {i > 0 ? (
                                            <span className={entry.score > scoreHistory[i - 1].score ? "text-status-success" : "text-status-error"}>
                                                {entry.score > scoreHistory[i - 1].score ? "+" : ""}
                                                {entry.score - scoreHistory[i - 1].score}
                                            </span>
                                        ) : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                                                <Download className="w-4 h-4 text-text-tertiary" />
                                            </button>
                                            <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                                                <Share2 className="w-4 h-4 text-text-tertiary" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {activeTab === "settings" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 space-y-8"
                >
                    <div>
                        <h3 className="text-heading-3 mb-6">Monitoring Settings</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary/30">
                                <div>
                                    <p className="font-medium text-text-primary">24/7 Guardian</p>
                                    <p className="text-sm text-text-tertiary">Continuous compliance monitoring</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-border-medium peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary/30">
                                <div>
                                    <p className="font-medium text-text-primary">Scan Frequency</p>
                                    <p className="text-sm text-text-tertiary">How often to run compliance scans</p>
                                </div>
                                <select className="bg-background-tertiary border border-border-medium rounded-lg px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary/50">
                                    <option>Every hour</option>
                                    <option selected>Every 6 hours</option>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary/30">
                                <div>
                                    <p className="font-medium text-text-primary">Alert Threshold</p>
                                    <p className="text-sm text-text-tertiary">Notify when score drops below</p>
                                </div>
                                <select className="bg-background-tertiary border border-border-medium rounded-lg px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary/50">
                                    <option>60</option>
                                    <option selected>70</option>
                                    <option>80</option>
                                    <option>90</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border-light">
                        <h3 className="text-heading-3 mb-6 text-status-error">Danger Zone</h3>
                        <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-status-error">Remove Website</p>
                                    <p className="text-sm text-text-tertiary">This will delete all scan history and data</p>
                                </div>
                                <button className="px-4 py-2 bg-status-error/20 hover:bg-status-error/30 text-status-error rounded-lg text-sm font-medium transition-all duration-200">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}