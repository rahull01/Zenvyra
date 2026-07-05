"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, Search, Settings, User, ChevronDown, CheckCircle2,
    AlertTriangle, Info, Command, LayoutDashboard, Scan, FileText,
    ShieldCheck, Activity, Users, Globe, CreditCard, X, ArrowRight, LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/ai-insights": "AI Insights",
    "/monitor": "Monitoring",
    "/consent": "Consent Center",
    "/scan": "Magic Scanner",
    "/policies": "Policies",
    "/websites": "Websites",
    "/team": "Team",
    "/settings": "Settings",
    "/billing": "Billing",
};

const COMMAND_ITEMS = [
    { label: "Go to Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Navigation" },
    { label: "Go to Scanner", href: "/scan", icon: Scan, category: "Navigation" },
    { label: "Go to Policies", href: "/policies", icon: FileText, category: "Navigation" },
    { label: "Go to Consent Center", href: "/consent", icon: ShieldCheck, category: "Navigation" },
    { label: "Go to Monitoring", href: "/monitor", icon: Activity, category: "Navigation" },
    { label: "Go to Team", href: "/team", icon: Users, category: "Navigation" },
    { label: "Go to Websites", href: "/websites", icon: Globe, category: "Navigation" },
    { label: "Go to Billing", href: "/billing", icon: CreditCard, category: "Account" },
    { label: "Go to Settings", href: "/settings", icon: Settings, category: "Account" },
];

const NOTIFICATIONS = [
    { id: "1", type: "info", title: "Notifications", message: "Live alerts load in the dashboard top bar", time: "now", read: true },
];

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.reduce<{ label: string; href: string }[]>((acc, seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label = ROUTE_LABELS[href] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
        acc.push({ label, href });
        return acc;
    }, []);

    if (crumbs.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
            {crumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                    {i > 0 && <span className="text-gray-300">/</span>}
                    {i < crumbs.length - 1 ? (
                        <Link href={crumb.href} className="text-gray-400 hover:text-zenvyra-navy transition-colors font-medium">
                            {crumb.label}
                        </Link>
                    ) : (
                        <span className="text-zenvyra-navy font-semibold">{crumb.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

// ─── Command Palette ──────────────────────────────────────────────────────────

function CommandPalette({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = COMMAND_ITEMS.filter(
        (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        inputRef.current?.focus();
        setSelected(0);
    }, [query]);

    const handleKey = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
        if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
        if (e.key === "Enter" && filtered[selected]) {
            window.location.href = filtered[selected].href;
            onClose();
        }
    }, [filtered, selected, onClose]);

    useEffect(() => {
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handleKey]);

    const grouped = filtered.reduce<Record<string, typeof COMMAND_ITEMS>>((acc, item) => {
        acc[item.category] = [...(acc[item.category] ?? []), item];
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={onClose}>
            <div className="absolute inset-0 bg-zenvyra-navy/40 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.15 }}
                className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 border-b border-gray-100">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search or jump to..."
                        className="flex-1 h-14 text-sm text-zenvyra-navy placeholder-gray-400 bg-transparent outline-none font-medium"
                    />
                    <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto py-2">
                    {filtered.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-400">No results for &ldquo;{query}&rdquo;</p>
                    ) : (
                        Object.entries(grouped).map(([category, items]) => (
                            <div key={category}>
                                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{category}</p>
                                {items.map((item, idx) => {
                                    const globalIdx = filtered.indexOf(item);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                                selected === globalIdx
                                                    ? "bg-zenvyra-blue/8 text-zenvyra-blue"
                                                    : "text-text-muted hover:bg-gray-50"
                                            }`}
                                            onMouseEnter={() => setSelected(globalIdx)}
                                        >
                                            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${selected === globalIdx ? "bg-zenvyra-blue text-white" : "bg-gray-100 text-gray-500"}`}>
                                                <item.icon className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="flex-1 font-medium">{item.label}</span>
                                            <ArrowRight className={`w-3 h-3 opacity-0 transition-opacity ${selected === globalIdx ? "opacity-100" : ""}`} />
                                        </Link>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer hints */}
                <div className="flex items-center gap-4 border-t border-gray-100 px-4 py-2.5 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] font-mono">↑↓</kbd> Navigate</span>
                    <span className="flex items-center gap-1"><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] font-mono">↵</kbd> Open</span>
                    <span className="flex items-center gap-1"><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] font-mono">Esc</kbd> Close</span>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Notification icon ────────────────────────────────────────────────────────

function NotifIcon({ type }: { type: string }) {
    if (type === "success") return <CheckCircle2 className="w-4 h-4 text-status-success" />;
    if (type === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <Info className="w-4 h-4 text-zenvyra-blue" />;
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
    const [showCmd, setShowCmd] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const unread = NOTIFICATIONS.filter((n) => !n.read).length;

    // Global Cmd+K listener
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setShowCmd((v) => !v);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = () => { setShowNotif(false); setShowProfile(false); };
        if (showNotif || showProfile) window.addEventListener("click", handler, { once: true });
    }, [showNotif, showProfile]);

    return (
        <>
            <AnimatePresence>
                {showCmd && <CommandPalette onClose={() => setShowCmd(false)} />}
            </AnimatePresence>

            <header className="h-14 bg-white/80 backdrop-blur-[8px] sticky top-0 z-30 border-b border-gray-200/80 flex items-center gap-4 px-6">
                {/* Breadcrumbs */}
                <div className="flex-1">
                    <Breadcrumbs />
                </div>

                {/* Command Palette Trigger */}
                <button
                    onClick={() => setShowCmd(true)}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
                >
                    <Command className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Search…</span>
                    <div className="flex items-center gap-0.5 ml-2">
                        <kbd className="text-[9px] font-mono bg-white border border-gray-200 px-1 rounded">⌘</kbd>
                        <kbd className="text-[9px] font-mono bg-white border border-gray-200 px-1 rounded">K</kbd>
                    </div>
                </button>

                {/* Notifications */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => { setShowNotif((v) => !v); setShowProfile(false); }}
                        className="relative p-2 rounded-md text-gray-400 hover:text-zenvyra-navy hover:bg-gray-100 transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        {unread > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-white" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotif && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.12 }}
                                className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-zenvyra-hover border border-gray-200 z-50 overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="text-xs font-semibold text-zenvyra-navy uppercase tracking-wider">Notifications</h3>
                                    <button className="text-[10px] font-semibold text-zenvyra-blue hover:underline">Mark all read</button>
                                </div>
                                {NOTIFICATIONS.map((n) => (
                                    <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? "bg-blue-50/30" : ""}`}>
                                        <div className="mt-0.5 flex-shrink-0"><NotifIcon type={n.type} /></div>
                                        <div>
                                            <p className="text-xs font-semibold text-zenvyra-navy">{n.title}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{n.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                        </div>
                                        {!n.read && <div className="ml-auto mt-1 w-1.5 h-1.5 rounded-full bg-zenvyra-blue flex-shrink-0" />}
                                    </div>
                                ))}
                                <div className="px-4 py-2.5 bg-gray-50/50 text-center">
                                    <Link href="/dashboard" className="text-xs font-semibold text-zenvyra-blue hover:underline">View all</Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => { setShowProfile((v) => !v); setShowNotif(false); }}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-6 h-6 rounded-full bg-zenvyra-navy flex items-center justify-center text-white text-[10px] font-bold">U</div>
                        <span className="hidden md:block text-xs font-semibold text-zenvyra-navy">Account</span>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.12 }}
                                className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-zenvyra-hover border border-gray-200 z-50 overflow-hidden"
                            >
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                    <p className="text-xs font-bold text-zenvyra-navy">Account</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Use the account menu for profile details</p>
                                </div>
                                <div className="p-1.5">
                                    {[
                                        { label: "Settings", icon: Settings, href: "/settings" },
                                        { label: "Account", icon: User, href: "/billing" },
                                    ].map((item) => (
                                        <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-text-muted hover:bg-gray-100 hover:text-zenvyra-navy transition-colors">
                                            <item.icon className="w-3.5 h-3.5 text-gray-400" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                                <div className="p-1.5 border-t border-gray-100">
                                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                                        <LogOut className="w-3.5 h-3.5" />
                                        Sign out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>
        </>
    );
}
