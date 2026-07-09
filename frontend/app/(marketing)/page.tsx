import type { Metadata } from "next";
import LandingPageClient from "@/components/marketing/LandingPageClient";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zenvyra.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: "Zenvyra",
    },
    description:
      "EU AI Act readiness evidence for AI startups. Inventory systems, classify risk, map obligations, collect evidence, and export a proof pack for customer diligence.",
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: "AI Act Readiness Evidence for AI Startups",
      description:
        "Inventory your AI systems, classify risk, map obligations, collect evidence, and export a proof pack your customers and counsel can review. Built for LLM and AI startups facing EU AI Act diligence.",
      url: siteUrl,
      siteName: "Zenvyra",
      type: "website",
      images: [
        {
          url: "/images/og-zenvyra.png",
          width: 1200,
          height: 630,
          alt: "Zenvyra EU AI Act readiness and privacy proof dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Act Readiness Evidence for AI Startups",
      description:
        "Inventory your AI systems, classify risk, map obligations, collect evidence, and export a proof pack your customers and counsel can review. Built for LLM and AI startups facing EU AI Act diligence.",
      images: ["/images/og-zenvyra.png"],
    },
  };
}

export default function LandingPage() {
  return <LandingPageClient />;
}
