import { PUBLIC_APP_URL } from "@/lib/constants";

export type SchemaContext = "https://schema.org";

export interface AggregateOfferSchema {
  "@type": "AggregateOffer";
  priceCurrency: "USD";
  lowPrice: "29";
  highPrice: "199";
  offerCount: "4";
}

export interface ZenvyraSoftwareProductSchema {
  "@context": SchemaContext;
  "@type": ["SoftwareApplication", "Product"];
  name: "Zenvyra";
  applicationCategory: "BusinessApplication, Privacy Compliance";
  operatingSystem: "All";
  offers: AggregateOfferSchema;
  featureList: [
    "Set-and-Forget Live Dynamic Policy Updates via JavaScript Embeds",
    "AI-Driven Automated Website Tracker Classification Engine",
    "Cryptographic Consent Audit Trails for Regulatory Enforcement",
    "Automated DSAR Portal & Deadline Tracking Workflow Engine"
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
  "Set-and-Forget Live Dynamic Policy Updates via JavaScript Embeds",
  "AI-Driven Automated Website Tracker Classification Engine",
  "Cryptographic Consent Audit Trails for Regulatory Enforcement",
  "Automated DSAR Portal & Deadline Tracking Workflow Engine",
];

export function getZenvyraSoftwareProductSchema(): ZenvyraSoftwareProductSchema {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "Product"],
    name: "Zenvyra",
    applicationCategory: "BusinessApplication, Privacy Compliance",
    operatingSystem: "All",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "29",
      highPrice: "199",
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
      "AI privacy compliance platform, automated cookie consent platform, and enterprise GDPR tool for live policy updates, tracker classification, consent audit trails, and DSAR deadline workflows.",
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
