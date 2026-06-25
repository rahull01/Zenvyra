import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export type SolutionMetric = {
  value: string;
  label: string;
};

export type SolutionCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SolutionStep = {
  title: string;
  description: string;
};

export type SolutionLandingPageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  heroIcon: LucideIcon;
  metrics: SolutionMetric[];
  pains: string[];
  outcomes: string[];
  features: SolutionCard[];
  workflow: SolutionStep[];
  proof: SolutionCard[];
  dashboardTitle: string;
  dashboardSubtitle: string;
  dashboardItems: string[];
  finalTitle: string;
  finalSubtitle: string;
};

export default function SolutionLandingPage({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  heroIcon: HeroIcon,
  metrics,
  pains,
  outcomes,
  features,
  workflow,
  proof,
  dashboardTitle,
  dashboardSubtitle,
  dashboardItems,
  finalTitle,
  finalSubtitle,
}: SolutionLandingPageProps) {
  return (
    <main className="min-h-screen bg-[#F8F9FB] pt-[72px]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-orange-700">
              <HeroIcon className="h-4 w-4" />
              {eyebrow}
            </div>
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[58px] lg:leading-[1.05]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryHref} className="btn-primary">
                {primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={secondaryHref} className="btn-secondary">
                {secondaryCta}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.20)]">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-200">Readiness cockpit</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-white">{dashboardTitle}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500">
                  <HeroIcon className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{dashboardSubtitle}</p>
            </div>
            <div className="mt-5 grid gap-3">
              {dashboardItems.map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                  <span className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-extrabold text-orange-200">
                      {index + 1}
                    </span>
                    {item}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-extrabold text-slate-950">{metric.value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-600">What breaks today</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-950">The work is bigger than one policy page</h2>
          <div className="mt-6 space-y-4">
            {pains.map((pain) => (
              <div key={pain} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />
                <p className="text-sm leading-7 text-slate-600">{pain}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8 shadow-sm">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-700">What Zenvyra gives you</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-950">A clear operating system for proof</h2>
          <div className="mt-6 grid gap-3">
            {outcomes.map((outcome) => (
              <div key={outcome} className="flex items-start gap-3 rounded-2xl bg-white p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-sm font-bold leading-6 text-slate-800">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-600">Core capabilities</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl">Detailed workflows built for real teams</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-slate-200 bg-[#F8F9FB] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-600">Workflow</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl">From messy compliance work to repeatable execution</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Every page is designed around a repeatable loop your team can run before launch, after every release, and during customer or client review.
            </p>
          </div>
          <div className="grid gap-4">
            {workflow.map((step, index) => (
              <div key={step.title} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[72px_1fr]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-extrabold text-white">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-300">Proof layer</p>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Make trust visible without exposing sensitive data</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {proof.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-700">Next step</p>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl">{finalTitle}</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">{finalSubtitle}</p>
            </div>
            <div className="grid gap-3">
              <Link href={primaryHref} className="btn-primary w-full">
                {primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={secondaryHref} className="btn-secondary w-full justify-center">
                {secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
