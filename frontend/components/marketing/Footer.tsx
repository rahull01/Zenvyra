'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Linkedin, LockKeyhole, Shield, Twitter } from 'lucide-react';

const columns = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Our Commitment To Privacy', href: '/commitment-to-privacy' },
      { name: 'Our Privacy Center', href: '/privacy-center' },
      { name: 'Our Privacy Policy', href: '/privacy' },
      { name: 'Our Terms of Use', href: '/terms' },
      { name: 'Our Disclaimer', href: '/disclaimer' },
      { name: 'Our Cookie Policy', href: '/cookies' },
      { name: 'Our Sub-Processors', href: '/sub-processors' },
      { name: 'Limit Sensitive Information', href: '/limit-sensitive-info' },
      { name: 'Do Not Sell or Share', href: '/do-not-sell' },
      { name: 'Updates and Press', href: '/press' },
    ],
  },
  {
    title: 'Products',
    links: [
      { name: 'Privacy Policy Generator', href: '/products/privacy-policy' },
      { name: 'Terms and Conditions Generator', href: '/products/terms-conditions' },
      { name: 'Cookie Policy Generator', href: '/products/cookie-policy' },
      { name: 'EULA Generator', href: '/products/eula' },
      { name: 'Acceptable Use Policy Generator', href: '/products/acceptable-use-policy' },
      { name: 'Refund & Return Policy Generator', href: '/products/return-policy' },
      { name: 'Shipping Policy Generator', href: '/products/shipping-policy' },
      { name: 'Disclaimer Generator', href: '/products/disclaimer' },
      { name: 'Consent Management Platform', href: '/products/cookie-consent' },
      { name: 'Cookie Consent', href: '/products/cookie-consent' },
      { name: 'Cookie Scanner', href: '/products/cookie-scanner' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help and Support', href: '/help' },
      { name: 'Product Roadmap', href: '/roadmap' },
      { name: 'Product Releases', href: '/product-releases' },
      { name: 'FAQs', href: '/help' },
      { name: 'Contact', href: '/contact' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Partner with Us', href: '/partners' },
      { name: 'Resources', href: '/resources' },
      { name: 'Cookie Preferences', href: '/cookie-preferences' },
      { name: 'Legal Dictionary', href: '/legal-dictionary' },
      { name: 'Security FAQ', href: '/security-faq' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { name: 'Legal Center', href: '/legal' },
      { name: 'Security', href: '/security' },
      { name: 'System Status', href: '/status' },
      { name: 'GDPR Readiness', href: '/gdpr' },
      { name: 'Documentation', href: '/documentation' },
      { name: 'Guides', href: '/guides' },
      { name: 'Blog', href: '/blog' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 pb-8 pt-16 text-slate-950">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 shadow-sm shadow-orange-200/40">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-950">Zenvyra</span>
            </Link>
            <p className="max-w-[360px] text-base leading-relaxed text-slate-600">
              Scan websites, generate policies, manage consent, track remediation, and publish
              privacy proof customers can inspect.
            </p>
            <div className="grid gap-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">
                <LockKeyhole className="h-4 w-4 text-primary" />
                Privacy proof verified by Zenvyra
              </div>
              <p className="max-w-[420px] text-xs leading-5 text-slate-500">
                Zenvyra is not a law firm and does not provide legal advice. Platform
                outputs are operational evidence and should be reviewed with qualified counsel.
              </p>
            </div>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="rounded-lg bg-white p-2.5 text-orange-600 transition-colors hover:bg-orange-100 hover:text-orange-800"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="space-y-5">
              <h4 className="text-caption font-bold uppercase tracking-[0.05em] text-slate-500">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-orange-600"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Copyright {new Date().getFullYear()} Zenvyra. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { name: 'Privacy', href: '/privacy' },
              { name: 'Terms', href: '/terms' },
              { name: 'Cookies', href: '/cookies' },
              { name: 'Refunds', href: '/refund-policy' },
            ].map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-orange-600">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
