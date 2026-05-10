"use client";

import { motion } from "framer-motion";
import { Search, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
        >
            <div className="w-20 h-20 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-6">
                {icon || <Search className="w-10 h-10 text-surface-600" />}
            </div>
            <h3 className="text-heading-2 text-surface-300 mb-2">{title}</h3>
            <p className="text-surface-500 max-w-md mb-8">{description}</p>
            {actionLabel && (actionHref || onAction) && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {actionHref ? (
                        <Link
                            href={actionHref}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
                        >
                            <Plus className="w-5 h-5" />
                            {actionLabel}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <button
                            onClick={onAction}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
                        >
                            <Plus className="w-5 h-5" />
                            {actionLabel}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}