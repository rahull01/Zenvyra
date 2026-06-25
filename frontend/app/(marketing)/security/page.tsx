import { ShieldCheck, Lock, ShieldAlert, Key, CheckCircle2 } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

const trustItems = [
  { title: "Data encryption", description: "AES-256 at rest and TLS 1.3 in transit.", icon: Key },
  { title: "Security headers", description: "CSP, HSTS, X-Frame-Options, and strict cookie settings.", icon: ShieldCheck },
  { title: "Access controls", description: "Role-based permissions, audit logging, and SSO/SAML support.", icon: ShieldAlert },
  { title: "Monitoring", description: "Real-time alerts, audit trails and compliance scoring.", icon: Lock },
  { title: "Data residency", description: "EU data locality options for GDPR compliance.", icon: CheckCircle2 },
];

export default function SecurityPage() {
  return (
    <main className="bg-bg-base text-text-primary">
      <SectionWrapper className="pt-32 pb-16">
        <PageContainer>
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Security & trust
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight">Enterprise-grade security built into every layer.</h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed">
              Zenvyra is architected for regulated teams with strong controls, encrypted infrastructure, and continuous audit-ready reporting.
            </p>
          </div>
        </PageContainer>
      </SectionWrapper>

      <SectionWrapper className="pb-24">
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-3">
            {trustItems.map((item, index) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-bg-tertiary bg-bg-secondary/90 p-8 shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-info/10 text-info mb-6">
                  <item.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-3">{item.title}</h2>
                <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] border border-bg-tertiary bg-bg-primary/80 p-10 shadow-glow-accent">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Compliance controls</p>
                <h2 className="mt-4 text-4xl font-extrabold text-text-primary">Everything you need to secure your compliance infrastructure.</h2>
                <p className="mt-4 text-base text-text-secondary leading-relaxed">
                  From strict data processing rules to web security policies and real-time risk monitoring, the platform is built for enterprise assurance.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "Encrypted backups and secure file storage",
                  "Role-based access with audit trails",
                  "Strict origin and CSP enforcement",
                  "Automated security notifications",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3 rounded-3xl border border-bg-tertiary bg-bg-secondary/80 p-4">
                    <div className="mt-1 h-9 w-9 rounded-2xl bg-accent/10 text-accent grid place-items-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-text-secondary">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
