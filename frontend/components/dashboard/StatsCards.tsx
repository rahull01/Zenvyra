"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Globe, Loader2, ShieldCheck, TrendingUp } from "lucide-react";
import api from "@/lib/api";

type DashboardStats = {
  complianceScore: number;
  aiSystemsCount?: number;
  totalWebsites: number;
  totalPolicies: number;
  activeAlerts: number;
};

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<DashboardStats>("/dashboard/stats")
      .then((response) => {
        if (mounted) setStats(response.data);
      })
      .catch(() => {
        if (mounted) setStats(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      { label: "AI Readiness Score", value: `${Math.round(stats?.complianceScore || 0)}/100`, icon: ShieldCheck, color: "var(--accent)", bgColor: "bg-primary/10" },
      { label: "AI Systems", value: String(stats?.aiSystemsCount || 0), icon: TrendingUp, color: "var(--success)", bgColor: "bg-success/10" },
      { label: "Websites Monitored", value: String(stats?.totalWebsites || 0), icon: Globe, color: "var(--accent)", bgColor: "bg-primary/10" },
      { label: "Active Issues", value: String(stats?.activeAlerts || 0), icon: AlertTriangle, color: "var(--danger)", bgColor: "bg-error/10" },
    ],
    [stats],
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-border-light/50 bg-background-primary p-5 text-center text-text-secondary shadow-sm">
        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
        Loading stats...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <article key={stat.label} className="relative overflow-hidden rounded-xl border border-border-light/50 bg-background-primary p-5 shadow-sm transition-all duration-200 hover:border-border-light hover:shadow-md">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} aria-hidden />
              </div>
              <p className="text-xs font-semibold text-text-secondary">{stat.label}</p>
            </div>
          </div>
          <p className="text-2xl font-bold leading-none tracking-tight text-text-primary">{stat.value}</p>
        </article>
      ))}
    </div>
  );
}
