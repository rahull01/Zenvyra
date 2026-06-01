"use client";

import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { ArrowRight, Layers, ShieldCheck, Sparkles, Globe2 } from "lucide-react";

const products = [
  { title: "Policy Generator", description: "Generate GDPR, CCPA, LGPD and custom legal policies in minutes.", icon: Layers },
  { title: "Cookie Consent", description: "Advanced banners with geo-targeting, consent logs and auto-blocking.", icon: ShieldCheck },
  { title: "Website Scanner", description: "Deep scans for cookies, accessibility, script risk and policy gaps.", icon: Globe2 },
  { title: "AI Insights", description: "Actionable recommendations with effort and impact scoring.", icon: Sparkles },
  { title: "DSAR Automation", description: "End-to-end subject access request workflows with audit trails.", icon: ArrowRight },
  { title: "Team Collaboration", description: "Permission controls, activity logs and enterprise SSO support.", icon: ArrowRight },
  { title: "Competitor Benchmarking", description: "Compare compliance posture with industry rivals and uncover gaps.", icon: Layers },
  { title: "Policy Deployments", description: "Embed policies across platforms with auto-update workflows.", icon: ShieldCheck },
  { title: "Ai Chat", description: "Ask compliance questions and get context-aware policy answers.", icon: Sparkles },
  { title: "Regulation Alerts", description: "Receive AI summarized updates for GDPR, CCPA and global law changes.", icon: Globe2 },
  { title: "Consent Analytics", description: "Track consent rates by country, device and category.", icon: ArrowRight },
  { title: "White-label", description: "Brand the platform for your agency or enterprise customers.", icon: ArrowRight },
  { title: "Billing & Usage", description: "Manage plans, invoices, payment methods and consumption in one view.", icon: Layers },
  { title: "Security Center", description: "Audit logs, session controls and HTTP security posture monitoring.", icon: ShieldCheck },
];

export default function ProductShowcase() {
  return (
    <SectionWrapper className="relative py-32 bg-bg-base overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_35%)]" />
      <PageContainer>
        <div className="relative z-10">
          <div className="mb-16 max-w-3xl text-center mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">Product suite</p>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
              One platform, every compliance capability.
            </h2>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed">
              Build policies, run scans, manage consent, and keep every region covered with AI workflows designed for product and legal teams.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group relative overflow-hidden rounded-[2rem] border border-bg-tertiary bg-bg-primary/80 p-8 shadow-glow-ai transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-accent/10 text-accent mb-6">
                  <product.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{product.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{product.description}</p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-accent">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
