"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Zap, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import BackButton from "./BackButton";

const LINKS = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/documentation", label: "Resources" },
    { href: "/about", label: "Company" },
];

const DASHBOARD_PREFIXES = new Set([
    "/dashboard",
    "/scan",
    "/websites",
    "/policies",
    "/competitors",
    "/team",
    "/settings",
    "/billing",
]);

export default function GlobalHeader() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const firstSegment = pathname.split("/")[1];
    const isDashboardRoute = DASHBOARD_PREFIXES.has(`/${firstSegment}`);
    const isHomepage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isDashboardRoute) {
        return null;
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled ? "py-3" : "py-5"
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className={`relative flex h-16 items-center justify-between rounded-full px-4 sm:px-5 lg:px-6 transition-all duration-500 ${
                    isScrolled ? "bg-white/82 backdrop-blur-2xl border border-slate-200/70 shadow-premium" : "bg-white/45 backdrop-blur-xl border border-white/30"
                }`}>
                    {/* Brand */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="group flex items-center gap-3">
                            <div className="w-11 h-11 bg-slate-950 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-xl font-display font-black text-slate-900 tracking-tight">ComplianceAI</span>
                                <div className="flex items-center gap-1.5">
                                    <Zap className="w-3 h-3 text-brand-600 animate-pulse" />
                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Protocol v1.0</span>
                                </div>
                            </div>
                        </Link>
                        {!isHomepage && <BackButton />}
                    </div>

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-brand-600 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden sm:flex items-center gap-4">
                        <Link href="/login" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="brand-button px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2"
                        >
                            Start Free
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-500 hover:text-slate-900"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div 
                initial={false}
                animate={mobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden bg-white border-b border-slate-100"
            >
                <div className="px-6 py-10 space-y-6">
                    {LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-xl font-display font-black text-slate-900"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-6 flex flex-col gap-4">
                        <Link href="/login" className="premium-button w-full">Log In</Link>
                        <Link href="/signup" className="brand-button w-full">Sign Up</Link>
                    </div>
                </div>
            </motion.div>
        </header>
    );
}
