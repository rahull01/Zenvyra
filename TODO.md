# TODO - Public Verification System w/ Embeddable Badge (ComplianceAI Pro)

## Plan Steps
- [ ] Gather/confirm data sources in MongoDB for public verification: Website (name, lastScanAt, issues, complianceScore) and/or latest ScanResult.
- [ ] Backend: add public REST APIs
  - [ ] `GET /verify/{siteId}` (public) -> returns non-sensitive website verification payload.
  - [ ] `GET /api/badge/{siteId}` (public) -> returns dynamically generated PNG badge (green/yellow/red).
- [ ] Backend: implement badge generation + abuse prevention
  - [ ] Validate `siteId` (format/length) + 404/400 handling.
  - [ ] Rate limit badge endpoint (reuse Bucket4j via existing RateLimitFilter mapping or add new logic).
  - [ ] Generate image server-side (use Java image libs) with optional watermark depending on free vs paid.
- [ ] Backend: connect verification payload to real data
  - [ ] Latest scan score + issues count + last scan timestamp from MongoDB.
  - [ ] Ensure latest scan is always selected.
- [ ] Backend: add caching (optional Redis)
  - [ ] Cache badge bytes keyed by `siteId` + tier state.
  - [ ] Cache verification JSON for short TTL.
- [ ] Security: ensure public endpoints are permitAll
  - [ ] Update `SecurityConfig` to allow `/verify/**` and `/api/badge/**`.
- [ ] Frontend: add Next.js public page
  - [ ] Create `/verify/[siteId]` page (SEO-ready metadata + Open Graph + responsive UI).
  - [ ] Fetch `GET /verify/{siteId}` on server (SSR) for indexability.
  - [ ] Render badge and score gauge/progress bar.
  - [ ] Add CTA + share button.
- [ ] Frontend: premium/free badge behavior
  - [ ] Decide how to detect paid tier publicly for a siteId (server-side only; no sensitive user data exposed).
- [ ] Testing
  - [ ] Add minimal backend unit tests for siteId validation + tier mapping.
  - [ ] Run backend + frontend build checks.

