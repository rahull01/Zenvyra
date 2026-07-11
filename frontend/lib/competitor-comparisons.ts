export interface CompetitorComparisonConfig {
  slug: string;
  name: string;
  positioning: string;
  startingPrice: string;
  bestFor: string;
  limitation: string;
  comparisonRows: ComparisonRow[];
}

export interface ComparisonRow {
  capability: string;
  Zenvyra: string;
  competitor: string;
}

export const competitorComparisons = {
  legacyPolicyTools: {
    slug: "legacy-policy-tools",
    name: "Legacy policy tools",
    positioning: "privacy policy generation and consent management tools",
    startingPrice: "$15-$20 per month for common paid tiers",
    bestFor: "small businesses that need simple generated privacy documents and basic consent banners",
    limitation:
      "Legacy policy tools are strongest when the job is creating policies and running a cookie consent setup. Growing companies still need a clearer proof layer when trackers, scripts, DSAR requests, and policy obligations change.",
    comparisonRows: [
      {
        capability: "Compliance proof pack",
        Zenvyra: "Scan history, consent records, policy versions, DSAR status, and public verification are packaged together.",
        competitor: "Strong policy and consent tooling, but proof is less centered around one buyer-ready audit packet.",
      },
      {
        capability: "Auto-fix workflow",
        Zenvyra: "Issues include exact remediation steps for Shopify, WordPress, Webflow, GTM, Next.js, and custom code.",
        competitor: "Setup is primarily self-serve, which can leave non-technical teams unsure how to fix implementation gaps.",
      },
      {
        capability: "Agency workflow",
        Zenvyra: "Agency Hub supports multi-client site control, white-label certificates, PDF reports, and centralized monitoring.",
        competitor: "Agency support exists, but pricing and workflows are less transparent for small agencies validating a new service line.",
      },
      {
        capability: "Trust before purchase",
        Zenvyra: "Public verification pages and sample proof reports help prospects see scoped operational evidence before buying.",
        competitor: "Trust is anchored in brand maturity, legal expert backing, and CMP credibility.",
      },
    ],
  },
  cookieyes: {
    slug: "cookieyes",
    name: "CookieYes",
    positioning: "cookie consent and banner management platform",
    startingPrice: "$10-$40 per month for typical paid website tiers",
    bestFor: "teams focused mainly on cookie banners and consent collection",
    limitation:
      "CookieYes is banner-first. Teams that need policy regeneration, tracker intelligence, and DSAR operations often need extra tools.",
    comparisonRows: [
      {
        capability: "Dynamic script blocking",
        Zenvyra: "Supports consent-aware script blocking and tracker classification tied to policy updates.",
        competitor: "Strong cookie banner coverage, with less emphasis on full compliance workflow automation.",
      },
      {
        capability: "Policy automation",
        Zenvyra: "Monthly background scan cron detects new trackers and pushes live policy updates.",
        competitor: "Policy updates are not the primary automation layer of the product.",
      },
      {
        capability: "Enterprise compliance operations",
        Zenvyra: "Combines consent, policies, DSAR deadlines, audit trails, and agency controls.",
        competitor: "Best suited when cookie consent is the central requirement.",
      },
      {
        capability: "Legal hardening",
        Zenvyra: "Creates audit-ready evidence around consent records, tracker changes, and DSAR response deadlines.",
        competitor: "Consent evidence exists, but broader legal workflow hardening is more limited.",
      },
    ],
  },
  osano: {
    slug: "osano",
    name: "Osano",
    positioning: "enterprise privacy management platform",
    startingPrice: "enterprise-oriented pricing with custom plan paths",
    bestFor: "larger privacy teams that need vendor risk, consent, and privacy program management",
    limitation:
      "Osano is broad and enterprise-heavy. Fast-moving teams may prefer a leaner automation layer that directly updates policies and client sites.",
    comparisonRows: [
      {
        capability: "Implementation speed",
        Zenvyra: "Designed for fast setup with embedded live policies, automated scans, and clear agency workflows.",
        competitor: "More enterprise program depth can mean heavier setup and procurement cycles.",
      },
      {
        capability: "Live policy delivery",
        Zenvyra: "JavaScript embeds keep customer domains current as tracker and compliance data changes.",
        competitor: "Policy and privacy program operations are powerful but less focused on live document delivery via embeds.",
      },
      {
        capability: "Agency use case",
        Zenvyra: "Built around managing many client sites from one white-label agency hub.",
        competitor: "Optimized for internal enterprise privacy operations.",
      },
      {
        capability: "Cost profile",
        Zenvyra: "Transparent plans from $19 to $119 for common starter, pro, and agency needs.",
        competitor: "Custom enterprise pricing can be a poor fit for smaller high-growth teams.",
      },
    ],
  },
} satisfies Record<string, CompetitorComparisonConfig>;

export type CompetitorSlug = keyof typeof competitorComparisons;

export function getCompetitorComparison(slug: string): CompetitorComparisonConfig | undefined {
  return competitorComparisons[slug as CompetitorSlug];
}

export function getCompetitorSlugs(): CompetitorSlug[] {
  return Object.keys(competitorComparisons) as CompetitorSlug[];
}
