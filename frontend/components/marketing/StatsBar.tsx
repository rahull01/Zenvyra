'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, FileClock, Globe2, ShieldCheck } from 'lucide-react';

const stats = [
  {
    icon: ShieldCheck,
    value: 'UK + EU',
    label: 'GDPR, PECR, cookie consent, DSAR, and policy evidence workflows.',
  },
  {
    icon: Globe2,
    value: 'US privacy',
    label: 'CPRA-style disclosures, request intake, opt-out checks, and state privacy review notes.',
  },
  {
    icon: FileClock,
    value: '24/7',
    label: 'Scheduled scans, change alerts, policy version history, and remediation tracking.',
  },
  {
    icon: BadgeCheck,
    value: 'Proof pack',
    label: 'Public certificate, consent audit trail, policy health, and buyer-ready evidence.',
  },
];

const trustPoints = [
  'Built for agencies, SaaS teams, ecommerce brands, and launch teams.',
  'Designed to explain what was checked, what changed, and what still needs review.',
  'Clear legal disclaimer: operational evidence and workflows, not law-firm advice.',
];

const StatsBar = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-10 text-center">
          <p className="text-eyebrow font-semibold uppercase tracking-[0.25em] text-primary">
            Compliance information users can trust
          </p>
          <h2 className="mx-auto mt-3 max-w-4xl text-h2 font-extrabold text-text-primary">
            Everything a visitor needs before trusting your product
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-body-lg text-text-secondary">
            Show coverage, explain workflows, surface proof, and make every next step obvious from
            the first scroll.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-extrabold text-slate-950">{stat.value}</p>
                <p className="mt-3 text-body-sm text-slate-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-3 rounded-lg border border-orange-200 bg-orange-50/70 p-5 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div key={point} className="flex gap-3 text-sm font-medium leading-6 text-slate-800">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
