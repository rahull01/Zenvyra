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
  showHero?: boolean;
  sectionClassName?: string;
  heroExtra?: ReactNode;
};

export default function PageScaffold({
  eyebrow,
  title,
  subtitle,
  children,
  showCta = true,
  showHero = true,
  sectionClassName,
  heroExtra,
}: PageScaffoldProps) {
  const heroEyebrow = eyebrow ?? title;
  const contentSectionClassName = sectionClassName ?? "py-16 sm:py-20 lg:py-24";
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      {showHero && (
        <MarketingPageHero eyebrow={heroEyebrow} title={title} subtitle={subtitle}>
          {heroExtra}
        </MarketingPageHero>
      )}
      <section className={contentSectionClassName}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </section>
      {showCta && <MarketingCTA />}
    </main>
  );
}
