import Link from "next/link";
import PageScaffold from "@/components/marketing/PageScaffold";

const cards = [
  { title: "Privacy Notice", href: "/privacy", text: "Detailed notice covering collection, purposes, legal bases, sharing, retention, transfers, rights, and US disclosures." },
  { title: "Cookie Policy", href: "/cookies", text: "Cookie categories, similar technologies, consent controls, third-party cookies, and customer responsibilities." },
  { title: "Cookie Preferences", href: "/cookie-preferences", text: "Review optional cookie categories and how choices are handled." },
  { title: "Sub-processors", href: "/sub-processors", text: "Provider categories used to host, secure, bill, support, monitor, and operate Zenvyra." },
  { title: "Do Not Sell or Share", href: "/do-not-sell", text: "US privacy opt-out information for sale, sharing, targeted advertising, and GPC-style signals." },
  { title: "Limit Sensitive Information", href: "/limit-sensitive-info", text: "How to request limits on sensitive personal information where applicable." },
];

const requestTypes = [
  "Access or copy of eligible personal information.",
  "Correction of inaccurate account or contact information.",
  "Deletion of eligible information, subject to legal, billing, security, and backup limits.",
  "Opt out of marketing communications.",
  "Opt out of sale, sharing, or targeted advertising where applicable.",
  "Limit use or disclosure of sensitive personal information where applicable.",
];

export default function PrivacyCenterPage() {
  return (
    <PageScaffold
      title="Privacy Center"
      subtitle="A single place to review Zenvyra privacy notices, choices, request paths, and trust commitments."
      showCta={false}
      sectionClassName="py-10 sm:py-14 lg:py-16"
    >
      <div className="grid gap-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">Privacy controls and notices</h2>
          <p className="mt-3 max-w-4xl text-base leading-8 text-slate-700">
            Zenvyra is designed for business privacy workflows. This center explains our
            own practices and helps visitors, customers, and customer end users find the correct
            privacy page or request path.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:border-orange-200 hover:shadow-md">
              <h2 className="text-xl font-bold text-slate-950">{card.title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">{card.text}</p>
              <p className="mt-5 text-sm font-bold text-orange-700">Open page</p>
            </Link>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">Privacy request paths</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-xl font-bold text-slate-950">If you are our customer or website visitor</h3>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Contact support@zenvyra.com with your account email, workspace name if
                applicable, and the request you want reviewed.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-xl font-bold text-slate-950">If you are an end user of a customer</h3>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Contact the website or business that collected your information. Zenvyra
                generally acts on that customer's instructions for customer-controlled data.
              </p>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {requestTypes.map((item) => (
              <li key={item} className="rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-slate-800">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageScaffold>
  );
}
