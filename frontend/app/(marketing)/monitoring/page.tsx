import PageScaffold from "@/components/marketing/PageScaffold";

const checks = [
  { title: "Release drift alerts", body: "Catch consent and policy regressions immediately after deployments." },
  { title: "Ownership routing", body: "Send issues to legal, product, or engineering based on rule-driven workflows." },
  { title: "Audit timeline", body: "Maintain a complete record of detections, fixes, and verification scans." },
];

export default function MonitoringPage() {
  return (
    <PageScaffold title="Monitoring" subtitle="Continuous compliance monitoring for fast-moving product teams.">
      <div className="grid gap-5 md:grid-cols-3">
        {checks.map((check) => (
          <article key={check.title} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-surface-100">{check.title}</h2>
            <p className="mt-2 text-sm leading-6 text-surface-300">{check.body}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}

