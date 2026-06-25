import LegalDocument, { type LegalSection } from "@/components/marketing/LegalDocument";

const sections: LegalSection[] = [
  {
    title: "Agreement to these terms",
    body: "These Service Terms govern access to and use of Zenvyra websites, applications, APIs, dashboards, reports, templates, hosted policy pages, and related services. By using the service, you agree to these terms on behalf of yourself or the organization you represent.",
  },
  {
    title: "The service",
    body: "Zenvyra provides software for privacy operations, website scanning, policy drafting, consent workflow management, AI readiness tracking, monitoring, and operational evidence reporting.",
    items: [
      "The service may include templates, automation, AI-assisted suggestions, dashboards, alerts, reports, and public proof pages.",
      "Features may vary by plan, workspace, region, package, beta access, or written agreement.",
      "We may improve, modify, suspend, or retire features where needed for security, reliability, legal, or product reasons.",
    ],
  },
  {
    title: "Account responsibility",
    body: "You are responsible for your account, workspace, users, credentials, configuration, and all activity under your login or organization.",
    items: [
      "You must provide accurate account and billing information.",
      "You must keep credentials secure and notify us promptly of suspected unauthorized access.",
      "You are responsible for assigning appropriate roles and permissions to invited team members, clients, contractors, or agency users.",
    ],
  },
  {
    title: "Customer content and permissions",
    body: "Customer content includes domains, URLs, scan settings, policy answers, business details, uploaded materials, generated documents, consent settings, proof reports, and other data submitted to or created in the service.",
    items: [
      "You retain ownership of your customer content.",
      "You grant Zenvyra permission to host, process, transmit, display, analyze, and use customer content as needed to provide, secure, support, and improve the service.",
      "You confirm that you have the rights and authority needed to scan websites, submit data, publish outputs, and invite users.",
      "You are responsible for reviewing all generated content before using it publicly.",
    ],
  },
  {
    title: "No legal advice or certification",
    body: "Zenvyra is not a law firm and does not provide legal advice, legal representation, or legal certification.",
    items: [
      "Generated policies, readiness scores, scans, proof packs, and recommendations are operational tools, not guarantees of legal compliance.",
      "You remain responsible for your legal obligations, business practices, website behavior, disclosures, and user communications.",
      "High-risk questions, regulated industry obligations, enforcement issues, contracts, and jurisdiction-specific decisions should be reviewed by qualified counsel.",
    ],
  },
  {
    title: "Acceptable use",
    body: "You may not use the service in a way that harms Zenvyra, other users, third parties, or the integrity of the platform.",
    items: [
      "Do not attempt to bypass security, rate limits, authentication, billing controls, or usage restrictions.",
      "Do not reverse engineer restricted systems, scrape the platform, overload infrastructure, or interfere with service availability.",
      "Do not submit unlawful, infringing, deceptive, harmful, or sensitive data that you are not authorized to process.",
      "Do not use outputs to falsely claim legal certification, government approval, or guaranteed compliance.",
    ],
  },
  {
    title: "Subscriptions, fees, and taxes",
    body: "Paid access is billed according to the plan, billing cycle, package, order page, invoice, or written agreement selected at purchase.",
    rows: [
      { label: "Renewals", value: "Subscriptions renew automatically unless cancelled before the renewal date." },
      { label: "Payment", value: "Fees are due when charged and may be processed by third-party payment providers." },
      { label: "Taxes", value: "You are responsible for applicable taxes, duties, bank charges, and payment-provider fees unless stated otherwise." },
      { label: "Non-payment", value: "Failure to pay may result in account limits, suspension, cancellation, or collection activity after reasonable notice where practical." },
    ],
  },
  {
    title: "Trials, beta features, and previews",
    body: "Trials, beta features, previews, experimental tools, or early-access functionality may be changed or discontinued at any time and may not be as reliable as generally available features.",
    items: [
      "Beta or preview outputs should be reviewed carefully before operational or public use.",
      "We may set usage limits, remove access, or exclude beta features from support commitments.",
    ],
  },
  {
    title: "Third-party services",
    body: "The service may integrate with or link to third-party services such as payment processors, hosting providers, analytics tools, CMS platforms, app stores, tag managers, or customer websites. Third-party services are governed by their own terms and policies.",
  },
  {
    title: "Intellectual property",
    body: "Zenvyra and its software, designs, templates, workflows, brand elements, documentation, models, and technology are owned by Zenvyra or its licensors.",
    items: [
      "These terms do not transfer ownership of Zenvyra technology to you.",
      "You may use service outputs for your internal business operations and public policy workflows, subject to these terms and your plan.",
      "Feedback may be used by Zenvyra without restriction or obligation to you.",
    ],
  },
  {
    title: "Suspension and termination",
    body: "We may suspend or terminate access if needed to address non-payment, security risk, abuse, unlawful activity, material breach, platform harm, or legal requirements.",
    items: [
      "You may stop using the service and request cancellation according to the Refund and Cancellation Policy.",
      "After termination, access to the platform may end, but some records may be retained for billing, security, backup, dispute, audit, or legal reasons.",
      "Sections that by nature should survive termination will continue to apply.",
    ],
  },
  {
    title: "Disclaimers",
    body: "The service is provided on an as-is and as-available basis to the maximum extent permitted by law. We do not warrant that outputs will be complete, error-free, legally sufficient, uninterrupted, secure against every risk, or suitable for every business or jurisdiction.",
  },
  {
    title: "Limitation of liability",
    body: "To the maximum extent permitted by law, Zenvyra will not be liable for indirect, incidental, special, consequential, punitive, exemplary, lost-profit, lost-revenue, lost-data, business interruption, or reputational damages.",
    items: [
      "Some jurisdictions do not allow certain limitations, so parts of this section may apply only to the extent legally permitted.",
      "Any liability cap or special remedy in a signed agreement or order form controls where applicable.",
    ],
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms as the product, law, or business changes. We will update the effective date and provide additional notice where required. Continued use after the update means you accept the revised terms.",
  },
  {
    title: "Contact",
    body: "Questions about these terms can be sent to support@zenvyra.com. Include your workspace name, account email, and the issue you want reviewed.",
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Service Terms"
      subtitle="The terms that govern access to and use of Zenvyra."
      intro="These Service Terms are written for a SaaS privacy and compliance workflow product. If you have a signed order form, data processing addendum, or enterprise agreement, that written agreement controls where it conflicts with these online terms."
      sections={sections}
    />
  );
}
