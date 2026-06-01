"use client";

import { useState } from "react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Cookie } from "lucide-react";

const TABS = ["Design", "Content", "Behavior", "Advanced"] as const;

export default function ConsentBannerPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Design");
  const [title, setTitle] = useState("We value your privacy");
  const [description, setDescription] = useState(
    "We use cookies to enhance your experience, analyze traffic, and personalize content."
  );

  return (
    <DashboardPageShell
      title="Cookie Consent Banner"
      subtitle="Customize how visitors see and manage cookies on your website."
      icon={Cookie}
      actions={[
        { label: "Reset to Default", href: "/dashboard/consent/banner", primary: false },
        { label: "Save Changes", href: "/dashboard/consent/banner", primary: true },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="standard-card !transform-none hover:!translate-y-0">
          <div className="flex gap-1 border-b border-border-light">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === t
                    ? "border-b-2 border-primary text-primary"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            {tab === "Design" && (
              <>
                <p className="text-sm font-medium text-text-primary">Banner style</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Bottom Bar", "Modal", "Sidebar"].map((style, i) => (
                    <button
                      key={style}
                      type="button"
                      className={`rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                        i === 0
                          ? "border-2 border-primary bg-primary-light/30 text-primary"
                          : "border-border-light hover:border-border-medium"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </>
            )}
            {tab === "Content" && (
              <>
                <label className="block text-sm font-medium text-text-primary">Banner title</label>
                <input className="text-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                <label className="block text-sm font-medium text-text-primary">Description</label>
                <textarea
                  className="text-input min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </>
            )}
            {(tab === "Behavior" || tab === "Advanced") && (
              <p className="text-sm text-text-secondary">
                Configure {tab.toLowerCase()} settings including consent mode, geolocation, Google Consent Mode, and IAB TCF 2.3.
              </p>
            )}
          </div>
        </div>
        <div className="sticky top-24">
          <div className="rounded-2xl border border-border-light bg-background-secondary p-6">
            <p className="text-caption font-bold uppercase tracking-wider text-text-tertiary">Live Preview</p>
            <div className="mt-4 min-h-[200px] rounded-xl border border-dashed border-border-medium bg-background-primary p-4">
              <div className="rounded-lg border border-border-light bg-background-primary p-4 shadow-card">
                <p className="font-semibold text-text-primary">{title}</p>
                <p className="mt-2 text-xs text-text-secondary">{description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="btn-primary !py-2 !px-4 text-caption">
                    Accept All
                  </button>
                  <button type="button" className="btn-secondary !py-2 !px-4 text-caption">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
