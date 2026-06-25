import PageScaffold from "@/components/marketing/PageScaffold";

const terms = [
  { term: "Controller", definition: "The organization that decides why and how personal information is processed." },
  { term: "Processor", definition: "A service provider that processes personal information on behalf of a controller." },
  { term: "Consent", definition: "A permission signal that may be required before optional cookies, marketing, or certain processing occurs." },
  { term: "DSAR", definition: "A data subject access request or consumer privacy request to access, delete, correct, or export data." },
  { term: "Sub-processor", definition: "A provider used by a processor to help deliver part of a service." },
  { term: "Proof pack", definition: "Operational evidence showing scans, settings, reports, policies, and readiness status." },
];

export default function LegalDictionaryPage() {
  return (
    <PageScaffold title="Legal Dictionary" subtitle="Plain-English privacy and compliance terms used in Zenvyra." showCta={false}>
      <div className="grid gap-4 md:grid-cols-2">
        {terms.map((item) => (
          <article key={item.term} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">{item.term}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.definition}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}
