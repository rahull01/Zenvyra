"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setIsVisible(window.scrollY > 380);
        };

        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 22, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 22, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 md:bottom-6"
                >
                    <div className="rounded-2xl border border-brand-200 bg-white/95 p-3 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
                        <Link
                            href="/signup"
                            className="inline-flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-brand-600 to-accent px-4 py-3 text-sm font-semibold text-white transition-all hover:from-brand-500 hover:to-brand-600"
                        >
                            Start free in 30 seconds
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
