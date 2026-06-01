'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    billing: 'forever',
    features: ['1 basic policy', '10,000 banner views/mo', 'Basic cookie banner', 'Quarterly cookie scans', 'Email support'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Starter',
    price: '$10',
    billing: '/mo',
    features: ['3 legal policies', '50,000 banner views/mo', 'Custom branded banner', 'Monthly cookie scans', 'Auto policy updates', 'Priority chat support'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro+',
    price: '$15',
    billing: '/mo',
    features: ['Unlimited policies', 'Unlimited banner views', 'Advanced customization', 'Weekly cookie scans', 'Multi-language (50+)', 'Google Consent Mode', 'IAB TCF 2.3', 'Team members (5)', 'API access', 'Priority support'],
    cta: 'Start Free Trial',
    popular: true,
  },
];

export const SolutionsGrid = () => {
  return (
    <section className="py-32 bg-background-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-h2 font-extrabold text-text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-body-lg text-text-secondary">
            Start free, upgrade when you need more
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className={`relative bg-background-primary rounded-2xl p-8 border transition-all duration-350 ${
                plan.popular
                  ? 'border-2 border-primary shadow-card-hover scale-105 z-10'
                  : 'border-border-light shadow-card hover:shadow-card-hover'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-caption font-bold uppercase tracking-[0.05em] px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-h4 font-semibold text-text-primary mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-h2 font-extrabold text-text-primary">{plan.price}</span>
                  <span className="text-text-tertiary font-medium">{plan.billing}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-status-success mt-0.5 shrink-0" />
                    <span className="text-body-sm text-text-secondary leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.popular ? 'default' : 'outline'}
                size="default"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/pricing" className="text-primary font-medium hover:underline">
            View full pricing →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};