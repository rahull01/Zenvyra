"use client";

import { Globe2, ShieldCheck, Users, Award, Layers, Sparkles, Check } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { MarketingCard, MarketingCardGrid } from "@/components/marketing/MarketingCard";

const solutions = [
  { title: "SaaS", description: "Privacy, cookies, terms, and SSO workflows for subscription products.", icon: Globe2, href: "/products/privacy-policy" },
  { title: "Ecommerce", description: "Returns, cookies, payments, and customer data compliance out of the box.", icon: ShieldCheck, href: "/products/cookie-consent" },
  { title: "Agencies", description: "Multi-client domains, white-label portals, and bulk scans in one place.", icon: Users, href: "/dashboard/white-label" },
  { title: "Healthcare", description: "DSAR, privacy, and security controls built for regulated care teams.", icon: Award, href: "/dashboard/dsar" },
  { title: "Fintech", description: "Automated regulation alerts and legal policy generation for finance.", icon: Layers, href: "/products/ai-assistant" },
  { title: "Marketplaces", description: "Terms, acceptable use, and third-party risk monitoring at scale.", icon: Sparkles, href: "/products/terms-conditions" },
];

export default function SolutionsPage() {
  return (
    <PageScaffold
      eyebrow="Solutions"
      title="Compliance built for your industry"
      subtitle="ComplianceAI Pro adapts to your market and risk profile — one platform for product, legal, and security teams."
    >
      <MarketingCardGrid>
        {solutions.map((s, i) => (
          <MarketingCard key={s.title} {...s} index={i} />
        ))}
      </MarketingCardGrid>

      <div className="mt-16 standard-card !p-8 sm:!p-10 lg:grid lg:grid-cols-2 lg:gap-12 lg:!transform-none lg:hover:!translate-y-0">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-accent">Why teams choose us</p>
          <h2 className="mt-4 text-2xl font-bold text-text-primary sm:text-3xl">
            One platform that scales with your compliance program
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            Whether you run one website or hundreds, get shared visibility, audit-ready evidence, and AI-guided fixes.
          </p>
        </div>
        <ul className="mt-8 space-y-4 lg:mt-0">
          {[
            "Multi-tenant control center",
            "Risk-based task orchestration",
            "Policy version audit history",
            "Auto-updates when regulations change",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 rounded-lg border border-border-light bg-bg-secondary px-4 py-3">
              <Check className="h-5 w-5 shrink-0 text-success" />
              <span className="text-sm font-medium text-text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </PageScaffold>
  );
}
