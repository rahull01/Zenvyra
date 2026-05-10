"use client";

import React from "react";

import Link from "next/link";
import { Clock3, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function CTASection() {
    return (
        <SectionWrapper className="relative py-24">
            <PageContainer>
                <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 p-12 text-center shadow-premium lg:p-24 group">
                    {/* Animated Background Atmosphere */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-500/[0.15] blur-[160px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.1] blur-[160px] rounded-full group-hover:scale-110 transition-transform duration-1000 delay-100" />
                        <div className="premium-noise opacity-[0.05]" />
                    </div>

                    <div className="relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mx-auto inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
                        >
                            <Clock3 className="h-4 w-4 text-brand-400" />
                            <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">
                                Protocol provisioning active in 30s
                            </span>
                        </motion.div>
                        
                        <h2 className="text-display-2 font-display font-black text-white mb-8 tracking-tight max-w-4xl mx-auto">
                            Ready to operate with <br/>
                            <span className="text-brand-500 italic">absolute confidence?</span>
                        </h2>
                        
                        <p className="mx-auto max-w-2xl text-xl text-slate-400 font-medium leading-relaxed mb-12">
                            Deploy our intelligence engine across your entire infrastructure in minutes. 
                            Start with a single node and scale to global compliance automation.
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Link 
                                href="/signup" 
                                className="brand-button px-10 py-5 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-glow"
                            >
                                <Zap className="w-4 h-4" />
                                Initialize Registry
                            </Link>
                            <Link 
                                href="/documentation" 
                                className="px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white border border-white/10 rounded-2xl hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                            >
                                Read Protocol
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SOC-2 Type II Certified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zero Configuration Required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Data Isolation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}
