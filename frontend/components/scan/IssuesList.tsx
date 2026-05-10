"use client";

import { motion } from "framer-motion";
import {
    XCircle, AlertTriangle, AlertCircle, CheckCircle,
    ChevronDown, ChevronUp, FileText, Wand2
} from "lucide-react";
import { useState } from "react";

interface Issue {
    id: string;
    type: string;
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
    fixSuggestion: string;
    autoFixable: boolean;
    category: string;
}

interface IssuesListProps {
    issues: Issue[];
    onFix?: (issueId: string) => void;
}

const severityConfig = {
    critical: { icon: XCircle, color: "text-error", bg: "bg-error/20", border: "border-error/30", label: "Critical" },
    high: { icon: AlertTriangle, color: "text-accent", bg: "bg-accent/20", border: "border-accent/30", label: "High" },
    medium: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/20", border: "border-warning/30", label: "Medium" },
    low: { icon: CheckCircle, color: "text-success", bg: "bg-success/20", border: "border-success/30", label: "Low" },
};

export default function IssuesList({ issues, onFix }: IssuesListProps) {
    const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

    const groupedIssues = issues.reduce((acc, issue) => {
        if (!acc[issue.severity]) acc[issue.severity] = [];
        acc[issue.severity].push(issue);
        return acc;
    }, {} as Record<string, Issue[]>);

    const severityOrder = ["critical", "high", "medium", "low"];

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-heading-3">Issues Found</h3>
                    <p className="text-sm text-surface-500">{issues.length} issues detected</p>
                </div>
                <div className="flex items-center gap-2">
                    {severityOrder.map((sev) => {
                        const count = groupedIssues[sev]?.length || 0;
                        if (count === 0) return null;
                        const config = severityConfig[sev as keyof typeof severityConfig];
                        return (
                            <span key={sev} className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                                {count} {config.label}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-3">
                {severityOrder.map((sev) => {
                    const sevIssues = groupedIssues[sev] || [];
                    if (sevIssues.length === 0) return null;
                    const config = severityConfig[sev as keyof typeof severityConfig];

                    return sevIssues.map((issue, index) => (
                        <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`rounded-xl border ${config.border} overflow-hidden`}
                        >
                            <button
                                onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                className="w-full flex items-center gap-4 p-4 hover:bg-surface-800/30 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                    <config.icon className={`w-5 h-5 ${config.color}`} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-medium text-surface-200">{issue.title}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                                            {config.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-surface-500 mt-0.5">{issue.category}</p>
                                </div>
                                {expandedIssue === issue.id ? (
                                    <ChevronUp className="w-5 h-5 text-surface-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-surface-500" />
                                )}
                            </button>

                            {expandedIssue === issue.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 pb-4 border-t border-surface-800/50"
                                >
                                    <div className="pt-4 space-y-4">
                                        <div>
                                            <h5 className="text-sm font-medium text-surface-300 mb-2">Description</h5>
                                            <p className="text-sm text-surface-400">{issue.description}</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
                                            <h5 className="text-sm font-medium text-brand-400 mb-2 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Fix Suggestion
                                            </h5>
                                            <p className="text-sm text-surface-400">{issue.fixSuggestion}</p>
                                        </div>

                                        {issue.autoFixable && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => onFix?.(issue.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium rounded-lg transition-all duration-200"
                                            >
                                                <Wand2 className="w-4 h-4" />
                                                Auto-Fix Issue
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ));
                })}
            </div>
        </div>
    );
}