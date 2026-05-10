"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Globe, TrendingUp, TrendingDown, Minus,
    Target, BarChart3, Download, ExternalLink,
    Award, AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip
} from "recharts";

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

const radarData = [
    { subject: "Privacy", A: 90, B: 65, C: 50, fullMark: 100 },
    { subject: "Cookies", A: 85, B: 80, C: 60, fullMark: 100 },
    { subject: "SSL", A: 100, B: 100, C: 80, fullMark: 100 },
    { subject: "Accessibility", A: 80, B: 60, C: 45, fullMark: 100 },
    { subject: "Performance", A: 70, B: 75, C: 55, fullMark: 100 },
];

export default function CompetitorsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCompetitorUrl, setNewCompetitorUrl] = useState("");

    const handleAddCompetitor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCompetitorUrl) {
            toast.error("Please enter a competitor URL");
            return;
        }
        toast.success("Competitor added successfully");
        setShowAddModal(false);
        setNewCompetitorUrl("");
    };

    const getTrendIcon = (current: number, previous: number) => {
        if (current > previous) return <TrendingUp className="w-4 h-4 text-success" />;
        if (current < previous) return <TrendingDown className="w-4 h-4 text-error" />;
        return <Minus className="w-4 h-4 text-surface-500" />;
    };

    const getTrendValue = (current: number, previous: number) => {
        const diff = current - previous;
        if (diff > 0) return <span className="text-success">+{diff}</span>;
        if (diff < 0) return <span className="text-error">{diff}</span>;
        return <span className="text-surface-500">0</span>;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-display-3 font-display text-surface-100 mb-2">
                        Competitor Watch
                    </h1>
                    <p className="text-surface-400">
                        Track and compare your compliance against competitors
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
                >
                    <Plus className="w-5 h-5" />
                    Add Competitor
                </motion.button>
            </div>

            {/* Your Score vs Industry */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-heading-3 mb-1">Industry Comparison</h3>
                        <p className="text-sm text-surface-500">How you compare to competitors</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium">
                            Top 10%
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Radar Chart */}
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#1e293b" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                            <Radar
                                name="You"
                                dataKey="A"
                                stroke="#0ea5e9"
                                fill="#0ea5e9"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                            <Radar
                                name="Competitor A"
                                dataKey="B"
                                stroke="#f43f5e"
                                fill="#f43f5e"
                                fillOpacity={0.1}
                                strokeWidth={2}
                            />
                            <Radar
                                name="Competitor B"
                                dataKey="C"
                                stroke="#f59e0b"
                                fill="#f59e0b"
                                fillOpacity={0.1}
                                strokeWidth={2}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#0f172a",
                                    border: "1px solid #1e293b",
                                    borderRadius: "12px",
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>

                    {/* Ranking */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-surface-400 uppercase tracking-wider">Ranking</h4>
                        {[
                            { rank: 1, name: "Your Website", score: 87, isYou: true },
                            { rank: 2, name: "competitor-b.com", score: 85, isYou: false },
                            { rank: 3, name: "competitor-a.com", score: 72, isYou: false },
                            { rank: 4, name: "competitor-c.com", score: 58, isYou: false },
                        ].map((item) => (
                            <div
                                key={item.rank}
                                className={`flex items-center gap-4 p-4 rounded-xl ${item.isYou
                                        ? "bg-brand-500/10 border border-brand-500/30"
                                        : "bg-surface-800/30"
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.rank === 1
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : item.rank === 2
                                            ? "bg-surface-600 text-surface-300"
                                            : item.rank === 3
                                                ? "bg-orange-700/30 text-orange-400"
                                                : "bg-surface-800 text-surface-500"
                                    }`}>
                                    {item.rank === 1 ? <Award className="w-4 h-4" /> : item.rank}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${item.isYou ? "text-brand-400" : "text-surface-200"}`}>
                                        {item.name} {item.isYou && "(You)"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${item.score >= 80 ? "text-success" :
                                            item.score >= 60 ? "text-warning" :
                                                "text-error"
                                        }`}>
                                        {item.score}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Competitors List */}
            <div className="space-y-6">
                <h3 className="text-heading-3">Tracked Competitors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {competitors.map((competitor, index) => (
                        <motion.div
                            key={competitor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-surface-800 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-surface-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-surface-100">{competitor.name}</h4>
                                        <p className="text-xs text-surface-500">{competitor.industry}</p>
                                    </div>
                                </div>
                                <a
                                    href={competitor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4 text-surface-400" />
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
                                    <p className="text-xs text-surface-500 mt-1">vs last month</p>
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-2 mb-4">
                                {Object.entries(competitor.trends).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className="text-xs text-surface-500 capitalize w-24">{key}</span>
                                        <div className="flex-1 h-2 bg-surface-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${value >= 80 ? "bg-success" :
                                                        value >= 60 ? "bg-warning" :
                                                            "bg-error"
                                                    }`}
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-surface-400 w-8 text-right">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-surface-800/50">
                                <span className="text-xs text-surface-500">
                                    Last scan: {competitor.lastScan}
                                </span>
                                <button className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
                                    View Report
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Add Competitor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-2xl p-8 w-full max-w-md"
                    >
                        <h2 className="text-heading-2 mb-4">Add Competitor</h2>
                        <form onSubmit={handleAddCompetitor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-2">
                                    Competitor Website URL
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                                    <input
                                        type="url"
                                        value={newCompetitorUrl}
                                        onChange={(e) => setNewCompetitorUrl(e.target.value)}
                                        placeholder="https://competitor.com"
                                        className="w-full pl-11 pr-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-surface-800 hover:bg-surface-700 text-surface-300 font-semibold rounded-xl transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
                                >
                                    Add Competitor
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}