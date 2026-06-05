import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PublicPolicy = {
  id: string;
  companySlug: string;
  policyType: string;
  title: string;
  markdown: string;
  version?: number;
  lastUpdated?: string;
  changes?: string;
};

function apiBaseUrl() {
  const raw = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  return raw.replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "").replace(/\/$/, "");
}

async function getPolicy(companySlug: string, policyType: string): Promise<PublicPolicy | null> {
  const response = await fetch(
    `${apiBaseUrl()}/policies/public/${encodeURIComponent(companySlug)}/${encodeURIComponent(policyType)}`,
    {
      cache: "no-store",
      headers: { Accept: "application/json" },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load policy");
  }

  return response.json();
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function MarkdownPolicy({ markdown }: { markdown: string }) {
  const blocks = markdown.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="text-3xl font-extrabold tracking-tight text-slate-950">
              {renderInline(trimmed.slice(2))}
            </h1>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-4 text-xl font-bold tracking-tight text-slate-950">
              {renderInline(trimmed.slice(3))}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-2 text-lg font-bold text-slate-900">
              {renderInline(trimmed.slice(4))}
            </h3>
          );
        }

        const lines = trimmed.split("\n");
        if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.trim().replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-sm leading-7 text-slate-700">
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {renderInline(line)}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default async function PublicPolicyPage({
  params,
}: {
  params: { companySlug: string; policyType: string };
}) {
  const policy = await getPolicy(params.companySlug, params.policyType);
  if (!policy) notFound();

  const lastUpdated = formatDate(policy.lastUpdated);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            ComplianceAI hosted policy
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {policy.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
            {lastUpdated ? <span>Last updated {lastUpdated}</span> : null}
            {policy.version ? <span>Version {policy.version}</span> : null}
          </div>
        </header>

        <MarkdownPolicy markdown={policy.markdown || ""} />

        <footer className="mt-12 border-t border-slate-200 pt-5 text-xs text-slate-500">
          This live policy is hosted by ComplianceAI Pro and updates when monitored website technologies change.
        </footer>
      </article>
    </main>
  );
}
