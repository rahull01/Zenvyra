"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, ChevronRight, Laptop, Smartphone, Puzzle, ShieldAlert } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EulaGeneratorPage() {
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
              <Scale className="h-3.5 w-3.5" />
              EULA Generator
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Custom <span className="text-primary">EULA Agreements</span> for software creators.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Protect your software, limit liability, and set terms for licenses, reverse engineering, and user restrictions. Ideal for mobile apps, desktop apps, and plugins.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex justify-center"
            >
              <Link href="/policies/new">
                <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl text-base font-semibold shadow-button">
                  Generate EULA Agreement
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Target Audiences */}
      <SectionWrapper className="bg-background-secondary/40 border-y border-border-light">
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary">Tailored for every software deployment format</h2>
            <p className="text-text-secondary mt-2">Get pre-vetted legal protection matched to your distribution channels.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light text-center shadow-card">
              <div className="h-12 w-12 bg-primary-light text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Mobile Apps</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Drafted with Apple App Store standard terms and Google Play developer policy review points in mind.
              </p>
            </div>
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light text-center shadow-card">
              <div className="h-12 w-12 bg-primary-light text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Desktop Software</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Agreements covering binary installations, license key activation limits, digital signatures, and support lifetimes.
              </p>
            </div>
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light text-center shadow-card">
              <div className="h-12 w-12 bg-primary-light text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Puzzle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Web Plugins & SDKs</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Rules governing APIs, web browser extensions, SaaS hooks, and embedded code integration within third-party environments.
              </p>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Core Protection Checklist */}
      <SectionWrapper>
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                Essential clauses every EULA must include
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                An End User License Agreement does more than say "don't copy". It grants a specific, revocable license and restricts behavior to safeguard your IP.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "License Scope: Defines user constraints and installation limits",
                  "Restrictions: Prohibits decompilation and reverse-engineering",
                  "Termination: Outlines how and when license tokens are revoked",
                  "Warranty Disclaimer: Asserts software is provided 'as is'",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-primary font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-light/10 border border-primary/10 p-8 rounded-3xl">
              <h4 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-4">
                <ShieldAlert className="text-primary h-5 w-5" />
                Why standard Terms of Service aren't enough
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Terms of Service govern web interactions, whereas a EULA is specific to installed software. If a user downloads software onto a phone, PC, or server, a EULA is legally necessary to control the license usage.
              </p>
              <Link href="/policies/new">
                <Button className="bg-primary hover:bg-primary-hover text-white rounded-lg">
                  Start EULA Generator
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
