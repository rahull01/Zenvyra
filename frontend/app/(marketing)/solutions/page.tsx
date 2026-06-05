"use client";

import { Rocket, Users, Building2, Check } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";
import Link from "next/link";

const solutions = [
  {
    title: "For Startups",
    description:
      "Launch fast without worrying about compliance. Automate privacy, cookies, and legal requirements in minutes.",
    icon: Rocket,
    href: "/solutions/startups",
  },
  {
    title: "For Agencies",
    description:
      "Manage compliance for multiple clients with one powerful dashboard. Scale your services and build trust.",
    icon: Users,
    href: "/solutions/agencies",
  },
  {
    title: "For Enterprise",
    description:
      "Enterprise-grade compliance automation with real-time monitoring, audit logs, and advanced security.",
    icon: Building2,
    href: "/solutions/enterprise",
  },
];

export default function SolutionsPage() {
  return (
    <PageScaffold
      eyebrow="Solutions"
      title="Built for every stage of growth"
      subtitle="Whether you're a startup, agency, or enterprise — ComplianceAI Pro adapts to your needs."
    >
      
      {/* 🔥 MAIN CARDS */}
      <div className="grid gap-8 md:grid-cols-3">
        {solutions.map((s, i) => (
          <Link
            key={s.title}
            href={s.href}
            className="group rounded-2xl border border-border-light bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <s.icon className="h-10 w-10 text-accent" />
            <h3 className="mt-4 text-xl font-bold text-text-primary">
              {s.title}
            </h3>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              {s.description}
            </p>

            <span className="mt-4 inline-block text-accent font-medium">
              Explore →
            </span>
          </Link>
        ))}
      </div>

      {/* 🔥 TRUST SECTION */}
      <div className="mt-20 standard-card !p-10">
        <div className="grid lg:grid-cols-2 gap-10">

          <div>
            <p className="text-sm uppercase text-accent font-semibold tracking-wider">
              Why choose us
            </p>

            <h2 className="mt-4 text-3xl font-bold text-text-primary">
              Compliance that grows with your business
            </h2>

            <p className="mt-4 text-text-secondary">
              From solo founders to large enterprises, manage compliance with a single AI-powered platform.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              "AI-powered compliance automation",
              "Real-time monitoring & alerts",
              "Audit-ready reports",
              "Scalable architecture for any size",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border-light bg-bg-secondary px-4 py-3"
              >
                <Check className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-text-secondary">
                  {item}
                </span>
              </li>
            ))}
          </ul>

        </div>
      </div>

    </PageScaffold>
  );
}