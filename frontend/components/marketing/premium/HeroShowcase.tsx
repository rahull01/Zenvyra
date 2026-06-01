"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
      {/* ambient glow */}
      <motion.div
        aria-hidden
        className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-accent/35 via-accent/[0.10] to-transparent blur-[80px]"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* browser frame */}
      <motion.div
        initial={{ opacity: 0, y: 32, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-border-light bg-white shadow-card-hover-shadow"
        style={{ perspective: 1200 }}
      >
        {/* address bar chrome */}
        <div className="flex items-center gap-2 border-b border-border-light bg-bg-secondary px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex h-8 max-w-[280px] flex-1 items-center rounded-lg bg-white px-3 text-xs text-text-muted border border-border-light">
            <Globe className="mr-2 h-3.5 w-3.5 shrink-0 text-accent" />
            app.complianceai.pro/dashboard
          </div>
        </div>

        {/* sidebar + content */}
        <div className="grid grid-cols-[72px_1fr] gap-0 min-h-[340px]">
          {/* mini sidebar */}
          <div className="border-r border-border-light bg-bg-secondary p-3 space-y-2">
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-md shadow-accent/20">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-8 rounded-lg ${i === 1 ? "bg-accent/90" : "bg-border-light"}`}
              />
            ))}
          </div>

          {/* main content */}
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Compliance score</p>
                <p className="text-2xl font-bold text-text-primary">94<span className="text-lg text-accent">/100</span></p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-accent-light px-2.5 py-1 text-[10px] font-bold text-accent">
                <TrendingUp className="h-3 w-3" /> +12%
              </span>
            </div>

            {/* bar chart */}
            <div className="mb-4 flex h-24 items-end gap-1.5 rounded-xl bg-accent/[0.04] p-3 border border-accent/10">
              {[40, 65, 45, 80, 55, 90, 70, 95, 85, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className="flex-1 rounded-sm bg-gradient-to-t from-accent to-accent/40"
                />
              ))}
            </div>

            {/* status rows */}
            <div className="space-y-2" role="list">
              {[
                { label: "GDPR Policy", status: "Active", ok: true },
                { label: "Cookie Consent", status: "Live", ok: true },
                { label: "CCPA Opt-out", status: "Synced", ok: true },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-lg border border-accent/10 bg-accent/[0.04] px-3 py-2.5"
                >
                  <span className="text-xs font-medium text-text-primary">{row.label}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-accent">
                    <CheckCircle2 className="h-3 w-3" />{row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating notification card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute -right-2 top-8 z-20 hidden rounded-xl border border-accent/15 bg-white p-3 shadow-card-hover-shadow backdrop-blur-sm sm:block lg:-right-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light">
            <CheckCircle2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">Scan complete</p>
            <p className="text-sm font-bold text-text-primary">0 critical issues</p>
          </div>
        </div>
      </motion.div>

      {/* AI Auto-Fix floating card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
        className="absolute -left-2 bottom-12 z-20 hidden rounded-xl border border-accent/15 bg-white p-3 shadow-card-hover-shadow sm:block lg:-left-8"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <div>
            <p className="text-[10px] text-text-muted">AI Auto-Fix</p>
            <p className="text-xs font-bold text-text-primary">3 fixes applied</p>
          </div>
        </div>
      </motion.div>

      {/* live monitoring CTA */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-accent/30 bg-accent px-4 py-2 text-xs font-bold text-white shadow-[0_0_18px_rgba(230,126,34,0.30)]"
      >
        <Activity className="h-3.5 w-3.5" />
        Live monitoring active
      </motion.div>
    </div>
  );
}