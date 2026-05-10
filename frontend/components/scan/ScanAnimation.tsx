"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock, FileText, Lock, Globe } from "lucide-react";

const scanSteps = [
    { icon: Globe, label: "DNS Resolution", duration: 0.5 },
    { icon: Lock, label: "SSL Certificate", duration: 0.8 },
    { icon: FileText, label: "Cookie Policy", duration: 1.1 },
    { icon: Shield, label: "Privacy Check", duration: 1.4 },
    { icon: Clock, label: "Performance", duration: 1.7 },
];

interface ScanAnimationProps {
    progress?: number;
}

export default function ScanAnimation({ progress = 0 }: ScanAnimationProps) {
    return (
        <div className="flex flex-col items-center py-12">
            {/* Main Spinner */}
            <div className="relative w-32 h-32 mb-8">
                <motion.div
                    className="absolute inset-0 border-4 border-surface-800 rounded-full"
                />
                <motion.div
                    className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-2 border-4 border-accent/30 rounded-full border-b-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-12 h-12 text-brand-400" />
                </div>
            </div>

            <h3 className="text-heading-2 mb-2">Analyzing Website</h3>
            <p className="text-surface-400 mb-8">Checking compliance across 50+ data points...</p>

            {/* Progress Steps */}
            <div className="w-full max-w-md space-y-3">
                {scanSteps.map((step, index) => (
                    <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                            opacity: progress >= index * 20 ? 1 : 0.3,
                            x: 0
                        }}
                        transition={{ delay: step.duration }}
                        className="flex items-center gap-4"
                    >
                        <motion.div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${progress >= (index + 1) * 20
                                    ? "bg-success/20 text-success"
                                    : progress >= index * 20
                                        ? "bg-brand-500/20 text-brand-400"
                                        : "bg-surface-800 text-surface-600"
                                }`}
                        >
                            {progress >= (index + 1) * 20 ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : (
                                <step.icon className="w-4 h-4" />
                            )}
                        </motion.div>
                        <span className={`text-sm ${progress >= index * 20 ? "text-surface-300" : "text-surface-600"
                            }`}>
                            {step.label}
                        </span>
                        {progress >= index * 20 && progress < (index + 1) * 20 && (
                            <motion.div
                                className="ml-auto w-16 h-1 bg-surface-800 rounded-full overflow-hidden"
                            >
                                <motion.div
                                    className="h-full bg-brand-500 rounded-full"
                                    animate={{ width: ["0%", "100%"] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mt-8 h-2 bg-surface-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-brand-500 to-accent rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <p className="mt-2 text-sm text-surface-500">{progress}% Complete</p>
        </div>
    );
}