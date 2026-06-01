'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, ChevronDown, FileText, Cookie, Globe, BarChart3, BookOpen, Building2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    { 
      name: 'Products', 
      href: '/products',
      items: [
        { category: 'Policy Generators', links: [
          { name: 'Privacy Policy Generator', href: '/products/privacy-policy', icon: FileText },
          { name: 'Cookie Policy Generator', href: '/products/cookie-policy', icon: Cookie },
          { name: 'Terms & Conditions', href: '/products/terms-conditions', icon: FileText },
          { name: 'EULA Generator', href: '/products/eula', icon: FileText },
          { name: 'Disclaimer Generator', href: '/products/disclaimer', icon: FileText },
        ]},
        { category: 'Consent Management', links: [
          { name: 'Cookie Consent', href: '/products/cookie-consent', icon: Cookie },
          { name: 'Cookie Scanner', href: '/products/cookie-scanner', icon: Globe },
          { name: 'Consent Management Platform', href: '/products/consent-platform', icon: BarChart3 },
        ]}
      ]
    },
    { 
      name: 'Solutions', 
      href: '/solutions',
      items: [
        { category: 'Solutions', links: [
          { name: 'For Startups', href: '/solutions/startups', icon: Globe },
          { name: 'For Agencies', href: '/solutions/agencies', icon: Building2 },
          { name: 'For Enterprise', href: '/solutions/enterprise', icon: BarChart3 },
        ]}
      ]
    },
    { name: 'Pricing', href: '/pricing' },
    { 
      name: 'Resources', 
      href: '/resources',
      items: [
        { category: 'Resources', links: [
          { name: 'Blog', href: '/blog', icon: BookOpen },
          { name: 'Guides', href: '/guides', icon: BookOpen },
          { name: 'API Documentation', href: '/docs', icon: FileText },
          { name: 'Help Center', href: '/help', icon: HelpCircle },
        ]}
      ]
    },
    { 
      name: 'Company', 
      href: '/about',
      items: [
        { category: 'Company', links: [
          { name: 'About Us', href: '/about', icon: Building2 },
          { name: 'Careers', href: '/careers', icon: Building2 },
          { name: 'Contact', href: '/contact', icon: HelpCircle },
          { name: 'Press', href: '/press', icon: FileText },
        ]}
      ]
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-background-primary/95 backdrop-blur-[12px] border-b border-border-light z-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-hover transition-colors">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-text-primary font-bold text-xl tracking-tight group-hover:text-primary transition-colors">ComplianceAI Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div 
              key={link.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {link.items ? (
                <button className="flex items-center gap-1 px-4 py-2 text-text-secondary text-sm font-medium hover:text-primary hover:bg-background-secondary rounded-lg transition-all duration-200">
                  {link.name}
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="px-4 py-2 text-text-secondary text-sm font-medium hover:text-primary hover:bg-background-secondary rounded-lg transition-all duration-200"
                >
                  {link.name}
                </Link>
              )}

              {/* Dropdown Menu */}
              {link.items && activeDropdown === link.name && (
                <div className="absolute top-full left-0 mt-2 w-[400px] bg-background-primary border border-border-light rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {link.items.map((category) => (
                    <div key={category.category} className="mb-4 last:mb-0">
                      <p className="text-caption font-bold text-text-tertiary uppercase tracking-[0.05em] mb-2 px-2">
                        {category.category}
                      </p>
                      <div className="space-y-1">
                        {category.links.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-text-secondary text-sm font-medium hover:text-primary hover:bg-background-secondary rounded-lg transition-all duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <item.icon className="w-4 h-4 text-text-tertiary" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-text-secondary text-sm font-medium hover:text-primary hover:bg-background-secondary rounded-lg transition-all duration-200"
          >
            Sign In
          </Link>
          <Link href="/auth/signup">
            <Button variant="default" size="default" className="px-6 py-2.5 text-sm font-bold hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg">
              Try for Free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-primary hover:bg-background-secondary rounded-lg transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden absolute top-[72px] left-0 right-0 bg-background-primary border-b border-border-light shadow-lg"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.items ? (
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 text-text-secondary text-base font-medium hover:text-primary hover:bg-background-secondary rounded-lg transition-all flex items-center justify-between">
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="pl-4 space-y-1">
                      {link.items.map((category) => (
                        category.links.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 text-text-tertiary text-sm hover:text-primary hover:bg-background-secondary rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-text-secondary text-base font-medium hover:text-primary hover:bg-background-secondary rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="border-t border-border-light pt-4 mt-4 flex flex-col gap-2">
              <Link
                href="/auth/login"
                className="block px-4 py-3 text-text-secondary text-base font-medium hover:text-primary hover:bg-background-secondary rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link href="/auth/signup">
                <Button variant="default" size="default" className="w-full text-sm font-bold hover:bg-primary-hover transition-all">
                  Try for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
