"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import { MAIN_NAV, PRODUCTS_MEGA, type NavMegaColumn } from "@/lib/termly-nav";
import { TermlyButton } from "./TermlyButton";
import { cn } from "@/lib/utils";

/* ─── Mega-menu panel ─── */
function MegaMenuPanel({
  columns,
  onMouseEnter,
  onMouseLeave,
}: {
  columns: NavMegaColumn[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-[600px] rounded-2xl border border-all-border-strong bg-white p-6 shadow-termly-soft"
      role="region"
      aria-label="Products menu"
    >
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.15 }}
        className="grid grid-cols-2 gap-6"
      >
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {col.title}
            </p>
            <ul className="space-y-1" role="list">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex gap-3.5 rounded-xl p-2.5 transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                      <item.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-bold text-all-surface group-hover:text-accent">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-slate-500 leading-normal">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Navbar ─── */
export default function TermlyNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const onTopHero = isHome && !isScrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setMobileProductsOpen(false);
  }, [pathname]);

  const closeProducts = useCallback(() => setProductsOpen(false), []);

  useEffect(() => {
    if (!productsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeProducts();
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeProducts();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [productsOpen, closeProducts]);

  /* ─── desktop link style ─── */
  const linkClass = "rounded-md px-3 py-2.5 text-[15px] font-bold transition-all duration-200 text-all-surface hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text";

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-all-border-strong bg-white/95 shadow-all-1 backdrop-blur-md"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* ─── Logo ─── */}
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text">
          <svg className="h-9 w-9 text-white filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-dark)" />
              </linearGradient>
            </defs>
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="url(#logo-grad)" />
            <path d="M9 11l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-black tracking-tight text-all-surface">&nbsp;ComplianceAI Pro</span>
        </Link>

        {/* ─── Desktop nav ─── */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {MAIN_NAV.map((item) =>
            "mega" in item && item.mega ? (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-expanded={productsOpen}
                  aria-haspopup="true"
                  onClick={() => setProductsOpen((o) => !o)}
                  onMouseEnter={() => setProductsOpen(true)}
                  className={cn(
                    linkClass, "flex items-center gap-1 h-10",
                    productsOpen && "text-accent-text"
                  )}
                >
                  {item.label}
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-150", productsOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {productsOpen && (
                    <MegaMenuPanel
                      columns={item.mega}
                      onMouseEnter={() => setProductsOpen(true)}
                      onMouseLeave={() => setProductsOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  linkClass, "h-10",
                  pathname === item.href && "text-accent-text"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* ─── CTA buttons ─── */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/auth/login"
            className="rounded-md px-3.5 py-2 text-[15px] font-medium text-text-secondary transition-all duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Sign In
          </Link>
          <Link href="/auth/signup" className="btn-primary !py-2.5 !px-6 text-sm font-bold uppercase tracking-wide">
            Try for free!
          </Link>
        </div>

        {/* ─── Mobile menu toggle ─── */}
        <button
          type="button"
          className="rounded-md p-2 lg:hidden text-all-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* ─── Mobile drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-all-border-strong bg-white lg:hidden"
          >
            <nav className="space-y-1 px-4 py-4" aria-label="Mobile">
              {/* Products sub-menu */}
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-base font-bold text-all-surface"
                aria-expanded={mobileProductsOpen}
                onClick={() => setMobileProductsOpen((o) => !o)}
              >
                Products
                <ChevronDown className={cn("h-5 w-5 transition-transform", mobileProductsOpen && "rotate-180")} />
              </button>

              {mobileProductsOpen && (
                <div className="mb-2 space-y-4 border-l-[3px] border-accent-bg pl-3">
                  {PRODUCTS_MEGA.map((col) => (
                    <div key={col.title}>
                      <p className="mb-1.5 text-[10px] font-bold uppercase text-all-surface">{col.title}</p>
                      <ul className="space-y-0.5">
                        {col.items.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href}
                              className="block py-1.5 text-sm text-all-text-secondary hover:text-accent-text">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {MAIN_NAV.filter((i) => !("mega" in i)).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded-md px-3 py-3 text-base font-bold text-all-surface hover:bg-accent-bg-dim"
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 border-t border-all-border-strong pt-4">
                <Link
                  href="/auth/login"
                  className="py-3 text-center text-base font-bold text-all-surface"
                >
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary w-full justify-center">
                  Try for free!
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
