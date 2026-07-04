import type { Metadata } from "next";
import LandingPageClient from "@/components/marketing/LandingPageClient";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zenvyra.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: "Zenvyra",
    },
    description:
      "AI Act compliance for AI startups. Scan your AI product, generate compliant policies, and get audit-ready in minutes.",
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: "AI Act Compliance for AI Startups",
      description:
        "Scan your AI product, generate compliant policies, and get audit-ready in minutes. Built for LLM and AI startups facing EU AI Act requirements.",
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
      title: "AI Act Compliance for AI Startups",
      description:
        "Scan your AI product, generate compliant policies, and get audit-ready in minutes. Built for LLM and AI startups facing EU AI Act requirements.",
      images: ["/images/og-zenvyra.png"],
    },
  };
}

export default function LandingPage() {
  return <LandingPageClient />;
}
