import type { Metadata } from "next";
import LandingPageClient from "@/components/marketing/LandingPageClient";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zenvyra.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: "Zenvyra",
    },
    description:
      "Zenvyra helps agencies, SaaS teams, and ecommerce brands scan websites, assess privacy and AI readiness, fix trust gaps, monitor changes, and publish proof packs.",
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: "Privacy and AI compliance proof infrastructure for UK, US, and EU-facing websites",
      description:
        "Website scans, privacy and AI readiness checks, consent evidence, public certificates, and monthly proof packs for agencies and growth teams.",
      url: siteUrl,
      siteName: "Zenvyra",
      type: "website",
      images: [
        {
          url: "/images/og-zenvyra.png",
          width: 1200,
          height: 630,
          alt: "Zenvyra enterprise GDPR and cookie consent dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Zenvyra - Privacy and AI Readiness Proof Packs",
      description:
        "Scan websites, identify trust gaps, prepare evidence packs, and publish public readiness certificates without claiming guaranteed legal compliance.",
      images: ["/images/og-zenvyra.png"],
    },
  };
}

export default function LandingPage() {
  return <LandingPageClient />;
}
