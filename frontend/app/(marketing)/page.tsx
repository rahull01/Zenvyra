'use client';

import React from 'react';
import Hero from '@/components/marketing/Hero';
import StatsBar from '@/components/marketing/StatsBar';
import Features from '@/components/marketing/Features';
import ProductShowcase from '@/components/marketing/ProductShowcase';
import TrustBadges from '@/components/marketing/TrustBadges';
import Testimonials from '@/components/marketing/Testimonials';
import { SolutionsGrid } from '@/components/marketing/SolutionsGrid';
import { CTABanner } from '@/components/marketing/CTABanner';
import CookieConsent from '@/components/marketing/CookieConsent';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background-base">
      <Hero />
      <StatsBar />
      <Features />
      <ProductShowcase />
      <TrustBadges />
      <Testimonials />
      <SolutionsGrid />
      <CTABanner />
      <CookieConsent />
    </main>
  );
}