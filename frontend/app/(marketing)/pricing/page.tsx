import Link from "next/link";
import { ArrowRight, Check, Shield, Sparkles, Star } from "lucide-react";
import PageScaffold from "@/components/marketing/PageScaffold";

const plans = [
    { name: "Starter", price: "$99", details: "For early teams validating compliance basics", items: ["1 property", "Weekly checks", "Policy gap report", "Email support"] },
    { name: "Pro", price: "$299", details: "For SaaS teams shipping every week", items: ["10 properties", "Auto-fix guidance", "Team workflows", "Priority alerts"], featured: true },
    { name: "Enterprise", price: "Custom", details: "For regulated scale and customer security reviews", items: ["Unlimited properties", "SSO and DPA support", "Dedicated success", "Custom reporting"] },
];

export default function PricingPage() {
    return (
        <PageScaffold
            title="Pricing"
            subtitle="Simple plans that start with a scan and scale into a complete compliance workspace."
        >
            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                    <article
                        key={plan.name}
                        className={`relative rounded-[1.75rem] border p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-premium ${
                            plan.featured ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white/85 text-slate-950"
                        }`}
                    >
                        {plan.featured && (
                            <div className="absolute -top-4 left-7 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                <Star className="h-3.5 w-3.5" />
                                Best value
                            </div>
                        )}
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${plan.featured ? "bg-white/10 text-emerald-300" : "bg-slate-950 text-white"}`}>
                            {plan.featured ? <Sparkles className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                        </div>
                        <h3 className="mt-6 text-2xl font-black">{plan.name}</h3>
                        <p className={`mt-2 text-sm font-medium leading-6 ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>{plan.details}</p>
                        <div className="mt-7 flex items-end gap-2">
                            <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                            {plan.price !== "Custom" && <span className={`pb-1 text-sm font-bold ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>/mo</span>}
                        </div>
                        <ul className="mt-7 space-y-3">
                            {plan.items.map((item) => (
                                <li key={item} className={`flex items-center gap-3 text-sm font-semibold ${plan.featured ? "text-slate-200" : "text-slate-700"}`}>
                                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.featured ? "bg-emerald-400/15 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}>
                                        <Check className="h-3.5 w-3.5" />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/signup"
                            className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                                plan.featured ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-slate-100 text-slate-950 hover:bg-slate-200"
                            }`}
                        >
                            {plan.name === "Enterprise" ? "Talk to sales" : "Start free trial"}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </article>
                ))}
            </div>
        </PageScaffold>
    );
}
