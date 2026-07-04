"use client";

import Link from "next/link";
import { Shield, Lock, Server, Database, FileCheck, Users, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageScaffold from "@/components/marketing/PageScaffold";

const securityPillars = [
  {
    title: "Data encryption",
    description: "All data is encrypted in transit with TLS 1.2+ and at rest using AES-256. API traffic is served over HTTPS only.",
    icon: Lock,
  },
  {
    title: "Infrastructure isolation",
    description: "Services run in containerized environments with separate networks. Production secrets are stored in environment-scoped vaults, never in source code.",
    icon: Server,
  },
  {
    title: "Automated backups",
    description: "Database snapshots are taken daily and retained with point-in-time recovery options. Backup restores are tested quarterly.",
    icon: Database,
  },
  {
    title: "Access control",
    description: "Role-based access control, JWT authentication, API-key scopes, and audit logging protect every endpoint and dashboard action.",
    icon: Users,
  },
  {
    title: "Rate limiting & abuse prevention",
    description: "Token-bucket rate limits protect public scanners, auth flows, and AI endpoints from abuse and accidental overload.",
    icon: Shield,
  },
  {
    title: "Vulnerability management",
    description: "Dependencies are scanned in CI, containers are rebuilt on security patches, and production configs are reviewed before every release.",
    icon: FileCheck,
  },
];

const readinessItems = [
  { control: "Access management", status: "Implemented" },
  { control: "Encryption in transit and at rest", status: "Implemented" },
  { control: "Logging and monitoring", status: "Implemented" },
  { control: "Incident response playbook", status: "Implemented" },
  { control: "Vendor and sub-processor review", status: "Implemented" },
  { control: "SOC 2 Type II audit", status: "In progress" },
];

const contacts = [
  { label: "Security questions", value: "security@zenvyra.com", href: "mailto:security@zenvyra.com", icon: Mail },
  { label: "Response time", value: "48 hours for non-critical issues", icon: Clock },
];

export default function SecurityPage() {
  return (
    <PageScaffold
      eyebrow="Trust & Security"
      title="Your compliance data deserves serious protection"
      subtitle="Zenvyra is built with security-first architecture, transparent practices, and a roadmap toward SOC 2 Type II certification."
      heroExtra={
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="rounded-2xl">
            <Link href="/free-privacy-scanner">Start a free scan</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="mailto:security@zenvyra.com">Contact security</Link>
          </Button>
        </div>
      }
    >
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-text-primary">Security pillars</h2>
            <p className="mt-3 text-lg text-text-secondary">
              Defense in depth across infrastructure, application, and operational layers.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {securityPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-border-light bg-background-primary p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-secondary py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">SOC 2 readiness</h2>
              <p className="mt-4 text-lg text-text-secondary">
                We are preparing for SOC 2 Type II with documented controls, evidence collection, and quarterly reviews. Our trust program covers security, availability, confidentiality, and processing integrity.
              </p>
              <div className="mt-8 space-y-4">
                {readinessItems.map((item) => (
                  <div key={item.control} className="flex items-center justify-between rounded-xl border border-border-light bg-background-primary p-4">
                    <span className="font-medium text-text-primary">{item.control}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${item.status === "Implemented" ? "bg-status-success/10 text-status-success" : "bg-status-warning/10 text-status-warning"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-background-primary p-8 shadow-card">
              <h3 className="text-xl font-bold text-text-primary">Questions about security?</h3>
              <p className="mt-2 text-text-secondary">
                Reach out for our latest security whitepaper, penetration-test summary, or sub-processor list.
              </p>
              <div className="mt-6 space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.label} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <contact.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-text-tertiary">{contact.label}</p>
                      {contact.href ? (
                        <Link href={contact.href} className="text-sm font-semibold text-primary hover:underline">
                          {contact.value}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-text-primary">{contact.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Link href="/privacy" className="text-sm font-semibold text-primary hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/sub-processors" className="text-sm font-semibold text-primary hover:underline">
                  Sub-processors
                </Link>
                <Link href="/terms" className="text-sm font-semibold text-primary hover:underline">
                  Terms of Use
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <h2 className="text-3xl font-bold text-text-primary">Compliance starts with trust</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            We handle AI Act and privacy compliance data with the same care we expect from the products we help our customers build.
          </p>
          <div className="mt-8">
            <Link
              href="/free-privacy-scanner"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover"
            >
              Run a free scan
            </Link>
          </div>
        </div>
      </section>
    </PageScaffold>
  );
}
