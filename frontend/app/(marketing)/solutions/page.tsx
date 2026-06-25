"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  FileCheck2,
  Gauge,
  GitBranch,
  Globe2,
  LockKeyhole,
  Rocket,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";

const audiences = [
  {
    title: "For Startups",
    href: "/solutions/startups",
    icon: Rocket,
    badge: "Launch faster",
    description: "Build the first trust layer before checkout, investor diligence, paid ads, or enterprise pilots.",
    outcomes: ["Free readiness scan", "Policy and cookie baseline", "Founder-friendly fix list", "Public proof page"],
  },
  {
    title: "For Agencies",
    href: "/solutions/agencies",
    icon: Users,
    badge: "White-label scale",
    description: "Manage compliance for client portfolios without spreadsheets, scattered exports, or manual reporting.",
    outcomes: ["50-site client workspace", "White-label proof packs", "Client issue queues", "Recurring monitoring"],
  },
  {
    title: "For Enterprise",
    href: "/solutions/enterprise",
    icon: Building2,
    badge: "Governance ready",
    description: "Give legal, security, marketing, and engineering a single operating system for website trust.",
    outcomes: ["Audit-ready trails", "Region-level coverage", "Ownership workflows", "Executive reporting"],
  },
];

const workflows = [
  { title: "Scan", text: "Detect cookies, trackers, policy gaps, missing consent states, and trust-page drift.", icon: ScanLine },
  { title: "Prioritize", text: "Rank findings by legal exposure, user trust impact, and implementation effort.", icon: Gauge },
  { title: "Fix", text: "Turn each issue into platform-specific remediation steps your team can actually ship.", icon: Workflow },
  { title: "Prove", text: "Publish privacy-safe certificates, proof packs, version history, and monitoring evidence.", icon: FileCheck2 },
];

const useCases = [
  {
    title: "Pre-launch compliance room",
    description: "Before a product launch, Zenvyra gives founders and operators a clean checklist covering privacy policy, terms, cookie disclosures, consent banner setup, and public proof.",
    icon: BadgeCheck,
  },
  {
    title: "Client portfolio operations",
    description: "Agencies can onboard every client site, scan drift, package reports, and run monthly compliance maintenance with one repeatable workflow.",
    icon: GitBranch,
  },
  {
    title: "Marketing site governance",
    description: "Enterprise growth teams can move fast while legal and security get evidence for cookies, vendors, policy versions, and consent changes.",
    icon: LockKeyhole,
  },
  {
    title: "Regulatory readiness checks",
    description: "Teams can monitor GDPR, UK GDPR, PECR, CCPA-style expectations, DSAR readiness, and privacy-center completeness from a single dashboard.",
    icon: Globe2,
  },
];

const metrics = [
  { value: "10 min", label: "first scan to risk map" },
  { value: "4 layers", label: "policy, consent, scan, proof" },
  { value: "50 sites", label: "agency workspace coverage" },
  { value: "24/7", label: "monitoring posture" },
];

function IconPanel({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-600">
      <Icon className="h-6 w-6" aria-hidden />
    </div>
  );
}

export default function SolutionsPage() {
  return (
    <PageScaffold
      eyebrow="Solutions"
      title="Compliance workflows for every team that ships online trust"
      subtitle="Zenvyra turns privacy, cookies, policies, monitoring, and proof into one operating layer for startups, agencies, and enterprise teams."
      heroExtra={
        <>
          <Link href="/auth/signup" className="btn-primary">
            Start free scan
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="btn-secondary">
            Talk to founder
          </Link>
        </>
      }
    >
      <div className="space-y-16">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-extrabold tracking-tight text-slate-950">{metric.value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {audiences.map((audience) => (
            <Link
              key={audience.title}
              href={audience.href}
              className="group flex min-h-[430px] flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-center justify-between gap-4">
                <IconPanel icon={audience.icon} />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                  {audience.badge}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-extrabold text-slate-950">{audience.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{audience.description}</p>
              <div className="mt-6 space-y-3">
                {audience.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">{outcome}</span>
                  </div>
                ))}
              </div>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-extrabold text-orange-600">
                Explore solution
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-200">
                <Sparkles className="h-4 w-4" />
                Operating system
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">One loop from risk detection to customer-facing proof</h2>
              <p className="mt-4 text-base leading-8 text-slate-300">
                The product is designed around the work real teams repeat every month: inspect the site, prioritize risk, ship fixes, and prove the posture changed.
              </p>
            </div>
            <div className="grid gap-0 sm:grid-cols-2">
              {workflows.map((workflow, index) => (
                <div key={workflow.title} className="border-white/10 p-8 sm:border-l sm:first:border-l-0 sm:[&:nth-child(3)]:border-l-0 lg:border-b lg:[&:nth-child(n+3)]:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                      <workflow.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-white">{workflow.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{workflow.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <IconPanel icon={useCase.icon} />
              <h3 className="mt-5 text-xl font-extrabold text-slate-950">{useCase.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{useCase.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-orange-200 bg-orange-50 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-700">Why teams switch</p>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950">Less legal panic, more product rhythm</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Zenvyra gives teams a shared language for compliance: what changed, who owns it, what proof exists, and what customers can see.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Policy versions connected to site changes",
                "Cookie and tracker drift visible before audits",
                "Issue queues built for implementation",
                "Customer proof without exposing sensitive data",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                  <span className="text-sm font-bold leading-6 text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageScaffold>
  );
}
