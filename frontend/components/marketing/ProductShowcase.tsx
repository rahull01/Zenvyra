'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const ProductShowcase = () => {
  const features = [
    'Live scan results for cookies, trackers, policies, DSAR, and US privacy notices',
    'AI-assisted recommendations with implementation steps for common platforms',
    'One-click policy versioning and public certificate refreshes',
    'Team activity, audit notes, and client handoff packets in one workspace',
  ];

  return (
    <section className="py-24 bg-background-primary">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="rounded-[32px] border border-border-light bg-slate-950/95 shadow-2xl overflow-hidden">
              <div className="bg-slate-900/90 px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Compliance workspace</p>
                <p className="mt-1 text-3xl font-bold text-white">92%</p>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">Live</div>
              </div>
              <div className="space-y-6 p-6">
                <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/70">Policy health</p>
                      <p className="mt-2 text-xl font-semibold text-white">Review ready</p>
                    </div>
                    <div className="rounded-2xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">+8% this week</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5">
                    <p className="text-sm text-white/70">Consent status</p>
                    <p className="mt-3 text-lg font-semibold text-white">Configured</p>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5">
                    <p className="text-sm text-white/70">Fix queue</p>
                    <p className="mt-3 text-lg font-semibold text-white">2 actions</p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/70">Next scan</p>
                      <p className="mt-2 text-lg font-semibold text-white">Today, 11:15 AM</p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">Auto-scan</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <div className="space-y-6">
              <p className="text-eyebrow font-semibold uppercase tracking-[0.25em] text-primary">
                PRODUCT PREVIEW
              </p>
              <h2 className="text-h2 font-extrabold text-text-primary">
                A dashboard designed around trust, not guesswork
              </h2>
              <p className="max-w-2xl text-body-lg text-text-secondary leading-relaxed">
                Give your team one place to understand what is missing, what is fixed, what proof is
                available, and which items need legal or technical review.
              </p>
            </div>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-1 h-6 w-6 text-primary" />
                  <span className="text-body text-text-secondary">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.46 }}
            >
              <Button variant="default" size="lg">
                Explore Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
