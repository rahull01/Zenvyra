import Link from "next/link";
import PageScaffold from "@/components/marketing/PageScaffold";

const links = [
  {
    title: "Privacy Policy",
    href: "/privacy",
    text: "Data collection, purposes, legal bases, sharing, retention, transfers, and user rights.",
  },
  {
    title: "Service Terms",
    href: "/terms",
    text: "SaaS usage rules, account responsibility, customer content, payments, acceptable use, disclaimers, and liability limits.",
  },
  {
    title: "Cookie Policy",
    href: "/cookies",
    text: "Cookie categories, third-party technologies, consent controls, customer responsibilities, and update process.",
  },
  {
    title: "Refund Policy",
    href: "/refund-policy",
    text: "Subscriptions, trials, setup packages, duplicate charges, chargebacks, cancellations, and refund requests.",
  },
];

const commitments = [
  "Zenvyra is software, not a law firm.",
  "Generated policies and reports are operational tools, not guaranteed legal compliance.",
  "Customers are responsible for reviewing outputs before publishing them.",
  "High-risk legal decisions should be reviewed with qualified counsel.",
];

export default function LegalPage() {
  return (
    <PageScaffold
      title="Legal Center"
      subtitle="Core policies for privacy, service use, cookies, refunds, and operational compliance boundaries."
      showCta={false}
      sectionClassName="py-10 sm:py-14 lg:py-16"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-950">{link.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{link.text}</p>
            <p className="mt-5 text-sm font-semibold text-orange-700">Read policy</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Zenvyra legal position</h2>
        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-700">
          Our policies are written to be clear for customers and cautious about the boundary
          between software automation and legal advice.
        </p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {commitments.map((item) => (
            <li key={item} className="rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-slate-800">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold text-slate-950">Contact</h2>
        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-700">
          For privacy, billing, account, or legal policy questions, contact support@zenvyra.com
          with your workspace name, account email, and the policy or issue you want reviewed.
        </p>
      </section>
    </PageScaffold>
  );
}
