import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { publicAppBaseUrl, publicBackendBaseUrl } from "@/lib/publicApi";

export const dynamic = "force-dynamic";

type VerificationPayload = {
  websiteId: string;
  websiteName?: string;
  complianceScore?: number;
  issuesFound?: number;
  lastScanAt?: string;
  lastVerifiedMinutesAgo?: number;
  scoreState?: "GREEN" | "YELLOW" | "RED" | string;
  siteDomain?: string;
  privacyProofStatus?: string;
  ukUsReadinessScore?: number;
  activeMonitoringStatus?: string;
  policyVersionStatus?: string;
  consentEvidenceStatus?: string;
  dsarWorkflowStatus?: string;
  issueSummary?: { category?: string; severity?: string; title?: string }[];
  disclaimer?: string;
};

type PageProps = {
  params: { siteId: string };
};

function verifyUrl(siteId: string) {
  return `${publicAppBaseUrl()}/verify/${encodeURIComponent(siteId)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const payload = await getVerification(params.siteId);
  const name = payload?.websiteName || "Website";
  const score = Math.round(payload?.complianceScore || 0);
  const title = payload ? `${name} readiness proof status` : "Readiness proof unavailable";
  const description = payload
    ? `${name} publishes operational privacy and AI readiness evidence through Zenvyra with a ${score}% readiness score.`
    : "This Zenvyra readiness proof page could not be found.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: verifyUrl(params.siteId),
      images: payload ? [{ url: `${publicBackendBaseUrl()}/badge/${encodeURIComponent(params.siteId)}` }] : undefined,
    },
  };
}

async function getVerification(siteId: string): Promise<VerificationPayload | null> {
  const response = await fetchWithTimeout(`${publicBackendBaseUrl()}/verify/${encodeURIComponent(siteId)}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  }, 3000);

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load readiness proof");
  }

  return response.json();
}

function formatDate(value?: string) {
  if (!value) return "Not scanned yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scanned yet";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function freshnessLabel(minutes?: number) {
  if (minutes == null) return "Review pending";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

function scoreTone(state?: string) {
  if (state === "GREEN") {
    return {
      Icon: CheckCircle2,
      label: "Ready for review",
      text: "text-status-success",
      bg: "bg-status-success",
      soft: "bg-emerald-50 border-emerald-200 text-emerald-800",
    };
  }
  if (state === "YELLOW") {
    return {
      Icon: AlertTriangle,
      label: "Review recommended",
      text: "text-status-warning",
      bg: "bg-status-warning",
      soft: "bg-orange-50 border-orange-200 text-orange-800",
    };
  }
  return {
    Icon: XCircle,
    label: "Action required",
    text: "text-status-error",
    bg: "bg-status-error",
    soft: "bg-red-50 border-red-200 text-red-800",
  };
}

export default async function PublicVerificationPage({ params }: PageProps) {
  const payload = await getVerification(params.siteId);

  if (!payload) {
    return (
      <main className="min-h-screen bg-background-base px-5 py-16 text-text-primary">
        <section className="mx-auto max-w-2xl rounded-lg border border-border-light bg-background-primary p-8 text-center shadow-card">
          <ShieldCheck className="mx-auto h-10 w-10 text-text-secondary" />
          <h1 className="mt-5 text-3xl font-extrabold tracking-normal text-text-primary">Readiness proof not found</h1>
          <p className="mt-3 text-body-sm text-text-secondary">
            This public readiness proof link is invalid or no longer available.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Go to Zenvyra</Link>
          </Button>
        </section>
      </main>
    );
  }

  const score = Math.round(payload.complianceScore || 0);
  const tone = scoreTone(payload.scoreState);
  const badgeUrl = `${publicBackendBaseUrl()}/badge/${encodeURIComponent(params.siteId)}`;

  return (
    <main className="min-h-screen bg-background-base text-text-primary">
      <section className="border-b border-border-light bg-background-primary">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase ${tone.soft}`}>
              <tone.Icon className="h-4 w-4" />
              {tone.label}
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-normal text-text-primary sm:text-5xl">
              {payload.websiteName || "Website"}
            </h1>
            <p className="mt-4 max-w-xl text-body text-text-secondary">
              Public privacy and AI readiness proof powered by Zenvyra.
            </p>
          </div>
          <div className="rounded-lg border border-border-light bg-background-secondary p-3 shadow-card">
            <img
              src={badgeUrl}
              alt={`Zenvyra readiness badge for ${payload.websiteName || "this website"}`}
              className="h-auto w-full max-w-[420px] rounded-md"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-border-light bg-background-primary p-6 shadow-card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-text-secondary">UK/US readiness score</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-6xl font-extrabold leading-none tracking-normal ${tone.text}`}>{Math.round(payload.ukUsReadinessScore ?? score)}</span>
                <span className="text-2xl font-bold text-text-secondary">%</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-bold uppercase text-text-secondary">Open issues</p>
              <p className="mt-2 text-3xl font-extrabold tracking-normal text-text-primary">{payload.issuesFound ?? 0}</p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-background-secondary">
            <div className={`h-full rounded-full ${tone.bg}`} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <StatusPill label="Proof status" value={payload.privacyProofStatus} />
            <StatusPill label="Monitoring" value={payload.activeMonitoringStatus} />
            <StatusPill label="Policy version" value={payload.policyVersionStatus} />
            <StatusPill label="Consent evidence" value={payload.consentEvidenceStatus} />
            <StatusPill label="DSAR workflow" value={payload.dsarWorkflowStatus} />
            <StatusPill label="Site domain" value={payload.siteDomain} />
          </div>

          {payload.issueSummary && payload.issueSummary.length > 0 && (
            <div className="mt-6 rounded-lg border border-border-light bg-background-secondary p-4">
              <p className="text-sm font-bold text-text-primary">Public issue summary</p>
              <div className="mt-3 space-y-2">
                {payload.issueSummary.map((issue, index) => (
                  <div key={`${issue.title}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-text-secondary">{issue.title || issue.category}</span>
                    <span className="rounded-full bg-background-primary px-2 py-1 text-xs font-bold text-text-secondary">{issue.severity || "review"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-border-light bg-background-primary p-6 shadow-card">
          <div className="space-y-5">
            <div className="flex gap-3">
              <Clock3 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-text-primary">Last scanned</p>
                <p className="text-body-sm text-text-secondary">{formatDate(payload.lastScanAt)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-text-primary">Last checked</p>
                <p className="text-body-sm text-text-secondary">{freshnessLabel(payload.lastVerifiedMinutesAgo)}</p>
              </div>
            </div>
          </div>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href="/" className="gap-2">
              Improve readiness
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-4 rounded-lg border border-border-light bg-background-secondary p-3 text-xs leading-5 text-text-secondary">
            {payload.disclaimer || "This certificate is operational readiness evidence, not legal certification."}
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
      <p className="mt-1 text-sm font-semibold text-text-primary">{(value || "review required").replaceAll("_", " ")}</p>
    </div>
  );
}
