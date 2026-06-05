"use client";

import React, { useState } from "react";
import { Settings, User, Shield, Key, Bell, Save, CheckCircle } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Alex Rivera",
    email: "alex@complianceai.pro",
    companyName: "ComplianceAI Pro Inc",
    twoFactor: true,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleToggle2fa = () => {
    setProfile(prev => ({ ...prev, twoFactor: !prev.twoFactor }));
  };

  return (
    <DashboardPageShell
      title="Account Settings"
      subtitle="Manage your personal profile, update authorization settings, and configure security preferences."
      icon={Settings}
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Profile Card left */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card space-y-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-light pb-3">
            <User className="text-primary h-4.5 w-4.5" />
            Profile Configuration
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Work Email Address</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-caption font-bold text-text-muted uppercase tracking-wider">Registered Corporate Entity</label>
              <input
                type="text"
                required
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full text-sm px-4 py-3 rounded-xl border border-border-medium outline-none focus:border-primary bg-background-secondary text-text-primary"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-xl shadow-button">
                Save Profile Updates
              </Button>
            </div>
          </form>
        </div>

        {/* Security / 2FA Card right */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Shield className="text-primary h-4.5 w-4.5" />
              Security & 2FA
            </h3>
            <p className="text-caption text-text-secondary leading-relaxed">
              Activate two-factor authenticator codes (TOTP) to secure user logins against password compromise.
            </p>
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded-2xl border border-border-light">
              <span className="text-caption font-bold text-text-primary">2FA Status</span>
              <button
                onClick={handleToggle2fa}
                className={`px-3 py-1.5 rounded-lg text-caption font-bold transition-all border ${
                  profile.twoFactor
                    ? "bg-status-success/10 text-status-success border-status-success/20"
                    : "bg-border-light text-text-muted border-border-medium"
                }`}
              >
                {profile.twoFactor ? "ON (Deactivate)" : "OFF (Activate)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
