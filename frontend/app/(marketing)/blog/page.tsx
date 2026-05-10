import PageScaffold from "@/components/marketing/PageScaffold";
import { ArrowRight } from "lucide-react";

const posts = [
  { title: "Designing trust-first SaaS onboarding", date: "Apr 8, 2026", summary: "Patterns to align product UX and privacy compliance from day one." },
  { title: "How monitoring reduced incident response time", date: "Mar 26, 2026", summary: "A practical framework for routing compliance issues by severity." },
  { title: "Modern policy UX that users actually read", date: "Mar 4, 2026", summary: "Design and copy principles for legal pages with high clarity." },
];

export default function BlogPage() {
  return (
    <PageScaffold title="Blog" subtitle="Insights on compliance operations, product design, and trust engineering.">
      <div className="grid gap-4">
        {posts.map((post, index) => (
          <article
            key={post.title}
            className={`group rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-[0_18px_55px_-38px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-premium md:p-8 ${
              index === 0 ? "md:p-10" : ""
            }`}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">{post.date}</p>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{post.title}</h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">{post.summary}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-700">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}
