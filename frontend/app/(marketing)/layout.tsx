"use client";

import { motion, AnimatePresence } from "framer-motion";
import GlobalHeader from "@/components/shared/GlobalHeader";
import Footer from "@/components/marketing/footer/Footer";
import FloatingCTA from "@/components/marketing/FloatingCTA";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-surface-950">
            <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_12%_12%,rgba(37,99,235,0.08),transparent_42%),radial-gradient(circle_at_86%_0%,rgba(14,165,233,0.07),transparent_38%)]" />
            <div className="pointer-events-none absolute -left-28 top-96 -z-0 h-96 w-96 rounded-full bg-brand-200/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 top-[38rem] -z-0 h-80 w-80 rounded-full bg-sky-200/20 blur-3xl" />
            <GlobalHeader />
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.995 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.997 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
            <FloatingCTA />
            <Footer />
        </div>
    );
}
