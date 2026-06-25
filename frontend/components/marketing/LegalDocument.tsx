import Link from "next/link";
import PageScaffold from "@/components/marketing/PageScaffold";

export type LegalSection = {
  title: string;
  body?: string;
  items?: string[];
  rows?: Array<{
    label: string;
    value: string;
  }>;
};

type LegalDocumentProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  effectiveDate?: string;
  intro: string;
  sections: LegalSection[];
};

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Service Terms", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Legal Center", href: "/legal" },
];

export default function LegalDocument({
  eyebrow = "Legal",
  title,
  subtitle,
  effectiveDate = "June 16, 2026",
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <PageScaffold
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      showCta={false}
      sectionClassName="py-10 sm:py-14 lg:py-16"
    >
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Legal pages
            </p>
            <div className="grid gap-1">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-50 px-5 py-6 sm:px-8">
            <p className="text-sm font-semibold text-orange-700">Effective date: {effectiveDate}</p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">{intro}</p>
          </header>

          <div className="divide-y divide-slate-200">
            {sections.map((section, index) => (
              <section key={section.title} className="px-5 py-7 sm:px-8">
                <div className="flex gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-100 text-sm font-bold text-orange-700">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold tracking-tight text-slate-950">
                      {section.title}
                    </h2>
                    {section.body && (
                      <p className="mt-3 max-w-4xl text-base leading-8 text-slate-700">
                        {section.body}
                      </p>
                    )}
                    {section.items && (
                      <ul className="mt-4 grid gap-3">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-3 text-base leading-7 text-slate-700">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.rows && (
                      <dl className="mt-5 overflow-hidden rounded-lg border border-slate-200">
                        {section.rows.map((row) => (
                          <div
                            key={row.label}
                            className="grid gap-2 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:grid-cols-[220px_minmax(0,1fr)]"
                          >
                            <dt className="text-sm font-bold text-slate-950">{row.label}</dt>
                            <dd className="text-sm leading-6 text-slate-700">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <footer className="border-t border-slate-200 bg-slate-50 px-5 py-5 text-sm leading-6 text-slate-600 sm:px-8">
            Zenvyra is software for operational privacy and compliance workflows. It is
            not a law firm and does not provide legal advice. For jurisdiction-specific decisions,
            review these policies with qualified counsel.
          </footer>
        </article>
      </div>
    </PageScaffold>
  );
}
