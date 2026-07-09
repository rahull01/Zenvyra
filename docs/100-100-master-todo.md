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
- [ ] A user can sign up, add an AI system, classify risk, see evidence gaps, export a proof pack, and publish a shareable verification page.
- [ ] Product copy does not overclaim legal certainty or imply guaranteed compliance.
- [ ] Every high-value workflow persists evidence and audit logs.
- [ ] Security, auth, rate limits, CSRF, CORS, webhooks, and production env guards are reviewed and tested.
- [ ] Fake/static dashboard surfaces are completed, hidden, or clearly marked as roadmap.
- [ ] Pricing, onboarding, docs, and launch story all match the real product.

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
- [ ] Define ideal first customer profile.
- [ ] Define design-partner onboarding flow.

## Phase 3 - Real AI Act Engine

- [ ] Add versioned AI Act rule catalog.
- [ ] Add ruleset version to each assessment.
- [ ] Map prohibited-use indicators.
- [ ] Map Annex III high-risk category indicators.
- [ ] Map limited-risk transparency obligations.
- [ ] Map minimal-risk operational obligations.
- [ ] Map Article 4 AI literacy requirement.
- [ ] Map Article 50 user-facing AI transparency requirement.
- [ ] Map high-risk provider-style requirements: risk management, data governance, technical documentation, logs, transparency, human oversight, accuracy, robustness, cybersecurity.
- [ ] Map deployer/operator evidence requirements.
- [ ] Map GPAI/provider dependency documentation requirements.
- [ ] Add risk classification rationale.
- [ ] Add confidence explanation.
- [ ] Add high-risk "why this is high-risk" explanation.
- [ ] Add limited-risk "why transparency applies" explanation.
- [ ] Add minimal-risk "why no major trigger found" explanation.
- [ ] Add counsel-review warning to every assessment.
- [ ] Add tests for prohibited-risk priority.
- [ ] Add tests for high-risk categories.
- [ ] Add tests for user-facing transparency.
- [ ] Add tests for GPAI/provider dependency gaps.
- [ ] Add tests for readiness score calculation.

## Phase 4 - Evidence Model And Audit Trail

- [ ] Create evidence item model.
- [ ] Link evidence items to AI systems.
- [ ] Link evidence items to obligations.
- [ ] Support evidence statuses: missing, requested, uploaded, reviewed, approved, stale.
- [ ] Support evidence types: policy, model card, risk assessment, log sample, screenshot, process document, owner attestation, URL.
- [ ] Add immutable assessment audit log.
- [ ] Add immutable AI system change audit log.
- [ ] Add reviewer notes.
- [ ] Add counsel review status.
- [ ] Add evidence freshness dates.
- [ ] Add owner field per evidence item.
- [ ] Add due date per evidence gap.
- [ ] Add audit export.
- [ ] Add tests for evidence ownership and access control.

## Phase 5 - AI System Inventory Workflow

- [ ] Expand inventory fields for intended purpose.
- [ ] Add deployment context.
- [ ] Add model/provider version.
- [ ] Add training/fine-tuning indicator.
- [ ] Add customer-facing/internal indicator.
- [ ] Add data categories.
- [ ] Add affected user groups.
- [ ] Add geography/EU exposure.
- [ ] Add decision impact level.
- [ ] Add human escalation owner.
- [ ] Add release status: draft, pilot, production, retired.
- [ ] Add last reviewed date.
- [ ] Add next review date.
- [ ] Add per-system dashboard detail page improvements.
- [ ] Add edit/update workflow from frontend.
- [ ] Add delete/archive workflow with audit trail.

## Phase 6 - Proof Pack Exports

- [ ] Upgrade system card export.
- [ ] Upgrade transparency notice export.
- [ ] Upgrade evidence checklist export.
- [ ] Upgrade assessment summary export.
- [ ] Add full proof-pack export.
- [ ] Include system inventory.
- [ ] Include risk classification rationale.
- [ ] Include obligations.
- [ ] Include gaps.
- [ ] Include evidence table.
- [ ] Include next actions.
- [ ] Include version/ruleset/date.
- [ ] Include legal disclaimer.
- [ ] Add markdown export tests.
- [ ] Add PDF export or planned PDF path.

## Phase 7 - Public Verification And Trust Pages

- [ ] Review current public verification service.
- [ ] Add AI Act readiness certificate type.
- [ ] Add public verification page for AI systems/proof packs.
- [ ] Show score, last assessed date, scope, disclaimer.
- [ ] Show evidence categories without leaking private documents.
- [ ] Add revocation/expiry.
- [ ] Add badge embed.
- [ ] Add public proof URL in dashboard.
- [ ] Rate-limit public verification.
- [ ] Add tests for public/private data boundaries.

## Phase 8 - Scanner Upgrade

- [ ] Keep website scanner for privacy/cookie/legal surface scan.
- [ ] Add AI disclosure detection on public website.
- [ ] Detect chatbot/AI assistant mentions.
- [ ] Detect automated decision-making language.
- [ ] Detect AI policy/transparency pages.
- [ ] Detect model/provider mentions where public.
- [ ] Add dynamic crawler/headless-browser scanner path.
- [ ] Add screenshot evidence capture plan.
- [ ] Add false-positive review queue.
- [ ] Add scanner result to AI Act readiness flow.
- [ ] Add tests for scanner signal mapping.

## Phase 9 - Integrations And Imports

- [ ] Add manual AI system import CSV.
- [ ] Add GitHub repo scanner planning.
- [ ] Add OpenAI API usage inventory planning.
- [ ] Add Anthropic/Gemini/Azure provider inventory planning.
- [ ] Add LangSmith/Vercel AI SDK integration planning.
- [ ] Add Slack/Intercom AI bot discovery planning.
- [ ] Add webhook API for external evidence ingestion.
- [ ] Add scoped API keys for evidence and systems.
- [ ] Add integration docs.

## Phase 10 - Frontend Product UX

- [ ] Redesign AI Act page into a guided workflow.
- [ ] Add step 1: create AI system.
- [ ] Add step 2: classify risk.
- [ ] Add step 3: review obligations.
- [ ] Add step 4: upload/record evidence.
- [ ] Add step 5: export proof pack.
- [ ] Add step 6: publish verification.
- [ ] Add dashboard cards for high-risk systems.
- [ ] Add evidence gap table.
- [ ] Add next-action task list.
- [ ] Add progress score that explains its basis.
- [ ] Add loading, empty, error, success states.
- [ ] Ensure mobile layout works.
- [ ] Ensure text does not overflow buttons/cards.
- [ ] Use icons for actions.
- [ ] Avoid fake stats.

## Phase 11 - Remove Or Complete Static/Fake Surfaces

- [ ] Audit `DashboardPageFromMeta` pages.
- [ ] Hide or complete AI chat page.
- [ ] Hide or complete workflow builder page.
- [ ] Hide or complete blockchain consent page.
- [ ] Hide or complete voice consent page.
- [ ] Hide or complete gamification page.
- [ ] Hide or complete advanced monitor page.
- [ ] Remove fake dashboard stats.
- [ ] Remove fake invoices or mark them as sample data only.
- [ ] Ensure nav only promotes usable workflows.

## Phase 12 - Auth, RBAC, Team, Organization

- [ ] Review auth cookie + CSRF flow.
- [ ] Confirm frontend CSRF header matches backend.
- [ ] Add organization ownership model where missing.
- [ ] Add organization-level RBAC.
- [ ] Add roles: owner, admin, member, viewer.
- [ ] Add proper team invite email/token flow.
- [ ] Add invite acceptance flow.
- [ ] Add member removal audit event.
- [ ] Add role change audit event.
- [ ] Add admin-only protections.
- [ ] Add API key scopes.
- [ ] Add API key rotation audit log.
- [ ] Plan SSO/SAML/OIDC.
- [ ] Plan SCIM.

## Phase 13 - Security Hardening

- [ ] Review CORS production guard.
- [ ] Review CSRF ignore list.
- [ ] Review public endpoint payload limits.
- [ ] Review rate limits from config.
- [ ] Review webhook signature verification.
- [ ] Review API proxy path blocking.
- [ ] Prevent cookie forwarding through frontend API proxy.
- [ ] Ensure no secrets are logged.
- [ ] Ensure SSRF protections cover redirects.
- [ ] Add security headers review.
- [ ] Add CSP review.
- [ ] Add Sentry guarded setup.
- [ ] Add threat model document.
- [ ] Add abuse prevention for free scanner.

## Phase 14 - Payments And Pricing

- [ ] Fix Dodo plan naming mismatch: starter/growth/pro/agency/enterprise.
- [ ] Align `.env.example` with backend properties.
- [ ] Align README env table with actual env keys.
- [ ] Verify checkout create flow.
- [ ] Verify subscription webhook flow.
- [ ] Verify one-time setup package checkout flow.
- [ ] Verify cancellation flow.
- [ ] Verify failed payment flow.
- [ ] Add payment webhook tests for current Dodo payload shape.
- [ ] Add pricing page copy matching product promise.
- [ ] Add plan entitlements in code and docs.

## Phase 15 - Operational Readiness

- [ ] Add production launch checklist.
- [ ] Add backup configuration.
- [ ] Add MongoDB Atlas backup plan.
- [ ] Add restore drill checklist.
- [ ] Add Redis persistence/backup decision.
- [ ] Add health readiness checks.
- [ ] Add Sentry DSN setup guide.
- [ ] Add uptime monitor guide.
- [ ] Add structured log fields.
- [ ] Add request correlation check.
- [ ] Add admin ops review.
- [ ] Add incident response runbook.

## Phase 16 - Testing

- [x] Backend unit tests pass.
- [x] Backend integration tests pass.
- [x] Frontend TypeScript passes.
- [x] Frontend production build passes.
- [ ] Add frontend component tests for AI Act flow.
- [ ] Add frontend E2E signup/login/onboarding test.
- [ ] Add E2E AI system to proof pack test.
- [ ] Add E2E public verification test.
- [ ] Add E2E billing checkout mock test.
- [ ] Add rate-limit tests for configured properties.
- [ ] Add security regression tests for proxy and CSRF.
- [ ] Add deterministic Mongo/Redis test infrastructure.

## Phase 17 - Documentation

- [ ] Update README.
- [ ] Update PROJECT_OVERVIEW.
- [ ] Update API spec.
- [ ] Update database schema docs.
- [ ] Update production launch runbook.
- [ ] Update pricing strategy.
- [ ] Add AI Act ruleset documentation.
- [ ] Add evidence/proof-pack documentation.
- [ ] Add public certificate docs.
- [ ] Add integration docs.
- [ ] Add developer setup docs for Windows.
- [ ] Add legal disclaimer docs.

## Phase 18 - GTM And Launch

- [ ] Define 10 design-partner target profiles.
- [ ] Write design-partner outreach script.
- [ ] Build free scanner landing page around proof-pack unlock.
- [ ] Build founder-led setup offer.
- [ ] Build case-study template.
- [ ] Build Product Hunt checklist.
- [ ] Build launch assets.
- [ ] Build pricing FAQ.
- [ ] Build comparison pages only with truthful claims.
- [ ] Build customer onboarding emails.
- [ ] Build support playbook.

## Phase 19 - Developer Review Rubric

- [ ] Clean architecture boundaries.
- [ ] Clear domain model.
- [ ] Testable services.
- [ ] No large untested critical logic.
- [ ] No fake product claims in code/UI.
- [ ] No dead pages promoted in navigation.
- [ ] No secrets in repo.
- [ ] No broken build scripts.
- [ ] No undocumented production config.
- [ ] No unsafe public endpoints.
- [ ] Meaningful error handling.
- [ ] Clear user-facing states.
- [ ] Clear docs.

## Current Known Issues To Track

- [x] Frontend `next build` previously failed due broken local SWC/native binary.
- [x] `npm install` previously hung during dependency repair.
- [x] Backend tests previously passed with 95 tests, but local Mongo connection warning appeared during warmup.
- [x] `JAVA_HOME` was previously pointed at the JDK `bin` directory instead of the JDK root.
- [ ] Several dashboard pages are shell/meta pages.
- [ ] AI Act engine was previously too heuristic and is being upgraded.
- [ ] Product promise needs truth-alignment.
- [ ] `.env.example` has OpenAI/Dodo naming mismatch with backend config.

## Working Rules

- [ ] Before each implementation batch, check `git status --short`.
- [ ] Do not revert user changes without explicit permission.
- [ ] Mark completed TODO items immediately after verification.
- [ ] Add tests for every risky backend behavior.
- [ ] Run relevant verification before marking a task complete.
- [ ] Keep product copy honest: operational evidence, not legal advice.
- [ ] Prefer fewer complete workflows over many half-finished pages.
