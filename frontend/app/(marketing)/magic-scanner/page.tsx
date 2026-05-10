import PageScaffold from "@/components/marketing/PageScaffold";

const items = [
  { title: "JavaScript and cookie detection", body: "Identify consent, tracking scripts, and banner behavior with browser-aware checks." },
  { title: "Policy surface validation", body: "Verify legal links, wording coverage, and missing disclosures." },
  { title: "Accessibility + privacy overlap", body: "Find compliance gaps that affect both legal risk and inclusive UX." },
];

export default function MagicScannerPage() {
  return (
    <PageScaffold title="Magic Scanner" subtitle="Run a deep compliance scan and get practical, prioritized remediation in seconds.">
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-surface-100">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-surface-300">{item.body}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}

