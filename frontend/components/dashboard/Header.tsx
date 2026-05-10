"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, Search, Settings, User, ChevronDown,
    CheckCircle, AlertTriangle, Info, Zap, ShieldCheck
} from "lucide-react";
import Link from "next/link";

const notifications = [
    {
        id: "1",
        type: "success",
        title: "Scan Analysis Complete",
        message: "acme.com scored 87/100",
        time: "2 min ago",
        read: false,
    },
    {
        id: "2",
        type: "warning",
        title: "SSL Certificate Alert",
        message: "shop.acme.com certificate expires in 7 days",
        time: "1 hour ago",
        read: false,
    },
    {
        id: "3",
        type: "info",
        title: "Protocol Update",
        message: "Auto-fix for cookie banners is now available",
        time: "3 hours ago",
        read: true,
    },
];

export default function Header() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const unreadCount = notifications.filter((n) => !n.read).length;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle className="w-5 h-5 text-emerald-600" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            default: return <Info className="w-5 h-5 text-brand-600" />;
        }
    };

    return (
        <header className="h-24 bg-white/40 backdrop-blur-3xl flex items-center justify-between px-10 sticky top-0 z-30 border-b border-slate-200/50">
            {/* Atmospheric Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="premium-noise opacity-[0.02]" />
            </div>
            {/* Command Search */}
            <div className="relative group w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-500 group-focus-within:translate-x-1">
                    <Search className="h-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Execute system command or search..."
                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500/50 focus:ring-8 focus:ring-brand-500/5 transition-all duration-500"
                />
                <div className="absolute inset-y-0 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-black text-slate-400">⌘</kbd>
                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-black text-slate-400">K</kbd>
                </div>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-6">
                {/* System Status */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Protocol Active</span>
                </div>

                {/* Notifications Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-3.5 bg-white border border-slate-100 rounded-2xl hover:border-brand-500/20 hover:shadow-card transition-all duration-500 group"
                    >
                        <Bell className="w-5 h-5 text-slate-500 group-hover:text-brand-600 transition-colors" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-5 h-5 bg-brand-600 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white shadow-glow">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 top-full mt-4 w-[400px] glass-morphism rounded-3xl z-50 overflow-hidden"
                            >
                                <div className="absolute inset-0 premium-noise opacity-[0.03] pointer-events-none" />
                                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-4 h-4 text-brand-600" />
                                        <h3 className="font-display font-black text-slate-900 uppercase tracking-widest text-xs">Intelligence Feed</h3>
                                    </div>
                                    <button className="text-[10px] font-black text-brand-600 uppercase hover:underline">Clear All</button>
                                </div>
                                <div className="max-h-[500px] overflow-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start gap-4 p-6 transition-all duration-500 hover:bg-slate-50 cursor-pointer ${!notification.read ? "bg-brand-500/5" : ""}`}
                                        >
                                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900">{notification.title}</p>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notification.message}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-3 flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                    {notification.time}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-brand-600 rounded-full shadow-glow" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors">
                                    View Full History
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Intelligence */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-4 p-2 pr-5 bg-white border border-slate-100 rounded-full hover:border-brand-500/20 hover:shadow-card transition-all duration-500 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-black shadow-lg group-hover:scale-105 transition-transform">
                            JD
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-black text-slate-900 leading-none">John Doe</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <ShieldCheck className="w-3 h-3 text-brand-600" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Enterprise Tier</span>
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 top-full mt-4 w-72 glass-morphism rounded-3xl z-50 overflow-hidden"
                            >
                                <div className="absolute inset-0 premium-noise opacity-[0.03] pointer-events-none" />
                                <div className="p-6 bg-slate-900 text-white text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full" />
                                    <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-2xl font-black mb-3">JD</div>
                                    <p className="relative z-10 font-display font-black text-white">John Doe</p>
                                    <p className="relative z-10 text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">john@acme.com</p>
                                </div>
                                <div className="p-4 bg-white">
                                    {[
                                        { label: "Account Config", icon: Settings, href: "/settings" },
                                        { label: "Billing & Ledger", icon: User, href: "/billing" },
                                    ].map((item, i) => (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-all duration-300"
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}