'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Building2, Check, Globe2, Rocket, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const solutions = [
  {
    icon: Rocket,
    title: 'For startups',
    text: 'Inventory AI features, draft transparency language, and launch with supporting privacy proof.',
    href: '/solutions/startups',
  },
  {
    icon: Building2,
    title: 'For agencies',
    text: 'Package AI readiness, website privacy checks, client handoff packets, and verified proof pages.',
    href: '/solutions/agencies',
  },
  {
    icon: Globe2,
    title: 'For ecommerce',
    text: 'Review AI shopping assistants, pixels, cookie banners, request paths, and checkout disclosures.',
    href: '/products',
  },
  {
    icon: ShieldCheck,
    title: 'For SaaS',
    text: 'Track AI systems, providers, notices, subprocessors, DSAR workflows, and public readiness.',
    href: '/solutions/enterprise',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$19',
    billing: '/mo',
    features: ['AI inventory', '3 policies', 'Monthly scans', 'Cookie banner', 'Email support'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    billing: '/mo',
    features: ['AI assessments', 'Unlimited policies', 'Weekly scans', 'Consent logs', 'Public certificate'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Agency',
    price: '$119',
    billing: '/mo',
    features: ['Client AI readiness', 'Proof reports', 'Team roles', 'White-label handoff', 'Setup support'],
    cta: 'Talk to Sales',
    popular: false,
  },
];

export const SolutionsGrid = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="text-eyebrow font-semibold uppercase tracking-[0.25em] text-primary">
            Choose your use case
          </p>
          <h2 className="mt-3 text-h2 font-extrabold text-text-primary">
            AI readiness workflows for every team
          </h2>
          <p className="mt-4 text-body-lg text-text-secondary">
            Make it easy for visitors to recognize the AI governance path and the supporting privacy work.
          </p>
        </motion.div>

        <div className="mb-16 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.05)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-h4 font-semibold text-slate-950">{solution.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{solution.text}</p>
                <Link
                  href={solution.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover"
                >
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-12 text-center">
          <p className="text-eyebrow font-semibold uppercase tracking-[0.25em] text-primary">
            Simple pricing
          </p>
          <h2 className="mt-3 text-h2 font-extrabold text-text-primary">Start with AI inventory, upgrade when proof matters</h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`relative flex h-full flex-col rounded-lg border bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${
                plan.popular ? 'border-primary ring-2 ring-orange-100' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-7">
                <h3 className="text-h4 font-semibold text-text-primary">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-h2 font-extrabold text-text-primary">{plan.price}</span>
                  <span className="font-medium text-text-secondary">{plan.billing}</span>
                </div>
              </div>

              <div className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-body-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild variant={plan.popular ? 'default' : 'outline'} className="mt-auto w-full">
                <Link href={plan.name === 'Agency' ? '/contact' : '/auth/signup'}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover">
            View full pricing
            <BadgeCheck className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
