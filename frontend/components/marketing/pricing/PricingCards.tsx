"use client";

import React from "react";

import Link from "next/link";
import { Check, Zap, Shield, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

const plans = [
    { 
        name: "Standard", 
        price: "$99", 
        description: "For early-stage startups", 
        features: ["1 Website Scan", "Weekly Integrity Check", "Basic Alerting", "Community Support"],
        icon: Shield,
        color: "slate"
    },
    { 
        name: "Professional", 
        price: "$299", 
        description: "For scaling platforms", 
        features: ["10 Website Scans", "Autonomous Resolution", "Team Workflows", "API Access"], 
        featured: true,
        icon: Zap,
        color: "brand"
    },
    { 
        name: "Enterprise", 
        price: "Custom", 
        description: "For global organizations", 
        features: ["Unlimited Infrastructure", "SSO + SAML Integration", "Dedicated Success Lead", "SLA Guarantees"],
        icon: Crown,
        color: "slate"
    },
];

export default function PricingCards() {
    return (
        <SectionWrapper className="relative py-24">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-500/[0.03] blur-[160px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[160px] rounded-full" />
            </div>

            <PageContainer>
                <div className="relative z-10 mb-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full mb-6 border border-amber-500/20"
                    >
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Most teams choose Professional</span>
                    </motion.div>
                    <h2 className="text-display-3 font-display font-black text-slate-900 mb-6 leading-tight">
                        Simple infrastructure <br/>
                        <span className="text-brand-600">for complex trust.</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-slate-500 font-medium leading-relaxed">
                        Transparent, predictable pricing designed to grow with your 
                        compliance requirements from seed to enterprise.
                    </p>
                </div>

                <div className="relative z-10 grid gap-8 md:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.article
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`relative rounded-[2.5rem] border p-10 transition-all duration-500 group ${
                                plan.featured 
                                ? "bg-slate-900 border-slate-900 shadow-glow ring-8 ring-brand-500/5 scale-105 z-20" 
                                : "bg-white border-slate-200 shadow-card hover:shadow-premium hover:-translate-y-1"
                            }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                    Recommended
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                                    plan.featured ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-500"
                                }`}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                                <h3 className={`text-xl font-display font-black mb-2 ${plan.featured ? "text-white" : "text-slate-900"}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm font-medium ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-5xl font-display font-black tracking-tight ${plan.featured ? "text-white" : "text-slate-900"}`}>
                                        {plan.price}
                                    </span>
                                    {plan.price !== "Custom" && (
                                        <span className={`text-sm font-bold uppercase tracking-widest ${plan.featured ? "text-slate-500" : "text-slate-400"}`}>
                                            / mo
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                            plan.featured ? "bg-brand-500/20 text-brand-400" : "bg-brand-50 text-brand-600"
                                        }`}>
                                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                        </div>
                                        <span className={`text-sm font-medium ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.name === "Enterprise" ? "/about" : "/signup"}
                                className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                    plan.featured 
                                    ? "bg-brand-600 text-white hover:bg-brand-500 hover:shadow-glow" 
                                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                }`}
                            >
                                {plan.name === "Enterprise" ? "Contact Support" : "Provision Node"}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}
