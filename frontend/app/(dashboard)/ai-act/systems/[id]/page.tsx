"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  Bot,
  ChevronLeft,
  ClipboardList,
  Edit3,
  FileSearch,
  History,
  Loader2,
  Play,
  Save,
  ShieldAlert,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import api from "@/lib/api";

type ReleaseStatus = "DRAFT" | "PILOT" | "PRODUCTION" | "RETIRED";

type AiSystemDetail = {
  id: string;
  systemName?: string;
  purpose?: string;
  provider?: string;
  modelName?: string;
  modelProviderVersion?: string;
  modelProviderType?: string;
  useCase?: string;
  deploymentContext?: string;
  customerFacing?: boolean;
  trainingOrFineTuning?: boolean;
  decisionImpactLevel?: string;
  releaseStatus?: ReleaseStatus;
  humanOversightOwner?: string;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  dataCategoriesSentToAi?: string[];
  countries?: string[];
  euUsersAffected?: boolean;
  userFacingAiInteraction?: boolean;
  automatedDecisionMaking?: boolean;
  humanOversight?: boolean;
  transparencyNoticePublished?: boolean;
  technicalDocumentationReady?: boolean;
  riskAssessmentCompleted?: boolean;
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
  riskCategory?: string;
  readinessScore?: number;
  createdAt?: string;
  updatedAt?: string;
};

type AiActAssessmentDetail = {
  id?: string;
  systemId?: string;
  systemName?: string;
  riskCategory?: string;
  readinessScore?: number;
  confidence?: number;
  counselReviewWarning?: string;
  riskClassificationRationale?: string;
  riskLevelExplanation?: string;
  confidenceExplanation?: string;
  applicableObligations?: string[];
  annexIIIUseCases?: string[];
  requiredTransparencyNotices?: string[];
  humanOversightGaps?: string[];
  documentationGaps?: string[];
  dataHandlingGaps?: string[];
  userDisclosureGaps?: string[];
  monitoringGaps?: string[];
  aiLiteracyGaps?: string[];
  gpaiProviderDocumentationGaps?: string[];
  conformityAssessmentGaps?: string[];
  evidenceItems?: string[];
  nextActions?: string[];
  assessedAt?: string;
};

type EvidenceItem = {
  id: string;
  type?: string;
  status?: string;
  title?: string;
  owner?: string;
  dueDate?: string;
  uploadedAt?: string;
};

type AuditLogEntry = {
  id: string;
  eventType?: string;
  actor?: string;
  timestamp?: string;
  eventData?: Record<string, unknown>;
};

const RELEASE_STATUSES: ReleaseStatus[] = ["DRAFT", "PILOT", "PRODUCTION", "RETIRED"];
const IMPACT_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const MODEL_PROVIDER_TYPES = ["first-party model", "third-party provider", "open-source model", "unknown"];

const DEFAULT_FORM = {
  systemName: "",
  purpose: "",
  provider: "",
  modelName: "",
  modelProviderVersion: "",
  modelProviderType: "third-party provider",
  useCase: "",
  deploymentContext: "",
  customerFacing: false,
  trainingOrFineTuning: false,
  decisionImpactLevel: "MEDIUM",
  releaseStatus: "DRAFT" as ReleaseStatus,
  humanOversightOwner: "",
  lastReviewedAt: "",
  nextReviewAt: "",
  dataCategoriesSentToAi: "",
  countries: "",
  euUsersAffected: false,
  userFacingAiInteraction: false,
  automatedDecisionMaking: false,
  humanOversight: false,
  transparencyNoticePublished: false,
  technicalDocumentationReady: false,
  riskAssessmentCompleted: false,
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
};

export default function AiSystemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const systemId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);

  const [system, setSystem] = useState<AiSystemDetail | null>(null);
  const [latestAssessment, setLatestAssessment] = useState<AiActAssessmentDetail | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [audit, setAudit] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [form, setForm] = useState<typeof DEFAULT_FORM>(DEFAULT_FORM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = async () => {
    if (!systemId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const systemResponse = await api.get<AiSystemDetail>(`/ai-act/systems/${systemId}`);
      setSystem(systemResponse.data || null);

      try {
        const readinessResponse = await api.get<{ latestAssessments?: AiActAssessmentDetail[] }>(`/ai-act/readiness`);
        const allAssessments = readinessResponse.data?.latestAssessments || [];
        const matched = allAssessments.find((assessment) => assessment.systemId === systemId) || null;
        let resolvedAssessment = matched;
        if (!resolvedAssessment) {
          try {
            const fallback = await api.get<AiActAssessmentDetail>(`/ai-act/systems/${systemId}/assess`);
            resolvedAssessment = fallback.data;
          } catch {
            resolvedAssessment = null;
          }
        }
        setLatestAssessment(resolvedAssessment);
      } catch (innerError: any) {
        setLatestAssessment(null);
      }

      try {
        const evidenceResponse = await api.get<EvidenceItem[]>(`/ai-act/evidence/system/${systemId}`);
        setEvidence(evidenceResponse.data || []);
      } catch (innerError: any) {
        setEvidence([]);
      }

      try {
        const auditResponse = await api.get<AuditLogEntry[]>(`/ai-act/audit/system/${systemId}`);
        setAudit(auditResponse.data || []);
      } catch (innerError: any) {
        setAudit([]);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setNotFound(true);
      } else {
        setErrorMessage(error?.response?.data?.message || "Unable to load AI system");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemId]);

  const startEdit = () => {
    if (!system) return;
    setForm({
      systemName: system.systemName || "",
      purpose: system.purpose || "",
      provider: system.provider || "",
      modelName: system.modelName || "",
      modelProviderVersion: system.modelProviderVersion || "",
      modelProviderType: system.modelProviderType || "third-party provider",
      useCase: system.useCase || "",
      deploymentContext: system.deploymentContext || "",
      customerFacing: Boolean(system.customerFacing),
      trainingOrFineTuning: Boolean(system.trainingOrFineTuning),
      decisionImpactLevel: system.decisionImpactLevel || "MEDIUM",
      releaseStatus: (system.releaseStatus || "DRAFT") as ReleaseStatus,
      humanOversightOwner: system.humanOversightOwner || "",
      lastReviewedAt: toDateTimeInput(system.lastReviewedAt),
      nextReviewAt: toDateTimeInput(system.nextReviewAt),
      dataCategoriesSentToAi: (system.dataCategoriesSentToAi || []).join(", "),
      countries: (system.countries || []).join(", "),
      euUsersAffected: Boolean(system.euUsersAffected),
      userFacingAiInteraction: Boolean(system.userFacingAiInteraction),
      automatedDecisionMaking: Boolean(system.automatedDecisionMaking),
      humanOversight: Boolean(system.humanOversight),
      transparencyNoticePublished: Boolean(system.transparencyNoticePublished),
      technicalDocumentationReady: Boolean(system.technicalDocumentationReady),
      riskAssessmentCompleted: Boolean(system.riskAssessmentCompleted),
      logsEvidenceRetained: Boolean(system.logsEvidenceRetained),
      monitoringEnabled: Boolean(system.monitoringEnabled),
      healthcareUse: Boolean(system.healthcareUse),
      hiringUse: Boolean(system.hiringUse),
      financeUse: Boolean(system.financeUse),
      educationUse: Boolean(system.educationUse),
      childrenUse: Boolean(system.childrenUse),
      biometricUse: Boolean(system.biometricUse),
      governmentUse: Boolean(system.governmentUse),
      criticalInfrastructureUse: Boolean(system.criticalInfrastructureUse),
      prohibitedUse: Boolean(system.prohibitedUse),
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!systemId) return;
    if (!form.systemName.trim()) {
      toast.error("System name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = buildUpdatePayload(form);
      const response = await api.put<AiSystemDetail>(`/ai-act/systems/${systemId}`, payload);
      setSystem(response.data || null);
      setIsEditing(false);
      toast.success("AI system updated.");
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to update AI system");
    } finally {
      setSaving(false);
    }
  };

  const runAssessment = async () => {
    if (!systemId) return;
    setAssessing(true);
    try {
      const response = await api.post<AiActAssessmentDetail>(`/ai-act/systems/${systemId}/assess`);
      setLatestAssessment(response.data || null);
      toast.success("AI Act readiness assessment generated.");
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to assess system");
    } finally {
      setAssessing(false);
    }
  };

  const archiveSystem = async () => {
    if (!systemId) return;
    if (typeof window !== "undefined" && !window.confirm("Archive this AI system? It will be marked as RETIRED.")) {
      return;
    }
    setArchiving(true);
    try {
      const payload = {
        ...(system || {}),
        releaseStatus: "RETIRED",
        systemName: system?.systemName || "",
      };
      await api.put<AiSystemDetail>(`/ai-act/systems/${systemId}`, payload);
      toast.success("AI system archived.");
      router.push("/ai-act");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to archive system");
      setArchiving(false);
    }
  };

  const gapGroups = useMemo(() => {
    if (!latestAssessment) return [];
    return [
      { title: "Human oversight", rows: latestAssessment.humanOversightGaps || [] },
      { title: "Documentation", rows: latestAssessment.documentationGaps || [] },
      { title: "Data handling", rows: latestAssessment.dataHandlingGaps || [] },
      { title: "User disclosure", rows: latestAssessment.userDisclosureGaps || [] },
      { title: "Monitoring", rows: latestAssessment.monitoringGaps || [] },
      { title: "GPAI", rows: latestAssessment.gpaiProviderDocumentationGaps || [] },
      { title: "Conformity", rows: latestAssessment.conformityAssessmentGaps || [] },
    ];
  }, [latestAssessment]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-text-secondary">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading AI system details...
      </div>
    );
  }

  if (notFound) {
    return (
      <DashboardPageShell
        title="System not found"
        subtitle="The AI system you are looking for is unavailable or has been removed."
        icon={Bot}
        actions={[{ label: "Back to AI Act", href: "/ai-act" }]}
      >
        <div className="standard-card text-sm text-text-secondary">
          <p>Confirm the system identifier or return to the AI Act workspace to pick another system.</p>
          <Link href="/ai-act" className="btn-primary mt-4 inline-flex w-auto !px-5 !py-2">
            <ArrowLeft className="h-4 w-4" />
            Back to AI Act
          </Link>
        </div>
      </DashboardPageShell>
    );
  }

  if (!system) {
    return (
      <DashboardPageShell title="AI System" subtitle="System details" icon={Bot}>
        <div className="rounded-2xl border border-status-error/30 bg-status-error/10 p-6 text-status-error">
          {errorMessage || "AI system could not be loaded."}
          <Link href="/ai-act" className="btn-secondary mt-4 inline-flex w-auto !px-5 !py-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </DashboardPageShell>
    );
  }

  const releaseStatusLabel = (system.releaseStatus || "DRAFT").replaceAll("_", " ");

  return (
    <DashboardPageShell
      title={system.systemName || "AI System"}
      subtitle={`${system.provider || "Provider not set"} - ${system.useCase || "Use case not set"}`}
      icon={Bot}
      actions={[
        { label: "Back", href: "/ai-act" },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="standard-card hover:!translate-y-0">
          {!isEditing ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">System Identity</h2>
                  <p className="mt-1 text-xs text-text-secondary">Captured fields and deployment context.</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${releaseBadgeClass(system.releaseStatus)}`}>
                  {releaseStatusLabel}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Mini label="System name" value={system.systemName || "Not set"} />
                <Mini label="Provider" value={system.provider || "Not set"} />
                <Mini label="Model" value={system.modelName || "Not set"} />
                <Mini label="Model version" value={system.modelProviderVersion || "Not set"} />
                <Mini label="Model type" value={system.modelProviderType || "Not set"} />
                <Mini label="Use case" value={system.useCase || "Not set"} />
                <Mini label="Deployment" value={system.deploymentContext || "Not set"} />
                <Mini label="Decision impact" value={system.decisionImpactLevel || "Not set"} />
                <Mini label="Customer-facing" value={system.customerFacing ? "Yes" : "No"} />
                <Mini label="Training or fine-tuning" value={system.trainingOrFineTuning ? "Yes" : "No"} />
                <Mini label="Oversight owner" value={system.humanOversightOwner || "Not assigned"} />
                <Mini label="Last reviewed" value={formatDateTime(system.lastReviewedAt)} />
                <Mini label="Next review" value={formatDateTime(system.nextReviewAt)} />
                <Mini label="Purpose" value={system.purpose || "Not set"} />
                <Mini label="Data categories" value={(system.dataCategoriesSentToAi || []).join(", ") || "Not set"} />
                <Mini label="Countries" value={(system.countries || []).join(", ") || "Not set"} />
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={startEdit} className="btn-primary !px-4 !py-2 text-sm">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
                <button onClick={runAssessment} disabled={assessing} className="btn-secondary !px-4 !py-2 text-sm">
                  {assessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  Run assessment
                </button>
                <button
                  onClick={archiveSystem}
                  disabled={archiving || system.releaseStatus === "RETIRED"}
                  className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-50"
                >
                  {archiving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                  {system.releaseStatus === "RETIRED" ? "Already retired" : "Archive"}
                </button>
                <Link href="/ai-act" className="btn-secondary !px-4 !py-2 text-sm">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Link>
              </div>

              <div className="rounded-lg border border-border-light bg-background-secondary p-4">
                <p className="text-xs font-bold uppercase text-text-tertiary">Existing flags</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Flag label="EU users affected" value={system.euUsersAffected} />
                  <Flag label="User-facing AI interaction" value={system.userFacingAiInteraction} />
                  <Flag label="Automated decision-making" value={system.automatedDecisionMaking} />
                  <Flag label="Human oversight" value={system.humanOversight} />
                  <Flag label="Transparency notice published" value={system.transparencyNoticePublished} />
                  <Flag label="Technical documentation ready" value={system.technicalDocumentationReady} />
                  <Flag label="Risk assessment completed" value={system.riskAssessmentCompleted} />
                  <Flag label="Logs and evidence retained" value={system.logsEvidenceRetained} />
                  <Flag label="Monitoring enabled" value={system.monitoringEnabled} />
                  <Flag label="Healthcare use" value={system.healthcareUse} />
                  <Flag label="Hiring use" value={system.hiringUse} />
                  <Flag label="Finance use" value={system.financeUse} />
                  <Flag label="Education use" value={system.educationUse} />
                  <Flag label="Children use" value={system.childrenUse} />
                  <Flag label="Biometric use" value={system.biometricUse} />
                  <Flag label="Government use" value={system.governmentUse} />
                  <Flag label="Critical infrastructure use" value={system.criticalInfrastructureUse} />
                  <Flag label="Prohibited use" value={system.prohibitedUse} />
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={saveEdit} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Edit System</h2>
                  <p className="mt-1 text-xs text-text-secondary">Update inventory fields. Required: system name.</p>
                </div>
                <button type="button" onClick={cancelEdit} className="rounded-lg p-2 text-text-secondary hover:bg-background-secondary">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="System name" value={form.systemName} onChange={(value) => setForm({ ...form, systemName: value })} required />
                <TextField label="Provider" value={form.provider} onChange={(value) => setForm({ ...form, provider: value })} />
                <TextField label="Purpose" value={form.purpose} onChange={(value) => setForm({ ...form, purpose: value })} />
                <TextField label="Use case" value={form.useCase} onChange={(value) => setForm({ ...form, useCase: value })} />
                <TextField label="Model name" value={form.modelName} onChange={(value) => setForm({ ...form, modelName: value })} />
                <TextField label="Model provider version" value={form.modelProviderVersion} onChange={(value) => setForm({ ...form, modelProviderVersion: value })} />
                <SelectField label="Model provider type" value={form.modelProviderType} options={MODEL_PROVIDER_TYPES} onChange={(value) => setForm({ ...form, modelProviderType: value })} />
                <TextField label="Deployment context" value={form.deploymentContext} onChange={(value) => setForm({ ...form, deploymentContext: value })} />
                <SelectField label="Decision impact level" value={form.decisionImpactLevel} options={IMPACT_LEVELS} onChange={(value) => setForm({ ...form, decisionImpactLevel: value })} />
                <SelectField label="Release status" value={form.releaseStatus} options={RELEASE_STATUSES} onChange={(value) => setForm({ ...form, releaseStatus: value as ReleaseStatus })} />
                <TextField label="Human oversight owner" value={form.humanOversightOwner} onChange={(value) => setForm({ ...form, humanOversightOwner: value })} />
                <TextField label="Data categories (comma-separated)" value={form.dataCategoriesSentToAi} onChange={(value) => setForm({ ...form, dataCategoriesSentToAi: value })} />
                <TextField label="Countries (comma-separated)" value={form.countries} onChange={(value) => setForm({ ...form, countries: value })} />
                <TextField label="Last reviewed at" type="datetime-local" value={form.lastReviewedAt} onChange={(value) => setForm({ ...form, lastReviewedAt: value })} />
                <TextField label="Next review at" type="datetime-local" value={form.nextReviewAt} onChange={(value) => setForm({ ...form, nextReviewAt: value })} />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Toggle label="Customer facing" checked={form.customerFacing} onChange={(value) => setForm({ ...form, customerFacing: value })} />
                <Toggle label="Training or fine-tuning" checked={form.trainingOrFineTuning} onChange={(value) => setForm({ ...form, trainingOrFineTuning: value })} />
                <Toggle label="EU users affected" checked={form.euUsersAffected} onChange={(value) => setForm({ ...form, euUsersAffected: value })} />
                <Toggle label="User-facing AI interaction" checked={form.userFacingAiInteraction} onChange={(value) => setForm({ ...form, userFacingAiInteraction: value })} />
                <Toggle label="Automated decision-making" checked={form.automatedDecisionMaking} onChange={(value) => setForm({ ...form, automatedDecisionMaking: value })} />
                <Toggle label="Human oversight" checked={form.humanOversight} onChange={(value) => setForm({ ...form, humanOversight: value })} />
                <Toggle label="Transparency notice published" checked={form.transparencyNoticePublished} onChange={(value) => setForm({ ...form, transparencyNoticePublished: value })} />
                <Toggle label="Technical documentation ready" checked={form.technicalDocumentationReady} onChange={(value) => setForm({ ...form, technicalDocumentationReady: value })} />
                <Toggle label="Risk assessment completed" checked={form.riskAssessmentCompleted} onChange={(value) => setForm({ ...form, riskAssessmentCompleted: value })} />
                <Toggle label="Logs and evidence retained" checked={form.logsEvidenceRetained} onChange={(value) => setForm({ ...form, logsEvidenceRetained: value })} />
                <Toggle label="Monitoring enabled" checked={form.monitoringEnabled} onChange={(value) => setForm({ ...form, monitoringEnabled: value })} />
                <Toggle label="Healthcare use" checked={form.healthcareUse} onChange={(value) => setForm({ ...form, healthcareUse: value })} />
                <Toggle label="Hiring use" checked={form.hiringUse} onChange={(value) => setForm({ ...form, hiringUse: value })} />
                <Toggle label="Finance use" checked={form.financeUse} onChange={(value) => setForm({ ...form, financeUse: value })} />
                <Toggle label="Education use" checked={form.educationUse} onChange={(value) => setForm({ ...form, educationUse: value })} />
                <Toggle label="Children use" checked={form.childrenUse} onChange={(value) => setForm({ ...form, childrenUse: value })} />
                <Toggle label="Biometric use" checked={form.biometricUse} onChange={(value) => setForm({ ...form, biometricUse: value })} />
                <Toggle label="Government use" checked={form.governmentUse} onChange={(value) => setForm({ ...form, governmentUse: value })} />
                <Toggle label="Critical infrastructure use" checked={form.criticalInfrastructureUse} onChange={(value) => setForm({ ...form, criticalInfrastructureUse: value })} />
                <Toggle label="Prohibited use" checked={form.prohibitedUse} onChange={(value) => setForm({ ...form, prohibitedUse: value })} />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button type="submit" disabled={saving} className="btn-primary !px-4 !py-2 text-sm">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save changes
                </button>
                <button type="button" onClick={cancelEdit} className="btn-secondary !px-4 !py-2 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <div className="space-y-4">
          <section className="standard-card hover:!translate-y-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                  <FileSearch className="h-5 w-5 text-accent" />
                  Latest assessment
                </h2>
                <p className="mt-1 text-xs text-text-secondary">Most recent readiness assessment for this system.</p>
              </div>
              {latestAssessment?.id ? (
                <Link href={`/ai-act/assessments/${latestAssessment.id}`} className="text-xs font-semibold text-accent hover:underline">
                  Open
                </Link>
              ) : null}
            </div>

            {!latestAssessment ? (
              <p className="mt-4 text-sm text-text-secondary">
                No assessment recorded yet. Run one to populate the risk classification, score, and gap lists.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Mini label="Risk category" value={String(latestAssessment.riskCategory || "review required").replaceAll("_", " ")} />
                  <Mini label="Readiness score" value={latestAssessment.readinessScore != null ? String(latestAssessment.readinessScore) : "n/a"} />
                  <Mini label="Confidence" value={latestAssessment.confidence != null ? `${Math.round(Number(latestAssessment.confidence) * 100)}%` : "n/a"} />
                </div>
                {latestAssessment.counselReviewWarning ? (
                  <div className="flex items-start gap-3 rounded-lg border border-status-warning/30 bg-status-warning/10 p-3 text-sm text-text-secondary">
                    <ShieldAlert className="mt-0.5 h-5 w-5 text-status-warning" />
                    <p>{latestAssessment.counselReviewWarning}</p>
                  </div>
                ) : null}
                {latestAssessment.riskClassificationRationale ? (
                  <div className="rounded-lg border border-border-light bg-background-secondary p-3 text-sm text-text-secondary">
                    <p className="text-xs font-bold uppercase text-text-tertiary">Rationale</p>
                    <p className="mt-2 leading-6">{latestAssessment.riskClassificationRationale}</p>
                  </div>
                ) : null}
                {(() => {
                  const obligations = latestAssessment.applicableObligations || [];
                  if (obligations.length === 0) return null;
                  return (
                    <div>
                      <p className="text-xs font-bold uppercase text-text-tertiary">Applicable obligations</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary">
                        {obligations.map((row) => (
                          <li key={row}>{row}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
              </div>
            )}
          </section>

          {latestAssessment ? (
            <section className="standard-card hover:!translate-y-0">
              <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
                Gap list by category
              </h2>
              <div className="mt-4 space-y-4">
                {gapGroups.map((group) => (
                  <GapList key={group.title} title={group.title} rows={group.rows} />
                ))}
                {(latestAssessment.nextActions || []).length > 0 ? <GapList title="Next actions" rows={latestAssessment.nextActions || []} /> : null}
              </div>
            </section>
          ) : null}

          <section className="standard-card hover:!translate-y-0">
            <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
              <ClipboardList className="h-5 w-5 text-accent" />
              Evidence items
            </h2>
            {evidence.length === 0 ? (
              <p className="mt-4 text-sm text-text-secondary">No evidence items linked to this system yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-light text-xs uppercase text-text-tertiary">
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Owner</th>
                      <th className="py-2 pr-4">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidence.map((item) => (
                      <tr key={item.id} className="border-b border-border-light/60 last:border-0">
                        <td className="py-2 pr-4 text-text-secondary">{item.type || "-"}</td>
                        <td className="py-2 pr-4 text-text-primary">{item.title || "-"}</td>
                        <td className="py-2 pr-4">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${evidenceStatusClass(item.status)}`}>
                            {item.status || "missing"}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">{item.owner || "-"}</td>
                        <td className="py-2 pr-4 text-text-secondary">{formatDate(item.dueDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="standard-card hover:!translate-y-0">
            <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
              <History className="h-5 w-5 text-text-secondary" />
              Audit log
            </h2>
            {audit.length === 0 ? (
              <p className="mt-4 text-sm text-text-secondary">No audit entries recorded yet for this system.</p>
            ) : (
              <ol className="mt-4 space-y-3">
                {audit.map((entry) => (
                  <li key={entry.id} className="rounded-lg border border-border-light bg-background-secondary p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-accent-light px-2 py-0.5 text-xs font-semibold text-accent">
                        {entry.eventType || "event"}
                      </span>
                      <span className="text-xs text-text-tertiary">{formatDateTime(entry.timestamp)}</span>
                    </div>
                    <p className="mt-2 text-sm text-text-primary">{entry.actor || "unknown actor"}</p>
                    {entry.eventData ? (
                      <pre className="mt-2 max-h-40 overflow-auto rounded bg-background-primary p-2 text-xs text-text-secondary">
                        {JSON.stringify(entry.eventData, null, 2)}
                      </pre>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </DashboardPageShell>
  );
}

function buildUpdatePayload(formState: typeof DEFAULT_FORM) {
  const splitList = (value: string) =>
    value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

  return {
    systemName: formState.systemName.trim(),
    purpose: formState.purpose.trim() || null,
    provider: formState.provider.trim() || null,
    modelName: formState.modelName.trim() || null,
    modelProviderType: formState.modelProviderType || null,
    modelProviderVersion: formState.modelProviderVersion.trim() || null,
    useCase: formState.useCase.trim() || null,
    deploymentContext: formState.deploymentContext.trim() || null,
    customerFacing: formState.customerFacing,
    trainingOrFineTuning: formState.trainingOrFineTuning,
    decisionImpactLevel: formState.decisionImpactLevel || null,
    releaseStatus: formState.releaseStatus,
    humanOversightOwner: formState.humanOversightOwner.trim() || null,
    lastReviewedAt: formState.lastReviewedAt ? toIsoString(formState.lastReviewedAt) : null,
    nextReviewAt: formState.nextReviewAt ? toIsoString(formState.nextReviewAt) : null,
    dataCategoriesSentToAi: splitList(formState.dataCategoriesSentToAi),
    countries: splitList(formState.countries),
    euUsersAffected: formState.euUsersAffected,
    userFacingAiInteraction: formState.userFacingAiInteraction,
    automatedDecisionMaking: formState.automatedDecisionMaking,
    humanOversight: formState.humanOversight,
    transparencyNoticePublished: formState.transparencyNoticePublished,
    technicalDocumentationReady: formState.technicalDocumentationReady,
    riskAssessmentCompleted: formState.riskAssessmentCompleted,
    logsEvidenceRetained: formState.logsEvidenceRetained,
    monitoringEnabled: formState.monitoringEnabled,
    healthcareUse: formState.healthcareUse,
    hiringUse: formState.hiringUse,
    financeUse: formState.financeUse,
    educationUse: formState.educationUse,
    childrenUse: formState.childrenUse,
    biometricUse: formState.biometricUse,
    governmentUse: formState.governmentUse,
    criticalInfrastructureUse: formState.criticalInfrastructureUse,
    prohibitedUse: formState.prohibitedUse,
  };
}

function toIsoString(value: string) {
  if (!value) return null;
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

function toDateTimeInput(value?: string) {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch {
    return "";
  }
}

function formatDateTime(value?: string) {
  if (!value) return "Not set";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  } catch {
    return value;
  }
}

function formatDate(value?: string) {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  } catch {
    return value;
  }
}

function releaseBadgeClass(status?: ReleaseStatus) {
  switch (status) {
    case "PRODUCTION":
      return "bg-status-success/15 text-status-success";
    case "PILOT":
      return "bg-status-info/15 text-status-info";
    case "RETIRED":
      return "bg-status-warning/15 text-status-warning";
    default:
      return "bg-background-secondary text-text-secondary";
  }
}

function evidenceStatusClass(status?: string) {
  switch (status) {
    case "APPROVED":
    case "UPLOADED":
      return "bg-status-success/15 text-status-success";
    case "REVIEWED":
      return "bg-status-info/15 text-status-info";
    case "REQUESTED":
      return "bg-status-warning/15 text-status-warning";
    case "STALE":
      return "bg-status-warning/20 text-status-warning";
    default:
      return "bg-background-secondary text-text-secondary";
  }
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border-light bg-background-secondary p-3 text-sm font-semibold text-text-primary">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 rounded text-accent" />
    </label>
  );
}

function Flag({ label, value }: { label: string; value?: boolean }) {
  const positive = Boolean(value);
  return (
    <div className="flex items-center justify-between rounded-lg bg-background-secondary px-3 py-2 text-xs text-text-primary">
      <span>{label}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${positive ? "bg-status-success/15 text-status-success" : "bg-status-warning/15 text-status-warning"}`}>
        {positive ? "Yes" : "No"}
      </span>
    </div>
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

function GapList({ title, rows }: { title: string; rows: string[] }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-bold uppercase text-text-tertiary">{title}</p>
      <ul className="mt-2 space-y-1">
        {rows.map((row) => (
          <li key={row} className="text-sm text-text-secondary">{row}</li>
        ))}
      </ul>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-semibold text-text-secondary">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="text-input mt-1"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-semibold text-text-secondary">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="text-input mt-1">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
