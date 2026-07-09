"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
    Bell, FileText, Globe, Shield, Sparkles, Wand2, 
    Zap, Activity, Lock, Cpu, Fingerprint, Database,
    Search, BarChart3, Users, Code2, Scale, RefreshCw
} from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

const features = [
    { 
        icon: Wand2, 
        title: "AI Policy Drafting", 
        description: "Generate bulletproof privacy policies and T&Cs powered by GPT-4 and real-time legal databases.",
        color: "accent"
    },
    { 
        icon: Search, 
        title: "Deep Website Scanning", 
        description: "Our bots crawl every corner of your site to identify hidden cookies and compliance gaps.",
        color: "info"
    },
    { 
        icon: RefreshCw, 
        title: "Auto-Update Engine", 
        description: "Policies automatically update when global regulations change. Never go out of date again.",
        color: "accent"
    },
    { 
        icon: Shield, 
        title: "Consent Management", 
        description: "Premium cookie banners with geo-targeted display and granular category controls.",
        color: "info"
    },
    { 
        icon: BarChart3, 
        title: "Compliance Scoring", 
        description: "Neural network-based scoring system predicts audit risks with 200+ data points.",
        color: "accent"
    },
    { 
        icon: Fingerprint, 
        title: "DSAR Automation", 
        description: "Fully automated Data Subject Access Request handling with encrypted submission logs.",
        color: "info"
    },
];

export default function FeaturesGrid() {
    return (
        <SectionWrapper className="relative py-32 bg-bg-primary overflow-hidden">
            {/* Background atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[160px] rounded-full pointer-events-none" />

            <PageContainer>
                <div className="relative z-10 mb-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-bg-tertiary rounded-full mb-6"
                    >
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="text-xs font-bold text-text-primary uppercase tracking-widest">Enterprise Grade</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-6 tracking-tight">
                        Build an evidence-backed <br/>
                        <span className="text-gradient-accent">AI Act readiness record.</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-text-secondary font-medium leading-relaxed">
                        A focused set of AI-assisted tools to inventory systems, classify risk, map obligations,
                        and collect the evidence your customers and counsel need to review.
                    </p>
                </div>

                <div className="relative z-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative p-8 rounded-2xl bg-bg-primary border border-bg-tertiary hover:border-accent/40 hover:shadow-glow-accent transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                                feature.color === "accent" ? "bg-accent/10 text-accent shadow-glow-accent/20" : "bg-info/10 text-info shadow-glow-ai"
                            }`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="mt-8 text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
                                {feature.title}
                            </h3>
                            <p className="mt-4 text-text-secondary text-sm font-medium leading-relaxed">
                                {feature.description}
                            </p>
                            
                            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                Explore Feature
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

