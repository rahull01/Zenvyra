"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Search, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface MagicScannerProps {
    onScanComplete?: (result: any) => void;
    variant?: "hero" | "page";
}

export default function MagicScanner({ onScanComplete, variant = "page" }: MagicScannerProps) {
    const [url, setUrl] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetUrl = normalizeInputUrl(url);
        if (!targetUrl) {
            toast.error("Please enter a website URL");
            return;
        }

        setIsScanning(true);

        try {
            const response = await fetch("/api/scan/free", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: targetUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Readiness preview complete. Score: ${data.score}/100`);
                onScanComplete?.(data);
            } else {
                toast.error(data.message || "Scan failed");
            }
        } catch (error) {
            toast.error("Failed to scan website");
        } finally {
            setIsScanning(false);
        }
    };

    const isHero = variant === "hero";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full ${isHero ? "max-w-xl" : "max-w-2xl"} mx-auto`}
        >
            <form onSubmit={handleScan} className="relative">
                <div className="relative flex items-center">
                    <Globe className="absolute left-4 w-5 h-5 text-surface-500" />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
                        className={`w-full pl-12 pr-${isHero ? "32" : "40"} bg-surface-900/60 border-2 border-surface-800 rounded-2xl text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 ${isHero ? "py-4" : "py-5 text-lg"
                            }`}
                    />
                    <motion.button
                        type="submit"
                        disabled={isScanning}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`absolute right-2 ${isHero ? "px-4 py-2" : "px-6 py-3"} bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                        {isScanning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Search className="w-4 h-4" />
                                {!isHero && "Scan"}
                            </>
                        )}
                    </motion.button>
                </div>
            </form>

            {/* Quick URLs */}
            {!isScanning && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-xs text-surface-500">Try:</span>
                    {["google.com", "stripe.com", "shopify.com"].map((site) => (
                        <button
                            key={site}
                            onClick={() => setUrl(`https://${site}`)}
                            className="px-3 py-1.5 bg-surface-800/50 hover:bg-surface-800 text-surface-400 hover:text-surface-300 rounded-full text-xs transition-all duration-200"
                        >
                            {site}
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

function normalizeInputUrl(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
        return new URL(withProtocol).toString();
    } catch {
        return "";
    }
}
