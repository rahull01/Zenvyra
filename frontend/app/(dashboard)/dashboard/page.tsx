"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  FileText,
  Globe,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

type DashboardStats = {
  complianceScore: number;
  aiSystemsCount?: number;
  totalWebsites: number;
  totalPolicies: number;
  activeAlerts: number;
  pendingDSARs: number;
  nextScan?: string | null;
  scoreBreakdown?: Record<string, number>;
};

type RecentScan = {
  id: string;
  url: string;
  status: string;
  date?: string;
  issuesFound: number;
  score: number;
};

type Insight = {
  id: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  website: string;
  actions?: string[];
};

type Usage = {
  plan: string;
  limits: Record<string, number>;
  currentUsage: Record<string, number>;
};

type ActivityItem = {
  id: string;
  action: string;
  time?: string;
  website?: string;
  status?: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scans, setScans] = useState<RecentScan[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsResponse, scansResponse, insightsResponse, usageResponse, activityResponse] = await Promise.all([
        api.get<DashboardStats>("/dashboard/stats"),
        api.get<{ data: { scans: RecentScan[] } }>("/dashboard/recent-scans"),
        api.get<{ data: { insights: Insight[] } }>("/dashboard/ai-insights"),
        api.get<{ data: Usage }>("/dashboard/usage"),
        api.get<{ data: { activities: ActivityItem[] } }>("/dashboard/activity"),
      ]);

      setStats(statsResponse.data);
      setScans(scansResponse.data.data.scans || []);
      setInsights(insightsResponse.data.data.insights || []);
      setUsage(usageResponse.data.data);
      setActivities(activityResponse.data.data.activities || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "AI Readiness Score",
        value: `${Math.round(stats?.complianceScore || 0)}/100`,
        icon: ShieldCheck,
        href: "/dashboard/compliance-score",
      },
      {
        label: "AI Systems",
        value: String(stats?.aiSystemsCount || 0),
        icon: TrendingUp,
        href: "/dashboard/ai-act",
      },
      {
        label: "Websites",
        value: String(stats?.totalWebsites || 0),
        icon: Globe,
        href: "/dashboard/websites",
      },
      {
        label: "Open Issues",
        value: String(stats?.activeAlerts || 0),
        icon: AlertTriangle,
        href: "/dashboard/ai-insights",
      },
    ],
    [stats],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">Dashboard</h1>
          <p className="mt-2 text-sm text-text-secondary">Live compliance status from your scans, policies, and usage.</p>
        </div>
        <button
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border-light px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-background-secondary disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border-light bg-surface-card p-12 text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <Link key={card.label} href={card.href} className="rounded-2xl border border-border-light bg-surface-card p-5 shadow-card transition hover:border-accent/30">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-tertiary" />
                </div>
                <p className="mt-5 text-sm font-semibold text-text-secondary">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-text-primary">{card.value}</p>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="xl:col-span-2 rounded-2xl border border-border-light bg-surface-card shadow-card">
              <div className="flex items-center justify-between border-b border-border-light p-6">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Recent Scans</h2>
                  <p className="mt-1 text-sm text-text-secondary">Latest website scan records stored in MongoDB.</p>
                </div>
                <Link href="/dashboard/scanner" className="text-sm font-semibold text-accent hover:underline">
                  New scan
                </Link>
              </div>
              <div className="divide-y divide-border-light">
                {scans.length === 0 ? (
                  <EmptyState text="No scans yet. Run your first scan to populate this table." href="/dashboard/scanner" label="Open scanner" />
                ) : (
                  scans.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between gap-4 p-5">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text-primary">{scan.url}</p>
                        <p className="mt-1 text-xs text-text-secondary">
                          {scan.status} | {scan.issuesFound} issues | {formatRelative(scan.date)}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-sm font-bold ${scoreClass(scan.score)}`}>{Math.round(scan.score)}</span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">AI Insights</h2>
                  <p className="text-sm text-text-secondary">Generated from unresolved scan issues.</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {insights.length === 0 ? (
                  <p className="rounded-xl bg-background-secondary p-4 text-sm text-text-secondary">No open insights. Scan a website to generate recommendations.</p>
                ) : (
                  insights.slice(0, 5).map((insight) => (
                    <div key={insight.id} className="rounded-xl border border-border-light p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-text-primary">{insight.title}</p>
                        <span className="rounded-full bg-background-secondary px-2 py-1 text-xs uppercase text-text-secondary">{insight.priority}</span>
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">{insight.description}</p>
                      <p className="mt-2 text-xs text-text-tertiary">{insight.website}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
              <h2 className="text-lg font-bold text-text-primary">Usage</h2>
              <p className="mt-1 text-sm text-text-secondary">Current {usage?.plan || "free"} plan limits.</p>
              <div className="mt-5 space-y-4">
                {["websites", "policies", "scans"].map((key) => {
                  const used = Number(usage?.currentUsage?.[key] || 0);
                  const total = Number(usage?.limits?.[key] || 0);
                  const percent = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
                  return (
                    <div key={key}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="capitalize text-text-secondary">{key}</span>
                        <span className="font-semibold text-text-primary">{used} / {total}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-background-tertiary">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="xl:col-span-2 rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-text-primary">Activity</h2>
              </div>
              <div className="mt-5 divide-y divide-border-light">
                {activities.length === 0 ? (
                  <p className="py-6 text-sm text-text-secondary">No activity yet.</p>
                ) : (
                  activities.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <p className="font-semibold text-text-primary">{item.action || "Scan activity"}</p>
                        <p className="mt-1 text-sm text-text-secondary">{item.website || "Website"} | {item.status || "recorded"}</p>
                      </div>
                      <span className="text-xs text-text-tertiary">{formatRelative(item.time)}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ text, href, label }: { text: string; href: string; label: string }) {
  return (
    <div className="p-8 text-center">
      <p className="text-sm text-text-secondary">{text}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function scoreClass(score: number) {
  if (score >= 80) return "bg-status-success/10 text-status-success";
  if (score >= 60) return "bg-status-warning/10 text-status-warning";
  return "bg-status-error/10 text-status-error";
}

function formatRelative(value?: string) {
  if (!value) return "not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
