import PageScaffold from "@/components/marketing/PageScaffold";

const releases = [
  { date: "June 2026", title: "Expanded legal center", text: "Added detailed privacy, cookie, service terms, refund, and trust-center pages." },
  { date: "May 2026", title: "Proof workflow updates", text: "Improved readiness evidence, public certificates, and scanner reporting language." },
  { date: "April 2026", title: "Agency support improvements", text: "Added handoff workflows, monitoring views, and client-ready proof report structure." },
];

export default function ProductReleasesPage() {
  return (
    <PageScaffold title="Product Releases" subtitle="Recent Zenvyra platform updates and release notes." showCta={false}>
      <div className="grid gap-4">
        {releases.map((release) => (
          <article key={release.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-orange-700">{release.date}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{release.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{release.text}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}
