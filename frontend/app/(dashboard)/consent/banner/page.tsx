"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Cookie, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

const TABS = ["Design", "Content", "Behavior", "Advanced"] as const;
const DEFAULT_TITLE = "We value your privacy";
const DEFAULT_DESCRIPTION = "We use cookies to enhance your experience, analyze traffic, and personalize content.";

type ConsentModeOverride = "auto" | "gdpr" | "ccpa";

type Banner = {
  id: string;
  name?: string;
  position?: string;
  layout?: string;
  colors?: Record<string, string>;
  content?: Record<string, string>;
  categories?: unknown[];
  languages?: unknown[];
  regionalRules?: unknown[];
  advanced?: Record<string, unknown>;
  status?: string;
};

const consentModes: Array<{
  id: ConsentModeOverride;
  label: string;
  description: string;
}> = [
  {
    id: "auto",
    label: "Auto-detect location",
    description: "Uses edge geo headers first, then client trace fallback when needed.",
  },
  {
    id: "gdpr",
    label: "Enforce strict GDPR everywhere",
    description: "Blocks analytics and marketing tags until explicit opt-in.",
  },
  {
    id: "ccpa",
    label: "Enforce CCPA everywhere",
    description: "Allows default tracking but shows a Do Not Sell or Share opt-out.",
  },
];

export default function ConsentBannerPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Design");
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBannerId, setSelectedBannerId] = useState("");
  const [consentModeOverride, setConsentModeOverride] = useState<ConsentModeOverride>("auto");
  const [crossDomainConsentSharingEnabled, setCrossDomainConsentSharingEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get<Banner[]>("/banners")
      .then((response) => {
        if (!mounted) return;
        const records = response.data || [];
        setBanners(records);
        const selected = records.find((banner) => banner.status === "active") || records[0];
        if (selected) {
          setSelectedBannerId(selected.id);
          setTitle(selected.content?.headline || DEFAULT_TITLE);
          setDescription(selected.content?.description || DEFAULT_DESCRIPTION);
          setConsentModeOverride(normalizeConsentMode(selected.advanced?.consentModeOverride));
          setCrossDomainConsentSharingEnabled(selected.advanced?.crossDomainConsentSharingEnabled === true);
        }
      })
      .catch((error) => toast.error(error?.response?.data?.message || "Unable to load banner settings"))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedBanner = useMemo(
    () => banners.find((banner) => banner.id === selectedBannerId) || null,
    [banners, selectedBannerId],
  );

  const handleSelectBanner = (bannerId: string) => {
    setSelectedBannerId(bannerId);
    const banner = banners.find((item) => item.id === bannerId);
    if (!banner) return;
    setTitle(banner.content?.headline || "We value your privacy");
    setDescription(
      banner.content?.description ||
        "We use cookies to enhance your experience, analyze traffic, and personalize content.",
    );
    setConsentModeOverride(normalizeConsentMode(banner.advanced?.consentModeOverride));
    setCrossDomainConsentSharingEnabled(banner.advanced?.crossDomainConsentSharingEnabled === true);
  };

  const handleSave = async () => {
    if (!selectedBanner) {
      toast.error("Create a banner before saving consent behavior.");
      return;
    }
    setSaving(true);
    try {
      const payload: Banner = {
        ...selectedBanner,
        content: {
          ...(selectedBanner.content || {}),
          headline: title,
          description,
        },
        advanced: {
          ...(selectedBanner.advanced || {}),
          consentModeOverride,
          crossDomainConsentSharingEnabled,
          enterpriseConsentKey: `zenvyra_enterprise_consent_${selectedBanner.id}`,
        },
      };
      const response = await api.put<Banner>(`/banners/${selectedBanner.id}`, payload);
      setBanners((previous) => previous.map((banner) => (banner.id === response.data.id ? response.data : banner)));
      toast.success("Banner behavior saved.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to save banner settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPageShell
      title="Cookie Consent Banner"
      subtitle="Customize how visitors see and manage cookies on your website."
      icon={Cookie}
      actions={[
        { label: "Save Changes", href: "/dashboard/consent/banner", primary: true, onClick: handleSave },
      ]}
    >
      {loading ? (
        <div className="standard-card text-center text-text-secondary">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading banner settings...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="standard-card !transform-none hover:!translate-y-0">
            <div className="mb-5 flex flex-col gap-2">
              <label className="text-sm font-medium text-text-primary">Active banner</label>
              <select
                value={selectedBannerId}
                onChange={(event) => handleSelectBanner(event.target.value)}
                className="text-input"
                disabled={banners.length === 0}
              >
                {banners.length === 0 ? (
                  <option>No banners available</option>
                ) : (
                  banners.map((banner) => (
                    <option key={banner.id} value={banner.id}>
                      {banner.name || banner.id} {banner.status === "active" ? "(active)" : ""}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex gap-1 border-b border-border-light">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-4 py-3 text-sm font-semibold transition-colors ${
                    tab === t ? "border-b-2 border-primary text-primary" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {tab === "Design" && (
                <>
                  <p className="text-sm font-medium text-text-primary">Banner style</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Bottom Bar", "Modal", "Sidebar"].map((style, i) => (
                      <button
                        key={style}
                        type="button"
                        className={`rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                          i === 0
                            ? "border-2 border-primary bg-primary-light/30 text-primary"
                            : "border-border-light hover:border-border-medium"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {tab === "Content" && (
                <>
                  <label className="block text-sm font-medium text-text-primary">Banner title</label>
                  <input className="text-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <label className="block text-sm font-medium text-text-primary">Description</label>
                  <textarea
                    className="text-input min-h-[100px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </>
              )}
              {tab === "Behavior" && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Regional compliance behavior</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      This value is passed into the hosted JavaScript bundle as `consentModeOverride`.
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {consentModes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setConsentModeOverride(mode.id)}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          consentModeOverride === mode.id
                            ? "border-2 border-primary bg-primary-light/30"
                            : "border-border-light hover:border-border-medium"
                        }`}
                      >
                        <span className="block text-sm font-semibold text-text-primary">
                          {mode.label}
                          {mode.id === "auto" ? " (Recommended)" : ""}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-text-secondary">{mode.description}</span>
                      </button>
                    ))}
                  </div>
                  <label className="flex items-start justify-between gap-4 rounded-xl border border-border-light bg-background-secondary p-4">
                    <span>
                      <span className="block text-sm font-semibold text-text-primary">Cross-Domain Consent Sharing</span>
                      <span className="mt-1 block text-xs leading-relaxed text-text-secondary">
                        Reuses the same enterprise consent key across domains under this parent account.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={crossDomainConsentSharingEnabled}
                      onChange={(event) => setCrossDomainConsentSharingEnabled(event.target.checked)}
                      className="mt-1 h-5 w-5 rounded text-primary"
                    />
                  </label>
                </div>
              )}
              {tab === "Advanced" && (
                <p className="text-sm text-text-secondary">
                  Google Consent Mode and tracker blocking are applied dynamically by the hosted bundle.
                </p>
              )}
            </div>
          </div>
          <div className="sticky top-24">
            <div className="rounded-2xl border border-border-light bg-background-secondary p-6">
              <p className="text-caption font-bold uppercase tracking-wider text-text-tertiary">Live Preview</p>
              <div className="mt-4 min-h-[220px] rounded-xl border border-dashed border-border-medium bg-background-primary p-4">
                {consentModeOverride === "ccpa" ? (
                  <div className="rounded-lg border border-border-light bg-background-primary p-4 shadow-card">
                    <p className="text-xs font-semibold uppercase text-text-tertiary">CCPA bar</p>
                    <p className="mt-2 text-xs text-text-secondary">
                      We may use analytics and advertising partners.
                    </p>
                    <button type="button" className="btn-secondary mt-4 !py-2 !px-4 text-caption">
                      Do Not Sell or Share My Personal Information
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border-light bg-background-primary p-4 shadow-card">
                    <p className="font-semibold text-text-primary">{title}</p>
                    <p className="mt-2 text-xs text-text-secondary">{description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className="btn-primary !py-2 !px-4 text-caption">
                        Accept All
                      </button>
                      <button type="button" className="btn-secondary !py-2 !px-4 text-caption">
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-text-secondary">
                Current mode: {consentModeOverride === "auto" ? "Auto-detect" : consentModeOverride.toUpperCase()}
              </p>
              {saving && (
                <p className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}

function normalizeConsentMode(value: unknown): ConsentModeOverride {
  return value === "gdpr" || value === "ccpa" ? value : "auto";
}
