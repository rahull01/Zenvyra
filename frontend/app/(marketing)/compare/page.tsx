"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

/**
 * Comparison page. Truthful comparison with three named competitors.
 *
 * Rules:
 *  - Only claim features Zenvyra actually has in production.
 *  - Use measured language ("includes", "supports", "designed for"),
 *    not superlatives ("best", "industry-leading", "the only").
 *  - For competitors, describe what they are generally known for
 *    without making specific capability claims we cannot verify.
 *  - Update this file when a new product capability is added or removed.
 */
export default function ComparePage() {
    const onCtaClick = (target: string) => () => track("compare_cta_click", { target });

    return (
        <div className="min-h-screen bg-background">
            <section className="px-4 py-16 md:py-24 max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                    How Zenvyra compares
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
                    A side-by-side look at Zenvyra alongside three well-known
                    consent management and policy platforms. The list reflects
                    each tool's public documentation at the time of writing.
                    Capabilities change — if you spot something out of date,
                    please email <a className="underline" href="mailto:support@zenvyra.com">support@zenvyra.com</a>.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                    No tool listed below should be assumed to be a substitute
                    for legal advice. See{" "}
                    <Link href="/legal/disclaimer" className="underline">
                        our disclaimer
                    </Link>
                    .
                </p>
            </section>

            <section className="px-4 pb-16 max-w-6xl mx-auto overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="text-left">
                            <th className="p-3 align-bottom min-w-[200px]">Capability</th>
                            <th className="p-3 align-bottom min-w-[140px]">Zenvyra</th>
                            <th className="p-3 align-bottom min-w-[140px]">OneTrust</th>
                            <th className="p-3 align-bottom min-w-[140px]">TrustArc</th>
                            <th className="p-3 align-bottom min-w-[140px]">Cookiebot</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <Row
                            label="EU AI Act readiness assessment"
                            zenvyra="AI system inventory, classification, gap register, proof pack"
                            a="Limited"
                            b="Limited"
                            c="Not in core product"
                        />
                        <Row
                            label="Cookie / tracker scanning"
                            zenvyra="Yes — daily, with drift alerts"
                            a="Yes"
                            b="Yes"
                            c="Yes"
                        />
                        <Row
                            label="Consent banner"
                            zenvyra="Yes — cross-domain consent sharing"
                            a="Yes"
                            b="Yes"
                            c="Yes"
                        />
                        <Row
                            label="Privacy + cookie + terms policy drafts"
                            zenvyra="Yes — versioned, with public URLs"
                            a="Yes — templates"
                            b="Yes — templates"
                            c="Templates only"
                        />
                        <Row
                            label="DSAR portal"
                            zenvyra="Yes (Pro and above)"
                            a="Yes"
                            b="Yes"
                            c="No"
                        />
                        <Row
                            label="Public readiness certificate"
                            zenvyra="Yes — privacy-safe, 90-day expiry, revocable"
                            a="No"
                            b="No"
                            c="No"
                        />
                        <Row
                            label="White-label proof packs"
                            zenvyra="Yes (Agency)"
                            a="Yes (Enterprise)"
                            b="Yes"
                            c="No"
                        />
                        <Row
                            label="Multi-site dashboard"
                            zenvyra="Up to 50 sites (Agency)"
                            a="Yes"
                            b="Yes"
                            c="Yes"
                        />
                        <Row
                            label="Open API + scoped API keys"
                            zenvyra="Yes — EVIDENCE_WRITE / SYSTEMS_READ / SYSTEMS_WRITE"
                            a="Yes"
                            b="Yes"
                            c="Limited"
                        />
                        <Row
                            label="Webhooks (HMAC-signed)"
                            zenvyra="Yes"
                            a="Yes"
                            b="Yes"
                            c="No"
                        />
                        <Row
                            label="Pricing entry tier"
                            zenvyra="Free (1 site)"
                            a="Quote-based"
                            b="Quote-based"
                            c="Free tier (limited)"
                        />
                        <Row
                            label="Transparent pricing page"
                            zenvyra="Yes — published rates"
                            a="Quote-based"
                            b="Quote-based"
                            c="Yes"
                        />
                    </tbody>
                </table>
                <p className="mt-4 text-xs text-muted-foreground">
                    Legend: <Check className="inline w-4 h-4" aria-label="Yes" /> =
                    full support. "Limited" = the feature exists in some form
                    but is not the platform's primary focus. "Not in core product"
                    = requires a third-party add-on or is unavailable.
                </p>
            </section>

            <section className="px-4 py-16 md:py-24 max-w-6xl mx-auto bg-muted/30">
                <div className="max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Where Zenvyra is designed differently
                    </h2>
                    <ul className="mt-6 space-y-4">
                        <Bullet>
                            <strong>AI Act readiness is the core, not an add-on.</strong>
                            {" "}Zenvyra starts with the EU AI Act — risk
                            classification, evidence gaps, proof packs — and
                            wraps the supporting cookie, policy, DSAR, and
                            consent workflows around it.
                        </Bullet>
                        <Bullet>
                            <strong>Public, privacy-safe certificates.</strong>
                            {" "}Customers can publish a public verification
                            page that shows risk level, last assessed date, and
                            ruleset version — without leaking private evidence.
                        </Bullet>
                        <Bullet>
                            <strong>Transparent pricing.</strong>
                            {" "}Starter, Growth, Pro, and Agency plans are
                            listed publicly. No quote-based enterprise tier for
                            customers who do not need it.
                        </Bullet>
                        <Bullet>
                            <strong>Honest copy.</strong>
                            {" "}Zenvyra describes itself as readiness
                            automation software, not legal certification. See{" "}
                            <Link href="/legal/disclaimer" className="underline">
                                our disclaimer
                            </Link>
                            .
                        </Bullet>
                    </ul>
                </div>
            </section>

            <section className="px-4 py-16 md:py-24 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Button asChild>
                        <Link
                            href="/auth/signup"
                            onClick={onCtaClick("signup")}
                        >
                            Start free
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link
                            href="/products/cookie-scanner"
                            onClick={onCtaClick("scanner")}
                        >
                            Run the free scanner
                        </Link>
                    </Button>
                </div>
                <p className="mt-6 text-sm text-muted-foreground max-w-2xl">
                    Want to add a vendor to this comparison? Email{" "}
                    <a className="underline" href="mailto:support@zenvyra.com">support@zenvyra.com</a>
                    {" "}with the platform name and what to highlight.
                </p>
            </section>
        </div>
    );
}

function Row({
    label,
    zenvyra,
    a,
    b,
    c,
}: {
    label: string;
    zenvyra: string;
    a: string;
    b: string;
    c: string;
}) {
    return (
        <tr>
            <th className="p-3 text-left font-medium align-top">{label}</th>
            <td className="p-3 align-top font-medium">{zenvyra}</td>
            <td className="p-3 align-top text-muted-foreground">{a}</td>
            <td className="p-3 align-top text-muted-foreground">{b}</td>
            <td className="p-3 align-top text-muted-foreground">{c}</td>
        </tr>
    );
}

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-3">
            <Check className="mt-1 w-5 h-5 shrink-0" aria-hidden />
            <span>{children}</span>
        </li>
    );
}

// Avoid the unused-import lint warning for Minus (kept for future use
// when adding an explicit "no" column).
void Minus;
