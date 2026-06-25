import Link from "next/link";

const updatedAt = "June 16, 2026";

const keyPoints = [
  {
    question: "What personal information do we process?",
    answer:
      "We process account details, billing records, website scan inputs, consent configuration, policy workflow data, usage logs, support messages, and security signals depending on how you use Zenvyra.",
  },
  {
    question: "Do we process sensitive personal information?",
    answer:
      "Zenvyra is business software and is not designed for unnecessary sensitive data. If sensitive information is submitted, we use it only for permitted service, security, legal, or customer-directed purposes.",
  },
  {
    question: "Do we sell personal information?",
    answer:
      "We do not sell personal information for money. Some privacy laws define sale, sharing, or targeted advertising broadly, so we provide opt-out controls and a Do Not Sell or Share page.",
  },
  {
    question: "How do we keep information safe?",
    answer:
      "We use access controls, provider review, logging, secure infrastructure practices, and monitoring. No internet service can be guaranteed to be completely secure.",
  },
  {
    question: "What rights do users have?",
    answer:
      "Depending on location, users may request access, correction, deletion, portability, restriction, objection, marketing opt-out, or sale/sharing opt-out.",
  },
  {
    question: "How can you contact us?",
    answer:
      "Send privacy questions or requests to support@zenvyra.com with your account email, workspace name, and the request you want reviewed.",
  },
];

const sections = [
  "What information do we collect?",
  "How do we process your information?",
  "What legal bases do we rely on?",
  "When and with whom do we share information?",
  "Do we use cookies and tracking technologies?",
  "How do we handle social logins and integrations?",
  "Is information transferred internationally?",
  "How long do we keep information?",
  "How do we keep information safe?",
  "Do we collect information from minors?",
  "What privacy rights do you have?",
  "Controls for Do Not Track and Global Privacy Control",
  "US state privacy disclosures",
  "Customer-controlled data",
  "Updates, contact, and data requests",
];

const dataRows = [
  {
    category: "Identifiers",
    examples: "Name, email address, account ID, IP address, company name, username, authentication identifiers.",
    collected: "Yes",
  },
  {
    category: "Commercial information",
    examples: "Plan, invoices, billing status, transaction identifiers, purchase history, refund records.",
    collected: "Yes",
  },
  {
    category: "Internet or network activity",
    examples: "Device type, browser, pages viewed, feature usage, log events, timestamps, diagnostics.",
    collected: "Yes",
  },
  {
    category: "Professional information",
    examples: "Business role, company, workspace membership, support or onboarding context.",
    collected: "Yes",
  },
  {
    category: "Geolocation",
    examples: "Approximate region inferred from IP address for security, localization, analytics, and compliance routing.",
    collected: "Limited",
  },
  {
    category: "Sensitive personal information",
    examples: "Not intentionally requested. May appear only if a user submits it in support messages, uploaded content, or customer-controlled records.",
    collected: "Limited",
  },
  {
    category: "Biometric information",
    examples: "Fingerprints, faceprints, voiceprints, or similar biometric identifiers.",
    collected: "No",
  },
];

function idFor(index: number) {
  return `section-${index + 1}`;
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16 lg:pt-32">
          <nav className="text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-orange-700">Home</Link>
            <span className="mx-2">/</span>
            <span>Privacy Notice</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">
                Privacy Notice
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Zenvyra Privacy Notice
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
                This notice explains how Zenvyra may collect, use, store, share, retain,
                and protect personal information when you visit our website, create an account,
                use our platform, publish privacy workflows, or contact us.
              </p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
              <p className="text-sm font-bold text-orange-800">Last updated</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{updatedAt}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Questions or privacy requests can be sent to support@zenvyra.com.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-950">
                Table of contents
              </h2>
              <ol className="mt-4 grid gap-2">
                {sections.map((section, index) => (
                  <li key={section}>
                    <a
                      href={`#${idFor(index)}`}
                      className="block rounded-md px-3 py-2 text-sm font-semibold leading-5 text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                    >
                      {index + 1}. {section}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="space-y-8">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black text-slate-950">Summary of key points</h2>
              <p className="mt-3 max-w-4xl text-base leading-7 text-slate-700">
                This summary highlights important parts of the notice. The full sections below
                provide more detail about what we collect, why we process it, when we share it, and
                how users can exercise privacy choices.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {keyPoints.map((point) => (
                  <div key={point.question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-base font-bold text-slate-950">{point.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{point.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <PolicySection index={0} title="What information do we collect?">
              <Lead>We collect information you provide, information generated when you use the service, and limited information from service providers needed to operate the platform.</Lead>
              <SubTitle>Personal information you provide to us</SubTitle>
              <BulletList
                items={[
                  "Account information: name, email address, password or authentication data, company name, job title, workspace details, and contact preferences.",
                  "Billing information: billing contact, plan, invoice history, tax details, payment status, transaction identifiers, and limited payment-provider records.",
                  "Product inputs: domains, website URLs, scan settings, consent banner configuration, policy answers, uploaded content, generated policy drafts, proof report details, and certificate settings.",
                  "Support and communications: support messages, onboarding responses, feedback, sales inquiries, screenshots, files, and any information you choose to include.",
                ]}
              />
              <SubTitle>Information collected automatically</SubTitle>
              <BulletList
                items={[
                  "Log and usage data: IP address, device details, browser type, pages viewed, feature usage, timestamps, actions, errors, diagnostics, and security events.",
                  "Device data: operating system, browser version, device type, language settings, approximate location, referral URLs, and technical identifiers.",
                  "Cookie data: consent choices, session state, analytics events, preference settings, and similar technologies described in our Cookie Policy.",
                ]}
              />
              <SubTitle>Information from third parties</SubTitle>
              <p className="mt-3 text-base leading-8 text-slate-700">
                We may receive limited information from payment processors, authentication providers,
                analytics tools, support systems, security vendors, and integrations you authorize.
                We do not intentionally collect personal information from data brokers for resale.
              </p>
            </PolicySection>

            <PolicySection index={1} title="How do we process your information?">
              <Lead>We process information for service delivery, security, billing, support, product improvement, legal compliance, and customer-directed workflows.</Lead>
              <BulletList
                items={[
                  "Create and manage accounts, authentication, workspaces, team roles, and product settings.",
                  "Run website scans, classify cookies and trackers, generate policy drafts, manage consent workflows, and prepare proof reports.",
                  "Process subscriptions, setup packages, invoices, failed payments, refunds, taxes, and billing support.",
                  "Send administrative notices, security alerts, support replies, onboarding messages, and product updates.",
                  "Detect fraud, prevent abuse, troubleshoot bugs, protect infrastructure, enforce limits, and investigate suspicious activity.",
                  "Improve templates, scan quality, product reliability, user experience, and analytics using aggregated or de-identified data where practical.",
                  "Comply with law, respond to lawful requests, resolve disputes, enforce terms, and protect users or the service.",
                ]}
              />
            </PolicySection>

            <PolicySection index={2} title="What legal bases do we rely on?">
              <Lead>Where laws such as the GDPR or UK GDPR require a legal basis, we rely on the basis that fits the processing activity.</Lead>
              <InfoTable
                rows={[
                  ["Contract", "To provide the service, account access, support, billing, requested scans, policy workflows, and customer-selected features."],
                  ["Legitimate interests", "To secure the service, prevent misuse, improve the product, analyze performance, support business users, and communicate about relevant services."],
                  ["Consent", "For optional marketing, certain cookies, testimonials, or other processing where consent is required and collected."],
                  ["Legal obligation", "For tax, accounting, regulatory, dispute, fraud prevention, and lawful request obligations."],
                  ["Vital interests", "In rare cases, to protect the safety of a person or prevent serious harm."],
                ]}
              />
              <p className="mt-5 text-base leading-8 text-slate-700">
                For customer-controlled data, Zenvyra may act as a processor or service
                provider. In those cases, the customer is generally responsible for the underlying
                privacy notice, lawful basis, consent, and end-user request handling.
              </p>
            </PolicySection>

            <PolicySection index={3} title="When and with whom do we share information?">
              <Lead>We share information only where needed for the service, legal obligations, security, customer instructions, or business operations.</Lead>
              <SubTitle>Provider categories</SubTitle>
              <BulletList
                items={[
                  "Cloud hosting, database, and storage providers.",
                  "Payment processors, finance tools, tax tools, and fraud prevention providers.",
                  "Email, support, communication, and customer success tools.",
                  "Analytics, diagnostics, monitoring, security, and incident response providers.",
                  "Authentication, integration, product engineering, and infrastructure tools.",
                  "Professional advisers, auditors, legal authorities, or regulators where required.",
                ]}
              />
              <SubTitle>Other sharing situations</SubTitle>
              <BulletList
                items={[
                  "Workspace users may see customer data according to their role and permissions.",
                  "Public hosted policies, proof pages, badges, or certificates may display information a customer chooses to publish.",
                  "Business transfers may involve relevant information if we are involved in financing, merger, acquisition, sale, or reorganization.",
                  "Legal requests may require disclosure if we believe the request is valid or disclosure is necessary to protect rights, safety, users, or the platform.",
                ]}
              />
            </PolicySection>

            <PolicySection index={4} title="Do we use cookies and tracking technologies?">
              <Lead>Yes. We use cookies and similar technologies for core functionality, security, preferences, analytics, diagnostics, and optional marketing where permitted.</Lead>
              <BulletList
                items={[
                  "Strictly necessary cookies support login, security, fraud prevention, consent storage, and core product operation.",
                  "Functional cookies remember preferences, interface choices, and support state.",
                  "Analytics cookies help us measure traffic, product usage, performance, and aggregate trends.",
                  "Marketing cookies may help measure campaigns or relevant messages where permitted by law and consent settings.",
                ]}
              />
              <p className="mt-4 text-base leading-8 text-slate-700">
                See our <Link href="/cookies" className="font-semibold text-orange-700 hover:underline">Cookie Policy</Link> and <Link href="/cookie-preferences" className="font-semibold text-orange-700 hover:underline">Cookie Preferences</Link> pages for more detail.
              </p>
            </PolicySection>

            <PolicySection index={5} title="How do we handle social logins and integrations?">
              <Lead>If we offer social login or third-party integrations, we may receive profile, account, authorization, or configuration data from the provider you choose.</Lead>
              <p className="mt-3 text-base leading-8 text-slate-700">
                The data received depends on the provider, permissions, and settings. We use that
                information to authenticate users, connect integrations, deliver requested features,
                and secure the account. Third-party providers are responsible for their own privacy
                practices, so you should review their notices and permission screens.
              </p>
            </PolicySection>

            <PolicySection index={6} title="Is information transferred internationally?">
              <Lead>Zenvyra and its providers may process information in countries other than where you live or operate.</Lead>
              <p className="mt-3 text-base leading-8 text-slate-700">
                Where required, we use safeguards such as contractual protections, data processing
                terms, vendor review, transfer assessments, and similar measures. We do not claim a
                specific certification such as the EU-US Data Privacy Framework unless that
                certification is actually obtained and published.
              </p>
            </PolicySection>

            <PolicySection index={7} title="How long do we keep information?">
              <Lead>We keep information only as long as reasonably needed for the purposes described in this notice, unless a longer period is required or permitted by law.</Lead>
              <InfoTable
                rows={[
                  ["Account records", "Retained while an account is active and for a reasonable period after closure for support, audit, tax, security, and dispute needs."],
                  ["Billing records", "Retained as needed for tax, accounting, fraud prevention, refunds, payment disputes, and legal obligations."],
                  ["Scan and proof records", "Retained according to customer settings, plan limits, product requirements, customer exports, and backup schedules."],
                  ["Security logs", "Retained for limited periods needed to detect abuse, investigate incidents, protect infrastructure, and enforce terms."],
                  ["Support messages", "Retained as needed to provide support, maintain context, improve the service, and resolve disputes."],
                ]}
              />
            </PolicySection>

            <PolicySection index={8} title="How do we keep information safe?">
              <Lead>We use administrative, technical, and organizational safeguards designed to protect information against unauthorized access, misuse, loss, and alteration.</Lead>
              <BulletList
                items={[
                  "Access controls and role-based permissions for internal and customer workspaces.",
                  "Logging, monitoring, rate limiting, and security review for suspicious activity.",
                  "Provider review and contractual restrictions for service providers.",
                  "Secure infrastructure practices, backups, and incident response workflows.",
                  "Customer-side controls such as strong passwords, least-privilege roles, and careful publication review.",
                ]}
              />
              <p className="mt-4 text-base leading-8 text-slate-700">
                No internet service is 100% secure. Customers should use the service only in secure
                environments and promptly report suspected unauthorized access.
              </p>
            </PolicySection>

            <PolicySection index={9} title="Do we collect information from minors?">
              <Lead>Zenvyra is intended for business use and is not directed to children.</Lead>
              <p className="mt-3 text-base leading-8 text-slate-700">
                We do not knowingly collect personal information from children under 18 or the
                equivalent age in a relevant jurisdiction. If you believe a child has provided
                personal information to us, contact support@zenvyra.com so we can review and
                delete it where appropriate.
              </p>
            </PolicySection>

            <PolicySection index={10} title="What privacy rights do you have?">
              <Lead>Depending on your location, you may have rights to access, correct, delete, export, restrict, object, withdraw consent, or opt out of certain processing.</Lead>
              <BulletList
                items={[
                  "Access: request a copy or explanation of personal information we process.",
                  "Correction: request correction of inaccurate or incomplete account information.",
                  "Deletion: request deletion of eligible information, subject to legal, billing, security, and backup limits.",
                  "Portability: request a copy of eligible information in a portable format where required.",
                  "Restriction or objection: request limits on certain processing where applicable.",
                  "Marketing opt-out: unsubscribe from marketing emails; service and security messages may still be sent.",
                  "Sale/sharing opt-out: submit a request through our Do Not Sell or Share page where applicable.",
                ]}
              />
              <p className="mt-4 text-base leading-8 text-slate-700">
                We may need to verify your identity before completing a request. Enterprise or
                customer-controlled data requests may need to be directed to the customer that
                controls the relevant workspace or website.
              </p>
            </PolicySection>

            <PolicySection index={11} title="Controls for Do Not Track and Global Privacy Control">
              <Lead>Some browsers offer Do Not Track signals, and some offer Global Privacy Control signals.</Lead>
              <p className="mt-3 text-base leading-8 text-slate-700">
                Because Do Not Track has no consistent legal or technical standard, we do not
                currently respond to DNT signals. Where required and technically feasible, we aim to
                treat Global Privacy Control signals as opt-out signals for sale, sharing, or
                targeted advertising on supported surfaces.
              </p>
            </PolicySection>

            <PolicySection index={12} title="US state privacy disclosures">
              <Lead>Some US state privacy laws require disclosures about categories of personal information collected, purposes, sharing, and rights.</Lead>
              <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-100 text-slate-950">
                    <tr>
                      <th className="px-4 py-3 font-black">Category</th>
                      <th className="px-4 py-3 font-black">Examples</th>
                      <th className="px-4 py-3 font-black">Collected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {dataRows.map((row) => (
                      <tr key={row.category}>
                        <td className="px-4 py-4 align-top font-bold text-slate-950">{row.category}</td>
                        <td className="px-4 py-4 align-top leading-6 text-slate-700">{row.examples}</td>
                        <td className="px-4 py-4 align-top font-semibold text-slate-700">{row.collected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 text-base leading-8 text-slate-700">
                We do not knowingly sell personal information for money. Where advertising or
                analytics activity may be considered sale, sharing, or targeted advertising under
                applicable law, you may use the controls described in this notice.
              </p>
            </PolicySection>

            <PolicySection index={13} title="Customer-controlled data">
              <Lead>When customers use Zenvyra to operate privacy workflows for their own websites, those customers may be responsible for the underlying personal information.</Lead>
              <p className="mt-3 text-base leading-8 text-slate-700">
                If you are an end user of one of our customers, you should review that customer's
                privacy policy and contact them for privacy rights requests. Zenvyra may
                assist customers with workflows, evidence, hosting, and records, but we generally
                follow the customer's instructions for customer-controlled data.
              </p>
            </PolicySection>

            <PolicySection index={14} title="Updates, contact, and data requests">
              <Lead>We may update this Privacy Notice as our product, legal requirements, or business operations change.</Lead>
              <BulletList
                items={[
                  "We will update the last updated date when this notice changes.",
                  "For privacy requests, contact support@zenvyra.com with your account email, workspace name, and request details.",
                  "For cookie choices, review our Cookie Policy and Cookie Preferences pages.",
                  "For sale/sharing opt-out requests, review our Do Not Sell or Share page.",
                ]}
              />
            </PolicySection>

            <section className="rounded-xl border border-orange-200 bg-orange-50 p-6 sm:p-8">
              <h2 className="text-2xl font-black text-slate-950">Important legal note</h2>
              <p className="mt-3 text-base leading-8 text-slate-700">
                Zenvyra provides software and operational privacy workflows. This notice is
                a practical baseline for our product and should be reviewed by qualified counsel
                before public launch for your company entity, jurisdiction, vendors, and final data
                practices.
              </p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={idFor(index)} className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-orange-700">
        {index + 1}. Privacy Notice
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg font-semibold leading-8 text-slate-800">{children}</p>;
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 text-xl font-bold text-slate-950">{children}</h3>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-7 text-slate-700">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="mt-5 overflow-hidden rounded-lg border border-slate-200">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-2 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:grid-cols-[220px_minmax(0,1fr)]">
          <dt className="text-sm font-black text-slate-950">{label}</dt>
          <dd className="text-sm leading-6 text-slate-700">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
