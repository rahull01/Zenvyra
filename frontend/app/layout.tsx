import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { getZenvyraSchemaGraph } from "@/lib/seo-schema";
import JsonLd from "@/components/JsonLd";
import "./sentry-client";
import "../styles/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zenvyra.com";
const schemaObject = getZenvyraSchemaGraph(siteUrl);

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Zenvyra",
      template: "%s | Zenvyra",
    },
    description:
      "EU AI Act readiness evidence for AI startups. Inventory systems, classify risk, map obligations, collect evidence, and export a proof pack for customer diligence.",
    keywords: [
      "AI Act readiness",
      "AI startup readiness",
      "EU AI Act",
      "LLM governance",
      "AI evidence pack",
      "AI policy drafting",
      "AI audit readiness",
    ],
    authors: [{ name: "Zenvyra" }],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "AI Act Readiness Evidence for AI Startups",
      description:
        "Inventory your AI systems, classify risk, map obligations, collect evidence, and export a proof pack your customers and counsel can review. Built for LLM and AI startups facing EU AI Act diligence.",
      url: siteUrl,
      siteName: "Zenvyra",
      type: "website",
      locale: "en_US",
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={schemaObject} />
      </head>
      <body className="min-h-screen bg-background-base text-text-primary font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            },
            success: { iconTheme: { primary: "var(--success)", secondary: "var(--bg-surface)" } },
            error: { iconTheme: { primary: "var(--danger)", secondary: "var(--bg-surface)" } },
          }}
        />
      </body>
    </html>
  );
}
