"use client";

import { Star, ShieldCheck } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Zenvyra replaced our legacy CMP. Cookie blocking and policy generation saved us days of legal work.",
    name: "Sarah Jenkins",
    role: "CEO, TechFlow",
    location: "USA",
    avatar: "SJ",
  },
  {
    quote:
      "Very easy to work with and amazing customer service. The monthly subscription is worth every penny.",
    name: "Patrick M.",
    role: "Founder",
    location: "France",
    avatar: "PM",
  },
  {
    quote:
      "Fast, efficient support. Policies stay up to date with new regulations automatically.",
    name: "Elisabeth K.",
    role: "Operations Lead",
    location: "Germany",
    avatar: "EK",
  },
  {
    quote:
      "Clear format, easy to follow. We deploy it across every client site in our agency.",
    name: "Josh V.",
    role: "Agency Owner",
    location: "Netherlands",
    avatar: "JV",
  },
];

function Card({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <article className="w-[360px] shrink-0 rounded-2xl border border-border-light bg-white p-7 shadow-zenvyra-soft">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-0.5 text-warning" aria-label="5 stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <span className="flex items-center gap-1 rounded-full bg-status-success/10 px-2.5 py-1 text-[10px] font-bold text-status-success">
          <ShieldCheck className="h-3 w-3" />
          Verified
        </span>
      </div>
      <blockquote className="mb-6 text-[15px] leading-relaxed text-text-muted">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-3 border-t border-border-light pt-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-info to-accent text-sm font-bold text-white">
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary">{t.name}</p>
          <p className="text-xs text-text-muted">
            {t.role} · {t.location}
          </p>
        </div>
      </footer>
    </article>
  );
}

export default function TestimonialCarousel() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
      <div className="flex w-max animate-marquee-slow gap-6 py-2">
        {loop.map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
