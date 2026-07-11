import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ClipboardList,
  Clock3,
  FileText,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { publicAppBaseUrl, publicBackendBaseUrl } from "@/lib/publicApi";

export const dynamic = "force-dynamic";

type AiActPublicVerificationResponse = {
  systemName?: string;
  readinessScore?: number;
  riskCategory?: string;
  rulesetVersion?: string;
  assessedAt?: string;
  issuedAt?: string;
  expiresAt?: string;
  active?: boolean;
  revokedAt?: string;
  evidenceCategories?: string[];
  gapCategories?: string[];
  disclaimer?: string;
};

type PageProps = {
  params: { token: string };
};

function verifyUrl(token: string) {
  return `${publicAppBaseUrl()}/verify/ai/${encodeURIComponent(token)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const payload = await getVerification(params.token);
  const name = payload?.systemName || "AI system";
  const score = Math.round(payload?.readinessScore || 0);
  const title = payload ? `${name} AI Act readiness proof` : "AI Act readiness proof unavailable";
  const description = payload
    ? `${name} publishes AI Act readiness evidence through Zenvyra with a ${score}% readiness score.`
    : "This Zenvyra AI Act readiness proof page could not be found.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: verifyUrl(params.token),
      images: payload
        ? [{ url: `${publicBackendBaseUrl()}/badge/ai/${encodeURIComponent(params.token)}` }]
        : undefined,
    },
  };
}

async function getVerification(token: string): Promise<AiActPublicVerificationResponse | null> {
  const response = await fetchWithTimeout(
    `${publicBackendBaseUrl()}/verify/ai/${encodeURIComponent(token)}`,
    {
      cache: "no-store",
      headers: { Accept: "application/json" },
    },
    3000,
  );

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load AI Act readiness proof");
  }

  return response.json();
}

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function riskTone(riskCategory?: string) {
  const normalized = (riskCategory || "").toUpperCase();
  if (normalized.includes("PROHIBITED")) {
    return {
      label: "Prohibited risk",
      text: "text-status-error",
      bg: "bg-status-error",
      soft: "bg-red-50 border-red-200 text-red-800",
    };
  }
  if (normalized.includes("HIGH")) {
    return {
      label: "High risk",
      text: "text-status-error",
      bg: "bg-status-error",
      soft: "bg-red-50 border-red-200 text-red-800",
    };
  }
  if (normalized.includes("LIMITED") || normalized.includes("MEDIUM")) {
    return {
      label: "Limited risk",
      text: "text-status-warning",
      bg: "bg-status-warning",
      soft: "bg-orange-50 border-orange-200 text-orange-800",
    };
  }
  if (normalized.includes("MINIMAL") || normalized.includes("LOW")) {
    return {
      label: "Minimal risk",
      text: "text-status-success",
      bg: "bg-status-success",
      soft: "bg-emerald-50 border-emerald-200 text-emerald-800",
    };
  }
  return {
    label: "Review required",
    text: "text-status-warning",
    bg: "bg-status-warning",
    soft: "bg-orange-50 border-orange-200 text-orange-800",
  };
}

function evidenceIcon(category: string) {
  const value = category.toLowerCase();
  if (value.includes("policy") || value.includes("notice")) return FileText;
  if (value.includes("log") || value.includes("monitor")) return ClipboardList;
  if (value.includes("assess") || value.includes("risk")) return ShieldAlert;
  return ShieldCheck;
}

function prettifyCategory(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function AiActPublicVerificationPage({ params }: PageProps) {
  const payload = await getVerification(params.token);

  if (!payload) {
    return (
      <main className="min-h-screen bg-background-base px-5 py-16 text-text-primary">
        <section className="mx-auto max-w-2xl rounded-lg border border-border-light bg-background-primary p-8 text-center shadow-card">
          <ShieldCheck className="mx-auto h-10 w-10 text-text-secondary" />
          <h1 className="mt-5 text-3xl font-extrabold tracking-normal text-text-primary">
            AI Act readiness proof not found
          </h1>
          <p className="mt-3 text-body-sm text-text-secondary">
            This public AI Act readiness proof link is invalid, revoked, or no longer available.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Go to Zenvyra</Link>
          </Button>
        </section>
      </main>
    );
  }

  const score = Math.round(payload.readinessScore || 0);
  const tone = riskTone(payload.riskCategory);
  const badgeUrl = `${publicBackendBaseUrl()}/badge/ai/${encodeURIComponent(params.token)}`;
  const evidenceCategories = payload.evidenceCategories || [];
  const gapCategories = payload.gapCategories || [];

  return (
    <main className="min-h-screen bg-background-base text-text-primary">
      <section className="border-b border-border-light bg-background-primary">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase ${tone.soft}`}
            >
              <ShieldCheck className="h-4 w-4" />
              {tone.label}
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-normal text-text-primary sm:text-5xl">
              {payload.systemName || "AI system"}
            </h1>
            <p className="mt-4 max-w-xl text-body text-text-secondary">
              Public AI Act readiness proof powered by Zenvyra.
            </p>
          </div>
          <div className="rounded-lg border border-border-light bg-background-secondary p-3 shadow-card">
            <img
              src={badgeUrl}
              alt={`Zenvyra AI Act readiness badge for ${payload.systemName || "this AI system"}`}
              className="h-auto w-full max-w-[420px] rounded-md"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-border-light bg-background-primary p-6 shadow-card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-text-secondary">AI Act readiness score</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-6xl font-extrabold leading-none tracking-normal ${tone.text}`}>
                  {score}
                </span>
                <span className="text-2xl font-bold text-text-secondary">%</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-bold uppercase text-text-secondary">Risk category</p>
              <p className="mt-2 text-2xl font-extrabold tracking-normal text-text-primary">
                {prettifyCategory(payload.riskCategory || "review required")}
              </p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-background-secondary">
            <div
              className={`h-full rounded-full ${tone.bg}`}
              style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <StatusPill label="Ruleset version" value={payload.rulesetVersion} />
            <StatusPill label="Assessed" value={formatDate(payload.assessedAt)} />
            <StatusPill label="Issued" value={formatDate(payload.issuedAt)} />
            <StatusPill label="Expires" value={formatDate(payload.expiresAt)} />
          </div>

          {evidenceCategories.length > 0 && (
            <div className="mt-6 rounded-lg border border-border-light bg-background-secondary p-4">
              <p className="text-sm font-bold text-text-primary">Evidence categories</p>
              <p className="mt-1 text-xs text-text-secondary">
                Public high-level summary. Private document titles and files are not exposed.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {evidenceCategories.map((category) => {
                  const Icon = evidenceIcon(category);
                  return (
                    <div
                      key={category}
                      className="flex items-center gap-3 rounded-lg border border-border-light bg-background-primary p-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-success/15 text-status-success">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-text-primary">{prettifyCategory(category)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {gapCategories.length > 0 && (
            <div className="mt-6 rounded-lg border border-border-light bg-background-secondary p-4">
              <p className="text-sm font-bold text-text-primary">Open gap categories</p>
              <ul className="mt-3 space-y-2">
                {gapCategories.map((gap) => (
                  <li
                    key={gap}
                    className="flex items-center gap-3 rounded-lg border border-border-light bg-background-primary px-3 py-2 text-sm text-text-secondary"
                  >
                    <AlertTriangle className="h-4 w-4 text-status-warning" />
                    <span>{prettifyCategory(gap)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-border-light bg-background-primary p-6 shadow-card">
          <div className="space-y-5">
            <div className="flex gap-3">
              <Clock3 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-text-primary">Proof issued</p>
                <p className="text-body-sm text-text-secondary">{formatDate(payload.issuedAt)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-text-primary">Proof expires</p>
                <p className="text-body-sm text-text-secondary">{formatDate(payload.expiresAt)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FileText className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-text-primary">Ruleset</p>
                <p className="text-body-sm text-text-secondary">{payload.rulesetVersion || "Not set"}</p>
              </div>
            </div>
          </div>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href="/" className="gap-2">
              Improve readiness
            </Link>
          </Button>
          <p className="mt-4 rounded-lg border border-border-light bg-background-secondary p-3 text-xs leading-5 text-text-secondary">
            {payload.disclaimer ||
              "This certificate is operational readiness evidence, not legal certification."}
          </p>
        </aside>
      </section>
    </main>
  );
}

function StatusPill({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-border-light bg-background-secondary p-3">
      <p className="text-xs font-bold uppercase text-text-tertiary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{value || "Not set"}</p>
    </div>
  );
}
