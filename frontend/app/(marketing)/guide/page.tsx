import PageScaffold from "@/components/marketing/PageScaffold";

const sections = [
  { title: "Quick start", text: "Connect your domain, run the first scan, and invite owners for legal and engineering." },
  { title: "Triaging issues", text: "Sort findings by impact and assign remediation directly from your dashboard." },
  { title: "Verification", text: "Re-scan after fixes and track score movements over time." },
];

export default function GuidePage() {
  return (
    <PageScaffold title="Guide" subtitle="A practical walkthrough for setting up Zenvyra in your workflow.">
      <div className="space-y-4">
        {sections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-surface-100">{section.title}</h2>
            <p className="mt-2 text-sm leading-7 text-surface-300">{section.text}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}

