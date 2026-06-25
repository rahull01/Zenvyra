import LegalDocument, { type LegalSection } from "@/components/marketing/LegalDocument";

const sections: LegalSection[] = [
  {
    title: "Our position",
    body: "Zenvyra does not sell personal information for money. Some US privacy laws define sale, sharing, targeted advertising, or cross-context behavioral advertising broadly, so we provide this page for transparency and opt-out requests.",
  },
  {
    title: "Activities that may be covered",
    rows: [
      { label: "Targeted advertising", value: "Optional advertising or campaign measurement technologies may be treated as sharing or targeted advertising under some laws." },
      { label: "Analytics", value: "Some analytics identifiers may be treated as sharing depending on configuration, region, vendor, and law." },
      { label: "Customer workflows", value: "Customer-controlled websites may use their own cookies, tags, and vendors. Those customers are responsible for their own opt-out handling." },
      { label: "Public proof pages", value: "Customer-published proof pages display information selected by the customer and are not intended as sale of personal information." },
    ],
  },
  {
    title: "How to opt out",
    body: "Send a request to support@zenvyra.com with the subject 'Do Not Sell or Share Request' and include the email address connected to your account or browser interaction.",
    items: [
      "If your request relates to a customer website, include the website domain and context.",
      "If your request relates to your Zenvyra account, contact us from the account email where possible.",
      "You can also manage optional cookies through Cookie Preferences where available.",
    ],
  },
  {
    title: "Global Privacy Control",
    body: "Where required and technically feasible, we aim to treat Global Privacy Control signals as opt-out signals for sale, sharing, or targeted advertising on supported surfaces. Browser-level signals may not identify account-level data unless you are logged in or provide enough information.",
  },
  {
    title: "Verification and response",
    body: "We may need to verify your request before applying account-level changes. We will review requests according to applicable law and may retain records needed to honor the opt-out, prevent fraud, or meet legal obligations.",
  },
];

export default function DoNotSellPage() {
  return (
    <LegalDocument
      title="Do Not Sell or Share My Personal Information"
      subtitle="US privacy opt-out information for sale, sharing, targeted advertising, and related choices."
      intro="This page explains how visitors and customers can submit opt-out requests where applicable privacy laws provide those rights."
      sections={sections}
    />
  );
}
