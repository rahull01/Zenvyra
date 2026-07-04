"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  Loader2,
  Lock,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { track } from "@/lib/analytics";
import { useAuthStore } from "@/hooks/useAuth";

type ScanIssue = {
  category?: string;
  severity?: string;
  title?: string;
  description?: string;
  fix?: string;
};

type ScanResult = {
  url?: string;
  score?: number;
  issues?: ScanIssue[];
  recommendations?: string[];
  scanDate?: string;
};

const scanPhases = [
  "Mapping AI systems",
  "Checking transparency disclosures",
  "Reviewing human oversight evidence",
  "Building AI Act readiness preview",
];

const defaultIssues: ScanIssue[] = [
  {
    category: "Tracking",
    severity: "medium",
    title: "Third-party scripts need review",
    description: "We found scripts that should be mapped before launch.",
  },
  {
    category: "Consent",
    severity: "high",
    title: "Consent blocking may be missing",
    description: "Marketing and analytics tags should be controlled by region-aware consent.",
  },
];

export default function FreePrivacyScannerPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [lead, setLead] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!scanning) return;
    const timer = window.setInterval(() => {
      setPhaseIndex((current) => Math.min(current + 1, scanPhases.length - 1));
    }, 850);
    return () => window.clearInterval(timer);
  }, [scanning]);

  const issues = useMemo(() => result?.issues?.length ? result.issues : defaultIssues, [result]);
  const score = Math.round(Number(result?.score ?? 0));
  const riskCount = issues.filter((issue) => normalizeSeverity(issue.severity) !== "low").length;
  const trackerGroups = useMemo(() => {
    return issues.reduce<Record<string, number>>((groups, issue) => {
      const key = issue.category || "Unknown";
      groups[key] = (groups[key] || 0) + 1;
      return groups;
    }, {});
  }, [issues]);

  const handleScan = async (event: FormEvent) => {
    event.preventDefault();
    const targetUrl = normalizeInputUrl(url);
    if (!targetUrl) {
      toast.error("Enter a valid website URL.");
      return;
    }

    setUrl(targetUrl);
    setScanning(true);
    setPhaseIndex(0);
    setResult(null);
    setShowGate(false);

    try {
      const response = await fetch("/api/scan/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Scan failed");
      setResult(data);
      setShowGate(true);
      toast.success("Free scan complete.");
    } catch (error: any) {
      toast.error(error?.message || "Unable to scan this website.");
    } finally {
      setScanning(false);
    }
  };

  const createFreeAccount = async (event: FormEvent) => {
    event.preventDefault();
    if (lead.fullName.trim().length < 2) {
      toast.error("Enter your full name.");
      return;
    }
    if (!lead.email.includes("@")) {
      toast.error("Enter a work email.");
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(lead.password)) {
      toast.error("Password needs uppercase, lowercase, number, and special character.");
      return;
    }

    setCreatingAccount(true);
    try {
      try {
        await fetch("/api/scan/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: lead.fullName.trim(),
            email: lead.email.trim(),
            websiteUrl: url,
            readinessScore: score,
            issueCount: issues.length,
            desiredPath: "proof_report_unlock",
          }),
        });
      } catch {
        // Lead capture should not block account creation.
      }

      const companyName = inferCompanyName(lead.email, url);
      track("signup_from_scanner", { url, email: lead.email.trim() });
      const response = await api.post("/auth/signup", {
        fullName: lead.fullName.trim(),
        email: lead.email.trim(),
        password: lead.password,
        companyName,
        industry: "Services",
        employeeCount: "1-10",
        websiteUrl: url,
        accountType: "BUSINESS",
        primaryRegion: "UK + USA",
        platform: "Other",
        aiUsage: ["No AI"],
      });

      login(response.data.user);
      if (url) {
        try {
          await api.post("/websites", { url });
          router.push("/dashboard/websites");
        } catch {
          router.push("/dashboard/scanner");
        }
      } else {
        router.push("/dashboard");
      }
      toast.success("Free account created. Your scan is ready inside the dashboard.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not create your account.");
    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <section className="border-b border-border-light bg-surface-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            Zenvyra
          </Link>
          <Link href="/auth/login" className="text-sm font-semibold text-text-secondary hover:text-accent">
            Sign in
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            <Sparkles className="h-4 w-4" />
            Free EU AI Act scanner
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal text-text-primary md:text-6xl">
            Check your AI startup for EU AI Act gaps in 10 seconds.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
            Scan your public site for AI system inventory, transparency disclosures, human oversight evidence, and GPAI documentation gaps before your next launch or investor review.
          </p>

          <form onSubmit={handleScan} className="mt-9 rounded-2xl border border-border-light bg-surface-card p-3 shadow-card">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Globe2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="h-14 w-full rounded-xl border border-border-light bg-background-secondary pl-12 pr-4 text-base text-text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  disabled={scanning}
                />
              </div>
              <button
                type="submit"
                disabled={scanning}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-accent px-7 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {scanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                Scan for AI Act gaps
              </button>
            </div>
          </form>

          {scanning && (
            <div className="mt-7 rounded-2xl border border-border-light bg-surface-card p-5">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-text-primary">{scanPhases[phaseIndex]}...</span>
                <span className="text-text-secondary">{Math.round(((phaseIndex + 1) / scanPhases.length) * 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background-tertiary">
                <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${((phaseIndex + 1) / scanPhases.length) * 100}%` }} />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {scanPhases.map((phase, index) => (
                  <div key={phase} className="flex items-center gap-2 text-sm text-text-secondary">
                    {index <= phaseIndex ? <CheckCircle2 className="h-4 w-4 text-status-success" /> : <span className="h-4 w-4 rounded-full border border-border-medium" />}
                    {phase}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["No credit card", "AI Act readiness score", "Shareable preview"].map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <CheckCircle2 className="h-4 w-4 text-status-success" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border-light bg-surface-card p-6 shadow-card">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-secondary">Live preview</p>
              <h2 className="text-2xl font-bold">Readiness report</h2>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">Free scan</span>
          </div>

          {!result ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-medium bg-background-secondary p-8 text-center">
              <ShieldCheck className="mb-4 h-12 w-12 text-accent" />
              <h3 className="text-xl font-bold">Your scan result appears here</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Enter a website URL to see the conversion preview your visitors will get before creating a free account.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl bg-background-secondary p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">EU AI Act Readiness Score</p>
                    <p className="mt-1 truncate text-sm font-semibold text-accent">{result.url || url}</p>
                  </div>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-background-tertiary">
                    <span className={score >= 80 ? "text-3xl font-black text-status-success" : score >= 60 ? "text-3xl font-black text-status-warning" : "text-3xl font-black text-status-error"}>
                      {score}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-status-warning/30 bg-status-warning/10 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-status-warning" />
                  <div>
                    <p className="font-bold text-text-primary">Alert: {riskCount} AI Act gaps found.</p>
                    <p className="mt-1 text-sm text-text-secondary">Unlock the full readiness report to see prioritized fixes, transparency drafts, and compliance evidence.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    track("scanner_share", { network: "twitter", url: result.url || url, score });
                    const text = `I just scanned ${result.url || url} for EU AI Act readiness with Zenvyra. Score: ${score}/100. Check your AI startup too:`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://zenvyra.com/free-privacy-scanner")}`, "_blank", "noopener,noreferrer");
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-light bg-surface-card px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-background-tertiary"
                >
                  Share on X
                </button>
                <button
                  type="button"
                  onClick={() => {
                    track("scanner_share", { network: "linkedin", url: result.url || url, score });
                    const text = `I just scanned ${result.url || url} for EU AI Act readiness with Zenvyra. Score: ${score}/100.`;
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://zenvyra.com/free-privacy-scanner")}&summary=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-light bg-surface-card px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-background-tertiary"
                >
                  Share on LinkedIn
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/auth/signup?intent=ai-act"
                  className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                >
                  Fix AI Act gaps
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border-light bg-surface-card px-4 py-3 text-sm font-bold text-text-primary transition hover:bg-background-tertiary"
                >
                  See pricing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {Object.entries(trackerGroups).slice(0, 3).map(([category, count]) => (
                  <div key={category} className="rounded-xl border border-border-light bg-background-secondary p-4">
                    <p className="text-xs font-semibold uppercase text-text-secondary">{category}</p>
                    <p className="mt-2 text-2xl font-black">{count}</p>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-border-light bg-background-secondary p-4">
                <div className="space-y-3 blur-[2px]">
                  {issues.slice(0, 4).map((issue, index) => (
                    <div key={`${issue.title}-${index}`} className="flex items-start gap-3 rounded-xl bg-surface-card p-4">
                      {normalizeSeverity(issue.severity) === "low" ? <CheckCircle2 className="h-5 w-5 text-status-success" /> : <XCircle className="h-5 w-5 text-status-error" />}
                      <div>
                        <p className="font-semibold">{issue.title || issue.category || "Compliance issue"}</p>
                        <p className="mt-1 text-sm text-text-secondary">{issue.description || "Detailed fix instructions are available inside your free account."}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {showGate && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background-primary/80 p-4 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => setShowGate(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-white shadow-card transition hover:bg-primary-hover"
                    >
                      <Lock className="h-5 w-5" />
                      Unlock proof report
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {showGate && result && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid overflow-hidden rounded-3xl border border-border-light bg-surface-card shadow-card lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-background-secondary p-8 lg:p-10">
              <p className="text-sm font-bold uppercase tracking-wide text-accent">Unlock the report</p>
              <h2 className="mt-3 text-3xl font-black">Get the full proof-pack preview and guided fixing workflow free.</h2>
              <div className="mt-6 space-y-4">
                {[
                  "Exact trackers and cookie categories",
                  "Consent banner setup checklist for your scanned site",
                  "Dashboard scan history and readiness remediation checklist",
                  "Option to continue into founder-led setup or agency workflow",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-status-success" />
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={createFreeAccount} className="space-y-4 p-8 lg:p-10">
              <LeadInput
                label="Full name"
                icon={User}
                value={lead.fullName}
                onChange={(value) => setLead((current) => ({ ...current, fullName: value }))}
                placeholder="Jane Doe"
                autoComplete="name"
              />
              <LeadInput
                label="Work email"
                icon={Mail}
                value={lead.email}
                onChange={(value) => setLead((current) => ({ ...current, email: value }))}
                placeholder="jane@company.com"
                autoComplete="email"
                type="email"
              />
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={lead.password}
                    onChange={(event) => setLead((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Uppercase, number, special character"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-border-light bg-background-secondary pl-11 pr-12 text-text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={creatingAccount}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingAccount ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Free Account"}
                {!creatingAccount && <ArrowRight className="h-5 w-5" />}
              </button>
              <p className="text-xs leading-5 text-text-secondary">
                No credit card required. Results are AI Act readiness evidence and implementation guidance, not legal advice.
              </p>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}

function LeadInput({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-text-primary">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-border-light bg-background-secondary pl-11 pr-4 text-text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
        />
      </div>
    </div>
  );
}

function normalizeInputUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    return "";
  }
}

function normalizeSeverity(value?: string) {
  return (value || "medium").toLowerCase();
}

function inferCompanyName(email: string, scannedUrl: string) {
  const domain = email.split("@")[1] || "";
  if (domain && !["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"].includes(domain.toLowerCase())) {
    return domain.split(".")[0];
  }
  try {
    return new URL(scannedUrl).hostname.replace(/^www\./, "");
  } catch {
    return "My Company";
  }
}
