import PageScaffold from "@/components/marketing/PageScaffold";

const systems = [
  { name: "Scanning API", status: "Operational", uptime: "99.99%" },
  { name: "Monitoring jobs", status: "Operational", uptime: "99.97%" },
  { name: "Alerts and notifications", status: "Operational", uptime: "99.95%" },
  { name: "Dashboard and exports", status: "Operational", uptime: "99.98%" },
];

export default function StatusPage() {
  return (
    <PageScaffold title="Status" subtitle="Live service health and historical uptime for core platform systems.">
      <div className="space-y-3">
        {systems.map((system) => (
          <article key={system.name} className="flex flex-col gap-3 rounded-2xl border border-surface-700 bg-white p-5 shadow-card md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-surface-100">{system.name}</h2>
              <p className="text-sm text-surface-400">30-day uptime: {system.uptime}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{system.status}</span>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}

