"use client";

import React from "react";
import { BarChart3, Users, Eye, CheckCircle2, TrendingUp, Globe2, Sparkles } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";

export default function AnalyticsPage() {
  return (
    <DashboardPageShell
      title="Consent Analytics Dashboard"
      subtitle="Track user opt-in metrics, banner impressions, and compliance conversion rates."
      icon={BarChart3}
      stats={[
        { label: "Total Banner Views", value: "142.8k", trend: "+12.4% vs last week" },
        { label: "Consent Opt-in Rate", value: "88.4%", trend: "Stable (+0.2%)" },
        { label: "Opt-out Requests", value: "1,240", trend: "-4.1%" },
        { label: "Active Tracking Pages", value: "482", trend: "0 issues detected" },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Core Charts Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Conversion rate graph simulated */}
          <div className="bg-surface-card border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex justify-between items-center border-b border-border-light pb-3">
              <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="text-accent h-4.5 w-4.5" />
                Opt-in Trends (Last 7 Days)
              </h3>
              <span className="text-caption font-bold text-text-secondary uppercase bg-background-tertiary px-2.5 py-1 rounded-full">
                7D Daily Average
              </span>
            </div>

            {/* Simulating bar chart with flex and labels */}
            <div className="flex items-end justify-between gap-2 h-48 pt-6">
              {[
                { day: "Mon", val: 82 },
                { day: "Tue", val: 86 },
                { day: "Wed", val: 89 },
                { day: "Thu", val: 87 },
                { day: "Fri", val: 90 },
                { day: "Sat", val: 91 },
                { day: "Sun", val: 88 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-background-tertiary rounded-lg h-36 flex items-end">
                    <div
                      className="bg-accent w-full rounded-lg transition-all duration-500 hover:opacity-80"
                      style={{ height: `${item.val}%` }}
                    />
                  </div>
                  <span className="text-caption font-bold text-text-secondary">{item.day}</span>
                  <span className="text-caption font-bold text-text-primary">{item.val}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Geolocation consent distribution */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-card border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Globe2 className="text-primary h-4.5 w-4.5" />
              Regional Performance
            </h3>
            <div className="space-y-4">
              {[
                { region: "European Union (GDPR)", rate: "91.2%", status: "Strict Opt-in" },
                { region: "United States (CCPA)", rate: "84.5%", status: "Opt-out link active" },
                { region: "Brazil (LGPD)", rate: "89.6%", status: "Consent logged" },
                { region: "Rest of World", rate: "94.1%", status: "Default Consent" },
              ].map((r, idx) => (
                <div key={idx} className="border-b border-border-light pb-3 last:border-none last:pb-0">
                  <div className="flex justify-between text-caption font-bold text-text-primary">
                    <span>{r.region}</span>
                    <span className="text-primary">{r.rate}</span>
                  </div>
                  <div className="flex justify-between text-caption text-text-secondary mt-1 font-semibold">
                    <span>{r.status}</span>
                    <span className="text-status-success">✓ Compliant</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="relative overflow-hidden rounded-3xl border border-border-light bg-surface-card p-6 shadow-card space-y-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_50%)]" />
            <div className="relative">
              <h4 className="font-bold text-sm flex items-center gap-1.5 text-text-primary">
                <Sparkles className="text-accent h-4.5 w-4.5" />
                AI Recommendation
              </h4>
              <p className="text-caption text-text-secondary leading-relaxed mt-3">
                Your opt-in rate is 88.4%. Consider changing banner button colors from dark to brand orange to increase click conversions by up to 4.2% based on aggregate platform models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
