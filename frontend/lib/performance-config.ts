export const criticalScriptExecutionConfig = {
  consentBanner: {
    firstPaintBehavior: "render fixed-position shell only after local consent lookup completes during idle time",
    interactionPolicy: "update visible state immediately, persist localStorage consent with requestIdleCallback",
    reservedLayout: "fixed bottom overlay with min-height to prevent internal banner layout jumps",
    inpTargetMs: 200,
  },
  marketingLanding: {
    criticalPath: ["Hero", "StatsBar"],
    lazyClientChunks: ["Features", "ProductShowcase", "TrustBadges", "Testimonials", "SolutionsGrid", "CTABanner"],
    loadingPolicy: "reserve min-height placeholders for deferred below-the-fold sections",
    lcpTargetMs: 2500,
  },
  dashboardCharts: {
    criticalPath: "server/client shell, cards, tables, and controls render before chart libraries hydrate",
    lazyClientChunks: ["CompetitorRadarChart", "ComplianceChart"],
    loadingPolicy: "reserve fixed-height chart containers to avoid CLS while Recharts loads",
    clsTarget: 0.1,
  },
} as const;
