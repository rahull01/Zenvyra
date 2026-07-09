'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CheckCircle2, Radar, ShieldCheck } from 'lucide-react';

const scanRows = [
  { label: 'AI systems', value: '3 inventoried', tone: 'text-orange-300' },
  { label: 'Transparency', value: '2 notices ready', tone: 'text-white' },
  { label: 'Oversight', value: 'human review mapped', tone: 'text-emerald-300' },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#07080b] pb-10 pt-[96px] text-white sm:pb-12 lg:min-h-[calc(100vh-72px)] lg:pt-[104px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(249,115,22,0.24),transparent_30%),linear-gradient(115deg,#07080b_0%,#0d1016_48%,#190b04_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:86px_86px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.45)_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-xl space-y-5"
          >
            <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-orange-400/30 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
              </span>
              <span className="truncate">EU AI Act readiness evidence for AI startups</span>
            </div>

            <h1 className="max-w-[680px] !text-[2.55rem] font-extrabold tracking-tight !text-white !leading-[1.02] sm:!text-[3.3rem] lg:!text-[clamp(3rem,4.35vw,4.45rem)]">
              AI Act Readiness Evidence for{' '}
              <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-white bg-clip-text text-transparent">
                AI Startups
              </span>
            </h1>

            <p className="max-w-lg text-base leading-7 text-white/68 sm:text-lg">
              Inventory your AI systems, classify risk, map obligations, collect evidence, and export a proof pack your customers and counsel can review. Built for LLM and AI startups facing EU AI Act diligence.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 text-sm font-extrabold text-white shadow-[0_18px_46px_rgba(249,115,22,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_22px_58px_rgba(249,115,22,0.5)]"
              >
                Scan your AI product free
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/ai-act"
                className="inline-flex items-center justify-center rounded-xl border border-white/14 bg-white/[0.06] px-6 py-4 text-sm font-bold text-white shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-orange-300/50 hover:bg-white/[0.1]"
              >
                View AI Act workspace
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs font-semibold text-white/58">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-400" />
                Built for LLM startups
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-orange-400" />
                Evidence-backed readiness record
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            whileHover={{ y: -10, scale: 1.01 }}
            className="relative mx-auto w-full max-w-[720px] lg:mx-0"
          >
            <div className="absolute -inset-7 rounded-[36px] bg-orange-500/24 blur-3xl" />
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-white/18 via-orange-400/18 to-white/5" />
            <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.08] shadow-[0_34px_100px_rgba(0,0,0,0.45),0_0_70px_rgba(249,115,22,0.16)] backdrop-blur-2xl transition-all duration-300">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_34%,rgba(249,115,22,0.08))]" />
              <div className="relative flex items-center justify-between gap-4 border-b border-white/10 bg-black/18 px-5 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">EU AI Act view</p>
                  <p className="mt-1 text-sm text-white/55">inventory, risk, notices, proof</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-500/12 px-3 py-1.5 text-xs font-bold text-orange-100">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-300 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
                  </span>
                  Auto updating
                </div>
              </div>

              <div className="relative grid gap-4 p-5 sm:grid-cols-[0.82fr_1.18fr]">
                <div className="rounded-xl border border-white/10 bg-black/24 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/52">
                    <Radar className="h-4 w-4 text-orange-300" />
                    Readiness
                  </div>
                  <div className="mt-5 flex items-end gap-2">
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.35 }}
                      className="text-6xl font-black leading-none text-white"
                    >
                      92
                    </motion.span>
                    <span className="pb-2 text-sm font-bold text-orange-200">/100</span>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                      className="h-full rounded-full bg-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.72)]"
                    />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white/78">Ready for counsel review</p>
                </div>

                <div className="space-y-3">
                  {scanRows.map((row) => (
                    <div key={row.label} className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.075] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-orange-300/30 hover:bg-white/[0.1] hover:shadow-[0_12px_34px_rgba(249,115,22,0.12)]">
                      <div>
                        <p className="text-xs text-white/46">{row.label}</p>
                        <p className={`mt-1 text-sm font-bold ${row.tone}`}>{row.value}</p>
                      </div>
                      <BadgeCheck className="h-5 w-5 shrink-0 text-orange-300 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mx-5 mb-5 rounded-xl border border-orange-300/24 bg-orange-500/[0.09] p-4 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-orange-200/75">AI readiness pack</p>
                    <p className="mt-1 text-base font-bold text-white">Evidence your team can review</p>
                    <p className="mt-1 text-xs leading-5 text-white/56">AI inventory, notices, oversight gaps, privacy evidence, and certificate in one workflow.</p>
                  </div>
                  <Link
                    href="/auth/signup"
                    className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-[0_14px_34px_rgba(249,115,22,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_18px_44px_rgba(249,115,22,0.48)]"
                  >
                    Build evidence
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-12 hidden rounded-xl border border-orange-300/28 bg-black/52 px-4 py-3 text-white shadow-2xl backdrop-blur-2xl md:flex md:items-center md:gap-3">
              <ShieldCheck className="h-5 w-5 text-orange-300" />
              <span className="text-xs font-bold">AI evidence ready</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
