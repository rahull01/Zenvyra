"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Crown, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/pricing-plans";

const planIcons = {
  free: Shield,
  growth: Zap,
  pro: Zap,
  agency: Crown,
};

export default function PricingCards() {
  return (
    <SectionWrapper className="relative overflow-hidden bg-bg-base py-32">
      <PageContainer>
        <div className="relative z-10 mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Backend-Aligned Plans</span>
          </div>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-text-primary md:text-6xl">
            Subscription plans tied to product entitlements.
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-text-secondary">
            Public pricing uses the same plan names, website limits, and feature gates enforced by the backend.
          </p>
        </div>

        <div className="relative z-10 grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-4">
          {PRICING_PLANS.map((plan, index) => {
            const Icon = planIcons[plan.id];
            const featured = plan.id === "pro";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl border p-8 transition-all duration-300 ${
                  featured
                    ? "z-20 border-accent bg-bg-primary shadow-glow-accent"
                    : "border-bg-tertiary bg-bg-secondary/50 hover:border-accent/30"
                }`}
              >
                {featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-[10px] font-black uppercase tracking-widest text-bg-primary shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${
                    featured ? "border-accent bg-accent text-bg-primary" : "border-bg-tertiary bg-bg-base text-text-primary"
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-text-primary">{plan.name}</h3>
                  <p className="text-sm font-medium text-text-secondary">
                    Backend plan: {plan.backendPlanType}. Limit: {plan.limits.websites} website{plan.limits.websites === 1 ? "" : "s"}.
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tight text-text-primary">${plan.monthlyPrice}</span>
                    <span className="text-sm font-bold uppercase tracking-widest text-text-muted">/ month</span>
                  </div>
                </div>

                <ul className="mb-10 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                        featured ? "bg-accent/20 text-accent" : "bg-bg-tertiary text-text-muted"
                      }`}>
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={featured ? "default" : "outline"}
                  className="h-14 w-full rounded-2xl text-xs font-bold uppercase tracking-widest"
                >
                  <Link href={plan.id === "agency" ? "/contact" : "/auth/signup"}>
                    {plan.id === "agency" ? "Contact Sales" : "Get Started"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
