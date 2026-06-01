"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const footerLinks = {
  products: [
    { label: "Privacy Policy Generator", href: "/products/privacy-policy" },
    { label: "Cookie Consent", href: "/products/cookie-consent" },
    { label: "Cookie Scanner", href: "/products/cookie-scanner" },
    { label: "Terms & Conditions", href: "/products/terms-conditions" },
    { label: "AI Assistant", href: "/products/ai-assistant" },
    { label: "Pricing", href: "/pricing" },
  ],
  company: [
    { label: "About Us",  href: "/about" },
    { label: "Contact",   href: "/contact" },
    { label: "Partners",  href: "/partners" },
    { label: "Press",     href: "/press" },
  ],
  support: [
    { label: "Help & Support",  href: "/help" },
    { label: "Documentation",   href: "/documentation" },
    { label: "System Status",   href: "/status" },
    { label: "FAQs",             href: "/help" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use",   href: "/terms" },
    { label: "Cookie Policy",  href: "/cookies" },
    { label: "GDPR",           href: "/gdpr" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-secondary-dark pt-20 pb-12 text-white">
      {/* faint glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse at 30% 10%, var(--accent) 0%, transparent 60%), "
                    + "radial-gradient(ellipse at 70% 90%, var(--accent-dark) 0%, transparent 50%)",
        }}
      />

      <div className="container relative mx-auto px-6">
        <div className="mb-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-6">

          {/* Brand column */}
          <div className="space-y-5 sm:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text">
              <svg className="h-9 w-9 text-white filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logo-grad-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--accent-dark)" />
                  </linearGradient>
                </defs>
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="url(#logo-grad-footer)" />
                <path d="M9 11l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xl font-black tracking-tight text-white">&nbsp;ComplianceAI Pro</span>
            </Link>
            <p className="max-w-xs text-[15px] leading-relaxed text-text-tertiary">
              All-in-one data privacy compliance for websites and apps.
              Generate policies, manage consent, and stay compliant worldwide.
            </p>
            {/* social row */}
            <div className="flex items-center gap-2">
              {["in","x","yt","ig"].map((s) => (
                <span key={s} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-accent text-[10px] font-black cursor-pointer hover:bg-accent/20 transition-colors">
                  {s.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* link columns */}
          {[
            { title: "Products", links: footerLinks.products },
            { title: "Company",  links: footerLinks.company },
            { title: "Support",  links: footerLinks.support },
            { title: "Legal",    links: footerLinks.legal },
          ].map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                {col.title}
              </h2>
              <ul className="space-y-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-text-tertiary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[12px] text-text-tertiary">
            © {new Date().getFullYear()} ComplianceAI Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy","Cookie Policy","Terms of Use"].map((l) => (
              <Link key={l} href="#" className="text-[12px] text-text-tertiary hover:text-accent hover:underline">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
