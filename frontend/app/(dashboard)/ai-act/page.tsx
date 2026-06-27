"use client";

import type { ReactNode } from "react";
import { FormEvent, useEffect, useState } from "react";
import { AlertTriangle, Bot, FileSearch, Loader2, Pencil, Plus, ShieldAlert, X } from "lucide-react";
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
  transparencyNoticePublished?: boolean;
  technicalDocumentationReady?: boolean;
  logsEvidenceRetained?: boolean;
  monitoringEnabled?: boolean;
  healthcareUse?: boolean;
  hiringUse?: boolean;
  financeUse?: boolean;
  educationUse?: boolean;
  childrenUse?: boolean;
  biometricUse?: boolean;
  governmentUse?: boolean;
  criticalInfrastructureUse?: boolean;
  prohibitedUse?: boolean;
};

type Readiness = Record<string, any>;

type AiSystemForm = {
  systemName: string;
  provider: string;
  useCase: string;
  euUsersAffected: boolean;
  userFacingAiInteraction: boolean;
  automatedDecisionMaking: boolean;
  humanOversight: boolean;
  transparencyNoticePublished: boolean;
  technicalDocumentationReady: boolean;
  logsEvidenceRetained: boolean;
  monitoringEnabled: boolean;
  healthcareUse: boolean;
  hiringUse: boolean;
  financeUse: boolean;
  educationUse: boolean;
  childrenUse: boolean;
  biometricUse: boolean;
  governmentUse: boolean;
  criticalInfrastructureUse: boolean;
  prohibitedUse: boolean;
};

const emptyForm = (): AiSystemForm => ({
  systemName: "",
  provider: "",
  useCase: "",
  euUsersAffected: true,
  userFacingAiInteraction: true,
  automatedDecisionMaking: false,
  humanOversight: false,
  transparencyNoticePublished: false,
  technicalDocumentationReady: false,
  logsEvidenceRetained: false,
  monitoringEnabled: false,
  healthcareUse: false,
  hiringUse: false,
  financeUse: false,
  educationUse: false,
  childrenUse: false,
  biometricUse: false,
  governmentUse: false,
  criticalInfrastructureUse: false,
  prohibitedUse: false,
});

const formFromSystem = (system: AiSystem): AiSystemForm => ({
  systemName: system.systemName || "",
  provider: system.provider || "",
  useCase: system.useCase || "",
  euUsersAffected: system.euUsersAffected ?? true,
  userFacingAiInteraction: system.userFacingAiInteraction ?? true,
  automatedDecisionMaking: system.automatedDecisionMaking ?? false,
  humanOversight: system.humanOversight ?? false,
  transparencyNoticePublished: system.transparencyNoticePublished ?? false,
  technicalDocumentationReady: system.technicalDocumentationReady ?? false,
  logsEvidenceRetained: system.logsEvidenceRetained ?? false,
  monitoringEnabled: system.monitoringEnabled ?? false,
  healthcareUse: system.healthcareUse ?? false,
  hiringUse: system.hiringUse ?? false,
  financeUse: system.financeUse ?? false,
  educationUse: system.educationUse ?? false,
  childrenUse: system.childrenUse ?? false,
  biometricUse: system.biometricUse ?? false,
  governmentUse: system.governmentUse ?? false,
  criticalInfrastructureUse: system.criticalInfrastructureUse ?? false,
  prohibitedUse: system.prohibitedUse ?? false,
});

export default function AiActPage() {
  const [systems, setSystems] = useState<AiSystem[]>([]);
  const [readiness, setReadiness] = useState<Readiness>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSystemId, setEditingSystemId] = useState<string | null>(null);
  const [form, setForm] = useState<AiSystemForm>(() => emptyForm());

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

  const resetForm = () => {
    setForm(emptyForm());
    setEditingSystemId(null);
  };

  const startEdit = (system: AiSystem) => {
    setForm(formFromSystem(system));
    setEditingSystemId(system.id);
  };

  const saveSystem = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.systemName.trim()) {
      toast.error("Add an AI system name.");
      return;
    }
    setSaving(true);
    try {
      const isEditing = Boolean(editingSystemId);
      const payload = {
        ...form,
        modelProviderType: form.provider ? "third-party provider" : "unknown",
        dataCategoriesSentToAi: ["user messages", "support context"],
      };
      const response = isEditing
        ? await api.put<AiSystem>(`/ai-act/systems/${editingSystemId}`, payload)
        : await api.post<AiSystem>("/ai-act/systems", payload);
      setSystems((current) => isEditing
        ? current.map((system) => (system.id === editingSystemId ? response.data : system))
        : [response.data, ...current]);
      resetForm();
      await load();
      toast.success(isEditing ? "AI system updated." : "AI system inventoried.");
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
          <form onSubmit={saveSystem} className="standard-card space-y-4 hover:!translate-y-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {editingSystemId ? <Pencil className="h-5 w-5 text-accent" /> : <Plus className="h-5 w-5 text-accent" />}
                <h2 className="font-bold text-text-primary">{editingSystemId ? "Edit AI System" : "Add AI System"}</h2>
              </div>
              {editingSystemId && (
                <button type="button" onClick={resetForm} className="btn-secondary !px-3 !py-2 text-xs">
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
            <input className="text-input" placeholder="System name" value={form.systemName} onChange={(event) => setForm({ ...form, systemName: event.target.value })} />
            <input className="text-input" placeholder="Provider, e.g. OpenAI, Anthropic, Intercom" value={form.provider} onChange={(event) => setForm({ ...form, provider: event.target.value })} />
            <textarea className="text-input min-h-28" placeholder="Use case" value={form.useCase} onChange={(event) => setForm({ ...form, useCase: event.target.value })} />
            <FieldGroup title="AI Act exposure">
              <Toggle label="EU users affected" checked={form.euUsersAffected} onChange={(value) => setForm({ ...form, euUsersAffected: value })} />
              <Toggle label="User-facing AI interaction" checked={form.userFacingAiInteraction} onChange={(value) => setForm({ ...form, userFacingAiInteraction: value })} />
              <Toggle label="Automated decision-making" checked={form.automatedDecisionMaking} onChange={(value) => setForm({ ...form, automatedDecisionMaking: value })} />
              <Toggle label="Potentially prohibited use" checked={form.prohibitedUse} onChange={(value) => setForm({ ...form, prohibitedUse: value })} />
            </FieldGroup>
            <FieldGroup title="High-risk domains">
              <Toggle label="Healthcare" checked={form.healthcareUse} onChange={(value) => setForm({ ...form, healthcareUse: value })} />
              <Toggle label="Hiring or employment" checked={form.hiringUse} onChange={(value) => setForm({ ...form, hiringUse: value })} />
              <Toggle label="Finance or credit" checked={form.financeUse} onChange={(value) => setForm({ ...form, financeUse: value })} />
              <Toggle label="Education" checked={form.educationUse} onChange={(value) => setForm({ ...form, educationUse: value })} />
              <Toggle label="Children affected" checked={form.childrenUse} onChange={(value) => setForm({ ...form, childrenUse: value })} />
              <Toggle label="Biometric use" checked={form.biometricUse} onChange={(value) => setForm({ ...form, biometricUse: value })} />
              <Toggle label="Government services" checked={form.governmentUse} onChange={(value) => setForm({ ...form, governmentUse: value })} />
              <Toggle label="Critical infrastructure" checked={form.criticalInfrastructureUse} onChange={(value) => setForm({ ...form, criticalInfrastructureUse: value })} />
            </FieldGroup>
            <FieldGroup title="Evidence readiness">
              <Toggle label="Human oversight documented" checked={form.humanOversight} onChange={(value) => setForm({ ...form, humanOversight: value })} />
              <Toggle label="Transparency notice published" checked={form.transparencyNoticePublished} onChange={(value) => setForm({ ...form, transparencyNoticePublished: value })} />
              <Toggle label="Technical documentation ready" checked={form.technicalDocumentationReady} onChange={(value) => setForm({ ...form, technicalDocumentationReady: value })} />
              <Toggle label="Logs and evidence retained" checked={form.logsEvidenceRetained} onChange={(value) => setForm({ ...form, logsEvidenceRetained: value })} />
              <Toggle label="Monitoring enabled" checked={form.monitoringEnabled} onChange={(value) => setForm({ ...form, monitoringEnabled: value })} />
            </FieldGroup>
            <button className="btn-primary w-full justify-center" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingSystemId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingSystemId ? "Save changes" : "Save inventory"}
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
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => startEdit(system)} className="btn-secondary justify-center">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button type="button" onClick={() => assess(system.id)} className="btn-secondary justify-center">
                        <FileSearch className="h-4 w-4" />
                        Assess
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    <Mini label="EU users" value={system.euUsersAffected ? "Yes" : "No"} />
                    <Mini label="User-facing" value={system.userFacingAiInteraction ? "Yes" : "No"} />
                    <Mini label="Automated" value={system.automatedDecisionMaking ? "Yes" : "No"} />
                    <Mini label="Oversight" value={system.humanOversight ? "Ready" : "Gap"} />
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-4">
                    <Mini label="Notice" value={system.transparencyNoticePublished ? "Published" : "Needed"} />
                    <Mini label="Docs" value={system.technicalDocumentationReady ? "Ready" : "Gap"} />
                    <Mini label="Evidence" value={system.logsEvidenceRetained ? "Retained" : "Gap"} />
                    <Mini label="Monitoring" value={system.monitoringEnabled ? "On" : "Off"} />
                  </div>
                  <RiskSignals system={system} />
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

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-xs font-bold uppercase text-text-tertiary">{title}</legend>
      <div className="grid gap-2">{children}</div>
    </fieldset>
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

function RiskSignals({ system }: { system: AiSystem }) {
  const signals = [
    system.prohibitedUse && "Prohibited-use review",
    system.healthcareUse && "Healthcare",
    system.hiringUse && "Hiring",
    system.financeUse && "Finance",
    system.educationUse && "Education",
    system.childrenUse && "Children",
    system.biometricUse && "Biometric",
    system.governmentUse && "Government",
    system.criticalInfrastructureUse && "Critical infrastructure",
  ].filter(Boolean);

  if (signals.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {signals.map((signal) => (
        <span key={String(signal)} className="rounded-full border border-status-warning/30 bg-status-warning/10 px-3 py-1 text-xs font-bold text-status-warning">
          {signal}
        </span>
      ))}
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
