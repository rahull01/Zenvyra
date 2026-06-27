"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Building2, CheckCircle2, Globe, Loader2, Mail, MapPin, ShieldCheck, Wrench } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuth";

const regions = ["UK", "USA", "EU", "Global", "Canada", "Australia"];
const trackers = ["Google Analytics", "Meta Pixel", "TikTok Pixel", "Hotjar", "Clarity", "HubSpot", "Intercom", "Other"];
const aiTools = ["Chatbot", "AI support", "AI recommendations", "AI scoring/decisioning", "Content generation", "No AI"];
const platforms = ["Shopify", "WordPress", "Webflow", "WooCommerce", "GTM", "Custom React/Next", "Other"];
const accessOptions = ["I will install snippets myself", "I will invite Zenvyra", "I need guided setup"];

export default function OnboardingPage() {
  const router = useRouter();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessLegalName: "",
    tradingName: "",
    supportEmail: "",
    businessAddress: "",
    countryState: "",
    siteUrl: "",
    platform: "Shopify",
    targetRegions: ["UK", "USA"],
    privacyPolicyUrl: "",
    cookiePolicyUrl: "",
    termsUrl: "",
    cookieBannerProvider: "",
    trackerTools: [] as string[],
    dsarEmail: "",
    aiToolsUsed: [] as string[],
    platformAccessWillingness: "I need guided setup",
  });

  const setField = (field: string, value: any) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.businessLegalName.trim()) return toast.error("Business legal name is required.");
    if (!form.supportEmail.includes("@")) return toast.error("Support/contact email is required.");
    if (!form.siteUrl.trim()) return toast.error("Website URL is required.");
    if (form.targetRegions.length === 0) return toast.error("Select at least one target region.");
    if (!form.dsarEmail.includes("@")) return toast.error("DSAR/consumer request email is required.");
    if (form.aiToolsUsed.length === 0) return toast.error("Select AI usage.");

    setSaving(true);
    try {
      await api.post("/onboarding", {
        ...form,
        orgName: form.businessLegalName,
        industry: "Services",
        selectedRegs: form.targetRegions,
      });
      updateUser({
        onboardingCompleted: true,
        companyName: form.businessLegalName,
        websiteUrl: form.siteUrl,
        primaryRegion: form.targetRegions.join(", "),
        platform: form.platform,
      });
      toast.success("Onboarding completed.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to complete onboarding.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-base px-4 py-10 text-text-primary">
      <form onSubmit={submit} className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border border-border-light bg-surface-card p-6 shadow-card md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold uppercase text-accent">
              <ShieldCheck className="h-4 w-4" />
              Founder-led setup intake
            </div>
            <h1 className="text-3xl font-black tracking-normal text-text-primary">Complete your AI readiness setup</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Inventory AI systems, configure EU AI Act compliance, and establish privacy, consent, DSAR, and proof workflows.</p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary justify-center">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Finish setup
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Business profile" icon={Building2}>
            <Input label="Business legal name" value={form.businessLegalName} onChange={(value) => setField("businessLegalName", value)} placeholder="Company Ltd" />
            <Input label="Trading name" value={form.tradingName} onChange={(value) => setField("tradingName", value)} placeholder="Brand name" />
            <Input label="Support/contact email" icon={Mail} value={form.supportEmail} onChange={(value) => setField("supportEmail", value)} placeholder="support@company.com" />
            <Input label="Business address" icon={MapPin} value={form.businessAddress} onChange={(value) => setField("businessAddress", value)} placeholder="Street, city, country" />
            <Input label="Country/state" value={form.countryState} onChange={(value) => setField("countryState", value)} placeholder="UK / California / EU" />
          </Section>

          <Section title="AI systems and EU AI Act" icon={Bot}>
            <MultiChoice label="AI tools used" values={form.aiToolsUsed} options={aiTools} onChange={(values) => setField("aiToolsUsed", values)} exclusive="No AI" />
            <Choice label="Platform access willingness" value={form.platformAccessWillingness} options={accessOptions} onChange={(value) => setField("platformAccessWillingness", value)} icon={Wrench} />
            <div className="rounded-lg border border-border-light bg-background-secondary p-4 text-sm leading-6 text-text-secondary">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-status-success" />
                <p>We will create a starter AI inventory from this intake, then assess readiness, classify risk, and prepare required notices.</p>
              </div>
            </div>
          </Section>

          <Section title="Website and platform" icon={Globe}>
            <Input label="Website URL" value={form.siteUrl} onChange={(value) => setField("siteUrl", value)} placeholder="https://company.com" />
            <Choice label="Platform" value={form.platform} options={platforms} onChange={(value) => setField("platform", value)} />
            <MultiChoice label="Target regions" values={form.targetRegions} options={regions} onChange={(values) => setField("targetRegions", values)} />
            <Input label="Privacy policy URL" value={form.privacyPolicyUrl} onChange={(value) => setField("privacyPolicyUrl", value)} placeholder="https://company.com/privacy" />
            <Input label="Cookie policy URL" value={form.cookiePolicyUrl} onChange={(value) => setField("cookiePolicyUrl", value)} placeholder="https://company.com/cookies" />
            <Input label="Terms URL" value={form.termsUrl} onChange={(value) => setField("termsUrl", value)} placeholder="https://company.com/terms" />
          </Section>

          <Section title="Consent and requests" icon={ShieldCheck}>
            <Input label="Cookie banner provider" value={form.cookieBannerProvider} onChange={(value) => setField("cookieBannerProvider", value)} placeholder="Cookiebot, OneTrust, custom, none" />
            <MultiChoice label="Analytics/tracker tools" values={form.trackerTools} options={trackers} onChange={(values) => setField("trackerTools", values)} />
            <Input label="DSAR/consumer request email" value={form.dsarEmail} onChange={(value) => setField("dsarEmail", value)} placeholder="privacy@company.com" />
          </Section>
        </div>
      </form>
    </main>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <section className="standard-card space-y-4 hover:!translate-y-0">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, placeholder, icon: Icon }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; icon?: any }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-text-primary">{label}</span>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`text-input ${Icon ? "pl-10" : ""}`}
        />
      </div>
    </label>
  );
}

function Choice({ label, value, options, onChange, icon: Icon }: { label: string; value: string; options: string[]; onChange: (value: string) => void; icon?: any }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
        {Icon && <Icon className="h-4 w-4 text-accent" />}
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={pill(value === option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiChoice({ label, values, options, onChange, exclusive }: { label: string; values: string[]; options: string[]; onChange: (values: string[]) => void; exclusive?: string }) {
  const toggle = (option: string) => {
    if (exclusive && option === exclusive) return onChange([exclusive]);
    const base = exclusive ? values.filter((item) => item !== exclusive) : values;
    onChange(base.includes(option) ? base.filter((item) => item !== option) : [...base, option]);
  };
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-text-primary">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => toggle(option)} className={pill(values.includes(option))}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function pill(active: boolean) {
  return `rounded-lg border px-3 py-2 text-sm font-semibold transition ${
    active ? "border-accent/50 bg-accent/10 text-accent" : "border-border-light bg-background-secondary text-text-secondary hover:bg-background-tertiary"
  }`;
}
