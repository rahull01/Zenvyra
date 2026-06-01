import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ComplianceAI Pro - All-In-One Compliance Solution",
  description:
    "Generate legal policies, manage cookie consent, and stay up-to-date with global privacy laws — all in one platform. Trusted by 10,000+ businesses.",
  keywords: ["compliance", "GDPR", "CCPA", "privacy policy", "cookie consent", "terms of service"],
  authors: [{ name: "ComplianceAI Pro" }],
  openGraph: {
    title: "ComplianceAI Pro - All-In-One Compliance Solution",
    description: "Generate legal policies, manage cookie consent, and stay up-to-date with global privacy laws.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#0F172A",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            },
            success: { iconTheme: { primary: "#10B981", secondary: "#FFFFFF" } },
            error: { iconTheme: { primary: "#EF4444", secondary: "#FFFFFF" } },
          }}
        />
      </body>
    </html>
  );
}
