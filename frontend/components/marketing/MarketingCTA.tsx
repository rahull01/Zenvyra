import Link from "next/link";
import { ArrowRight } from "lucide-react";

type MarketingCTAProps = {
  title?: string;
  subtitle?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function MarketingCTA({
  title = "Ready to Get Compliant?",
  subtitle = "Join 10,000+ businesses using ComplianceAI Pro. No credit card required.",
  primaryHref = "/auth/signup",
  primaryLabel = "Start Free Trial",
  secondaryHref = "/contact",
  secondaryLabel = "Talk to Sales",
}: MarketingCTAProps) {
  return (
    <section className="bg-cta-banner py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-white/85">{subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-orange shadow-lg transition-all hover:-translate-y-0.5 hover:bg-bg-secondary"
          >
            {primaryLabel}
            <ArrowRight className="h-5 w-5" />
          </Link>
          {secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
