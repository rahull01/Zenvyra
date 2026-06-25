"use client";

import dynamic from "next/dynamic";
import { FormEvent, useState } from "react";
import {
    Plus, Globe, TrendingUp, TrendingDown, Minus,
    ExternalLink, Award
} from "lucide-react";
import toast from "react-hot-toast";
import { runAfterPaint } from "@/lib/performance";

const CompetitorRadarChart = dynamic(() => import("@/components/dashboard/CompetitorRadarChart"), {
    ssr: false,
    loading: () => <div aria-hidden="true" className="h-[300px] w-full rounded-xl bg-background-secondary/40" />,
});

const competitors = [
    {
        id: "1",
        name: "competitor-a.com",
        url: "https://competitor-a.com",
        score: 72,
        previousScore: 68,
        industry: "E-commerce",
        lastScan: "1 day ago",
        trends: {
            privacy: 65,
            cookies: 80,
            ssl: 100,
            accessibility: 60,
            performance: 75,
        },
    },
    {
        id: "2",
        name: "competitor-b.com",
        url: "https://competitor-b.com",
        score: 85,
        previousScore: 82,
        industry: "E-commerce",
        lastScan: "2 days ago",
        trends: {
            privacy: 90,
            cookies: 85,
            ssl: 100,
            accessibility: 80,
            performance: 70,
        },
    },
    {
        id: "3",
        name: "competitor-c.com",
        url: "https://competitor-c.com",
        score: 58,
        previousScore: 62,
        industry: "E-commerce",
        lastScan: "3 days ago",
        trends: {
            privacy: 50,
            cookies: 60,
            ssl: 80,
            accessibility: 45,
            performance: 55,
        },
    },
];

export default function CompetitorsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCompetitorUrl, setNewCompetitorUrl] = useState("");

    const handleAddCompetitor = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newCompetitorUrl) {
            toast.error("Please enter a competitor URL");
            return;
        }
        setShowAddModal(false);
        setNewCompetitorUrl("");
        runAfterPaint(() => toast.success("Competitor added successfully"));
    };

    const getTrendIcon = (current: number, previous: number) => {
        if (current > previous) return <TrendingUp className="w-4 h-4 text-success" />;
        if (current < previous) return <TrendingDown className="w-4 h-4 text-error" />;
        return <Minus className="w-4 h-4 text-text-secondary" />;
    };

    const getTrendValue = (current: number, previous: number) => {
        const diff = current - previous;
        if (diff > 0) return <span className="text-success">+{diff}</span>;
        if (diff < 0) return <span className="text-error">{diff}</span>;
        return <span className="text-text-secondary">0</span>;
    };

    const rankingItems = [
        { rank: 1, name: "Your Website", score: 87, isYou: true },
        { rank: 2, name: "competitor-b.com", score: 85, isYou: false },
        { rank: 3, name: "competitor-a.com", score: 72, isYou: false },
        { rank: 4, name: "competitor-c.com", score: 58, isYou: false },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-display-3 font-display text-text-primary mb-2">
                        Competitor Watch
                    </h1>
                    <p className="text-text-secondary">
                        Track and compare your compliance against competitors
                    </p>
                </div>
                <button
                    onClick={() => runAfterPaint(() => setShowAddModal(true))}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all duration-300 shadow-glow-accent"
                >
                    <Plus className="w-5 h-5" />
                    Add Competitor
                </button>
            </div>

            {/* Your Score vs Industry */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-h3 mb-1">Industry Comparison</h3>
                        <p className="text-sm text-text-secondary">How you compare to competitors</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium">
                            Top 10%
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CompetitorRadarChart />

                    {/* Ranking */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Ranking</h4>
                        {rankingItems.map((item) => {
                            const cardClass = item.isYou ? "bg-primary/10 border border-primary/30" : "bg-background-secondary/30";
                            const badgeClass = item.rank === 1
                                ? "bg-yellow-500/20 text-yellow-400"
                                : item.rank === 2
                                    ? "bg-background-tertiary text-text-secondary"
                                    : item.rank === 3
                                        ? "bg-status-warning/10 text-status-warning"
                                        : "bg-background-secondary text-text-secondary";
                            const scoreClass = item.score >= 80 ? "text-success" : item.score >= 60 ? "text-warning" : "text-error";

                            return (
                                <div key={item.rank} className={`flex items-center gap-4 p-4 rounded-xl ${cardClass}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${badgeClass}`}>
                                        {item.rank === 1 ? <Award className="w-4 h-4" /> : item.rank}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${item.isYou ? "text-primary" : "text-text-primary"}`}>
                                            {item.name} {item.isYou && "(You)"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${scoreClass}`}>
                                            {item.score}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Competitors List */}
            <div className="space-y-6">
                <h3 className="text-heading-3">Tracked Competitors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {competitors.map((competitor) => (
                        <div
                            key={competitor.id}
                            className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-background-secondary flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-text-primary">{competitor.name}</h4>
                                        <p className="text-xs text-text-secondary">{competitor.industry}</p>
                                    </div>
                                </div>
                                <a
                                    href={competitor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4 text-text-secondary" />
                                </a>
                            </div>

                            {/* Score */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${competitor.score >= 80 ? "bg-success/20" :
                                        competitor.score >= 60 ? "bg-warning/20" :
                                            "bg-error/20"
                                    }`}>
                                    <span className={`text-xl font-bold ${competitor.score >= 80 ? "text-success" :
                                            competitor.score >= 60 ? "text-warning" :
                                                "text-error"
                                        }`}>
                                        {competitor.score}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        {getTrendIcon(competitor.score, competitor.previousScore)}
                                        {getTrendValue(competitor.score, competitor.previousScore)}
                                    </div>
<p className="text-xs text-text-secondary mt-1">vs last month</p>
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-2 mb-4">
                                {Object.entries(competitor.trends).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className="text-xs text-text-secondary capitalize w-24">{key}</span>
                                        <div className="flex-1 h-2 bg-background-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${value >= 80 ? "bg-success" :
                                                        value >= 60 ? "bg-warning" :
                                                            "bg-error"
                                                    }`}
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-text-secondary w-8 text-right">{value}</span>
                                    </div>
                                ))}
                            </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border-light/50">
                                <span className="text-xs text-text-secondary">
                                    Last scan: {competitor.lastScan}
                                </span>
                                <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                                    View Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Competitor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-card rounded-2xl p-8 w-full max-w-md">
                        <h2 className="text-heading-2 mb-4">Add Competitor</h2>
                        <form onSubmit={handleAddCompetitor} className="space-y-4">
                            <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Competitor Website URL
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                                    <input
                                        type="url"
                                        value={newCompetitorUrl}
                                        onChange={(e) => setNewCompetitorUrl(e.target.value)}
                                        placeholder="https://competitor.com"
                                        className="w-full pl-11 pr-4 py-3 bg-background-secondary/50 border border-border-light/50 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => runAfterPaint(() => setShowAddModal(false))}
                                    className="flex-1 py-3 bg-background-secondary hover:bg-background-tertiary text-text-secondary font-semibold rounded-xl transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all duration-300 shadow-glow-accent"
                                >
                                    Add Competitor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
