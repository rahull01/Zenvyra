import LegalDocument, { type LegalSection } from "@/components/marketing/LegalDocument";

const sections: LegalSection[] = [
  {
    title: "Scope of this policy",
    body: "This Refund and Cancellation Policy applies to Zenvyra subscriptions, one-time setup packages, onboarding services, implementation assistance, audits, and billing disputes unless a signed agreement says otherwise.",
  },
  {
    title: "Subscriptions",
    body: "Monthly and annual subscriptions renew automatically unless cancelled before the next renewal date.",
    rows: [
      { label: "Monthly plans", value: "May be cancelled before the next renewal. Access normally continues through the paid period." },
      { label: "Annual plans", value: "May be cancelled to stop the next annual renewal. Fees already charged are generally non-refundable unless required by law or approved in writing." },
      { label: "Plan changes", value: "Upgrades, downgrades, credits, and prorations may depend on the billing system, plan terms, and payment-provider rules." },
      { label: "Non-payment", value: "Failed payments may lead to retries, account limits, suspension, cancellation, or collection activity after reasonable notice where practical." },
    ],
  },
  {
    title: "Trials and promotional offers",
    body: "Trial, discount, lifetime, founder, beta, or promotional offers may have special terms shown at checkout or in the offer details.",
    items: [
      "If a trial converts to a paid plan, cancellation must happen before the trial ends to avoid renewal charges.",
      "Promotional discounts may not apply to renewals, upgrades, setup packages, taxes, or third-party fees unless stated.",
      "Abuse of trials, coupons, or promotional offers may result in cancellation or account restrictions.",
    ],
  },
  {
    title: "One-time setup and service packages",
    body: "One-time setup, onboarding, audit, implementation, or founder packages reserve operator time and may include manual work.",
    rows: [
      { label: "Before work starts", value: "A setup package is generally refundable before operator work begins." },
      { label: "After work starts", value: "After scanning, drafting, configuration, research, implementation guidance, meetings, or handoff work starts, refunds are reviewed case by case." },
      { label: "Partial refunds", value: "Approved partial refunds may account for delivered work, reserved time, discounts, payment-provider costs, and third-party expenses." },
      { label: "Completed work", value: "Completed setup, audit, implementation, or handoff work is generally non-refundable unless required by law or agreed in writing." },
    ],
  },
  {
    title: "Duplicate charges and billing errors",
    body: "If a payment fails, duplicate charge, incorrect amount, or billing mismatch occurs, contact support with enough detail for us to investigate.",
    items: [
      "Include your account email, workspace name, invoice number, payment date, amount, and a short explanation.",
      "We review billing records and payment-provider events before changing account or order state.",
      "Confirmed duplicate charges or processor errors will be corrected through refund, credit, or invoice adjustment where appropriate.",
    ],
  },
  {
    title: "Chargebacks and disputes",
    body: "If you start a chargeback or payment dispute, your account may be restricted while the dispute is reviewed.",
    items: [
      "Chargebacks can delay refunds because the payment provider controls the dispute timeline.",
      "We may provide invoices, account activity, checkout records, usage records, and communications to payment providers when responding to disputes.",
      "Fraudulent or abusive disputes may result in account closure or refusal of future service.",
    ],
  },
  {
    title: "Cancellation and access",
    body: "Cancellation stops future renewal charges after the active billing cycle. It does not automatically delete records or remove obligations created before cancellation.",
    items: [
      "Access normally continues through the paid billing period unless security, abuse, legal, or payment-risk issues require earlier suspension.",
      "Export policies, proof reports, certificate records, invoices, and consent records before closing an account.",
      "Some records may be retained for billing, fraud prevention, tax, audit, backup, security, or legal reasons.",
    ],
  },
  {
    title: "Data after cancellation",
    body: "After cancellation or account closure, customer data may be deleted, archived, anonymized, or retained according to product limits, backup schedules, legal requirements, and our Privacy Policy.",
  },
  {
    title: "How to request billing help",
    body: "Billing and refund requests should be sent to support@zenvyra.com from the email connected to the account whenever possible.",
    items: [
      "We may request verification before discussing billing details or making account changes.",
      "Refund decisions are made in a commercially reasonable way and may depend on applicable law, payment-provider rules, and the facts of the request.",
      "Nothing in this policy limits non-waivable consumer rights that apply under local law.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      title="Refund and Cancellation Policy"
      subtitle="How Zenvyra handles subscriptions, cancellations, setup packages, and billing disputes."
      intro="This policy explains our billing, refund, cancellation, and dispute practices so customers know what to expect before buying or cancelling."
      sections={sections}
    />
  );
}
