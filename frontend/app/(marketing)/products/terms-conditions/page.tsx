"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, CheckCircle2, ChevronRight, FileText, ShoppingBag, Globe, Smartphone, HelpCircle } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsConditionsPage() {
  const [activeTab, setActiveTab] = useState<"saas" | "ecommerce" | "mobile">("saas");

  const previews = {
    saas: {
      title: "SaaS & Subscriptions Clauses",
      points: [
        "Automatic renewal cycles and payment authorization rules",
        "Fair-use policies and service level agreements (SLAs)",
        "Intellectual property rights and customer data ownership",
        "Account suspension guidelines for non-payment or abuse",
      ],
      sample: "By subscribing, you authorize us to charge your payment method on a recurring monthly or annual basis. Accounts may be suspended if subscription fees remain unpaid for more than 14 days...",
    },
    ecommerce: {
      title: "eCommerce & Store Rules",
      points: [
        "Shipping, return windows, and restock fee declarations",
        "Pricing discrepancy and order cancellation clauses",
        "Product liability limitations and warranty disclaimers",
        "Payment gateway compliance and currency regulations",
      ],
      sample: "We reserve the right to cancel orders due to pricing errors or inventory inaccuracies. Return requests must be initiated within 30 days of shipment receipt, in original unopened condition...",
    },
    mobile: {
      title: "Mobile App & Device End-User Rules",
      points: [
        "App store standard terms integration (Apple/Google EULA)",
        "Geographic restrictions on app usage and export control",
        "Push notification consent and background analytics tracking",
        "Device permission declarations and updates agreement",
      ],
      sample: "This license is granted to you on a limited, non-transferable basis. The app connects to background APIs to sync compliance score telemetry; standard data carrier charges may apply...",
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
              <Scale className="h-3.5 w-3.5" />
              Terms & Conditions Generator
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Protect your business with custom{" "}
              <span className="text-primary">Terms & Conditions</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Limit your liability, establish acceptable use rules, and define billing frameworks for your platform, software, or digital store.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link href="/policies/new">
                <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl text-base font-semibold shadow-button">
                  Generate Terms & Conditions
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Selector & Preview Area */}
      <SectionWrapper className="bg-background-secondary/40 border-y border-border-light">
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary">Custom clauses built for your industry</h2>
            <p className="text-text-secondary mt-2">Choose your business type below to preview critical terms.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Sidebar Buttons */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0">
              <button
                onClick={() => setActiveTab("saas")}
                className={`flex items-center gap-3 w-full text-left px-5 py-4 rounded-xl font-bold text-sm transition-all border whitespace-nowrap ${
                  activeTab === "saas"
                    ? "bg-primary border-primary text-white shadow-button"
                    : "bg-background-primary border-border-light text-text-secondary hover:bg-background-secondary"
                }`}
              >
                <Globe className="h-5 w-5 shrink-0" />
                SaaS & Subscription Apps
              </button>
              <button
                onClick={() => setActiveTab("ecommerce")}
                className={`flex items-center gap-3 w-full text-left px-5 py-4 rounded-xl font-bold text-sm transition-all border whitespace-nowrap ${
                  activeTab === "ecommerce"
                    ? "bg-primary border-primary text-white shadow-button"
                    : "bg-background-primary border-border-light text-text-secondary hover:bg-background-secondary"
                }`}
              >
                <ShoppingBag className="h-5 w-5 shrink-0" />
                eCommerce & Stores
              </button>
              <button
                onClick={() => setActiveTab("mobile")}
                className={`flex items-center gap-3 w-full text-left px-5 py-4 rounded-xl font-bold text-sm transition-all border whitespace-nowrap ${
                  activeTab === "mobile"
                    ? "bg-primary border-primary text-white shadow-button"
                    : "bg-background-primary border-border-light text-text-secondary hover:bg-background-secondary"
                }`}
              >
                <Smartphone className="h-5 w-5 shrink-0" />
                Mobile Applications
              </button>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card">
              <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <FileText className="text-primary h-5 w-5" />
                {previews[activeTab].title}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {previews[activeTab].points.map((point) => (
                  <div key={point} className="flex gap-2 text-sm text-text-secondary font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <div className="bg-background-secondary border border-border-light rounded-2xl p-5">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                  Sample Clause Output
                </span>
                <p className="text-sm font-mono leading-relaxed text-text-secondary">
                  {previews[activeTab].sample}
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Feature Highlights */}
      <SectionWrapper>
        <PageContainer>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-extrabold text-text-primary">Comprehensive protection out of the box</h2>
            <p className="text-text-secondary mt-2">
              Every Terms of Service agreement contains all the key components required by payment processors, app stores, and consumer regulations.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Acceptable Use Rules",
                desc: "Ban malicious activity, data scraping, automated spiders, and trademark infringement.",
              },
              {
                title: "Governing Law Selector",
                desc: "Choose the jurisdiction (country, state, or province) that governs dispute resolution.",
              },
              {
                title: "Limitation of Liability",
                desc: "Protect your business from general, consequential, or punitive damages.",
              },
              {
                title: "Intellectual Property Protection",
                desc: "Declare ownership of logo, code, templates, and layouts as proprietary brand assets.",
              },
              {
                title: "User-Generated Content rules",
                desc: "Define copyright ownership, DMCA takedown procedures, and moderation rights.",
              },
              {
                title: "Disputes & Arbitration",
                desc: "Set up optional binding arbitration and class-action waivers for reduced legal costs.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-background-secondary/40 p-6 rounded-2xl border border-border-light hover:border-primary/30 transition-all duration-350">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-primary/5 border-t border-primary/10">
        <PageContainer className="text-center">
          <h2 className="text-3xl font-extrabold text-text-primary">Get Compliant & Stay Protected</h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Takes less than 5 minutes to set up your custom terms, host them with us, and gain legal protection.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/policies/new">
              <Button className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-6 rounded-xl shadow-button">
                Generate Terms & Conditions
              </Button>
            </Link>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
