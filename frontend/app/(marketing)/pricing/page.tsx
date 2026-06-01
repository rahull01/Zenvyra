'use client';

import React, { useState } from 'react';
import { Check, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for small blogs and personal websites.',
    features: [
      '1 basic policy',
      '10,000 banner views/mo',
      'Basic cookie banner',
      'Quarterly cookie scans',
      'Email support',
    ],
    cta: 'Get Started Free',
    variant: 'outline' as const,
  },
  {
    name: 'Starter',
    price: '10',
    description: 'Essential compliance for growing businesses.',
    features: [
      '3 legal policies',
      '50,000 banner views/mo',
      'Custom branded banner',
      'Monthly cookie scans',
      'Auto policy updates',
      'Priority chat support',
    ],
    cta: 'Start Free Trial',
    variant: 'default' as const,
  },
  {
    name: 'Pro+',
    price: '15',
    popular: true,
    description: 'Complete solution for global compliance needs.',
    features: [
      'Unlimited policies',
      'Unlimited banner views',
      'Advanced customization',
      'Weekly cookie scans',
      'Multi-language (50+)',
      'Google Consent Mode',
      'IAB TCF 2.3',
      'Team members (5)',
      'API access',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    variant: 'default' as const,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Enterprise-grade tools for large teams.',
    features: [
      'Everything in Pro+',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'SSO / SAML',
      'White-label option',
      'Custom contracts',
    ],
    cta: 'Contact Sales',
    variant: 'outline' as const,
  },
];

const faqs = [
  { 
    q: "Is there really a free version?", 
    a: "Yes! Our free plan is free forever for one website and one policy. No credit card required to start." 
  },
  { 
    q: "Can I change plans later?", 
    a: "Absolutely. You can upgrade or downgrade your plan at any time from your dashboard settings." 
  },
  { 
    q: "What happens if I exceed my view limit?", 
    a: "We won't cut you off. We'll notify you if you're consistently over your limit so you can choose to upgrade." 
  },
  { 
    q: "Do you offer refunds?", 
    a: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund." 
  },
  { 
    q: "Can I cancel anytime?", 
    a: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period." 
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-background-primary min-h-screen">
      {/* Header Section */}
      <section className="py-32 px-6 text-center max-w-[1400px] mx-auto">
        <span className="text-eyebrow font-bold text-primary uppercase tracking-[0.15em]">
          PRICING
        </span>
        <h1 className="text-h1 font-extrabold text-text-primary mt-4 mb-6 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-body-lg text-text-secondary mb-12 max-w-2xl mx-auto">
          Choose the plan that fits your business. All plans include a 14-day free trial.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={cn("text-body-sm font-semibold", !isAnnual ? "text-text-primary" : "text-text-tertiary")}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 bg-background-tertiary rounded-full relative p-1 transition-colors hover:bg-background-tertiary"
          >
            <div className={cn(
              "w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
              isAnnual ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-body-sm font-semibold", isAnnual ? "text-text-primary" : "text-text-tertiary")}>Annual</span>
            <span className="bg-status-success/10 text-status-success text-caption font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.05em]">Save 20%</span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                "bg-background-primary rounded-2xl p-8 border transition-all duration-350 flex flex-col relative",
                plan.popular ? "border-2 border-primary shadow-card-hover scale-105 z-10" : "border-border-light shadow-card hover:shadow-card-hover hover:border-border-medium"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-caption font-bold uppercase tracking-[0.05em] px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-h4 font-semibold text-text-primary mb-1">{plan.name}</h3>
                <p className="text-body-sm text-text-secondary h-8">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-h2 font-extrabold text-text-primary">
                  {plan.price === 'Custom' ? '' : '$'}{plan.price}
                </span>
                {plan.price !== 'Custom' && (
                  <span className="text-text-tertiary font-medium">/mo</span>
                )}
              </div>

              <Button variant={plan.variant} size="default" className="w-full mb-8">
                {plan.cta}
              </Button>

              <div className="space-y-4 flex-1">
                <p className="text-caption font-bold text-text-tertiary uppercase tracking-[0.05em]">What's included</p>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-status-success mt-0.5 shrink-0" />
                    <span className="text-body-sm text-text-secondary leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-6 bg-background-secondary">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-background-primary rounded-xl border border-border-light overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-background-secondary">
                  <th className="text-left p-5 text-body-sm font-semibold text-text-primary uppercase tracking-[0.05em]">Feature</th>
                  <th className="text-center p-5 text-body-sm font-semibold text-text-primary">Free</th>
                  <th className="text-center p-5 text-body-sm font-semibold text-text-primary">Starter</th>
                  <th className="text-center p-5 text-body-sm font-semibold text-primary">Pro+</th>
                  <th className="text-center p-5 text-body-sm font-semibold text-text-primary">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Legal Policies', free: '1', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Banner Views', free: '10K/mo', starter: '50K/mo', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Cookie Scans', free: 'Quarterly', starter: 'Monthly', pro: 'Weekly', enterprise: 'Daily' },
                  { feature: 'Team Members', free: '1', starter: '2', pro: '5', enterprise: 'Unlimited' },
                  { feature: 'API Access', free: false, starter: false, pro: true, enterprise: true },
                  { feature: 'White-label', free: false, starter: false, pro: false, enterprise: true },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-border-light hover:bg-background-secondary">
                    <td className="p-5 text-body-sm text-text-primary font-medium">{row.feature}</td>
                    <td className="p-5 text-center text-body-sm text-text-secondary">
                      {typeof row.free === 'boolean' ? (row.free ? '✓' : '—') : row.free}
                    </td>
                    <td className="p-5 text-center text-body-sm text-text-secondary">
                      {typeof row.starter === 'boolean' ? (row.starter ? '✓' : '—') : row.starter}
                    </td>
                    <td className="p-5 text-center text-body-sm text-text-secondary">
                      {typeof row.pro === 'boolean' ? (row.pro ? '✓' : '—') : row.pro}
                    </td>
                    <td className="p-5 text-center text-body-sm text-text-secondary">
                      {typeof row.enterprise === 'boolean' ? (row.enterprise ? '✓' : '—') : row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-extrabold text-text-primary mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-background-primary rounded-xl border border-border-light overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-background-secondary transition-colors"
                >
                  <h3 className="text-body font-semibold text-text-primary">{faq.q}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-text-tertiary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-tertiary" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-body text-text-secondary leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-h2 font-extrabold text-text-primary mb-4">
            Still have questions?
          </h2>
          <p className="text-body-lg text-text-secondary mb-8">
            Our team is here to help you find the perfect plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg">
              Contact Sales
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}