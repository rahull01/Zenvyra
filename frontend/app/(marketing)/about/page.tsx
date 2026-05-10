import PageScaffold from "@/components/marketing/PageScaffold";

const principles = [
    { title: "Trust by default", description: "Every workflow is designed to create confidence for customers and regulators." },
    { title: "Operational clarity", description: "Compliance data should be understandable to product, legal, and engineering at once." },
    { title: "Speed without shortcuts", description: "Automation should reduce risk, not hide it." },
];

export default function AboutPage() {
    return (
        <PageScaffold
            title="About ComplianceAI"
            subtitle="Built for companies that treat compliance as a product experience, not a checkbox."
        >
            <section className="grid gap-6 lg:grid-cols-5">
                <article className="rounded-3xl border border-surface-700 bg-white p-8 shadow-card lg:col-span-3">
                    <h2 className="text-2xl font-semibold text-surface-100">Founder story: Rahul Singh</h2>
                    <p className="mt-4 text-sm leading-7 text-surface-300">
                        ComplianceAI started as a solo founder project by Rahul Singh after seeing teams struggle with fragmented legal and product workflows.
                        Shipping features was fast, but validating regulatory impact was slow and expensive. Rahul built a practical AI-first workflow that could
                        scan, explain, and fix issues in one place, so smaller SaaS teams could operate with enterprise-level trust.
                    </p>
                    <p className="mt-4 text-sm leading-7 text-surface-300">
                        Today, the mission remains simple: make global compliance workflows clean, fast, and reliable for every modern product team.
                    </p>
                </article>
                <aside className="rounded-3xl border border-brand-200 bg-brand-50/70 p-8 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-surface-100">Mission</h3>
                    <p className="mt-2 text-sm text-surface-300">Help every internet business run high-trust operations without legal bottlenecks.</p>
                    <h3 className="mt-6 text-lg font-semibold text-surface-100">Vision</h3>
                    <p className="mt-2 text-sm text-surface-300">Compliance systems that feel as intuitive and elegant as modern product tools.</p>
                </aside>
            </section>
            <section className="mt-8 grid gap-5 md:grid-cols-3">
                {principles.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-surface-700 bg-white p-6 shadow-card">
                        <h3 className="text-lg font-semibold text-surface-100">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-surface-300">{item.description}</p>
                    </article>
                ))}
            </section>
        </PageScaffold>
    );
}
