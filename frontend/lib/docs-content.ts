export interface DocsSection {
  id: string;
  title: string;
  body: string;
  bullets: string[];
  subsections?: DocsSubsection[];
}

export interface DocsSubsection {
  id: string;
  title: string;
  bullets: string[];
}

export interface DocsPage {
  category: string;
  slug: string;
  title: string;
  description: string;
  abstract: string;
  sections: DocsSection[];
}

export const docsPages = [
  {
    category: "compliance-automation",
    slug: "gdpr-dynamic-policy-pipeline",
    title: "GDPR Dynamic Policy Pipeline",
    description:
      "How Zenvyra converts website tracker scans into dynamic GDPR policy and consent updates.",
    abstract:
      "Zenvyra supports GDPR readiness workflows through a three-stage pipeline: (1) Jsoup tracking token isolation, (2) Hybrid Redis category dictionary parsing, and (3) Dynamic hosted iframe document synchronization. The system detects tracking scripts, classifies cookie and vendor purpose, records consent evidence, and refreshes hosted policy documents without requiring manual document regeneration.",
    sections: [
      {
        id: "gdpr-prior-consent-enforcement",
        title: "GDPR Prior Consent Enforcement",
        body:
          "GDPR prior consent means non-essential tracking should not execute before a lawful consent signal is collected.",
        bullets: [
          "Zenvyra scans website scripts and isolates third-party tracking tokens.",
          "Consent categories are mapped before policy language is regenerated.",
          "Dynamic script blocking prevents uncontrolled tracker execution where consent is required.",
        ],
        subsections: [
          {
            id: "legal-definition-prior-consent",
            title: "Legal Definition: Prior Consent",
            bullets: [
              "Prior consent is an affirmative opt-in collected before non-essential processing begins.",
              "Consent records should be specific, informed, revocable, and auditable.",
              "Cookie categories should distinguish essential, analytics, advertising, and functional scripts.",
            ],
          },
        ],
      },
      {
        id: "jsoup-tracking-token-isolation",
        title: "Jsoup Tracking Token Isolation",
        body:
          "The scan layer extracts script URLs, inline tracking patterns, iframe sources, and third-party resource domains.",
        bullets: [
          "Jsoup parsing identifies script tags, iframe embeds, and common tracker markers.",
          "Detected domains are normalized before category lookup.",
          "The scanner stores evidence for audit review and policy regeneration.",
        ],
      },
      {
        id: "hybrid-redis-category-dictionary-parsing",
        title: "Hybrid Redis Category Dictionary Parsing",
        body:
          "Tracker domains are matched against a fast Redis dictionary and a durable tracker classification store.",
        bullets: [
          "Redis accelerates known tracker lookups for repeated scans.",
          "MongoDB persists learned tracker classifications and source metadata.",
          "Unknown services can be classified and promoted into the dictionary for future scans.",
        ],
      },
      {
        id: "dynamic-hosted-iframe-document-synchronization",
        title: "Dynamic Hosted Iframe Document Synchronization",
        body:
          "Hosted policy embeds allow customer websites to display the latest approved policy content without redeploying static pages.",
        bullets: [
          "Policy versions are regenerated when new tracker domains materially change disclosures.",
          "Hosted iframe and public policy routes serve the current policy version.",
          "Agency accounts can synchronize updates across multiple client domains from one dashboard.",
        ],
      },
    ],
  },
  {
    category: "dsar-workflows",
    slug: "deadline-tracking-engine",
    title: "DSAR Deadline Tracking Engine",
    description:
      "How Zenvyra records Data Subject Access Requests and triggers deadline-aware notifications.",
    abstract:
      "Zenvyra automates DSAR operations by accepting public request submissions, assigning a 30-day fulfillment deadline, creating urgent dashboard alerts, and sending administrator email notifications. The workflow gives privacy teams a concise evidence trail for intake time, requester identity fields, request type, due date, status, and completion timestamp.",
    sections: [
      {
        id: "dsar-intake-deadline-assignment",
        title: "DSAR Intake Deadline Assignment",
        body:
          "A Data Subject Access Request is a privacy rights request from an individual asking to access, delete, correct, or export personal data.",
        bullets: [
          "Each new public submission receives status new.",
          "The fulfillment due date is set 30 days from intake.",
          "Requester name, email, request type, custom fields, and notes remain attached to the submission record.",
        ],
      },
      {
        id: "administrator-urgent-alert-routing",
        title: "Administrator Urgent Alert Routing",
        body:
          "Zenvyra resolves the DSAR form to the owning organization and notifies the company administrator.",
        bullets: [
          "Dashboard alerts use urgent priority for pending regulatory deadlines.",
          "Email notifications summarize requester identity and request type.",
          "The alert directs administrators to the DSAR dashboard for fulfillment tracking.",
        ],
      },
      {
        id: "dsar-status-evidence-trail",
        title: "DSAR Status Evidence Trail",
        body:
          "Status transitions help teams prove that privacy rights requests were processed inside the required operational window.",
        bullets: [
          "Supported status values include new, in-progress, completed, and rejected.",
          "Completion timestamps are stored when a request is marked completed.",
          "The record supports audit review and internal compliance reporting.",
        ],
      },
    ],
  },
  {
    category: "installation-guides",
    slug: "wordpress-privacy-proof-installation",
    title: "WordPress Privacy Proof Installation",
    description:
      "Install Zenvyra on WordPress sites for UK/US consent, hosted policies, request intake, public certificates, and monthly monitoring evidence.",
    abstract:
      "WordPress installation connects the Zenvyra banner script, hosted policy links, DSAR or consumer request route, and privacy-safe public certificate. The recommended agency workflow creates the client site first, installs the script in the global head, verifies consent evidence, scans after cache clear, and hands off a concise proof packet without making legal guarantee claims.",
    sections: [
      {
        id: "installation-outcomes",
        title: "Installation Outcomes",
        body:
          "A complete WordPress install should create a visible privacy workflow and an internal evidence trail for UK/US website operators.",
        bullets: [
          "Deploy the consent banner before non-essential marketing or analytics scripts where blocking is configured.",
          "Link hosted privacy, cookie, request, and certificate pages from footer or legal navigation.",
          "Run a post-install scan so the proof score reflects the live WordPress domain after cache clear.",
        ],
      },
      {
        id: "agency-setup",
        title: "Agency Setup",
        body:
          "Agency setup means the client site is managed from an agency workspace before implementation begins.",
        bullets: [
          "Create the client site, record WordPress admin contact, and assign implementation and review owners.",
          "Generate banner id, hosted policy URLs, DSAR or consumer request URL, and certificate URL.",
          "Use white-label branding only where the client has approved it.",
        ],
      },
      {
        id: "wordpress-install-path",
        title: "WordPress Install Path",
        body:
          "Most WordPress installs use a trusted header/footer code manager or a controlled child theme edit.",
        bullets: [
          "Place the banner script in the global head and clear WordPress, host, and CDN caches.",
          "Avoid editing parent theme files directly when the agency can use a child theme or script manager.",
          "Verify accept, reject, and preferences events create consent evidence before client handoff.",
        ],
      },
      {
        id: "verification-checklist",
        title: "Verification Checklist",
        body:
          "Verification confirms the public experience and the private evidence trail are both working.",
        bullets: [
          "Check homepage, high-traffic pages, policy links, request form submission, and public certificate privacy.",
          "Confirm non-essential trackers are controlled where the customer enabled blocking.",
          "Send the client a proof packet with score, links, open fixes, and not-legal-advice disclaimer.",
        ],
      },
    ],
  },
  {
    category: "installation-guides",
    slug: "shopify-privacy-proof-installation",
    title: "Shopify Privacy Proof Installation",
    description:
      "Install Zenvyra on Shopify stores for UK/US ecommerce consent, policy links, consumer requests, public certificates, and tracker monitoring.",
    abstract:
      "Shopify installation focuses on storefront privacy proof: adding the banner script to the theme head, connecting policy and consumer request links, reviewing pixels and apps, issuing a privacy-safe certificate, and rescanning after theme publish. The workflow is designed for agencies that need a repeatable implementation packet for ecommerce clients.",
    sections: [
      {
        id: "storefront-outcomes",
        title: "Storefront Outcomes",
        body:
          "A complete Shopify install should cover storefront banner deployment, privacy request access, and recurring tracker evidence.",
        bullets: [
          "Deploy the banner across homepage, product, collection, cart, and content pages.",
          "Link hosted privacy, cookie, request, and certificate URLs from store footer and policy areas.",
          "Monitor new apps, pixels, customer events, GTM containers, and marketing scripts.",
        ],
      },
      {
        id: "theme-installation",
        title: "Theme Installation",
        body:
          "Theme installation means adding the Zenvyra banner script to the global storefront head.",
        bullets: [
          "Duplicate the live theme before editing and add the script before the closing head tag in theme.liquid.",
          "Preview and verify the install before publishing the theme.",
          "Rerun the Zenvyra scan after publish because app and pixel behavior can change by template.",
        ],
      },
      {
        id: "shopify-tracker-review",
        title: "Shopify Tracker Review",
        body:
          "Shopify stores often load trackers through apps, pixels, customer events, theme code, and tag managers.",
        bullets: [
          "Review marketing apps, analytics, chat, affiliate scripts, review apps, and GTM.",
          "Document whether each non-essential tracker is consent-aware, blocked, or listed as an open fix.",
          "Avoid public claims that the store is legally certified; use privacy readiness and proof evidence language.",
        ],
      },
      {
        id: "client-handoff",
        title: "Client Handoff",
        body:
          "Client handoff gives the ecommerce operator a practical record of what was installed and what remains open.",
        bullets: [
          "Send installed theme name, install date, public links, first scan score, and remediation list.",
          "Confirm the certificate URL does not expose order data, customer PII, admin email, or internal notes.",
          "Include a clear statement that Zenvyra supports operational privacy workflows and is not legal advice.",
        ],
      },
    ],
  },
  {
    category: "installation-guides",
    slug: "webflow-privacy-proof-installation",
    title: "Webflow Privacy Proof Installation",
    description:
      "Install Zenvyra on Webflow sites for UK/US consent banners, policy links, request intake, privacy certificates, and monitoring evidence.",
    abstract:
      "Webflow installation uses site-level custom code to deploy the Zenvyra banner, then connects hosted policy links, privacy request intake, public certificate URLs, and monitoring scans. Agencies should publish to custom domains, verify embedded tools and GTM behavior, and send clients a proof packet after the live domain scan.",
    sections: [
      {
        id: "webflow-outcomes",
        title: "Webflow Outcomes",
        body:
          "A complete Webflow install should create a live privacy proof workflow on the published custom domain.",
        bullets: [
          "Deploy the banner through Site Settings custom head code and publish target domains.",
          "Add privacy, cookie, request, and certificate links to the shared footer or legal navigation.",
          "Monitor embedded tools, forms, analytics, ad pixels, scheduling widgets, and GTM changes.",
        ],
      },
      {
        id: "custom-code-installation",
        title: "Custom Code Installation",
        body:
          "Custom code installation means the banner script is added once at site level rather than manually per page.",
        bullets: [
          "Paste the banner script into Webflow Site Settings head code.",
          "Publish all relevant custom domains after saving the custom code.",
          "Verify the published custom domain, not only Designer preview or staging.",
        ],
      },
      {
        id: "embedded-tools-review",
        title: "Embedded Tools Review",
        body:
          "Embedded tools review finds scripts that can appear through Webflow embeds, GTM, forms, or marketing pages.",
        bullets: [
          "Review analytics, ad pixels, chat, video, forms, scheduling, heatmaps, and session replay tools.",
          "Move uncontrolled scripts behind consent categories where required and technically supported.",
          "Rerun scans after Webflow publishes that change scripts, forms, analytics, or embedded tools.",
        ],
      },
      {
        id: "handoff-checklist",
        title: "Handoff Checklist",
        body:
          "The Webflow handoff should prove the live domain is installed and monitored without overclaiming legal status.",
        bullets: [
          "Send published domains, public links, first scan score, and open remediation items.",
          "Confirm the public certificate does not expose private customer data or agency notes.",
          "Add a not-legal-advice disclaimer to client-facing proof packets.",
        ],
      },
    ],
  },
  {
    category: "agency-operations",
    slug: "uk-us-agency-setup",
    title: "UK/US Agency Setup",
    description:
      "Set up a white-label agency workspace for UK/US privacy proof delivery across WordPress, Shopify, Webflow, and custom client websites.",
    abstract:
      "Agency setup turns Zenvyra into a repeatable service layer: create the agency workspace, configure white-label identity, onboard each client site, collect region and platform details, install the banner and public links, run post-install scans, and deliver monthly proof packs. The operating model helps agencies sell recurring privacy readiness without promising legal certification.",
    sections: [
      {
        id: "agency-positioning",
        title: "Agency Positioning",
        body:
          "Agency positioning frames Zenvyra as a recurring privacy proof service for UK/US client websites.",
        bullets: [
          "Recommended offer: add privacy compliance monitoring to every client website in 48 hours with white-label reports, trust badges, and monthly proof packs.",
          "Use privacy readiness, proof workflow, monitoring evidence, policy drafts, and review packet language.",
          "Do not claim guaranteed compliance or legal certification.",
        ],
      },
      {
        id: "workspace-setup",
        title: "Workspace Setup",
        body:
          "Workspace setup creates the operating base for multi-client delivery.",
        bullets: [
          "Configure owner, implementation users, white-label name, support email, logo, and report footer.",
          "Set billing plan, client-site allowance, monthly proof pack recipients, and escalation contacts.",
          "Record internal owners for DSAR, payment, technical, and legal review escalations.",
        ],
      },
      {
        id: "client-onboarding",
        title: "Client Onboarding",
        body:
          "Client onboarding collects the platform, region, technical owner, and first scan evidence before installation.",
        bullets: [
          "Add domain, platform, target region, technical owner, business owner, and approved public company name.",
          "Run the first scan, review trackers and policies, generate the install packet, then install banner and links.",
          "Rerun the scan after deployment and send the first proof pack.",
        ],
      },
      {
        id: "monthly-proof-pack",
        title: "Monthly Proof Pack",
        body:
          "The monthly proof pack is the retention artifact that shows ongoing client value.",
        bullets: [
          "Include score, tracker changes, consent evidence, request status, policy version changes, certificate status, and open fixes.",
          "Escalate sensitive data, uncontrolled new vendors, request deadlines, and certificate misrepresentation risk.",
          "Always include the operational privacy workflow disclaimer and not-legal-advice language.",
        ],
      },
    ],
  },
] satisfies DocsPage[];

export function getDocsPage(category: string, slug: string): DocsPage | undefined {
  return docsPages.find((page) => page.category === category && page.slug === slug);
}

export function getDocsStaticParams() {
  return docsPages.map((page) => ({ category: page.category, slug: page.slug }));
}

export function getDocsNavigation() {
  return docsPages.reduce<Record<string, DocsPage[]>>((groups, page) => {
    groups[page.category] = [...(groups[page.category] || []), page];
    return groups;
  }, {});
}
