import type { ReactNode } from "react";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import MarketingCTA from "@/components/marketing/MarketingCTA";

type PageScaffoldProps = {
  /** Orange label above title — defaults to title when omitted */
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  showCta?: boolean;
  heroExtra?: ReactNode;
};

export default function PageScaffold({
  eyebrow,
  title,
  subtitle,
  children,
  showCta = true,
  heroExtra,
}: PageScaffoldProps) {
  const heroEyebrow = eyebrow ?? title;
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <MarketingPageHero eyebrow={heroEyebrow} title={title} subtitle={subtitle}>
        {heroExtra}
      </MarketingPageHero>
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </section>
      {showCta && <MarketingCTA />}
    </main>
  );
}
