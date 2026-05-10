"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Globe, Shield, AlertTriangle, CheckCircle,
    MoreVertical, ExternalLink, Settings, Trash2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

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
        if (score >= 80) return "text-success";
        if (score >= 60) return "text-warning";
        return "text-error";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-success/20";
        if (score >= 60) return "bg-warning/20";
        return "bg-error/20";
    };

    const handleAddWebsite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUrl) return;

        toast.success("Website added successfully");
        setShowAddModal(false);
        setNewUrl("");
    };

    const toggleMonitoring = (id: string) => {
        setWebsites(prev => prev.map(w =>
            w.id === id ? { ...w, monitoring: !w.monitoring } : w
        ));
        toast.success("Monitoring updated");
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-display-3 font-display text-surface-100 mb-2">
                        Websites
                    </h1>
                    <p className="text-surface-400">
                        Manage and monitor all your websites
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
                >
                    <Plus className="w-5 h-5" />
                    Add Website
                </motion.button>
            </div>

            {/* Websites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.map((website, index) => (
                    <motion.div
                        key={website.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300 group"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-brand-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-surface-100">{website.name}</h3>
                                    <a
                                        href={website.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-surface-500 hover:text-brand-400 flex items-center gap-1 transition-colors"
                                    >
                                        {website.url}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                            <div className="relative group/menu">
                                <button className="p-2 hover:bg-surface-800 rounded-lg transition-colors">
                                    <MoreVertical className="w-4 h-4 text-surface-500" />
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-900 border border-surface-800 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                                    <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-800 text-sm text-surface-300 transition-colors">
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-800 text-sm text-error transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 rounded-full ${getScoreBg(website.complianceScore)} flex items-center justify-center`}>
                                <span className={`text-xl font-bold ${getScoreColor(website.complianceScore)}`}>
                                    {website.complianceScore}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-surface-500">Compliance Score</p>
                                <p className={`text-sm font-medium ${getScoreColor(website.complianceScore)}`}>
                                    {website.complianceScore >= 80 ? "Compliant" :
                                        website.complianceScore >= 60 ? "Needs Work" : "At Risk"}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-surface-800/50">
                                <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    Issues
                                </div>
                                <p className="text-lg font-semibold text-surface-200">{website.issues}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-surface-800/50">
                                <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Last Scan
                                </div>
                                <p className="text-lg font-semibold text-surface-200">{website.lastScan}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-surface-800/50">
                            <button
                                onClick={() => toggleMonitoring(website.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${website.monitoring
                                        ? "bg-success/20 text-success"
                                        : "bg-surface-800 text-surface-500"
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${website.monitoring ? "bg-success animate-pulse" : "bg-surface-600"}`} />
                                {website.monitoring ? "Monitoring" : "Paused"}
                            </button>
                            <Link
                                href={`/websites/${website.id}`}
                                className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
                            >
                                View Details →
                            </Link>
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
                        className="glass-card rounded-2xl p-8 w-full max-w-md"
                    >
                        <h2 className="text-heading-2 mb-4">Add New Website</h2>
                        <form onSubmit={handleAddWebsite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-2">
                                    Website URL
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                                    <input
                                        type="url"
                                        value={newUrl}
                                        onChange={(e) => setNewUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-surface-800 hover:bg-surface-700 text-surface-300 font-semibold rounded-xl transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
                                >
                                    Add Website
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}