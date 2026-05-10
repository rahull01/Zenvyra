"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Zap, ShieldCheck, Globe, Cpu } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Secure workspace",
        desc: "Protect policies, scans, and team access in one place."
    },
    {
        icon: Cpu,
        title: "AI compliance checks",
        desc: "Find privacy, cookie, and policy gaps before they slow launch."
    },
    {
        icon: Globe,
        title: "Always-on monitoring",
        desc: "Track changes across regions and get clear next steps."
    }
];

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row relative overflow-hidden">
            {/* Left Side: Premium Gradient + Features */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-20 bg-slate-950 overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-brand-500/[0.15] blur-[160px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/[0.1] blur-[160px] rounded-full animate-pulse delay-1000" />
                    {/* Noise texture for the dark side */}
                    <div className="premium-noise" />
                </div>

                {/* Branding */}
                <motion.div 
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <Link href="/" className="inline-flex items-center gap-4 group">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                            <Shield className="w-8 h-8 text-brand-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-display font-black text-white tracking-tight">ComplianceAI</span>
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-brand-500 animate-pulse" />
                                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Protocol v1.0</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <motion.h1 
                        initial={false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-display-3 font-display font-bold text-white mb-8 leading-tight"
                    >
                        Compliance software <br/>
                        <span className="text-brand-500">your team can understand.</span>
                    </motion.h1>
                    
                    <div className="space-y-8">
                        {features.map((f, i) => (
                            <motion.div 
                                key={i}
                                initial={false}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="flex gap-5 group"
                            >
                                <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:bg-brand-500/20 group-hover:border-brand-500/40">
                                    <f.icon className="w-5 h-5 text-brand-400 group-hover:text-brand-500 transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">{f.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer Credits */}
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Built for product, legal, and engineering teams
                    </p>
                </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div className="flex-1 relative flex flex-col min-h-screen">
                {/* Background Atmosphere for Light Side */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-500/[0.03] blur-[160px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[160px] rounded-full" />
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden p-8 flex items-center justify-between relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display font-black text-slate-900">ComplianceAI</span>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                    <motion.div
                        initial={false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-md"
                    >
                        <div className="bg-white/40 backdrop-blur-3xl border border-slate-200/80 rounded-[2.5rem] p-10 sm:p-12 shadow-premium relative overflow-hidden">
                            {/* Inner Shine */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-brand-500/[0.02] pointer-events-none" />
                            
                            <div className="relative z-10">
                                {children}
                            </div>
                        </div>

                        {/* Additional Footer Links */}
                        <div className="mt-10 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
