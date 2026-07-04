type EventProperties = Record<string, string | number | boolean | undefined>;

const isBrowser = typeof window !== "undefined";

export function track(event: string, properties?: EventProperties) {
  if (!isBrowser) return;

  const payload = {
    event,
    properties: {
      ...properties,
      url: window.location.href,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString(),
    },
  };

  // Plausible
  if (typeof window.plausible === "function") {
    window.plausible(event, { props: payload.properties });
  }

  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload.properties);
  }

  // Segment
  if (typeof window.analytics?.track === "function") {
    window.analytics.track(event, payload.properties);
  }

  // Console fallback for development
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[analytics]", payload);
  }
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: EventProperties }) => void;
    gtag?: (...args: unknown[]) => void;
    analytics?: { track: (event: string, properties?: EventProperties) => void };
  }
}
