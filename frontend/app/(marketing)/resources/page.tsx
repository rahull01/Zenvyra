"use client";

import Link from "next/link";
import { Search, BookOpen, FileText, BarChart3, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import { MarketingCard, MarketingCardGrid } from "@/components/marketing/MarketingCard";

const categories = [
  { title: "Guides", description: "Step-by-step compliance playbooks for GDPR, CCPA, and more.", icon: BookOpen, href: "/guides" },
  { title: "Documentation", description: "Developer-first integration and API reference.", icon: FileText, href: "/documentation" },
  { title: "Blog", description: "Expert insights on privacy law and product compliance.", icon: BarChart3, href: "/blog" },
  { title: "Webinars", description: "Live sessions and on-demand recordings from our team.", icon: Sparkles, href: "/webinars" },
  { title: "Help Center", description: "Answers to common security and compliance questions.", icon: HelpCircle, href: "/help" },
];

export default function ResourcesPage() {
  return (
    <PageScaffold
      eyebrow="Resources"
      title="Knowledge base for modern compliance teams"
      subtitle="Templates, documentation, webinars, and tutorials to help you ship compliant products faster."
    >
      <div className="standard-card mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between !transform-none hover:!translate-y-0">
        <div>
          <p className="text-sm font-semibold text-text-primary">Search the knowledge base</p>
          <p className="mt-1 text-sm text-text-muted">Policies, docs, guides, and more</p>
        </div>
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" aria-hidden />
          <input type="search" placeholder="Search resources..." className="search-input" aria-label="Search resources" />
        </div>
      </div>

      <MarketingCardGrid cols={3}>
        {categories.map((c, i) => (
          <MarketingCard key={c.title} {...c} index={i} />
        ))}
      </MarketingCardGrid>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/blog" className="btn-secondary text-sm">
          Read the blog
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/help" className="btn-ghost text-sm">
          Visit help center
        </Link>
      </div>
    </PageScaffold>
  );
}
