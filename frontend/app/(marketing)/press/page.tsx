import PageScaffold from "@/components/marketing/PageScaffold";

const facts = [
  { label: "Company", value: "Zenvyra" },
  { label: "Category", value: "Privacy readiness, consent workflow, website scanning, policy drafting, and compliance evidence software." },
  { label: "Founder", value: "Rahul Singh" },
  { label: "Positioning", value: "Operational privacy and AI readiness workflows, not legal advice or legal certification." },
  { label: "Media contact", value: "press@zenvyra.com" },
];

const updates = [
  {
    date: "June 2026",
    title: "Expanded public legal and trust center",
    text: "Zenvyra added detailed privacy, cookie, service terms, refund, sub-processor, sensitive information, and opt-out pages.",
  },
  {
    date: "June 2026",
    title: "Privacy notice redesign",
    text: "The public Privacy Notice now includes key summaries, table of contents, detailed processing sections, retention disclosures, and US privacy disclosures.",
  },
  {
    date: "May 2026",
    title: "Readiness proof positioning",
    text: "Product language was tightened to distinguish operational privacy evidence from guaranteed legal compliance or legal certification.",
  },
];

export default function PressPage() {
  return (
    <PageScaffold
      title="Updates and Press"
      subtitle="Company facts, product updates, and media contact information for Zenvyra."
      showCta={false}
    >
      <div className="grid gap-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">Company fact sheet</h2>
          <dl className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            {facts.map((fact) => (
              <div key={fact.label} className="grid gap-2 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)]">
                <dt className="text-sm font-black text-slate-950">{fact.label}</dt>
                <dd className="text-sm leading-6 text-slate-700">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">Product updates</h2>
          <div className="mt-6 grid gap-4">
            {updates.map((update) => (
              <article key={update.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold text-orange-700">{update.date}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-950">{update.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-700">{update.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">Media inquiries</h2>
          <p className="mt-3 max-w-4xl text-base leading-8 text-slate-700">
            For founder interviews, product background, screenshots, or brand assets, contact
            press@zenvyra.com. We do not publish unverified funding, customer, security, or
            certification claims.
          </p>
        </section>
      </div>
    </PageScaffold>
  );
}
