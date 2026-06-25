"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Headphones,
  HelpCircle,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";

const resourceCategories = [
  { title: "Guides", description: "Detailed playbooks for GDPR, CCPA, UK GDPR, cookies, DSAR, and website trust.", icon: BookOpen, href: "/guides", count: "18 guides" },
  { title: "Templates", description: "Launch-ready checklists for policy updates, cookie audits, vendor reviews, and consent QA.", icon: ClipboardCheck, href: "/templates", count: "22 templates" },
  { title: "Documentation", description: "Developer instructions for banners, embeds, public proof pages, and API workflows.", icon: FileText, href: "/documentation", count: "API + setup" },
  { title: "Webinars", description: "Practical sessions on privacy operations for founders, agencies, and product teams.", icon: Headphones, href: "/webinars", count: "Monthly" },
  { title: "Blog", description: "Operator notes on compliance automation, trust pages, policy drift, and AI governance.", icon: Newspaper, href: "/blog", count: "Weekly" },
  { title: "Help Center", description: "Fast answers for setup, scanning, consent logs, billing, and team workspaces.", icon: HelpCircle, href: "/help", count: "Support" },
];

const featured = [
  {
    title: "Website privacy launch checklist",
    description: "A founder-friendly checklist for policy pages, cookie consent, tracking scripts, privacy center, and proof links.",
    href: "/guides",
    label: "Guide",
    readingTime: "12 min",
  },
  {
    title: "Agency monthly compliance report template",
    description: "A reusable structure for presenting scans, risk movement, resolved issues, and next actions to clients.",
    href: "/templates",
    label: "Template",
    readingTime: "6 min",
  },
  {
    title: "Cookie scanner implementation notes",
    description: "How to review detected trackers, match categories, and confirm consent behavior before production changes.",
    href: "/documentation",
    label: "Docs",
    readingTime: "9 min",
  },
];

const tracks = [
  {
    title: "Founder launch track",
    icon: Sparkles,
    steps: ["Run first readiness scan", "Publish baseline policies", "Install consent banner", "Share proof page"],
  },
  {
    title: "Agency operator track",
    icon: Workflow,
    steps: ["Import client portfolio", "Schedule monthly scans", "Export proof packs", "Track client remediation"],
  },
  {
    title: "Enterprise governance track",
    icon: ShieldCheck,
    steps: ["Map regions and vendors", "Assign issue owners", "Review evidence trail", "Prepare executive summary"],
  },
];

const stats = [
  { value: "50+", label: "operator assets" },
  { value: "4", label: "workflow tracks" },
  { value: "UK + US", label: "primary coverage" },
  { value: "AI-first", label: "practical guidance" },
];

function CategoryIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-600">
      <Icon className="h-5 w-5" />
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <PageScaffold
      eyebrow="Resources"
      title="A practical library for teams turning compliance into product trust"
      subtitle="Use guides, templates, documentation, webinars, and support content built around the same workflows Zenvyra automates."
      heroExtra={
        <>
          <Link href="/guides" className="btn-primary">
            Browse guides
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/documentation" className="btn-secondary">
            Read docs
          </Link>
        </>
      }
    >
      <div className="space-y-16">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="text-sm font-extrabold text-slate-950">Search across the Zenvyra operating library</p>
              <p className="mt-1 text-sm text-slate-500">Find playbooks, product docs, consent QA steps, and agency templates.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search resources..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                aria-label="Search resources"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-extrabold text-slate-950">{stat.value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-600">Featured</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950">Start with the assets teams use every week</h2>
            </div>
            <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-extrabold text-orange-600">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featured.map((item) => (
              <Link key={item.title} href={item.href} className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_70px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-orange-700">{item.label}</span>
                  <span className="text-xs font-bold text-slate-400">{item.readingTime}</span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold leading-tight text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-orange-600">
                  Open resource
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resourceCategories.map((category) => (
            <Link key={category.title} href={category.href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_70px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <CategoryIcon icon={category.icon} />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">{category.count}</span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-950">{category.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-orange-600">
                Explore
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
          <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-200">
                <CalendarDays className="h-4 w-4" />
                Learning tracks
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-white">Resource paths mapped to real operating roles</h2>
              <p className="mt-4 text-base leading-8 text-slate-300">
                Each path is designed around a job to be done: launch, manage clients, or govern a complex website estate.
              </p>
            </div>
            <div className="grid gap-0 lg:grid-cols-3">
              {tracks.map((track) => (
                <div key={track.title} className="border-white/10 p-8 lg:border-l lg:first:border-l-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                    <track.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-white">{track.title}</h3>
                  <div className="mt-5 space-y-3">
                    {track.steps.map((step) => (
                      <div key={step} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span className="text-sm leading-6 text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-orange-200 bg-orange-50 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-700">Operator intelligence</p>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950">Make every resource actionable inside the product</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Resources are written to pair with scans, policy versions, consent logs, and proof packs so your team can move from reading to execution.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Scanner-informed guides", icon: BarChart3 },
                { label: "Implementation checklists", icon: ClipboardCheck },
                { label: "Audit evidence examples", icon: ShieldCheck },
                { label: "Founder and agency workflows", icon: Workflow },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white p-4">
                  <item.icon className="h-5 w-5 shrink-0 text-orange-600" />
                  <span className="text-sm font-extrabold text-slate-800">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageScaffold>
  );
}
