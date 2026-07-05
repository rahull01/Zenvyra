"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, ExternalLink, Globe, Loader2, ShieldCheck } from "lucide-react";
import api from "@/lib/api";

type RecentScan = {
  id: string;
  url: string;
  score: number;
  issuesFound: number;
  status: string;
  date?: string;
};

export default function RecentScans() {
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<{ data: { scans: RecentScan[] } }>("/dashboard/recent-scans")
      .then((response) => {
        if (mounted) setRecentScans(response.data.data.scans || []);
      })
      .catch(() => {
        if (mounted) setRecentScans([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="premium-card h-full p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-md">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-heading-3 font-display font-bold leading-none text-slate-900">Diagnostic Log</h3>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-text-secondary">Historical Scans</p>
          </div>
        </div>
        <Link href="/scanner" className="flex items-center gap-2 rounded-xl border border-border-light bg-background-secondary px-4 py-2 text-xs font-black uppercase tracking-widest text-text-secondary transition hover:border-accent hover:bg-accent hover:text-white">
          Scanner
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-10 text-center text-text-secondary">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          Loading scans...
        </div>
      ) : recentScans.length === 0 ? (
        <div className="rounded-2xl border border-border-light bg-white p-6 text-center text-sm text-text-secondary">
          No scans yet.
        </div>
      ) : (
        <div className="space-y-4">
          {recentScans.map((scan) => (
            <div key={scan.id} className="group flex items-center gap-5 rounded-2xl border border-border-light bg-white p-5 transition hover:border-accent/10 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background-secondary transition-colors group-hover:bg-accent/10">
                <Globe className="h-6 w-6 text-text-secondary transition-colors group-hover:text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-text-primary transition-colors group-hover:text-accent">{scan.url}</p>
                  <ExternalLink className="h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-1 flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {formatRelative(scan.date)}
                  </span>
                  <span className="rounded-md bg-background-secondary px-2 py-0.5">{scan.issuesFound} issues</span>
                </div>
              </div>
              <div className={`rounded-full border px-4 py-1.5 text-xs font-black ${scoreClass(scan.score)}`}>{Math.round(scan.score)}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function scoreClass(score: number) {
  if (score >= 80) return "border-status-success/20 bg-status-success/10 text-status-success";
  if (score >= 60) return "border-status-warning/20 bg-status-warning/10 text-status-warning";
  return "border-status-error/20 bg-status-error/10 text-status-error";
}

function formatRelative(value?: string) {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
