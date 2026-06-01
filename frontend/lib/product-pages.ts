import type { IconName } from "@/lib/icons";

export type ProductPageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  iconName: IconName;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const PRODUCT_PAGES: Record<string, ProductPageContent> = {
  "privacy-policy": {
    slug: "privacy-policy",
    eyebrow: "POLICY GENERATOR",
    title: "Privacy Policy",
    highlight: "Generator",
    description:
      "Generate attorney-vetted privacy policies tailored to GDPR, CCPA, LGPD, and global frameworks in minutes.",
    iconName: "FileText",
    features: [
      "Jurisdiction-aware clauses for 150+ countries",
      "Auto-updates when regulations change",
      "Hosted policy page with custom branding",
      "One-click embed for any website or app",
    ],
    ctaLabel: "Generate Privacy Policy",
    ctaHref: "/auth/signup",
  },
  "terms-conditions": {
    slug: "terms-conditions",
    eyebrow: "POLICY GENERATOR",
    title: "Terms & Conditions",
    highlight: "Generator",
    description:
      "Protect your business with customizable terms that cover liability, payments, subscriptions, and user conduct.",
    iconName: "Scale",
    features: [
      "SaaS, e-commerce, and marketplace templates",
      "Editable sections with AI suggestions",
      "Version history and change notifications",
      "PDF, HTML, and hosted link delivery",
    ],
    ctaLabel: "Create Terms",
    ctaHref: "/auth/signup",
  },
  "cookie-consent": {
    slug: "cookie-consent",
    eyebrow: "CONSENT MANAGEMENT",
    title: "Cookie Consent",
    highlight: "Manager",
    description:
      "Deploy beautiful, compliant cookie banners with Google Consent Mode v2 and IAB TCF 2.3 support.",
    iconName: "Cookie",
    features: [
      "Bottom bar, modal, and sidebar layouts",
      "50+ languages with geo-targeting",
      "Preference center for granular consent",
      "Real-time preview before publishing",
    ],
    ctaLabel: "Set Up Consent Banner",
    ctaHref: "/dashboard/consent/banner",
  },
  "cookie-scanner": {
    slug: "cookie-scanner",
    eyebrow: "AUTOMATED SCANNING",
    title: "Cookie",
    highlight: "Scanner",
    description:
      "Automatically detect, categorize, and document every cookie and tracker on your website.",
    iconName: "Scan",
    features: [
      "Scheduled scans with change alerts",
      "Vendor database with risk scoring",
      "Exportable cookie inventory reports",
      "Integration with consent banner blocking",
    ],
    ctaLabel: "Run Free Scan",
    ctaHref: "/compliance-checker",
  },
  eula: {
    slug: "eula",
    eyebrow: "POLICY GENERATOR",
    title: "EULA",
    highlight: "Generator",
    description: "Create end-user license agreements for desktop, mobile, and SaaS applications.",
    iconName: "FileText",
    features: [
      "Software-specific license terms",
      "Acceptance flow for install and signup",
      "Multi-platform deployment options",
      "Attorney-reviewed base templates",
    ],
    ctaLabel: "Generate EULA",
    ctaHref: "/auth/signup",
  },
  disclaimer: {
    slug: "disclaimer",
    eyebrow: "POLICY GENERATOR",
    title: "Disclaimer",
    highlight: "Generator",
    description: "Limit liability for blogs, affiliate sites, medical content, and professional services.",
    iconName: "Scale",
    features: [
      "Industry-specific disclaimer templates",
      "Affiliate and advertising disclosures",
      "Easy embed for footers and sidebars",
      "Automatic jurisdiction customization",
    ],
    ctaLabel: "Create Disclaimer",
    ctaHref: "/auth/signup",
  },
  "return-policy": {
    slug: "return-policy",
    eyebrow: "POLICY GENERATOR",
    title: "Return Policy",
    highlight: "Generator",
    description: "Build clear return and refund policies that reduce chargebacks and support tickets.",
    iconName: "RotateCcw",
    features: [
      "E-commerce return window configuration",
      "Refund method and restocking rules",
      "Marketplace-specific requirements",
      "Hosted page with checkout links",
    ],
    ctaLabel: "Generate Return Policy",
    ctaHref: "/auth/signup",
  },
  "shipping-policy": {
    slug: "shipping-policy",
    eyebrow: "POLICY GENERATOR",
    title: "Shipping Policy",
    highlight: "Generator",
    description: "Publish transparent shipping timelines, costs, and international delivery terms.",
    iconName: "Truck",
    features: [
      "Domestic and international shipping clauses",
      "Carrier delay and force majeure language",
      "Customs and duties disclosures",
      "Shopify and WooCommerce ready embeds",
    ],
    ctaLabel: "Generate Shipping Policy",
    ctaHref: "/auth/signup",
  },
  "ai-assistant": {
    slug: "ai-assistant",
    eyebrow: "AI COMPLIANCE",
    title: "AI Compliance",
    highlight: "Assistant",
    description:
      "Ask compliance questions, draft policy clauses, and get jurisdiction-specific guidance instantly.",
    iconName: "Bot",
    features: [
      "Natural language Q&A for GDPR, CCPA, and more",
      "Policy clause generation and review",
      "Actionable fix recommendations",
      "Export chat transcripts for legal review",
    ],
    ctaLabel: "Try AI Assistant",
    ctaHref: "/dashboard/ai-insights",
  },
  "competitor-audit": {
    slug: "competitor-audit",
    eyebrow: "COMPETITIVE INTELLIGENCE",
    title: "Competitor Compliance",
    highlight: "Audit",
    description:
      "Compare your compliance posture against competitors and uncover gaps before your customers do.",
    iconName: "GanttChart",
    features: [
      "Side-by-side compliance score comparison",
      "Feature gap analysis with recommendations",
      "Cookie and policy inventory diff",
      "Exportable PDF audit reports",
    ],
    ctaLabel: "Run Competitor Audit",
    ctaHref: "/dashboard/competitors",
  },
};

export type ProductSlug = keyof typeof PRODUCT_PAGES;
export const PRODUCT_SLUGS = Object.keys(PRODUCT_PAGES) as ProductSlug[];
