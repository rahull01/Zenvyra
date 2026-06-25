"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, ExternalLink, Globe, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";

type Website = {
  id: string;
  url: string;
  name: string;
  status: "active" | "warning" | "error";
  complianceScore: number;
  lastScan: string;
  issues: number;
  monitoring: boolean;
};

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWebsites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<any[]>("/websites");
      setWebsites(response.data.map(mapWebsite));
    } catch (error: any) {
      const message = error?.response?.data?.message || "Unable to load websites";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebsites();
  }, []);

  const handleAddWebsite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newUrl.trim()) return;

    setSaving(true);
    try {
      const response = await api.post("/websites", { url: newUrl.trim() });
      const created = mapWebsite(response.data);
      setWebsites((prev) => [created, ...prev.filter((site) => site.id !== created.id)]);
      setShowAddModal(false);
      setNewUrl("");
      toast.success("Website added and scanned.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add website");
    } finally {
      setSaving(false);
    }
  };

  const rescanWebsite = async (id: string) => {
    setScanningId(id);
    try {
      const response = await api.post(`/websites/${id}/scan`);
      const updated = mapWebsite(response.data);
      setWebsites((prev) => prev.map((site) => (site.id === id ? updated : site)));
      toast.success("Scan completed.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Scan failed");
    } finally {
      setScanningId(null);
    }
  };

  const deleteWebsite = async (id: string) => {
    try {
      await api.delete(`/websites/${id}`);
      setWebsites((prev) => prev.filter((site) => site.id !== id));
      toast.success("Website removed.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove website");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-status-success";
    if (score >= 60) return "text-status-warning";
    return "text-status-error";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-status-success/20";
    if (score >= 60) return "bg-status-warning/20";
    return "bg-status-error/20";
  };

  return (
    <div className="min-h-screen bg-background-primary px-6 py-8 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary">Websites</h1>
            <p className="mt-2 text-sm text-text-secondary">Manage and monitor all your websites</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-sm font-semibold text-white transition hover:from-primary-light hover:to-primary"
          >
            <Plus className="h-4 w-4" />
            Add Website
          </motion.button>
        </div>

        {error && (
          <div className="rounded-2xl border border-status-error/30 bg-status-error/10 p-4 text-sm text-status-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center rounded-3xl border border-border-light bg-background-secondary py-20 text-text-secondary">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading websites...
          </div>
        ) : websites.length === 0 ? (
          <div className="rounded-3xl border border-border-light bg-background-secondary p-10 text-center">
            <Globe className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-bold">No websites yet</h2>
            <p className="mt-2 text-sm text-text-secondary">Add your first website to start monitoring real compliance data.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites.map((website, index) => (
              <motion.div
                key={website.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-3xl border border-border-light bg-background-secondary p-6 transition-all duration-300 hover:border-primary/30"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-tertiary text-primary">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{website.name}</h3>
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {website.url}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteWebsite(website.id)}
                    className="rounded-lg p-2 text-status-error transition-colors hover:bg-background-tertiary"
                    aria-label={`Remove ${website.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4 flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${getScoreBg(website.complianceScore)}`}>
                    <span className={`text-2xl font-bold ${getScoreColor(website.complianceScore)}`}>{website.complianceScore}</span>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Compliance Score</p>
                    <p className={`text-sm font-medium ${getScoreColor(website.complianceScore)}`}>
                      {website.complianceScore >= 80 ? "Compliant" : website.complianceScore >= 60 ? "Needs Work" : "At Risk"}
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border-light bg-background-tertiary p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm text-text-secondary">
                      <AlertTriangle className="h-4 w-4" />
                      Issues
                    </div>
                    <p className="text-lg font-semibold text-text-primary">{website.issues}</p>
                  </div>
                  <div className="rounded-xl border border-border-light bg-background-tertiary p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle className="h-4 w-4" />
                      Last Scan
                    </div>
                    <p className="text-lg font-semibold text-text-primary">{website.lastScan}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border-light pt-4">
                  <button
                    onClick={() => rescanWebsite(website.id)}
                    disabled={scanningId === website.id}
                    className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/20 disabled:opacity-60"
                  >
                    {scanningId === website.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    {scanningId === website.id ? "Scanning" : "Rescan"}
                  </button>
                  <Link href={`/dashboard/websites/${website.id}`} className="text-sm font-medium text-primary hover:text-primary-hover">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md rounded-3xl border border-border-light bg-background-secondary p-8"
            >
              <h2 className="mb-6 text-3xl font-bold text-text-primary">Add New Website</h2>
              <form onSubmit={handleAddWebsite} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text-primary">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(event) => setNewUrl(event.target.value)}
                      placeholder="https://example.com"
                      required
                      className="w-full rounded-full border border-border-medium bg-background-tertiary px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 rounded-full border border-border-medium bg-background-tertiary px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-background-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-full bg-gradient-to-r from-primary to-primary-hover px-4 py-3 text-sm font-semibold text-white transition hover:from-primary-light hover:to-primary disabled:opacity-60"
                  >
                    {saving ? "Scanning..." : "Add Website"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function mapWebsite(raw: any): Website {
  const score = Math.round(raw.complianceScore ?? raw.score ?? 0);
  const issueCount = Array.isArray(raw.issues) ? raw.issues.length : Number(raw.issues ?? 0);
  return {
    id: raw.id,
    url: raw.url,
    name: raw.name || raw.url,
    status: score >= 80 ? "active" : score >= 60 ? "warning" : "error",
    complianceScore: score,
    lastScan: formatRelative(raw.lastScanAt || raw.lastScan),
    issues: issueCount,
    monitoring: Boolean(raw.monitoringEnabled ?? raw.monitoring),
  };
}

function formatRelative(value?: string) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
