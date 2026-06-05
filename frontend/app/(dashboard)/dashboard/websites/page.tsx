"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Globe, Shield, AlertTriangle, CheckCircle,
    MoreVertical, ExternalLink, Settings, Trash2
} from "lucide-react";
import Link from "next/link";

interface Website {
    id: string;
    url: string;
    name: string;
    status: "active" | "paused" | "error" | "warning";
    complianceScore: number;
    lastScan: string;
    issues: number;
    monitoring: boolean;
}

const mockWebsites: Website[] = [
    {
        id: "1",
        url: "https://acme.com",
        name: "Acme Main Site",
        status: "active",
        complianceScore: 87,
        lastScan: "2 min ago",
        issues: 3,
        monitoring: true,
    },
    {
        id: "2",
        url: "https://blog.acme.com",
        name: "Acme Blog",
        status: "active",
        complianceScore: 92,
        lastScan: "1 hour ago",
        issues: 1,
        monitoring: true,
    },
    {
        id: "3",
        url: "https://shop.acme.com",
        name: "Acme Shop",
        status: "warning",
        complianceScore: 64,
        lastScan: "5 hours ago",
        issues: 8,
        monitoring: true,
    },
];

export default function WebsitesPage() {
    const [websites, setWebsites] = useState<Website[]>(mockWebsites);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUrl, setNewUrl] = useState("");

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-status-success";
        if (score >= 60) return "text-status-warning";
        return "text-status-error";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-status-success/20";
        if (score >= 60) return "bg-status-warning/20";
        return "bg-status-error/20";
    };

    const handleAddWebsite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUrl) return;

        setShowAddModal(false);
        setNewUrl("");
    };

    const toggleMonitoring = (id: string) => {
        setWebsites(prev => prev.map(w =>
            w.id === id ? { ...w, monitoring: !w.monitoring } : w
        ));
    };

    return (
        <div className="min-h-screen bg-background-primary px-6 py-8 text-text-primary">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-text-primary">Websites</h1>
                        <p className="mt-2 text-sm text-text-secondary">
                            Manage and monitor all your websites
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-sm font-semibold text-white transition hover:from-primary-light hover:to-primary"
                    >
                        <Plus className="h-4 w-4" />
                        Add Website
                    </motion.button>
                </div>

                {/* Websites Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {websites.map((website, index) => (
                        <motion.div
                            key={website.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="rounded-3xl border border-border-light bg-background-secondary p-6 hover:border-primary/30 transition-all duration-300">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-tertiary text-primary">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-primary">{website.name}</h3>
                                            <a
                                                href={website.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
                                            >
                                                {website.url}
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="relative group/menu">
                                        <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                        {/* Dropdown */}
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-background-tertiary border border-border-light rounded-xl shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                                            <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-background-secondary text-sm text-text-secondary transition-colors">
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-background-secondary text-sm text-status-error transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${getScoreBg(website.complianceScore)}`}>
                                        <span className={`text-2xl font-bold ${getScoreColor(website.complianceScore)}`}>
                                            {website.complianceScore}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary">Compliance Score</p>
                                        <p className={`text-sm font-medium ${getScoreColor(website.complianceScore)}`}>
                                            {website.complianceScore >= 80 ? "Compliant" :
                                                website.complianceScore >= 60 ? "Needs Work" : "At Risk"}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="rounded-xl border border-border-light bg-background-tertiary p-4">
                                        <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                                            <AlertTriangle className="h-4 w-4" />
                                            Issues
                                        </div>
                                        <p className="text-lg font-semibold text-text-primary">{website.issues}</p>
                                    </div>
                                    <div className="rounded-xl border border-border-light bg-background-tertiary p-4">
                                        <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                                            <CheckCircle className="h-4 w-4" />
                                            Last Scan
                                        </div>
                                        <p className="text-lg font-semibold text-text-primary">{website.lastScan}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-border-light">
                                    <button
                                        onClick={() => toggleMonitoring(website.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${website.monitoring
                                            ? "bg-status-success/20 text-status-success"
                                            : "bg-background-tertiary text-text-secondary"
                                        }`}
                                    >
                                        <span className={`h-2 w-2 rounded-full ${website.monitoring ? "bg-status-success animate-pulse" : "bg-text-tertiary"}`} />
                                        {website.monitoring ? "Monitoring" : "Paused"}
                                    </button>
                                    <Link
                                        href={`/websites/${website.id}`}
                                        className="text-sm font-medium text-primary hover:text-primary-hover"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Add Website Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl border border-border-light bg-background-secondary p-8 w-full max-w-md"
                        >
                            <h2 className="text-3xl font-bold text-text-primary mb-6">Add New Website</h2>
                            <form onSubmit={handleAddWebsite} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-2">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                                        <input
                                            type="url"
                                            value={newUrl}
                                            onChange={(e) => setNewUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            required
                                            className="w-full rounded-full border border-border-medium bg-background-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 rounded-full border border-border-medium bg-background-tertiary px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-background-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-full bg-gradient-to-r from-primary to-primary-hover px-4 py-3 text-sm font-semibold text-white transition hover:from-primary-light hover:to-primary"
                                    >
                                        Add Website
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}