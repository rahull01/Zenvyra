'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Bot,
  Braces,
  Cookie,
  FileText,
  Globe2,
  LifeBuoy,
  RefreshCw,
  Search,
  ShieldCheck,
  WalletCards,
  Wrench,
} from 'lucide-react';

const coverage = [
  {
    icon: ShieldCheck,
    title: 'EU and UK coverage',
    description:
      'Map GDPR, UK GDPR, PECR, consent, privacy notices, and DSAR readiness into practical tasks.',
  },
  {
    icon: Globe2,
    title: 'US state privacy checks',
    description:
      'Track CPRA-style disclosures, opt-out language, request forms, sale/share signals, and policy gaps.',
  },
  {
    icon: Cookie,
    title: 'Cookie and tracker control',
    description:
      'Scan pixels, classify cookies, document categories, and prepare banner settings for launch.',
  },
];

const features = [
  {
    icon: FileText,
    title: 'Policy generators',
    description:
      'Create privacy, cookie, terms, refund, shipping, EULA, disclaimer, and acceptable-use policies from real business inputs.',
  },
  {
    icon: Cookie,
    title: 'Consent management',
    description:
      'Deploy banners, preference centers, consent logs, versioned notices, and region-aware cookie controls.',
  },
  {
    icon: Search,
    title: 'Website risk discovery',
    description:
      'Find hidden pixels, missing policy links, weak request flows, unclassified scripts, and broken trust signals.',
  },
  {
    icon: RefreshCw,
    title: 'Always up to date',
    description:
      'Keep policy versions, scan records, remediation notes, and proof pages fresh as your website changes.',
  },
  {
    icon: Wrench,
    title: 'Easy to install',
    description:
      'Get exact steps for Shopify, WordPress, Webflow, Google Tag Manager, Next.js, and custom websites.',
  },
  {
    icon: BadgeCheck,
    title: 'Public certificate',
    description:
      'Share a clean verification page with customers, agencies, procurement teams, or internal reviewers.',
  },
  {
    icon: Bot,
    title: 'AI compliance assistant',
    description:
      'Ask what changed, why it matters, what to fix first, and what proof should be sent to a client.',
  },
  {
    icon: Braces,
    title: 'Developer-ready APIs',
    description:
      'Use snippets and API-ready workflows for consent capture, policy embeds, scanner results, and status pages.',
  },
  {
    icon: WalletCards,
    title: 'Save setup cost',
    description:
      'Reduce manual policy drafting, repeated cookie audits, and back-and-forth review work before launch.',
  },
  {
    icon: LifeBuoy,
    title: 'Human support path',
    description:
      'Escalate confusing scan results, implementation questions, and agency handoff work without losing context.',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const Features = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="text-eyebrow font-bold uppercase tracking-[0.15em] text-primary">
            Complete compliance stack
          </p>
          <h2 className="mt-4 text-h2 font-extrabold text-text-primary">
            Everything you need out of the box
          </h2>
          <p className="mt-4 text-body-lg text-text-secondary">
            Visitors should not have to guess what the product does. This page now shows coverage,
            workflows, proof, implementation help, and limitations in one place.
          </p>
        </motion.div>

        <div className="mb-10 grid gap-5 lg:grid-cols-3">
          {coverage.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-lg border border-orange-200 bg-white p-8 text-center shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-orange-50 text-primary">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-h4 font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 text-body text-text-secondary">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.06 }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="rounded-lg border border-slate-200 bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_60px_rgba(15,23,42,0.09)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-h4 font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-3 text-body-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
