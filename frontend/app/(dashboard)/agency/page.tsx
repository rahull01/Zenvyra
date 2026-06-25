"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, ExternalLink, FileText, Loader2, Mail, Palette, Plus, Save, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/lib/api";

type AgencyBranding = {
  hidePoweredByBadge?: boolean;
  primaryBrandColor?: string;
  customPrivacyPolicyUrl?: string;
};

type AgencyClientSite = {
  id: string;
  domainName?: string;
  bundleTokenId?: string;
  clientCompanyName?: string;
  websiteId?: string;
  bannerId?: string;
  branding?: AgencyBranding;
  complianceScore?: number;
  openIssues?: number;
  lastScanAt?: string;
  bannerActive?: boolean;
};

export default function AgencyDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [clients, setClients] = useState<AgencyClientSite[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [newClient, setNewClient] = useState({ clientCompanyName: "", domainName: "" });

  useEffect(() => {
    let mounted = true;
    api
      .get<{ clients: AgencyClientSite[] }>("/agency/clients")
      .then((response) => {
        if (!mounted) return;
        const records = response.data.clients || [];
        setClients(records);
        setSelectedClientId(records[0]?.id || "");
      })
      .catch((error) => toast.error(error?.response?.data?.message || "Unable to load agency clients"))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedClient = clients.find((client) => client.id === selectedClientId) || clients[0] || null;
  const averageScore = useMemo(() => {
    if (clients.length === 0) return 0;
    return Math.round(clients.reduce((sum, client) => sum + Number(client.complianceScore || 0), 0) / clients.length);
  }, [clients]);

  const updateSelectedBranding = (updates: Partial<AgencyBranding>) => {
    if (!selectedClient) return;
    setClients((previous) =>
      previous.map((client) =>
        client.id === selectedClient.id
          ? { ...client, branding: { ...(client.branding || {}), ...updates } }
          : client,
      ),
    );
  };

  const saveSelectedClient = async () => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      const response = await api.put<AgencyClientSite>(`/agency/clients/${selectedClient.id}`, selectedClient);
      setClients((previous) => previous.map((client) => (client.id === response.data.id ? response.data : client)));
      toast.success("Client branding saved.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to save agency client");
    } finally {
      setSaving(false);
    }
  };

  const createClient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newClient.clientCompanyName.trim() && !newClient.domainName.trim()) {
      toast.error("Add a client name or domain.");
      return;
    }
    setActionLoading("create");
    try {
      const response = await api.post<AgencyClientSite>("/agency/clients", newClient);
      setClients((previous) => [...previous, response.data]);
      setSelectedClientId(response.data.id);
      setNewClient({ clientCompanyName: "", domainName: "" });
      toast.success("Client workspace added.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to add client");
    } finally {
      setActionLoading("");
    }
  };

  const runClientAction = async (kind: "proof-pack" | "send-report" | "issue-certificate") => {
    if (!selectedClient) return;
    setActionLoading(kind);
    try {
      const response = await api.post(`/agency/clients/${selectedClient.id}/${kind}`);
      toast.success(response.data?.message || actionSuccessLabel(kind));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to run agency action");
    } finally {
      setActionLoading("");
    }
  };

  if (user?.accountType && user.accountType !== "AGENCY") {
    return (
      <DashboardPageShell title="Agency Hub" subtitle="Agency workspaces are available on agency accounts." icon={Building2}>
        <div className="standard-card text-sm text-text-secondary">Upgrade to an agency account to manage client workspaces.</div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell
      title="Agency Hub"
      subtitle="Manage compliance, banner tokens, and white-label branding across client workspaces."
      icon={Building2}
      stats={[
        { label: "Client Sites", value: String(clients.length) },
        { label: "Average Score", value: `${averageScore}/100` },
        { label: "Open Issues", value: String(clients.reduce((sum, client) => sum + Number(client.openIssues || 0), 0)) },
        { label: "Monthly Revenue", value: revenueEstimate(clients.length) },
      ]}
    >
      {loading ? (
        <div className="standard-card text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading agency workspace...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="standard-card !transform-none hover:!translate-y-0">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-text-primary">Operational perspective</p>
                <p className="mt-1 text-sm text-text-secondary">Switch dashboard context without leaving the agency profile.</p>
              </div>
              <select
                value={selectedClient?.id || ""}
                onChange={(event) => setSelectedClientId(event.target.value)}
                className="text-input max-w-sm"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientCompanyName || client.domainName || client.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={createClient} className="standard-card !transform-none hover:!translate-y-0">
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
              <input
                value={newClient.clientCompanyName}
                onChange={(event) => setNewClient((current) => ({ ...current, clientCompanyName: event.target.value }))}
                placeholder="Client company"
                className="text-input"
              />
              <input
                value={newClient.domainName}
                onChange={(event) => setNewClient((current) => ({ ...current, domainName: event.target.value }))}
                placeholder="client.com"
                className="text-input"
              />
              <button type="submit" disabled={actionLoading === "create"} className="btn-primary justify-center">
                {actionLoading === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add client
              </button>
            </div>
          </form>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-4">
              {clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => setSelectedClientId(client.id)}
                  className={`rounded-2xl border bg-surface-card p-5 text-left shadow-card transition ${
                    selectedClient?.id === client.id ? "border-primary" : "border-border-light hover:border-border-medium"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-text-primary">{client.clientCompanyName || "Client Workspace"}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                        {client.domainName || "No domain"}
                        {client.domainName && <ExternalLink className="h-3.5 w-3.5" />}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-bold ${scoreClass(client.complianceScore || 0)}`}>
                      {Math.round(client.complianceScore || 0)}
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs md:grid-cols-5">
                    <Metric label="Setup" value={client.websiteId ? "Started" : "Needed"} />
                    <Metric label="Monitoring" value={client.bannerActive ? "Active" : "Draft"} />
                    <Metric label="Certificate" value={client.websiteId ? "Ready" : "Pending"} />
                    <Metric label="Report" value={client.websiteId ? "Build" : "No site"} />
                    <Metric label="Billing" value="Agency" />
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-text-primary">White-Label Branding</h2>
              </div>
              {selectedClient ? (
                <div className="mt-5 space-y-4">
                  <label className="flex items-start justify-between gap-4 rounded-xl border border-border-light bg-background-secondary p-4">
                    <span>
                      <span className="block text-sm font-semibold text-text-primary">Hide powered-by badge</span>
                      <span className="mt-1 block text-xs text-text-secondary">Removes public Zenvyra branding from banners.</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={!!selectedClient.branding?.hidePoweredByBadge}
                      onChange={(event) => updateSelectedBranding({ hidePoweredByBadge: event.target.checked })}
                      className="mt-1 h-5 w-5 rounded text-primary"
                    />
                  </label>

                  <div>
                    <label className="text-sm font-semibold text-text-primary">Primary brand color</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="color"
                        value={selectedClient.branding?.primaryBrandColor || "#f59e0b"}
                        onChange={(event) => updateSelectedBranding({ primaryBrandColor: event.target.value })}
                        className="h-11 w-12 rounded-lg border border-border-medium"
                      />
                      <input
                        value={selectedClient.branding?.primaryBrandColor || ""}
                        onChange={(event) => updateSelectedBranding({ primaryBrandColor: event.target.value })}
                        placeholder="#f59e0b"
                        className="text-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-text-primary">Custom privacy policy URL</label>
                    <input
                      value={selectedClient.branding?.customPrivacyPolicyUrl || ""}
                      onChange={(event) => updateSelectedBranding({ customPrivacyPolicyUrl: event.target.value })}
                      placeholder="https://client.com/privacy"
                      className="text-input mt-2"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={saveSelectedClient}
                    disabled={saving}
                    className="btn-primary w-full justify-center"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Client Branding
                  </button>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => runClientAction("proof-pack")}
                      disabled={actionLoading === "proof-pack"}
                      className="btn-secondary justify-center"
                    >
                      {actionLoading === "proof-pack" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                      Proof pack
                    </button>
                    <button
                      type="button"
                      onClick={() => runClientAction("issue-certificate")}
                      disabled={actionLoading === "issue-certificate"}
                      className="btn-secondary justify-center"
                    >
                      {actionLoading === "issue-certificate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      Issue certificate
                    </button>
                    <button
                      type="button"
                      onClick={() => runClientAction("send-report")}
                      disabled={actionLoading === "send-report"}
                      className="btn-secondary justify-center"
                    >
                      {actionLoading === "send-report" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      Send report
                    </button>
                  </div>

                  <div className="rounded-xl border border-border-light bg-background-secondary p-4">
                    <p className="text-sm font-semibold text-text-primary">Agency revenue calculator</p>
                    <p className="mt-2 text-2xl font-black text-text-primary">{revenueEstimate(clients.length)}</p>
                    <p className="mt-1 text-xs text-text-secondary">Estimated at $99/client/month for monitoring and monthly proof packs.</p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm text-text-secondary">No agency client sites configured yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}

function revenueEstimate(clientCount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(clientCount * 99);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background-secondary p-3">
      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">{label}</p>
      <p className="mt-1 font-bold text-text-primary">{value}</p>
    </div>
  );
}

function actionSuccessLabel(kind: "proof-pack" | "send-report" | "issue-certificate") {
  if (kind === "proof-pack") return "Proof pack generated.";
  if (kind === "issue-certificate") return "Certificate issued.";
  return "Monthly report queued.";
}

function scoreClass(score: number) {
  if (score >= 80) return "bg-status-success/10 text-status-success";
  if (score >= 60) return "bg-status-warning/10 text-status-warning";
  return "bg-status-error/10 text-status-error";
}
