"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  FileSearch,
  FileUp,
  Loader2,
  Plus,
  Share2,
  ShieldAlert,
  ZapOff,
} from "lucide-react";
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
  riskCategory?: string;
};

type AiActAssessment = {
  id: string;
  systemId: string;
  riskCategory: string;
  requiredTransparencyNotices?: string[];
  humanOversightGaps?: string[];
  documentationGaps?: string[];
  dataHandlingGaps?: string[];
  nextActions?: string[];
  counselReviewWarning?: string;
};

type Readiness = Record<string, any>;

type WorkflowStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function AiActPage() {
  const [systems, setSystems] = useState<AiSystem[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<Readiness>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState<WorkflowStep>(1);
  const [assessments, setAssessments] = useState<Record<string, AiActAssessment>>({});

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

  const selectedSystem = selectedSystemId ? systems.find((s) => s.id === selectedSystemId) : undefined;
  const selectedAssessment = selectedSystemId ? assessments[selectedSystemId] : undefined;

  // Calculate progress: 0-100%
  const getProgressPercentage = () => {
    if (!selectedSystem) return 0;
    let progress = 20; // Step 1: Created
    if (selectedAssessment) progress = 60; // Step 2-3: Classified & obligations reviewed
    if (selectedAssessment?.requiredTransparencyNotices?.length === 0 && 
        selectedAssessment?.humanOversightGaps?.length === 0 &&
        selectedAssessment?.documentationGaps?.length === 0 &&
        selectedAssessment?.dataHandlingGaps?.length === 0) progress = 80; // Step 4-5: Evidence addressed
    // Step 6: Published (checked via certificate endpoint)
    return progress;
  };

  const getProgressExplanation = () => {
    const progress = getProgressPercentage();
    if (progress === 0) return "Create a system to get started.";
    if (progress === 20) return `System created. Next: run assessment to classify risk.`;
    if (progress === 60) return `Risk classified. Next: review obligations and upload evidence to close gaps.`;
    if (progress === 80) return `All gaps addressed. Next: export proof pack and publish verification.`;
    return "Workflow complete. Your system is ready for counsel review.";
  };

  const getNextActions = (): string[] => {
    if (!selectedAssessment) return ["Run an assessment to classify risk"];
    const actions: string[] = [];
    if ((selectedAssessment.requiredTransparencyNotices?.length || 0) > 0) {
      actions.push(`Add ${selectedAssessment.requiredTransparencyNotices?.length} transparency notice(s)`);
    }
    if ((selectedAssessment.humanOversightGaps?.length || 0) > 0) {
      actions.push(`Document ${selectedAssessment.humanOversightGaps?.length} human oversight measure(s)`);
    }
    if ((selectedAssessment.documentationGaps?.length || 0) > 0) {
      actions.push(`Create ${selectedAssessment.documentationGaps?.length} documentation file(s)`);
    }
    if ((selectedAssessment.dataHandlingGaps?.length || 0) > 0) {
      actions.push(`Update data handling for ${selectedAssessment.dataHandlingGaps?.length} gap(s)`);
    }
    if (actions.length === 0) {
      actions.push("Export proof pack", "Publish verification page");
    }
    return actions;
  };

  const load = async () => {
    setLoading(true);
    try {
      const [systemsResult, readinessResult] = await Promise.all([
        api.get<AiSystem[]>("/ai-act/systems"),
        api.get<Readiness>("/ai-act/readiness"),
      ]);
      const systemsList = systemsResult.data || [];
      setSystems(systemsList);
      setReadiness(readinessResult.data || {});

      // Auto-select first system if available
      if (systemsList.length > 0 && !selectedSystemId) {
        setSelectedSystemId(systemsList[0].id);
      }

      // Load assessments for all systems
      const assessmentMap: Record<string, AiActAssessment> = {};
      for (const system of systemsList) {
        try {
          const assessResult = await api.get<{ latestAssessments?: AiActAssessment[] }>(`/ai-act/systems/${system.id}/readiness`);
          if (assessResult.data?.latestAssessments?.[0]) {
            assessmentMap[system.id] = assessResult.data.latestAssessments[0];
          }
        } catch {
          // Skip individual assessment errors
        }
      }
      setAssessments(assessmentMap);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load AI Act readiness");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setSelectedSystemId(response.data.id);
      setForm((current) => ({ ...current, systemName: "", provider: "", useCase: "" }));
      setActiveStep(2); // Move to classification
      await load();
      toast.success("AI system inventoried. Now classify its risk.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to save AI system");
    } finally {
      setSaving(false);
    }
  };

  const assess = async (systemId: string) => {
    try {
      const response = await api.post<{ id: string }>(`/ai-act/systems/${systemId}/assess`);
      // Reload the assessment
      const assessResult = await api.get<{ latestAssessments?: AiActAssessment[] }>(`/ai-act/systems/${systemId}/readiness`);
      if (assessResult.data?.latestAssessments?.[0]) {
        setAssessments((current) => ({
          ...current,
          [systemId]: assessResult.data.latestAssessments![0],
        }));
        setActiveStep(3); // Move to obligations review
      }
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
      subtitle="Guided workflow to inventory systems, classify risk, and prepare evidence."
      icon={Bot}
      stats={[
        { label: "AI Systems", value: String(systems.length || 0) },
        { label: "Assessed", value: String(Object.keys(assessments).length || 0) },
        { label: "High-Risk", value: String(Object.values(assessments).filter((a) => a.riskCategory?.includes("HIGH")).length || 0) },
        { label: "Evidence Gaps", value: String(selectedAssessment?.requiredTransparencyNotices?.length || 0) },
      ]}
    >
      {loading ? (
        <div className="standard-card text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading AI readiness...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Disclaimer */}
          <div className="rounded-lg border border-status-warning/30 bg-status-warning/10 p-4 text-sm text-text-secondary">
            <div className="flex gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-status-warning" />
              <p>{readiness.disclaimer || "AI Act readiness is evidence support, not legal advice. Always consult legal counsel."}</p>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
            {/* System List Sidebar */}
            <div className="standard-card hover:!translate-y-0">
              <div className="mb-6">
                <h2 className="mb-3 font-bold text-text-primary text-sm md:text-base">AI Systems</h2>
                <button
                  onClick={() => setActiveStep(1)}
                  className="w-full justify-start rounded-lg border border-accent bg-accent/10 px-3 py-2 text-xs md:text-sm text-accent transition hover:bg-accent/20 truncate"
                >
                  <Plus className="mr-2 inline h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Add new system</span>
                  <span className="sm:hidden">Add system</span>
                </button>
              </div>
              {systems.length === 0 ? (
                <div className="text-center text-xs md:text-sm text-text-tertiary py-6">
                  <Bot className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No AI systems yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {systems.map((sys) => (
                    <button
                      key={sys.id}
                      onClick={() => {
                        setSelectedSystemId(sys.id);
                        setActiveStep(2);
                      }}
                      className={`w-full text-left rounded-lg border p-3 transition line-clamp-3 ${
                        selectedSystemId === sys.id
                          ? "border-accent bg-accent/10"
                          : "border-border-light bg-background-secondary hover:border-accent/50"
                      }`}
                    >
                      <p className="font-semibold text-text-primary text-xs md:text-sm truncate">{sys.systemName}</p>
                      <p className="text-xs text-text-tertiary mt-1 truncate">{sys.provider || "No provider"}</p>
                      {assessments[sys.id]?.riskCategory && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                            assessments[sys.id].riskCategory.includes("HIGH")
                              ? "bg-status-error/20 text-status-error"
                              : assessments[sys.id].riskCategory.includes("LIMITED")
                              ? "bg-status-warning/20 text-status-warning"
                              : "bg-status-success/20 text-status-success"
                          }`}>
                            {assessments[sys.id].riskCategory.split("_").pop()?.toLowerCase()}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Workflow Content */}
            <div>
              {/* Steps Progress */}
              <StepsProgress activeStep={activeStep} hasSystem={!!selectedSystem} hasAssessment={!!selectedAssessment} />

              {/* Progress Indicator */}
              {selectedSystem && (
                <ProgressIndicator
                  percentage={getProgressPercentage()}
                  explanation={getProgressExplanation()}
                />
              )}

              {/* Next Actions */}
              {selectedSystem && (
                <NextActionsPanel
                  actions={getNextActions()}
                />
              )}

              {/* Step Content */}
              <div className="mt-6 space-y-6">
                {activeStep === 1 && (
                  <Step1CreateSystem
                    form={form}
                    setForm={setForm}
                    saving={saving}
                    onSubmit={createSystem}
                  />
                )}
                {activeStep === 2 && selectedSystem && (
                  <Step2ClassifyRisk
                    system={selectedSystem}
                    assessment={selectedAssessment}
                    onAssess={() => assess(selectedSystem.id)}
                    onNext={() => setActiveStep(3)}
                  />
                )}
                {activeStep === 3 && selectedSystem && selectedAssessment && (
                  <Step3ReviewObligations
                    system={selectedSystem}
                    assessment={selectedAssessment}
                    onNext={() => setActiveStep(4)}
                  />
                )}
                {activeStep === 4 && selectedSystem && selectedAssessment && (
                  <Step4UploadEvidence
                    system={selectedSystem}
                    assessment={selectedAssessment}
                    onNext={() => setActiveStep(5)}
                  />
                )}
                {activeStep === 5 && selectedSystem && selectedAssessment && (
                  <Step5ExportProofPack
                    system={selectedSystem}
                    assessment={selectedAssessment}
                    onDownload={(url, filename) => downloadReport(url, filename)}
                    onNext={() => setActiveStep(6)}
                  />
                )}
                {activeStep === 6 && selectedSystem && (
                  <Step6PublishVerification
                    system={selectedSystem}
                  />
                )}
              </div>
            </div>
          </div>

          {/* High-Risk Systems Alert */}
          {Object.values(assessments).some((a) => a.riskCategory?.includes("HIGH")) && (
            <div className="rounded-lg border border-status-error/30 bg-status-error/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-status-error">High-Risk Systems Detected</h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {Object.values(assessments).filter((a) => a.riskCategory?.includes("HIGH")).length} systems require immediate attention and counsel review.
                  </p>
                </div>
                <AlertTriangle className="h-5 w-5 text-status-error flex-shrink-0 mt-1" />
              </div>
            </div>
          )}

          {/* Evidence Summary Table */}
          {selectedAssessment && (
            <EvidenceSummaryTable assessment={selectedAssessment} />
          )}
        </div>
      )}
    </DashboardPageShell>
  );
}

/* ============================================================================
   STEP COMPONENTS
   ============================================================================ */

function StepsProgress({
  activeStep,
  hasSystem,
  hasAssessment,
}: {
  activeStep: WorkflowStep;
  hasSystem: boolean;
  hasAssessment: boolean;
}) {
  const steps = [
    { num: 1 as const, label: "Create System", icon: Plus },
    { num: 2 as const, label: "Classify Risk", icon: FileSearch, disabled: !hasSystem },
    { num: 3 as const, label: "Review Obligations", icon: FileCheck, disabled: !hasAssessment },
    { num: 4 as const, label: "Upload Evidence", icon: FileUp, disabled: !hasAssessment },
    { num: 5 as const, label: "Export Proof Pack", icon: Download, disabled: !hasAssessment },
    { num: 6 as const, label: "Publish", icon: Share2, disabled: !hasAssessment },
  ];

  return (
    <div className="standard-card hover:!translate-y-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {steps.map((step, index) => {
          const isActive = step.num === activeStep;
          const isDone = step.num < activeStep;
          const isDisabled = "disabled" in step ? step.disabled : false;
          const Icon = step.icon;

          return (
            <div key={step.num} className="flex items-center gap-3">
              <button
                disabled={isDisabled}
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition ${
                  isActive
                    ? "bg-accent text-white"
                    : isDone
                    ? "bg-status-success/20 text-status-success"
                    : isDisabled
                    ? "bg-background-secondary text-text-tertiary cursor-not-allowed"
                    : "bg-background-secondary text-text-secondary hover:border-accent/50"
                }`}
              >
                {isDone ? <CheckCircle2 className="h-5 w-5" /> : step.num}
              </button>
              <div className="hidden md:block">
                <p className={`text-sm font-semibold ${isActive ? "text-accent" : "text-text-secondary"}`}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="hidden md:inline h-4 w-4 text-text-tertiary" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step1CreateSystem({
  form,
  setForm,
  saving,
  onSubmit,
}: {
  form: any;
  setForm: any;
  saving: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="standard-card hover:!translate-y-0">
        <h2 className="mb-4 font-bold text-text-primary flex items-center gap-2">
          <Plus className="h-5 w-5 text-accent" />
          Add a new AI system to your inventory
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">System name *</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g., Customer Support Bot"
              value={form.systemName}
              onChange={(e) => setForm({ ...form, systemName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">Provider</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g., OpenAI, Anthropic, custom"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">Use case</label>
            <textarea
              className="text-input min-h-24"
              placeholder="Describe what this system does..."
              value={form.useCase}
              onChange={(e) => setForm({ ...form, useCase: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="standard-card hover:!translate-y-0">
        <h3 className="mb-3 font-bold text-text-primary">Characteristics</h3>
        <div className="space-y-2">
          <Toggle
            label="EU users affected"
            checked={form.euUsersAffected}
            onChange={(value) => setForm({ ...form, euUsersAffected: value })}
          />
          <Toggle
            label="User-facing AI interaction"
            checked={form.userFacingAiInteraction}
            onChange={(value) => setForm({ ...form, userFacingAiInteraction: value })}
          />
          <Toggle
            label="Automated decision-making"
            checked={form.automatedDecisionMaking}
            onChange={(value) => setForm({ ...form, automatedDecisionMaking: value })}
          />
          <Toggle
            label="Human oversight documented"
            checked={form.humanOversight}
            onChange={(value) => setForm({ ...form, humanOversight: value })}
          />
          <Toggle
            label="Logs and evidence retained"
            checked={form.logsEvidenceRetained}
            onChange={(value) => setForm({ ...form, logsEvidenceRetained: value })}
          />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full justify-center" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Create system
      </button>
    </form>
  );
}

function Step2ClassifyRisk({
  system,
  assessment,
  onAssess,
  onNext,
}: {
  system: AiSystem;
  assessment?: AiActAssessment;
  onAssess: () => void;
  onNext: () => void;
}) {
  const [assessing, setAssessing] = useState(false);

  const handleAssess = async () => {
    setAssessing(true);
    await onAssess();
    setAssessing(false);
  };

  if (!assessment) {
    return (
      <div className="standard-card hover:!translate-y-0 space-y-4">
        <h2 className="font-bold text-text-primary flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-accent" />
          Step 2: Classify Risk
        </h2>
        <p className="text-text-secondary">
          Run an AI Act readiness assessment to automatically classify {system.systemName} into risk category (prohibited, high-risk, limited-risk, or minimal-risk).
        </p>
        <button onClick={handleAssess} className="btn-primary w-full justify-center" disabled={assessing}>
          {assessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
          Run assessment
        </button>
      </div>
    );
  }

  const riskLevel = assessment.riskCategory?.split("_")?.pop()?.toLowerCase() || "unknown";
  const riskColor =
    riskLevel === "prohibited"
      ? "text-status-error"
      : riskLevel === "high"
      ? "text-status-error"
      : riskLevel === "limited"
      ? "text-status-warning"
      : "text-status-success";

  return (
    <div className="space-y-4">
      <div className="standard-card hover:!translate-y-0">
        <h2 className="mb-4 font-bold text-text-primary flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-accent" />
          Step 2: Risk Classification
        </h2>
        <div className="rounded-lg bg-background-secondary p-4">
          <p className="text-sm text-text-secondary">Risk Category</p>
          <p className={`mt-2 text-2xl font-bold ${riskColor}`}>{riskLevel.toUpperCase()}</p>
          {assessment.counselReviewWarning && (
            <p className="mt-3 text-xs text-status-warning">{assessment.counselReviewWarning}</p>
          )}
        </div>
      </div>

      <button onClick={onNext} className="btn-secondary w-full justify-center">
        Next: Review obligations <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step3ReviewObligations({
  system,
  assessment,
  onNext,
}: {
  system: AiSystem;
  assessment: AiActAssessment;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="standard-card hover:!translate-y-0">
        <h2 className="mb-4 font-bold text-text-primary flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-accent" />
          Step 3: Review Obligations
        </h2>
        <div className="space-y-3">
          {assessment.requiredTransparencyNotices && assessment.requiredTransparencyNotices.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-2">Transparency Notices Required</h3>
              <ul className="space-y-1">
                {assessment.requiredTransparencyNotices.map((notice, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text-secondary">
                    <span className="text-accent">→</span>
                    {notice}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {assessment.humanOversightGaps && assessment.humanOversightGaps.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-2">Human Oversight Gaps</h3>
              <ul className="space-y-1">
                {assessment.humanOversightGaps.map((gap, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text-secondary">
                    <span className="text-accent">→</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button onClick={onNext} className="btn-secondary w-full justify-center">
        Next: Upload evidence <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step4UploadEvidence({
  system,
  assessment,
  onNext,
}: {
  system: AiSystem;
  assessment: AiActAssessment;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="standard-card hover:!translate-y-0">
        <h2 className="mb-4 font-bold text-text-primary flex items-center gap-2">
          <FileUp className="h-5 w-5 text-accent" />
          Step 4: Upload Evidence
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Link evidence items to gaps identified in your assessment. Evidence can include documentation, screenshots, logs, or policy records.
        </p>
        <div className="rounded-lg border border-border-light bg-background-secondary p-6 text-center">
          <FileUp className="mx-auto mb-2 h-8 w-8 text-text-tertiary" />
          <p className="text-sm font-semibold text-text-primary">Evidence upload coming soon</p>
          <p className="mt-1 text-xs text-text-tertiary">Visit system details to upload evidence files</p>
        </div>
      </div>

      <Link href={`/ai-act/systems/${system.id}`} className="btn-secondary w-full justify-center">
        <Eye className="h-4 w-4" />
        Go to system details
      </Link>

      <button onClick={onNext} className="btn-secondary w-full justify-center">
        Next: Export proof pack <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step5ExportProofPack({
  system,
  assessment,
  onDownload,
  onNext,
}: {
  system: AiSystem;
  assessment: AiActAssessment;
  onDownload: (url: string, filename: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="standard-card hover:!translate-y-0">
        <h2 className="mb-4 font-bold text-text-primary flex items-center gap-2">
          <Download className="h-5 w-5 text-accent" />
          Step 5: Export Proof Pack
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Download your comprehensive proof pack including system details, assessment results, and evidence summary for counsel review.
        </p>
        <div className="space-y-2">
          <button
            onClick={() =>
              onDownload(
                `/ai-act/export/systems/${system.id}/system-card`,
                `${system.systemName}-system-card.md`
              )
            }
            className="btn-secondary w-full justify-center"
          >
            <Download className="h-4 w-4" />
            System card
          </button>
          <button
            onClick={() =>
              onDownload(
                `/ai-act/export/assessments/${assessment.id}/summary`,
                `assessment-${assessment.id?.slice(0, 8)}.md`
              )
            }
            className="btn-secondary w-full justify-center"
          >
            <Download className="h-4 w-4" />
            Assessment summary
          </button>
        </div>
      </div>

      <button onClick={onNext} className="btn-secondary w-full justify-center">
        Next: Publish verification <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step6PublishVerification({ system }: { system: AiSystem }) {
  return (
    <div className="space-y-4">
      <div className="standard-card hover:!translate-y-0">
        <h2 className="mb-4 font-bold text-text-primary flex items-center gap-2">
          <Share2 className="h-5 w-5 text-accent" />
          Step 6: Publish Verification
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Create a shareable verification page for {system.systemName} to prove AI Act readiness to customers and partners.
        </p>
        <Link
          href={`/ai-act/systems/${system.id}?tab=publish`}
          className="btn-secondary w-full justify-center"
        >
          <Share2 className="h-4 w-4" />
          Go to publish page
        </Link>
      </div>

      <div className="rounded-lg border border-status-success/30 bg-status-success/10 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-status-success flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-status-success">Workflow complete!</h3>
            <p className="mt-1 text-sm text-text-secondary">
              You've documented your AI system's readiness. Keep evidence updated as systems evolve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceSummaryTable({ assessment }: { assessment: AiActAssessment }) {
  const allGaps = [
    ...(assessment.requiredTransparencyNotices || []).map((g) => ({ gap: g, type: "Transparency" })),
    ...(assessment.humanOversightGaps || []).map((g) => ({ gap: g, type: "Oversight" })),
    ...(assessment.documentationGaps || []).map((g) => ({ gap: g, type: "Documentation" })),
    ...(assessment.dataHandlingGaps || []).map((g) => ({ gap: g, type: "Data Handling" })),
  ];

  if (allGaps.length === 0) return null;

  return (
    <div className="standard-card hover:!translate-y-0">
      <h2 className="mb-4 font-bold text-text-primary">Evidence Gaps & Next Steps</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light">
              <th className="text-left py-2 px-2 font-bold text-text-secondary">#</th>
              <th className="text-left py-2 px-2 font-bold text-text-secondary">Type</th>
              <th className="text-left py-2 px-2 font-bold text-text-secondary">Gap / Next Action</th>
            </tr>
          </thead>
          <tbody>
            {allGaps.map((item, i) => (
              <tr key={i} className="border-b border-border-light/50 hover:bg-background-secondary">
                <td className="py-3 px-2 text-text-tertiary">{i + 1}</td>
                <td className="py-3 px-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-background-secondary text-text-secondary">
                    {item.type}
                  </span>
                </td>
                <td className="py-3 px-2 text-text-secondary">{item.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-text-tertiary">
        Address these gaps by uploading evidence, creating documentation, or updating system configurations. Evidence items automatically resolve gaps.
      </p>
    </div>
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

function ProgressIndicator({ percentage, explanation }: { percentage: number; explanation: string }) {
  const color = percentage < 30 ? "bg-status-warning" : percentage < 70 ? "bg-accent" : "bg-status-success";

  return (
    <div className="standard-card hover:!translate-y-0">
      <h3 className="font-bold text-text-primary mb-3">Readiness Progress</h3>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-secondary">Completion</p>
            <span className={`text-lg font-bold ${color === "bg-status-warning" ? "text-status-warning" : color === "bg-accent" ? "text-accent" : "text-status-success"}`}>
              {percentage}%
            </span>
          </div>
          <div className="h-3 bg-background-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-text-secondary italic">{explanation}</p>
      </div>
    </div>
  );
}

function NextActionsPanel({ actions }: { actions: string[] }) {
  if (actions.length === 0) return null;

  return (
    <div className="standard-card hover:!translate-y-0 border-accent/20">
      <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
        <ZapOff className="h-5 w-5 text-accent" />
        Next Steps ({actions.length})
      </h3>
      <div className="space-y-2">
        {actions.map((action, i) => (
          <div key={i} className="flex gap-3 rounded-lg bg-background-secondary p-3">
            <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent">
              {i + 1}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
