"use client";

import React, { useState } from "react";
import { Settings, Bell, Save, Globe, Mail, ShieldAlert } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";

export default function NotificationsSettingsPage() {
  const [preferences, setPreferences] = useState({
    scanDigests: true,
    policyAlerts: true,
    weeklyScores: false,
    webhookEnabled: false,
    webhookUrl: "https://api.mycompany.com/webhooks/compliance",
  });

  const handleSave = () => {
  };

  return (
    <DashboardPageShell
      title="Notification Preferences"
      subtitle="Configure email digests, regulatory action alerts, and external compliance webhooks."
      icon={Settings}
      actions={[
        { label: "Save Configuration", href: "/dashboard/settings/notifications", primary: true, onClick: handleSave },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Toggle List left */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card space-y-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-light pb-3">
            <Bell className="text-primary h-4.5 w-4.5" />
            Notification Channels
          </h3>

          <div className="space-y-4">
            {/* Scan digest */}
            <div className="flex items-start justify-between p-4 bg-background-secondary rounded-2xl border border-border-light">
              <div className="space-y-1 pr-4">
                <span className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-primary" />
                  Website Scan Digests
                </span>
                <p className="text-caption text-text-secondary leading-relaxed">
                  Receive email reports summarizing the findings of your scheduled cookie scans and tracker classifications.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.scanDigests}
                onChange={(e) => setPreferences({ ...preferences, scanDigests: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-5 w-5 mt-1 cursor-pointer"
              />
            </div>

            {/* Policy alerts */}
            <div className="flex items-start justify-between p-4 bg-background-secondary rounded-2xl border border-border-light">
              <div className="space-y-1 pr-4">
                <span className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  Regulatory Policy Alerts
                </span>
                <p className="text-caption text-text-secondary leading-relaxed">
                  Get notified instantly when template updates occur due to new European Union (GDPR) or California laws (CCPA).
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.policyAlerts}
                onChange={(e) => setPreferences({ ...preferences, policyAlerts: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-5 w-5 mt-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Webhooks config right */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Globe className="text-primary h-4.5 w-4.5" />
              Developer Webhooks
            </h3>
            <p className="text-caption text-text-secondary leading-relaxed">
              Register a secure webhook endpoint to receive real-time JSON payloads when users submit privacy request forms.
            </p>
            <div className="space-y-3">
              <label
                className="flex items-center gap-2 cursor-pointer text-caption font-bold text-text-secondary"
              >
                <input
                  type="checkbox"
                  checked={preferences.webhookEnabled}
                  onChange={(e) => setPreferences({ ...preferences, webhookEnabled: e.target.checked })}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                Enable Webhook Payload
              </label>
              {preferences.webhookEnabled && (
                <input
                  type="url"
                  placeholder="https://api.company.com/webhook"
                  value={preferences.webhookUrl}
                  onChange={(e) => setPreferences({ ...preferences, webhookUrl: e.target.value })}
                  className="w-full text-caption px-3 py-2 rounded-lg border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
