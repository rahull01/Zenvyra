import type { ReactNode } from "react";

type MarketingPageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
  centered?: boolean;
};

export default function MarketingPageHero({
  eyebrow,
  title,
  subtitle,
  children,
  centered = true,
}: MarketingPageHeroProps) {
  return (
    <section className="bg-hero-gradient pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
          <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-accent">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">{subtitle}</p>
          {children && <div className={`mt-8 ${centered ? "flex flex-wrap justify-center gap-4" : ""}`}>{children}</div>}
        </div>
      </div>
    </section>
  );
}
