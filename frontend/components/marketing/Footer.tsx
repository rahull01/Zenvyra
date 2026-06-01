'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Facebook, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columns = [
  {
    title: 'Products',
    links: [
      { name: 'Privacy Policy Generator', href: '/products/privacy-policy' },
      { name: 'Terms & Conditions', href: '/products/terms-conditions' },
      { name: 'Cookie Consent', href: '/products/cookie-consent' },
      { name: 'Cookie Scanner', href: '/products/cookie-scanner' },
      { name: 'EULA Generator', href: '/products/eula' },
      { name: 'Disclaimer Generator', href: '/products/disclaimer' },
      { name: 'Shipping Policy', href: '/products/shipping-policy' },
      { name: 'Return Policy', href: '/products/return-policy' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Blog', href: '/blog' },
      { name: 'Guides', href: '/guides' },
      { name: 'API Documentation', href: '/help' },
      { name: 'Status Page', href: '/status' },
      { name: 'Changelog', href: '/help' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Legal', href: '/legal' },
      { name: 'Privacy', href: '/privacy' },
    ]
  }
];

export const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">ComplianceAI Pro</span>
            </Link>
            <p className="text-text-secondary text-base leading-relaxed max-w-[320px]">
              Generate legal policies, manage cookie consent, and stay up-to-date with global privacy laws — all in one platform.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                <Link key={i} href="#" className="p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-text-secondary hover:text-primary">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div className="space-y-6">
            <h4 className="text-caption font-bold uppercase tracking-[0.05em] text-text-tertiary">
              Products
            </h4>
            <ul className="space-y-3">
              {columns[0].links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-6">
            <h4 className="text-caption font-bold uppercase tracking-[0.05em] text-text-tertiary">
              Resources
            </h4>
            <ul className="space-y-3">
              {columns[1].links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-6">
            <h4 className="text-caption font-bold uppercase tracking-[0.05em] text-text-tertiary">
              Company
            </h4>
            <ul className="space-y-3">
              {columns[2].links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-text-secondary">© {new Date().getFullYear()} ComplianceAI Pro. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};