"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileSearch, Fingerprint, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const proofItems = [
  {
    icon: FileSearch,
    title: "UK/US scan evidence",
    text: "Cookie categories, tracker domains, missing disclosures, PECR signals, and US state privacy gaps.",
  },
  {
    icon: Fingerprint,
    title: "Consent audit trail",
    text: "Consent state, banner version, policy version, timestamp, region, and source page in one record.",
  },
  {
    icon: Timer,
    title: "DSAR and consumer request workflow",
    text: "UK data requests and US consumer privacy requests move through intake, verification, response, export, and completion.",
  },
  {
    icon: ShieldCheck,
    title: "Public trust certificate",
    text: "A shareable page customers, agencies, and buyers can use to verify monitoring status.",
  },
];

export default function ProofPackSection() {
  return (
    <section className="bg-background-primary py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-7"
          >
            <p className="text-eyebrow font-bold uppercase tracking-[0.15em] text-primary">
              Compliance proof pack
            </p>
              <h2 className="text-h2 font-extrabold text-text-primary">
              Give buyers the one thing basic policy tools rarely explain: proof.
              </h2>
            <p className="text-body-lg leading-relaxed text-text-secondary">
              Policy pages and banners are easy to copy. The hard part is proving what changed,
              when it changed, what consent was captured, which UK GDPR/PECR or US state privacy
              checks were reviewed, and which fixes were completed. Zenvyra packages that
              evidence into a review-ready workflow with clear disclaimers and escalation points for legal counsel.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-2xl">
                <Link href="/verify/demo">
                  View sample certificate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl">
                <Link href="/pricing">Get setup help</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-[28px] border border-border-light bg-background-secondary p-5 shadow-card"
          >
            <div className="rounded-[24px] border border-border-light bg-white p-6">
              <div className="flex flex-col gap-4 border-b border-border-light pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-caption font-bold uppercase tracking-[0.15em] text-text-tertiary">
                    UK/US review packet
                  </p>
                  <h3 className="mt-2 text-h4 font-semibold text-text-primary">example-store.com</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-status-success/10 px-4 py-2 text-sm font-semibold text-status-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Review packet ready
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {proofItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[20px] border border-border-light bg-background-primary p-5">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-body font-semibold text-text-primary">{item.title}</h4>
                      <p className="mt-2 text-body-sm leading-relaxed text-text-secondary">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-5 text-text-tertiary">
          Certificates are operational evidence, not a legal certification or guarantee of UK, EU, or US compliance.
          Public certificate pages must avoid exposing private user data, consent payloads, or customer PII.
        </p>
      </div>
    </section>
  );
}
