"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Sparkles, Bell, ArrowRight, Zap, Target, Cpu, Activity, LayoutGrid } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

const steps = [
    { icon: Search, title: "Scan", description: "Deep-scanning of every legal and privacy node across your website." },
    { icon: Target, title: "Review", description: "Real-time categorization of vulnerabilities by jurisdictional impact." },
    { icon: Cpu, title: "Deploy", description: "Deploy implementation-ready code patterns to resolve all issues." },
    { icon: Activity, title: "Monitor", description: "Stay resilient with 24/7 automated monitoring and verification." },
];

const compareRows = [
    { metric: "Time to first scan", modern: "15 seconds", legacy: "2-5 days" },
    { metric: "Issue remediation", modern: "AI-assisted autonomous fix", legacy: "Manual legal triage" },
    { metric: "Operational frequency", modern: "Continuous 24/7 monitoring", legacy: "Periodic audits" },
    { metric: "Team accessibility", modern: "Built for product + legal", legacy: "Legal specialist only" },
];

export default function HowItWorks() {
    return (
        <SectionWrapper className="relative py-32 bg-bg-base">
            <PageContainer>
                <div className="relative rounded-[3rem] border border-bg-tertiary bg-bg-primary p-10 md:p-20 overflow-hidden shadow-2xl">
                    {/* Inner Atmosphere */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-info/5 blur-[120px] rounded-full" />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-16 text-center">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6"
                            >
                                <Zap className="w-4 h-4 text-accent" />
                                <span className="text-xs font-bold text-accent uppercase tracking-widest">How It Works</span>
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-6 tracking-tight">
                                A high-performance <br/>
                                <span className="text-gradient-accent">Compliance Workflow.</span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-text-secondary font-medium leading-relaxed">
                                Our intelligence engine abstracts away the complexity of global regulations, 
                                allowing your team to focus on shipping without the legal friction.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 rounded-3xl bg-bg-secondary/50 border border-bg-tertiary hover:border-accent/30 hover:bg-bg-secondary transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-bg-base flex items-center justify-center mb-6 border border-bg-tertiary group-hover:scale-110 group-hover:border-accent/30 transition-all">
                                        <step.icon className="w-7 h-7 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-primary mb-3 uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-sm font-medium text-text-secondary leading-relaxed">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="rounded-3xl border border-bg-tertiary bg-bg-base overflow-hidden shadow-xl">
                            <div className="bg-bg-secondary/50 border-b border-bg-tertiary px-8 py-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary tracking-tight">System Benchmark</h3>
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Versus Traditional Infrastructure</p>
                                </div>
                                <ShieldCheck className="w-7 h-7 text-accent" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-bg-secondary/30">
                                            <th className="px-8 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Parameter</th>
                                            <th className="px-8 py-4 text-xs font-bold text-accent uppercase tracking-widest">Zenvyra</th>
                                            <th className="px-8 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Legacy Method</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-bg-tertiary">
                                        {compareRows.map((row) => (
                                            <tr key={row.metric} className="group/row hover:bg-bg-secondary/20 transition-colors">
                                                <td className="px-8 py-6 text-sm font-bold text-text-secondary">{row.metric}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                                        <span className="text-sm font-bold text-text-primary">{row.modern}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-medium text-text-muted">{row.legacy}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}

