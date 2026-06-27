import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { publicBackendBaseUrl } from "@/lib/publicApi";

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

async function getPolicy(companySlug: string, policyType: string): Promise<PublicPolicy | null> {
  let response: Response;
  try {
    response = await fetchWithTimeout(
      `${publicBackendBaseUrl()}/policies/public/${encodeURIComponent(companySlug)}/${encodeURIComponent(policyType)}`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      },
      3000
    );
  } catch {
    return null;
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    return null;
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

export default async function PublicPolicyPage({
  params,
}: {
  params: { companySlug: string; policyType: string };
}) {
  const policy = await getPolicy(params.companySlug, params.policyType);
  if (!policy) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Policy Not Found</h1>
          <p className="text-slate-600 mb-6">The requested policy could not be found.</p>
          <Link href="/" className="text-accent hover:underline">
            Return to homepage
          </Link>
        </div>
      </main>
    );
  }

  const lastUpdated = formatDate(policy.lastUpdated);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Zenvyra hosted policy
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {policy.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
            {lastUpdated ? <span>Last updated {lastUpdated}</span> : null}
            {policy.version ? <span>Version {policy.version}</span> : null}
          </div>
        </header>

        <div className="prose prose-slate prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-7 prose-li:leading-7">
          <ReactMarkdown>{policy.markdown || ""}</ReactMarkdown>
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-5 text-xs text-slate-500">
          This live policy is hosted by Zenvyra and updates when monitored website technologies change.
        </footer>
      </article>
    </main>
  );
}
