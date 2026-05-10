"use client";

import { useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const data = [
    { date: "Mar 25", score: 72, industry: 69 },
    { date: "Mar 28", score: 74, industry: 69 },
    { date: "Apr 1", score: 76, industry: 70 },
    { date: "Apr 4", score: 79, industry: 70 },
    { date: "Apr 8", score: 81, industry: 71 },
    { date: "Apr 12", score: 80, industry: 71 },
    { date: "Apr 16", score: 84, industry: 72 },
    { date: "Apr 19", score: 86, industry: 72 },
    { date: "Apr 22", score: 88, industry: 73 },
    { date: "Apr 24", score: 89, industry: 73 },
];

export default function ComplianceChart() {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="industryGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.05} />
                            <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid 
                        strokeDasharray="8 8" 
                        stroke="#f1f5f9" 
                        vertical={false} 
                    />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={10}
                        fontWeight={700}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        fontWeight={700}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        dx={-10}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-premium backdrop-blur-xl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
                                        <div className="space-y-1.5">
                                            {payload.map((entry: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between gap-8">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                        <span className="text-xs font-bold text-white">{entry.name}</span>
                                                    </div>
                                                    <span className="text-xs font-black text-white">{entry.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <ReferenceLine 
                        y={80} 
                        stroke="#10b981" 
                        strokeDasharray="4 4" 
                        opacity={0.3} 
                        label={{ value: 'Target', position: 'insideRight', fill: '#10b981', fontSize: 10, fontWeight: 700 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#16a34a"
                        strokeWidth={3}
                        fill="url(#scoreGradient)"
                        name="Protocol Score"
                        animationDuration={2000}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#16a34a' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="industry"
                        stroke="#cbd5e1"
                        strokeWidth={2}
                        strokeDasharray="8 8"
                        fill="url(#industryGradient)"
                        name="Benchmark"
                        animationDuration={2500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
