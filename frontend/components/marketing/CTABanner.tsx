'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const CTABanner = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1200px] mx-auto overflow-hidden rounded-lg bg-[linear-gradient(115deg,#0b0b0f_0%,#171717_52%,#ea580c_100%)] p-8 md:p-14 text-white shadow-[0_28px_90px_rgba(15,23,42,0.18)] relative"
      >
        <div className="absolute inset-y-0 right-0 w-72 bg-white/10 blur-3xl opacity-30" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="text-eyebrow font-semibold uppercase tracking-[0.25em] text-white/80">
              Ready to make AI readiness visible?
            </p>
            <h2 className="mt-4 text-h2 font-extrabold tracking-tight text-white">
              Start with an AI system inventory, then turn gaps into trust signals.
            </h2>
            <p className="mt-4 max-w-2xl text-body-lg text-white/90 leading-relaxed">
              Add your first AI system, generate readiness evidence, connect the supporting privacy
              and consent workflows, and prepare proof before customers ask for it.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <Link href="/auth/signup">
              <Button variant="default" size="lg" className="w-full bg-white text-primary hover:bg-slate-100 border-none shadow-xl px-8 py-4">
                Start AI Readiness
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing" className="inline-flex w-full items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/15">
              See pricing options
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
