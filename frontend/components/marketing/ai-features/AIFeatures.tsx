"use client";

import { motion } from "framer-motion";
import { Brain, Cpu, TrendingUp, Bell } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

const items = [
  { icon: Brain, title: "Neural Scoring", description: "Predict compliance risk with AI models trained on 200+ legal signals." },
  { icon: Cpu, title: "Auto-Updates", description: "Policies refresh automatically when regulations shift or risk rises." },
  { icon: TrendingUp, title: "Smart Classification", description: "AI classifies cookies, scripts, and regulatory requirements instantly." },
  { icon: Bell, title: "Predictive Alerts", description: "Receive high-priority recommendations before compliance gaps become audits." },
];

export default function AIFeatures() {
  return (
    <SectionWrapper className="relative py-32 bg-bg-secondary text-text-primary overflow-hidden">
      <PageContainer>
        <div className="relative z-10 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              AI-first capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
              AI that understands compliance, not just scans it.
            </h2>
            <p className="max-w-xl text-lg text-text-secondary leading-relaxed">
              Built for legal teams, rushed product teams, and regulated enterprises — our AI layer delivers explainable actions, not just findings.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.slice(0, 2).map((item, index) => (
                <FeatureCard key={item.title} item={item} delay={index * 0.1} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.slice(2).map((item, index) => (
              <FeatureCard key={item.title} item={item} delay={index * 0.1 + 0.15} />
            ))}
          </div>
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}

function FeatureCard({ item, delay }: { item: { icon: typeof Brain; title: string; description: string }; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="rounded-[2rem] border border-bg-tertiary bg-bg-primary/90 p-8 shadow-2xl"
    >
      <div className="h-14 w-14 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mb-5">
        <item.icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{item.title}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
    </motion.div>
  );
}
