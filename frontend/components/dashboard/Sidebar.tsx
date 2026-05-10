"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Shield, LayoutDashboard, Scan, Globe, FileText,
    Activity, Users, Settings, CreditCard, ChevronLeft,
    ChevronRight, LogOut, Zap
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuth";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Magic Scanner", href: "/scan", icon: Scan },
    { label: "Websites", href: "/websites", icon: Globe },
    { label: "Policies", href: "/policies", icon: FileText },
    { label: "Monitoring", href: "/dashboard/monitoring", icon: Activity },
    { label: "Competitors", href: "/competitors", icon: Users },
    { label: "Team", href: "/team", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Billing", href: "/billing", icon: CreditCard },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    return (
        <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className={`fixed left-0 top-0 h-screen bg-white/40 backdrop-blur-3xl border-r border-slate-200/50 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isCollapsed ? "w-24" : "w-80"
            }`}
        >
            {/* Premium Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-500/[0.03] to-transparent" />
                <div className="premium-noise" />
            </div>

            {/* Logo Area */}
            <div className="relative flex items-center justify-between h-24 px-7">
                <Link href="/" className={`flex items-center gap-4 ${isCollapsed ? "justify-center w-full" : ""}`}>
                    <div className="relative group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <span className="text-xl font-display font-black text-slate-900 tracking-tight">ComplianceAI</span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Protocol v1.0</span>
                            </div>
                        </motion.div>
                    )}
                </Link>
            </div>

            {/* Navigation Section */}
            <nav className="relative px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group ${
                                isActive
                                    ? "bg-slate-900 text-white shadow-glow"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <div className={`relative ${isActive ? "text-brand-400" : "group-hover:text-slate-900"}`}>
                                <item.icon className="w-5 h-5 flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            
                            {!isCollapsed && (
                                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                            )}

                            {isActive && !isCollapsed && (
                                <motion.div
                                    layoutId="activeGlow"
                                    className="ml-auto w-1 h-6 bg-brand-400 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]"
                                />
                            )}
                            
                            {/* Hover Tooltip for collapsed mode */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50 whitespace-nowrap">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="p-2 bg-slate-50/80 rounded-[2rem] border border-slate-100">
                    <button
                        onClick={logout}
                        className={`flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-500 w-full ${
                            isCollapsed ? "justify-center" : ""
                        }`}
                    >
                        <LogOut className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
                        {!isCollapsed && <span className="text-sm font-bold tracking-tight">System Logout</span>}
                    </button>
                </div>
                
                {!isCollapsed && (
                    <div className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-brand-500/5 rounded-full border border-brand-500/10">
                        <Zap className="w-3 h-3 text-brand-600 animate-pulse" />
                        <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest">Enterprise Secured</span>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-12 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-premium transition-transform hover:scale-110 active:scale-90"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                )}
            </button>
        </motion.aside>
    );
}
