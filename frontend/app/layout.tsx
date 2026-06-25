import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { getZenvyraSchemaGraph } from "@/lib/seo-schema";
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
      "Zenvyra is a AI privacy compliance platform, automated cookie consent platform, and enterprise GDPR tool for live policy updates, AI tracker classification, consent audit trails, and DSAR workflows.",
    keywords: [
      "AI privacy compliance platform",
      "Automated cookie consent platform",
      "Enterprise GDPR tool",
      "privacy compliance software",
      "AI tracker classification",
      "DSAR deadline tracking",
      "dynamic privacy policy updates",
    ],
    authors: [{ name: "Zenvyra" }],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "Zenvyra - AI Privacy Compliance Platform for Automated Cookie Consent",
      description:
        "Enterprise GDPR tool for automated cookie consent, live dynamic policy updates, AI website tracker classification, consent audit trails, and DSAR deadline workflows.",
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
      title: "Zenvyra - Automated Cookie Consent Platform",
      description:
        "AI privacy compliance platform and enterprise GDPR tool with dynamic policy updates, AI tracker classification, consent audit trails, and DSAR automation.",
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
