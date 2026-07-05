"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Cookie, Check, CheckCircle2, ChevronRight, Settings, Layout, Eye, ShieldCheck, Database } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CookieConsentPage() {
  const [layout, setLayout] = useState<"banner" | "box" | "drawer">("banner");
  const [theme, setTheme] = useState<"light" | "dark" | "brand">("light");

  const themes = {
    light: "bg-white text-slate-800 border-slate-200",
    dark: "bg-slate-900 text-slate-100 border-slate-800",
    brand: "bg-primary-light/90 text-primary-dark border-primary/20",
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
              <Cookie className="h-3.5 w-3.5" />
              Cookie Consent Manager
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Geo-aware consent banners that{" "}
              <span className="text-primary">protect & convert</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Prepare consent workflows for GDPR ePrivacy Directive and CCPA/CPRA review. Fully customizable, fast-loading, and responsive on all devices.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link href="/consent/banner">
                <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl text-base font-semibold shadow-button">
                  Configure Consent Banner
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Banner Simulator Section */}
      <SectionWrapper className="bg-background-secondary/40 border-y border-border-light">
        <PageContainer>
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 className="text-3xl font-extrabold text-text-primary">Preview customization configurations</h2>
            <p className="text-text-secondary mt-2">
              Toggle layout formats and design themes below to simulate the visitor experience.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Customizer Controls */}
            <div className="lg:col-span-4 bg-background-primary p-6 rounded-3xl border border-border-light shadow-card space-y-6">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">Layout Model</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["banner", "box", "drawer"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLayout(l)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        layout === l
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background-secondary border-border-light text-text-secondary hover:bg-border-light"
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">Color Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["light", "dark", "brand"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        theme === t
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background-secondary border-border-light text-text-secondary hover:bg-border-light"
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Banner Canvas */}
            <div className="lg:col-span-8 bg-slate-900/10 border border-dashed border-border-medium rounded-3xl p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden bg-slate-950/20">
              <span className="absolute top-3 left-4 text-[10px] text-text-muted font-mono font-bold tracking-wider">
                Simulated Web Application Container
              </span>

              {/* Simulated Banner */}
              <div
                className={`w-full max-w-lg p-5 border rounded-2xl shadow-dropdown-shadow transition-all duration-350 ${
                  themes[theme]
                } ${
                  layout === "banner"
                    ? "absolute bottom-4 left-4 right-4 max-w-none"
                    : layout === "drawer"
                    ? "absolute bottom-4 right-4"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Cookie className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold">Consent Preference Notice</h4>
                      <p className="text-xs leading-relaxed opacity-85 mt-1">
                        We use essential cookies to run our site, and analytics cookies to optimize performance. Select preferences below.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-black/5 dark:border-white/5">
                    <div className="flex gap-2 text-[10px] font-semibold opacity-75">
                      <span className="flex items-center gap-1"><Check className="h-3 w-3 text-status-success" /> Essential</span>
                      <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> Analytics</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-current hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                        Configure
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover border border-primary transition-all">
                        Accept All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Benefits / Info */}
      <SectionWrapper>
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Zero-code Auto-blocking</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Our banner script intercepts tags automatically from Google Analytics, Facebook Pixel, and HubSpot before user consent is logged.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                <Layout className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Geo-Targeted Compliance</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Dynamically serve strict opt-in cookie prompts to EU visitors (GDPR) and opt-out notifications/links to California consumers (CCPA).
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Cryptographic Consent Logs</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Every consent selection generates a cryptographically signed receipt, logged securely for easy audit confirmation during regulatory inquiries.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-primary-light/20 border-t border-primary/10">
        <PageContainer className="text-center">
          <h2 className="text-3xl font-extrabold text-text-primary">Deploy Cookie Banners in minutes</h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Install one line of JavaScript on your site. We take care of compliance updates automatically.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/consent/banner">
              <Button className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-6 rounded-xl shadow-button">
                Build Your Consent Banner
              </Button>
            </Link>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
