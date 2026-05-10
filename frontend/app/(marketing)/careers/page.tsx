import PageScaffold from "@/components/marketing/PageScaffold";

const roles = [
  { title: "Senior Frontend Engineer", location: "Remote", type: "Full-time" },
  { title: "Product Designer", location: "Remote", type: "Full-time" },
  { title: "Developer Advocate", location: "Hybrid", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <PageScaffold title="Careers" subtitle="Help us build premium compliance tools that internet businesses trust.">
      <div className="space-y-4">
        {roles.map((role) => (
          <article key={role.title} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-surface-100">{role.title}</h2>
            <p className="mt-1 text-sm text-surface-400">{role.location} · {role.type}</p>
            <p className="mt-3 text-sm text-surface-300">We are looking for builders who care deeply about product clarity and user trust.</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}

