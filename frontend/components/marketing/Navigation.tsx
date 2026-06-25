"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  Cookie,
  FileCheck2,
  FileText,
  Gauge,
  Globe2,
  Headphones,
  HelpCircle,
  Landmark,
  LockKeyhole,
  Menu,
  Newspaper,
  Radar,
  Rocket,
  ScanLine,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MegaLink = {
  name: string;
  href: string;
  description: string;
  icon: LucideIcon;
  tag?: string;
};

type MegaColumn = {
  category: string;
  links: MegaLink[];
};

type NavLink = {
  name: string;
  href: string;
  items?: MegaColumn[];
  spotlight?: {
    title: string;
    description: string;
    href: string;
    metric: string;
    label: string;
  };
};

const navLinks: NavLink[] = [
  {
    name: "Products",
    href: "/products",
    spotlight: {
      title: "EU AI Act cockpit",
      description: "Inventory AI systems, assess readiness, publish notices, and back every claim with privacy proof.",
      href: "/ai-act",
      metric: "AI-first",
      label: "Inventory, notices, oversight, proof",
    },
    items: [
      {
        category: "AI readiness",
        links: [
          { name: "EU AI Act Readiness", href: "/ai-act", description: "Inventory AI systems, flag gaps, and prepare evidence for counsel review.", icon: Bot, tag: "Core" },
          { name: "AI Assistant", href: "/products/ai-assistant", description: "Ask AI governance and product compliance questions and turn answers into tasks.", icon: Sparkles, tag: "AI" },
          { name: "Privacy Policy", href: "/products/privacy-policy", description: "Generate and version GDPR, CCPA, and UK privacy notices.", icon: FileText },
          { name: "Terms & Conditions", href: "/products/terms-conditions", description: "Launch defensible terms with plain-language coverage.", icon: FileCheck2 },
        ],
      },
      {
        category: "Privacy support stack",
        links: [
          { name: "Cookie Consent", href: "/products/cookie-consent", description: "Deploy branded consent banners with auditable logs.", icon: ShieldCheck },
          { name: "Cookie Scanner", href: "/products/cookie-scanner", description: "Detect trackers, categories, and drift before release.", icon: ScanLine },
          { name: "Cookie Policy", href: "/products/cookie-policy", description: "Keep cookie disclosures aligned with scans and consent.", icon: Cookie },
          { name: "Competitor Audit", href: "/products/competitor-audit", description: "Benchmark trust posture against companies buyers know.", icon: Radar },
        ],
      },
    ],
  },
  {
    name: "Solutions",
    href: "/solutions",
    spotlight: {
      title: "Built by team motion",
      description: "Founder speed, agency scale, and AI governance without splitting the compliance stack.",
      href: "/solutions",
      metric: "3 teams",
      label: "Startup, agency, enterprise",
    },
    items: [
      {
        category: "By company stage",
        links: [
          { name: "For Startups", href: "/solutions/startups", description: "Launch privacy foundations before fundraising, checkout, or ads.", icon: Rocket },
          { name: "For Agencies", href: "/solutions/agencies", description: "Operate client compliance with white-label reports and workflows.", icon: Users, tag: "Popular" },
          { name: "For Enterprise", href: "/solutions/enterprise", description: "Centralize evidence, ownership, monitoring, and audit readiness.", icon: Building2 },
        ],
      },
      {
        category: "By workflow",
        links: [
          { name: "AI Act Workspace", href: "/ai-act", description: "Track AI systems, transparency, oversight, and evidence from one dashboard.", icon: Bot, tag: "Core" },
          { name: "Compliance Checker", href: "/compliance-checker", description: "Run a fast support scan across privacy, consent, and policies.", icon: Gauge },
          { name: "Magic Scanner", href: "/magic-scanner", description: "Turn website findings into prioritized fixes your team can ship.", icon: ScanLine },
          { name: "Monitoring", href: "/monitoring", description: "Track AI readiness, privacy drift, tracker changes, and proof status over time.", icon: BarChart3 },
        ],
      },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  {
    name: "Resources",
    href: "/resources",
    spotlight: {
      title: "Operator library",
      description: "Practical templates and playbooks for teams that need to ship trust, not read theory all day.",
      href: "/resources",
      metric: "50+ assets",
      label: "Guides, templates, docs",
    },
    items: [
      {
        category: "Learn",
        links: [
          { name: "Guides", href: "/guides", description: "Step-by-step privacy, consent, and launch playbooks.", icon: BookOpen },
          { name: "Blog", href: "/blog", description: "Product compliance lessons for founders and operators.", icon: Newspaper },
          { name: "Webinars", href: "/webinars", description: "Live sessions and recorded compliance workshops.", icon: Headphones },
        ],
      },
      {
        category: "Build",
        links: [
          { name: "Documentation", href: "/documentation", description: "Install snippets, API patterns, and integration help.", icon: FileText },
          { name: "Templates", href: "/templates", description: "Reusable checklists for policies, cookies, and DSAR flows.", icon: Workflow },
          { name: "Help Center", href: "/help", description: "Answers for setup, billing, product, and privacy operations.", icon: HelpCircle },
        ],
      },
    ],
  },
  {
    name: "Company",
    href: "/about",
    spotlight: {
      title: "Founder-led trust platform",
      description: "Zenvyra is built for teams that want AI governance and compliance to become a product capability.",
      href: "/about",
      metric: "AI-first",
      label: "AI readiness platform",
    },
    items: [
      {
        category: "Company",
        links: [
          { name: "About", href: "/about", description: "Meet the mission, product vision, and founder story.", icon: Building2 },
          { name: "Careers", href: "/careers", description: "Help build compliance software that feels modern.", icon: Briefcase },
          { name: "Partners", href: "/partners", description: "Work with Zenvyra across agencies and platforms.", icon: Globe2 },
          { name: "Contact", href: "/contact", description: "Talk to the founder about setup, enterprise, or agency needs.", icon: Headphones },
        ],
      },
      {
        category: "Trust",
        links: [
          { name: "Security", href: "/security", description: "Review security posture, controls, and product safeguards.", icon: LockKeyhole },
          { name: "Status", href: "/status", description: "Monitor platform uptime and operational transparency.", icon: Gauge },
          { name: "Press", href: "/press", description: "Company facts, story angles, and launch materials.", icon: Landmark },
        ],
      },
    ],
  },
];

function MegaMenu({
  link,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: {
  link: NavLink;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
}) {
  if (!link.items) return null;

  return (
    <div
      className="absolute left-1/2 top-full w-[860px] -translate-x-1/2 pt-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.16)]">
        <div className="grid gap-7 md:grid-cols-2" role="menu">
          {link.items.map((column) => (
            <div key={column.category}>
              <p className="mb-3 px-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                {column.category}
              </p>
              <div className="space-y-1">
                {column.links.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex gap-3 rounded-xl p-3 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    onClick={onNavigate}
                    role="menuitem"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600 transition group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                      <item.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                        {item.name}
                        {item.tag && (
                          <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {item.tag}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-[12px] leading-5 text-slate-500">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [pinnedDropdown, setPinnedDropdown] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>("Products");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDropdown = (name: string) => {
    clearCloseTimer();
    setActiveDropdown(name);
  };

  const scheduleCloseDropdown = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      if (!pinnedDropdown) setActiveDropdown(null);
    }, 160);
  };

  const closeMenus = () => {
    setActiveDropdown(null);
    setPinnedDropdown(null);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setPinnedDropdown(null);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      clearCloseTimer();
    };
  }, []);

  return (
    <nav ref={navRef} className="fixed left-0 right-0 top-0 z-50 h-[72px] border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-[0_10px_28px_rgba(249,115,22,0.25)] transition group-hover:bg-orange-600">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-950 transition group-hover:text-orange-600">Zenvyra</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.items && openDropdown(link.name)}
              onMouseLeave={scheduleCloseDropdown}
            >
              {link.items ? (
                <button
                  type="button"
                  className={cn(
                    "flex h-10 items-center gap-1 rounded-xl px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-orange-600",
                    activeDropdown === link.name && "bg-slate-100 text-orange-600"
                  )}
                  onClick={() => {
                    clearCloseTimer();
                    setPinnedDropdown((current) => {
                      const next = current === link.name ? null : link.name;
                      setActiveDropdown(next);
                      return next;
                    });
                  }}
                  aria-expanded={activeDropdown === link.name}
                  aria-haspopup="menu"
                >
                  {link.name}
                  <ChevronDown className={cn("h-4 w-4 transition", activeDropdown === link.name && "rotate-180")} />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="flex h-10 items-center rounded-xl px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-orange-600"
                >
                  {link.name}
                </Link>
              )}

              {link.items && activeDropdown === link.name && (
                <MegaMenu
                  link={link}
                  onMouseEnter={() => openDropdown(link.name)}
                  onMouseLeave={scheduleCloseDropdown}
                  onNavigate={closeMenus}
                />
              )}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/auth/login" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
            Sign In
          </Link>
          <Button asChild className="rounded-xl bg-orange-500 px-5 font-bold hover:bg-orange-600">
            <Link href="/auth/signup">Start AI Readiness</Link>
          </Button>
        </div>

        <button
          className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto border-b border-slate-200 bg-white shadow-xl lg:hidden">
          <div className="space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <div key={link.name} className="rounded-2xl border border-slate-200">
                {link.items ? (
                  <>
                    <button
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-extrabold text-slate-900"
                      onClick={() => setMobileSection((current) => (current === link.name ? null : link.name))}
                    >
                      {link.name}
                      <ChevronDown className={cn("h-5 w-5 transition", mobileSection === link.name && "rotate-180")} />
                    </button>
                    {mobileSection === link.name && (
                      <div className="space-y-4 border-t border-slate-200 px-4 py-4">
                        {link.items.map((column) => (
                          <div key={column.category}>
                            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{column.category}</p>
                            <div className="space-y-1">
                              {column.links.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="flex gap-3 rounded-xl p-2 text-sm text-slate-600 hover:bg-orange-50"
                                  onClick={closeMenus}
                                >
                                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                                  <span>
                                    <span className="block font-bold text-slate-950">{item.name}</span>
                                    <span className="mt-0.5 block text-xs leading-5">{item.description}</span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-base font-extrabold text-slate-900"
                    onClick={closeMenus}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="grid gap-2 pt-2">
              <Link href="/auth/login" className="rounded-xl px-4 py-3 text-center text-sm font-bold text-slate-700" onClick={closeMenus}>
                Sign In
              </Link>
              <Button asChild className="rounded-xl bg-orange-500 font-bold hover:bg-orange-600">
                <Link href="/auth/signup" onClick={closeMenus}>Start AI Readiness</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
