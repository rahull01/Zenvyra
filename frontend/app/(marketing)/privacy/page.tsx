import PageScaffold from "@/components/marketing/PageScaffold";

const sections = [
  { title: "Information we collect", text: "We collect account details, usage signals, and scan configuration needed to run compliance workflows." },
  { title: "How we use it", text: "Data is used to operate scans, improve detection quality, and communicate critical compliance alerts." },
  { title: "Security and retention", text: "Data is encrypted in transit and at rest, with configurable retention windows based on your plan." },
];

export default function PrivacyPage() {
  return (
    <PageScaffold title="Privacy Policy" subtitle="How ComplianceAI handles your data responsibly and transparently.">
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

