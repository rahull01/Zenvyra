"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";

const footerLinks = {
    product: [
        { label: "Features", href: "/features" },
        { label: "Magic Scanner", href: "/magic-scanner" },
        { label: "Monitoring", href: "/monitoring" },
        { label: "Auto-Fix", href: "/auto-fix" },
    ],
    company: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Legal", href: "/legal" },
    ],
    resources: [
        { label: "Documentation", href: "/documentation" },
        { label: "Guide", href: "/guide" },
        { label: "Status", href: "/status" },
        { label: "Community", href: "/community" },
    ],
    legal: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookies", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
    ],
};

export default function Footer() {
    return (
        <footer className="border-t border-surface-700 bg-white/95 pb-10 pt-16">
            <PageContainer>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
                    <div className="sm:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent shadow-glow">
                                <Shield className="h-5 w-5 text-white" />
                            </span>
                            <span className="text-lg font-bold text-surface-100">ComplianceAI</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-6 text-surface-300">
                            AI-powered compliance operations for modern teams. Scan, monitor, and fix privacy issues with confidence.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-surface-100">Product</h4>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link className="text-sm text-surface-300 hover:text-surface-100" href={link.href}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-surface-100">Company</h4>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link className="text-sm text-surface-300 hover:text-surface-100" href={link.href}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-surface-100">Resources</h4>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <Link className="text-sm text-surface-300 hover:text-surface-100" href={link.href}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-surface-100">Legal</h4>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link className="text-sm text-surface-300 hover:text-surface-100" href={link.href}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-surface-700 pt-6 text-sm text-surface-400">
                    Copyright {new Date().getFullYear()} ComplianceAI. All rights reserved.
                </div>
            </PageContainer>
        </footer>
    );
}
