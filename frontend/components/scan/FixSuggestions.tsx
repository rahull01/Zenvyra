"use client";

import { motion } from "framer-motion";
import { Wand2, CheckCircle, ArrowRight, Shield, FileText, Cookie, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface FixSuggestionsProps {
    issues: Array<{
        id: string;
        type: string;
        autoFixable: boolean;
        title: string;
    }>;
}

const fixIcons: Record<string, any> = {
    cookie: Cookie,
    privacy: FileText,
    ssl: Lock,
    default: Shield,
};

export default function FixSuggestions({ issues }: FixSuggestionsProps) {
    const [fixingIssues, setFixingIssues] = useState<Set<string>>(new Set());
    const [fixedIssues, setFixedIssues] = useState<Set<string>>(new Set());

    const autoFixableIssues = issues.filter((i) => i.autoFixable);

    const handleAutoFix = async (issueId: string) => {
        setFixingIssues((prev) => new Set(prev).add(issueId));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setFixingIssues((prev) => {
            const next = new Set(prev);
            next.delete(issueId);
            return next;
        });
        setFixedIssues((prev) => new Set(prev).add(issueId));
        toast.success("Issue fixed successfully!");
    };

    const handleFixAll = async () => {
        const toFix = autoFixableIssues.filter((i) => !fixedIssues.has(i.id));
        if (toFix.length === 0) {
            toast("All fixable issues are already resolved");
            return;
        }

        for (const issue of toFix) {
            await handleAutoFix(issue.id);
        }
        toast.success(`Fixed ${toFix.length} issues!`);
    };

    if (autoFixableIssues.length === 0) return null;

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-heading-3 flex items-center gap-2">
                        <Wand2 className="w-6 h-6 text-brand-400" />
                        Auto-Fix Available
                    </h3>
                    <p className="text-sm text-surface-500 mt-1">
                        {autoFixableIssues.length} issues can be fixed automatically
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFixAll}
                    className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow flex items-center gap-2"
                >
                    <Wand2 className="w-4 h-4" />
                    Fix All Issues
                </motion.button>
            </div>

            <div className="space-y-3">
                {autoFixableIssues.map((issue, index) => {
                    const Icon = fixIcons[issue.type] || fixIcons.default;
                    const isFixing = fixingIssues.has(issue.id);
                    const isFixed = fixedIssues.has(issue.id);

                    return (
                        <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isFixed
                                    ? "bg-success/10 border border-success/30"
                                    : "bg-surface-800/30 border border-surface-800/50"
                                }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${isFixed ? "bg-success/20" : "bg-brand-500/20"
                                    }`}
                            >
                                {isFixed ? (
                                    <CheckCircle className="w-5 h-5 text-success" />
                                ) : (
                                    <Icon className="w-5 h-5 text-brand-400" />
                                )}
                            </div>

                            <div className="flex-1">
                                <h4 className={`font-medium ${isFixed ? "text-success" : "text-surface-200"}`}>
                                    {issue.title}
                                </h4>
                                <p className="text-xs text-surface-500">
                                    {isFixed ? "Fixed successfully" : "Ready to auto-fix"}
                                </p>
                            </div>

                            {!isFixed && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAutoFix(issue.id)}
                                    disabled={isFixing}
                                    className="px-4 py-2 bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isFixing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                                            Fixing...
                                        </>
                                    ) : (
                                        <>
                                            Fix
                                            <ArrowRight className="w-3 h-3" />
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}