"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Globe, Loader2, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import PolicyEmbedSnippetPanel from "@/components/policies/PolicyEmbedSnippetPanel";
import api from "@/lib/api";
import { PUBLIC_APP_URL } from "@/lib/constants";

type Policy = {
  id: string;
  title?: string;
  name?: string;
  type: string;
  content?: string;
  companySlug?: string;
  updatedAt?: string;
  status?: string;
};

export default function PolicyPreviewPage({ params }: { params: { id: string } }) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<Policy>(`/policies/${params.id}`)
      .then((response) => {
        if (mounted) setPolicy(response.data);
      })
      .catch((error) => toast.error(error?.response?.data?.message || "Unable to load policy preview"))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background-secondary p-10 text-text-secondary">
        <Loader2 className="mr-2 inline h-5 w-5 animate-spin" />
        Loading preview...
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="min-h-screen bg-background-secondary p-10 text-status-error">
        Policy preview could not be loaded.
      </main>
    );
  }

  const title = policy.title || policy.name || "Policy";
  const companySlug = policy.companySlug || "company";
  const policyType = policy.type || "privacy";

  return (
    <main className="min-h-screen bg-background-secondary p-6 text-text-primary print:bg-white print:p-0 md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/policies/${params.id}`} className="text-text-muted transition-colors hover:text-text-primary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hosted Preview</h1>
            <p className="mt-0.5 text-caption text-text-muted">ID: {params.id} | {policy.status || "draft"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => window.print()} variant="outline" className="gap-2 rounded-xl border-border-medium text-caption font-bold">
            <Printer className="h-4 w-4" />
            Print / PDF
          </Button>
          <Link href={`/dashboard/policies/${params.id}/edit`}>
            <Button className="gap-2 rounded-xl bg-secondary-dark font-bold text-white hover:bg-primary">
              <Edit className="h-4 w-4" />
              Edit Draft
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="rounded-3xl border border-border-light bg-background-primary p-8 shadow-card print:border-none print:shadow-none lg:col-span-8">
          <span className="mb-6 inline-block rounded-full bg-status-success/10 px-2.5 py-1 text-caption font-bold uppercase tracking-widest text-status-success">
            Active database record
          </span>
          <div className="prose prose-slate max-w-none">
            <h1 className="border-b border-border-light pb-4 text-3xl font-extrabold tracking-tight text-text-primary">
              {title}
            </h1>
            <p className="text-sm text-text-muted">Last updated: {formatDate(policy.updatedAt)}</p>
            <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{policy.content || ""}</div>
          </div>
        </div>

        <div className="space-y-6 print:hidden lg:col-span-4">
          <PolicyEmbedSnippetPanel
            companySlug={companySlug}
            policyType={policyType}
            publicBaseUrl={PUBLIC_APP_URL}
          />

          <div className="relative space-y-3 overflow-hidden rounded-3xl bg-secondary-dark p-6 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-sm font-bold">Public endpoint</h4>
            <p className="text-caption leading-relaxed text-text-tertiary">
              Publish this policy to make `/p/{companySlug}/{policyType}` available to customers and embeds.
            </p>
            <Link href="/dashboard/integrations/api" className="block text-caption font-bold text-primary hover:underline">
              Manage API access
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function formatDate(value?: string) {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}
