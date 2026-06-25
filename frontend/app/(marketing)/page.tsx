import type { Metadata } from "next";
import LandingPageClient from "@/components/marketing/LandingPageClient";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zenvyra.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: "Zenvyra",
    },
    description:
      "Zenvyra helps AI-enabled teams prepare EU AI Act readiness evidence, then support it with privacy, cookie, policy, consent, monitoring, and proof workflows.",
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: "EU AI Act readiness with privacy proof infrastructure",
      description:
        "AI system inventory, readiness assessments, transparency drafts, website privacy scans, consent evidence, public certificates, and monthly proof packs.",
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
      title: "Zenvyra - EU AI Act Readiness Proof Packs",
      description:
        "Inventory AI systems, identify readiness gaps, prepare evidence packs, and publish public trust signals without claiming guaranteed legal compliance.",
      images: ["/images/og-zenvyra.png"],
    },
  };
}

export default function LandingPage() {
  return <LandingPageClient />;
}
