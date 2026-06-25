import Link from "next/link";

const updatedAt = "June 16, 2026";

const categories = [
  {
    name: "Strictly necessary",
    purpose: "Login, security, fraud prevention, consent storage, account access, load balancing, and core service delivery.",
    choice: "Always active",
  },
  {
    name: "Functional",
    purpose: "Remember interface preferences, region, support state, and product convenience settings.",
    choice: "Optional where available",
  },
  {
    name: "Analytics and performance",
    purpose: "Measure visits, feature usage, errors, page performance, aggregate trends, and product reliability.",
    choice: "Optional where required",
  },
  {
    name: "Marketing",
    purpose: "Measure campaigns, referrals, and relevant messages where permitted by law and consent settings.",
    choice: "Optional",
  },
  {
    name: "Security and diagnostics",
    purpose: "Detect abuse, rate-limit requests, investigate incidents, monitor uptime, and protect the platform.",
    choice: "Usually necessary",
  },
];

const toc = [
  "What cookies and similar technologies are",
  "How Zenvyra uses cookies",
  "Cookie categories",
  "Third-party cookies and providers",
  "Consent and regional differences",
  "How to manage cookies",
  "Customer responsibilities",
  "Updates and contact",
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16 lg:pt-32">
          <nav className="text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-orange-700">Home</Link>
            <span className="mx-2">/</span>
            <span>Cookie Policy</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">Cookie Notice</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Zenvyra Cookie Policy
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
                This policy explains how Zenvyra uses cookies, pixels, local storage,
                scripts, and similar technologies across our website and product surfaces.
              </p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
              <p className="text-sm font-bold text-orange-800">Last updated</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{updatedAt}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Manage optional categories through browser settings or our Cookie Preferences page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-950">Table of contents</h2>
              <ol className="mt-4 grid gap-2">
                {toc.map((item, index) => (
                  <li key={item}>
                    <a href={`#cookie-${index + 1}`} className="block rounded-md px-3 py-2 text-sm font-semibold leading-5 text-slate-600 hover:bg-orange-50 hover:text-orange-700">
                      {index + 1}. {item}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="space-y-8">
            <CookieSection id="cookie-1" number="1" title="What cookies and similar technologies are">
              Cookies are small files placed on your browser or device. Similar technologies include
              pixels, SDKs, scripts, local storage, session storage, device identifiers, and server
              logs. They help websites remember settings, secure sessions, measure performance, and
              provide product functionality.
            </CookieSection>

            <CookieSection id="cookie-2" number="2" title="How Zenvyra uses cookies">
              Zenvyra uses cookies and similar technologies to operate the website and
              platform, authenticate users, remember preferences, protect accounts, understand
              product usage, improve performance, investigate errors, and support marketing where
              permitted.
            </CookieSection>

            <section id="cookie-3" className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-orange-700">3. Cookie Notice</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Cookie categories</h2>
              <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-100 text-slate-950">
                    <tr>
                      <th className="px-4 py-3 font-black">Category</th>
                      <th className="px-4 py-3 font-black">Purpose</th>
                      <th className="px-4 py-3 font-black">Choice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {categories.map((row) => (
                      <tr key={row.name}>
                        <td className="px-4 py-4 align-top font-bold text-slate-950">{row.name}</td>
                        <td className="px-4 py-4 align-top leading-6 text-slate-700">{row.purpose}</td>
                        <td className="px-4 py-4 align-top font-semibold text-slate-700">{row.choice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <CookieSection id="cookie-4" number="4" title="Third-party cookies and providers">
              Some cookies may be set by providers that help with hosting, payments, analytics,
              support, security, communications, diagnostics, or marketing. These providers may
              process cookie data according to their own policies and our agreements with them.
            </CookieSection>

            <CookieSection id="cookie-5" number="5" title="Consent and regional differences">
              Cookie rules vary by region. Where consent is required for optional cookies, we aim to
              request consent before those cookies are used. In other regions, controls may be
              provided through browser settings, opt-out links, product preferences, or Global
              Privacy Control signals where supported.
            </CookieSection>

            <CookieSection id="cookie-6" number="6" title="How to manage cookies">
              You can manage cookies through browser settings, device controls, and any cookie
              banner or preference center shown on the website. Blocking strictly necessary cookies
              may break login, security, or core product features. Rejecting optional cookies may
              limit analytics, personalization, or campaign measurement.
            </CookieSection>

            <CookieSection id="cookie-7" number="7" title="Customer responsibilities">
              Customers using Zenvyra are responsible for configuring cookie banners,
              cookie tables, policy text, consent categories, and region rules for their own
              websites. Zenvyra helps create and operate those workflows, but customers
              remain responsible for their published disclosures and consent configuration.
            </CookieSection>

            <CookieSection id="cookie-8" number="8" title="Updates and contact">
              We may update this Cookie Policy as cookies, vendors, technology, or legal
              requirements change. Questions about cookies can be sent to support@zenvyra.com.
              You can also review our <Link href="/cookie-preferences" className="font-semibold text-orange-700 hover:underline">Cookie Preferences</Link> page.
            </CookieSection>
          </article>
        </div>
      </section>
    </main>
  );
}

function CookieSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-orange-700">{number}. Cookie Notice</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h2>
      <p className="mt-5 text-base leading-8 text-slate-700">{children}</p>
    </section>
  );
}
