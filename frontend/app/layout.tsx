import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "ComplianceAI Pro - AI-Powered Compliance Automation",
    description: "Scan any website for GDPR, CCPA, and accessibility compliance in seconds. Get AI-powered fixes and 24/7 monitoring.",
    keywords: ["compliance", "GDPR", "CCPA", "accessibility", "AI", "automation"],
    authors: [{ name: "ComplianceAI Pro" }],
    openGraph: {
        title: "ComplianceAI Pro",
        description: "AI-Powered Compliance Automation",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-surface-950 text-surface-100`}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#ffffff",
                            color: "#0f172a",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "12px 16px",
                            boxShadow: "0 8px 30px -18px rgba(15,23,42,0.4)",
                        },
                    }}
                />
            </body>
        </html>
    );
}
