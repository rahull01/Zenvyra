import LegalDocument, { type LegalSection } from "@/components/marketing/LegalDocument";

const sections: LegalSection[] = [
  {
    title: "What sub-processors are",
    body: "Sub-processors are third-party service providers that may process customer data to help us provide Zenvyra. This page explains provider categories until specific vendor publication is finalized through customer agreements and security review.",
  },
  {
    title: "Provider categories",
    rows: [
      { label: "Cloud hosting", value: "Hosts application servers, storage, networking, container infrastructure, and platform runtime." },
      { label: "Database and storage", value: "Stores account, workspace, scan, consent, policy, report, audit, export, and proof workflow data." },
      { label: "Payments and billing", value: "Processes subscriptions, invoices, tax metadata, failed payments, refunds, fraud checks, and billing events." },
      { label: "Email and communications", value: "Sends account notices, security alerts, onboarding messages, support replies, product notices, and transactional email." },
      { label: "Analytics and diagnostics", value: "Measures product health, usage trends, errors, performance, reliability, and aggregate workflow behavior." },
      { label: "Customer support", value: "Manages support tickets, customer communications, workspace context, troubleshooting, and service follow-up." },
      { label: "Security monitoring", value: "Supports abuse detection, rate limiting, incident investigation, vulnerability monitoring, and service protection." },
      { label: "AI and automation services", value: "May assist with policy drafting, tracker classification, summaries, remediation suggestions, and workflow automation where enabled." },
    ],
  },
  {
    title: "Data that may be processed",
    items: [
      "Account and workspace identifiers.",
      "Website URLs, scan configuration, tracker observations, cookie categories, and policy workflow metadata.",
      "Consent logs, proof report metadata, hosted policy configuration, and certificate settings.",
      "Support messages, diagnostic logs, billing metadata, and security events.",
      "Generated text, prompts, or customer-provided context where AI-assisted features are enabled.",
    ],
  },
  {
    title: "Provider controls",
    rows: [
      { label: "Business need", value: "Providers should support a specific platform function such as hosting, security, payments, support, or diagnostics." },
      { label: "Access limitation", value: "Provider access should be limited to what is needed to deliver the service." },
      { label: "Contractual controls", value: "Providers should be bound by confidentiality, security, and processing restrictions where appropriate." },
      { label: "Operational review", value: "Providers are reviewed for fit, reliability, and risk as the platform matures." },
    ],
  },
  {
    title: "International processing",
    body: "Providers may process information in countries different from where customers or end users are located. Where required, Zenvyra uses contractual protections and transfer safeguards appropriate to the provider and processing activity.",
  },
  {
    title: "Updates and objections",
    body: "We may update this page when provider categories or material processing arrangements change. Enterprise customers with a signed agreement may request additional sub-processor information or raise reasonable objections according to their contract.",
  },
];

export default function SubProcessorsPage() {
  return (
    <LegalDocument
      title="Sub-Processors"
      subtitle="Provider categories that help Zenvyra host, secure, bill, support, automate, and operate the platform."
      intro="This page explains the types of third-party providers that may process customer data for Zenvyra."
      sections={sections}
    />
  );
}
