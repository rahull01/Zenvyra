"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Cookie,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  Building2,
  LayoutDashboard,
  Monitor,
  ScanLine,
  Settings,
  ShieldCheck,
} from "lucide-react";
import api from "@/lib/api";
import { planName } from "@/lib/pricing-plans";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "AI Systems", icon: Bot, href: "/ai-act", badge: "Core" },
  { name: "Scanner", icon: ScanLine, href: "/scanner" },
  { name: "Websites", icon: Globe, href: "/websites" },
  { name: "Policies", icon: FileText, href: "/policies" },
  { name: "Consent", icon: Cookie, href: "/consent" },
  { name: "Agency Hub", icon: Building2, href: "/agency" },
];

const secondaryItems = [
  { name: "Admin Ops", icon: Monitor, href: "/admin" },
  { name: "Billing", icon: CreditCard, href: "/billing" },
  { name: "Settings", icon: Settings, href: "/settings/account" },
  { name: "Support", icon: HelpCircle, href: "/support" },
];

type Usage = {
  plan: string;
  limits: Record<string, number>;
  currentUsage: Record<string, number>;
};

export const Sidebar = () => {
  const pathname = usePathname();
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .get<{ data: Usage }>("/dashboard/usage")
      .then((response) => {
        if (mounted) setUsage(response.data.data);
      })
      .catch(() => {
        if (mounted) setUsage(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const usageSummary = useMemo(() => {
    const used = Number(usage?.currentUsage?.scans || 0);
    const total = Number(usage?.limits?.scans || 0);
    const percent = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
    return { used, total, percent };
  }, [usage]);

  const renderItem = (item: (typeof navItems)[number] & { badge?: string }) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-200",
          isActive ? "bg-primary/10 text-accent" : "text-text-secondary hover:bg-background-secondary hover:text-text-primary",
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <item.icon className={cn("h-5 w-5", isActive ? "text-accent" : "text-text-tertiary group-hover:text-text-secondary")} />
        <span className="flex-1">{item.name}</span>
        {item.badge && <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">{item.badge}</span>}
        {isActive && <div className="ml-auto h-4 w-1 rounded-full bg-accent" />}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[260px] flex-col border-r border-border-light bg-surface-card lg:flex">
      <div className="flex h-[72px] items-center border-b border-border-light bg-transparent px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-sm">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">Zenvyra</span>
        </Link>
      </div>

      <nav className="mt-4 flex-1 space-y-8 overflow-y-auto p-4" aria-label="Main navigation">
        <div className="space-y-1">
          <p className="mb-2 px-3 text-caption font-bold uppercase tracking-[0.05em] text-text-secondary">Main Menu</p>
          {navItems.map(renderItem)}
        </div>

        <div className="space-y-1">
          <p className="mb-2 px-3 text-caption font-bold uppercase tracking-[0.05em] text-text-secondary">Platform</p>
          {secondaryItems.map(renderItem)}
        </div>
      </nav>

      <div className="border-t border-border-light p-4">
        <div className="rounded-xl bg-background-secondary p-4">
          <p className="text-body-sm font-semibold text-text-primary">{planName(usage?.plan)} Plan</p>
          <p className="mt-1 text-caption text-text-secondary">
            {usage ? `${usageSummary.used} / ${usageSummary.total} scans` : "Usage loading"}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background-tertiary">
            <div className="h-full bg-accent" style={{ width: `${usageSummary.percent}%` }} />
          </div>
          <Link
            href="/billing"
            className="mt-3 inline-block text-caption font-bold text-accent hover:underline"
            aria-label="Upgrade plan"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </aside>
  );
};
