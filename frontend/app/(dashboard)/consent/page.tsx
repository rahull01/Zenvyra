import Link from "next/link";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Cookie } from "lucide-react";

export default function ConsentRootPage() {
  return (
    <DashboardPageShell
      title="Consent settings"
      subtitle="Manage your cookie banner, visitor preferences, and consent flows from one place."
      icon={Cookie}
      actions={[
        { label: "Edit Cookie Banner", href: "/dashboard/consent/banner", primary: false },
        { label: "Manage Preferences", href: "/dashboard/consent/preferences", primary: true },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="standard-card !transform-none hover:!translate-y-0 p-6">
          <h2 className="text-xl font-semibold text-text-primary">Cookie consent overview</h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            Control how visitors give consent, which cookies are allowed, and how consent is stored across all sites.
            Use the banner settings to update messaging, styling, and consent behavior.
          </p>
          <div className="mt-6 space-y-3">
            <Link href="/dashboard/consent/banner" className="btn-secondary w-full text-center">
              Configure banner
            </Link>
            <Link href="/dashboard/consent/preferences" className="btn-primary w-full text-center">
              Open preference center
            </Link>
          </div>
        </div>

        <div className="standard-card !transform-none hover:!translate-y-0 p-6">
          <h2 className="text-xl font-semibold text-text-primary">Consent workflow</h2>
          <ul className="mt-4 space-y-3 text-text-secondary">
            <li className="rounded-2xl border border-border-light bg-background-secondary p-4">
              <strong className="block text-text-primary">Cookie banner</strong>
              Use the banner editor to customize messaging, button labels, and cookie categories.
            </li>
            <li className="rounded-2xl border border-border-light bg-background-secondary p-4">
              <strong className="block text-text-primary">Consent preferences</strong>
              Configure the preference center and visitor opt-in controls for GDPR, CCPA, and similar rules.
            </li>
            <li className="rounded-2xl border border-border-light bg-background-secondary p-4">
              <strong className="block text-text-primary">Live preview</strong>
              Preview banner behavior before you publish changes to your site.
            </li>
          </ul>
        </div>
      </div>
    </DashboardPageShell>
  );
}
