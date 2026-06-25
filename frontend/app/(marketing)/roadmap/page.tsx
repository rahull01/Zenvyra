import PageScaffold from "@/components/marketing/PageScaffold";

const items = [
  { quarter: "Now", title: "Policy and consent workflow hardening", text: "Improved hosted policies, consent records, scan evidence, and customer-facing proof pages." },
  { quarter: "Next", title: "Privacy request workflows", text: "Expanded DSAR and US consumer request intake, verification, assignment, and export flows." },
  { quarter: "Later", title: "More regional readiness packs", text: "Additional privacy and AI readiness checks for UK, EU, US state, and agency workflows." },
];

export default function RoadmapPage() {
  return (
    <PageScaffold title="Product Roadmap" subtitle="What Zenvyra is building next for privacy operations and proof workflows." showCta={false}>
      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-orange-700">{item.quarter}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{item.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.text}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}
