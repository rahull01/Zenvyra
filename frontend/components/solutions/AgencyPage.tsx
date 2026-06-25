import {
  BadgeCheck,
  BarChart3,
  Building2,
  FileCheck2,
  GitBranch,
  Headphones,
  Layers,
  ScanLine,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import SolutionLandingPage from "./SolutionLandingPage";

export default function AgencyPage() {
  return (
    <SolutionLandingPage
      eyebrow="For agencies"
      title="Turn compliance maintenance into a recurring client service"
      subtitle="Zenvyra gives agencies a white-label operating system for client scans, reports, policy updates, consent reviews, and monthly proof packs."
      primaryCta="Talk to founder"
      primaryHref="/contact"
      secondaryCta="See agency pricing"
      secondaryHref="/pricing"
      heroIcon={Users}
      metrics={[
        { value: "50 sites", label: "agency workspace" },
        { value: "White-label", label: "proof packs" },
        { value: "Monthly", label: "client reporting loop" },
        { value: "1 dashboard", label: "portfolio operations" },
      ]}
      pains={[
        "Client privacy work is usually hidden inside one-off website projects, so there is no structured recurring service.",
        "Agencies spend too much time collecting screenshots, links, cookie lists, policy versions, and status updates manually.",
        "Client websites change constantly through plugins, pixels, campaigns, and theme edits, but compliance checks rarely keep up.",
        "Reporting is hard to standardize when every client has a different stack, risk profile, and level of urgency.",
      ]}
      outcomes={[
        "A repeatable monthly compliance maintenance package for every client site.",
        "White-label reports that show issues found, fixes shipped, evidence collected, and next actions.",
        "Portfolio-level visibility across cookie drift, policy gaps, consent setup, and proof status.",
        "A higher-trust service layer your agency can sell beyond design, SEO, development, and paid media.",
      ]}
      features={[
        { title: "Client portfolio dashboard", description: "View every client website with scan score, open issues, policy status, consent state, and proof readiness.", icon: Layers },
        { title: "White-label proof packs", description: "Export professional client-facing reports that feel like your agency service, not a generic tool printout.", icon: BadgeCheck },
        { title: "Monthly scan cadence", description: "Run recurring checks across plugins, tracking scripts, policies, links, and consent behavior.", icon: BarChart3 },
        { title: "Client issue routing", description: "Separate developer fixes, client content questions, legal review items, and quick wins.", icon: Workflow },
        { title: "Platform-specific fixes", description: "Convert findings into practical instructions for Shopify, WordPress, Webflow, custom sites, and tag managers.", icon: GitBranch },
        { title: "Founder-level support", description: "Use Zenvyra as your backend compliance engine while you own the client relationship.", icon: Headphones },
      ]}
      workflow={[
        { title: "Import client sites", description: "Add every active client website and group them by plan, account manager, platform, or risk level." },
        { title: "Run baseline audits", description: "Create the first compliance snapshot with cookies, trackers, policies, consent, and proof gaps." },
        { title: "Package monthly actions", description: "Send clients a clear report with resolved items, unresolved risks, and next-month priorities." },
        { title: "Renew the service loop", description: "Keep monitoring changes so compliance becomes a predictable retainer instead of a panic task." },
      ]}
      proof={[
        { title: "Client-ready report", description: "Show what changed, what improved, and what still needs approval in a polished format.", icon: FileCheck2 },
        { title: "White-label trust pages", description: "Publish privacy-safe proof pages clients can link from footers, proposals, and procurement answers.", icon: Building2 },
        { title: "Portfolio visibility", description: "Spot which clients are falling behind before they become urgent support tickets.", icon: ShieldCheck },
      ]}
      dashboardTitle="Agency command center"
      dashboardSubtitle="A service-delivery workspace for client portfolios, recurring reports, issue ownership, and white-label proof."
      dashboardItems={[
        "Client portfolio risk map",
        "Recurring scan queue",
        "White-label report builder",
        "Implementation handoff list",
      ]}
      finalTitle="Productize compliance without hiring a legal team"
      finalSubtitle="Give every client a visible trust layer and give your agency a serious recurring service line built around ongoing evidence."
    />
  );
}
