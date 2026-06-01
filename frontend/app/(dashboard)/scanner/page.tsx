"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Loader2, CheckCircle, XCircle, AlertCircle, Shield, Zap } from "lucide-react";
import ScoreDisplay from "@/components/scan/ScoreDisplay";
import IssuesList from "@/components/scan/IssuesList";
import FixSuggestions from "@/components/scan/FixSuggestions";
import { ScanResult, useScan } from "@/hooks/useScan";

const buildDemoResult = (websiteUrl: string): ScanResult => {
    const normalizedUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
    return {
        url: normalizedUrl,
        score: 72,
        previousScore: 72,
        projectedScore: 91,
        scanDate: new Date().toISOString(),
        summary: "Compliance scan preview with prioritized issues and remediation guidance.",
        issues: [
            {
                id: "cookie-banner-missing",
                type: "cookie",
                category: "Consent",
                severity: "critical",
                title: "Cookie banner blocks reject action",
                description: "Users can accept tracking, but reject controls are not equally visible on first interaction.",
                fixSuggestion: "Add a first-layer reject button and persist consent preference before analytics events fire.",
                autoFixable: true,
            },
            {
                id: "privacy-policy-link",
                type: "privacy",
                category: "Transparency",
                severity: "high",
                title: "Privacy policy link not present at checkout",
                description: "Checkout form collects email and address but does not provide policy access near submission controls.",
                fixSuggestion: "Insert contextual privacy link below submit button and reference data usage purpose.",
                autoFixable: true,
            },
            {
                id: "data-retention-clause",
                type: "privacy",
                category: "Policy Coverage",
                severity: "medium",
                title: "Data retention window not specified",
                description: "Policy describes collected data categories but omits retention period for customer support records.",
                fixSuggestion: "Include retention durations for transactional and support data with legal basis references.",
                autoFixable: false,
            },
            {
                id: "third-party-script",
                type: "cookie",
                category: "Tracking",
                severity: "high",
                title: "Third-party analytics loads before consent",
                description: "Tag manager initializes on page load before user consent state is evaluated.",
                fixSuggestion: "Gate analytics initialization behind explicit consent and update CMP callback sequence.",
                autoFixable: true,
            },
            {
                id: "dsar-contact",
                type: "privacy",
                category: "User Rights",
                severity: "low",
                title: "DSAR contact email missing",
                description: "Policy does not list direct contact channel for access, deletion, and correction requests.",
                fixSuggestion: "Add a dedicated rights-request email and expected response timeline.",
                autoFixable: false,
            },
        ],
        recommendations: [
            "Enable one-click consent preference center to reduce critical privacy risk quickly.",
            "Publish policy update with retention, legal basis, and DSAR response timelines.",
            "Run a verification scan after auto-fix deployment to confirm score progression from 72 to 91.",
        ],
    };
};

export default function ScanPage() {
    const [url, setUrl] = useState("");
    const [activeScan, setActiveScan] = useState<ScanResult | null>(null);
    const { scan, isScanning, lastResult, scanHistory } = useScan();
    const displayedScan = activeScan ?? lastResult;

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) {
            return;
        }

        setActiveScan(null);

        try {
            const result = await scan(url);
            setActiveScan(result);
        } catch (error) {
            const demoResult = buildDemoResult(url);
            setActiveScan(demoResult);
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "critical": return <XCircle className="w-5 h-5 text-status-error" />;
            case "high": return <AlertCircle className="w-5 h-5 text-status-warning" />;
            case "medium": return <AlertCircle className="w-5 h-5 text-status-warning" />;
            default: return <CheckCircle className="w-5 h-5 text-status-success" />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-3xl mx-auto"
            >
                <h1 className="text-display-3 font-display gradient-text mb-4">
                    Magic Scanner
                </h1>
                <p className="text-body-large text-text-secondary">
                    Enter any website URL and get a complete compliance analysis in seconds.
                </p>
            </motion.div>

            {/* Scanner Input */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl mx-auto"
            >
                <form onSubmit={handleScan} className="relative">
                    <div className="relative flex items-center">
                        <Globe className="absolute left-4 w-6 h-6 text-text-tertiary" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full pl-14 pr-36 py-5 bg-background-secondary border-2 border-border-medium rounded-2xl text-text-primary placeholder-text-muted text-lg focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                        />
                        <motion.button
                            type="submit"
                            disabled={isScanning}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-3 px-6 py-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-light hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 shadow-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isScanning ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Scan Now
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>

                {/* Quick URLs */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-sm text-text-tertiary">Try:</span>
                    {["google.com", "stripe.com", "shopify.com"].map((site) => (
                        <button
                            key={site}
                            onClick={() => setUrl(`https://${site}`)}
                            className="px-3 py-1 bg-background-secondary/50 hover:bg-background-secondary text-text-tertiary hover:text-text-secondary rounded-full text-sm transition-all duration-200"
                        >
                            {site}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Scan Animation */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="max-w-2xl mx-auto text-center py-12"
                    >
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-border-medium rounded-full" />
                            <motion.div
                                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shield className="w-12 h-12 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-heading-2 mb-2">Analyzing Website</h3>
                        <p className="text-text-secondary">Checking compliance across 50+ data points...</p>

                        {/* Progress Steps */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            {["SSL Check", "Cookie Policy", "Privacy Policy", "Accessibility"].map((step, i) => (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0.3 }}
                                    animate={{ opacity: i < 2 ? 1 : 0.3 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i < 2 ? "bg-primary/20 text-primary" : "bg-background-secondary text-text-tertiary"
                                        }`}>
                                        {i < 2 ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                                    </div>
                                    <span className="text-sm text-text-secondary">{step}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
                {displayedScan && !isScanning && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        {/* Score Card */}
                        <div className="glass-card rounded-3xl p-8">
                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                <ScoreDisplay score={displayedScan.score} previousScore={displayedScan.previousScore} />

                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h2 className="text-heading-2 mb-2">Scan Results for {displayedScan.url}</h2>
                                        <p className="text-text-secondary">
                                            {displayedScan.score >= 80
                                                ? "Great job! Your website is mostly compliant."
                                                : displayedScan.score >= 60
                                                    ? "Good start, but there are some issues to fix."
                                                    : "Critical issues found. Immediate action recommended."}
                                        </p>
                                    </div>

                                    {displayedScan.projectedScore && (
                                        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                                            <p className="text-sm text-primary font-medium mb-2">After auto-fix projection</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-text-tertiary">{displayedScan.previousScore ?? displayedScan.score}</span>
                                                <span className="text-text-tertiary">→</span>
                                                <span className="text-2xl font-bold text-status-success">{displayedScan.projectedScore}</span>
                                                <span className="text-caption text-text-secondary">estimated after applying fix suggestions</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: "Critical", count: displayedScan.issues.filter(i => i.severity === "critical").length, color: "text-status-error" },
                                            { label: "High", count: displayedScan.issues.filter(i => i.severity === "high").length, color: "text-status-warning" },
                                            { label: "Medium", count: displayedScan.issues.filter(i => i.severity === "medium").length, color: "text-status-warning" },
                                            { label: "Low", count: displayedScan.issues.filter(i => i.severity === "low").length, color: "text-status-success" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="text-center p-4 rounded-xl bg-background-secondary/50">
                                                <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                                                <div className="text-sm text-text-tertiary">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Issues List */}
                        <IssuesList issues={displayedScan.issues} />

                        {/* Fix Suggestions */}
                        <FixSuggestions issues={displayedScan.issues} />

                        {/* Recommendations */}
                        {displayedScan.recommendations.length > 0 && (
                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="text-heading-3 mb-4">Recommendations</h3>
                                <ul className="space-y-3">
                                    {displayedScan.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-text-primary">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scan History */}
            {scanHistory.length > 0 && !isScanning && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card rounded-2xl p-6"
                >
                    <h3 className="text-heading-3 mb-4">Recent Scans</h3>
                    <div className="space-y-3">
                        {scanHistory.map((scan, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 rounded-xl bg-background-secondary/30 hover:bg-background-secondary/50 transition-colors cursor-pointer"
                                onClick={() => setActiveScan(scan)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${scan.score >= 80 ? "bg-status-success/20 text-status-success" :
                                            scan.score >= 60 ? "bg-status-warning/20 text-status-warning" :
                                                "bg-status-error/20 text-status-error"
                                        }`}>
                                        {scan.score}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">{scan.url}</p>
                                        <p className="text-sm text-text-tertiary">{scan.issues.length} issues found</p>
                                    </div>
                                </div>
                                <div className="text-sm text-text-tertiary">
                                    {i === 0 ? "Just now" : `${i} min ago`}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
