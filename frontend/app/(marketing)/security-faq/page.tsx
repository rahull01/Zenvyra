import PageScaffold from "@/components/marketing/PageScaffold";

const faqs = [
  { q: "Is Zenvyra a law firm?", a: "No. Zenvyra is software for privacy operations, policy workflows, consent evidence, and readiness reporting." },
  { q: "How is customer data protected?", a: "We use access controls, provider review, logging, secure infrastructure practices, and operational monitoring to protect platform data." },
  { q: "Can reports guarantee compliance?", a: "No. Reports provide operational evidence and recommended review points. Qualified counsel should review legal decisions." },
  { q: "Can I request deletion?", a: "Yes, eligible account deletion or export requests can be sent to support@zenvyra.com, subject to legal, billing, security, and backup limits." },
];

export default function SecurityFaqPage() {
  return (
    <PageScaffold title="Security FAQ" subtitle="Common security, privacy, and compliance questions about Zenvyra." showCta={false}>
      <div className="grid gap-4">
        {faqs.map((item) => (
          <article key={item.q} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">{item.q}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.a}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}
