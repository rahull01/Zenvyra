"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ICONS } from "@/lib/icons";
import { PRODUCT_PAGES, type ProductSlug } from "@/lib/product-pages";

type Props = {
  slug: ProductSlug;
};

export default function ProductPageTemplate({ slug }: Props) {
  const content = PRODUCT_PAGES[slug];
  const Icon = ICONS[content.iconName];

  return (
    <main className="min-h-screen bg-white pt-24">
      <section className="bg-hero-gradient py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 inline-flex rounded-full bg-brand-orange-light px-4 py-2 text-[13px] font-bold uppercase tracking-[0.15em] text-brand-orange">
              {content.eyebrow}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
              {content.title}{" "}
              <span className="text-brand-orange">{content.highlight}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
              {content.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={content.ctaHref} className="btn-primary text-base">
                {content.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="btn-secondary text-base">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="feature-card border border-border-light">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[14px] bg-brand-orange-light">
                <Icon className="h-7 w-7 text-brand-orange" aria-hidden />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Built for production teams</h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                ComplianceAI Pro combines legal-grade templates with AI assistance so you ship faster
                without sacrificing audit readiness.
              </p>
            </div>
            <ul className="space-y-4">
              {content.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="standard-card flex items-start gap-4 !transform-none hover:!translate-y-0"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
                  <span className="text-base text-text-secondary">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-cta-banner py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to get compliant?</h2>
          <p className="mt-4 text-lg text-white/85">
            Join 10,000+ businesses using ComplianceAI Pro. No credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-brand-orange shadow-lg transition-all hover:-translate-y-0.5 hover:bg-bg-secondary"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
