import {
  FileText,
  Cookie,
  Scan,
  Shield,
  Globe,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export type NavMegaItem = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export type NavMegaColumn = {
  title: string;
  items: NavMegaItem[];
};

export const PRODUCTS_MEGA: NavMegaColumn[] = [
  {
    title: "Policy Generators",
    items: [
      {
        label: "Privacy Policy Generator",
        href: "/products/privacy-policy",
        description: "GDPR, CCPA & global privacy policies",
        icon: FileText,
      },
      {
        label: "Terms & Conditions",
        href: "/products/terms-conditions",
        description: "Protect your business with custom terms",
        icon: ClipboardList,
      },
      {
        label: "EULA Generator",
        href: "/products/eula",
        description: "End-user license agreements for apps",
        icon: FileText,
      },
      {
        label: "Disclaimer Generator",
        href: "/products/disclaimer",
        description: "Limit liability for blogs and apps",
        icon: Shield,
      },
    ],
  },
  {
    title: "Consent Management",
    items: [
      {
        label: "Cookie Consent Manager",
        href: "/products/cookie-consent",
        description: "Customizable banners in minutes",
        icon: Cookie,
      },
      {
        label: "Cookie Scanner",
        href: "/products/cookie-scanner",
        description: "Scan, categorize, and review cookies",
        icon: Scan,
      },
      {
        label: "AI Compliance Assistant",
        href: "/products/ai-assistant",
        description: "Ask compliance questions with AI",
        icon: Shield,
      },
      {
        label: "Competitor Audit",
        href: "/products/competitor-audit",
        description: "Benchmark against competitor sites",
        icon: Scan,
      },
    ],
  },
];

export const MAIN_NAV = [
  { label: "Products", href: "/features", mega: PRODUCTS_MEGA },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/about" },
] as const;

export const TRUST_LOGOS = [
  { name: "Shopify", width: 100 },
  { name: "WordPress", width: 110 },
  { name: "Wix", width: 70 },
  { name: "Squarespace", width: 120 },
  { name: "Webflow", width: 90 },
];
