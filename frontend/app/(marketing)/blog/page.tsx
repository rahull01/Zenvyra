import Link from "next/link";
import PageScaffold from "@/components/marketing/PageScaffold";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "eu-ai-act-readiness-2026",
    title: "EU AI Act Readiness: 2026 Implementation Checklist",
    date: "Jul 4, 2026",
    summary: "Essential steps every AI startup should complete before EU AI Act enforcement begins.",
  },
  {
    slug: "ai-risk-classification-guide",
    title: "AI Risk Classification Under the EU AI Act",
    date: "Jun 28, 2026",
    summary: "How to tell if your AI system is prohibited, high-risk, limited-risk, or general-purpose AI.",
  },
  {
    slug: "high-risk-ai-transparency",
    title: "High-Risk AI Systems: Transparency & Documentation Requirements",
    date: "Jun 21, 2026",
    summary: "Documentation, notices, and proof-pack requirements for high-risk AI deployments.",
  },
  {
    slug: "gpai-provider-checklist",
    title: "GPAI Provider Checklist: EU AI Act Obligations for Foundation Models",
    date: "Jun 14, 2026",
    summary: "What general-purpose AI model providers must document and disclose under the EU AI Act.",
  },
  {
    slug: "ai-startup-compliance-automation",
    title: "How AI Startups Can Automate Compliance Without a Legal Team",
    date: "Jun 7, 2026",
    summary: "Practical compliance operations that keep engineering fast and regulators happy.",
  },
];

export default function BlogPage() {
  return (
    <PageScaffold eyebrow="Resources" title="Blog" subtitle="Insights on compliance operations, product design, and trust engineering.">
      <div className="grid gap-4">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`group block standard-card !p-6 md:!p-8 ${index === 0 ? "md:!p-10" : ""}`}
          >
          <article>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-caption font-bold uppercase tracking-[0.15em] text-primary">{post.date}</p>
                <h2 className="mt-3 text-2xl font-bold text-text-primary">{post.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">{post.summary}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-light bg-background-secondary text-text-muted transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10 group-hover:text-primary">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </article>
          </Link>
        ))}
      </div>
    </PageScaffold>
  );
}
