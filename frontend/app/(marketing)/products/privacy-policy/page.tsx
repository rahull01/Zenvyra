"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, CheckCircle2, ChevronRight, FileText, Lock, Globe, RefreshCcw, Eye, Play } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState("gdpr");

  const laws = {
    gdpr: {
      name: "GDPR (Europe)",
      description: "Applies to any business offering goods or services to EU residents.",
      preview: "We process personal data based on consent (Art. 6(1)(a) GDPR), contract necessity, or legitimate interests. Users have the right to access, rectify, erase, or restrict processing of their personal data...",
    },
    ccpa: {
      name: "CCPA/CPRA (California)",
      description: "Provides California consumers with transparency and opt-out rights.",
      preview: "Under the California Consumer Privacy Act (CCPA), you have the right to request disclosure of what personal information we collect, sell, or share, and opt-out of the sale of personal information...",
    },
    lgpd: {
      name: "LGPD (Brazil)",
      description: "Regulates the processing of personal data of users located in Brazil.",
      preview: "Em conformidade com a Lei Geral de Proteção de Dados (LGPD), garantimos aos titulares de dados os direitos de confirmação de existência de tratamento, acesso, correção e eliminação de dados...",
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
              <Shield className="h-3.5 w-3.5" />
              Privacy Policy Generator
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Generate a professional, custom{" "}
              <span className="text-primary">Privacy Policy</span> in minutes.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Comply with GDPR, CCPA, CalOPPA, LGPD, and PIPEDA automatically. Tailored specifically to your app, SaaS, or website operations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link href="/dashboard/policies/new">
                <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl text-base font-semibold shadow-button">
                  Generate Your Policy
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="border-border-medium hover:bg-background-secondary px-8 py-6 rounded-xl text-base font-semibold"
              >
                <Eye className="mr-2 h-4 w-4 text-primary" />
                View Sample Clauses
              </Button>
            </motion.div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Core Features */}
      <SectionWrapper className="bg-background-secondary/50 border-y border-border-light">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="bg-background-primary p-8 rounded-2xl border border-border-light shadow-card hover:shadow-card-hover transition-all duration-350">
              <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Multi-Region Compliance</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Dynamically generated clauses that auto-adapt based on customer geography. Automatically handles EU, UK, US, Brazilian, and Canadian regulations.
              </p>
            </div>
            <div className="bg-background-primary p-8 rounded-2xl border border-border-light shadow-card hover:shadow-card-hover transition-all duration-350">
              <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-6">
                <RefreshCcw className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Auto-Updates</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Laws change constantly. Our legal engineers update the templates in real-time, instantly pushing updates to your hosted policy without manual code changes.
              </p>
            </div>
            <div className="bg-background-primary p-8 rounded-2xl border border-border-light shadow-card hover:shadow-card-hover transition-all duration-350">
              <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-6">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">AI Clause Tuning</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Describe unique product features or data flows in simple English. Our AI analyzes and writes precise legal language matched to your scenario.
              </p>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Detailed Highlights */}
      <SectionWrapper>
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                Designed for developer speed and legal completeness
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                We handle the compliance details so you can focus on building products. From cookies to third-party subprocessors, we ask the right questions and output high-quality, hosted compliance documentation.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Host policies on our lightning-fast CDN or embed as raw HTML",
                  "Consent banner cookies linked automatically for zero-manual syncs",
                  "Includes standard data protection officer (DPO) clauses",
                  "100% compliant with standard App Store and Google Play requirements",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-primary font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative p-6 bg-secondary-dark rounded-3xl overflow-hidden shadow-modal">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-text-muted font-mono">privacy-policy.html</span>
              </div>
              <pre className="text-xs text-text-tertiary font-mono overflow-x-auto leading-relaxed">
                {`<!DOCTYPE html>
<html>
<head>
  <title>Privacy Policy - ComplianceAI Pro</title>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p>Last updated: May 23, 2026</p>
  <h2>1. Information We Collect</h2>
  <p>We collect information that you provide directly to us, including identifiers (name, email)...</p>
  <h2>2. How We Use Data</h2>
  <p>To provide, maintain, and optimize our platform services...</p>
</body>
</html>`}
              </pre>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Pricing / CTA Section */}
      <SectionWrapper className="bg-primary-light/20 border-t border-primary/10">
        <PageContainer className="text-center">
          <h2 className="text-3xl font-extrabold text-text-primary">Ready to comply with global laws?</h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Join thousands of startups, SaaS founders, and enterprise companies using ComplianceAI Pro.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard/policies/new">
              <Button className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-6 rounded-xl shadow-button">
                Create Privacy Policy Now
              </Button>
            </Link>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Sample Clause Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background-primary rounded-3xl shadow-modal w-full max-w-2xl overflow-hidden border border-border-light"
            >
              <div className="p-6 border-b border-border-light flex justify-between items-center bg-background-secondary">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <FileText className="text-primary h-5 w-5" />
                  Compliance Clause Samples
                </h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-text-muted hover:text-text-primary font-bold text-sm"
                >
                  ✕ Close
                </button>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-6">
                  {Object.entries(laws).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedLaw(key)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        selectedLaw === key
                          ? "bg-primary text-white"
                          : "bg-background-secondary text-text-secondary hover:bg-border-light"
                      }`}
                    >
                      {value.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-muted mb-3 font-semibold uppercase tracking-wider">
                  {laws[selectedLaw as keyof typeof laws].name} Details
                </p>
                <p className="text-sm text-text-secondary mb-4 italic leading-relaxed">
                  {laws[selectedLaw as keyof typeof laws].description}
                </p>
                <div className="bg-background-secondary border border-border-light p-5 rounded-2xl">
                  <p className="text-sm text-text-primary font-mono leading-relaxed">
                    {laws[selectedLaw as keyof typeof laws].preview}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-background-secondary border-t border-border-light flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Cancel
                </Button>
                <Link href="/dashboard/policies/new">
                  <Button className="bg-primary hover:bg-primary-hover text-white">
                    Generate with this law
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
