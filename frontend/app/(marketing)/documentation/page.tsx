import PageScaffold from "@/components/marketing/PageScaffold";

const docs = [
  { title: "Getting started", text: "Set up your first workspace, scan target domains, and configure owners." },
  { title: "API and webhooks", text: "Automate scans and receive issue events in your internal systems." },
  { title: "Role permissions", text: "Configure least-privilege access for legal, engineering, and operations teams." },
  { title: "Reporting", text: "Export score trends, policy history, and issue resolution timelines." },
];

export default function DocumentationPage() {
  return (
    <PageScaffold title="Documentation" subtitle="Everything you need to implement and operate Zenvyra effectively.">
      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <article key={doc.title} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-surface-100">{doc.title}</h2>
            <p className="mt-2 text-sm leading-6 text-surface-300">{doc.text}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}

