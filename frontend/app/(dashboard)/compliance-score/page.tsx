"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, CheckCircle, Clock, Sparkles, ArrowUpRight } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ComplianceScorePage() {
  const issues = [
    { id: 1, type: "critical", msg: "Cookie banner loads marketing trackers before user opt-in", fix: "/dashboard/consent/banner" },
    { id: 2, type: "warning", msg: "Missing specific CCPA 'Do Not Sell My Info' preference switch", fix: "/dashboard/consent/preferences" },
    { id: 3, type: "info", msg: "Terms & Conditions draft has not been updated in 90 days", fix: "/dashboard/policies" },
  ];

  return (
    <DashboardPageShell
      title="Compliance Scorecard"
      subtitle="Track real-time security postures, law updates, and dynamic audits."
      icon={ShieldCheck}
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Score Ring Visual */}
        <div className="lg:col-span-4 bg-background-primary border border-border-light rounded-3xl p-6 text-center shadow-card space-y-6">
          <h3 className="font-bold text-caption text-text-muted uppercase tracking-wider">Overall Posture</h3>

          {/* Simple HTML/CSS score circle */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[10px] border-background-secondary" />
            <div className="absolute inset-0 rounded-full border-[10px] border-primary border-r-transparent border-b-transparent animate-spin-slow" />
            <div className="text-center space-y-0.5">
              <span className="text-4xl font-black text-text-primary">82</span>
              <span className="text-caption text-text-muted font-bold block">/100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-bold text-status-warning flex items-center justify-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Good with warnings
            </span>
            <p className="text-caption text-text-secondary leading-relaxed">
              Resolve remaining 3 items to achieve a perfect 100% compliant badge.
            </p>
          </div>
        </div>

        {/* Issues log list */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-light pb-3">
            <AlertTriangle className="text-primary h-4.5 w-4.5" />
            Required Remediation Items
          </h3>
          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background-secondary rounded-2xl border border-border-light gap-4"
              >
                <div className="flex gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
                      issue.type === "critical"
                        ? "bg-status-error"
                        : issue.type === "warning"
                        ? "bg-status-warning"
                        : "bg-status-info"
                    }`}
                  />
                  <div>
                    <span className="text-caption font-bold text-text-muted uppercase tracking-wider">
                      {issue.type} Issue
                    </span>
                    <p className="text-sm font-semibold text-text-primary mt-0.5">{issue.msg}</p>
                  </div>
                </div>
                <Link href={issue.fix}>
                  <Button className="bg-secondary-dark hover:bg-primary text-white text-caption font-bold py-2 rounded-xl shrink-0 gap-1.5">
                    Resolve
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
