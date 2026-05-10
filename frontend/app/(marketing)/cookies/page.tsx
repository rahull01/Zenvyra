import PageScaffold from "@/components/marketing/PageScaffold";

const sections = [
  { title: "Essential cookies", text: "Required for authentication, session security, and core platform reliability." },
  { title: "Analytics cookies", text: "Help us understand product usage patterns so we can improve UX and performance." },
  { title: "Control options", text: "You can manage cookie preferences in browser settings and consent controls." },
];

export default function CookiesPage() {
  return (
    <PageScaffold title="Cookie Policy" subtitle="How cookies are used to run and improve the ComplianceAI experience.">
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

