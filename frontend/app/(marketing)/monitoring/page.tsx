import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  BellRing,
  CalendarClock,
  Cookie,
  FileClock,
  FileText,
  GitPullRequest,
  Radar,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import SolutionLandingPage from "@/components/solutions/SolutionLandingPage";

export default function MonitoringPage() {
  return (
    <SolutionLandingPage
      eyebrow="Monitoring"
      title="Keep privacy, consent, and proof current after every website change"
      subtitle="Zenvyra Monitoring watches for cookie drift, tracker changes, broken policy links, stale proof, and unresolved compliance work so teams do not rely on one-time audits."
      primaryCta="Start monitoring"
      primaryHref="/auth/signup"
      secondaryCta="View pricing"
      secondaryHref="/pricing"
      heroIcon={BarChart3}
      metrics={[
        { value: "24/7", label: "posture awareness" },
        { value: "Drift", label: "script and cookie alerts" },
        { value: "Timeline", label: "audit evidence" },
        { value: "Owners", label: "issue routing" },
      ]}
      pains={[
        "A site can pass a launch review and become risky again after a new pixel, plugin, embedded form, or campaign page goes live.",
        "Legal teams rarely know exactly when a cookie category changed, a tracker appeared, or a policy link broke.",
        "Engineering teams need specific tickets, while leadership needs trend-level visibility and evidence that risk is moving down.",
        "One-time compliance projects create stale screenshots and documents instead of a living operational record.",
      ]}
      outcomes={[
        "Continuous visibility across cookie drift, tracker changes, policies, consent, and proof readiness.",
        "Alerts that tell the right team what changed and why it matters.",
        "Audit timelines showing detections, ownership, fixes, verification scans, and status changes.",
        "Recurring reports for founders, agencies, legal, security, and leadership teams.",
      ]}
      features={[
        { title: "Cookie drift alerts", description: "Detect new, removed, or changed cookies and connect them to consent and disclosure impact.", icon: Cookie },
        { title: "Tracker change detection", description: "Monitor analytics, advertising, chat, form, and embedded tools that affect privacy posture.", icon: Radar },
        { title: "Policy freshness checks", description: "Watch for missing pages, broken legal links, outdated policy versions, and stale trust surfaces.", icon: FileClock },
        { title: "Owner routing", description: "Send issues to marketing, engineering, legal, security, or agency teams based on category and severity.", icon: Workflow },
        { title: "Alert summaries", description: "Turn changes into concise action summaries instead of noisy technical logs.", icon: BellRing },
        { title: "Audit reporting", description: "Maintain a reportable timeline of what changed, when it was fixed, and how it was verified.", icon: BadgeCheck },
      ]}
      workflow={[
        { title: "Set monitoring scope", description: "Choose websites, regions, policy surfaces, cookie categories, and teams that should own alerts." },
        { title: "Detect website drift", description: "Watch for changes across scripts, cookies, policies, links, consent behavior, and proof pages." },
        { title: "Route the right action", description: "Send each issue to the team that can resolve it with context, severity, and fix guidance." },
        { title: "Report the posture", description: "Use timeline evidence and recurring summaries to show risk movement and compliance upkeep." },
      ]}
      proof={[
        { title: "Change timeline", description: "Show when drift happened, who owned it, what changed, and when it was verified.", icon: CalendarClock },
        { title: "Recurring proof packs", description: "Give clients, leaders, or buyers a current report instead of stale launch screenshots.", icon: FileText },
        { title: "Release confidence", description: "Catch compliance regressions after deployments, plugin updates, and campaign launches.", icon: GitPullRequest },
      ]}
      dashboardTitle="Continuous trust monitor"
      dashboardSubtitle="A monitoring layer for the privacy work that changes whenever your website, campaigns, or third-party tools change."
      dashboardItems={[
        "Cookie and tracker drift",
        "Policy link freshness",
        "Owner-based alerts",
        "Audit timeline reports",
      ]}
      finalTitle="Stop treating compliance like a one-time project"
      finalSubtitle="Use monitoring to keep your proof current, your teams aligned, and your website ready after every release."
    />
  );
}
