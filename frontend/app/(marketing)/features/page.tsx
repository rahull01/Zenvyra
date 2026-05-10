import Link from "next/link";
import { ArrowRight, Bell, FileText, GaugeCircle, Search, ShieldCheck, Wand2 } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";

const blocks = [
    { icon: Search, title: "Scan every launch surface", text: "Check policies, consent flows, scripts, data rights, and regional requirements from one workflow." },
    { icon: Wand2, title: "Turn findings into fixes", text: "Each issue includes priority, product impact, and implementation-ready guidance for your team." },
    { icon: Bell, title: "Monitor drift continuously", text: "Catch regressions as your site, vendors, and regulatory obligations change." },
    { icon: FileText, title: "Export clean evidence", text: "Generate reports for leadership, customers, auditors, and security reviews without manual cleanup." },
    { icon: ShieldCheck, title: "Protect team access", text: "Keep scans, policies, and remediation work organized with role-ready workspace patterns." },
    { icon: GaugeCircle, title: "Track trust KPIs", text: "Watch score movement, unresolved risk, mean time to fix, and coverage across properties." },
];

export default function FeaturesPage() {
    return (
        <PageScaffold
            title="Features"
            subtitle="A focused operating system for teams that need compliance work to be visible, actionable, and fast."
        >
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {blocks.map((block) => (
                    <article key={block.title} className="group rounded-[1.5rem] border border-slate-200 bg-white/85 p-7 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-premium">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white transition-transform duration-300 group-hover:scale-105">
                            <block.icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-6 text-xl font-black text-slate-950">{block.title}</h3>
                        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{block.text}</p>
                    </article>
                ))}
            </div>

            <section className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-premium md:p-10">
                <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">Free scan</p>
                        <h2 className="mt-3 text-3xl font-black">See your first compliance report in minutes.</h2>
                        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                            Start with one URL, then expand into monitoring, reports, and team workflows when you are ready.
                        </p>
                    </div>
                    <Link href="/signup" className="brand-button inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest">
                        Start free
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </PageScaffold>
    );
}
