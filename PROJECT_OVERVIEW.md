# Zenvyra Project Overview

This file is the main handover document for the project after cleanup. It explains what the project solves, how it is structured, how to start it, which technologies are used, and what the important folders and files do.

## 1. Project Summary

Zenvyra is an AI-powered compliance automation SaaS platform. It helps businesses scan websites for privacy and compliance issues, generate legal policies, manage consent, monitor compliance changes, create proof reports, support DSAR workflows, and handle subscription-based access.

The main problem it solves is that small and growing businesses usually do not have enough time, legal knowledge, or engineering support to keep privacy compliance updated across GDPR, CCPA, cookie consent, policy pages, tracker usage, data requests, and AI governance. Zenvyra combines scanning, automation, AI-generated guidance, dashboards, and integrations so a business can detect issues, understand risk, fix common problems, and maintain records.

## 2. Core Product Flow

1. A user signs up or logs in.
2. The user adds a website or runs a free scanner.
3. The backend fetches and analyzes the website.
4. Scanner services detect trackers, cookies, policy gaps, consent gaps, security signals, and compliance risks.
5. The backend calculates a compliance score and stores results in MongoDB.
6. The frontend displays dashboards, issue lists, recommendations, proof reports, and policy tools.
7. AI services can generate policies, explanations, fix suggestions, and compliance readiness outputs.
8. Subscription and plan logic controls access to premium workflows.
9. Monitoring, alerts, reports, and scheduled jobs keep compliance state updated over time.

## 3. Tech Stack

### Backend

- Java with Spring Boot.
- Maven for dependency management and builds.
- MongoDB for main application data.
- Redis for cache/rate-limit related flows.
- Spring Security with JWT authentication.
- OAuth2 support for Google login.
- WebSocket support for real-time flows.
- OpenAI integration for AI-assisted compliance and document generation.
- Dodo Payments integration for subscriptions and billing.
- SMTP/Resend style email configuration for transactional email.
- JUnit/Spring tests under `backend/src/test`.

### Frontend

- Next.js 14 with React 18.
- TypeScript.
- Tailwind CSS.
- Radix UI primitives.
- Lucide React icons.
- Zustand-ready frontend state patterns.
- React Hook Form and Zod for forms/validation.
- Recharts for analytics and dashboard charts.
- Framer Motion for UI motion.
- Next App Router route groups for marketing, dashboard, auth, docs, public policies, and API proxy routes.

### Shared

- TypeScript shared models and constants under `shared`.
- Pricing and compliance rule constants used by frontend/domain logic.

### Infrastructure

- Dockerfiles for frontend and backend.
- `docker-compose.yml` for local multi-service development.
- Environment templates for local and production configuration.

## 4. How To Start The Project

### Requirements

- Java installed. The project documentation says Java 21, but `backend/pom.xml` currently uses `<java.version>17</java.version>`. Keep this consistent before production.
- Node.js 18 or newer.
- Docker and Docker Compose.
- MongoDB.
- Redis.
- OpenAI API key if AI features are used.
- Dodo Payments credentials if billing is used.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

Backend runs on:

```text
http://localhost:8080/api
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

### Docker Compose

```bash
docker compose up --build
```

Use this when you want the project to run as a combined local stack.

## 5. Important Root Files

- `README.md`: Short public-facing project overview, setup instructions, API examples, and tech stack.
- `PROJECT_OVERVIEW.md`: This detailed handover document.
- `pom.xml`: Root Maven aggregator. It includes the backend module.
- `docker-compose.yml`: Local stack configuration for running app services together.
- `db_init.js`: Database initialization helper script.
- `.env.example`: Local environment variable template.
- `.env.production.example`: Production environment variable template.
- `.dockerignore`: Docker build ignore rules.
- `.gitignore`: Git ignore rules for env files, build outputs, IDE files, logs, generated files, and secrets.

## 6. Deleted Cleanup Files

The cleanup removed files and folders that were generated, temporary, duplicate planning material, browser profile dumps, or scratch configuration. Examples:

- `changes.md`
- `TODO.md`
- `IMPLEMENTATION_PLAN.md`
- `PRODUCTION_9_10_CHECKLIST.md`
- `COMPLIANCEAI_EXECUTION_CHECKLIST.md`
- `frontend-ui-design-prompt.md`
- `build_errors*.txt`
- `backend/mvn_test_output*.txt`
- `backend/build_verify_auth.txt`
- root empty `package-lock.json`
- `frontend/tsconfig.tsbuildinfo`
- `frontend/public/test-environment.html`
- browser/profile dump folders such as `edge-profile*`
- copied website dump folder `Design idea`
- generated audit screenshots folder `audit-shots`
- local editor/agent scratch folders such as `.agents`, `.cursor`, `.continue`, `.idea`, `.jetro`, `.kilo`, `.vscode`
- scratch assistant config files such as `AGENT.md`, `CLAUDE.md`, `.mcp.json`, `.windsurfrules`, and `blackbox_mcp_settings.json`

Core source code, real docs, env examples, backend, frontend, shared types/constants, scripts, and AI prompt templates were preserved.

## 7. Backend Structure

Backend root:

```text
backend/
  pom.xml
  Dockerfile
  mvnw, mvnw.cmd
  test-webhooks.sh
  src/main/java/com/zenvyra
  src/main/resources
  src/test
```

### Backend Build Files

- `backend/pom.xml`: Main backend Maven config. Defines Spring Boot, MongoDB, Redis, Security, OAuth2, Validation, Mail, WebFlux, WebSocket, JWT, Lombok, Jackson, Bucket4j, Caffeine, HttpClient, Jsoup, and test dependencies.
- `backend/Dockerfile`: Container build file for backend deployment.
- `backend/mvnw` and `backend/mvnw.cmd`: Maven wrapper scripts.
- `backend/test-webhooks.sh`: Helper script for webhook testing.

### Backend Resources

- `backend/src/main/resources/application.yml`: Main backend config. Defines server port/context path, MongoDB, Redis, OAuth, mail, JWT, OpenAI, Dodo Payments, CORS, logging, and app metadata.
- `application-dev.yml`: Development override config.
- `application-prod.yml`: Production override config.
- `application-test.yml`: Test profile config.
- `tracker-dictionary.json`: Known tracker dictionary used in tracker/cookie classification.
- `mock-tracker-classification.json`: Mock classification data for local/test flows.
- `prompts/website-scanner.txt`: Prompt used for website scanner AI tasks.
- `prompts/policy-generator.txt`: Prompt used for policy generation.
- `prompts/competitor-analysis.txt`: Prompt used for competitor analysis.

## 8. Backend Java Packages

### `ZenvyraApplication.java`

Spring Boot entrypoint. Starts the backend application and loads Spring configuration.

### `config`

Configuration classes:

- `SecurityConfig.java`: Spring Security setup.
- `AuthConfig.java`: Authentication-related beans/settings.
- `CorsOriginGuard.java`: CORS origin validation.
- `DodoConfig.java`: Dodo Payments config binding.
- `MongoConfig.java`: MongoDB config.
- `OpenAiConfig.java`: OpenAI config.
- `ProductionStartupGuard.java`: Production safety checks.
- `RedisConfig.java`: Redis config.
- `WebConfig.java`, `WebMvcConfig.java`: Web MVC settings/interceptors.
- `WebSocketConfig.java`: WebSocket endpoint/config setup.
- `AsyncConfig.java`: Async execution configuration.

### `controller`

Controllers expose REST/WebSocket API endpoints:

- `AuthController`: Signup, login, token refresh, password/auth flows.
- `UserController`: User profile operations.
- `OrganizationController`: Organization/account workspace operations.
- `TeamController`: Team and invite management.
- `WebsiteController`: Website registration and website-level operations.
- `ScanController`: Website scan APIs.
- `ScannerLeadController`: Free scanner lead capture.
- `ScoreBreakdownController`: Compliance score details.
- `PolicyController`: Policy generation, editing, retrieval.
- `ConsentController`: Consent records and consent state.
- `ConsentAuditController`: Audit log for consent activity.
- `CrossDomainConsentController`: Cross-domain consent token flow.
- `DsarController`: Data subject access request workflows.
- `BannerController`: Cookie banner configuration and delivery.
- `CertificateController`: Compliance certificate/proof assets.
- `ProofReportController`: Website proof report generation and access.
- `VerificationController`: Public verification endpoints.
- `PublicVerificationController` logic is represented through service/controller pair naming around verification.
- `AutoFixController`: Automated fix suggestions/workflows.
- `CompetitorController`: Competitor tracking and comparison.
- `MonitoringController`: Monitoring and change detection.
- `NotificationController`: In-app/email/push notifications.
- `PushSubscriptionController`: Browser push subscription handling.
- `SubscriptionController`: Plan/subscription APIs.
- `SetupPackageController`: Setup package orders/tasks.
- `StreakController`: Compliance streak/gamification.
- `DashboardController`: Dashboard summaries.
- `AiActController`: AI Act readiness workflows.
- `AgencyController`: Agency-specific workflows.
- `AdminOpsController`: Admin operations and overview data.
- `ComplianceExportController`: Export compliance data/reports.
- `DeveloperIntegrationController`: API key/developer integration endpoints.
- `IntegrationController`: Third-party integration flows.
- `WebhookController`: Webhook registration/delivery.
- `WebSocketController`: Real-time messages.
- `TelemetryController`: Frontend engagement/error telemetry.
- `OnboardingController`: Onboarding flow.
- `CsrfController`: CSRF helper endpoint.
- `HealthController`: Health/status endpoint.
- `HandoffController`: Handoff package workflows.

### `service`

Services contain business logic:

- `AuthService`: Authentication, password, token, OAuth-related business rules.
- `UserService`: User domain logic.
- `OrganizationService`: Organization domain logic.
- `TeamService`: Team membership and invites.
- `WebsiteService`: Website records and website state.
- `WebsiteScraperService`: Fetches website content for analysis.
- `SafeWebFetchService`: Safer outbound website fetching.
- `ScanService`: Main scan orchestration.
- `TrackerScanService`: Tracker/cookie detection.
- `TrackerClassificationService`: Classifies trackers using dictionary/mock/logic.
- `ScoreBreakdownService`: Calculates detailed compliance score breakdowns.
- `PolicyService`: Policy CRUD/generation lifecycle.
- `OpenAiService`: Calls AI model services for generated compliance output.
- `TemplateRenderer`: Renders templates/prompts/documents.
- `ConsentService`: Consent storage and state management.
- `ConsentAuditLogService`: Consent audit trail logic.
- `DsarService`: DSAR request lifecycle.
- `BannerService`: Cookie banner configuration.
- `BadgeImageService`: Badge/proof image rendering.
- `CertificateService`: Compliance certificate logic.
- `ProofReportService`: Proof report creation and retrieval.
- `PublicVerificationService`: Public verification response logic.
- `AutoFixService`: Suggested or automated remediation.
- `CompetitorService`: Competitor monitoring/comparison.
- `MonitoringService`: Continuous monitoring flows.
- `NotificationService`: Notification business logic.
- `PushNotificationService`: Push notification delivery.
- `EmailService`: Email sending.
- `SubscriptionService`: Plan and subscription logic.
- `SetupPackageService`: Setup package purchase/task logic.
- `StreakService`: Compliance streak/gamification logic.
- `ApiKeyManagementService`: API key generation and management.
- `WebhookDispatchService`: Webhook delivery.
- `ComplianceExportService`: Export generation.
- `AiActReadinessService`: AI Act readiness assessment logic.
- `AgencyOutreachService`: Agency lead/outreach automation.
- `AdminOpsService`: Admin overview and admin tables.
- `HandoffService`: Handoff packages and operational handover.
- `UserEngagementTelemetryService`: User session/event telemetry.

### `model`

Domain models stored or used by the backend:

- User/account: `User`, `Organization`, `Team`, `TeamInvite`, `RefreshToken`.
- Website/scanning: `Website`, `WebsiteScanResult`, `ScanResult`, `ScanAuditLog`, `ScannerLead`, `TrackerDictionaryEntry`, `CookieScan`.
- Policies/compliance: `Policy`, `PolicyVersion`, `ComplianceIssue`, `ComplianceCertificate`, `ComplianceStreak`, `Regulation`, `RegulationChange`.
- Consent/DSAR: `ConsentLog`, `ConsentAuditLog`, `CrossDomainConsentToken`, `DSARForm`, `DSARSubmission`.
- Billing/subscription: `Subscription`, `PlanType`, `PlanStatus`, `Invoice`, `SetupPackageOrder`.
- Notifications: `Notification`, `PushSubscription`, plus `model/notification` classes.
- Integrations/security: `ApiKey`, `Webhook`, `WebhookDelivery`, `ProcessedWebhook`.
- AI/admin/agency: `AiActAssessment`, `AiSystemInventory`, `AgencyOutreachLead`, `ActivityLog`, `Alert`, `Competitor`, `Banner`, `EmailTemplate`.
- Telemetry: `UserEngagementSession`, `UserExperienceFlag`.

### `repository`

Spring Data repositories for MongoDB access. Most model classes have matching repositories, for example:

- `UserRepository`
- `WebsiteRepository`
- `ScanResultRepository`
- `PolicyRepository`
- `ConsentLogRepository`
- `SubscriptionRepository`
- `WebhookRepository`
- `NotificationRepository`
- `AiActAssessmentRepository`

These files abstract database read/write operations.

### `security`

Security and access control:

- `JwtTokenProvider`: Creates and validates JWTs.
- `JwtAuthenticationFilter`: Reads JWT from requests and sets authentication.
- `AuthCookieService`: Auth cookie handling.
- `UserDetailsServiceImpl`: Loads user details for Spring Security.
- `OAuth2SuccessHandler`: OAuth success flow.
- `ApiKeyAuthenticationFilter`: API key auth.
- `RateLimitFilter`, `RedisRateLimiter`, `PerIpRateLimiter`: Request limiting.
- `CompliancePlanInterceptor`, `RequiresCompliancePlan`: Plan-based access control.
- `RequestCorrelationFilter`: Request tracing/correlation IDs.
- `StandardWebhookSignatureVerifier`: Webhook signature verification.

### `dto`

Request and response objects:

- `dto/request`: Incoming API payloads such as login, signup, scan request, policy request, create subscription, create API key, consent audit log, scanner lead capture.
- `dto/response`: Outgoing API payloads such as auth response, scan response, subscription response, score breakdown, public verification, fix suggestions, webhook response.
- `dto/response/admin`: Admin dashboard response shapes.

### `agents`

AI/compliance agent-style logic:

- `agents/orchestrator/COO.java`: Orchestration logic.
- `agents/scanner/Scanner.java`: Scanner agent.
- `agents/compliance/Compliance.java`: Compliance analysis agent.
- `agents/compliance/ComplianceRuleCatalog.java`: Rule catalog.
- `agents/autofix/AutoFix.java`: Fix recommendation agent.
- `agents/risk/Risk.java`: Risk analysis.
- `agents/legal/Legal.java`: Legal/policy reasoning.
- `agents/jurisdiction/Jurisdiction.java`: Jurisdiction/regulation routing.
- `agents/monitoring/Monitoring.java`: Monitoring agent.
- `agents/report/Report.java`: Reporting agent.
- `agents/memory/Memory.java`: Agent memory/context helper.
- `agents/model/Issue.java`, `AgentResponse.java`: Agent data shapes.

### `scheduler`

Scheduled/background jobs:

- `DailyScanScheduler`: Daily website scan automation.
- `MonthlyComplianceAuditScheduler`: Monthly compliance audits.
- `ChangeDetectionScheduler`: Detects website/regulation changes.
- `CompetitorAnalysisScheduler`: Competitor checks.
- `OnboardingReminderScheduler`: Onboarding reminders.
- `BackupScheduler`: Backup jobs.
- `AlertCleanupScheduler`: Cleans old alerts.
- `AgencyOutreachScheduler`: Agency outreach automation.

### `system`

Operational system services:

- `BackupService`: Backup operations.
- `RecoveryService`: Recovery workflows.
- `HealthCheckService`: Health checks.

### `util`

Shared backend helpers:

- `ValidationUtil`: Validation helpers.
- `ScoreCalculator`: Compliance scoring.
- `PolicyGenerator`: Policy text generation helper.
- `ComplianceChecker`: Compliance rule checking.
- `LogSanitizer`: Removes/sanitizes sensitive log data.
- `AiPromptGuard`: Guards AI prompts from unsafe/sensitive input.

## 9. Frontend Structure

Frontend root:

```text
frontend/
  app/
  components/
  hooks/
  lib/
  public/
  styles/
  types/
  package.json
  next.config.js
  tailwind.config.ts
  tsconfig.json
```

### Frontend Config Files

- `frontend/package.json`: Frontend dependencies and scripts.
- `frontend/package-lock.json`: Locked npm dependency versions.
- `frontend/next.config.js`: Next.js config, redirects, API rewrites, image config, CSP headers for public policy pages, and public env variables.
- `frontend/tailwind.config.ts`: Tailwind design/theme config.
- `frontend/postcss.config.js`: PostCSS config for Tailwind.
- `frontend/tsconfig.json`: TypeScript config and path alias `@/*`.
- `frontend/Dockerfile`: Frontend container build.
- `frontend/DESIGN_SYSTEM.md`: Design system notes.

### Frontend App Routes

The project uses the Next.js App Router.

#### Global app files

- `app/layout.tsx`: Root layout.
- `app/global-error.tsx`: Global error UI.
- `app/not-found.tsx`: 404 page.
- `app/api/[...path]/route.ts`: API proxy route to backend.
- `app/api/client-errors/route.ts`: Client error telemetry endpoint.
- `app/api/v1/banner/[siteId]/bundle.js/route.ts`: Public banner JavaScript bundle endpoint.

#### Auth routes

- `app/auth/login/page.tsx`: Login page.
- `app/auth/signup/page.tsx`: Signup page.
- `app/auth/forgot-password/page.tsx`: Forgot password page.
- `app/auth/reset-password/page.tsx`: Reset password page.
- `app/auth/magic-link/page.tsx`: Magic link auth page.
- `app/auth/verify-email/page.tsx`: Email verification page.
- `app/auth/layout.tsx`: Auth layout.

#### Marketing routes

Marketing pages live under `app/(marketing)`. They include:

- Homepage: `page.tsx`.
- Product/feature pages: `features`, `products`, `cookie-scanner`, `auto-fix`, `monitoring`, `magic-scanner`, `compliance-checker`.
- Legal/trust pages: `privacy`, `terms`, `cookies`, `security`, `security-faq`, `sub-processors`, `do-not-sell`, `disclaimer`, `refund-policy`, `legal`, `legal-dictionary`.
- Content pages: `blog`, `guides`, `documentation`, `resources`, `templates`, `webinars`, `product-releases`.
- Company pages: `about`, `careers`, `community`, `partners`, `press`, `contact`, `status`, `roadmap`.
- Solutions pages: `solutions` and `solutions/[slug]`.
- Individual product legal pages under `products/*`, such as privacy policy, terms and conditions, cookie policy, EULA, return policy, shipping policy, disclaimer, acceptable use policy, AI assistant, competitor audit, cookie consent, and cookie scanner.

#### Dashboard routes

Dashboard pages live under `app/(dashboard)`. They include:

- Main dashboard: `dashboard/page.tsx`.
- Websites: `websites`, `websites/new`, `websites/[id]`, `websites/[id]/handoff`, `websites/[id]/proof-report`.
- Scanner: `scanner`, `scanner/[id]/results`.
- Policies: `policies`, `policies/new`, `policies/[id]`, `policies/[id]/edit`, `policies/[id]/preview`.
- Consent: `consent`, `consent/banner`, `consent/preferences`, `consent/voice`, `consent/blockchain`, `consent/logs`.
- DSAR: `dsar`, `dsar/requests`.
- Integrations: `integrations`, `integrations/api`.
- Billing: `billing`, `billing/invoices`.
- Settings: `settings`, `settings/account`, `settings/notifications`.
- Admin/ops: `admin`, `agency`, `team`, `support`, `white-label`, `workflows`.
- Compliance/AI/analytics: `compliance-score`, `compliance/regions`, `ai-act`, `ai-chat`, `ai-insights`, `analytics`, `competitors`, `monitor`, `gamification`.

Some duplicate nested dashboard routes also exist under `app/(dashboard)/dashboard/...`. They likely support legacy URLs or old route structure. Review before removing because they may still be linked.

#### Public dynamic routes

- `app/free-privacy-scanner/page.tsx`: Standalone free scanner.
- `app/onboarding/page.tsx`: Onboarding flow.
- `app/docs/[category]/[slug]/page.tsx`: Dynamic docs pages.
- `app/p/[companySlug]/[policyType]/page.tsx`: Public hosted policy page.
- `app/verify/[siteId]/page.tsx`: Public verification page.
- `app/vs/[competitor]/page.tsx`: Competitor comparison page.

### Frontend Components

- `components/ui`: Reusable UI primitives like button, card, input, dialog, dropdown, select, tabs, table, toast, tooltip, skeleton, avatar, badge, progress.
- `components/auth`: Login/signup/OAuth/social auth UI.
- `components/dashboard`: Dashboard shell, sidebar, top bar, stats cards, charts, activity, recent policies, recent scans, quick actions.
- `components/scan`: Scanner UI, score display, animations, issue list, fix suggestions.
- `components/policies`: Policy wizard, templates, editor, preview, generator, embed snippet panel.
- `components/monitoring`: Risk heatmap, guardian status, competitor cards, change alerts.
- `components/marketing`: Marketing sections, navigation, hero, footer, pricing, FAQ, product showcases, social proof, compliance map, landing page scaffolds.
- `components/solutions`: Agency, startup, enterprise, and generic solution landing pages.
- `components/shared`: Shared layout and visual helpers such as page container, section wrapper, logo, loading spinner, empty state, back button, global header, confetti, gradient text.
- `components/zenvyra`: Custom branded Zenvyra navigation/button components.

### Frontend Hooks

- `useAuth.ts`: Authentication state/API helper.
- `useDashboard.ts`: Dashboard data access.
- `useMonitoring.ts`: Monitoring data access.
- `usePolicies.ts`: Policy data access.
- `useScan.ts`: Scan data/actions.
- `useSubscription.ts`: Subscription/billing state.
- `useToast.ts`: Toast notification helper.
- `useWebSocket.ts`: WebSocket connection/state helper.

### Frontend Lib

- `api.ts`: Main API client/helper.
- `auth.ts`: Auth helpers.
- `constants.ts`: Frontend constants.
- `dashboard-pages.ts`: Dashboard page metadata.
- `docs-content.ts`: Docs content registry.
- `dodo.ts`: Dodo payment helper.
- `env.ts`: Environment helpers.
- `icons.ts`: Icon helpers/map.
- `motion.ts`: Animation variants/helpers.
- `performance.ts`, `performance-config.ts`: Performance helpers/config.
- `pricing-plans.ts`: Pricing plan definitions.
- `product-pages.ts`: Product page content/config.
- `publicApi.ts`: Public API helper.
- `seo-schema.ts`: SEO structured data helpers.
- `utils.ts`: Shared utility helpers.
- `zenvyra-nav.ts`: Navigation config.
- `competitor-comparisons.ts`: Competitor comparison content/config.

### Frontend Public Assets

- `public/images/logo.svg`: Logo asset.
- `public/images/hero-illustration.svg`: Hero visual.
- `public/images/dashboard-mockup.png`: Dashboard screenshot/mockup.
- `public/fonts/Inter-Regular.woff2`, `Inter-Bold.woff2`: Local fonts.
- `public/favicon.ico`: Browser favicon.
- `public/robots.txt`: Search crawler rules.
- `public/rahul.png`: Image asset used somewhere in frontend.

## 10. Shared Folder

- `shared/types/user.ts`: User type definitions.
- `shared/types/website.ts`: Website type definitions.
- `shared/types/scan.ts`: Scan/result type definitions.
- `shared/types/policy.ts`: Policy type definitions.
- `shared/types/subscription.ts`: Subscription type definitions.
- `shared/constants/pricing-plans.ts`: Shared pricing plan data.
- `shared/constants/compliance-rules.ts`: Shared compliance rule data.

## 11. Docs Folder

- `docs/api-spec.md`: API documentation/spec.
- `docs/database-schema.md`: Database schema explanation.
- `docs/production-launch-runbook.md`: Production launch checklist/runbook.
- `docs/agency-setup-guide.md`: Agency setup guide.
- `docs/wordpress-installation-guide.md`: WordPress install guide.
- `docs/shopify-installation-guide.md`: Shopify install guide.
- `docs/webflow-installation-guide.md`: Webflow install guide.
- `docs/dodo-integration-guide.md`: Dodo Payments notes.
- `docs/pricing-strategy.md`: Pricing strategy.
- `docs/go-to-market-strategy.md`: GTM strategy.

## 12. AI Prompts

- `ai-prompts/website-scanner.md`: Prompt source for website scanning logic.
- `ai-prompts/policy-generator.md`: Prompt source for policy generation.
- `ai-prompts/competitor-analysis.md`: Prompt source for competitor analysis.

These mirror backend resource prompt files and are useful for editing prompt strategy in Markdown.

## 13. Scripts

- `scripts/count-frontend-hex.js`: Counts frontend color hex usage.
- `scripts/normalize-frontend-colors.js`: Color normalization helper.
- `scripts/normalize-frontend-colors-2.js`: Second color normalization helper.

These are maintenance/design-system scripts, not runtime application code.

## 14. Main Features

- Website compliance scanning.
- Cookie/tracker detection and classification.
- Compliance score and score breakdown.
- AI-generated fix suggestions.
- AI policy generation.
- Policy editor and hosted public policy pages.
- Cookie consent/banner management.
- Consent audit logging.
- Cross-domain consent support.
- DSAR request management.
- Public website verification pages.
- Proof reports and certificates.
- Subscription and billing workflows.
- Dodo Payments integration.
- Team and organization management.
- Admin operations dashboard.
- Agency workflows.
- Setup package ordering/handoff.
- Competitor compliance analysis.
- Continuous monitoring and change detection.
- Push/email/in-app notifications.
- Webhook integrations.
- API key/developer integrations.
- AI Act readiness checks.
- Compliance exports.
- Gamification/streaks.
- Marketing/product/legal documentation pages.

## 15. Important Environment Variables

Common required or important variables:

- `MONGODB_URI`: MongoDB connection string.
- `REDIS_URL`: Redis connection string.
- `JWT_SECRET`: JWT signing secret.
- `JWT_EXPIRATION`: Access token expiry.
- `JWT_REFRESH_EXPIRATION`: Refresh token expiry.
- `OPENAI_API_KEY`: OpenAI API key.
- `DODO_API_KEY`: Dodo Payments API key.
- `DODO_WEBHOOK_SECRET`: Dodo webhook secret.
- `DODO_BASE_URL`: Dodo API base URL.
- `DODO_GROWTH_PRODUCT_ID`, `DODO_PRO_PRODUCT_ID`, `DODO_AGENCY_PRODUCT_ID`, `DODO_SETUP_PACKAGE_PRODUCT_ID`: Billing product IDs.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `RESEND_API_KEY`: Email settings.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: OAuth login.
- `FRONTEND_URL`: Frontend origin for backend.
- `CORS_ALLOWED_ORIGINS`: Allowed frontend origins.
- `APP_URL`: Public app URL.
- `NEXT_PUBLIC_APP_URL`: Frontend public app URL.
- `NEXT_PUBLIC_API_URL`: Frontend public backend API URL.
- `NEXT_PUBLIC_WS_URL`: Frontend public WebSocket URL.
- `API_BASE_URL`: Backend URL used by Next.js rewrites.

## 16. API Shape

The backend runs under `/api` because `application.yml` sets:

```yaml
server:
  servlet:
    context-path: /api
```

Examples:

- Auth: `/api/auth/...`
- Scan: `/api/scan/...`
- Policies: `/api/policy/...`
- Websites: `/api/websites/...`
- Dashboard: `/api/dashboard/...`
- Consent: `/api/consent/...`
- Billing/subscriptions: `/api/subscriptions/...`
- Health: `/api/health`

The frontend also has a Next.js API proxy route at `frontend/app/api/[...path]/route.ts`, and `next.config.js` rewrites most `/api/*` requests to the backend.

## 17. Data Flow Example: Website Scan

1. User starts scan from scanner/dashboard UI.
2. Frontend hook/API helper sends request to backend.
3. `ScanController` receives request.
4. `ScanService` orchestrates scan.
5. `WebsiteScraperService` and `SafeWebFetchService` fetch website data.
6. `TrackerScanService` and `TrackerClassificationService` detect/classify trackers.
7. `ComplianceChecker` and `ScoreCalculator` calculate issues and score.
8. AI services can create explanations/fix suggestions.
9. Repositories save `ScanResult`, `WebsiteScanResult`, issues, and audit records.
10. Frontend dashboard/scanner result pages display score, issues, and next actions.

## 18. Data Flow Example: Policy Generation

1. User enters company/policy details in policy UI.
2. Frontend sends `PolicyRequest`.
3. `PolicyController` receives request.
4. `PolicyService` validates and manages policy lifecycle.
5. `OpenAiService`, `TemplateRenderer`, and prompt files help generate policy text.
6. `Policy` and `PolicyVersion` are saved.
7. User can edit, preview, publish, and embed/host policy.
8. Public route `app/p/[companySlug]/[policyType]/page.tsx` serves published policy pages.

## 19. Data Flow Example: Consent Banner

1. Admin configures banner in dashboard consent/banner UI.
2. Backend stores banner and consent configuration.
3. Public bundle route `app/api/v1/banner/[siteId]/bundle.js/route.ts` serves embeddable JS.
4. Website visitor interacts with banner.
5. Consent data is recorded through consent APIs.
6. `ConsentLog` and `ConsentAuditLog` preserve history.

## 20. Testing

Backend tests are under `backend/src/test`. Important areas:

- Auth integration.
- Controller security tests.
- Rate limiting.
- Production startup/config guards.
- Service tests for subscription, proof report, AI Act readiness, setup package, scanner leads, handoff.
- Utility tests for validation and log sanitization.
- Scheduler tests.
- Backup system tests.

Common command:

```bash
cd backend
./mvnw test
```

Frontend currently defines `lint`, `build`, and `dev` scripts. There is no explicit frontend test script in `frontend/package.json`.

## 21. Current Notes And Risks

- `README.md` says Java 21 but backend Maven config says Java 17. Decide one version and align docs/build.
- There are duplicate-looking dashboard routes under `app/(dashboard)/dashboard/...` and `app/(dashboard)/...`. Review links before deleting duplicates.
- There are multiple marketing component variants such as `components/marketing/Footer.tsx` and `components/marketing/footer/Footer.tsx`, or hero/product showcase variants. They may be intentional experiments or old components; check imports before pruning.
- `.env` exists locally and should not be committed because it may contain secrets.
- OpenAI, Dodo, MongoDB, Redis, email, and OAuth features require real credentials before production.
- Legal/compliance output should be treated as operational support, not final legal advice, unless reviewed by qualified counsel.

## 22. Recommended Next Cleanup

After this first cleanup, the next safe cleanup should be import-based:

1. Run frontend TypeScript/build checks.
2. Run backend compile/tests.
3. Use `rg` to find unused duplicate marketing/dashboard components.
4. Remove only files with no imports/routes and no runtime references.
5. Align Java version in README and backend Maven.
6. Update `.gitignore` if any new generated folders appear.

This keeps the project clean without accidentally deleting source files that still power routes or APIs.
