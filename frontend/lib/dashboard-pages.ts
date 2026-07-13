import type { IconName } from "@/lib/icons";

export type DashboardPageMeta = {
  title: string;
  subtitle: string;
  iconName: IconName;
  actions?: { label: string; href: string; primary?: boolean }[];
  stats?: { label: string; value: string; trend?: string }[];
};

export const DASHBOARD_PAGE_META: Record<string, DashboardPageMeta> = {
  "policies/new": {
    title: "Policy Generator",
    subtitle: "Answer a few questions and we'll generate a compliant policy for you.",
    iconName: "FileText",
    actions: [{ label: "Save as Draft", href: "/policies", primary: false }],
  },
  "consent/banner": {
    title: "Cookie Consent Banner",
    subtitle: "Customize how visitors see and manage cookies on your website.",
    iconName: "Cookie",
    actions: [
      { label: "Preview on Site", href: "/consent/preferences", primary: false },
      { label: "Save Changes", href: "/consent/banner", primary: true },
    ],
  },
  "consent/preferences": {
    title: "Preference Center",
    subtitle: "Configure granular cookie categories and user preference flows.",
    iconName: "Cookie",
  },
  "consent/logs": {
    title: "Consent Logs",
    subtitle: "Review consent events, timestamps, and user choices across your properties.",
    iconName: "Cookie",
  },
  "consent/blockchain": {
    title: "Blockchain Consent Ledger",
    subtitle: "Immutable consent records verified on-chain for audit trails.",
    iconName: "Blocks",
  },
  "consent/voice": {
    title: "Voice-Enabled Consent",
    subtitle: "Accessibility-first voice commands for cookie and privacy choices.",
    iconName: "Mic",
  },
  analytics: {
    title: "Analytics & Reports",
    subtitle: "Track banner views, consent rates, and compliance trends over time.",
    iconName: "BarChart3",
  },
  "compliance-score": {
    title: "Compliance Score",
    subtitle: "AI-powered score with breakdowns and prioritized fix recommendations.",
    iconName: "ShieldCheck",
    actions: [{ label: "Export Report", href: "/analytics", primary: true }],
  },
  dsar: {
    title: "DSAR Form Builder",
    subtitle: "Create data subject access request forms for GDPR and CCPA workflows.",
    iconName: "UserCheck",
    actions: [{ label: "View Requests", href: "/dsar/requests", primary: true }],
  },
  "dsar/requests": {
    title: "DSAR Requests",
    subtitle: "Manage incoming data subject requests and response deadlines.",
    iconName: "UserCheck",
  },
  "websites/new": {
    title: "Add Website",
    subtitle: "Connect a new domain to scan, monitor, and deploy compliance assets.",
    iconName: "Globe",
    actions: [{ label: "Add Website", href: "/websites", primary: true }],
  },
  "billing/invoices": {
    title: "Invoices",
    subtitle: "Download past invoices and review billing history.",
    iconName: "Receipt",
  },
  "settings/account": {
    title: "Account Settings",
    subtitle: "Manage your profile, preferences, and security.",
    iconName: "Settings",
    actions: [{ label: "Save Changes", href: "/settings/account", primary: true }],
  },
  "settings/notifications": {
    title: "Notification Settings",
    subtitle: "Control email and push alerts for compliance events.",
    iconName: "Bell",
  },
  integrations: {
    title: "Integrations",
    subtitle: "Connect WordPress, Shopify, Zapier, Google Tag Manager, and more.",
    iconName: "Plug",
    actions: [{ label: "Browse API Docs", href: "/integrations/api", primary: false }],
  },
  "integrations/api": {
    title: "API Keys",
    subtitle: "Generate and manage API keys for programmatic access.",
    iconName: "Key",
    actions: [{ label: "Generate New Key", href: "/integrations/api", primary: true }],
  },
  "white-label": {
    title: "White-Label Settings",
    subtitle: "Customize branding for reseller and agency client portals.",
    iconName: "Palette",
  },
  gamification: {
    title: "Compliance Journey",
    subtitle: "Earn badges, track streaks, and level up your compliance posture.",
    iconName: "Trophy",
  },
  "compliance/regions": {
    title: "Multi-Region AI Compliance Hub",
    subtitle: "Configure EU AI Act, UK AI Bill, and emerging AI regulations in one place.",
    iconName: "Map",
  },
  workflows: {
    title: "No-Code Workflow Builder",
    subtitle: "Automate compliance actions with visual triggers and webhooks.",
    iconName: "Workflow",
  },
  monitor: {
    title: "AI Readiness Monitor",
    subtitle: "Live dashboard for AI systems, risk classification, documentation status, and compliance proof.",
    iconName: "Activity",
  },
  "ai-chat": {
    title: "AI Compliance Assistant",
    subtitle: "Ask anything about compliance, policies, and cookie management.",
    iconName: "Sparkles",
  },
};
