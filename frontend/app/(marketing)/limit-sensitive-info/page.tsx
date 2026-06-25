import LegalDocument, { type LegalSection } from "@/components/marketing/LegalDocument";

const sections: LegalSection[] = [
  {
    title: "Sensitive information and product scope",
    body: "Zenvyra is business software and is not designed to request unnecessary sensitive personal information. Sensitive information may appear only if a user or customer submits it in support messages, uploaded files, policy inputs, website scans, or customer-controlled records.",
  },
  {
    title: "Examples of sensitive information",
    items: [
      "Government identifiers, precise geolocation, account login credentials, financial account access data, health information, biometric identifiers, or information about protected characteristics.",
      "Payment card details are handled by payment processors. Zenvyra should not store full card numbers or card security codes.",
      "Customer websites may contain or collect sensitive information outside Zenvyra's direct control.",
    ],
  },
  {
    title: "How we limit use",
    rows: [
      { label: "Service delivery", value: "Use information only as needed to provide requested services, support, security, billing, legal compliance, or customer-directed processing." },
      { label: "Access controls", value: "Limit internal and workspace access based on operational need and role." },
      { label: "Avoidance", value: "Ask customers not to submit sensitive data unless necessary for a specific workflow and legally appropriate." },
      { label: "Deletion requests", value: "Review eligible deletion or limitation requests subject to legal, billing, security, backup, and customer-controller restrictions." },
    ],
  },
  {
    title: "How to submit a request",
    body: "Where applicable law gives you the right to limit use or disclosure of sensitive personal information, email support@zenvyra.com with the subject 'Limit Sensitive Information Request'. Include the email address, workspace, domain, or context needed to identify the information.",
  },
  {
    title: "Customer-controlled data",
    body: "If the sensitive information is controlled by one of our customers, we may direct you to that customer or process the request on the customer's instructions.",
  },
];

export default function LimitSensitiveInfoPage() {
  return (
    <LegalDocument
      title="Limit the Use of Sensitive Personal Information"
      subtitle="How to request limits on sensitive personal information where applicable."
      intro="This page is intended for jurisdictions that provide rights related to sensitive personal information."
      sections={sections}
    />
  );
}
