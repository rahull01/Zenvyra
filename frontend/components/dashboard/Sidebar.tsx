'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Cookie, 
  Globe, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { 
    name: 'Policies', 
    icon: FileText, 
    href: '/dashboard/policies',
    children: ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy']
  },
  { name: 'Consent', icon: Cookie, href: '/dashboard/consent' },
  { name: 'Websites', icon: Globe, href: '/dashboard/websites' },
  { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
];

const secondaryItems = [
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { name: 'Support', icon: HelpCircle, href: '/dashboard/support' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-background-primary border-r border-border-light flex flex-col z-50">
      {/* Logo Section */}
      <div className="h-[72px] px-6 flex items-center border-b border-border-light">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-text-primary tracking-tight">ComplianceAI Pro</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav 
        className="flex-1 overflow-y-auto p-4 space-y-8 mt-4"
        aria-label="Main navigation"
      >
        <div className="space-y-1">
          <p className="px-3 text-caption font-bold uppercase tracking-[0.05em] text-text-tertiary mb-2">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-primary-light text-primary" 
                    : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-text-tertiary group-hover:text-text-secondary")} />
                {item.name}
                {isActive && <div className="ml-auto w-1 h-4 bg-primary rounded-full" />}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <p className="px-3 text-caption font-bold uppercase tracking-[0.05em] text-text-tertiary mb-2">Platform</p>
          {secondaryItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-all duration-200"
            >
              <item.icon className="w-5 h-5 text-text-tertiary" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border-light">
        <div className="bg-background-secondary rounded-xl p-4">
          <p className="text-body-sm font-semibold text-text-primary">Free Plan</p>
          <p className="text-caption text-text-secondary mt-1">10,000 / 10,000 views</p>
          <div className="w-full bg-background-tertiary h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full w-full" />
          </div>
          <button 
            className="text-caption font-bold text-primary mt-3 hover:underline"
            aria-label="Upgrade to paid plan"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};