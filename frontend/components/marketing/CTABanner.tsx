'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const CTABanner = () => {
  return (
    <section className="py-24 px-6 bg-background-secondary">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto overflow-hidden rounded-[32px] bg-gradient-to-r from-primary to-secondary p-12 md:p-20 text-white shadow-card-shadow relative"
      >
        <div className="absolute inset-y-0 right-0 w-72 bg-white/10 blur-3xl opacity-30" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="text-eyebrow font-semibold uppercase tracking-[0.25em] text-white/80">
              Built for fast-growth teams
            </p>
            <h2 className="mt-4 text-h2 font-extrabold tracking-tight text-white">
              Launch compliance with confidence on day one.
            </h2>
            <p className="mt-4 max-w-2xl text-body-lg text-white/90 leading-relaxed">
              Start your first website scan, get instant remediation, and keep every release audit-ready without legal overhead.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <Link href="/auth/signup">
              <Button variant="default" size="lg" className="w-full bg-white text-primary hover:bg-slate-100 border-none shadow-xl px-8 py-4">
                Start Free Scan
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