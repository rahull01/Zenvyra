"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type MarketingCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  linkLabel?: string;
  index?: number;
};

export function MarketingCard({
  title,
  description,
  icon: Icon,
  href,
  linkLabel = "Learn more",
  index = 0,
}: MarketingCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="standard-card group h-full !p-6 sm:!p-8"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand-orange-light text-brand-orange transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="mt-5 text-xl font-bold text-text-primary">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{description}</p>
      {href && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:text-brand-orange-hover"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </motion.article>
  );
}

export function MarketingCardGrid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const gridClass =
    cols === 4
      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      : cols === 2
        ? "grid gap-6 md:grid-cols-2"
        : "grid gap-6 md:grid-cols-2 lg:grid-cols-3";
  return <div className={gridClass}>{children}</div>;
}
