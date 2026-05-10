import PageScaffold from "@/components/marketing/PageScaffold";

const links = [
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms", href: "/terms" },
  { title: "Cookie Policy", href: "/cookies" },
  { title: "GDPR", href: "/gdpr" },
];

export default function LegalPage() {
  return (
    <PageScaffold title="Legal" subtitle="Find all legal policies and compliance commitments in one place.">
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-premium">
            <h2 className="text-lg font-semibold text-surface-100">{link.title}</h2>
            <p className="mt-2 text-sm text-surface-300">Read full policy details</p>
          </a>
        ))}
      </div>
    </PageScaffold>
  );
}

