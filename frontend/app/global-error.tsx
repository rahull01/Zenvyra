"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
    fetch("/api/client-errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route: typeof window !== "undefined" ? window.location.pathname : "unknown",
        digest: error.digest,
        message: error.message,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-bg-primary px-6 text-text-primary">
          <section className="w-full max-w-md text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Application error</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              The page could not be loaded. The incident was recorded without sensitive page data.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-7 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent/90"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
