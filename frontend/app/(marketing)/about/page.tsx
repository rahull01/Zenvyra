"use client";

import { Shield, Globe, Bot } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import AboutUsSection from "@/components/marketing/AboutUsSection";
import { MarketingCard, MarketingCardGrid } from "@/components/marketing/MarketingCard";

const principles = [
  { title: "Trust by default", description: "Every workflow is designed to create confidence for customers and regulators.", icon: Shield },
  { title: "Operational clarity", description: "Compliance data understandable to product, legal, and engineering at once.", icon: Globe },
  { title: "Speed without shortcuts", description: "Automation should reduce risk, not hide it.", icon: Bot },
];

export default function AboutPage() {
  return (
    <>
      <PageScaffold
        eyebrow="Company"
        title="About ComplianceAI Pro"
        subtitle="Built for companies that treat compliance as a product experience, not a checkbox."
        showCta={false}
      >
        <div className="standard-card !p-8 sm:!p-10 lg:!transform-none lg:hover:!translate-y-0">
          <h2 className="text-2xl font-bold text-text-primary">Our story</h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            ComplianceAI Pro started after seeing teams struggle with fragmented legal and product workflows.
            Shipping features was fast, but validating regulatory impact was slow and expensive. We built an
            AI-first workflow that scans, explains, and fixes issues in one place.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Today, our mission is simple: make global compliance clean, fast, and reliable for every modern
            product team.
          </p>
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/10 p-6">
            <p className="text-caption font-bold uppercase tracking-[0.15em] text-primary">Mission</p>
            <p className="mt-2 text-lg font-semibold text-text-primary">
              Help every internet business run high-trust operations without legal bottlenecks.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <MarketingCardGrid>
            {principles.map((item, i) => (
              <MarketingCard key={item.title} {...item} index={i} />
            ))}
          </MarketingCardGrid>
        </div>
      </PageScaffold>

      <AboutUsSection embedded />
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-secondary-dark px-8 py-12 text-center">
            <h2 className="text-2xl font-bold text-text-primary">Join us on the compliance journey</h2>
            <p className="mt-3 text-text-secondary">Start free — no credit card required.</p>
            <a href="/auth/signup" className="btn-primary mt-6 inline-flex !bg-background-primary !text-primary hover:!bg-background-secondary">
              Get started
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
