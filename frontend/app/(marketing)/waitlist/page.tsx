"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Rocket, Sparkles, Users, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { track } from "@/lib/analytics";
import PageScaffold from "@/components/marketing/PageScaffold";

const benefits = [
  { icon: Zap, title: "50% off lifetime", description: "Founding AI startups lock in half-price Starter or Pro for as long as they stay subscribed." },
  { icon: Users, title: "Founder concierge onboarding", description: "One 30-minute setup call to inventory your AI systems and draft your first transparency notices." },
  { icon: Rocket, title: "First access to launch features", description: "Be the first to use AI Act gap reports, shareable certificates, and DSAR automation." },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid work email.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/scan/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: company || "Waitlist signup",
          email: email.trim(),
          websiteUrl: "",
          readinessScore: 0,
          issueCount: 0,
          desiredPath: "waitlist_lifetime_50",
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setSubmitted(true);
      track("waitlist_signup", { email: email.trim(), company });
      toast.success("You're on the waitlist!");
    } catch (error: any) {
      toast.error(error?.message || "Could not join waitlist. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageScaffold
      eyebrow="Limited founder offer"
      headline="First 100 AI startups get 50% off lifetime"
      subheadline="Join the waitlist before our Product Hunt launch and lock in founder pricing for EU AI Act compliance."
      primaryCta={{ label: "Join waitlist", href: "#waitlist-form" }}
      secondaryCta={{ label: "Try free scanner", href: "/free-privacy-scanner" }}
    >
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Why join now?</h2>
              <p className="mt-4 text-lg text-text-secondary">
                We are onboarding 100 AI-first startups this month. Waitlist members get lifetime founder pricing, concierge onboarding, and early access to every new compliance feature.
              </p>
              <div className="mt-8 space-y-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">{benefit.title}</h3>
                      <p className="mt-1 text-sm text-text-secondary">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm text-text-secondary">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background-primary bg-background-tertiary text-xs font-bold text-text-tertiary">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>AI startup founders are already reserving spots.</p>
              </div>
            </div>

            <div id="waitlist-form" className="rounded-3xl border border-border-light bg-background-primary p-8 shadow-card">
              {submitted ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10 text-status-success">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">You're on the list!</h3>
                  <p className="mt-2 text-text-secondary">
                    Check your inbox for your founder discount code. We will reach out within 48 hours to schedule onboarding.
                  </p>
                  <Link href="/free-privacy-scanner" className="mt-6 inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try the free scanner
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">Reserve your founder spot</h3>
                    <p className="mt-2 text-sm text-text-secondary">No credit card required. Limited to the first 100 qualifying AI startups.</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text-primary">Work email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="founder@aistartup.com"
                      className="h-12 w-full rounded-xl border border-border-light bg-background-secondary px-4 text-text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text-primary">Company name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                      placeholder="Your AI startup"
                      className="h-12 w-full rounded-xl border border-border-light bg-background-secondary px-4 text-text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
                    {submitting ? "Joining..." : "Join the waitlist"}
                  </button>
                  <p className="text-xs leading-5 text-text-secondary">
                    By joining, you agree to our{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
                    and{" "}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Use</Link>. We will never sell your email.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageScaffold>
  );
}
