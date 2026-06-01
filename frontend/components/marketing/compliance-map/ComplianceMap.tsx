"use client";

import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Globe2, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const regions = [
  { name: "EU GDPR", note: "50+ countries", x: "20%", y: "35%" },
  { name: "US CCPA", note: "California-specific", x: "11%", y: "48%" },
  { name: "LGPD", note: "Brazil coverage", x: "27%", y: "68%" },
  { name: "PIPL", note: "China readiness", x: "70%", y: "42%" },
  { name: "POPIA", note: "South Africa", x: "48%", y: "82%" },
];

export default function ComplianceMap() {
  return (
    <SectionWrapper className="relative py-32 bg-bg-primary text-text-primary overflow-hidden">
      <PageContainer>
        <div className="relative overflow-hidden rounded-[3rem] border border-bg-tertiary bg-bg-base/80 p-10 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_35%)] pointer-events-none" />
          <div className="relative z-10 grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                <Sparkles className="h-4 w-4" />
                Global Coverage
              </div>
              <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
                Compliance coverage across every major privacy regime.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-text-secondary leading-relaxed">
                Visualize the regulations that matter most to your business, from GDPR and CCPA to POPIA, PIPL, and beyond.
                Our platform maps global scanner signals to legal requirements in a single dashboard.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                <FeatureBadge icon={ShieldCheck} label="50+ regulations" description="Enterprise-grade legal coverage." />
                <FeatureBadge icon={Globe2} label="Real-time updates" description="AI alerts for every jurisdiction." />
              </div>
            </div>

            <div className="relative rounded-[2rem] bg-bg-secondary/80 border border-bg-tertiary p-6 shadow-glow-ai">
              <div className="relative h-[420px] rounded-[1.75rem] border border-bg-tertiary bg-[#071827] overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.35),transparent_0%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.25),transparent_0%)]" />
                <svg viewBox="0 0 900 520" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
                  <path d="M0 120 C120 40 300 0 450 90 C600 180 780 140 900 80 L900 520 L0 520 Z" fill="rgba(255,255,255,0.03)" />
                  <path d="M0 220 C140 140 320 120 470 200 C620 280 760 240 900 190 L900 520 L0 520 Z" fill="rgba(245,158,11,0.08)" />
                  <path d="M0 320 C100 260 260 260 430 340 C600 420 740 360 900 340 L900 520 L0 520 Z" fill="rgba(6,182,212,0.08)" />
                </svg>
                {regions.map((region, index) => (
                  <motion.div
                    key={region.name}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
                    className="absolute flex items-center gap-3 rounded-full border border-bg-tertiary bg-bg-primary/80 px-3 py-2 text-xs text-text-primary shadow-lg"
                    style={{ left: region.x, top: region.y, transform: "translate(-50%, -50%)" }}
                  >
                    <MapPin className="h-4 w-4 text-accent" />
                    <div>
                      <p className="font-semibold">{region.name}</p>
                      <p className="text-[11px] text-text-muted">{region.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}

function FeatureBadge({ icon: Icon, label, description }: { icon: typeof ShieldCheck; label: string; description: string }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-bg-tertiary bg-bg-base/80 p-5">
      <div className="mt-1 grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-base font-bold text-text-primary">{label}</p>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
