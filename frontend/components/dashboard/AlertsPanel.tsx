"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CheckCircle, Info, Loader2, ShieldAlert } from "lucide-react";
import api from "@/lib/api";

type Insight = {
  id: string;
  title: string;
  description: string;
  priority?: string;
  website?: string;
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<{ data: { insights: Insight[] } }>("/dashboard/ai-insights")
      .then((response) => {
        if (mounted) setAlerts(response.data.data.insights || []);
      })
      .catch(() => {
        if (mounted) setAlerts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-bg-tertiary bg-bg-secondary p-8 shadow-2xl">
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-bg-tertiary bg-bg-primary shadow-lg">
            <Bell className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold leading-none text-text-primary">Security Feed</h3>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Active Notifications</p>
          </div>
        </div>
        <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-accent">
          {alerts.length} Open
        </span>
      </div>

      <div className="relative z-10 flex-1 space-y-4">
        {loading ? (
          <div className="py-8 text-center text-text-secondary">
            <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="rounded-2xl border border-bg-tertiary bg-bg-primary p-5 text-sm text-text-secondary">No unresolved compliance alerts.</div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="group relative flex items-start gap-4 rounded-2xl border border-accent/10 bg-accent/5 p-5 transition-all hover:border-accent/30">
              <div className="mt-0.5 rounded-xl border border-bg-tertiary bg-bg-primary p-2 shadow-sm">
                {alert.priority === "low" ? <Info className="h-5 w-5 text-info" /> : <ShieldAlert className="h-5 w-5 text-accent" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold text-text-primary">{alert.title}</p>
                  {alert.priority === "low" && <CheckCircle className="h-4 w-4 text-success" />}
                </div>
                <p className="truncate text-xs leading-relaxed text-text-secondary">{alert.description}</p>
                {alert.website && <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">{alert.website}</p>}
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/dashboard/ai-insights" className="relative z-10 mt-8 flex items-center justify-center gap-3 rounded-2xl border border-bg-tertiary bg-bg-primary py-4 text-[10px] font-black uppercase tracking-[0.25em] text-text-primary transition-all hover:border-accent/40 hover:bg-bg-secondary">
        Insight Archive
        <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
