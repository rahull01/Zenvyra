import Link from "next/link";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { HelpCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <DashboardPageShell
      title="Support"
      subtitle="Get help with your ComplianceAI Pro account, policies, or website compliance setup."
      icon={HelpCircle}
      actions={[
        { label: "Contact support", href: "/contact", primary: true },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="standard-card !transform-none hover:!translate-y-0 p-6">
          <h2 className="text-xl font-semibold text-text-primary">Need immediate help?</h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            Our team can help you with setup, integrations, policy reviews, and tracker analysis.
          </p>
        </div>

        <div className="standard-card !transform-none hover:!translate-y-0 p-6">
          <h2 className="text-xl font-semibold text-text-primary">Self-service resources</h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            Browse guides, FAQs, and best practices to resolve common compliance questions faster.
          </p>
          <Link href="/help" className="btn-secondary mt-4 inline-flex items-center justify-center w-full">
            View help center
          </Link>
        </div>

        <div className="standard-card !transform-none hover:!translate-y-0 p-6">
          <h2 className="text-xl font-semibold text-text-primary">Account support</h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            Report issues with your policy drafts, analytics, or website scanning results.
          </p>
          <p className="mt-4 text-sm text-text-muted">
            Support typically responds within one business day.
          </p>
        </div>
      </div>
    </DashboardPageShell>
  );
}
