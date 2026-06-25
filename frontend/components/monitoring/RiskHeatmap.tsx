"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, Loader2, Shield } from "lucide-react";
import api from "@/lib/api";

type Website = {
  id: string;
  url: string;
  name?: string;
  issues?: Array<{
    id?: string;
    category?: string;
    severity?: string;
    title?: string;
    description?: string;
    fixed?: boolean;
    detectedAt?: string;
  }>;
};

type RiskItem = {
  id: string;
  website: string;
  category: string;
  risk: "low" | "medium" | "high" | "critical";
  impact: string;
  probability: number;
  lastChecked: string;
};

const riskConfig = {
  low: { color: "bg-success/20 text-success", dot: "bg-success", label: "Low" },
  medium: { color: "bg-warning/20 text-warning", dot: "bg-warning", label: "Medium" },
  high: { color: "bg-accent/20 text-accent", dot: "bg-accent", label: "High" },
  critical: { color: "bg-error/20 text-error", dot: "bg-error", label: "Critical" },
};

export default function RiskHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [websitesData, setWebsitesData] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<Website[]>("/websites")
      .then((response) => {
        if (mounted) setWebsitesData(response.data || []);
      })
      .catch(() => {
        if (mounted) setWebsitesData([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const risks = useMemo<RiskItem[]>(() => {
    return websitesData.flatMap((website) =>
      (website.issues || [])
        .filter((issue) => !issue.fixed)
        .map((issue, index) => ({
          id: issue.id || `${website.id}-${index}`,
          website: website.name || website.url,
          category: issue.category || "Compliance",
          risk: normalizeSeverity(issue.severity),
          impact: issue.title || issue.description || "Compliance issue",
          probability: probabilityForSeverity(issue.severity),
          lastChecked: formatRelative(issue.detectedAt),
        })),
    );
  }, [websitesData]);

  const websites = Array.from(new Set(risks.map((risk) => risk.website)));
  const categories = Array.from(new Set(risks.map((risk) => risk.category)));

  const getRiskForCell = (website: string, category: string) => risks.find((risk) => risk.website === website && risk.category === category);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/20">
            <AlertTriangle className="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 className="text-heading-3">Risk Heatmap</h3>
            <p className="text-sm text-surface-500">Compliance risk by website and category</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(riskConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${config.dot}`} />
              <span className="text-xs text-surface-500">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-surface-500">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          Loading risk data...
        </div>
      ) : risks.length === 0 ? (
        <div className="rounded-xl bg-surface-800/30 p-6 text-sm text-surface-500">No unresolved website risks found.</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="mb-2 grid gap-2" style={{ gridTemplateColumns: `150px repeat(${categories.length}, minmax(120px, 1fr))` }}>
              <div className="text-xs font-medium text-surface-500">Website</div>
              {categories.map((category) => (
                <div key={category} className="text-center text-xs font-medium text-surface-500">{category}</div>
              ))}
            </div>
            {websites.map((website) => (
              <div key={website} className="mb-2 grid gap-2" style={{ gridTemplateColumns: `150px repeat(${categories.length}, minmax(120px, 1fr))` }}>
                <div className="flex items-center text-sm font-medium text-surface-300">
                  <Shield className="mr-2 h-4 w-4 text-surface-500" />
                  {website}
                </div>
                {categories.map((category) => {
                  const risk = getRiskForCell(website, category);
                  const cellId = `${website}-${category}`;
                  const isHovered = hoveredCell === cellId;
                  return (
                    <motion.div
                      key={cellId}
                      onMouseEnter={() => setHoveredCell(cellId)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`relative flex h-16 cursor-pointer items-center justify-center rounded-xl transition-all duration-300 ${
                        risk ? riskConfig[risk.risk].color : "bg-surface-800/30"
                      } ${isHovered ? "z-10 scale-105 shadow-lg" : ""}`}
                    >
                      {risk ? <span className="text-lg font-bold">{risk.probability}%</span> : <span className="text-surface-600">-</span>}
                      {isHovered && risk && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 rounded-xl border border-surface-700 bg-surface-900 p-3 shadow-xl">
                          <p className="mb-1 text-sm font-medium text-surface-200">{risk.impact}</p>
                          <p className="text-xs text-surface-500">Probability: {risk.probability}%</p>
                          <p className="mt-1 text-xs text-surface-600">Checked {risk.lastChecked}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-surface-800/30 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-surface-500" />
          <span className="text-sm font-medium text-surface-400">Risk Calculation</span>
        </div>
        <p className="text-xs text-surface-500">Risk levels are derived from unresolved scan issue severities.</p>
      </div>
    </div>
  );
}

function normalizeSeverity(severity?: string): RiskItem["risk"] {
  const value = severity?.toLowerCase();
  if (value === "critical" || value === "high" || value === "medium" || value === "low") return value;
  return "medium";
}

function probabilityForSeverity(severity?: string) {
  const value = severity?.toLowerCase();
  if (value === "critical") return 95;
  if (value === "high") return 85;
  if (value === "medium") return 65;
  return 35;
}

function formatRelative(value?: string) {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
