"use client";

import { motion } from "framer-motion";
import { Shield, Activity, Clock, CheckCircle, AlertTriangle, Pause, Play } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function GuardianStatus() {
    const [isActive, setIsActive] = useState(true);
    const [uptime] = useState(99.97);

    const toggleGuardian = () => {
        setIsActive(!isActive);
        toast.success(isActive ? "Guardian paused" : "Guardian activated");
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${isActive ? "bg-success/20" : "bg-surface-800"
                        }`}>
                        <Shield className={`w-7 h-7 ${isActive ? "text-success" : "text-surface-500"}`} />
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-2xl border-2 border-success/50"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                    </div>
                    <div>
                        <h3 className="text-heading-3">24/7 Guardian</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-success animate-pulse" : "bg-surface-600"}`} />
                            <span className={`text-sm ${isActive ? "text-success" : "text-surface-500"}`}>
                                {isActive ? "Monitoring Active" : "Paused"}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={toggleGuardian}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                            ? "bg-error/20 text-error hover:bg-error/30"
                            : "bg-success/20 text-success hover:bg-success/30"
                        }`}
                >
                    {isActive ? (
                        <>
                            <Pause className="w-4 h-4" />
                            Pause
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            Resume
                        </>
                    )}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Uptime", value: `${uptime}%`, icon: Activity, color: "text-success" },
                    { label: "Checks Today", value: "2,847", icon: CheckCircle, color: "text-brand-400" },
                    { label: "Avg Response", value: "142ms", icon: Clock, color: "text-warning" },
                    { label: "Alerts Sent", value: "3", icon: AlertTriangle, color: "text-accent" },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-surface-800/30 text-center">
                        <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                        <p className="text-xl font-bold text-surface-100">{stat.value}</p>
                        <p className="text-xs text-surface-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Status Timeline */}
            <div className="mt-6">
                <h4 className="text-sm font-medium text-surface-400 mb-3">Last 24 Hours</h4>
                <div className="flex items-end gap-1 h-16">
                    {Array.from({ length: 24 }).map((_, i) => {
                        const height = Math.random() * 100;
                        const isGreen = height > 70;
                        return (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: i * 0.02 }}
                                className={`flex-1 rounded-sm ${isGreen ? "bg-success/60" : "bg-warning/60"
                                    }`}
                                title={`Hour ${i}: ${height.toFixed(0)}% healthy`}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-surface-600">
                    <span>24h ago</span>
                    <span>12h ago</span>
                    <span>Now</span>
                </div>
            </div>
        </div>
    );
}