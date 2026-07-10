"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Bot, Download, Eye, FileSearch, Loader2, Plus, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import api from "@/lib/api";

type AiSystem = {
  id: string;
  systemName?: string;
  provider?: string;
  modelProviderType?: string;
  useCase?: string;
  euUsersAffected?: boolean;
  userFacingAiInteraction?: boolean;
  automatedDecisionMaking?: boolean;
  humanOversight?: boolean;
  logsEvidenceRetained?: boolean;
};

type Readiness = Record<string, any>;

export default function AiActPage() {
  const [systems, setSystems] = useState<AiSystem[]>([]);
  const [readiness, setReadiness] = useState<Readiness>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    systemName: "",
    provider: "",
    useCase: "",
    euUsersAffected: true,
    userFacingAiInteraction: true,
    automatedDecisionMaking: false,
    humanOversight: false,
    logsEvidenceRetained: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [systemsResult, readinessResult] = await Promise.all([
        api.get<AiSystem[]>("/ai-act/systems"),
        api.get<Readiness>("/ai-act/readiness"),
      ]);
      setSystems(systemsResult.data || []);
      setReadiness(readinessResult.data || {});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load AI Act readiness");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createSystem = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.systemName.trim()) {
      toast.error("Add an AI system name.");
      return;
    }
    setSaving(true);
    try {
      const response = await api.post<AiSystem>("/ai-act/systems", {
        ...form,
        modelProviderType: form.provider ? "third-party provider" : "unknown",
        dataCategoriesSentToAi: ["user messages", "support context"],
      });
      setSystems((current) => [response.data, ...current]);
      setForm((current) => ({ ...current, systemName: "", provider: "", useCase: "" }));
      await load();
      toast.success("AI system inventoried.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to save AI system");
    } finally {
      setSaving(false);
    }
  };

  const assess = async (systemId: string) => {
    try {
      await api.post(`/ai-act/systems/${systemId}/assess`);
      await load();
      toast.success("AI Act readiness assessment generated.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to assess system");
    }
  };

  const downloadReport = async (url: string, filename: string) => {
    try {
      const response = await api.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/markdown" });
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      toast.success("Report downloaded.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to download report");
    }
  };

  return (
    <DashboardPageShell
      title="EU AI Act Readiness"
      subtitle="Inventory AI systems, classify readiness indicators, and prepare evidence for counsel review."
      icon={Bot}
      stats={[
        { label: "AI Systems", value: String(readiness.aiSystemsInventoried || systems.length || 0) },
        { label: "High-Risk Flags", value: String(readiness.highRiskFlags || 0) },
        { label: "Transparency Notices", value: String(readiness.missingTransparencyNotices || 0) },
        { label: "Oversight Gaps", value: String(readiness.humanOversightGaps || 0) },
      ]}
    >
      {loading ? (
        <div className="standard-card text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading AI readiness...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={createSystem} className="standard-card space-y-4 hover:!translate-y-0">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-accent" />
              <h2 className="font-bold text-text-primary">Add AI System</h2>
            </div>
            <input className="text-input" placeholder="System name" value={form.systemName} onChange={(event) => setForm({ ...form, systemName: event.target.value })} />
            <input className="text-input" placeholder="Provider, e.g. OpenAI, Anthropic, Intercom" value={form.provider} onChange={(event) => setForm({ ...form, provider: event.target.value })} />
            <textarea className="text-input min-h-28" placeholder="Use case" value={form.useCase} onChange={(event) => setForm({ ...form, useCase: event.target.value })} />
            <Toggle label="EU users affected" checked={form.euUsersAffected} onChange={(value) => setForm({ ...form, euUsersAffected: value })} />
            <Toggle label="User-facing AI interaction" checked={form.userFacingAiInteraction} onChange={(value) => setForm({ ...form, userFacingAiInteraction: value })} />
            <Toggle label="Automated decision-making" checked={form.automatedDecisionMaking} onChange={(value) => setForm({ ...form, automatedDecisionMaking: value })} />
            <Toggle label="Human oversight documented" checked={form.humanOversight} onChange={(value) => setForm({ ...form, humanOversight: value })} />
            <Toggle label="Logs and evidence retained" checked={form.logsEvidenceRetained} onChange={(value) => setForm({ ...form, logsEvidenceRetained: value })} />
            <button className="btn-primary w-full justify-center" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Save inventory
            </button>
          </form>

          <div className="space-y-4">
            <div className="rounded-lg border border-status-warning/30 bg-status-warning/10 p-4 text-sm text-text-secondary">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-status-warning" />
                <p>{readiness.disclaimer || "AI Act readiness is evidence support, not legal advice."}</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Mini label="GPAI docs" value={String(readiness.gpaiProviderDocumentationStatus || "not started").replaceAll("_", " ")} />
              <Mini label="Public disclosure" value={String(readiness.publicAiDisclosureReadiness || "draft needed").replaceAll("_", " ")} />
            </div>
            {systems.length === 0 ? (
              <div className="standard-card text-sm text-text-secondary">No AI systems inventoried yet.</div>
            ) : (
              systems.map((system) => (
                <div key={system.id} className="standard-card hover:!translate-y-0">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-text-primary">{system.systemName}</p>
                      <p className="mt-1 text-sm text-text-secondary">{system.provider || "Provider not set"} - {system.useCase || "Use case not set"}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button onClick={() => assess(system.id)} className="btn-secondary justify-center">
                        <FileSearch className="h-4 w-4" />
                        Assess
                      </button>
                      <Link href={`/ai-act/systems/${system.id}`} className="btn-secondary justify-center">
                        <Eye className="h-4 w-4" />
                        View details
                      </Link>
                      <button onClick={() => downloadReport(`/ai-act/export/systems/${system.id}/system-card`, `${system.systemName}-system-card.md`)} className="btn-secondary justify-center">
                        <Download className="h-4 w-4" />
                        Card
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    <Mini label="EU users" value={system.euUsersAffected ? "Yes" : "No"} />
                    <Mini label="User-facing" value={system.userFacingAiInteraction ? "Yes" : "No"} />
                    <Mini label="Automated" value={system.automatedDecisionMaking ? "Yes" : "No"} />
                    <Mini label="Oversight" value={system.humanOversight ? "Ready" : "Gap"} />
                  </div>
                </div>
              ))
            )}
            <section className="standard-card hover:!translate-y-0">
              <h2 className="mb-4 font-bold text-text-primary">Disclosure Drafts</h2>
              <div className="space-y-3">
                <Draft label="AI usage disclosure" value={readiness.draftOutputs?.aiUsageDisclosureDraft} />
                <Draft label="Chatbot disclosure" value={readiness.draftOutputs?.chatbotDisclosureDraft} />
                <Draft label="Automated decision-making" value={readiness.draftOutputs?.automatedDecisionMakingDisclosureDraft} />
                <Draft label="Human review request" value={readiness.draftOutputs?.humanReviewRequestLanguage} />
              </div>
            </section>
            <section className="standard-card hover:!translate-y-0">
              <h2 className="mb-4 font-bold text-text-primary">Latest Assessment Gaps</h2>
              {(readiness.latestAssessments || []).length === 0 ? (
                <p className="text-sm text-text-secondary">Run an assessment to generate risk category, transparency, oversight, data handling, and documentation gaps.</p>
              ) : (
                <div className="space-y-3">
                  {(readiness.latestAssessments || []).map((assessment: any) => (
                    <div key={assessment.id || assessment.systemId} className="rounded-lg border border-border-light bg-background-secondary p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-text-primary">{String(assessment.riskCategory || "review required").replaceAll("_", " ")}</p>
                          <p className="mt-1 text-xs text-text-secondary">{assessment.counselReviewWarning}</p>
                        </div>
                        <AlertTriangle className="h-5 w-5 text-status-warning" />
                      </div>
                      <button
                        onClick={() => downloadReport(`/ai-act/export/assessments/${assessment.id}/summary`, `ai-act-assessment-${assessment.id?.slice(0, 8)}.md`)}
                        className="btn-secondary mt-3 w-full justify-center"
                      >
                        <Download className="h-4 w-4" />
                        Download assessment report
                      </button>
                      <GapList title="Transparency" rows={assessment.requiredTransparencyNotices || []} />
                      <GapList title="Human oversight" rows={assessment.humanOversightGaps || []} />
                      <GapList title="Documentation" rows={assessment.documentationGaps || []} />
                      <GapList title="Data handling" rows={assessment.dataHandlingGaps || []} />
                      <GapList title="Next actions" rows={assessment.nextActions || []} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border-light bg-background-secondary p-3 text-sm font-semibold text-text-primary">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 rounded text-accent" />
    </label>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background-secondary p-3">
      <p className="text-xs font-semibold uppercase text-text-tertiary">{label}</p>
      <p className="mt-1 font-bold text-text-primary">{value}</p>
    </div>
  );
}

function Draft({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-border-light bg-background-secondary p-3">
      <p className="text-xs font-bold uppercase text-text-tertiary">{label}</p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{value || "Draft pending."}</p>
    </div>
  );
}

function GapList({ title, rows }: { title: string; rows: string[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="text-xs font-bold uppercase text-text-tertiary">{title}</p>
      <ul className="mt-2 space-y-1">
        {rows.map((row) => (
          <li key={row} className="text-sm text-text-secondary">{row}</li>
        ))}
      </ul>
    </div>
  );
}
