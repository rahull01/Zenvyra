"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, ChevronRight, Scale, ShieldAlert, Award } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompetitorAuditPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState("average");

  const metrics = {
    average: {
      name: "Industry Average",
      policyCoverage: 60,
      bannerCompliance: 45,
      dsarAutomation: 10,
      loadSpeed: 2.8,
    },
    premium: {
      name: "Typical Premium Tool",
      policyCoverage: 85,
      bannerCompliance: 70,
      dsarAutomation: 40,
      loadSpeed: 1.6,
    },
    Zenvyra: {
      name: "Zenvyra",
      policyCoverage: 99,
      bannerCompliance: 100,
      dsarAutomation: 95,
      loadSpeed: 0.35,
    },
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      {/* Hero Section */}
      <SectionWrapper className="pt-24 pb-16 lg:pt-32 relative overflow-hidden bg-gradient-to-b from-primary-light/40 to-background-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,126,34,0.08),transparent_50%)]" />
        <PageContainer className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              <Award className="h-3.5 w-3.5" />
              Competitor Audit Tool
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Benchmark your compliance <span className="text-primary">against peers</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Compare cookie blocking speed, DSAR response rates, and banner customization completeness. Highlight vulnerability gaps to secure enterprise trust.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex justify-center"
            >
              <Link href="/competitors">
                <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl text-base font-semibold shadow-button">
                  Open Competitor Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Simulator Section */}
      <SectionWrapper className="bg-background-secondary/40 border-y border-border-light">
        <PageContainer>
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 className="text-3xl font-extrabold text-text-primary">How do standard platforms compare?</h2>
            <p className="text-text-secondary mt-2">
              Select an option below to compare typical solutions against Zenvyra's automated framework.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left selector */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0">
              <button
                onClick={() => setSelectedCompetitor("average")}
                className={`flex items-center gap-3 w-full text-left px-5 py-4 rounded-xl font-bold text-sm border whitespace-nowrap transition-all ${
                  selectedCompetitor === "average"
                    ? "bg-primary border-primary text-white shadow-button"
                    : "bg-background-primary border-border-light text-text-secondary hover:bg-background-secondary"
                }`}
              >
                vs. Industry Average
              </button>
              <button
                onClick={() => setSelectedCompetitor("premium")}
                className={`flex items-center gap-3 w-full text-left px-5 py-4 rounded-xl font-bold text-sm border whitespace-nowrap transition-all ${
                  selectedCompetitor === "premium"
                    ? "bg-primary border-primary text-white shadow-button"
                    : "bg-background-primary border-border-light text-text-secondary hover:bg-background-secondary"
                }`}
              >
                vs. Premium Platforms
              </button>
            </div>

            {/* Right comparison chart */}
            <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                  <span>Privacy Policy Clause Completeness</span>
                  <div className="flex gap-4">
                    <span className="text-text-muted">{metrics[selectedCompetitor as keyof typeof metrics].name}: {metrics[selectedCompetitor as keyof typeof metrics].policyCoverage}%</span>
                    <span className="text-primary">Zenvyra: {metrics.Zenvyra.policyCoverage}%</span>
                  </div>
                </div>
                <div className="w-full bg-background-secondary h-3 rounded-full overflow-hidden relative">
                  <div
                    className="bg-text-tertiary h-full absolute left-0 top-0 transition-all duration-350"
                    style={{ width: `${metrics[selectedCompetitor as keyof typeof metrics].policyCoverage}%` }}
                  />
                  <div
                    className="bg-primary h-full absolute left-0 top-0 transition-all duration-350 opacity-60"
                    style={{ width: `${metrics.Zenvyra.policyCoverage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                  <span>Geo-Targeted Consent Ban Rate</span>
                  <div className="flex gap-4">
                    <span className="text-text-muted">{metrics[selectedCompetitor as keyof typeof metrics].name}: {metrics[selectedCompetitor as keyof typeof metrics].bannerCompliance}%</span>
                    <span className="text-primary">Zenvyra: {metrics.Zenvyra.bannerCompliance}%</span>
                  </div>
                </div>
                <div className="w-full bg-background-secondary h-3 rounded-full overflow-hidden relative">
                  <div
                    className="bg-text-tertiary h-full absolute left-0 top-0 transition-all duration-350"
                    style={{ width: `${metrics[selectedCompetitor as keyof typeof metrics].bannerCompliance}%` }}
                  />
                  <div
                    className="bg-primary h-full absolute left-0 top-0 transition-all duration-350 opacity-60"
                    style={{ width: `${metrics.Zenvyra.bannerCompliance}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                  <span>DSAR Form Workflow Automation</span>
                  <div className="flex gap-4">
                    <span className="text-text-muted">{metrics[selectedCompetitor as keyof typeof metrics].name}: {metrics[selectedCompetitor as keyof typeof metrics].dsarAutomation}%</span>
                    <span className="text-primary">Zenvyra: {metrics.Zenvyra.dsarAutomation}%</span>
                  </div>
                </div>
                <div className="w-full bg-background-secondary h-3 rounded-full overflow-hidden relative">
                  <div
                    className="bg-text-tertiary h-full absolute left-0 top-0 transition-all duration-350"
                    style={{ width: `${metrics[selectedCompetitor as keyof typeof metrics].dsarAutomation}%` }}
                  />
                  <div
                    className="bg-primary h-full absolute left-0 top-0 transition-all duration-350 opacity-60"
                    style={{ width: `${metrics.Zenvyra.dsarAutomation}%` }}
                  />
                </div>
              </div>

              <div className="bg-primary-light/20 border border-primary/10 p-5 rounded-2xl">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                  Speed Performance Analysis
                </span>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Zenvyra script size weighs less than 12KB, loading in just <strong>{metrics.Zenvyra.loadSpeed}s</strong>. Compare this against typical premium tools that load at <strong>{metrics[selectedCompetitor as keyof typeof metrics].loadSpeed}s</strong>, causing web core vitals performance penalties.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
