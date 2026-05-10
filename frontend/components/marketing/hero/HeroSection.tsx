"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Loader2, Search, ShieldCheck, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useScan } from "@/hooks/useScan";
import PageContainer from "@/components/shared/PageContainer";

const proofStats = [
  { label: "Sites scanned today", value: "1,200+" },
  { label: "Issues resolved", value: "8,500+" },
  { label: "First report", value: "15 sec" },
];

const checks = [
  { label: "Privacy policy coverage", value: "98%", tone: "bg-emerald-500" },
  { label: "Cookie consent parity", value: "91%", tone: "bg-cyan-500" },
  { label: "Regional data rights", value: "94%", tone: "bg-indigo-500" },
];

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const { scan, isScanning } = useScan();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Enter a website URL first");
      return;
    }
    await scan(url);
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_62%,#eef6ff_100%)] pt-32 sm:pt-36">
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[34rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.14),rgba(34,197,94,0.09)_38%,transparent_70%)] blur-2xl" />

      <PageContainer>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 lg:grid-cols-[1fr_0.92fr] lg:pb-20">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Compliance automation for SaaS teams
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.02] text-slate-950 md:text-6xl">
              Launch faster with compliance already handled.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
              Scan your product, find privacy and policy gaps, and get clear fixes your team can ship today.
            </p>

            <form onSubmit={handleScan} className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)] sm:flex-row">
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-company.com"
                  className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={isScanning}
                className="brand-button flex min-h-14 items-center justify-center gap-2 px-6 text-sm font-black uppercase tracking-widest"
              >
                {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Scan Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-4">
              {proofStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.08 }}
                  className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <div className="absolute -left-6 top-10 hidden rounded-2xl border border-white/70 bg-white/80 p-4 shadow-premium backdrop-blur-xl md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-950">Live monitoring</p>
                  <p className="text-xs font-semibold text-slate-500">12 regions active</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-[0_36px_90px_-42px_rgba(15,23,42,0.75)]">
              <div className="rounded-[1.45rem] bg-white p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950">Compliance report</p>
                      <p className="text-xs font-semibold text-slate-500">acme-dashboard.com</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    Healthy
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[0.78fr_1fr]">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score</p>
                    <div className="mt-4 flex items-end gap-2">
                      <span className="text-6xl font-black leading-none text-slate-950">94</span>
                      <span className="pb-2 text-sm font-black text-emerald-600">+12</span>
                    </div>
                    <div className="mt-5 h-2 rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: "28%" }}
                        animate={{ width: "94%" }}
                        transition={{ duration: 1.2, delay: 0.45 }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {checks.map((check, index) => (
                      <motion.div
                        key={check.label}
                        initial={false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + index * 0.12 }}
                        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${check.tone}`} />
                            <p className="text-sm font-bold text-slate-700">{check.label}</p>
                          </div>
                          <p className="text-sm font-black text-slate-950">{check.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-black text-slate-950">3 priority fixes ready</p>
                      <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                        Update consent copy, add data request SLA, and align cookie categories.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="border-t border-slate-200/80 py-10"
        >
          <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">
            Trusted by product, legal, and engineering teams
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-6 text-xl font-black italic text-slate-300">
            {["Stripe", "Linear", "Vercel", "Notion", "Figma", "Webflow"].map((logo) => (
              <span key={logo} className="transition-colors duration-300 hover:text-slate-500">
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
