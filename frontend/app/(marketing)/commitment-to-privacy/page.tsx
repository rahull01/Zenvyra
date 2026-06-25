import LegalDocument, { type LegalSection } from "@/components/marketing/LegalDocument";

const sections: LegalSection[] = [
  {
    title: "Our product boundary",
    body: "Zenvyra helps teams create privacy workflows, maintain consent evidence, generate policy drafts, monitor website risk, and publish proof pages. We do not sell legal certainty, legal advice, or guaranteed compliance.",
  },
  {
    title: "Privacy by design principles",
    items: [
      "Collect only information needed for account, billing, support, scanning, policy, consent, evidence, security, and legal workflows.",
      "Make public-facing proof language careful and avoid claims of legal certification unless independently verified.",
      "Separate operational readiness evidence from legal advice and require customer review before publication.",
      "Use role-based access and workspace controls so teams can limit who sees sensitive operational records.",
    ],
  },
  {
    title: "Transparency commitments",
    rows: [
      { label: "Notices", value: "Maintain public privacy, cookie, refund, terms, disclaimer, sub-processor, and opt-out pages." },
      { label: "Product language", value: "Describe Zenvyra as workflow and evidence software, not as a substitute for counsel." },
      { label: "Customer controls", value: "Provide settings for policies, consent banners, proof pages, exports, and request workflows where available." },
      { label: "Review posture", value: "Encourage customers to review outputs with qualified counsel for their company, region, industry, and users." },
    ],
  },
  {
    title: "Security and provider review",
    body: "We use operational safeguards, access controls, logging, vendor review, and product monitoring to protect customer workflows. We avoid publishing fake certifications or unsupported security claims.",
  },
  {
    title: "Continuous improvement",
    body: "Privacy laws, customer expectations, browser rules, and AI governance requirements change. We update policies, product language, and workflows as the platform matures.",
  },
];

export default function CommitmentToPrivacyPage() {
  return (
    <LegalDocument
      title="Commitment To Privacy"
      subtitle="How Zenvyra approaches privacy, transparency, product boundaries, and customer trust."
      intro="This page summarizes the principles behind our privacy and compliance workflow platform."
      sections={sections}
    />
  );
}
