import PageScaffold from "@/components/marketing/PageScaffold";

const groups = [
  { title: "Founder community", detail: "Connect with solo founders and product leads solving compliance at scale." },
  { title: "Implementation forum", detail: "Share practical rollout patterns, templates, and technical fixes." },
  { title: "Live sessions", detail: "Monthly walkthroughs on policy updates and product compliance design." },
];

export default function CommunityPage() {
  return (
    <PageScaffold title="Community" subtitle="Learn from peers, share solutions, and stay current on compliance practices.">
      <div className="grid gap-5 md:grid-cols-3">
        {groups.map((group) => (
          <article key={group.title} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-surface-100">{group.title}</h2>
            <p className="mt-2 text-sm leading-6 text-surface-300">{group.detail}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}

