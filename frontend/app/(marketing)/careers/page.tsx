import PageScaffold from "@/components/marketing/PageScaffold";

const principles = [
  {
    title: "Privacy-aware product work",
    text: "Every role touches trust. We expect candidates to care about clear user disclosures, secure defaults, and product decisions that can be explained during review.",
  },
  {
    title: "Practical compliance, not theatre",
    text: "We build workflows that help teams document evidence, review risks, and make better decisions without pretending software replaces qualified legal advice.",
  },
  {
    title: "Remote-friendly execution",
    text: "We value written clarity, async collaboration, and ownership. Good decisions should be traceable, not trapped in meetings.",
  },
];

const hiringProcess = [
  "Application review focused on relevant product, engineering, design, security, or compliance experience.",
  "Practical conversation about how you think through customer trust, tradeoffs, and execution.",
  "Role-specific work sample or portfolio review where needed.",
  "Founder or team conversation covering ownership, communication, and values.",
  "Offer, onboarding, access review, and confidentiality/security setup.",
];

const roles = [
  {
    title: "Product Engineer",
    status: "Future opening",
    text: "Frontend or full-stack engineer who can build clear compliance workflows, dashboards, and customer-facing trust pages.",
  },
  {
    title: "Privacy Operations Specialist",
    status: "Future opening",
    text: "Operator who understands consent workflows, policy operations, website evidence, and customer support for privacy readiness.",
  },
  {
    title: "Developer Advocate",
    status: "Future opening",
    text: "Technical communicator who can turn scanner results, integrations, and compliance workflows into clear guides and examples.",
  },
];

export default function CareersPage() {
  return (
    <PageScaffold
      title="Careers"
      subtitle="Help build privacy and compliance workflow software with clear boundaries, useful automation, and customer trust at the center."
      showCta={false}
    >
      <div className="grid gap-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-700">Hiring note</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950">We are building carefully</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
            Zenvyra is founder-led and early. We publish future roles so candidates can
            understand the direction, but we do not want to imply a role is actively open unless we
            are ready to interview. If a role is marked as future opening, you can still introduce
            yourself through contact@zenvyra.com.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {principles.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">Future roles</h2>
          <div className="mt-6 grid gap-4">
            {roles.map((role) => (
              <article key={role.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-bold text-slate-950">{role.title}</h3>
                  <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                    {role.status}
                  </span>
                </div>
                <p className="mt-3 text-base leading-7 text-slate-700">{role.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">Hiring process and candidate privacy</h2>
          <ol className="mt-5 grid gap-3">
            {hiringProcess.map((step, index) => (
              <li key={step} className="flex gap-3 text-base leading-7 text-slate-700">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-100 text-sm font-bold text-orange-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-base leading-8 text-slate-700">
            Candidate information is used for recruitment, evaluation, communication, security, and
            legal obligations. We do not ask for payment, banking credentials, government IDs, or
            sensitive documents before a legitimate offer and verified onboarding process.
          </p>
        </section>
      </div>
    </PageScaffold>
  );
}
