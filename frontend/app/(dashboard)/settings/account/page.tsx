"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Settings, Shield, User } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/lib/api";

type UserProfile = {
  id?: string;
  fullName: string;
  email: string;
  companyName?: string;
  industry?: string;
  employeeCount?: string;
  plan?: string;
};

export default function AccountSettingsPage() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    companyName: "",
    industry: "",
    employeeCount: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get<UserProfile>("/users/me")
      .then((response) => {
        if (mounted) setProfile(response.data);
      })
      .catch((error) => toast.error(error?.response?.data?.message || "Unable to load account profile"))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.put<UserProfile>("/users/me", {
        fullName: profile.fullName,
        companyName: profile.companyName,
        industry: profile.industry,
        employeeCount: profile.employeeCount,
      });
      setProfile(response.data);
      updateUser(response.data);
      toast.success("Profile updated.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPageShell
      title="Account Settings"
      subtitle="Manage your account profile and subscription identity."
      icon={Settings}
    >
      {loading ? (
        <div className="rounded-3xl border border-border-light bg-background-primary p-10 text-center text-text-secondary shadow-card">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading account...
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 rounded-3xl border border-border-light bg-background-primary p-6 shadow-card md:p-8 lg:col-span-8">
            <h3 className="flex items-center gap-2 border-b border-border-light pb-3 text-sm font-bold uppercase tracking-wider text-text-primary">
              <User className="h-4.5 w-4.5 text-primary" />
              Profile
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  value={profile.fullName || ""}
                  onChange={(value) => setProfile((previous) => ({ ...previous, fullName: value }))}
                  required
                />
                <InputField label="Email Address" value={profile.email || ""} disabled />
              </div>

              <InputField
                label="Company Name"
                value={profile.companyName || ""}
                onChange={(value) => setProfile((previous) => ({ ...previous, companyName: value }))}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Industry"
                  value={profile.industry || ""}
                  onChange={(value) => setProfile((previous) => ({ ...previous, industry: value }))}
                />
                <InputField
                  label="Company Size"
                  value={profile.employeeCount || ""}
                  onChange={(value) => setProfile((previous) => ({ ...previous, employeeCount: value }))}
                />
              </div>

              <Button type="submit" disabled={saving} className="gap-2 rounded-xl bg-primary px-6 py-2.5 font-bold text-white hover:bg-primary-hover">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="space-y-4 rounded-3xl border border-border-light bg-background-primary p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-primary">
                <Shield className="h-4.5 w-4.5 text-primary" />
                Security
              </h3>
              <p className="text-caption leading-relaxed text-text-secondary">
                JWT sessions are signed by the backend and sent through the authenticated API client. Email changes require support verification.
              </p>
              <div className="rounded-2xl border border-border-light bg-background-secondary p-3">
                <p className="text-caption font-bold uppercase tracking-wider text-text-muted">Current Plan</p>
                <p className="mt-1 text-sm font-semibold text-text-primary">{profile.plan || "free"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}

function InputField({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-caption font-bold uppercase tracking-wider text-text-muted">{label}</label>
      <input
        type="text"
        required={required}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-xl border border-border-medium bg-background-secondary px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
      />
    </div>
  );
}
