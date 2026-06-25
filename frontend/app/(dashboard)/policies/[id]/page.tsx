"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Download, Edit3, Eye, History, Loader2, Save, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

type Policy = {
  id: string;
  title?: string;
  name?: string;
  type: string;
  content?: string;
  plainText?: string;
  language?: string;
  status?: string;
  updatedAt?: string;
  websiteId?: string;
  complianceFrameworks?: string[];
};

export default function PolicyDetailPage() {
  const { id } = useParams();
  const policyId = Array.isArray(id) ? id[0] : id;
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!policyId) return;
    let mounted = true;
    api
      .get<Policy>(`/policies/${policyId}`)
      .then((response) => {
        if (!mounted) return;
        setPolicy(response.data);
        setContent(response.data.content || response.data.plainText || "");
      })
      .catch((error) => toast.error(error?.response?.data?.message || "Unable to load policy"))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [policyId]);

  const title = policy?.title || policy?.name || "Policy";
  const frameworkText = useMemo(() => (policy?.complianceFrameworks || []).join(", "), [policy]);

  const handleSave = async () => {
    if (!policyId) return;
    setSaving(true);
    try {
      const response = await api.put<Policy>(`/policies/${policyId}`, { content });
      setPolicy(response.data);
      setContent(response.data.content || "");
      setIsEditing(false);
      toast.success("Policy saved.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to save policy");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-text-secondary">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading policy...
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="rounded-2xl border border-status-error/30 bg-status-error/10 p-6 text-status-error">
        Policy could not be loaded.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/policies" className="rounded-xl p-2 transition-colors hover:bg-background-secondary">
            <ChevronLeft className="h-6 w-6 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {policy.type} | {policy.status || "draft"} | Updated {formatRelative(policy.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing((value) => !value)}
            className="flex items-center gap-2 rounded-xl border border-border-light bg-background-secondary px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-background-tertiary"
          >
            {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isEditing ? "Preview" : "Edit"}
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          ) : (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl bg-background-secondary px-6 py-2 text-sm font-semibold text-text-primary transition hover:bg-background-tertiary"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-border-light bg-surface-card shadow-card">
            {isEditing ? (
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="h-[650px] w-full resize-none bg-transparent p-8 font-mono text-sm leading-relaxed text-text-primary outline-none"
              />
            ) : (
              <article className="min-h-[650px] p-10">
                <div className="whitespace-pre-wrap text-sm leading-7 text-text-primary">{content}</div>
              </article>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-text-primary">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Context
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-tertiary">Language</dt>
                <dd className="font-semibold text-text-primary">{policy.language || "en"}</dd>
              </div>
              <div>
                <dt className="text-text-tertiary">Frameworks</dt>
                <dd className="font-semibold text-text-primary">{frameworkText || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-text-tertiary">Website</dt>
                <dd className="font-semibold text-text-primary">{policy.websiteId || "Account-wide"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border-light bg-surface-card p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-text-primary">
              <History className="h-5 w-5 text-text-secondary" />
              Version
            </h3>
            <p className="text-sm text-text-secondary">Current database record updated {formatRelative(policy.updatedAt)}.</p>
            <Link href={`/dashboard/policies/${policy.id}/preview`} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
              Open hosted preview
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatRelative(value?: string) {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
