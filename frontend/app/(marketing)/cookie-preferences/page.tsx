import PageScaffold from "@/components/marketing/PageScaffold";

const preferences = [
  { title: "Strictly necessary", status: "Always active", text: "Required for login, security, fraud prevention, consent storage, and core platform operation." },
  { title: "Functional", status: "Optional", text: "Remembers interface preferences, support state, and product convenience settings." },
  { title: "Analytics", status: "Optional", text: "Helps measure aggregate traffic, product usage, errors, and performance." },
  { title: "Marketing", status: "Optional", text: "Helps measure campaigns and relevant messages where permitted." },
];

export default function CookiePreferencesPage() {
  return (
    <PageScaffold
      title="Cookie Preferences"
      subtitle="Review the cookie categories used by Zenvyra and how choices are handled."
      showCta={false}
      sectionClassName="py-10 sm:py-14 lg:py-16"
    >
      <div className="grid gap-4">
        {preferences.map((item) => (
          <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-slate-950">{item.title}</h2>
              <span className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{item.status}</span>
            </div>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.text}</p>
          </article>
        ))}
      </div>
    </PageScaffold>
  );
}
