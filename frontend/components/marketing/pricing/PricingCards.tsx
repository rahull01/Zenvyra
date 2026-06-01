"use client";

import React from "react";
import Link from "next/link";
import { Check, Zap, Shield, Crown, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";

const plans = [
    { 
        name: "Starter", 
        price: "$49", 
        description: "Perfect for single-product startups.", 
        features: ["1 Domain Scan", "Auto Policy Generation", "Cookie Consent Banner", "7-Day Scan History", "Email Support"],
        icon: Shield,
        color: "info"
    },
    { 
        name: "Pro", 
        price: "$149", 
        description: "Advanced automation for growth teams.", 
        features: ["5 Domain Scans", "Deep Vulnerability Analysis", "Custom Policy Branding", "30-Day Scan History", "Priority AI Support", "API Access"], 
        featured: true,
        icon: Zap,
        color: "accent"
    },
    { 
        name: "Enterprise", 
        price: "Custom", 
        description: "Global compliance at scale.", 
        features: ["Unlimited Domains", "SAML / SSO Integration", "Dedicated Legal Review", "Custom Data Locality", "99.9% Uptime SLA", "24/7 Dedicated Support"],
        icon: Crown,
        color: "success"
    },
];

export default function PricingCards() {
    return (
        <SectionWrapper className="relative py-32 bg-bg-base overflow-hidden">
            {/* Background atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[160px] rounded-full pointer-events-none" />

            <PageContainer>
                <div className="relative z-10 mb-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6"
                    >
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-xs font-bold text-accent uppercase tracking-widest">Pricing Built for Scale</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-6 tracking-tight">
                        Transparent Pricing for <br/>
                        <span className="text-gradient-accent">Global Compliance.</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-text-secondary font-medium leading-relaxed">
                        Scale your compliance infrastructure as you grow. No hidden fees, 
                        no enterprise bloat. Just pure, AI-powered automation.
                    </p>
                </div>

                <div className="relative z-10 grid gap-8 md:grid-cols-3 items-center">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative rounded-[2.5rem] border p-10 transition-all duration-300 group ${
                                plan.featured 
                                ? "bg-bg-primary border-accent shadow-glow-accent scale-105 z-20" 
                                : "bg-bg-secondary/50 border-bg-tertiary hover:border-accent/30"
                            }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-bg-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${
                                    plan.featured ? "bg-accent text-bg-primary border-accent shadow-glow-accent" : "bg-bg-base text-text-primary border-bg-tertiary"
                                }`}>
                                    <plan.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-text-primary mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-sm font-medium text-text-secondary">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-text-primary tracking-tight">
                                        {plan.price}
                                    </span>
                                    {plan.price !== "Custom" && (
                                        <span className="text-sm font-bold uppercase tracking-widest text-text-muted">
                                            / month
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                            plan.featured ? "bg-accent/20 text-accent" : "bg-bg-tertiary text-text-muted"
                                        }`}>
                                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                        </div>
                                        <span className="text-sm font-medium text-text-secondary">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                asChild
                                variant={plan.featured ? "default" : "outline"}
                                className="w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-widest"
                            >
                                <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}

