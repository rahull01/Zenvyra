import {
  BadgeCheck,
  BarChart3,
  ClipboardCheck,
  Cookie,
  FileCheck2,
  Gauge,
  Globe2,
  Radar,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SolutionLandingPage from "@/components/solutions/SolutionLandingPage";

export default function ComplianceCheckerPage() {
  return (
    <SolutionLandingPage
      eyebrow="Compliance checker"
      title="Score your website readiness before customers, buyers, or regulators ask"
      subtitle="The Zenvyra Compliance Checker reviews privacy, cookies, consent, policy coverage, and proof gaps so your team knows exactly what to fix first."
      primaryCta="Run free scan"
      primaryHref="/free-privacy-scanner"
      secondaryCta="See pricing"
      secondaryHref="/pricing"
      heroIcon={Gauge}
      metrics={[
        { value: "100-point", label: "readiness score" },
        { value: "UK + US", label: "focused checks" },
        { value: "4 areas", label: "policy, consent, cookies, proof" },
        { value: "Instant", label: "prioritized output" },
      ]}
      pains={[
        "Teams often know they need compliance work, but they do not know whether the biggest problem is policies, scripts, consent, or missing proof.",
        "Generic scanners produce long issue lists without ranking business urgency or implementation effort.",
        "Legal pages may exist, but they can be disconnected from the website's actual cookies, trackers, vendors, and user flows.",
        "Readiness is hard to explain to founders, clients, or executives without a simple score and evidence trail.",
      ]}
      outcomes={[
        "A practical readiness score your team can understand quickly.",
        "Category-level visibility across cookies, consent, policies, tracking, and public proof.",
        "Prioritized issues with remediation guidance instead of raw findings only.",
        "A path from first scan to proof pack, monitoring, and ongoing improvement.",
      ]}
      features={[
        { title: "Readiness scoring", description: "Convert complex privacy checks into a score that shows posture and progress over time.", icon: Gauge },
        { title: "Policy coverage review", description: "Check whether privacy, terms, cookie, refund, shipping, and disclosure surfaces are present and aligned.", icon: FileCheck2 },
        { title: "Cookie and tracker analysis", description: "Identify scripts, categories, and consent implications before they become customer trust issues.", icon: Cookie },
        { title: "Consent behavior checks", description: "Review whether consent workflows look complete for analytics, marketing, and preference management.", icon: ShieldCheck },
        { title: "Regional readiness signals", description: "Focus on practical UK, US, GDPR-style, and CCPA-style website readiness expectations.", icon: Globe2 },
        { title: "Actionable summary", description: "Translate findings into clear next steps for founders, agencies, engineering, and legal teams.", icon: ClipboardCheck },
      ]}
      workflow={[
        { title: "Enter the domain", description: "Start with a public website URL and let Zenvyra inspect visible privacy and tracking surfaces." },
        { title: "Review category scores", description: "See which areas create the most risk: policies, cookies, consent, trackers, or proof." },
        { title: "Prioritize remediation", description: "Use severity, impact, and workflow context to decide what to fix first." },
        { title: "Move into monitoring", description: "Keep the score current as scripts, campaigns, policies, and website pages change." },
      ]}
      proof={[
        { title: "Score history", description: "Track movement as your team fixes issues and verifies changes.", icon: BarChart3 },
        { title: "Proof-pack preview", description: "Understand what evidence you can share with customers or clients after remediation.", icon: BadgeCheck },
        { title: "Risk map", description: "Show stakeholders where readiness is strong and where attention is still needed.", icon: Radar },
      ]}
      dashboardTitle="Readiness scoring engine"
      dashboardSubtitle="A focused scoring view that turns website compliance into categories, priorities, and next actions."
      dashboardItems={[
        "Policy coverage check",
        "Cookie and tracker scan",
        "Consent readiness review",
        "Proof-pack priority list",
      ]}
      finalTitle="Start with a score your team can act on"
      finalSubtitle="Run the free scanner, review the readiness map, and turn the result into fixes, monitoring, and proof."
    />
  );
}
