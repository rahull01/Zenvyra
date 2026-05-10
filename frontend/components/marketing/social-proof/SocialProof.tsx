"use client";

import React from "react";

import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Quote } from "lucide-react";

const companies = ["Stripe", "Notion", "Vercel", "Linear", "Figma", "Webflow", "Brex", "Loom"];
const testimonials = [
    { 
        quote: "The cleanest compliance workflow we have ever used. Our team moved from reactive to proactive in a week.", 
        author: "Priya Nair", 
        role: "VP Product, Orbit Labs" 
    },
    { 
        quote: "Auto-fix recommendations are precise and practical. Implementation quality feels enterprise-grade.", 
        author: "Daniel Park", 
        role: "Lead Engineer, Northline" 
    },
    { 
        quote: "Leadership now has trustworthy compliance visibility without manual audits every sprint.", 
        author: "Lena Ortiz", 
        role: "Head of Ops, Reframe" 
    },
];

export default function SocialProof() {
    return (
        <SectionWrapper className="relative py-24">
            <PageContainer>
                <div className="mb-20 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">
                        Operationalized by High-Growth Infrastructure Teams
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {companies.map((company) => (
                            <span key={company} className="text-xl font-display font-black text-slate-900 tracking-tighter italic">
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
                            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative premium-card p-10 group"
                        >
                            <Quote className="absolute top-8 right-8 w-8 h-8 text-slate-100 group-hover:text-brand-500/10 transition-colors duration-500" />
                            
                            <p className="relative z-10 text-slate-500 font-medium leading-relaxed mb-8">
                                "{testimonial.quote}"
                            </p>
                            
                            <footer className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-xs font-black text-white shadow-lg transition-transform duration-500 group-hover:scale-110">
                                    {testimonial.author.split(" ").map((name) => name[0]).join("")}
                                </div>
                                <div>
                                    <p className="text-sm font-display font-black text-slate-900">{testimonial.author}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{testimonial.role}</p>
                                </div>
                            </footer>
                        </motion.blockquote>
                    ))}
                </div>
            </PageContainer>
        </SectionWrapper>
    );
}
