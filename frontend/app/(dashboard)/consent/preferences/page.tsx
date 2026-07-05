"use client";

import React, { useState } from "react";
import { Cookie, Check, Save, ShieldCheck, Settings2 } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";

export default function ConsentPreferencesPage() {
  const [categories, setCategories] = useState({
    necessary: true, // Always true
    analytics: true,
    marketing: false,
    functional: true,
  });

  const handleSave = () => {
    // Handle save
  };

  return (
    <DashboardPageShell
      title="Consent Preference Center"
      subtitle="Configure default behaviors and categories for user opt-in selections."
      icon={Cookie}
      actions={[
        { label: "Save Configuration", href: "/consent/preferences", primary: true, onClick: handleSave },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Customize Panel */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card space-y-6">
          <h3 className="text-base font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-light pb-3">
            <Settings2 className="text-primary h-4.5 w-4.5" />
            Category Configurations
          </h3>

          <div className="space-y-4">
            {/* Necessary */}
            <div className="flex items-start justify-between p-4 bg-background-secondary rounded-2xl border border-border-light">
              <div className="space-y-1 pr-4">
                <span className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  Strictly Necessary Cookies
                  <span className="text-caption bg-status-success/10 text-status-success px-2 py-0.5 rounded font-bold uppercase">Required</span>
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Required to enable core site functionality, billing checkouts, security frameworks, and account session preservation.
                </p>
              </div>
              <input type="checkbox" disabled checked className="rounded text-primary focus:ring-primary h-5 w-5 mt-1 opacity-60" />
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between p-4 bg-background-secondary rounded-2xl border border-border-light">
              <div className="space-y-1 pr-4">
                <span className="text-sm font-bold text-text-primary">Performance & Analytics Cookies</span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Helps us count page visits, evaluate traffic flow sources, and measure marketing channel effectiveness.
                </p>
              </div>
              <input
                type="checkbox"
                checked={categories.analytics}
                onChange={(e) => setCategories({ ...categories, analytics: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-5 w-5 mt-1 cursor-pointer"
              />
            </div>

            {/* Functional */}
            <div className="flex items-start justify-between p-4 bg-background-secondary rounded-2xl border border-border-light">
              <div className="space-y-1 pr-4">
                <span className="text-sm font-bold text-text-primary">Functional Cookies</span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Allows the platform to remember settings, localized languages, support chats, and customer UI preferences.
                </p>
              </div>
              <input
                type="checkbox"
                checked={categories.functional}
                onChange={(e) => setCategories({ ...categories, functional: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-5 w-5 mt-1 cursor-pointer"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between p-4 bg-background-secondary rounded-2xl border border-border-light">
              <div className="space-y-1 pr-4">
                <span className="text-sm font-bold text-text-primary">Targeting & Marketing Cookies</span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Used by advertising networks to build behavioral profiles, serving customized promotional ads across websites.
                </p>
              </div>
              <input
                type="checkbox"
                checked={categories.marketing}
                onChange={(e) => setCategories({ ...categories, marketing: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-5 w-5 mt-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Simulator Panel */}
        <div className="lg:col-span-4 bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="text-caption font-bold text-text-muted uppercase tracking-wider">Preference Dialog Preview</h3>
          <div className="border border-border-light rounded-2xl p-5 bg-background-secondary/30 space-y-4">
            <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <ShieldCheck className="text-primary h-4 w-4" />
              Consent Choices
            </h4>
            <p className="text-caption text-text-secondary leading-relaxed">
              Verify the categories you authorize. Strict essentials remain enabled to load core API frameworks.
            </p>
            <div className="space-y-2 pt-2 border-t border-border-light">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-primary">Essential</span>
                <span className="text-status-success font-bold">Enabled</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-primary">Analytics</span>
                <span className={categories.analytics ? "text-status-success font-bold" : "text-text-muted font-bold"}>
                  {categories.analytics ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-primary">Functional</span>
                <span className={categories.functional ? "text-status-success font-bold" : "text-text-muted font-bold"}>
                  {categories.functional ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-primary">Marketing</span>
                <span className={categories.marketing ? "text-status-success font-bold" : "text-text-muted font-bold"}>
                  {categories.marketing ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
