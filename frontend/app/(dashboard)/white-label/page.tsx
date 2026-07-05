"use client";

import React, { useEffect, useState } from "react";
import { Palette, Globe, Layout, Save, CheckCircle } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";

export default function WhiteLabelSettingsPage() {
  const [subdomain, setSubdomain] = useState("privacy.mycompany.com");
  const [primaryColor, setPrimaryColor] = useState("");
  const [textColor, setTextColor] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    const accent = getComputedStyle(root).getPropertyValue("--accent").trim();
    const textDark = getComputedStyle(root).getPropertyValue("--text-dark").trim();

    if (accent) setPrimaryColor(accent);
    if (textDark) setTextColor(textDark);
  }, []);

  const handleSave = () => {
  };

  return (
    <DashboardPageShell
      title="White-Label Branding"
      subtitle="Customize domains, styles, logos, and layouts to embed your legal policies seamlessly."
      icon={Palette}
      actions={[
        { label: "Save Custom Branding", href: "/white-label", primary: true, onClick: handleSave },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Settings panel left */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card space-y-6">
          <h3 className="text-base font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-light pb-3">
            <Layout className="text-primary h-4.5 w-4.5" />
            Custom Domain & Styling
          </h3>

          <div className="space-y-4">
            {/* Subdomain Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Globe className="h-4 w-4 text-primary" /> Custom Subdomain CNAMES
              </label>
              <input
                type="text"
                placeholder="privacy.yourdomain.com"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
              />
              <span className="text-[10px] text-text-muted leading-relaxed block font-semibold">
                Point your DNS CNAME record to <code>cname.zenvyra.com</code> for automated SSL certificate mapping.
              </span>
            </div>

            {/* Colors picker */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Primary Accent Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-12 rounded-lg border border-border-medium cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 text-sm px-3 rounded-xl border border-border-medium outline-none focus:border-accent bg-background-secondary text-text-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Text / Dark Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-10 w-12 rounded-lg border border-border-medium cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 text-sm px-3 rounded-xl border border-border-medium outline-none focus:border-accent bg-background-secondary text-text-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview card right */}
        <div className="lg:col-span-4 bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Public Policy Domain Preview</h3>
          <div className="border border-border-light rounded-2xl p-5 bg-background-secondary/30 space-y-3">
            <span className="text-[9px] font-mono text-text-muted break-all leading-normal block border-b border-border-light pb-2">
              https://{subdomain || "privacy.yourcompany.com"}/privacy-policy
            </span>
            <div className="space-y-2">
              {/* Header preview */}
              <div className="flex justify-between items-center pb-2 border-b border-black/5">
                <span className="text-xs font-black" style={{ color: textColor }}>BrandLogo</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: primaryColor + "20", color: primaryColor }}>
                  Privacy Center
                </span>
              </div>
              {/* Paragraph preview */}
              <h5 className="text-xs font-bold mt-2" style={{ color: textColor }}>Privacy Policy Statement</h5>
              <div className="w-full bg-border-light h-1.5 rounded" />
              <div className="w-4/5 bg-border-light h-1.5 rounded" />
              <div className="w-2/3 bg-border-light h-1.5 rounded" />
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
