"use client";

import React, { useEffect, useState } from "react";
import { Cpu, ArrowLeft, Key, Copy, Check, Trash2, Plus, RefreshCw, ShieldAlert, Loader2 } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";

type ApiKeyRecord = {
  id: string;
  name: string;
  prefix?: string;
  scopes?: string[];
  lastUsed?: string;
  expiresAt?: string;
  createdAt?: string;
};

type CreateApiKeyResponse = {
  apiKey: ApiKeyRecord;
  token: string;
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [keyNameInput, setKeyNameInput] = useState("");
  const [newSecret, setNewSecret] = useState("");

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<ApiKeyRecord[]>("/developer/api-keys");
      setKeys(response.data);
    } catch (err: any) {
      setKeys([]);
      setError(err?.response?.data?.message || "API key management is available on Pro and Agency plans.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyNameInput.trim()) return;

    setSaving(true);
    setError("");
    setNewSecret("");
    try {
      const response = await api.post<CreateApiKeyResponse>("/developer/api-keys", {
        name: keyNameInput.trim(),
      });
      setKeys((current) => [response.data.apiKey, ...current]);
      setNewSecret(response.data.token);
      setKeyNameInput("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to create API key.");
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    setError("");
    try {
      await api.delete(`/developer/api-keys/${id}`);
      setKeys((current) => current.filter((k) => k.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to revoke API key.");
    }
  };

  const handleRollKey = async (id: string) => {
    setError("");
    setNewSecret("");
    try {
      const response = await api.post<CreateApiKeyResponse>(`/developer/api-keys/${id}/roll`);
      setKeys((current) => [response.data.apiKey, ...current.filter((key) => key.id !== id)]);
      setNewSecret(response.data.token);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to roll API key.");
    }
  };

  return (
    <DashboardPageShell
      title="Developer API Credentials"
      subtitle="Provision access tokens, monitor usage quotas, and revoke system integrations."
      icon={Cpu}
    >
      <div className="mb-6">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 text-caption font-bold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Integrations
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl overflow-hidden shadow-card">
          <div className="p-5 border-b border-border-light flex justify-between items-center bg-background-secondary/40">
            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-primary" />
              Active API Keys
            </h3>
          </div>
          {newSecret && (
            <div className="m-5 rounded-2xl border border-status-warning/30 bg-status-warning/10 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-status-warning" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-text-primary">Copy this secret now. It will not be shown again.</p>
                  <div className="mt-3 flex min-w-0 items-center gap-2 rounded-xl border border-border-light bg-background-secondary p-2">
                    <code className="min-w-0 flex-1 truncate text-caption font-mono text-text-secondary">{newSecret}</code>
                    <button
                      type="button"
                      onClick={() => copyText("new-secret", newSecret)}
                      className="shrink-0 text-text-muted hover:text-primary transition-colors"
                      title="Copy new API secret"
                    >
                      {copiedId === "new-secret" ? <Check className="h-4 w-4 text-status-success" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="mx-5 mt-5 rounded-2xl border border-border-light bg-background-secondary p-4 text-sm text-text-secondary">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary text-caption font-semibold uppercase tracking-wider text-text-primary">
                <tr>
                  <th className="px-5 py-3.5">Label Name</th>
                  <th className="px-5 py-3.5">Secret Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-text-muted">
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Loading API keys
                    </td>
                  </tr>
                )}
                {keys.map((k) => (
                  <tr key={k.id} className="border-t border-border-light hover:bg-background-secondary/50">
                    <td className="px-5 py-4 font-semibold text-text-primary">
                      {k.name}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-caption font-mono bg-background-secondary px-2.5 py-1 rounded border border-border-light text-text-secondary">
                          {k.prefix ? `${k.prefix}... hidden` : "Secret hidden after creation"}
                        </code>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-secondary font-medium">{formatDate(k.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleRollKey(k.id)}
                        className="text-text-muted hover:text-primary transition-colors p-1"
                        title="Roll key and reveal a new one-time secret"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="ml-2 text-text-muted hover:text-status-error transition-colors p-1"
                        title="Revoke API key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && keys.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-sm text-text-muted font-medium">
                      No active API keys found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Plus className="text-primary h-4.5 w-4.5" />
              Generate Token
            </h3>
            <form onSubmit={handleCreateKey} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Key Label Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Analytics Cron Service"
                  value={keyNameInput}
                  onChange={(e) => setKeyNameInput(e.target.value)}
                  className="w-full text-caption px-3 py-2.5 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary-hover text-white text-caption font-bold py-2.5 rounded-xl shadow-button">
                {saving ? "Generating..." : "Generate API Key"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}

function formatDate(value?: string) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}
