import PageScaffold from "@/components/marketing/PageScaffold";

const sections = [
  { title: "DPA-ready operations", text: "We support data processing controls and agreements for customer privacy requirements." },
  { title: "Data rights workflows", text: "Track access, deletion, and rectification requests in your compliance process." },
  { title: "Regional policy checks", text: "Detect policy and consent gaps against GDPR-aligned expectations." },
];

export default function GDPRPage() {
  return (
    <PageScaffold title="GDPR" subtitle="Our commitment to helping teams build and maintain GDPR-aligned systems.">
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

