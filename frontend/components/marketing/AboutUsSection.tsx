"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin, ArrowUpRight } from "lucide-react";

const FOUNDER_IMAGE = "/rahul.png";
const LINKEDIN_URL = "https://www.linkedin.com/in/rahulsingh";

type AboutUsSectionProps = {
  /** Hide section title when embedded on /about */
  embedded?: boolean;
};

export default function AboutUsSection({ embedded = false }: AboutUsSectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-bg-secondary ${embedded ? "py-0" : "py-20 sm:py-28 lg:py-32"}`}
      aria-labelledby={embedded ? undefined : "founder-heading"}
    >
      {/* Ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(230,126,34,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(26,26,46,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!embedded && (
          <div className="mb-12 text-center lg:mb-16 lg:text-left">
            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-accent">
              About Us
            </p>
            <h2
              id="founder-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl"
            >
              Built by operators who care about compliance
            </h2>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="relative rounded-[20px] border border-bg-tertiary bg-white p-6 shadow-card-shadow sm:p-8 lg:p-12"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Bio — left on desktop */}
            <div className="order-2 flex flex-col justify-center space-y-6 text-center lg:order-1 lg:text-left">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  Founder
                </p>
                <h3 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                  Rahul Singh
                </h3>
                <p className="text-lg font-semibold text-accent">Founder & CEO</p>
              </div>

              <p className="mx-auto max-w-lg text-base leading-relaxed text-text-secondary lg:mx-0 lg:text-lg lg:leading-[1.75]">
                Rahul Singh is the Founder & CEO of Zenvyra, focused on building intelligent
                automation solutions that simplify compliance and risk management using AI.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-bg-tertiary bg-bg-secondary px-5 py-3 text-sm font-semibold text-text-primary transition-all duration-300 hover:border-accent/40 hover:bg-accent-light hover:text-accent hover:shadow-floating-element"
                  aria-label="Rahul Singh on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" aria-hidden />
                  Connect on LinkedIn
                  <ArrowUpRight className="h-4 w-4 opacity-60" aria-hidden />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
                >
                  Our story
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 border-t border-bg-tertiary pt-6 lg:justify-start">
                {[
                  { value: "10K+", label: "Businesses served" },
                  { value: "150+", label: "Countries covered" },
                  { value: "AI-first", label: "Readiness automation" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                    <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Portrait — right on desktop */}
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="group relative w-full max-w-[340px] sm:max-w-[380px]">
                <div
                  className="absolute -inset-3 rounded-[24px] bg-gradient-to-br from-accent/20 via-accent-light to-transparent opacity-80 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bg-tertiary shadow-card-hover-shadow ring-1 ring-border-light transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                  <Image
                    src={FOUNDER_IMAGE}
                    alt="Rahul Singh, Founder and CEO of Zenvyra"
                    fill
                    sizes="(max-width: 768px) 85vw, 380px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/25 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
