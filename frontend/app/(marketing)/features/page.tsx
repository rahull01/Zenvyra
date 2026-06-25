'use client';

import React from 'react';
import { FileText, Cookie, ShieldCheck, Globe, Zap, BarChart3, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const features = [
  {
    title: "AI Policy Generator",
    description: "Generate counsel-ready policy drafts in minutes. Our AI helps align clauses with current privacy readiness requirements.",
    icon: FileText,
    color: "bg-primary-light text-primary",
    capabilities: ["GDPR & CCPA Ready", "Auto-update logic", "Custom branding", "Multi-language support"]
  },
  {
    title: "Cookie Consent Manager",
    description: "The most advanced cookie banner system. Geolocation-based targeting ensures you only show banners where required.",
    icon: Cookie,
    color: "bg-primary-light text-primary",
    capabilities: ["IAB TCF 2.3 Certified", "Google Consent Mode", "Deep scanning", "Custom UI themes"]
  },
  {
    title: "Compliance Monitoring",
    description: "We don't just generate policies; we monitor your site for privacy risk signals and tracking changes.",
    icon: ShieldCheck,
    color: "bg-primary-light text-primary",
    capabilities: ["Daily cookie scans", "DSAR automation", "Risk alerts", "Audit trails"]
  },
  {
    title: "Multi-Region Support",
    description: "One platform for global privacy readiness workflows, from GDPR-style notices to CCPA/CPRA consumer rights evidence.",
    icon: Globe,
    color: "bg-primary-light text-primary",
    capabilities: ["150+ countries", "Auto-detect location", "Region-specific policies", "Local language support"]
  },
  {
    title: "Real-Time Analytics",
    description: "Track consent rates, banner performance, and compliance status with our comprehensive analytics dashboard.",
    icon: BarChart3,
    color: "bg-primary-light text-primary",
    capabilities: ["Consent rate tracking", "Banner performance", "Compliance score", "Custom reports"]
  },
  {
    title: "AI Auto-Fix",
    description: "Our AI automatically detects compliance issues and suggests fixes before they become problems.",
    icon: Zap,
    color: "bg-primary-light text-primary",
    capabilities: ["Issue detection", "Auto-suggested fixes", "One-click apply", "Proactive monitoring"]
  }
];

export default function FeaturesPage() {
  return (
    <div className="bg-background-primary min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 text-center max-w-[1400px] mx-auto">
        <span className="text-eyebrow font-bold text-primary uppercase tracking-[0.15em]">
          FEATURES
        </span>
        <h1 className="text-h1 font-extrabold text-text-primary mt-4 mb-6 tracking-tight">
          Everything You Need to Stay Review-Ready
        </h1>
        <p className="text-body-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          From policy generation to real-time monitoring, Zenvyra provides the tools you need to prepare evidence and stay review-ready across global privacy laws.
        </p>
        <div className="pt-8 flex justify-center gap-4">
          <Button variant="default" size="lg">Get Started Free</Button>
          <Button variant="outline" size="lg">Talk to Sales</Button>
        </div>
      </section>

      {/* Detailed Features Grid */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-[1400px] mx-auto space-y-32">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className={cn(
                "flex flex-col lg:items-center gap-12 lg:gap-24",
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              <div className="flex-1 space-y-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-h2 font-extrabold text-text-primary tracking-tight">{feature.title}</h2>
                  <p className="text-body-lg text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary stroke-[3]" />
                      </div>
                      <span className="text-body-sm font-semibold text-text-primary">{cap}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="text-primary hover:bg-primary-light">
                  Learn more <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="aspect-[4/3] bg-background-primary rounded-3xl border border-border-light shadow-card-hover p-4 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-full h-full bg-background-secondary rounded-2xl border border-border-light flex items-center justify-center text-text-tertiary">
                    <div className="text-center space-y-3">
                      <Zap className="w-8 h-8 mx-auto opacity-20" />
                      <p className="text-caption font-bold uppercase tracking-[0.05em]">Interactive Demo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-h2 font-extrabold text-text-primary mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-body-lg text-text-secondary mb-8">
            Build a repeatable privacy readiness workflow with Zenvyra.
          </p>
          <Button variant="default" size="lg">
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
}
