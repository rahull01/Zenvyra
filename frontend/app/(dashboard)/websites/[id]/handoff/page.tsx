"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clipboard, FileText, Loader2, Mail, PackageCheck, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import api from "@/lib/api";

type Handoff = Record<string, any>;

export default function WebsiteHandoffPage({ params }: { params: { id: string } }) {
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get<Handoff>(`/websites/${params.id}/handoff`)
      .then((response) => setHandoff(response.data))
      .catch((error) => toast.error(error?.response?.data?.message || "Unable to load setup handoff"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const send = async () => {
    setSending(true);
    try {
      const response = await api.post<Handoff>(`/websites/${params.id}/handoff/send`);
      setHandoff(response.data);
      toast.success("Setup pack email sent or logged.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to send setup pack");
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardPageShell
      title="Setup Handoff"
      subtitle="Customer-ready setup pack with install instructions, proof report, certificate, badge code, and disclaimer."
      icon={PackageCheck}
      actions={[{ label: "Send email", href: "#", onClick: send, primary: true }]}
    >
      {loading ? (
        <div className="standard-card text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading handoff...
        </div>
      ) : !handoff ? (
        <div className="standard-card text-sm text-text-secondary">Setup handoff not found.</div>
      ) : (
        <div className="space-y-6">
          <section className="standard-card hover:!translate-y-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase text-accent">
                  <ShieldCheck className="h-4 w-4" />
                  Customer setup pack
                </div>
                <h2 className="text-xl font-bold text-text-primary">{handoff.websiteUrl}</h2>
                <p className="mt-2 max-w-3xl text-sm text-text-secondary">{handoff.setupSummary}</p>
              </div>
              <div className="rounded-lg border border-border-light bg-background-secondary p-3 text-sm text-text-secondary">
                <p className="font-semibold text-text-primary">{handoff.fileName}</p>
                <p className="mt-1">{handoff.emailSubject}</p>
                {handoff.deliveryStatus && <p className="mt-1 text-accent">Delivery: {handoff.deliveryStatus}</p>}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Mini label="Platform" value={handoff.platform} />
              <Mini label="Score" value={`${Math.round(handoff.readinessScore || 0)}/100`} />
              <Mini label="Regions" value={(handoff.checkedRegions || []).join(", ")} />
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="standard-card hover:!translate-y-0">
              <h3 className="mb-4 text-lg font-bold text-text-primary">Install instructions</h3>
              <div className="space-y-3">
                {(handoff.installInstructions || []).map((item: string) => (
                  <div key={item} className="flex gap-3 rounded-lg bg-background-secondary p-3 text-sm text-text-secondary">
                    <CheckCircle2 className="h-5 w-5 text-status-success" />
                    {item}
                  </div>
                ))}
              </div>
              <h3 className="mb-4 mt-6 text-lg font-bold text-text-primary">Outstanding issues</h3>
              <div className="space-y-3">
                {(handoff.outstandingIssues || []).length === 0 ? (
                  <p className="rounded-lg bg-background-secondary p-3 text-sm text-text-secondary">No open issues included in this handoff.</p>
                ) : (
                  (handoff.outstandingIssues || []).map((issue: any, index: number) => (
                    <div key={issue.id || index} className="flex gap-3 rounded-lg border border-border-light bg-background-secondary p-3 text-sm text-text-secondary">
                      <AlertTriangle className="h-5 w-5 text-status-warning" />
                      <div>
                        <p className="font-semibold text-text-primary">{issue.title || issue.type || "Readiness issue"}</p>
                        <p className="mt-1">{issue.fixSuggestion || issue.description || "Review this item before public reliance."}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="standard-card space-y-4 hover:!translate-y-0">
              <Action label="Copy banner script" icon={Clipboard} value={handoff.bannerScript} />
              <Action label="Copy badge code" icon={Clipboard} value={handoff.badgeCode} />
              <Link className="btn-secondary justify-center" href={handoff.certificateLink || "#"}>
                <PackageCheck className="h-4 w-4" />
                Open certificate
              </Link>
              <Link className="btn-secondary justify-center" href={`/websites/${params.id}/proof-report`}>
                <FileText className="h-4 w-4" />
                Open proof report
              </Link>
              {(handoff.policyLinks || []).map((href: string) => (
                <Link key={href} className="btn-secondary justify-center" href={href}>
                  <FileText className="h-4 w-4" />
                  Open policies
                </Link>
              ))}
              <button onClick={send} disabled={sending} className="btn-primary w-full justify-center">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Email setup pack
              </button>
              <div className="rounded-lg border border-border-light bg-background-secondary p-3 text-xs leading-5 text-text-secondary">
                <p className="font-semibold text-text-primary">Support: {handoff.supportContact}</p>
                <p className="mt-2">{handoff.disclaimer}</p>
              </div>
            </section>
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}

function Action({ label, icon: Icon, value }: { label: string; icon: any; value: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value || "");
        toast.success("Copied.");
      }}
      className="btn-secondary w-full justify-center"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background-secondary p-3">
      <p className="text-xs font-semibold uppercase text-text-tertiary">{label}</p>
      <p className="mt-1 font-bold text-text-primary">{value || "-"}</p>
    </div>
  );
}
