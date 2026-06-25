import {
  BadgeCheck,
  Cookie,
  FileCheck2,
  Gauge,
  Globe2,
  Rocket,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import SolutionLandingPage from "./SolutionLandingPage";

export default function StartupPage() {
  return (
    <SolutionLandingPage
      eyebrow="For startups"
      title="Launch with privacy, cookies, and customer trust already handled"
      subtitle="Zenvyra helps founders turn messy launch compliance into a focused checklist: scan the website, generate the essentials, install consent, and publish proof before customers ask."
      primaryCta="Start free scan"
      primaryHref="/auth/signup"
      secondaryCta="View pricing"
      secondaryHref="/pricing"
      heroIcon={Rocket}
      metrics={[
        { value: "10 min", label: "first risk map" },
        { value: "5 pages", label: "core policy baseline" },
        { value: "1 link", label: "public proof page" },
        { value: "No card", label: "free scan start" },
      ]}
      pains={[
        "Founders usually add privacy pages after launch, when checkout, analytics, ads, and support tools are already live.",
        "Cookie banners are installed visually, but trackers often still fire before consent or stay uncategorized.",
        "Investor, partner, and enterprise buyer questions create last-minute proof requests the team is not ready to answer.",
        "Policy generators create documents, but they do not connect those documents to website scans, consent logs, or fixes.",
      ]}
      outcomes={[
        "A clear launch checklist for privacy policy, terms, cookies, consent, and proof links.",
        "Scanner output that tells you what to fix first instead of overwhelming you with legal language.",
        "A founder-friendly readiness score you can improve before paid traffic or sales calls.",
        "A visible trust center foundation for customers, partners, and early enterprise buyers.",
      ]}
      features={[
        { title: "Founder scan cockpit", description: "Run your public website through policy, cookie, tracker, and trust-page checks before launch or funding announcements.", icon: ScanLine },
        { title: "Launch policy stack", description: "Create the first privacy, cookie, terms, refund, and shipping pages with versioning and clear next steps.", icon: FileCheck2 },
        { title: "Consent setup guidance", description: "Understand which trackers need consent, which categories are missing, and where banner behavior needs review.", icon: Cookie },
        { title: "Readiness scoring", description: "See a simple score that turns compliance into founder-level priorities: urgent, important, and monitor.", icon: Gauge },
        { title: "Public proof page", description: "Share a privacy-safe proof link showing policy versions, scan history, and readiness signals.", icon: BadgeCheck },
        { title: "AI guidance", description: "Ask plain-language questions about findings and convert them into implementation tasks.", icon: Sparkles },
      ]}
      workflow={[
        { title: "Scan the public site", description: "Submit your domain and map cookies, trackers, legal links, policy coverage, and consent behavior." },
        { title: "Build the launch baseline", description: "Generate or update essential policies and align them with the actual technologies your website uses." },
        { title: "Install consent and proof", description: "Add the consent banner, privacy center links, and public certificate so visitors can inspect your posture." },
        { title: "Fix the highest-risk gaps", description: "Use prioritized remediation steps for scripts, missing disclosures, broken links, and policy drift." },
      ]}
      proof={[
        { title: "Launch certificate", description: "Show customers that your website has a current scan, policies, and consent workflow in place.", icon: ShieldCheck },
        { title: "Policy version history", description: "Keep a simple history of what changed, when, and why as the product evolves.", icon: Workflow },
        { title: "Customer trust signals", description: "Give early buyers a cleaner answer to privacy and cookie questions without manual back-and-forth.", icon: Globe2 },
      ]}
      dashboardTitle="Founder launch room"
      dashboardSubtitle="A startup-focused workspace for the work you need before launch, ads, checkout, investor diligence, and early sales."
      dashboardItems={[
        "Website readiness scan",
        "Policy baseline checklist",
        "Consent and tracker review",
        "Public proof link",
      ]}
      finalTitle="Start with the scan, then ship the trust layer"
      finalSubtitle="You do not need a legal operations team to look professional. Start with the free scan and turn the results into a launch-ready compliance foundation."
    />
  );
}
