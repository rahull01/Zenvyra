"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Globe, Zap, Server, Layers, Sparkles, CheckCircle } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";

const solutionCards = [
  {
    title: "AI-powered compliance scanning",
    description: "Scan websites, policies, and banners in seconds with live issue detection and clear remediation guidance.",
    icon: Zap,
  },
  {
    title: "Auto-fix controls",
    description: "Move from risk to resolution with fixes that reduce manual handoffs and keep teams aligned.",
    icon: Shield,
  },
  {
    title: "Continuous monitoring",
    description: "Keep compliance live with daily checks, alerting, and audit-ready reporting for modern teams.",
    icon: Globe,
  },
];

const techPoints = [
  {
    title: "Production-grade architecture",
    description: "Built on microservices, containers, and scalable cloud pipelines for reliable performance.",
    icon: Server,
  },
  {
    title: "AI integrated at the core",
    description: "ChatGPT and LangChain workflows power issue detection, explanation, and fix recommendations.",
    icon: Layers,
  },
  {
    title: "Secure, observable, fast",
    description: "Policy scanning, logging, and CI/CD are designed for teams that ship in regulated environments.",
    icon: Sparkles,
  },
];

const values = [
  { title: "Trust first", description: "We make every product decision easy to defend and simple to explain." },
  { title: "Simplicity", description: "Clear compliance, not compliance clutter. One workflow for every team." },
  { title: "Automation", description: "Reduce manual work with remediation that actually lands in production." },
  { title: "Security", description: "We measure every feature by how much risk it removes, not how much it adds." },
  { title: "Transparency", description: "Audit-ready visibility for engineering, legal, and leadership." },
];

const stats = [
  { value: "10K+", label: "Compliance scans delivered" },
  { value: "150+", label: "Countries monitored" },
  { value: "30–50%", label: "Time saved for engineering teams" },
  { value: "AI-first", label: "Platform designed for modern legal workflows" },
];

const problems = [
  "Websites still patch compliance after launch instead of building it into every release.",
  "Legal review is slow, expensive, and disconnected from engineering work.",
  "Cookie banners, privacy policies and accessibility checks are treated as paperwork, not product." ,
];

export default function AboutPage() {
  return (
    <>
      <PageScaffold
        eyebrow="Founder & CEO"
        title="Rahul Singh"
        subtitle="Building the future of compliance automation with AI"
        showCta={false}
      >
      <div className="space-y-12">
        <section className="rounded-[32px] bg-white p-8 shadow-card-shadow sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.7fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Founder</p>
              <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">Rahul Singh</h1>
              <p className="text-base font-semibold text-orange-600">Founder & CEO</p>
              <p className="max-w-2xl text-base leading-8 text-text-secondary">
                Rahul Singh is the founder behind ComplianceAI Pro, building intelligent automation solutions that simplify compliance and risk management using AI, cloud systems, and product-first engineering.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://www.linkedin.com/in/rahulsingh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Connect on LinkedIn
                </Link>
                <Link
                  href="#founder-story"
                  className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600"
                >
                  Our story
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                <div className="rounded-3xl bg-orange-50 p-5">
                  <p className="text-2xl font-bold text-text-primary">10K+</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-orange-600">businesses served</p>
                </div>
                <div className="rounded-3xl bg-orange-50 p-5">
                  <p className="text-2xl font-bold text-text-primary">150+</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-orange-600">countries covered</p>
                </div>
                <div className="rounded-3xl bg-orange-50 p-5">
                  <p className="text-2xl font-bold text-text-primary">AI-first</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-orange-600">compliance automation</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-border-light bg-slate-50 shadow-card-shadow">
              <Image
                src="/rahul.png"
                alt="Rahul Singh"
                width={720}
                height={900}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </section>
        <section className="rounded-[32px] bg-white p-8 shadow-card-shadow sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Vision statement</p>
          <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">Why ComplianceAI exists</h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-text-secondary">
            The people building websites today are buried in fast-moving rules, inconsistent legal notes, and compliance work that lives outside product. That gap creates late-stage risk, missed deadlines, and customer doubt.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary">
            ComplianceAI Pro exists to make compliance feel like a product capability: clear, visible, and built into every release so teams can ship confidently and grow without legal surprise.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[32px] bg-white p-8 shadow-card-shadow sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Problem we solve</p>
            <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">Compliance is still too manual for modern websites</h2>
            <div className="mt-6 space-y-4 text-text-secondary">
              {problems.map((item) => (
                <p key={item} className="text-base leading-7">{item}</p>
              ))}
            </div>
            <ul className="mt-8 space-y-4 text-base leading-7 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600">•</span>
                Teams still wait for regulatory sign-off after launch.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600">•</span>
                Legal work is disconnected from product and engineering day-to-day.
              </li>
            </ul>
          </div>

          <div className="grid gap-6">
            {solutionCards.map((item, index) => (
              <div key={item.title} className="rounded-[28px] border border-border-light bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <item.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="founder-story" className="rounded-[32px] bg-white p-8 shadow-card-shadow sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Founder story</p>
          <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">From developer to founder — a product built from the pain of real teams</h2>
          <div className="mt-6 space-y-6 text-text-secondary">
            <p className="text-base leading-8">
              Rahul began as a Java backend engineer solving performance and compliance problems for customer-facing platforms. He watched teams lose weeks in legal review and still ship websites with privacy gaps and accessibility risk.
            </p>
            <p className="text-base leading-8">
              That experience became the mission: stop treating compliance as a checklist and start treating it as a product capability. ComplianceAI Pro is the first product he built where engineering, legal, and operations move together in one dashboard.
            </p>
            <p className="text-base leading-8">
              The same founder who delivered microservices, Kafka pipelines, and Kubernetes deployments now backs this product with real operational rigor and a focus on trust-first outcomes.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {techPoints.map((item) => (
            <div key={item.title} className="rounded-[28px] bg-white p-6 shadow-sm border border-border-light">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <item.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] bg-white p-8 shadow-card-shadow sm:p-10 lg:p-12">
          <div className="grid gap-6 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl bg-orange-50 p-6 text-center">
                <p className="text-3xl font-bold text-text-primary">{item.value}</p>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-orange-600">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {values.map((item) => (
            <div key={item.title} className="rounded-[28px] bg-white p-6 shadow-sm border border-border-light">
              <div className="inline-flex items-center gap-3 text-orange-600">
                <CheckCircle className="h-5 w-5" aria-hidden />
                <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-10 text-white shadow-card-shadow sm:px-10 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Mission</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Making compliance effortless for every business</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/90">
            We want digital teams to stop treating compliance as a risk and start treating it as a source of trust and growth.
          </p>
        </section>
      </div>
    </PageScaffold>
    <section className="py-16">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white px-8 py-12 shadow-card-shadow sm:px-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Ready to move faster?</p>
            <h2 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">Start your first scan in minutes</h2>
            <p className="mt-5 text-base leading-7 text-text-secondary">
              Build confidence in your website, reduce legal friction, and keep every release on track with a proven compliance workflow.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600"
            >
              Start Free Scan
            </Link>
            <Link
              href="https://www.linkedin.com/in/rahulsingh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-6 py-4 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Connect on LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
