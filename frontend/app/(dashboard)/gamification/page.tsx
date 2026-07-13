"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Lock, ShieldCheck, Sparkles, Target, Trophy, Zap } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import api from "@/lib/api";

type AiSystem = {
  id: string;
  riskCategory?: string;
  readinessScore?: number;
};

type Website = {
  id: string;
};

type Badge = {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  unlocked: boolean;
};

export default function GamificationPage() {
  const [systems, setSystems] = useState<AiSystem[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [systemsRes, websitesRes] = await Promise.all([
          api.get<AiSystem[]>("/ai-act/systems"),
          api.get<Website[]>("/websites"),
        ]);
        if (!mounted) return;
        setSystems(systemsRes.data || []);
        setWebsites(websitesRes.data || []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Unable to load progress");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const assessedCount = useMemo(() => systems.filter((s) => s.riskCategory).length, [systems]);
  const highRiskCount = useMemo(() => systems.filter((s) => s.riskCategory?.includes("HIGH")).length, [systems]);
  const avgScore = useMemo(() => {
    const scored = systems.filter((s) => s.readinessScore != null);
    if (scored.length === 0) return 0;
    return Math.round(scored.reduce((sum, s) => sum + (s.readinessScore || 0), 0) / scored.length);
  }, [systems]);

  const badges: Badge[] = useMemo(
    () => [
      {
        id: "first-system",
        title: "First Inventory",
        description: "Add your first AI system to the inventory.",
        icon: Sparkles,
        unlocked: systems.length > 0,
      },
      {
        id: "risk-assessor",
        title: "Risk Assessor",
        description: "Run an AI Act readiness assessment.",
        icon: Target,
        unlocked: assessedCount > 0,
      },
      {
        id: "high-risk-aware",
        title: "High-Risk Aware",
        description: "Identify a high-risk AI system.",
        icon: ShieldCheck,
        unlocked: highRiskCount > 0,
      },
      {
        id: "readiness-50",
        title: "Halfway Ready",
        description: "Reach an average readiness score of 50%.",
        icon: CheckCircle2,
        unlocked: avgScore >= 50,
      },
      {
        id: "readiness-80",
        title: "Proof Ready",
        description: "Reach an average readiness score of 80%.",
        icon: Zap,
        unlocked: avgScore >= 80,
      },
      {
        id: "website-scanner",
        title: "Surface Scanner",
        description: "Connect and scan at least one website.",
        icon: Trophy,
        unlocked: websites.length > 0,
      },
    ],
    [systems.length, assessedCount, highRiskCount, avgScore, websites.length],
  );

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <DashboardPageShell
      title="Compliance Journey"
      subtitle="Earn badges and track progress as you build AI Act readiness evidence."
      icon={Trophy}
    >
      {loading ? (
        <div className="standard-card text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading journey data...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="standard-card !p-6 hover:!translate-y-0">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                <Trophy className="h-8 w-8 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-text-primary">
                  Level {Math.min(5, 1 + Math.floor(unlockedCount / 2))}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  {unlockedCount} of {badges.length} badges earned
                </p>
                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-background-secondary sm:max-w-md">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${Math.round((unlockedCount / badges.length) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`standard-card !p-5 hover:!translate-y-0 ${
                    badge.unlocked ? "" : "opacity-70 grayscale"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        badge.unlocked ? "bg-accent/10" : "bg-background-secondary"
                      }`}
                    >
                      {badge.unlocked ? (
                        <Icon className="h-6 w-6 text-accent" />
                      ) : (
                        <Lock className="h-6 w-6 text-text-tertiary" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{badge.title}</p>
                      <p className="mt-1 text-xs text-text-secondary">{badge.description}</p>
                      {badge.unlocked ? (
                        <span className="mt-2 inline-flex items-center rounded-full bg-status-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-status-success">
                          Earned
                        </span>
                      ) : (
                        <span className="mt-2 inline-flex items-center rounded-full bg-background-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-text-tertiary">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}
