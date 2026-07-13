# Scanner Screenshot Evidence Capture Plan

This document describes the planned screenshot-capture capability for
Zenvyra's scanner. It is a design document, not a shipped feature —
implementing it requires the headless-browser work tracked in the master
TODO (Phase 8: dynamic crawler).

## Goal

Add visual evidence to scan results so a user (or auditor) can see what
the scanner saw at scan time, not just the parsed HTML and the inferred
signals. Screenshots are stored as `EvidenceItem` entries with type
`SCREENSHOT` and linked to the originating `Website` and `ScanResult`.

## Why it matters

- **Drift forensics.** When a scan disagrees with what the customer
  thinks their site looks like, a screenshot shows what was actually
  fetched. This eliminates the "but my site shows X" loop.
- **Audit pack enrichment.** Customers can drop the screenshot into a
  proof pack alongside the policy, cookies, and AI-disclosure signals.
- **False-positive review.** Reviewers can confirm a chatbot detection
  was real by looking at the rendered page.

## Architecture

```
┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ ScanController     │ -> │ SafeWebFetchService│ -> │ Renderer client    │
│ (POST /scan/full)  │    │ (static + dynamic) │    │ (HTTP JSON)        │
└────────────────────┘    └────────────────────┘    └─────────┬──────────┘
                                                            │
                                                            v
                        ┌────────────────────┐    ┌────────────────────┐
                        │ EvidenceItem       │ <- │ ScreenshotStore    │
                        │ (type=SCREENSHOT)  │    │ (S3 / local disk)  │
                        └────────────────────┘    └────────────────────┘
```

The renderer client is the same one used by the dynamic crawler (see
`DynamicCrawlerService` and `DynamicCrawlerProperties`). The crawler
already POSTs `{ "url": "..." }` to a renderer endpoint and accepts a
base64-encoded or raw HTML response. Screenshot capture reuses the same
authenticated channel and asks for a second response shape:

```json
{ "screenshotBase64": "...", "viewport": { "width": 1280, "height": 800 } }
```

## Data model

Add a new `EvidenceItemType.SCREENSHOT`. The `EvidenceItem` already
supports `URL` evidence (we attach the source page URL). For screenshots
we also store:

- `screenshotKey` — opaque storage key (S3 object key or local path).
- `viewportWidth`, `viewportHeight` — render dimensions.
- `capturedAt` — timestamp from the renderer.
- `renderDurationMs` — time the renderer took.

These can live as additional fields on `EvidenceItem` (extending the
model) or as a separate `ScreenshotArtifact` collection linked by
`evidenceId`. The separate collection is preferred to avoid growing the
`EvidenceItem` payload.

## Storage

- **Local disk (dev / small installs):** `~/.zenvyra/screenshots/{scanId}/{timestamp}.png`
- **S3 (production):** `s3://{bucket}/screenshots/{orgId}/{scanId}/{timestamp}.png`
  using the existing S3 client (`backend/src/main/java/com/zenvyra/util/S3Client.java`).

Screenshots are sensitive — they can contain customer data, PII in chat
widgets, unpublished product copy, etc. They must:

- Be stored under the customer's orgId prefix.
- Never be exposed via the public verification endpoint.
- Be served only to authenticated org members.
- Be redacted of PII (full-page screenshots of admin dashboards) when
  attached to a proof pack, unless the customer opts in.

## Rate limiting

Each full scan may capture up to N screenshots (default: 3 — homepage,
a sample product page, the cookie banner page). The existing
`RateLimitProperties.fullScanFree` / `fullScanStarter` / etc. quotas
apply unchanged. The renderer is called as part of the scan job, so
the per-scan rate limit caps the total render cost.

## Implementation phases

The screenshot feature is staged into three increments so each can ship
independently.

### Phase S1 — Capture only

- Extend the renderer contract to optionally return a screenshot.
- Store as `ScreenshotArtifact` linked to `ScanResult` by `scanId`.
- Expose via authenticated endpoint `GET /websites/{id}/scans/{scanId}/screenshots`.
- No proof-pack integration yet.

### Phase S2 — Proof-pack integration

- When generating a proof pack, include screenshots as a separate
  section (redacted if needed).
- PDF proof-pack export needs to embed images — the existing PDFBox
  renderer already supports image embedding.
- Add a per-org setting `include_screenshots_in_proof_pack` (default off).

### Phase S3 — False-positive review UI

- See `docs/scanner-false-positive-queue-design.md` for the review
  queue that consumes these screenshots.

## Open questions

1. **Headless-browser dependency choice.** Playwright (heavy, Chromium
   + Firefox + WebKit), Puppeteer (Node-only, Chromium), or a managed
   service like Browserless or ScrapingBee. The implementation choice
   affects the renderer endpoint contract.
2. **Full-page vs viewport-only.** Full-page screenshots are larger
   but more useful. Default: viewport at first fold, with an option for
   the reviewer to request a full-page capture.
3. **Retina / device-pixel-ratio.** Default DPR 1 to keep file size
   predictable; offer DPR 2 in the review UI for visual fidelity.
4. **Storage retention.** Default 90 days (matches the existing
   `staleAt` window for evidence). After 90 days, the screenshot is
   archived to cold storage or deleted per org policy.
5. **PII redaction.** For proof packs, screenshots of admin
   dashboards need to be cropped or pixelated. This requires a server-side
   image processing step (e.g. `BufferedImage` filter chain). Defer to
   Phase S3.

## Security review checklist

- [ ] Renderer service is reachable only from the backend VPC.
- [ ] Renderer API key is rotated quarterly.
- [ ] Screenshots never leave the customer's org boundary unless
      explicitly opted into a proof pack share.
- [ ] Public verification endpoints never expose screenshot URLs.
- [ ] CSP on the public proof-pack viewer forbids loading external
      screenshots (only data: or same-origin).
- [ ] Storage bucket policy denies public read; signed URLs expire in
      ≤15 minutes.

## Related work

- `docs/scanner-false-positive-queue-design.md` — the review queue that
  consumes screenshots.
- `docs/threat-model.md` T4 (scanner abuse) and T11 (free scanner as
  abuse vector) — screenshot capture does not change the threat model
  but increases the cost of a scan; see T11 mitigations.
- `backend/src/main/java/com/zenvyra/config/DynamicCrawlerProperties.java`
  — the existing renderer contract.
