"use client";

import React from "react";

import { motion } from "framer-motion";
import { 
    Bell, FileText, Globe, Shield, Sparkles, Wand2, 
    Zap, Activity, Lock, Cpu, Fingerprint, Database
} from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

const features = [
    { 
        icon: Shield, 
        title: "Protocol Intelligence", 
        description: "Deep-scanning of privacy structures, legal frameworks, and jurisdictional consent flows.",
        color: "brand"
    },
    { 
        icon: Cpu, 
        title: "Autonomous Resolution", 
        description: "AI-generated implementation patterns for banners, scripts, and policy documentation.",
        color: "emerald"
    },
    { 
        icon: Globe, 
        title: "Global Node Monitoring", 
        description: "Real-time jurisdictional tracking across every deployment and system cluster.",
        color: "brand"
    },
    { 
        icon: Bell, 
        title: "Sentinel Alerts", 
        description: "High-fidelity, severity-mapped notifications for security and legal infrastructure owners.",
        color: "emerald"
    },
    { 
        icon: Fingerprint, 
        title: "Identity Audit Logs", 
        description: "Cryptographically verified history of every policy change and system resolution.",
        color: "brand"
    },
    { 
        icon: Zap, 
        title: "Executive Synthesis", 
        description: "Trust-optimized reporting and dynamic KPI visualization for stakeholders.",
        color: "emerald"
    },
];

export default function FeaturesGrid() {
    return (
        <SectionWrapper className="relative py-24">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] bg-brand-500/[0.03] blur-[160px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[160px] rounded-full" />
            </div>

            <PageContainer>
                <div className="relative z-10 mb-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full mb-6"
                    >
                        <Activity className="w-3.5 h-3.5 text-brand-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Core Capabilities</span>
                    </motion.div>
                    <h2 className="text-display-3 font-display font-black text-slate-900 mb-6 leading-tight">
                        Everything you need to <br/>
                        <span className="text-brand-600">secure your operations.</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-slate-500 font-medium leading-relaxed">
                        A high-fidelity workspace engineered for trust, speed, 
                        and absolute operational clarity in a shifting regulatory landscape.
                    </p>
                </div>

                <div className="relative z-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.article
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group premium-card"
                        >
                            <div className="p-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                                    feature.color === "brand" ? "bg-brand-50 text-brand-600 shadow-sm" : "bg-emerald-50 text-emerald-600 shadow-sm"
                                }`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="mt-8 text-xl font-display font-black text-slate-900 group-hover:text-brand-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-slate-500 text-sm font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                                
                                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Analyze System
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
