"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, Check, ChevronDown, ChevronUp, Clock3, FileCheck2, Gauge, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/pricing-plans";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const setupPackage = {
  name: "Founder Setup",
  price: "$199 / GBP 159 one-time",
  description: "A guided launch package for one UK or US business website.",
  cta: "Book setup",
  href: "/contact",
  badge: "Fastest to value",
  features: [
    "AI usage, privacy, cookie, terms, refund, and shipping policy drafts",
    "Cookie banner and consent preferences",
    "Initial AI readiness and privacy proof PDF report",
    "Privacy-safe public trust certificate",
    "Shopify, WordPress, Webflow, or custom-code fix steps",
  ],
};

const comparisonRows = [
  {
    feature: "AI Act readiness",
    legacyTools: "Strong",
    Zenvyra: "AI inventory, readiness gaps, transparency drafts, and counsel-review evidence",
  },
  {
    feature: "Policy generator",
    legacyTools: "Mature CMP",
    Zenvyra: "AI usage, privacy, cookie, and product policy drafts plus version history",
  },
  {
    feature: "Website monitoring",
    legacyTools: "Scheduled cookie scans",
    Zenvyra: "AI readiness, cookie, policy, DSAR, and tracker drift monitoring for UK/US/EU-facing sites",
  },
  {
    feature: "Fix instructions",
    legacyTools: "Mostly self-serve setup",
    Zenvyra: "Platform-specific remediation steps",
  },
  {
    feature: "Public proof",
    legacyTools: "Consent records",
    Zenvyra: "Privacy-safe certificate, scan history, policy versions, and audit pack",
  },
  {
    feature: "Enterprise economics",
    legacyTools: "Custom enterprise pricing",
    Zenvyra: "Transparent unlimited-site Enterprise plan",
  },
];

const faqs = [
  {
    q: "Is this legal advice?",
    a: "No. Zenvyra is readiness automation software, not a law firm. It helps teams create EU AI Act readiness evidence, detect issues, and maintain policy/consent workflows. High-risk legal decisions should still be reviewed by qualified counsel.",
  },
  {
    q: "Why is there a setup package?",
    a: "Most small businesses do not want another tool to configure. The setup package gets the first policies, banner, scan report, certificate, and fix list live quickly, then monitoring keeps the work current.",
  },
  {
    q: "How is this different from basic policy tools?",
    a: "Basic policy tools focus on documents and cookie banners. Zenvyra starts with EU AI Act readiness, then supports it with continuous proof: monitoring, public certificates, DSAR deadlines, audit packs, and implementation fixes.",
  },
  {
    q: "Can enterprises use this?",
    a: "Yes. The Enterprise plan is built for AI teams that need unlimited sites, SSO, white-label proof packs, and dedicated support.",
  },
];

const valueCards = [
  {
    title: "Launch proof faster",
    description: "Go from AI inventory to readiness gaps, policy baseline, banner, certificate, and first fix list without stitching together separate tools.",
    icon: Clock3,
    stat: "Same day",
  },
  {
    title: "Reduce client reporting work",
    description: "Enterprise plans package scan movement, unresolved issues, proof links, and white-label reports for recurring retainers.",
    icon: FileCheck2,
    stat: "Unlimited sites",
  },
  {
    title: "Monitor drift continuously",
    description: "Pricing is built around ongoing AI and privacy proof, not one-time documents that go stale after the next marketing release.",
    icon: BarChart3,
    stat: "24/7",
  },
];

const implementationSteps = [
  { title: "Inventory AI systems", text: "Map providers, use cases, EU user exposure, transparency needs, and oversight gaps.", icon: Gauge },
  { title: "Choose a readiness tier", text: "Select the plan based on AI workflow, website count, and client needs.", icon: BadgeCheck },
  { title: "Ship the first fixes", text: "Use remediation steps and setup support to turn findings into visible progress.", icon: Workflow },
  { title: "Keep evidence current", text: "Monitor changes, publish proof pages, and export reports when teams ask.", icon: ShieldCheck },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    track("pricing_view");
  }, []);
  const subscriptionPlans = PRICING_PLANS.map((plan) => ({
    ...plan,
    price: plan.monthlyPrice === 0 ? "$0 / GBP 0" : `$${plan.monthlyPrice}/mo`,
    description: plan.id === "free"
      ? "For AI founders who want to see AI Act risk before buying."
      : plan.id === "enterprise"
        ? "Unlimited AI Act readiness, white-label proof packs, SSO, and dedicated support."
        : "Recurring AI Act readiness and compliance monitoring aligned with product entitlements.",
    cta: plan.id === "enterprise" ? "Talk to founder" : plan.id === "free" ? "Start free scan" : "Start readiness",
    href: plan.id === "enterprise" ? "/contact" : "/auth/signup",
    badge: plan.id === "pro" ? "Most Popular" : plan.id === "enterprise" ? "Enterprise" : plan.id === "free" ? "No card" : "Starter",
    featured: plan.id === "pro",
    variant: plan.id === "pro" ? "default" as const : "outline" as const,
  }));

  return (
    <main className="min-h-screen bg-background-primary">
      <section className="px-6 py-24">
        <div className="mx-auto max-w-[1200px] text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            EU AI Act readiness packages
          </div>
          <h1 className="mx-auto max-w-4xl text-h1 font-extrabold tracking-tight text-text-primary">
            Pricing built to get your first AI readiness proof pack live, not just create another policy page.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-text-secondary">
            Start with AI system readiness, launch the supporting privacy essentials with guided setup, then keep your evidence monitored with reports customers and clients can trust.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1200px] gap-5 md:grid-cols-3">
          {valueCards.map((card) => (
            <div key={card.title} className="rounded-[24px] border border-border-light bg-white p-6 text-left shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary">
                  <card.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-background-secondary px-3 py-1 text-caption font-extrabold uppercase text-text-secondary">
                  {card.stat}
                </span>
              </div>
              <h2 className="mt-5 text-h4 font-extrabold text-text-primary">{card.title}</h2>
              <p className="mt-3 text-body-sm leading-relaxed text-text-secondary">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 grid max-w-[1200px] gap-6 md:grid-cols-2 xl:grid-cols-4">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex min-h-[560px] flex-col rounded-[28px] border bg-white p-7 shadow-card transition-all",
                plan.featured ? "border-primary shadow-card-hover ring-2 ring-primary/10" : "border-border-light hover:border-border-medium"
              )}
            >
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-background-secondary px-3 py-1.5 text-caption font-bold uppercase tracking-[0.08em] text-text-secondary">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                {plan.badge}
              </div>
              <h2 className="text-h4 font-semibold text-text-primary">{plan.name}</h2>
              <p className="mt-3 min-h-[54px] text-body-sm leading-relaxed text-text-secondary">{plan.description}</p>
              <div className="mt-7 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-text-primary">{plan.price}</span>
              </div>
              <p className="mt-2 text-caption font-semibold uppercase text-text-tertiary">
                Backend plan: {plan.backendPlanType} | {plan.limits.websites} website{plan.limits.websites === 1 ? "" : "s"}
              </p>
              <Button asChild variant={plan.variant} className="mt-7 w-full rounded-2xl" onClick={() => track("pricing_cta_click", { plan: plan.id, price: plan.monthlyPrice })}>
                <Link href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <div className="mt-7 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                    <span className="text-body-sm leading-relaxed text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-[1200px] rounded-[28px] border border-primary/20 bg-primary/5 p-7">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-caption font-bold uppercase tracking-[0.08em] text-primary">
                <BadgeCheck className="h-3.5 w-3.5" />
                {setupPackage.badge}
              </div>
              <h2 className="text-h4 font-semibold text-text-primary">{setupPackage.name}</h2>
              <p className="mt-3 text-body-sm leading-relaxed text-text-secondary">{setupPackage.description}</p>
              <div className="mt-5 text-3xl font-extrabold tracking-tight text-text-primary">{setupPackage.price}</div>
            </div>
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                {setupPackage.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                    <span className="text-body-sm leading-relaxed text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-6 rounded-2xl" onClick={() => track("pricing_setup_package_click")}>
                <Link href={setupPackage.href}>
                  {setupPackage.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border-light bg-white px-6 py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-eyebrow font-bold uppercase tracking-[0.15em] text-primary">Implementation path</p>
              <h2 className="mt-4 text-h2 font-extrabold text-text-primary">Every plan is priced around a real workflow</h2>
            </div>
            <p className="text-body leading-relaxed text-text-secondary">
              The value is not another generated document. The value is the operating loop: inventory, assess, fix, and prove the state of your AI and privacy workflows over time.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {implementationSteps.map((step, index) => (
              <div key={step.title} className="rounded-[24px] border border-border-light bg-background-secondary p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-caption font-extrabold uppercase text-text-tertiary">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-h4 font-extrabold text-text-primary">{step.title}</h3>
                <p className="mt-3 text-body-sm leading-relaxed text-text-secondary">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-secondary px-6 py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-eyebrow font-bold uppercase tracking-[0.15em] text-primary">Competitive value</p>
            <h2 className="mt-4 text-h2 font-extrabold text-text-primary">
              Where Zenvyra goes beyond a policy-and-banner tool for AI-enabled teams
            </h2>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-border-light bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-background-secondary">
                  <tr>
                    <th className="p-5 text-left text-body-sm font-bold text-text-primary">Capability</th>
                    <th className="p-5 text-left text-body-sm font-bold text-text-primary">Legacy policy tools</th>
                    <th className="p-5 text-left text-body-sm font-bold text-primary">Zenvyra</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-t border-border-light">
                      <td className="p-5 text-body-sm font-semibold text-text-primary">{row.feature}</td>
                      <td className="p-5 text-body-sm text-text-secondary">{row.legacyTools}</td>
                      <td className="p-5 text-body-sm text-text-secondary">{row.Zenvyra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="rounded-[28px] border border-border-light bg-background-secondary p-8">
            <ShieldCheck className="mb-5 h-10 w-10 text-primary" />
            <h2 className="text-h3 font-extrabold text-text-primary">Trust is the product.</h2>
            <p className="mt-4 text-body leading-relaxed text-text-secondary">
              Early buyers do not switch because the UI has more features. They switch when you show AI readiness proof, remove setup work, and help them fix problems faster than a self-serve tool. Zenvyra supports operational workflows and is not a substitute for legal advice.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="overflow-hidden rounded-[20px] border border-border-light bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-background-secondary"
                >
                  <span className="text-body font-semibold text-text-primary">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-text-tertiary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-text-tertiary" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-body leading-relaxed text-text-secondary">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
