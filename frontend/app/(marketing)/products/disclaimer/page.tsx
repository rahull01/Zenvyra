"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, ChevronRight, Coins, ShieldAlert, HeartPulse, Scale as LawIcon } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DisclaimerGeneratorPage() {
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
              Disclaimer Generator
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Shield your brand with a custom{" "}
              <span className="text-primary">Legal Disclaimer</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Prevent liability claims regarding financial advice, fitness routines, medical information, or affiliate link commission disclosures.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex justify-center"
            >
              <Link href="/dashboard/policies/new">
                <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl text-base font-semibold shadow-button">
                  Generate Custom Disclaimer
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Categories */}
      <SectionWrapper className="bg-background-secondary/40 border-y border-border-light">
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary">Disclaimers tailored to your specific field</h2>
            <p className="text-text-secondary mt-2">Get target disclosures to meet regulatory mandates and consumer laws.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light shadow-card text-center">
              <div className="h-12 w-12 bg-primary-light text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Financial Disclaimers</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Clarify that contents represent opinions or research, not official investment advice, protecting you from portfolio losses.
              </p>
            </div>
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light shadow-card text-center">
              <div className="h-12 w-12 bg-primary-light text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Health & Fitness</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Warn visitors to consult registered physicians before starting workout plans or dietary supplement intakes.
              </p>
            </div>
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light shadow-card text-center">
              <div className="h-12 w-12 bg-primary-light text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Affiliate & Links</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Meet FTC guidelines by declaring sponsored relationships, affiliate commission links, or brand advertisements.
              </p>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Details */}
      <SectionWrapper>
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                Why legal disclaimers are essential
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Without a disclaimer, a reader could sue you claiming they suffered injury or loss because they relied on your website's content. A clear disclaimer limits your legal liability.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Limits negligence and liability claims in simple terms",
                  "Satisfies FTC requirements for sponsored blog posts",
                  "Outlines accuracy limits for real-time market data feed",
                  "Provides notice that past performance does not guarantee future results",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-primary font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background-secondary p-8 rounded-3xl border border-border-light">
              <h4 className="text-base font-bold text-text-primary mb-3">Sample disclaimer clause</h4>
              <p className="text-sm font-mono text-text-secondary leading-relaxed bg-background-primary border border-border-light p-4 rounded-xl">
                "The information provided on this website is for general educational and informational purposes only. It is not intended as professional advice. Any reliance you place on such information is strictly at your own risk..."
              </p>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
