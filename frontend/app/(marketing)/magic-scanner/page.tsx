import {
  BadgeCheck,
  Bot,
  Cookie,
  FileSearch,
  FileText,
  Gauge,
  GitBranch,
  Radar,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import SolutionLandingPage from "@/components/solutions/SolutionLandingPage";

export default function MagicScannerPage() {
  return (
    <SolutionLandingPage
      eyebrow="Magic scanner"
      title="A deeper scan that turns website findings into practical fixes"
      subtitle="Magic Scanner inspects visible scripts, cookies, policy surfaces, consent behavior, and trust gaps, then explains what changed and what your team should do next."
      primaryCta="Try scanner"
      primaryHref="/free-privacy-scanner"
      secondaryCta="Explore products"
      secondaryHref="/products"
      heroIcon={ScanLine}
      metrics={[
        { value: "Browser-aware", label: "script detection" },
        { value: "AI-assisted", label: "issue explanation" },
        { value: "Fix-first", label: "remediation output" },
        { value: "Proof-ready", label: "evidence structure" },
      ]}
      pains={[
        "A website can look compliant while analytics, ads, chat widgets, and embedded tools quietly create privacy gaps.",
        "Traditional scans identify technical artifacts but do not explain why a founder, agency, or legal team should care.",
        "Teams lose time translating findings into implementation tasks for Shopify, WordPress, Webflow, tag managers, or custom code.",
        "One scan is not enough unless the output can feed proof packs, monitoring, and future change detection.",
      ]}
      outcomes={[
        "A clear inspection of scripts, cookies, trackers, consent surfaces, and policy links.",
        "AI-assisted explanations written for operators, not only engineers or lawyers.",
        "Remediation guidance that helps teams move from finding to shipped fix.",
        "A scan output designed to become evidence for reports, proof pages, and monitoring.",
      ]}
      features={[
        { title: "Script and tracker discovery", description: "Detect visible third-party tools and map them to categories, consent needs, and risk context.", icon: Radar },
        { title: "Cookie intelligence", description: "Inspect cookie patterns and connect them to consent, disclosure, and policy requirements.", icon: Cookie },
        { title: "Policy surface scan", description: "Check footer links, legal page coverage, missing disclosures, and trust-center readiness.", icon: FileSearch },
        { title: "AI issue summaries", description: "Translate technical findings into plain-language impact, severity, and recommended next action.", icon: Bot },
        { title: "Implementation handoff", description: "Turn findings into tasks for developers, marketers, founders, client teams, or legal reviewers.", icon: GitBranch },
        { title: "Proof-pack linkage", description: "Use scan results as the foundation for readiness reports, certificates, and ongoing monitoring.", icon: BadgeCheck },
      ]}
      workflow={[
        { title: "Crawl the visible site", description: "Inspect public pages, legal links, cookies, and scripts using a compliance-focused scan model." },
        { title: "Classify findings", description: "Group findings into tracking, consent, policy, disclosure, privacy center, and proof categories." },
        { title: "Explain the risk", description: "Summarize why each issue matters and which role should own the next action." },
        { title: "Create the fix path", description: "Move the scan output into remediation, reporting, and monitoring workflows." },
      ]}
      proof={[
        { title: "Scan evidence", description: "Keep a structured record of what was detected and when the scan happened.", icon: FileText },
        { title: "Remediation trail", description: "Connect findings to fixes, verification scans, and proof-pack readiness.", icon: Workflow },
        { title: "Readiness signal", description: "Show customers or clients that technical privacy surfaces are actively reviewed.", icon: ShieldCheck },
      ]}
      dashboardTitle="Deep scan workspace"
      dashboardSubtitle="A browser-aware inspection layer for the parts of compliance that basic policy tools miss."
      dashboardItems={[
        "Script and tracker discovery",
        "Cookie classification review",
        "Policy surface validation",
        "AI fix recommendations",
      ]}
      finalTitle="Scan deeper before small gaps become public trust problems"
      finalSubtitle="Use Magic Scanner to understand what is actually running on your website and turn the results into fixes your team can ship."
    />
  );
}
