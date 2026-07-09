"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, Languages, FileText, Check, Loader2, Shield, Cookie, Scale, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

const policyTypes = [
    { id: "privacy", name: "Privacy Policy", icon: Shield, description: "GDPR, CCPA, LGPD compliant" },
    { id: "terms", name: "Terms of Service", icon: BookOpen, description: "Legal terms and conditions" },
    { id: "cookie", name: "Cookie Policy", icon: Cookie, description: "Cookie consent and tracking" },
    { id: "gdpr", name: "GDPR Notice", icon: Scale, description: "EU data protection rights" },
    { id: "ccpa", name: "CCPA Notice", icon: Scale, description: "California privacy rights" },
    { id: "disclaimer", name: "Disclaimer", icon: FileText, description: "Liability limitations" },
];

const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "nl", name: "Dutch", flag: "🇳🇱" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "pl", name: "Polish", flag: "🇵🇱" },
];

const websites = [
    { id: "1", name: "acme.com", url: "https://acme.com" },
    { id: "2", name: "shop.acme.com", url: "https://shop.acme.com" },
    { id: "3", name: "blog.acme.com", url: "https://blog.acme.com" },
];

interface PolicyGeneratorProps {
    onGenerate?: (policy: any) => void;
}

export default function PolicyGenerator({ onGenerate }: PolicyGeneratorProps) {
    const [selectedType, setSelectedType] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [selectedWebsite, setSelectedWebsite] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [generating, setGenerating] = useState(false);
    const [step, setStep] = useState(1);

    const handleGenerate = async () => {
        if (!selectedType) {
            toast.error("Please select a policy type");
            return;
        }
        if (!companyName) {
            toast.error("Please enter your company name");
            return;
        }

        setGenerating(true);

        // Simulate AI generation steps
        const steps = ["Analyzing requirements", "Drafting policy", "Legal compliance check", "Finalizing"];
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        const newPolicy = {
            id: Date.now().toString(),
            type: selectedType,
            title: policyTypes.find(t => t.id === selectedType)?.name,
            language: languages.find(l => l.code === selectedLanguage)?.name,
            companyName,
            website: selectedWebsite,
            content: `# ${policyTypes.find(t => t.id === selectedType)?.name}\n\nLast Updated: ${new Date().toLocaleDateString()}\n\n## 1. Introduction\n\n${companyName} ("we", "us", or "our") is committed to protecting your privacy...`,
            status: "draft",
            lastUpdated: "Just now",
        };

        setGenerating(false);
        onGenerate?.(newPolicy);
        toast.success("Policy generated successfully!");

        // Reset form
        setSelectedType("");
        setCompanyName("");
        setStep(1);
    };

    if (generating) {
        return (
            <div className="glass-card rounded-2xl p-12 text-center">
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
                <h3 className="text-heading-2 mb-2">Generating Policy...</h3>
                <p className="text-surface-400 mb-6">Our AI is crafting a policy draft for your team and counsel to review</p>
                <div className="space-y-2 max-w-xs mx-auto">
                    {["Analyzing requirements", "Drafting policy", "Legal compliance check", "Finalizing"].map((s, i) => (
                        <motion.div
                            key={s}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.5 }}
                            className="flex items-center gap-3 text-sm text-surface-400"
                        >
                            <Check className="w-4 h-4 text-success" />
                            {s}
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-heading-2">AI Policy Generator</h2>
                    <p className="text-sm text-surface-500">Generate policy drafts for counsel review in seconds</p>
                </div>
            </div>

            {/* Step 1: Policy Type */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-surface-300 mb-4">
                    Select Policy Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {policyTypes.map((type) => (
                        <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedType(type.id)}
                            className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-200 ${selectedType === type.id
                                    ? "bg-brand-500/20 border-brand-500/50 text-brand-400"
                                    : "bg-surface-800/50 border-surface-700/50 text-surface-400 hover:bg-surface-800"
                                }`}
                        >
                            <type.icon className="w-8 h-8" />
                            <div className="text-center">
                                <p className="text-sm font-medium">{type.name}</p>
                                <p className="text-xs text-surface-500 mt-1">{type.description}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Step 2: Details */}
            <AnimatePresence>
                {selectedType && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${selectedLanguage === lang.code
                                                    ? "bg-brand-500/20 text-brand-400 border border-brand-500/50"
                                                    : "bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:bg-surface-800"
                                                }`}
                                        >
                                            <span>{lang.flag}</span>
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-3">
                                    Target Website
                                </label>
                                <select
                                    value={selectedWebsite}
                                    onChange={(e) => setSelectedWebsite(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 focus:outline-none focus:border-brand-500/50"
                                >
                                    <option value="">Select website...</option>
                                    {websites.map((site) => (
                                        <option key={site.id} value={site.id}>{site.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Acme Inc."
                                className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                            />
                        </div>

                        {/* Generate Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGenerate}
                            className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            Generate Policy
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}