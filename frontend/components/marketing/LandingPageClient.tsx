"use client";

import dynamic from "next/dynamic";
import React from "react";
import Hero from "@/components/marketing/Hero";
import StatsBar from "@/components/marketing/StatsBar";

const SectionFallback = ({ height = 420 }: { height?: number }) => (
  <div aria-hidden="true" style={{ minHeight: height }} className="bg-background-base" />
);

const Features = dynamic(() => import("@/components/marketing/Features"), {
  ssr: false,
  loading: () => <SectionFallback />,
});
const ProductShowcase = dynamic(() => import("@/components/marketing/ProductShowcase"), {
  ssr: false,
  loading: () => <SectionFallback height={520} />,
});
const ProofPackSection = dynamic(() => import("@/components/marketing/ProofPackSection"), {
  ssr: false,
  loading: () => <SectionFallback height={520} />,
});
const TrustBadges = dynamic(() => import("@/components/marketing/TrustBadges"), {
  ssr: false,
  loading: () => <SectionFallback />,
});
const Testimonials = dynamic(() => import("@/components/marketing/Testimonials"), {
  ssr: false,
  loading: () => <SectionFallback />,
});
const SolutionsGrid = dynamic(
  () => import("@/components/marketing/SolutionsGrid").then((mod) => mod.SolutionsGrid),
  {
    ssr: false,
    loading: () => <SectionFallback />,
  }
);
const CTABanner = dynamic(() => import("@/components/marketing/CTABanner").then((mod) => mod.CTABanner), {
  ssr: false,
  loading: () => <SectionFallback height={260} />,
});
const CookieConsent = dynamic(() => import("@/components/marketing/CookieConsent"), {
  ssr: false,
});

export default function LandingPageClient() {
  return (
    <main className="min-h-screen bg-background-base">
      <Hero />
      <StatsBar />
      <Features />
      <ProofPackSection />
      <ProductShowcase />
      <TrustBadges />
      <Testimonials />
      <SolutionsGrid />
      <CTABanner />
      <CookieConsent />
    </main>
  );
}
