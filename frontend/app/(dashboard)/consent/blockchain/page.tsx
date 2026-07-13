"use client";

import { useState } from "react";
import { Blocks, Loader2, Save, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";

const NETWORKS = ["Ethereum", "Polygon", "Arbitrum", "Base", "Custom RPC"];

export default function BlockchainConsentPage() {
  const [enabled, setEnabled] = useState(false);
  const [network, setNetwork] = useState("Polygon");
  const [walletAddress, setWalletAddress] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Blockchain ledger settings saved.");
    }, 500);
  };

  return (
    <DashboardPageShell
      title="Blockchain Consent Ledger"
      subtitle="Configure on-chain attestation for immutable consent audit records."
      icon={Blocks}
    >
      <div className="space-y-6">
        <div className="standard-card hover:!translate-y-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">On-chain attestation</h2>
              <p className="mt-1 text-sm text-text-secondary">
                When enabled, a cryptographic hash of each consent receipt is written to the configured
                network, creating a tamper-evident audit trail.
              </p>
            </div>
          </div>
        </div>

        <div className="standard-card hover:!translate-y-0">
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-lg border border-border-light bg-background-secondary p-4 text-sm font-semibold text-text-primary">
              Enable blockchain attestation
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-5 w-5 rounded text-accent"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">Network</label>
                <select
                  className="text-input w-full"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                >
                  {NETWORKS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">Signer wallet address</label>
                <input
                  type="text"
                  className="text-input w-full"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>
            </div>

            {network === "Custom RPC" && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">Custom RPC URL</label>
                <input
                  type="url"
                  className="text-input w-full"
                  placeholder="https://..."
                  value={rpcUrl}
                  onChange={(e) => setRpcUrl(e.target.value)}
                />
              </div>
            )}

            <div className="rounded-xl border border-status-warning/30 bg-status-warning/10 p-4 text-sm text-text-secondary">
              <p>
                This is a configuration surface. Writing to a live network requires a backend attestation service
                and a funded signer wallet.
              </p>
            </div>

            <button onClick={save} disabled={saving} className="btn-primary w-full justify-center sm:w-auto">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save settings
            </button>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
