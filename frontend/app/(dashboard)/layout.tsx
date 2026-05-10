"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuthStore } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
                {/* Decorative Background Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center shadow-premium mb-8 relative"
                    >
                        <Shield className="w-10 h-10 text-white" />
                        <div className="absolute inset-0 rounded-3xl border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
                    </motion.div>
                    <h2 className="text-xl font-display font-black text-slate-900 tracking-tight uppercase">ComplianceAI</h2>
                    <p className="text-xs font-bold text-slate-400 mt-2 tracking-widest uppercase animate-pulse">Initializing Secure Protocol...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-white flex relative overflow-hidden">
            {/* Background Atmosphere Elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-500/[0.05] blur-[160px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-emerald-500/[0.05] blur-[160px] rounded-full animate-pulse delay-1000" />
                <div className="premium-noise" />
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-10 pl-80">
                <Header />

                <motion.main
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 p-10 overflow-auto"
                >
                    <div className="max-w-[1600px] mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.main>
                
                {/* Global Footer / System Status */}
                <footer className="h-16 px-10 flex items-center justify-between border-t border-slate-200/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/40 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-500">© 2026 ComplianceAI Pro</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-brand-600 font-black">Node-01-Global</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-700">Network Operational</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}