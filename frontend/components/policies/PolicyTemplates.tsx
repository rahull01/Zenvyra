"use client";

import { motion } from "framer-motion";
import { FileText, Shield, Cookie, Scale, BookOpen, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

const templates = [
    {
        id: "gdpr-basic",
        name: "GDPR Basic",
        icon: Shield,
        description: "Essential GDPR compliance for small businesses",
        coverage: ["Data Collection", "User Rights", "Cookies", "Data Retention"],
        popular: true,
    },
    {
        id: "gdpr-advanced",
        name: "GDPR Advanced",
        icon: Shield,
        description: "Comprehensive GDPR with DPO requirements",
        coverage: ["Data Collection", "User Rights", "Cookies", "Data Retention", "DPO", "Data Transfers", "Breach Notification"],
        popular: false,
    },
    {
        id: "ccpa-complete",
        name: "CCPA Complete",
        icon: Scale,
        description: "Full CCPA/CPRA compliance for California",
        coverage: ["Consumer Rights", "Opt-out", "Data Sales", "Financial Incentives"],
        popular: true,
    },
    {
        id: "cookie-essential",
        name: "Cookie Essential",
        icon: Cookie,
        description: "Basic cookie consent and tracking",
        coverage: ["Cookie Types", "Consent Management", "Third-party", "Analytics"],
        popular: false,
    },
    {
        id: "terms-saas",
        name: "SaaS Terms",
        icon: BookOpen,
        description: "Terms of service for SaaS products",
        coverage: ["Service Usage", "Subscriptions", "Liability", "Termination"],
        popular: true,
    },
    {
        id: "terms-ecommerce",
        name: "E-commerce Terms",
        icon: BookOpen,
        description: "Terms for online stores and marketplaces",
        coverage: ["Sales", "Shipping", "Returns", "Payments", "Disputes"],
        popular: false,
    },
];

interface PolicyTemplatesProps {
    onSelect?: (templateId: string) => void;
}

export default function PolicyTemplates({ onSelect }: PolicyTemplatesProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-heading-2 gradient-text mb-2">Policy Templates</h2>
                <p className="text-surface-400">Choose from pre-built compliant templates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                            setSelectedTemplate(template.id);
                            onSelect?.(template.id);
                        }}
                        className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${selectedTemplate === template.id
                                ? "bg-brand-500/10 border-brand-500/50"
                                : "bg-surface-900/40 border-surface-800/50 hover:border-surface-700/50"
                            }`}
                    >
                        {template.popular && (
                            <span className="absolute -top-3 left-4 px-3 py-1 bg-brand-500 text-white text-xs font-medium rounded-full">
                                Popular
                            </span>
                        )}

                        <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4">
                            <template.icon className="w-6 h-6 text-brand-400" />
                        </div>

                        <h3 className="text-heading-3 mb-2">{template.name}</h3>
                        <p className="text-sm text-surface-500 mb-4">{template.description}</p>

                        <div className="space-y-2 mb-4">
                            {template.coverage.map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-surface-400">
                                    <Check className="w-3 h-3 text-success" />
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-brand-400 text-sm font-medium mt-4">
                            Use Template
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}