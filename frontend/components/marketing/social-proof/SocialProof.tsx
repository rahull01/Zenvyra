"use client";

import React from "react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Quote, Star } from "lucide-react";

const companies = ["Stripe", "Notion", "Vercel", "Linear", "Figma", "Webflow", "Discord", "Slack"];
const testimonials = [
    { 
        quote: "ComplianceAI transformed our legal workflow. We moved from spreadsheet chaos to automated bliss in days.", 
        author: "Sarah Chen", 
        role: "Head of Legal, Orbit Labs",
        image: "SC"
    },
    { 
        quote: "The deep scanning engine found risks our manual auditors missed for years. Absolutely essential for SaaS.", 
        author: "James Wilson", 
        role: "CTO, Northline",
        image: "JW"
    },
    { 
        quote: "Policy generation that actually makes sense. It's like having a top-tier legal team on speed dial.", 
        author: "Elena Rodriguez", 
        role: "Founder, Reframe",
        image: "ER"
    },
];

export default function SocialProof() {
    return (
        <SectionWrapper className="relative py-32 bg-bg-base overflow-hidden">
            <PageContainer>
                <div className="mb-24 text-center">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-[0.4em] mb-12">
                        Trusted by the world's most innovative teams
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10 opacity-40 hover:opacity-100 transition-opacity duration-700">
                        {companies.map((company) => (
                            <span key={company} className="text-2xl font-black text-text-secondary italic tracking-tighter hover:text-accent transition-colors cursor-default">
                                {company}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.blockquote
                            key={testimonial.author}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group p-10 rounded-3xl bg-bg-primary border border-bg-tertiary hover:border-accent/30 hover:shadow-glow-accent transition-all duration-300"
                        >
                            <div className="absolute top-8 right-8">
                                <Quote className="w-10 h-10 text-bg-tertiary group-hover:text-accent/20 transition-colors" />
                            </div>
                            
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                ))}
                            </div>

                            <p className="relative z-10 text-text-secondary font-medium leading-relaxed mb-10 italic">
                                "{testimonial.quote}"
                            </p>
                            
                            <footer className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-xs font-bold text-bg-primary shadow-glow-accent">
                                    {testimonial.image}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-primary">{testimonial.author}</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{testimonial.role}</p>
                                </div>
                            </footer>
                        </motion.blockquote>
                    ))}
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}

