"use client";

import React from "react";

import { motion } from "framer-motion";
import { Search, ShieldCheck, Sparkles, Bell, ArrowRight, Zap, Target, Cpu, Activity } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

const steps = [
    { icon: Search, title: "Deep Recon", description: "Autonomous scanning of every legal and privacy node across your stack." },
    { icon: Target, title: "Risk Mapping", description: "Real-time categorization of vulnerabilities by jurisdictional impact." },
    { icon: Cpu, title: "Auto-Fix Logic", description: "Deploy implementation-ready code patterns to resolve bottlenecks." },
    { icon: Activity, title: "Continuous Ops", description: "Stay resilient with 24/7 automated monitoring and verification." },
];

const compareRows = [
    { metric: "Time to first scan", modern: "15 seconds", legacy: "2-5 days" },
    { metric: "Issue remediation", modern: "AI-assisted autonomous fix", legacy: "Manual legal triage" },
    { metric: "Operational frequency", modern: "Continuous 24/7 monitoring", legacy: "Periodic audits" },
    { metric: "Team accessibility", modern: "Built for product + legal", legacy: "Legal specialist only" },
];

export default function HowItWorks() {
    return (
        <SectionWrapper className="relative py-24">
            <PageContainer>
                <div className="relative rounded-[3rem] border border-slate-200 bg-white p-10 shadow-premium md:p-20 overflow-hidden group">
                    {/* Inner Atmosphere */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/[0.03] blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/[0.03] blur-[120px] rounded-full" />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-16">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full mb-6 border border-brand-500/20"
                            >
                                <Zap className="w-3.5 h-3.5 text-brand-600" />
                                <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest">Operational Protocol</span>
                            </motion.div>
                            <h2 className="text-display-3 font-display font-black text-slate-900 mb-6 leading-tight">
                                A high-performance <br/>
                                <span className="text-brand-600">compliance workflow.</span>
                            </h2>
                            <p className="max-w-2xl text-lg text-slate-500 font-medium leading-relaxed">
                                Our intelligence engine abstracts away the complexity of global regulations, 
                                allowing your team to focus on shipping without the legal friction.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-20">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-card hover:border-brand-500/20 transition-all duration-500 group/item"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-500">
                                        <step.icon className="w-6 h-6 text-brand-600" />
                                    </div>
                                    <h3 className="text-base font-display font-black text-slate-900 mb-2 uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-card">
                            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">System Benchmark</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Versus Traditional Infrastructure</p>
                                </div>
                                <ShieldCheck className="w-6 h-6 text-brand-500" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parameter</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-brand-600 uppercase tracking-widest">ComplianceAI</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Traditional</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {compareRows.map((row) => (
                                            <tr key={row.metric} className="group/row hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-5 text-sm font-bold text-slate-500">{row.metric}</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-sm font-black text-slate-900">{row.modern}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-medium text-slate-400">{row.legacy}</td>
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
