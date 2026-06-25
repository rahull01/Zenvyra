"use client";

import React, { useState } from "react";
import { Boxes, Check, ArrowUpRight, Cpu, Clipboard } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const initialApps = [
  { id: "gtm", name: "Google Tag Manager", desc: "Sync cookies automatically and handle Google Consent Mode v2 scripts.", connected: true, tag: "Consent Integration" },
  { id: "shopify", name: "Shopify Plugin", desc: "Inject geo-aware cookie prompts onto your checkout layouts.", connected: false, tag: "eCommerce Store" },
  { id: "slack", name: "Slack Alerts", desc: "Ping internal privacy channels when DSAR requests are submitted.", connected: false, tag: "Dev Notifications" },
  { id: "zapier", name: "Zapier", desc: "Trigger automated compliance actions and export customer logs.", connected: false, tag: "Workflows" },
  { id: "wordpress", name: "WordPress Plugin", desc: "Embed policy CDNs directly using our dedicated shortcode module.", connected: true, tag: "CMS Embed" },
];

const bannerSnippet = '<script src="https://app.zenvyra.com/api/v1/banner/YOUR_SITE_ID/bundle.js" async></script>';
const gtmSnippet = "https://app.zenvyra.com/api/v1/banner/YOUR_SITE_ID/bundle.js";
const reactSnippet = `import Script from "next/script";

export function ZenvyraBanner() {
  return <Script src="https://app.zenvyra.com/api/v1/banner/YOUR_SITE_ID/bundle.js" strategy="afterInteractive" />;
}`;

const installGuides = [
  {
    name: "Shopify",
    href: "/docs/shopify-installation-guide",
    snippet: bannerSnippet,
    checklist: ["Add storefront snippet", "Review checkout limitations", "Verify certificate badge"],
  },
  {
    name: "WordPress",
    href: "/docs/wordpress-installation-guide",
    snippet: bannerSnippet,
    checklist: ["Install snippet/plugin", "Map cookie categories", "Confirm consent logging"],
  },
  {
    name: "Webflow",
    href: "/docs/webflow-installation-guide",
    snippet: bannerSnippet,
    checklist: ["Paste site custom code", "Publish policies", "Run install verification"],
  },
  {
    name: "WooCommerce",
    href: "/docs/wordpress-installation-guide",
    snippet: bannerSnippet,
    checklist: ["Install through WordPress", "Check cart and checkout pages", "Verify consent logs"],
  },
  {
    name: "Google Tag Manager",
    href: "/docs/agency-setup-guide",
    snippet: gtmSnippet,
    checklist: ["Add Custom HTML tag", "Trigger on all pages", "Confirm Consent Mode v2"],
  },
  {
    name: "Custom React/Next",
    href: "/docs/agency-setup-guide",
    snippet: reactSnippet,
    checklist: ["Add Script component", "Deploy to production", "Verify public bundle loads"],
  },
];

export default function IntegrationsPage() {
  const [apps, setApps] = useState(initialApps);

  const [copied, setCopied] = useState("");

  const toggleConnection = (id: string, name: string) => {
    setApps(
      apps.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a))
    );
  };

  const copySnippet = (name: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(name);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <DashboardPageShell
      title="Compliance Integrations"
      subtitle="Connect compliance telemetry data directly to your tag managers, store systems, and alert channels."
      icon={Boxes}
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Integrations Grid left */}
        <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-caption font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {app.tag}
                  </span>
                  {app.connected && (
                    <span className="text-caption font-bold text-status-success flex items-center gap-1">
                      <Check className="h-3 w-3" /> Connected
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-text-primary text-base">{app.name}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{app.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-light flex gap-2">
                <Button
                  onClick={() => toggleConnection(app.id, app.name)}
                  className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors ${
                    app.connected
                      ? "bg-background-secondary text-text-secondary border border-border-medium hover:bg-border-light"
                      : "bg-secondary-dark hover:bg-primary text-white"
                  }`}
                >
                  {app.connected ? "Disconnect" : "Configure"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Developer API panel right */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <h4 className="font-bold text-base text-text-primary">Platform install checklists</h4>
            <div className="space-y-3">
              {installGuides.map((guide) => (
                <div key={guide.name} className="rounded-xl border border-border-light bg-background-secondary p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-text-primary">{guide.name}</p>
                    <Link href={guide.href} className="text-xs font-bold text-primary hover:underline">
                      Guide
                    </Link>
                  </div>
                  <div className="mt-3 space-y-2">
                    {guide.checklist.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                        <Check className="h-3.5 w-3.5 text-status-success" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => copySnippet(guide.name, guide.snippet)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-light bg-background-primary px-3 py-2 text-xs font-bold text-text-primary transition hover:bg-background-tertiary"
                  >
                    <Clipboard className="h-3.5 w-3.5" />
                    {copied === guide.name ? "Copied" : "Copy snippet"}
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => copySnippet("default", bannerSnippet)}
              className="btn-secondary w-full justify-center"
            >
              <Clipboard className="h-4 w-4" />
              {copied === "default" ? "Copied" : "Copy default banner snippet"}
            </button>
          </div>

          <div className="bg-secondary-dark text-white p-6 rounded-3xl space-y-3 relative overflow-hidden shadow-card">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,126,34,0.1),transparent_50%)]" />
            <div className="h-9 w-9 bg-primary text-white rounded-lg flex items-center justify-center font-bold">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-base">Custom API Integration</h4>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Generate credentials to write custom integrations, query audit logs programmatically, or synchronize user consent settings.
            </p>
            <Link href="/dashboard/integrations/api" className="block pt-2">
              <Button className="w-full bg-primary hover:bg-primary-hover text-white text-caption font-bold py-2.5 rounded-xl gap-1">
                Manage API Keys
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
