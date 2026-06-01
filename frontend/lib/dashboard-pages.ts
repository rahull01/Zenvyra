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
    actions: [{ label: "Save as Draft", href: "/dashboard/policies", primary: false }],
  },
  "consent/banner": {
    title: "Cookie Consent Banner",
    subtitle: "Customize how visitors see and manage cookies on your website.",
    iconName: "Cookie",
    actions: [
      { label: "Preview on Site", href: "/dashboard/consent/preferences", primary: false },
      { label: "Save Changes", href: "/dashboard/consent/banner", primary: true },
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
    stats: [
      { label: "Events today", value: "1,284", trend: "+8% vs yesterday" },
      { label: "Accept rate", value: "72%", trend: "+2% this week" },
      { label: "Reject rate", value: "18%" },
      { label: "Customize rate", value: "10%" },
    ],
  },
  "consent/blockchain": {
    title: "Blockchain Consent Ledger",
    subtitle: "Immutable consent records verified on-chain for audit trails.",
    iconName: "Blocks",
    stats: [
      { label: "Total records", value: "48,291" },
      { label: "Last verified", value: "2 min ago" },
      { label: "Network status", value: "Operational", trend: "Verified" },
    ],
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
    stats: [
      { label: "Banner views (30d)", value: "2.4M" },
      { label: "Unique visitors", value: "890K" },
      { label: "Avg. consent time", value: "4.2s" },
      { label: "Policy page views", value: "156K" },
    ],
  },
  "compliance-score": {
    title: "Compliance Score",
    subtitle: "AI-powered score with breakdowns and prioritized fix recommendations.",
    iconName: "ShieldCheck",
    stats: [
      { label: "Overall score", value: "85/100", trend: "+3 this week" },
      { label: "Privacy policy", value: "85%" },
      { label: "Cookie consent", value: "92%" },
      { label: "Terms & conditions", value: "70%" },
    ],
    actions: [{ label: "Export Report", href: "/dashboard/analytics", primary: true }],
  },
  dsar: {
    title: "DSAR Form Builder",
    subtitle: "Create data subject access request forms for GDPR and CCPA workflows.",
    iconName: "UserCheck",
    actions: [{ label: "View Requests", href: "/dashboard/dsar/requests", primary: true }],
  },
  "dsar/requests": {
    title: "DSAR Requests",
    subtitle: "Manage incoming data subject requests and response deadlines.",
    iconName: "UserCheck",
    stats: [
      { label: "Open requests", value: "7" },
      { label: "Completed (30d)", value: "24" },
      { label: "Avg. response time", value: "3.2 days" },
      { label: "Overdue", value: "1", trend: "Needs attention" },
    ],
  },
  "websites/new": {
    title: "Add Website",
    subtitle: "Connect a new domain to scan, monitor, and deploy compliance assets.",
    iconName: "Globe",
    actions: [{ label: "Add Website", href: "/dashboard/websites", primary: true }],
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
    actions: [{ label: "Save Changes", href: "/dashboard/settings/account", primary: true }],
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
    actions: [{ label: "Browse API Docs", href: "/dashboard/integrations/api", primary: false }],
  },
  "integrations/api": {
    title: "API Keys",
    subtitle: "Generate and manage API keys for programmatic access.",
    iconName: "Key",
    actions: [{ label: "Generate New Key", href: "/dashboard/integrations/api", primary: true }],
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
    stats: [
      { label: "Current level", value: "Compliance Pro" },
      { label: "Streak", value: "12 days", trend: "🔥 Active" },
      { label: "Badges earned", value: "8/24" },
      { label: "Team rank", value: "#2" },
    ],
  },
  "compliance/regions": {
    title: "Multi-Region Compliance Hub",
    subtitle: "Configure GDPR, CCPA, PIPEDA, LGPD, and regional requirements in one place.",
    iconName: "Map",
  },
  workflows: {
    title: "No-Code Workflow Builder",
    subtitle: "Automate compliance actions with visual triggers and webhooks.",
    iconName: "Workflow",
  },
  monitor: {
    title: "Real-Time Compliance Monitor",
    subtitle: "Live status for websites, policies, and cookie compliance.",
    iconName: "Activity",
  },
  "ai-chat": {
    title: "AI Compliance Assistant",
    subtitle: "Ask anything about compliance, policies, and cookie management.",
    iconName: "Sparkles",
  },
};
