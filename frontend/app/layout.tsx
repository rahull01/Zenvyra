import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { getZenvyraSchemaGraph } from "@/lib/seo-schema";
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
      "AI Act compliance for AI startups. Scan your AI product, generate compliant policies, and get audit-ready in minutes.",
    keywords: [
      "AI Act compliance",
      "AI startup compliance",
      "EU AI Act",
      "LLM compliance",
      "AI governance",
      "AI policy generator",
      "AI audit readiness",
    ],
    authors: [{ name: "Zenvyra" }],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "AI Act Compliance for AI Startups",
      description:
        "Scan your AI product, generate compliant policies, and get audit-ready in minutes. Built for LLM and AI startups facing EU AI Act requirements.",
      url: siteUrl,
      siteName: "Zenvyra",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/images/og-zenvyra.png",
          width: 1200,
          height: 630,
          alt: "Zenvyra automated privacy compliance platform",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObject) }}
        />
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
