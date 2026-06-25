import LegalDocument, { type LegalSection } from "@/components/marketing/LegalDocument";

const sections: LegalSection[] = [
  {
    title: "No legal advice",
    body: "Zenvyra provides software, templates, workflow automation, scans, reports, AI-assisted suggestions, and operational evidence. We are not a law firm and do not provide legal advice, legal representation, or legal certification.",
  },
  {
    title: "No compliance guarantee",
    body: "Readiness scores, generated policies, cookie classifications, AI suggestions, and proof reports are informational and operational tools. They do not guarantee compliance with GDPR, UK GDPR, PECR, CCPA/CPRA, US state privacy laws, AI laws, accessibility laws, consumer protection laws, or other regulations.",
  },
  {
    title: "Customer responsibility",
    items: [
      "Review all generated policies, banner settings, reports, public proof pages, and suggested fixes before publication.",
      "Confirm that website behavior, third-party scripts, cookies, data flows, and disclosures are accurate.",
      "Honor consumer, data subject, deletion, access, correction, opt-out, and consent requests as required by applicable law.",
      "Consult qualified counsel for your company entity, region, industry, risk profile, and user base.",
    ],
  },
  {
    title: "AI-assisted outputs",
    body: "AI-assisted content may be incomplete, outdated, or incorrect. It should be treated as a draft or review aid, not as a final legal determination.",
  },
  {
    title: "Third-party services and laws",
    body: "Third-party platforms, payment providers, analytics tools, app stores, ad networks, tag managers, hosting providers, and legal requirements may change. Customers remain responsible for monitoring their own operational and legal obligations.",
  },
  {
    title: "No professional relationship",
    body: "Using Zenvyra does not create an attorney-client, accountant-client, auditor-client, or fiduciary relationship. Communications through the platform are not privileged legal communications.",
  },
];

export default function DisclaimerPage() {
  return (
    <LegalDocument
      title="Disclaimer"
      subtitle="Important limits on Zenvyra software, reports, templates, AI suggestions, and recommendations."
      intro="This disclaimer explains the boundary between Zenvyra operational software and professional legal advice."
      sections={sections}
    />
  );
}
