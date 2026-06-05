'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const heroStats = [
  { label: 'Live website scans', value: '15s' },
  { label: 'AI policy drafts', value: '1000+' },
  { label: 'GDPR, CCPA, LGPD', value: '20+' },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-hero-gradient py-20">
      <div className="absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top_right,_rgba(255,145,77,0.18),_transparent_34%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[260px] bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_40%)] pointer-events-none" />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/90 backdrop-blur">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
              Trusted by high-growth product teams
            </div>

            <h1 className="text-[clamp(2.8rem,4.2vw,4rem)] font-extrabold tracking-tight text-white leading-[1.02]">
              Built like a modern SaaS product for practical compliance.
            </h1>

            <p className="max-w-xl text-base leading-7 text-white/80">
              ComplianceAI Pro turns privacy, cookie consent, and policy workflows into a beautiful product experience for teams that ship fast. Live scans, audit-ready policy drafts, consent records, and global law coverage are visible in one dashboard.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/auth/signup">
                <Button variant="default" size="lg" className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100 shadow-xl">
                  Start Free Scan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white/90 transition hover:bg-white/15">
                See pricing
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-[28px] border border-white/10 bg-white/10 p-5 text-white/90 backdrop-blur shadow-sm">
                  <p className="text-2xl font-extrabold tracking-tight">{stat.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative max-w-xl mx-auto overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/90 shadow-[0_32px_90px_rgba(15,23,42,0.22)] lg:mx-0"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Compliance Score</p>
                <p className="mt-1 text-3xl font-bold text-white">92%</p>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">Live</div>
            </div>
            <div className="space-y-5 p-5">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/70">Policy health</p>
                    <p className="mt-2 text-lg font-semibold text-white">Good</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">+8% week over week</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-4">
                  <p className="text-xs text-white/70">Consent status</p>
                  <p className="mt-3 text-base font-semibold text-white">Compliant</p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-4">
                  <p className="text-xs text-white/70">Alerts</p>
                  <p className="mt-3 text-base font-semibold text-white">2 issues</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/70">Next scan</p>
                    <p className="mt-2 text-base font-semibold text-white">Today, 11:15 AM</p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">Auto-scan</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 left-1/2 w-[calc(100%-3rem)] -translate-x-1/2 rounded-[30px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur md:left-auto md:right-8 md:w-[20rem] md:-translate-x-0">
              <div className="text-xs uppercase tracking-[0.2em] text-white/70">Featured workflow</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-3xl bg-slate-950/90 p-4 border border-white/10">
                  <p className="text-xs text-white/70">Policy update</p>
                  <p className="mt-2 text-sm font-semibold text-white">Approved 2 minutes ago</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-4 border border-white/10">
                  <p className="text-xs text-white/70">Cookie banner</p>
                  <p className="mt-2 text-sm font-semibold text-white">Live on 1 site</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
