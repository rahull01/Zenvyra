"use client";

import React from "react";
import Link from "next/link";
import { Clock3, ArrowRight, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";

export default function CTASection() {
    return (
        <SectionWrapper className="relative py-32 bg-bg-base">
            <PageContainer>
                <div className="relative overflow-hidden rounded-[4rem] bg-bg-primary border border-bg-tertiary p-12 lg:p-24 text-center shadow-2xl group">
                    {/* Animated Background Atmosphere */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-accent/10 blur-[160px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-info/5 blur-[160px] rounded-full group-hover:scale-110 transition-transform duration-1000 delay-100" />
                    </div>

                    <div className="relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mx-auto inline-flex items-center gap-2.5 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8"
                        >
                            <Sparkles className="h-4 w-4 text-accent" />
                            <span className="text-xs font-bold text-accent uppercase tracking-widest">
                                Instant compliance setup in 30 seconds
                            </span>
                        </motion.div>
                        
                        <h2 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-8 tracking-tight max-w-4xl mx-auto">
                            Ready to operate with <br/>
                            <span className="text-gradient-accent">absolute confidence?</span>
                        </h2>
                        
                        <p className="mx-auto max-w-2xl text-xl text-text-secondary font-medium leading-relaxed mb-12">
                            Join 5,000+ companies automating their global compliance infrastructure 
                            with AI. Start your free scan today.
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Button
                                asChild
                                size="lg"
                                className="h-16 px-10 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-glow-accent"
                            >
                                <Link href="/signup">
                                    <Zap className="mr-2 h-4 w-4" />
                                    Get Started Free
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="h-16 px-10 rounded-2xl text-xs font-bold uppercase tracking-widest border-bg-tertiary text-text-primary hover:bg-bg-secondary"
                            >
                                <Link href="/contact">
                                    Contact Sales
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-10">
                            {[
                                "EU AI Act focused",
                                "Readiness evidence workflows",
                                "99.9% Uptime target",
                                "Guided setup"
                            ].map((label) => (
                                <div key={label} className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-success" />
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}

