"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scan, Search, Globe, ShieldAlert, CheckCircle2, ChevronRight, FileSpreadsheet, Lock, AlertTriangle, Play } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CookieScannerProductPage() {
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<any>(null);

  const startScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    setIsScanning(true);
    setScanProgress(10);
    setScanResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResult({
            score: 72,
            url: urlInput,
            cookiesFound: 24,
            scriptsBlocked: 8,
            categories: {
              essential: 6,
              analytics: 8,
              marketing: 10,
            },
          });
          return 100;
        }
        return prev + 15;
      });
    }, 300);
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
              <Scan className="h-3.5 w-3.5" />
              Free Cookie & Consent Scanner
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Audit your website for{" "}
              <span className="text-primary">hidden trackers</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Enter your website URL below to run an instant scan. Identify compliance gaps, unclassified cookies, and auto-blocking errors in seconds.
            </motion.p>

            {/* Scan Form */}
            <motion.form
              onSubmit={startScan}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 max-w-lg mx-auto flex flex-col sm:flex-row gap-3 bg-background-primary p-2 rounded-2xl border border-border-medium shadow-card"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Globe className="h-5 w-5 text-text-muted shrink-0" />
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isScanning}
                  required
                  className="w-full text-sm outline-none border-none bg-transparent placeholder-text-muted"
                />
              </div>
              <Button
                type="submit"
                disabled={isScanning}
                className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6 py-4 font-semibold shrink-0"
              >
                {isScanning ? "Scanning..." : "Scan Website"}
              </Button>
            </motion.form>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Progress & Results Area */}
      <SectionWrapper className="py-6 bg-background-secondary/40 border-y border-border-light">
        <PageContainer>
          <div className="max-w-2xl mx-auto">
            {/* Scanner Progress Bar */}
            {isScanning && (
              <div className="bg-background-primary p-6 rounded-2xl border border-border-light shadow-card text-center">
                <p className="text-sm font-semibold text-text-secondary mb-3">Auditing page HTML & network traffic...</p>
                <div className="w-full bg-background-secondary h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-350"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted font-bold block mt-2">{scanProgress}% completed</span>
              </div>
            )}

            {/* Scan Results Output */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background-primary p-6 md:p-8 rounded-3xl border border-border-light shadow-modal"
              >
                <div className="flex justify-between items-center border-b border-border-light pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Target Domain</span>
                    <h3 className="text-lg font-bold text-text-primary mt-1">{scanResult.url}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Score</span>
                    <h3 className="text-2xl font-extrabold text-primary mt-1">{scanResult.score}/100</h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-background-secondary p-4 rounded-xl border border-border-light text-center">
                    <span className="text-2xl font-extrabold text-text-primary">{scanResult.cookiesFound}</span>
                    <p className="text-[11px] font-bold text-text-secondary mt-1 uppercase tracking-wider">Cookies Found</p>
                  </div>
                  <div className="bg-background-secondary p-4 rounded-xl border border-border-light text-center">
                    <span className="text-2xl font-extrabold text-status-error">{scanResult.scriptsBlocked}</span>
                    <p className="text-[11px] font-bold text-text-secondary mt-1 uppercase tracking-wider">Blocked Scripts</p>
                  </div>
                  <div className="bg-background-secondary p-4 rounded-xl border border-border-light text-center">
                    <span className="text-2xl font-extrabold text-status-warning">Medium</span>
                    <p className="text-[11px] font-bold text-text-secondary mt-1 uppercase tracking-wider">Risk Level</p>
                  </div>
                </div>

                {/* Classification Table */}
                <div className="border border-border-light rounded-xl overflow-hidden mb-6">
                  <div className="bg-background-secondary p-3 text-xs font-bold text-text-muted border-b border-border-light grid grid-cols-3">
                    <span>Cookie Category</span>
                    <span className="text-center">Trackers Count</span>
                    <span className="text-right">Status</span>
                  </div>
                  <div className="p-3 text-sm grid grid-cols-3 border-b border-border-light items-center">
                    <span className="font-semibold text-text-primary">Essential / Functional</span>
                    <span className="text-center text-text-secondary">{scanResult.categories.essential}</span>
                    <span className="text-right text-status-success font-semibold text-xs">✓ Exempt</span>
                  </div>
                  <div className="p-3 text-sm grid grid-cols-3 border-b border-border-light items-center">
                    <span className="font-semibold text-text-primary">Analytics / Performance</span>
                    <span className="text-center text-text-secondary">{scanResult.categories.analytics}</span>
                    <span className="text-right text-status-warning font-semibold text-xs">▲ Consent Needed</span>
                  </div>
                  <div className="p-3 text-sm grid grid-cols-3 items-center">
                    <span className="font-semibold text-text-primary">Marketing / Tracking</span>
                    <span className="text-center text-text-secondary">{scanResult.categories.marketing}</span>
                    <span className="text-right text-status-error font-semibold text-xs">✖ Block Active</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/dashboard/scanner" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-3 font-semibold">
                      Unlock Full Vulnerability Audit
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setScanResult(null)} className="rounded-xl">
                    Clear Results
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Info Sections */}
      <SectionWrapper>
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                Identify consent issues before regulators do
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Zenvyra's scanning engine maps out the entire behavior of your page, including scripts dynamically added after page load.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Finds cookies hidden inside nested scripts and tag containers",
                  "Checks if your cookie policy matches the actual cookies in use",
                  "Detects if scripts are loaded before the visitor clicks Accept",
                  "Automated weekly scans available with our premium plan",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-primary font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background-secondary border border-border-light p-8 rounded-3xl space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-status-error/10 text-status-error rounded-lg flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-text-primary">CCPA Opt-Out Gaps</h4>
                  <p className="text-sm text-text-secondary mt-1">
                    Detect if California residents are blocked from opt-out toggles, leading to severe fine liability.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-status-warning/10 text-status-warning rounded-lg flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-text-primary">Unclassified Trackers</h4>
                  <p className="text-sm text-text-secondary mt-1">
                    Identify cookies that are not documented in your Privacy Policy, resulting in poor audit scores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
