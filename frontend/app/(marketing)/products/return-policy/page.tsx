"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, ChevronRight, RefreshCw, Truck, RotateCcw } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReturnPolicyGeneratorPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      {/* Hero Section */}
      <SectionWrapper className="pt-24 pb-16 lg:pt-32 relative overflow-hidden bg-gradient-to-b from-primary-light/40 to-background-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,126,34,0.08),transparent_50%)]" />
        <PageContainer className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Return & Refund Policy Generator
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary"
            >
              Clear <span className="text-primary">Return & Refund Policies</span> for retail & SaaS.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
            >
              Avoid customer confusion, reduce chargebacks, and clearly state return windows, shipping costs, and restocking requirements.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex justify-center"
            >
              <Link href="/policies/new">
                <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl text-base font-semibold shadow-button">
                  Create Return Policy
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Benefits */}
      <SectionWrapper className="bg-background-secondary/40 border-y border-border-light">
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light shadow-card">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Restocking Fees</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Declare if restocking costs are deducted from refund amounts, protecting margins on return shipments.
              </p>
            </div>
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light shadow-card">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Return Shipping</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Specify who pays for the shipping labels and whether shipping costs are non-refundable.
              </p>
            </div>
            <div className="bg-background-primary p-6 rounded-2xl border border-border-light shadow-card">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Refund Processing Window</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Outline standard payment processing timelines (e.g. 5-7 business days) to prevent premature dispute calls.
              </p>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>

      {/* Info */}
      <SectionWrapper>
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                Minimize checkout abandonment & boost trust
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Over 60% of online shoppers check a store's return policy before completing their purchase. A transparent and fair return policy is key to securing conversions.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Covers physical items, downloadable assets, and subscriptions",
                  "Outlines eligibility conditions (unopened packages, tags intact)",
                  "Complies with consumer protection laws in CA, UK, and Europe",
                  "Integrates seamlessly with Shopify, WooCommerce, or custom sites",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-primary font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background-secondary p-8 rounded-3xl border border-border-light">
              <h4 className="text-base font-bold text-text-primary mb-3">SaaS / Subscription Refund Details</h4>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                For SaaS products, return policies explain trial terms, pro-rated billing refunds, and subscription cancellation grace periods, protecting your digital business from unwarranted chargeback claims.
              </p>
              <Link href="/policies/new">
                <Button className="bg-primary hover:bg-primary-hover text-white">
                  Generate Return Policy
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </main>
  );
}
