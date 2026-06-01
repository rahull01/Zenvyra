"use client";

import React from "react";
import { ShieldCheck, Globe, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const stats = [
  {
    label: "Compliance Score",
    value: "89/100",
    change: "+7 points",
    trend: "up" as const,
    icon: ShieldCheck,
    chartData: [45, 52, 58, 65, 71, 78, 89],
    color: "#F59E0B",
    bgColor: "bg-amber-50/50",
  },
  {
    label: "Websites Monitored",
    value: "18",
    change: "+3 this month",
    trend: "up" as const,
    icon: Globe,
    chartData: [12, 12, 13, 14, 15, 15, 18],
    color: "#F59E0B",
    bgColor: "bg-amber-50/50",
  },
  {
    label: "Active Violations",
    value: "14",
    change: "-8 vs last week",
    trend: "down" as const,
    icon: AlertTriangle,
    chartData: [32, 28, 25, 22, 25, 18, 14],
    color: "#EF4444",
    bgColor: "bg-red-50/50",
  },
  {
    label: "Auto-Fix Success Rate",
    value: "94.2%",
    change: "+1.2%",
    trend: "up" as const,
    icon: TrendingUp,
    chartData: [88, 89, 88.5, 91, 92, 93, 94.2],
    color: "#10B981",
    bgColor: "bg-green-50/50",
  },
];

// Simple SVG Sparkline component
function Sparkline({ data, color }: { data: number[], color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const width = 100;
  const height = 30;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 -5 ${width} ${height + 10}`} className="w-full h-8 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon
        fill={`url(#gradient-${color})`}
        points={`${points} ${width},${height} 0,${height}`}
      />
    </svg>
  );
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <article key={stat.label} className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} aria-hidden />
              </div>
              <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
            </div>
            
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-gray-50/80 ${
                stat.trend === "up" ? (stat.color === "#EF4444" ? "text-red-600" : "text-green-600") : 
                (stat.trend === "down" ? (stat.color === "#EF4444" ? "text-green-600" : "text-red-600") : "text-gray-500")
            }`}>
              {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : stat.trend === "down" ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {stat.change}
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-bold tracking-tight text-termly-navy leading-none mb-1">{stat.value}</p>
            </div>
            <div className="w-24 flex-shrink-0 opacity-80 mix-blend-multiply">
               <Sparkline data={stat.chartData} color={stat.color} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
