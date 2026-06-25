"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  RefreshCw,
  Settings,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/api";

type ComplianceIssue = {
  id?: string;
  type?: string;
  category?: string;
  severity?: string;
  title?: string;
  description?: string;
  fixSuggestion?: string;
  autoFixable?: boolean;
  fixed?: boolean;
  detectedAt?: string;
};

type ScanHistoryItem = {
  score?: number;
  scanDate?: string;
};

type Website = {
  id: string;
  url: string;
  name?: string;
  complianceScore?: number;
  previousScore?: number;
  scanFrequency?: string;
  monitoringEnabled?: boolean;
  lastScanAt?: string;
  nextScanAt?: string;
  issues?: ComplianceIssue[];
  scanHistory?: ScanHistoryItem[];
};

export default function WebsiteDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [website, setWebsite] = useState<Website | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const loadWebsite = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.get<Website>(`/websites/${id}`);
      setWebsite(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load website");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadWebsite();
  }, [loadWebsite]);

  const handleScan = async () => {
    if (!id) return;
    setIsScanning(true);
    try {
      const response = await api.post<Website>(`/websites/${id}/scan`);
      setWebsite(response.data);
      toast.success("Scan completed.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Scan failed");
    } finally {
      setIsScanning(false);
    }
  };

  const issues = useMemo(() => website?.issues || [], [website]);
  const openIssues = issues.filter((issue) => !issue.fixed);
  const score = Math.round(website?.complianceScore || 0);
  const categoryBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    issues.forEach((issue) => {
      const category = issue.category || "Compliance";
      counts.set(category, (counts.get(category) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
  }, [issues]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-text-secondary">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading website...
      </div>
    );
  }

  if (!website) {
    return (
      <div className="rounded-2xl border border-status-error/30 bg-status-error/10 p-6 text-status-error">
        Website could not be loaded.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/websites" className="rounded-lg p-2 transition-colors hover:bg-background-tertiary">
            <ArrowLeft className="h-5 w-5 text-text-tertiary" />
          </Link>
          <div>
            <h1 className="text-display-3 font-display text-text-primary">{website.name || website.url}</h1>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-sm text-text-tertiary transition-colors hover:text-primary"
            >
              <Globe className="h-3 w-3" />
              {website.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-primary transition-all hover:bg-primary/20 disabled:opacity-60"
          >
            {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isScanning ? "Scanning..." : "Scan Now"}
          </button>
          <Link
            href={`/dashboard/websites/${id}/handoff`}
            className="flex items-center gap-2 rounded-xl border border-border-light px-4 py-2 text-text-secondary transition-all hover:bg-background-secondary"
          >
            <Shield className="h-4 w-4" />
            Setup Handoff
          </Link>
          <Link
            href={`/dashboard/websites/${id}/proof-report`}
            className="flex items-center gap-2 rounded-xl border border-border-light px-4 py-2 text-text-secondary transition-all hover:bg-background-secondary"
          >
            <FileText className="h-4 w-4" />
            Proof Report
          </Link>
          <button className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-background-tertiary" aria-label="Website settings">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border-light bg-surface-card p-8 shadow-card">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="relative h-40 w-40">
            <svg className="h-full w-full -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--bg-secondary)" strokeWidth="12" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-text-primary">{score}</span>
              <span className="text-sm text-text-tertiary">/100</span>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-4">
            <Metric label="Open Issues" value={String(openIssues.length)} />
            <Metric label="Last Scan" value={formatRelative(website.lastScanAt)} />
            <Metric label="Monitoring" value={website.monitoringEnabled ? "On" : "Off"} />
            <Metric label="Next Scan" value={formatRelative(website.nextScanAt, true)} />
          </div>
        </div>
      </div>

      <div className="flex w-fit items-center gap-1 rounded-xl bg-background-tertiary/50 p-1">
        {[
          { id: "overview", label: "Overview", icon: Shield },
          { id: "issues", label: "Issues", icon: AlertTriangle },
          { id: "history", label: "History", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id ? "bg-primary/10 text-primary" : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
            <h3 className="mb-6 text-heading-3">Score History</h3>
            <div className="space-y-3">
              {(website.scanHistory || []).length === 0 ? (
                <p className="text-sm text-text-secondary">No stored scan history yet.</p>
              ) : (
                (website.scanHistory || []).slice(0, 10).map((entry, index) => (
                  <div key={`${entry.scanDate}-${index}`} className="flex items-center justify-between rounded-xl bg-background-secondary p-4">
                    <span className="text-sm text-text-secondary">{formatDate(entry.scanDate)}</span>
                    <span className={`rounded-full px-3 py-1 text-sm font-bold ${scoreBadge(entry.score || 0)}`}>
                      {Math.round(entry.score || 0)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
            <h3 className="mb-6 text-heading-3">Issues by Category</h3>
            <div className="space-y-3">
              {categoryBreakdown.length === 0 ? (
                <p className="text-sm text-text-secondary">No issues detected in the latest scan.</p>
              ) : (
                categoryBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{item.category}</span>
                      <span className="font-semibold text-text-primary">{item.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-background-tertiary">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, item.count * 20)}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "issues" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {issues.length === 0 ? (
            <div className="rounded-2xl border border-border-light bg-surface-card p-8 text-center text-text-secondary">
              No issues detected.
            </div>
          ) : (
            issues.map((issue, index) => (
              <div key={issue.id || `${issue.type}-${index}`} className="rounded-xl border border-border-light bg-surface-card p-6 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${severityClass(issue.severity)}`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-3">
                        <h4 className="font-semibold text-text-primary">{issue.title || issue.type || "Compliance issue"}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-caption font-medium ${severityClass(issue.severity)}`}>
                          {issue.severity || "medium"}
                        </span>
                        {issue.fixed && (
                          <span className="rounded-full bg-status-success/10 px-2 py-0.5 text-caption font-medium text-status-success">
                            Fixed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{issue.description}</p>
                      {issue.fixSuggestion && <p className="mt-2 text-sm font-medium text-primary">{issue.fixSuggestion}</p>}
                      <div className="mt-2 flex items-center gap-4 text-caption text-text-tertiary">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelative(issue.detectedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          {issue.fixed ? <CheckCircle className="h-3 w-3 text-status-success" /> : <AlertTriangle className="h-3 w-3 text-status-warning" />}
                          {issue.fixed ? "resolved" : "open"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {activeTab === "history" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-border-light bg-surface-card shadow-card">
          <table className="w-full">
            <thead className="bg-background-tertiary/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-tertiary">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-tertiary">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {(website.scanHistory || []).map((entry, index) => (
                <tr key={`${entry.scanDate}-${index}`} className="transition-colors hover:bg-background-tertiary/30">
                  <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(entry.scanDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-sm font-medium ${scoreBadge(entry.score || 0)}`}>
                      {Math.round(entry.score || 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background-tertiary/50 p-4">
      <p className="mb-1 text-sm text-text-tertiary">{label}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

function severityClass(severity?: string) {
  const value = severity?.toLowerCase();
  if (value === "critical" || value === "high") return "bg-status-error/10 text-status-error";
  if (value === "medium") return "bg-status-warning/10 text-status-warning";
  return "bg-status-success/10 text-status-success";
}

function scoreBadge(score: number) {
  if (score >= 80) return "bg-status-success/10 text-status-success";
  if (score >= 60) return "bg-status-warning/10 text-status-warning";
  return "bg-status-error/10 text-status-error";
}

function formatRelative(value?: string, future = false) {
  if (!value) return future ? "not scheduled" : "never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  const delta = future ? date.getTime() - Date.now() : Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(delta / 60000));
  if (minutes < 1) return future ? "soon" : "just now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr`;
  return `${Math.floor(hours / 24)} days`;
}

function formatDate(value?: string) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}
