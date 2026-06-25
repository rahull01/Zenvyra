import {
  BarChart3,
  Building2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  KeyRound,
  Landmark,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import SolutionLandingPage from "./SolutionLandingPage";

export default function EnterprisePage() {
  return (
    <SolutionLandingPage
      eyebrow="For enterprise"
      title="Govern website compliance across teams, regions, and releases"
      subtitle="Zenvyra gives legal, security, marketing, product, and engineering one shared system for monitoring privacy posture, assigning ownership, and proving readiness."
      primaryCta="Contact sales"
      primaryHref="/contact"
      secondaryCta="Review security"
      secondaryHref="/security"
      heroIcon={Building2}
      metrics={[
        { value: "Multi-team", label: "ownership model" },
        { value: "Audit-ready", label: "evidence trail" },
        { value: "Regions", label: "UK, US, GDPR workflows" },
        { value: "Drift alerts", label: "release monitoring" },
      ]}
      pains={[
        "Marketing teams add pixels, forms, scripts, and pages faster than legal teams can manually review them.",
        "Policy, consent, DSAR, vendor, and cookie evidence is spread across tools, documents, screenshots, and inboxes.",
        "Security and legal leaders need proof of posture, but engineering needs clear tickets instead of broad compliance commentary.",
        "Regional expectations keep changing, while website releases and campaign pages create constant operational drift.",
      ]}
      outcomes={[
        "A shared compliance command center for website trust, consent, policies, and public proof.",
        "Issue ownership across legal, product, security, marketing, and engineering teams.",
        "Audit timelines showing detections, decisions, fixes, verification scans, and policy versions.",
        "Executive-ready reporting for privacy posture, risk movement, and remediation progress.",
      ]}
      features={[
        { title: "Governance workspace", description: "Centralize website compliance evidence with owners, status, deadlines, and business context.", icon: Landmark },
        { title: "Release drift monitoring", description: "Detect when scripts, cookie categories, consent behavior, or legal links change after deployment.", icon: Radar },
        { title: "Role-based workflows", description: "Route issues to legal review, engineering implementation, marketing approval, or security oversight.", icon: Users },
        { title: "Evidence timeline", description: "Maintain an audit-ready trail of findings, fixes, scans, approvals, and policy version changes.", icon: ClipboardCheck },
        { title: "Regional readiness", description: "Track UK, US, GDPR-style, consent, and privacy-center readiness in one operating layer.", icon: Globe2 },
        { title: "Security posture", description: "Use structured proof without exposing sensitive system details or customer data.", icon: LockKeyhole },
      ]}
      workflow={[
        { title: "Map teams and surfaces", description: "Define websites, regions, stakeholders, vendors, policies, consent points, and public trust pages." },
        { title: "Run baseline governance scans", description: "Create an enterprise-wide snapshot of risk, gaps, ownership, and evidence quality." },
        { title: "Operationalize remediation", description: "Turn compliance gaps into assignments, approvals, implementation steps, and verification scans." },
        { title: "Report posture over time", description: "Review movement by team, region, website, risk category, and audit evidence status." },
      ]}
      proof={[
        { title: "Audit trail", description: "Show the full lifecycle of issue detection, internal decisioning, remediation, and verification.", icon: FileCheck2 },
        { title: "Executive reporting", description: "Summarize posture, risk reduction, overdue issues, and upcoming compliance work.", icon: BarChart3 },
        { title: "Controlled public proof", description: "Publish trust signals customers can inspect while keeping sensitive evidence internal.", icon: ShieldCheck },
      ]}
      dashboardTitle="Enterprise trust operations"
      dashboardSubtitle="A governance workspace for cross-functional compliance evidence, drift monitoring, issue routing, and executive visibility."
      dashboardItems={[
        "Regional posture map",
        "Owner and approval workflow",
        "Audit evidence timeline",
        "Executive risk reporting",
      ]}
      finalTitle="Give every team one source of truth for website trust"
      finalSubtitle="Replace scattered compliance artifacts with a system that turns privacy operations into visible, assignable, and reportable work."
    />
  );
}
