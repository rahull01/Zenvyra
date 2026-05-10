"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, FileText, Globe, Languages, Copy, Download,
    Eye, Edit, Trash2, Check, ChevronDown, Sparkles, X, Shield, Cookie, Scale
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Policy {
    id: string;
    type: string;
    title: string;
    language: string;
    status: "draft" | "published" | "archived";
    lastUpdated: string;
    website: string;
}

const mockPolicies: Policy[] = [
    {
        id: "1",
        type: "privacy",
        title: "Privacy Policy - SaaS Platform",
        language: "English",
        status: "published",
        lastUpdated: "3 hours ago",
        website: "northline.app",
    },
    {
        id: "2",
        type: "terms",
        title: "Terms of Service - Subscription Plans",
        language: "English",
        status: "published",
        lastUpdated: "1 day ago",
        website: "northline.app",
    },
    {
        id: "3",
        type: "cookie",
        title: "Cookie Policy - Consent Preferences",
        language: "German",
        status: "draft",
        lastUpdated: "Just now",
        website: "checkout.northline.app",
    },
    {
        id: "4",
        type: "gdpr",
        title: "GDPR Data Processing Notice",
        language: "French",
        status: "published",
        lastUpdated: "5 days ago",
        website: "docs.northline.app",
    },
    {
        id: "5",
        type: "ccpa",
        title: "CCPA Consumer Rights Notice",
        language: "English",
        status: "draft",
        lastUpdated: "2 hours ago",
        website: "northline.app",
    },
];

const policyTypes = [
    { id: "privacy", name: "Privacy Policy", icon: Shield },
    { id: "terms", name: "Terms of Service", icon: FileText },
    { id: "cookie", name: "Cookie Policy", icon: Cookie },
    { id: "gdpr", name: "GDPR Notice", icon: Globe },
    { id: "ccpa", name: "CCPA Notice", icon: Scale },
];

const languages = [
    { code: "en", name: "English", flag: "EN" },
    { code: "de", name: "German", flag: "DE" },
    { code: "fr", name: "French", flag: "FR" },
    { code: "es", name: "Spanish", flag: "ES" },
    { code: "it", name: "Italian", flag: "IT" },
];

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
    const [showGenerator, setShowGenerator] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [previewPolicy, setPreviewPolicy] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!selectedType) {
            toast.error("Please select a policy type");
            return;
        }

        setGenerating(true);
        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 3000));

        const newPolicy: Policy = {
            id: Date.now().toString(),
            type: selectedType,
            title: policyTypes.find(t => t.id === selectedType)?.name || "New Policy",
            language: languages.find(l => l.code === selectedLanguage)?.name || "English",
            status: "draft",
            lastUpdated: "Just now",
            website: "northline.app",
        };

        setPolicies(prev => [newPolicy, ...prev]);
        setGenerating(false);
        setShowGenerator(false);
        setSelectedType("");
        toast.success("Policy generated successfully!");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published": return "bg-success/20 text-success";
            case "draft": return "bg-warning/20 text-warning";
            case "archived": return "bg-surface-700 text-surface-500";
            default: return "bg-surface-700 text-surface-500";
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-display-3 font-display text-surface-100 mb-2">
                        Policies
                    </h1>
                    <p className="text-surface-400">
                        AI-generated compliance policies for your websites
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGenerator(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
                >
                    <Sparkles className="w-5 h-5" />
                    Generate Policy
                </motion.button>
            </div>

            {/* Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy, index) => (
                    <motion.div
                        key={policy.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-brand-400" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                                {policy.status}
                            </span>
                        </div>

                        <h3 className="text-heading-3 mb-2">{policy.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-surface-500 mb-4">
                            <span className="flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                {policy.website}
                            </span>
                            <span className="flex items-center gap-1">
                                <Languages className="w-4 h-4" />
                                {policy.language}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-surface-800/50">
                            <span className="text-xs text-surface-500">
                                Updated {policy.lastUpdated}
                            </span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setPreviewPolicy(policy.id)}
                                    className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                    title="Preview"
                                >
                                    <Eye className="w-4 h-4 text-surface-400" />
                                </button>
                                <Link
                                    href={`/policies/${policy.id}`}
                                    className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4 text-surface-400" />
                                </Link>
                                <button
                                    className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                    title="Copy"
                                >
                                    <Copy className="w-4 h-4 text-surface-400" />
                                </button>
                                <button
                                    className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4 text-surface-400" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Policy Generator Modal */}
            <AnimatePresence>
                {showGenerator && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-heading-2 flex items-center gap-2">
                                        <Sparkles className="w-6 h-6 text-brand-400" />
                                        AI Policy Generator
                                    </h2>
                                    <p className="text-sm text-surface-500 mt-1">
                                        Generate legally compliant policies in seconds
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowGenerator(false)}
                                    className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-surface-400" />
                                </button>
                            </div>

                            {generating ? (
                                <div className="text-center py-12">
                                    <div className="relative w-24 h-24 mx-auto mb-6">
                                        <motion.div
                                            className="absolute inset-0 border-4 border-brand-500/20 rounded-full"
                                        />
                                        <motion.div
                                            className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-brand-400" />
                                    </div>
                                    <h3 className="text-heading-3 mb-2">Generating Policy...</h3>
                                    <p className="text-surface-400">Our AI is crafting a legally compliant policy for you</p>
                                    <div className="mt-6 space-y-2">
                                        {["Analyzing requirements", "Drafting policy", "Legal compliance check", "Finalizing"].map((step, i) => (
                                            <motion.div
                                                key={step}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.5 }}
                                                className="flex items-center gap-3 text-sm text-surface-400"
                                            >
                                                <Check className="w-4 h-4 text-success" />
                                                {step}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Policy Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-surface-300 mb-3">
                                            Policy Type
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {policyTypes.map((type) => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${selectedType === type.id
                                                            ? "bg-brand-500/20 border-brand-500/50 text-brand-400"
                                                            : "bg-surface-800/50 border-surface-700/50 text-surface-400 hover:bg-surface-800"
                                                        }`}
                                                >
                                                    <type.icon className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{type.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-surface-300 mb-3">
                                            Language
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => setSelectedLanguage(lang.code)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${selectedLanguage === lang.code
                                                            ? "bg-brand-500/20 border-brand-500/50 text-brand-400"
                                                            : "bg-surface-800/50 border-surface-700/50 text-surface-400 hover:bg-surface-800"
                                                        }`}
                                                >
                                                    <span>{lang.flag}</span>
                                                    <span className="text-sm font-medium">{lang.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!selectedType || generating}
                                        className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        Generate Draft
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
