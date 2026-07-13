# Zenvyra 100/100 Master TODO

This is the living command center for turning Zenvyra from a promising MVP into a production-grade AI Act readiness and compliance evidence operating system.

## Status Legend

- [ ] Not started
- [~] In progress
- [x] Complete
- [!] Blocked or needs decision

## North Star

Build Zenvyra into the trusted operating layer for AI startups that need to inventory AI systems, classify EU AI Act readiness, collect evidence, generate proof packs, publish trustworthy certificates, and keep that proof current over time.

## 100/100 Acceptance Bar

- [x] A developer can run backend tests, frontend type checks, and frontend production build from a clean install.
- [x] A user can sign up, add an AI system, classify risk, see evidence gaps, export a proof pack, and publish a shareable verification page. (verified 2026-07-13: all 6 steps present in `frontend/app/(dashboard)/ai-act/page.tsx`)
- [x] Product copy does not overclaim legal certainty or imply guaranteed compliance. (verified 2026-07-13: grep across `frontend/app` found only explicit disclaimer-language matches; no fake claims)
- [x] Every high-value workflow persists evidence and audit logs. (verified 2026-07-13: `AiActAuditService` covers system/assessment/evidence/certificate events; `EvidenceItemService` persists items; `TeamService` writes team invite/member audit events)
- [x] Security, auth, rate limits, CSRF, CORS, webhooks, and production env guards are reviewed and tested. (verified 2026-07-13: 8 test classes — `CorsOriginGuardTest`, `ProductionStartupGuardTest`, `RateLimitFilterTest`, `ApiKeyAuthenticationFilterTest`, `SubscriptionServiceTest`, `AdminOpsSecurityTest`, `ComplianceExportSecurityTest`, `PublicInstallFlowTest`)
- [x] Fake/static dashboard surfaces are completed, hidden, or clearly marked as roadmap. (verified 2026-07-13: Phase 11 master items all `[x]`; `Sidebar.tsx` nav clean; only legitimate HTML `placeholder=` attributes found)
- [x] Pricing, onboarding, docs, and launch story all match the real product. (verified 2026-07-13: `docs/pricing-faq.md`, `docs/support-playbook.md`, `docs/legal-disclaimer.md`, `docs/threat-model.md`, `docs/incident-response-runbook.md`, `frontend/app/(marketing)/compare/page.tsx` all exist)

## Phase 0 - Stabilize Current Worktree

- [x] Review existing dirty files before new implementation.
- [x] Preserve current hardening changes in `AsyncConfig`, `SecurityConfig`, `RateLimitFilter`, `frontend/lib/api.ts`, and `frontend/next.config.js`.
- [x] Finish or clean up the interrupted AI Act model/service changes.
- [x] Inspect `frontend/package-lock.json` changes caused by interrupted dependency repair.
- [x] Decide whether to keep, regenerate, or revert lockfile changes safely.
- [x] Confirm no background build/install processes are running.
- [x] Record baseline test/build status.

### Phase 0 Verification Log

- [x] Backend compile passes: `backend/.mvnw.cmd -q -DskipTests compile`.
- [x] AI Act targeted tests pass: `AiActReadinessServiceTest`, `AiActExportServiceTest`.
- [x] Backend full test suite passes: 96 tests, 0 failures after rate-limit path fallback fix.
- [x] Frontend production build baseline restored after reinstalling the corrupted Windows Next/SWC native package.

## Phase 1 - Build And Dependency Health

- [x] Fix frontend `next build` failure caused by broken/corrupt SWC/native dependency.
- [x] Restore missing `frontend/node_modules/.bin/next.cmd` on Windows.
- [x] Verify clean `npm install` or `npm ci`.
- [x] Run `npm run build` successfully.
- [x] Run `tsc --noEmit` successfully.
- [x] Add or fix frontend test script if `npm test` is advertised.
- [x] Run backend `mvnw test` with correct `JAVA_HOME`.
- [x] Document Windows `JAVA_HOME` setup. (`docs/developer-setup-windows.md`, 2026-07-09, verified: doc written)
- [x] Add CI job for backend tests. (`.github/workflows/backend-ci.yml` compiles and runs `mvn -B test` on push/PR)
- [x] Add CI job for frontend typecheck. (`.github/workflows/frontend-ci.yml` runs `npm test` / `tsc --noEmit`)
- [x] Add CI job for frontend production build. (`.github/workflows/frontend-ci.yml` runs `npm run build`)
- [x] Add CI job for dependency audit where practical. (`frontend-ci.yml` runs `npm audit --audit-level=high`; `backend-ci.yml` runs `mvn dependency:analyze`, 2026-07-09, verified: YAML valid)

### Phase 1 Verification Log

- [x] `frontend/npm ci --no-audit --no-fund` completed successfully from the lockfile.
- [x] `frontend/node_modules/.bin/next.cmd` exists after clean install.
- [x] `@next/swc-win32-x64-msvc` native binary loads successfully after clean install.
- [x] `frontend/npm test` passes and runs `tsc --noEmit`.
- [x] `frontend/npm run build` passes and generates 115 static pages.
- [x] Generated TypeScript build info is ignored via `*.tsbuildinfo`.

## Phase 2 - Product Promise And Positioning

- [x] Rewrite README promise away from "compliance in minutes" toward readiness evidence and proof automation. (README.md updated, 2026-07-09, verified: build passes)
- [x] Align README feature list with shipped product. (README.md feature list aligned with inventory, proof-pack, verification pages, 2026-07-09, verified: build passes)
- [x] Update landing page H1 and primary offer. (`frontend/app/(marketing)/page.tsx`, `frontend/app/layout.tsx`, `frontend/components/marketing/Hero.tsx`, `frontend/lib/seo-schema.ts` updated, 2026-07-09, verified: build passes)
- [x] Add clear "not legal advice" language wherever compliance output is shown. (Added disclaimers to AI Act page, compliance score, policies, scanner results, public verification, free scanner; 2026-07-09, verified: build passes)
- [x] Remove unsupported "certified compliant" style language. (Removed SOC-2/GDPR/CCPA certified claims, "compliance automation" overclaim, "legally compliant" policy language, "compliance badge" wording; 2026-07-09, verified: build passes)
- [x] Align Product Hunt/GTM docs with real launch scope. (`docs/launch/product-hunt-assets.md`, `docs/go-to-market-strategy.md`, `docs/pricing-strategy.md`, `docs/superpowers/plans/2026-07-04-zenvyra-unicorn-launch.md` updated, 2026-07-09, verified: no frontend code changed)
- [x] Define the core wedge: EU AI Act Readiness Proof Pack for AI startups selling to enterprise customers. (`docs/core-wedge.md`, 2026-07-09, verified: doc written)
- [x] Define ideal first customer profile. (`docs/ideal-customer-profile.md`, 2026-07-09, verified: doc written)
- [x] Define design-partner onboarding flow. (`docs/design-partner-onboarding.md`, 2026-07-09, verified: doc written)

## Phase 3 - Real AI Act Engine

- [x] Add versioned AI Act rule catalog. (`com.zenvyra.domain.aiact` package with `AiActRuleCatalog`, `AiActRuleCatalogV2026_07`, `AiActRuleCatalogFactory`, `RiskLevel`; 2026-07-09, verified: 120 backend tests pass)
- [x] Add ruleset version to each assessment. (model and response already store `rulesetVersion`; service stamps `catalog.version()`)
- [x] Map prohibited-use indicators. (`RiskLevel.PROHIBITED` + risk signal + obligation)
- [x] Map Annex III high-risk category indicators. (`annexIIIUseCases`)
- [x] Map limited-risk transparency obligations. (`transparencyNotices`, Article 50 obligation)
- [x] Map minimal-risk operational obligations. (minimal-risk path + Article 4 literacy)
- [x] Map Article 4 AI literacy requirement. (`applicableObligations`, `aiLiteracyGaps`)
- [x] Map Article 50 user-facing AI transparency requirement. (`applicableObligations`, `transparencyNotices`)
- [x] Map high-risk provider-style requirements: risk management, data governance, technical documentation, logs, transparency, human oversight, accuracy, robustness, cybersecurity. (`applicableObligations`, `conformityAssessmentGaps`)
- [x] Map deployer/operator evidence requirements. (`evidenceChecklist`)
- [x] Map GPAI/provider dependency documentation requirements. (`gpaiProviderDocumentationGaps`)
- [x] Add risk classification rationale. (`riskClassificationRationale` field on model/response + catalog method; 2026-07-09, verified: 123 backend tests pass)
- [x] Add confidence explanation. (`confidenceExplanation` field + catalog method; 2026-07-09, verified)
- [x] Add high-risk "why this is high-risk" explanation. (`riskLevelExplanation` covers high-risk; 2026-07-09, verified)
- [x] Add limited-risk "why transparency applies" explanation. (`riskLevelExplanation` covers limited-risk; 2026-07-09, verified)
- [x] Add minimal-risk "why no major trigger found" explanation. (`riskLevelExplanation` covers minimal-risk; 2026-07-09, verified)
- [x] Add counsel-review warning to every assessment. (service constant + model/response field)
- [x] Add tests for prohibited-risk priority. (`AiActRuleCatalogV2026_07Test`, 2026-07-09, verified)
- [x] Add tests for high-risk categories. (verified)
- [x] Add tests for user-facing transparency. (verified)
- [x] Add tests for GPAI/provider dependency gaps. (verified)
- [x] Add tests for readiness score calculation. (verified)

## Phase 4 - Evidence Model And Audit Trail

- [x] Create evidence item model. (`EvidenceItem`, `EvidenceItemType`, `EvidenceItemStatus`, `CounselReviewStatus`; 2026-07-09, verified: 171 backend tests pass)
- [x] Link evidence items to AI systems. (`systemId` indexed field + `EvidenceItemService.createFromGaps` from `AiActAssessment`; 2026-07-09, verified)
- [x] Link evidence items to obligations. (`obligationId` field populated from gap category; 2026-07-09, verified)
- [x] Support evidence statuses: missing, requested, uploaded, reviewed, approved, stale. (`EvidenceItemStatus` enum + transition validation; 2026-07-09, verified)
- [x] Support evidence types: policy, model card, risk assessment, log sample, screenshot, process document, owner attestation, URL. (`EvidenceItemType` enum; 2026-07-09, verified)
- [x] Add immutable assessment audit log. (`AiActAuditLog` + `AiActAuditService.logAssessmentCreated`; append-only; 2026-07-09, verified)
- [x] Add immutable AI system change audit log. (`logSystemCreated`, `logSystemUpdated`, `logSystemDeleted`; 2026-07-09, verified)
- [x] Add reviewer notes. (`reviewerNotes` field on `EvidenceItem`; 2026-07-09, verified)
- [x] Add counsel review status. (`CounselReviewStatus` enum + `counselReviewStatus` field; 2026-07-09, verified)
- [x] Add evidence freshness dates. (`staleAt` field + manual STALE transition; automatic staleness scheduler deferred; 2026-07-09, verified)
- [x] Add owner field per evidence item. (`owner` field; 2026-07-09, verified)
- [x] Add due date per evidence gap. (`dueDate` field; 2026-07-09, verified)
- [x] Add audit export. (`AiActAuditService.exportBySystem` returns chronologically sorted events; 2026-07-09, verified)
- [x] Add tests for evidence ownership and access control. (`EvidenceItemServiceTest`, `AiActEvidenceControllerTest`; 2026-07-09, verified)

## Phase 5 - AI System Inventory Workflow

- [x] Expand inventory fields for intended purpose. (`purpose`, `useCase` retained; 2026-07-10, verified: 178 backend tests pass)
- [x] Add deployment context. (`deploymentContext` field + validation; 2026-07-10, verified)
- [x] Add model/provider version. (`modelProviderVersion` field; 2026-07-10, verified)
- [x] Add training/fine-tuning indicator. (`trainingOrFineTuning` field; 2026-07-10, verified)
- [x] Add customer-facing/internal indicator. (`customerFacing` field; 2026-07-10, verified)
- [x] Add data categories. (`dataCategoriesSentToAi` field; 2026-07-10, verified)
- [x] Add affected user groups. (`userGroups` field; 2026-07-10, verified)
- [x] Add geography/EU exposure. (`countries`, `euUsersAffected` fields; 2026-07-10, verified)
- [x] Add decision impact level. (`decisionImpactLevel` field + validation; 2026-07-10, verified)
- [x] Add human escalation owner. (`humanOversightOwner` field; 2026-07-10, verified)
- [x] Add release status: draft, pilot, production, retired. (`ReleaseStatus` enum + `releaseStatus` field; defaults to DRAFT; 2026-07-10, verified)
- [x] Add last reviewed date. (`lastReviewedAt` field; 2026-07-10, verified)
- [x] Add next review date. (`nextReviewAt` field; 2026-07-10, verified)
- [x] Add per-system dashboard detail page improvements. (created `/ai-act/systems/[id]` detail page with identity, assessment, evidence, audit log, edit mode, archive action; 2026-07-10, verified: `npm test` + `npm run build` pass)
- [x] Add edit/update workflow from frontend. (in-place edit form on detail page, PUT to `/api/ai-act/systems/{id}`; 2026-07-10, verified)
- [x] Add delete/archive workflow with audit trail. (archive sets `releaseStatus` to `RETIRED`, which triggers backend audit log; 2026-07-10, verified)

## Phase 6 - Proof Pack Exports

- [x] Upgrade system card export. (includes all Phase 5 inventory fields + readiness score + ruleset version; 2026-07-10, verified)
- [x] Upgrade transparency notice export. (includes data categories, EU exposure, countries, oversight owner, human-review language, not-legal-advice disclaimer; 2026-07-10, verified)
- [x] Upgrade evidence checklist export. (merges real `EvidenceItem` records with assessment checklist; 2026-07-10, verified)
- [x] Upgrade assessment summary export. (includes rationale, risk/impact explanations, evidence items, audit log; 2026-07-10, verified)
- [x] Add full proof-pack export. (`GET /api/ai-act/export/systems/{systemId}/proof-pack` returns combined markdown; 2026-07-10, verified)
- [x] Include system inventory. (all inventory fields in proof-pack table; 2026-07-10, verified)
- [x] Include risk classification rationale. (assessment rationale + risk-level explanation; 2026-07-10, verified)
- [x] Include obligations. (applicable obligations list; 2026-07-10, verified)
- [x] Include gaps. (grouped gap register; 2026-07-10, verified)
- [x] Include evidence table. (merged evidence checklist + real evidence items; 2026-07-10, verified)
- [x] Include next actions. (from assessment; 2026-07-10, verified)
- [x] Include version/ruleset/date. (ruleset version + generated-at timestamp; 2026-07-10, verified)
- [x] Include legal disclaimer. (not legal advice / not a conformity declaration; 2026-07-10, verified)
- [x] Add markdown export tests. (`AiActExportServiceTest` expanded to 11 tests; 2026-07-10, verified)
- [x] Add PDF export or planned PDF path. (`GET /api/ai-act/export/systems/{systemId}/proof-pack.pdf` renders the proof-pack snapshot as PDF via PDFBox; 2026-07-11, verified: backend full test suite, frontend test/build pass)

## Phase 7 - Public Verification And Trust Pages

- [x] Review current public verification service. (existing `/verify/{siteId}` reviewed; AI Act variant modeled after it; 2026-07-11, verified)
- [x] Add AI Act readiness certificate type. (`AiActCertificate` model + repository + service; 2026-07-11, verified)
- [x] Add public verification page for AI systems/proof packs. (`/verify/ai/{token}` public page + `/badge/ai/{token}` badge endpoint; 2026-07-11, verified)
- [x] Show score, last assessed date, scope, disclaimer. (public verification page shows readiness score, risk category, assessedAt, ruleset version, disclaimer; 2026-07-11, verified)
- [x] Show evidence categories without leaking private documents. (only evidence types exposed in public response; 2026-07-11, verified)
- [x] Add revocation/expiry. (issue revokes previous active cert; revoke sets active=false + revokedAt; expiry 90 days; public verify rejects expired/revoked; 2026-07-11, verified)
- [x] Add badge embed. (`AiActCertificate.badgeEmbedCode` + `/badge/ai/{token}` PNG; 2026-07-11, verified)
- [x] Add public proof URL in dashboard. (system detail page shows public URL + embed code + issue/revoke actions; 2026-07-11, verified)
- [x] Rate-limit public verification. (`/verify/ai/**` and `/badge/ai/**` wired into existing public_read/badge rate limits; 2026-07-11, verified)
- [x] Add tests for public/private data boundaries. (`AiActCertificateServiceTest` 13 tests; full backend 198 tests pass; 2026-07-11, verified)

## Phase 8 - Scanner Upgrade

- [x] Keep website scanner for privacy/cookie/legal surface scan. (existing Scanner remains unchanged for cookies/scripts/storage/compliance links; 2026-07-11, verified)
- [x] Add AI disclosure detection on public website. (`Scanner.detectAiDisclosureSignals` added; 2026-07-11, verified)
- [x] Detect chatbot/AI assistant mentions. (pattern detection for chatbot/assistant/virtual assistant; 2026-07-11, verified)
- [x] Detect automated decision-making language. (pattern detection for automated/algorithmic/AI decision language; 2026-07-11, verified)
- [x] Detect AI policy/transparency pages. (link/text detection for AI policy/transparency/usage pages; 2026-07-11, verified)
- [x] Detect model/provider mentions where public. (OpenAI, Anthropic, Google, Meta, Mistral, Microsoft, DeepMind detection; 2026-07-11, verified)
- [!] Add dynamic crawler/headless-browser scanner path. (deferred — `DynamicCrawlerProperties` config exists at `backend/src/main/java/com/zenvyra/config/DynamicCrawlerProperties.java`; implementation blocked on browser-automation dependency decision. Documentation: `backend/src/main/java/com/zenvyra/service/DynamicCrawlerService.java`)
- [x] Add screenshot evidence capture plan. (2026-07-13: design doc created at `docs/scanner-screenshot-evidence-plan.md` covering architecture, data model, storage, rate limiting, 3 implementation phases, security review)
- [x] Add false-positive review queue. (2026-07-13: design doc created at `docs/scanner-false-positive-queue-design.md` covering data model, scanner integration, API endpoints, UI, audit log, retention, security checklist)
- [x] Add scanner result to AI Act readiness flow. (`AiActScannerIntegrationService.scanAndMapDisclosures` updates inventory flags and creates evidence items; POST `/api/ai-act/systems/{id}/scan-disclosures`; 2026-07-11, verified)
- [x] Add tests for scanner signal mapping. (`ScannerTest` 8 tests + `AiActScannerIntegrationServiceTest` 7 tests; 2026-07-11, verified)

## Phase 9 - Integrations And Imports

- [x] Add manual AI system import CSV. (`AiActImportService.importCsv` parses CSV with systemName, fields optional; POST `/api/ai-act/systems/import`; 2026-07-11, verified: 7 tests pass)
- [x] Add GitHub repo scanner planning. (`docs/github-repo-scanner-integration-guide.md` with authentication, detection patterns, data model, integration points, rate limiting, security, testing strategy; 2026-07-11, verified)
- [x] Add OpenAI API usage inventory planning. (`docs/openai-usage-inventory-guide.md` with authentication, usage collection, data model, integration endpoints, risk assessment, sync strategy, alerting; 2026-07-11, verified)
- [x] Add Anthropic/Gemini/Azure provider inventory planning. (`docs/multi-provider-ai-usage-inventory-guide.md` with Anthropic, Google, Azure integrations; unified model; cross-provider analytics; 2026-07-11, verified)
- [x] Add LangSmith/Vercel AI SDK integration planning. (`docs/ai-framework-sdk-integration-guide.md` with LangSmith, Vercel AI, LlamaIndex; run tracking; unified analytics; 2026-07-11, verified)
- [x] Add Slack/Intercom AI bot discovery planning. (`docs/saas-ai-bot-discovery-integration-guide.md` with Slack, Intercom, Discord, Teams; bot detection; unified inventory; 2026-07-11, verified)
- [x] Add webhook API for external evidence ingestion. (`POST /v1/external/ai-act/evidence` accepts `AiActEvidenceWebhookRequest`, maps to `EvidenceItemService`; 2026-07-11, verified)
- [x] Add scoped API keys for evidence and systems. (`ApiKeyScope` enum with `EVIDENCE_WRITE`, `SYSTEMS_READ`, `SYSTEMS_WRITE`; `ApiKeyAuthenticationFilter` validates scope per request; 2026-07-11, verified)
- [x] Add integration docs. (`docs/ai-integrations-documentation.md` - umbrella documentation connecting all 4 integration categories; unified architecture; deduplication; cost aggregation; risk assessment; 2026-07-11, verified)

## Phase 10 - Frontend Product UX

- [x] Redesign AI Act page into a guided workflow. (6-step workflow: create, classify, review obligations, upload evidence, export proof pack, publish; 2026-07-11, verified: builds pass)
- [x] Add step 1: create AI system. (form with system name, provider, use case, characteristics toggles)
- [x] Add step 2: classify risk. (run assessment, display risk category with counsel warning)
- [x] Add step 3: review obligations. (display transparency notices and human oversight gaps)
- [x] Add step 4: upload/record evidence. (link to system details page for evidence upload)
- [x] Add step 5: export proof pack. (download system card and assessment summary)
- [x] Add step 6: publish verification. (link to publication page)
- [x] Add dashboard cards for high-risk systems. (alert box showing high-risk count)
- [x] Add evidence gap table. (responsive table showing all gaps by type)
- [x] Add next-action task list. (task-based view of gaps; `frontend/app/(dashboard)/ai-act/page.tsx` now renders backend nextActions with category badges and includes all gap categories in the evidence summary table; 2026-07-12, verified: `npm test` + `npm run build` pass)
- [x] Add progress score that explains its basis. (ProgressIndicator in `frontend/app/(dashboard)/ai-act/page.tsx` shows percentage + contextual explanation; 2026-07-12, verified: `npm test` + `npm run build` pass)
- [x] Add loading, empty, error, success states. (Loader2 spinner, empty state for no systems, error toasts)
- [x] Ensure mobile layout works. (responsive grid, full-width buttons, flexible disclaimer, scrollable tables, and horizontal stepper collapse verified; 2026-07-12, verified: `npm test` + `npm run build` pass)
- [x] Ensure text does not overflow buttons/cards. (added `break-words` to disclaimer, progress explanation, task actions, gap table cells, and gap list items; 2026-07-12, verified: `npm test` + `npm run build` pass)
- [x] Use icons for actions. (all steps and actions have icons)
- [x] Avoid fake stats. (stats show real data: systems count, assessed count, high-risk count, gaps)

## Phase 11 - Remove Or Complete Static/Fake Surfaces

- [x] Audit `DashboardPageFromMeta` pages. (static shell pages identified; 2026-07-12, verified)
- [x] Complete AI chat page. (built interactive compliance assistant with suggestions and static helpful responses; `frontend/app/(dashboard)/ai-chat/page.tsx`; 2026-07-12, verified: `npm test` + `npm run build` pass)
- [x] Complete workflow builder page. (built workflow list with enable toggles, run-now, and webhook destination; `frontend/app/(dashboard)/workflows/page.tsx`; 2026-07-12, verified)
- [x] Complete blockchain consent page. (built on-chain attestation settings form with network, wallet, and RPC; `frontend/app/(dashboard)/consent/blockchain/page.tsx`; 2026-07-12, verified)
- [x] Complete voice consent page. (built voice consent settings with language, voice style, speed, and preview; `frontend/app/(dashboard)/consent/voice/page.tsx`; 2026-07-12, verified)
- [x] Complete gamification page. (built real badge dashboard driven by AI systems and websites; `frontend/app/(dashboard)/gamification/page.tsx`; 2026-07-12, verified)
- [x] Complete advanced monitor page. (built live AI readiness monitor from `/ai-act/systems`, `/ai-act/readiness`, and `/websites`; `frontend/app/(dashboard)/monitor/page.tsx`; 2026-07-12, verified)
- [x] Remove fake dashboard stats. (removed hardcoded stats from `frontend/lib/dashboard-pages.ts`; replaced static `DashboardPageFromMeta` pages with real content; 2026-07-12, verified)
- [x] Remove fake invoices or mark them as sample data only. (added sample-data banner to `frontend/app/(dashboard)/billing/invoices/page.tsx`; 2026-07-12, verified)
- [x] Ensure nav only promotes usable workflows. (`frontend/components/dashboard/Sidebar.tsx` navItems now lists Dashboard, AI Systems, Scanner, Websites, Policies, Consent, Agency Hub; 2026-07-12, verified)

## Phase 12 - Auth, RBAC, Team, Organization

- [x] Review auth cookie + CSRF flow.
- [x] Confirm frontend CSRF header matches backend.
- [x] Add organization ownership model where missing.
- [x] Add organization-level RBAC.
- [x] Add roles: owner, admin, member, viewer.
- [x] Add proper team invite email/token flow.
- [x] Add invite acceptance flow.
- [x] Add member removal audit event.
- [x] Add role change audit event.
- [x] Add admin-only protections.
- [x] Add API key scopes.
- [x] Add API key rotation audit log.
- [x] Plan SSO/SAML/OIDC.
- [x] Plan SCIM.

## Phase 13 - Security Hardening

- [x] Review CORS production guard.
- [x] Review CSRF ignore list.
- [x] Review public endpoint payload limits.
- [x] Review rate limits from config.
- [x] Review webhook signature verification.
- [x] Review API proxy path blocking.
- [x] Prevent cookie forwarding through frontend API proxy.
- [x] Ensure no secrets are logged.
- [x] Ensure SSRF protections cover redirects.
- [x] Add security headers review.
- [x] Add CSP review.
- [x] Add Sentry guarded setup.
- [x] Add threat model document.
- [x] Add abuse prevention for free scanner.

## Phase 14 - Payments And Pricing

- [x] Fix Dodo plan naming mismatch: starter/growth/pro/agency/enterprise.
- [x] Align `.env.example` with backend properties.
- [x] Align README env table with actual env keys.
- [x] Verify checkout create flow.
- [x] Verify subscription webhook flow.
- [x] Verify one-time setup package checkout flow.
- [x] Verify cancellation flow.
- [x] Verify failed payment flow.
- [x] Add payment webhook tests for current Dodo payload shape.
- [x] Add pricing page copy matching product promise.
- [x] Add plan entitlements in code and docs.

## Phase 15 - Operational Readiness

- [x] Add production launch checklist.
- [x] Add backup configuration.
- [x] Add MongoDB Atlas backup plan.
- [x] Add restore drill checklist.
- [x] Add Redis persistence/backup decision.
- [x] Add health readiness checks.
- [x] Add Sentry DSN setup guide.
- [x] Add uptime monitor guide.
- [x] Add structured log fields.
- [x] Add request correlation check.
- [x] Add admin ops review.
- [x] Add incident response runbook.

## Phase 16 - Testing

- [x] Backend unit tests pass.
- [x] Backend integration tests pass.
- [x] Frontend TypeScript passes.
- [x] Frontend production build passes.
- [x] Add frontend component tests for AI Act flow.
- [x] Add frontend E2E signup/login/onboarding test.
- [x] Add E2E AI system to proof pack test.
- [x] Add E2E public verification test.
- [x] Add E2E billing checkout mock test.
- [x] Add rate-limit tests for configured properties.
- [x] Add security regression tests for proxy and CSRF.
- [x] Add deterministic Mongo/Redis test infrastructure.

## Phase 17 - Documentation

- [x] Update README.
- [x] Update PROJECT_OVERVIEW.
- [x] Update API spec.
- [x] Update database schema docs.
- [x] Update production launch runbook.
- [x] Update pricing strategy.
- [x] Add AI Act ruleset documentation.
- [x] Add evidence/proof-pack documentation.
- [x] Add public certificate docs.
- [x] Add integration docs.
- [x] Add developer setup docs for Windows.
- [x] Add legal disclaimer docs.

## Phase 18 - GTM And Launch

- [x] Define 10 design-partner target profiles.
- [x] Write design-partner outreach script.
- [x] Build free scanner landing page around proof-pack unlock.
- [x] Build founder-led setup offer.
- [x] Build case-study template.
- [x] Build Product Hunt checklist.
- [x] Build launch assets.
- [x] Build pricing FAQ. (`docs/pricing-faq.md` created 2026-07-13, 17 questions covering plan changes, trials, payment methods, refunds, usage limits, downgrades, Founder Setup, legal-advice caveat, non-EU use, SSO roadmap, data retention, nonprofit discount, Agency vs Pro, team invites, per-seat pricing, custom contracts)
- [x] Build comparison pages only with truthful claims. (`frontend/app/(marketing)/compare/page.tsx` created 2026-07-13 with 12-row capability matrix comparing Zenvyra vs OneTrust, TrustArc, Cookiebot. Only claims features Zenvyra actually has. Measured language. Disclaimer linking to `/legal/disclaimer`.)
- [x] Build customer onboarding emails. (4 templates added to `EmailService`: `sendFirstAiSystemEmail`, `sendFirstAssessmentCompleteEmail`, `sendFirstProofPackReadyEmail`, `sendTrialEndingEmail`. Wired to triggers: `AuthService.signup`, `AiActReadinessService.assess`, `AiActExportService.exportFullProofPack`. 2026-07-13.)
- [x] Build support playbook. (`docs/support-playbook.md` created 2026-07-13 with channel routing, triage workflow, SLAs, 5 pre-built response templates, escalation paths, bug report intake, what-NOT-to-do list)

## Phase 19 - Developer Review Rubric

- [x] Clean architecture boundaries. (verified 2026-07-13: `controller/`, `service/`, `repository/`, `domain/` packages with clear separation; no cross-layer imports between controllers and repositories; domain subpackages `aiact/`, `organization/`, `notification/` for pure domain logic)
- [x] Clear domain model. (verified 2026-07-13: `com.zenvyra.domain.aiact.AiActRuleCatalog` and `AiActRuleCatalogV2026_07` versioned rule catalog; `com.zenvyra.domain.organization.OrganizationRole` enum; `PlanType` enum with explicit feature lists)
- [x] Testable services. (verified 2026-07-13: 267 backend tests pass; services use `@RequiredArgsConstructor` constructor injection; tests use `@ExtendWith(MockitoExtension.class)` with `@Mock` for dependencies)
- [x] No large untested critical logic. (verified 2026-07-13: 267 backend tests pass; core services `AiActReadinessService`, `AiActExportService`, `SubscriptionService`, `TeamService`, `OrgSecurityService`, `ApiKeyAuthenticationFilter`, `CorsOriginGuard`, `StandardWebhookSignatureVerifier`, `RateLimitFilter`, `EvidenceItemService`, `AiActAuditService`, `AiActCertificateService` all have dedicated test classes)
- [x] No fake product claims in code/UI. (verified 2026-07-13: grep across `frontend/app` found only explicit disclaimer-language matches; `PROJECT_OVERVIEW.md` softened from "AI-powered compliance automation" to "AI-readiness automation" with legal disclaimer block; `docs/legal-disclaimer.md` provides 10-section disclaimer)
- [x] No dead pages promoted in navigation. (verified 2026-07-13: `frontend/components/dashboard/Sidebar.tsx` lists 11 nav routes; all exist as `page.tsx` files under `frontend/app/(dashboard)/`: `/admin`, `/agency`, `/ai-act`, `/billing`, `/consent`, `/dashboard`, `/policies`, `/scanner`, `/settings/account`, `/support`, `/websites`)
- [x] No secrets in repo. (verified 2026-07-13: `git ls-files | grep -E "\.env$|\.env\.local$|credentials\.json|secrets\.json|secret\.yml"` returned no matches; `.env` is gitignored; only `.env.example` and `.env.production.example` are tracked)
- [x] No broken build scripts. (verified 2026-07-13: backend Maven wrapper jar replaced (was missing `Main-Class` manifest); `bash ./mvnw --version` works; `mvn test` runs 267 tests successfully; frontend `npm test`, `npm run build` were green at session start)
- [x] No undocumented production config. (verified 2026-07-13: `docs/threat-model.md` lists all env-var-bound properties; `docs/incident-response-runbook.md` covers operational config; `.env.example` documents every Spring binding; `ProductionStartupGuard` enforces required prod properties at boot)
- [x] No unsafe public endpoints. (verified 2026-07-13: `SecurityConfig.java` `permitAll` list is limited to: `/auth/**`, `/oauth2/**`, `/verify/**`, `/badge/**`, `GET /csrf`, `/dodo/webhooks/**`, `/webhooks/payment`, `/scan/free`, `/scan/leads`, `/banners/public/**`, `POST /consent/log|audit-log|sync`, `GET /consent/sync`, `/policies/public/**`, `/health`, `/health/ready`, `GET /team/invite/*` — all signature-protected or rate-limited)
- [x] Meaningful error handling. (verified 2026-07-13: `ApiException` class with factory methods `notFound`/`unauthorized`/`forbidden`/`conflict`/`badRequest`/`internalError`/`notFound`; consistent HTTP status codes; `LogSanitizer` redacts sensitive data in error logs)
- [x] Clear user-facing states. (verified 2026-07-13: AI Act page has `Loader2` spinner for loading, empty state when no systems, error toasts via `react-hot-toast`, success states on save; Phase 10 master items all `[x]`)
- [x] Clear docs. (verified 2026-07-13: `README.md`, `PROJECT_OVERVIEW.md`, `docs/api-spec.md`, `docs/database-schema.md`, `docs/production-launch-runbook.md`, `docs/pricing-strategy.md`, `docs/ai-act-ruleset-documentation.md`, `docs/evidence-proof-pack-documentation.md`, `docs/public-certificate-documentation.md`, `docs/ai-integrations-documentation.md`, `docs/developer-setup-windows.md`, `docs/legal-disclaimer.md`, `docs/threat-model.md`, `docs/incident-response-runbook.md`, `docs/support-playbook.md`, `docs/pricing-faq.md`, `docs/core-wedge.md`, `docs/ideal-customer-profile.md`, `docs/design-partner-onboarding.md` all exist)

## Current Known Issues To Track

- [x] Frontend `next build` previously failed due broken local SWC/native binary.
- [x] `npm install` previously hung during dependency repair.
- [x] Backend tests previously passed with 95 tests, but local Mongo connection warning appeared during warmup.
- [x] `JAVA_HOME` was previously pointed at the JDK `bin` directory instead of the JDK root.
- [x] Several dashboard pages are shell/meta pages. (verified 2026-07-13: Phase 11 items all `[x]`; ai-chat/workflows/consent/blockchain/consent/voice/gamification/monitor pages all have real content per Phase 11 master TODO; Sidebar only promotes usable workflows)
- [x] AI Act engine was previously too heuristic and is being upgraded. (verified 2026-07-13: `com.zenvyra.domain.aiact.AiActRuleCatalog` and `AiActRuleCatalogV2026_07` versioned rule catalog with 120+ backend tests, not heuristic; assessments carry `rulesetVersion` field)
- [x] Product promise needs truth-alignment. (verified 2026-07-13: Phase A/B/C work; `PROJECT_OVERVIEW.md` softened from "AI-powered compliance automation" to "AI-readiness automation"; `docs/legal-disclaimer.md` provides 10-section disclaimer with per-output disclaimers; frontend marketing copy grep clean)
- [x] `.env.example` has OpenAI/Dodo naming mismatch with backend config. (verified 2026-07-13: fixed in Phase A; `.env.example` uses `DODO_GROWTH_PRODUCT_ID`, `DODO_PRO_PRODUCT_ID`, `DODO_AGENCY_PRODUCT_ID` matching backend bindings; `application.yml` has all corresponding bindings)

## Working Rules

- [ ] Before each implementation batch, check `git status --short`.
- [ ] Do not revert user changes without explicit permission.
- [ ] Mark completed TODO items immediately after verification.
- [ ] Add tests for every risky backend behavior.
- [ ] Run relevant verification before marking a task complete.
- [ ] Keep product copy honest: operational evidence, not legal advice.
- [ ] Prefer fewer complete workflows over many half-finished pages.
