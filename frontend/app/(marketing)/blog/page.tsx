import Link from "next/link";
import PageScaffold from "@/components/marketing/PageScaffold";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "gdpr-checklist-2026",
    title: "GDPR Compliance Checklist for 2026",
    date: "May 15, 2026",
    summary: "Essential steps every SaaS team should complete before your next audit.",
  },
  {
    slug: "cookie-consent-best-practices",
    title: "Cookie Consent Best Practices",
    date: "May 8, 2026",
    summary: "How to design banners that convert while staying compliant globally.",
  },
  {
    slug: "ccpa-vs-gdpr",
    title: "CCPA vs GDPR: Key Differences",
    date: "Apr 28, 2026",
    summary: "A practical comparison for teams operating in the US and EU.",
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
