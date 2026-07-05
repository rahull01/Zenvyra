import PageScaffold from "@/components/marketing/PageScaffold";

const fixes = [
  { title: "Banner behavior fixes", body: "Get compliant cookie banner logic aligned with consent requirements." },
  { title: "Policy snippet updates", body: "Generate targeted legal wording improvements with contextual explanations." },
  { title: "Implementation handoff", body: "Share copy-paste-ready updates with your engineering team." },
];

export default function AutoFixPage() {
  return (
    <PageScaffold title="Auto-Fix" subtitle="Move from detection to remediation with guided, AI-powered fixes.">
      <div className="grid gap-5 md:grid-cols-3">
        {fixes.map((fix) => (
          <article key={fix.title} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-surface-100">{fix.title}</h2>
            <p className="mt-2 text-sm leading-6 text-surface-300">{fix.body}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}

