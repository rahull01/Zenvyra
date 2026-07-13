"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Bot, CheckCircle2, Clock, Globe, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import api from "@/lib/api";

type AiSystem = {
  id: string;
  systemName?: string;
  riskCategory?: string;
  readinessScore?: number;
  releaseStatus?: string;
  nextReviewAt?: string;
  updatedAt?: string;
};

type ReadinessSummary = {
  systemsCount?: number;
  assessedCount?: number;
  highRiskCount?: number;
  averageReadinessScore?: number;
  disclaimer?: string;
};

type Website = {
  id: string;
  url?: string;
  lastScanStatus?: string;
  lastScannedAt?: string;
};

export default function MonitorPage() {
  const [systems, setSystems] = useState<AiSystem[]>([]);
  const [readiness, setReadiness] = useState<ReadinessSummary>({});
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [systemsRes, readinessRes, websitesRes] = await Promise.all([
          api.get<AiSystem[]>("/ai-act/systems"),
          api.get<ReadinessSummary>("/ai-act/readiness"),
          api.get<Website[]>("/websites"),
        ]);
        if (!mounted) return;
        setSystems(systemsRes.data || []);
        setReadiness(readinessRes.data || {});
        setWebsites(websitesRes.data || []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Unable to load monitor data");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: "AI Systems", value: String(systems.length), icon: Bot },
      { label: "Assessed", value: String(readiness.assessedCount ?? systems.filter((s) => s.riskCategory).length), icon: CheckCircle2 },
      { label: "High-Risk", value: String(readiness.highRiskCount ?? systems.filter((s) => s.riskCategory?.includes("HIGH")).length), icon: AlertTriangle },
      { label: "Avg Readiness", value: `${readiness.averageReadinessScore ?? 0}%`, icon: ShieldCheck },
      { label: "Websites", value: String(websites.length), icon: Globe },
      { label: "Need Review", value: String(systems.filter((s) => s.nextReviewAt && new Date(s.nextReviewAt) <= new Date()).length), icon: Clock },
    ],
    [systems, readiness, websites],
  );

  const riskClass = (risk?: string) => {
    if (!risk) return "bg-text-tertiary/15 text-text-tertiary";
    if (risk.includes("PROHIBITED")) return "bg-status-error/15 text-status-error";
    if (risk.includes("HIGH")) return "bg-status-error/15 text-status-error";
    if (risk.includes("LIMITED")) return "bg-status-warning/15 text-status-warning";
    return "bg-status-success/15 text-status-success";
  };

  return (
    <DashboardPageShell
      title="AI Readiness Monitor"
      subtitle="Live view of AI systems, risk classification, documentation status, and compliance proof."
      icon={Activity}
    >
      {loading ? (
        <div className="standard-card text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading monitor data...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="standard-card !p-5 hover:!translate-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="standard-card hover:!translate-y-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-text-primary">AI Systems</h2>
              <Link href="/ai-act" className="btn-secondary !px-3 !py-1.5 text-xs">
                Open AI Act workspace
              </Link>
            </div>
            {systems.length === 0 ? (
              <p className="text-sm text-text-secondary">No AI systems yet. Add one in the AI Act workspace.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border-light text-xs uppercase text-text-tertiary">
                    <tr>
                      <th className="py-2 pr-4">System</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Risk</th>
                      <th className="py-2 pr-4">Score</th>
                      <th className="py-2 pr-4">Next Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systems.map((system) => (
                      <tr key={system.id} className="border-b border-border-light/50 last:border-0">
                        <td className="py-3 pr-4">
                          <Link href={`/ai-act/systems/${system.id}`} className="font-semibold text-accent hover:underline">
                            {system.systemName || "Unnamed system"}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-text-secondary">{system.releaseStatus || "DRAFT"}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${riskClass(system.riskCategory)}`}>
                            {system.riskCategory?.split("_").pop()?.toLowerCase() || "pending"}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-text-secondary">{system.readinessScore ?? "n/a"}</td>
                        <td className="py-3 pr-4 text-text-secondary">
                          {system.nextReviewAt ? new Date(system.nextReviewAt).toLocaleDateString() : "Not set"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="standard-card hover:!translate-y-0">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Monitored Websites</h2>
            {websites.length === 0 ? (
              <p className="text-sm text-text-secondary">No websites connected. Add a website to start scanning.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {websites.slice(0, 6).map((website) => (
                  <Link
                    key={website.id}
                    href={`/websites/${website.id}`}
                    className="rounded-xl border border-border-light bg-background-secondary p-4 transition hover:border-accent/50"
                  >
                    <p className="truncate font-semibold text-text-primary">{website.url || "Website"}</p>
                    <p className="mt-1 text-xs text-text-secondary">{website.lastScanStatus || "No scan yet"}</p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      {website.lastScannedAt ? new Date(website.lastScannedAt).toLocaleDateString() : "-"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}
