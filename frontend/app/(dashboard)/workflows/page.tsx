"use client";

import { useState } from "react";
import { Bell, Calendar, Loader2, Play, Save, ShieldCheck, ToggleLeft, ToggleRight, Webhook, Workflow, Zap } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";

type WorkflowItem = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastRun?: string;
  icon: typeof Zap;
};

const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: "assess-new-system",
    name: "Assess new AI system",
    description: "Run an AI Act readiness assessment automatically when a system is created.",
    trigger: "New AI system added",
    action: "Run AI Act assessment",
    enabled: true,
    icon: ShieldCheck,
  },
  {
    id: "scan-website-weekly",
    name: "Weekly website scan",
    description: "Re-scan all connected websites every 7 days to detect drift.",
    trigger: "Every 7 days",
    action: "Run privacy scanner",
    enabled: false,
    icon: Zap,
  },
  {
    id: "high-risk-alert",
    name: "High-risk AI alert",
    description: "Notify the team when a system is classified as high-risk or prohibited.",
    trigger: "Risk classification changes",
    action: "Send email alert",
    enabled: true,
    icon: Bell,
  },
  {
    id: "evidence-due",
    name: "Evidence due-date reminder",
    description: "Send a reminder 3 days before an evidence item is due.",
    trigger: "3 days before due date",
    action: "Send reminder",
    enabled: false,
    icon: Calendar,
  },
  {
    id: "webhook-export",
    name: "Export proof pack via webhook",
    description: "Send the latest proof pack to a configured endpoint after each assessment.",
    trigger: "Assessment completed",
    action: "POST to webhook URL",
    enabled: false,
    icon: Webhook,
  },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setWorkflows((current) =>
      current.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
    );
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Workflow settings saved.");
    }, 500);
  };

  const runNow = (id: string) => {
    setWorkflows((current) =>
      current.map((w) => (w.id === id ? { ...w, lastRun: new Date().toLocaleString() } : w)),
    );
    toast.success("Workflow triggered.");
  };

  return (
    <DashboardPageShell
      title="No-Code Workflow Builder"
      subtitle="Automate compliance actions with triggers, alerts, and webhooks."
      icon={Workflow}
    >
      <div className="space-y-6">
        <div className="standard-card hover:!translate-y-0">
          <h2 className="mb-4 text-lg font-bold text-text-primary">Active workflows</h2>
          <div className="space-y-3">
            {workflows.map((workflow) => {
              const Icon = workflow.icon;
              return (
                <div
                  key={workflow.id}
                  className="flex flex-col gap-4 rounded-xl border border-border-light bg-background-secondary p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-text-primary">{workflow.name}</p>
                    <p className="mt-1 text-xs text-text-secondary">{workflow.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                      <span className="rounded-full bg-background-primary px-2 py-0.5">Trigger: {workflow.trigger}</span>
                      <span className="rounded-full bg-background-primary px-2 py-0.5">Action: {workflow.action}</span>
                    </div>
                    {workflow.lastRun && (
                      <p className="mt-2 text-[10px] text-text-tertiary">Last run: {workflow.lastRun}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggle(workflow.id)}
                      className="text-text-secondary transition hover:text-text-primary"
                      aria-label={workflow.enabled ? "Disable workflow" : "Enable workflow"}
                    >
                      {workflow.enabled ? (
                        <ToggleRight className="h-7 w-7 text-status-success" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-text-tertiary" />
                      )}
                    </button>
                    <button
                      onClick={() => runNow(workflow.id)}
                      className="btn-secondary !px-3 !py-1.5 text-xs"
                    >
                      <Play className="h-3 w-3" />
                      Run now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="standard-card hover:!translate-y-0">
          <h2 className="mb-4 text-lg font-bold text-text-primary">Webhook destination</h2>
          <p className="mb-4 text-sm text-text-secondary">
            Workflows that POST proof packs or alerts will send to this URL.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              className="text-input flex-1"
              placeholder="https://your-app.com/webhooks/zenvyra"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <button onClick={save} disabled={saving} className="btn-primary !px-4 text-sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
