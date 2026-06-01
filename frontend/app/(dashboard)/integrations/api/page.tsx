"use client";

import React, { useState } from "react";
import { Cpu, ArrowLeft, Key, Copy, Check, Trash2, Plus, ShieldAlert } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const initialKeys = [
  { id: "key_01", name: "Production Server Key", token: "ca_live_8f7b...332x", created: "May 20, 2026", active: true },
  { id: "key_02", name: "Staging Test token", token: "ca_test_90cc...882y", created: "May 10, 2026", active: true },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(initialKeys);
  const [copiedId, setCopiedId] = useState("");
  const [keyNameInput, setKeyNameInput] = useState("");

  const handleCopyKey = (id: string, fullVal: string) => {
    navigator.clipboard.writeText(fullVal);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyNameInput.trim()) return;

    const newKey = {
      id: `key_${Date.now()}`,
      name: keyNameInput,
      token: `ca_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      created: "Just now",
      active: true,
    };

    setKeys([...keys, newKey]);
    setKeyNameInput("");
  };

  const handleRevokeKey = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
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
        {/* Keys table left */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl overflow-hidden shadow-card">
          <div className="p-5 border-b border-border-light flex justify-between items-center bg-background-secondary/40">
            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-primary" />
              Active API Keys
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary text-caption font-semibold uppercase tracking-wider text-text-primary">
                <tr>
                  <th className="px-5 py-3.5">Label Name</th>
                  <th className="px-5 py-3.5">API Secret Key</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Revoke</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className="border-t border-border-light hover:bg-background-secondary/50">
                    <td className="px-5 py-4 font-semibold text-text-primary">
                      {k.name}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-caption font-mono bg-background-secondary px-2.5 py-1 rounded border border-border-light text-text-secondary">
                          {k.token}
                        </code>
                        <button
                          onClick={() => handleCopyKey(k.id, "ca_live_secret_token_placeholder_value_here")}
                          className="text-text-muted hover:text-primary transition-colors"
                          title="Copy token key"
                        >
                          {copiedId === k.id ? <Check className="h-4 w-4 text-status-success" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-secondary font-medium">{k.created}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="text-text-muted hover:text-status-error transition-colors p-1"
                        title="Revoke key credentials"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-sm text-text-muted font-medium">
                      No active API keys found. Generate a key below.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate key form right */}
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white text-caption font-bold py-2.5 rounded-xl shadow-button">
                Generate API Key
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
