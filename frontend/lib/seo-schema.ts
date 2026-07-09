import { PUBLIC_APP_URL } from "@/lib/constants";

export type SchemaContext = "https://schema.org";

export interface AggregateOfferSchema {
  "@type": "AggregateOffer";
  priceCurrency: "USD";
  lowPrice: "0";
  highPrice: "999";
  offerCount: "4";
}

export interface ZenvyraSoftwareProductSchema {
  "@context": SchemaContext;
  "@type": ["SoftwareApplication", "Product"];
  name: "Zenvyra";
  applicationCategory: "BusinessApplication, AI Governance";
  operatingSystem: "All";
  offers: AggregateOfferSchema;
  featureList: [
    "EU AI Act readiness scans for AI startups",
    "AI policy generation and transparency notices",
    "Compliance evidence packs and public trust badges",
    "Automated cookie consent and GDPR workflows"
  ];
}

export interface OrganizationSchema {
  "@context": SchemaContext;
  "@type": "Organization";
  name: "Zenvyra";
  url: string;
  sameAs: string[];
}

export interface WebSiteSchema {
  "@context": SchemaContext;
  "@type": "WebSite";
  name: "Zenvyra";
  url: string;
  description: string;
}

export type SeoSchema = ZenvyraSoftwareProductSchema | OrganizationSchema | WebSiteSchema;

export const ZenvyraFeatures: ZenvyraSoftwareProductSchema["featureList"] = [
  "EU AI Act readiness scans for AI startups",
  "AI policy generation and transparency notices",
  "Compliance evidence packs and public trust badges",
  "Automated cookie consent and GDPR workflows",
];

export function getZenvyraSoftwareProductSchema(): ZenvyraSoftwareProductSchema {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "Product"],
    name: "Zenvyra",
    applicationCategory: "BusinessApplication, AI Governance",
    operatingSystem: "All",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      highPrice: "999",
      offerCount: "4",
    },
    featureList: ZenvyraFeatures,
  };
}

export function getZenvyraOrganizationSchema(baseUrl = PUBLIC_APP_URL): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zenvyra",
    url: baseUrl,
    sameAs: [
      `${baseUrl}/about`,
      `${baseUrl}/pricing`,
      `${baseUrl}/features`,
    ],
  };
}

export function getZenvyraWebSiteSchema(baseUrl = PUBLIC_APP_URL): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zenvyra",
    url: baseUrl,
    description:
      "EU AI Act readiness evidence for AI startups. Inventory systems, classify risk, map obligations, collect evidence, and export a proof pack for customer diligence.",
  };
}

export function getZenvyraSchemaGraph(baseUrl = PUBLIC_APP_URL): SeoSchema[] {
  return [
    getZenvyraSoftwareProductSchema(),
    getZenvyraOrganizationSchema(baseUrl),
    getZenvyraWebSiteSchema(baseUrl),
  ];
}

export function stringifyJsonLd(schema: SeoSchema | SeoSchema[]): string {
  return JSON.stringify(schema);
}
