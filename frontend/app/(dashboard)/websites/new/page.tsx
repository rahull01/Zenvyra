"use client";

import React, { useState } from "react";
import { Globe, ArrowLeft, PlusCircle, CheckCircle } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewWebsitePage() {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [region, setRegion] = useState("global");
  const [frequency, setFrequency] = useState("weekly");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !siteUrl) {
      return;
    }
  };

  return (
    <DashboardPageShell
      title="Register Website Domain"
      subtitle="Add a new domain to monitor cookie configurations and script audits."
      icon={Globe}
    >
      <div className="mb-6">
        <Link
          href="/websites"
          className="inline-flex items-center gap-2 text-caption font-bold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Domains
        </Link>
      </div>

      <div className="max-w-xl bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Website Label Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Marketing Blog"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Website Root Domain URL</label>
            <input
              type="url"
              required
              placeholder="https://www.company.com"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Target Regulation Focus</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
              >
                <option value="global">Global (Multi-Jurisdiction)</option>
                <option value="gdpr">European Union (GDPR)</option>
                <option value="ccpa">United States (CCPA/CPRA)</option>
                <option value="lgpd">Brazil (LGPD)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Scanner Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
              >
                <option value="daily">Daily Compliance Check</option>
                <option value="weekly">Weekly Compliance Check</option>
                <option value="monthly">Monthly Compliance Check</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-button flex justify-center items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Register and Scan Domain
          </Button>
        </form>
      </div>
    </DashboardPageShell>
  );
}
