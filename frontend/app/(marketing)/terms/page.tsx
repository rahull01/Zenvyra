import PageScaffold from "@/components/marketing/PageScaffold";

const sections = [
  { title: "Service terms", text: "Use of ComplianceAI is governed by active subscription terms and responsible platform usage." },
  { title: "Compliance disclaimer", text: "Automation assists your team, but legal interpretation should be validated by counsel where required." },
  { title: "Support and SLA", text: "Support response windows and uptime commitments depend on your active plan level." },
];

export default function TermsPage() {
  return (
    <PageScaffold title="Terms" subtitle="The terms that govern use of the ComplianceAI platform.">
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

