"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, CheckCircle, Clock, ExternalLink, FileText, Globe } from "lucide-react";
import api from "@/lib/api";

type ActivityItem = {
  id: string;
  action?: string;
  website?: string;
  status?: string;
  time?: string;
};

type ChangeAlert = {
  id: string;
  website: string;
  type: "content" | "script" | "ssl" | "policy";
  title: string;
  description: string;
  detectedAt: string;
  severity: "critical" | "warning" | "info";
  status: "new" | "acknowledged" | "resolved";
};

const typeIcons = {
  content: FileText,
  script: FileText,
  ssl: CheckCircle,
  policy: FileText,
};

const severityConfig = {
  critical: { color: "text-error bg-error/20" },
  warning: { color: "text-warning bg-warning/20" },
  info: { color: "text-brand-400 bg-brand-500/20" },
};

export default function ChangeAlerts() {
  const [alerts, setAlerts] = useState<ChangeAlert[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "acknowledged">("all");

  useEffect(() => {
    let mounted = true;
    api
      .get<{ data: { activities: ActivityItem[] } }>("/dashboard/activity")
      .then((response) => {
        if (!mounted) return;
        setAlerts(
          (response.data.data.activities || []).map((item) => ({
            id: item.id,
            website: item.website || "Website",
            type: "content",
            title: item.action || "Compliance activity",
            description: item.status || "Activity recorded",
            detectedAt: formatRelative(item.time),
            severity: item.status === "failed" ? "critical" : item.status === "completed" ? "info" : "warning",
            status: item.status === "completed" ? "resolved" : "new",
          })),
        );
      })
      .catch(() => {
        if (mounted) setAlerts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredAlerts = alerts.filter((alert) => filter === "all" || alert.status === filter);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-heading-3">Change Alerts</h3>
            <p className="text-sm text-surface-500">{alerts.filter((alert) => alert.status === "new").length} unacknowledged</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "new", "acknowledged"] as const).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filter === value ? "bg-brand-500/20 text-brand-400" : "text-surface-500 hover:bg-surface-800"
              }`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-xl bg-surface-800/30 p-5 text-sm text-surface-500">No matching activity alerts.</div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const Icon = typeIcons[alert.type];
            const sev = severityConfig[alert.severity];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border p-4 transition-all ${alert.status === "new" ? "border-brand-500/20 bg-brand-500/5" : "border-transparent bg-surface-800/30"}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${sev.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h4 className="font-medium text-surface-200">{alert.title}</h4>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sev.color}`}>{alert.severity}</span>
                      {alert.status === "new" && <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />}
                    </div>
                    <p className="mb-2 text-sm text-surface-400">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {alert.website}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.detectedAt}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-surface-400" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatRelative(value?: string) {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
