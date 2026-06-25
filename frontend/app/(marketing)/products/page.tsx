"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Globe2,
  Shield,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  FileText,
} from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { MarketingCard, MarketingCardGrid } from "@/components/marketing/MarketingCard";

const tabs = [
  { key: "all", label: "All" },
  { key: "policy", label: "Policy" },
  { key: "consent", label: "Consent" },
  { key: "scan", label: "Scanning" },
  { key: "ai", label: "AI" },
];

const products = [
  { title: "Privacy Policy Generator", description: "GDPR, CCPA, LGPD and global privacy policies in minutes.", category: "policy", icon: FileText, href: "/products/privacy-policy" },
  { title: "Terms & Conditions", description: "SaaS, marketplace, and ecommerce templates with audit-ready language.", category: "policy", icon: FileText, href: "/products/terms-conditions" },
  { title: "Cookie Consent Manager", description: "Geo-aware banners, preference center, and Consent Mode v2.", category: "consent", icon: ClipboardCheck, href: "/products/cookie-consent" },
  { title: "Cookie Scanner", description: "Detect cookies, trackers, and consent gaps automatically.", category: "consent", icon: Globe2, href: "/products/cookie-scanner" },
  { title: "Website Scanner", description: "Find compliance issues in scripts, cookies, and metadata.", category: "scan", icon: Globe2, href: "/compliance-checker" },
  { title: "Compliance Monitoring", description: "Continuous monitoring for policy drift and vendor risk.", category: "scan", icon: ShieldCheck, href: "/dashboard/monitor" },
  { title: "AI Compliance Assistant", description: "Ask questions and get jurisdiction-specific guidance.", category: "ai", icon: Sparkles, href: "/products/ai-assistant" },
  { title: "Competitor Audit", description: "Benchmark your posture against industry peers.", category: "ai", icon: BarChart3, href: "/products/competitor-audit" },
  { title: "DSAR Automation", description: "Subject access request workflows with audit evidence.", category: "ai", icon: Zap, href: "/dashboard/dsar" },
  { title: "Team & Governance", description: "Roles, approvals, and shared compliance dashboards.", category: "policy", icon: Users, href: "/dashboard/team" },
];

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const filtered = useMemo(
    () => products.filter((p) => activeTab === "all" || p.category === activeTab),
    [activeTab]
  );

  return (
    <PageScaffold
      eyebrow="Products"
      title="Everything you need to stay review-ready"
      subtitle="Policy generation, cookie consent, scanning, and AI readiness automation - one trusted platform for modern teams."
      heroExtra={
        <Link href="/auth/signup" className="btn-primary">
          Start free trial
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-accent text-white shadow-btn-shadow"
                : "border border-border-light bg-white text-text-secondary hover:border-border-medium hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <MarketingCardGrid>
          {filtered.map((p, i) => (
            <MarketingCard key={p.title} {...p} index={i} />
          ))}
        </MarketingCardGrid>
      </div>
    </PageScaffold>
  );
}
