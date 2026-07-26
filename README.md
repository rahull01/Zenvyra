# Zenvyra

**EU AI Act readiness evidence platform for AI startups**

Zenvyra helps AI startups build and maintain an EU AI Act readiness record: inventory AI systems, classify risk indicators, map obligations, track evidence gaps, export proof-pack documents, and publish shareable verification pages for customer due diligence.

> Zenvyra is an operational readiness tool, not a law firm or a legal conformity declaration. It does not guarantee compliance. Review outputs with qualified counsel before making regulatory filings or compliance claims.

---

## Table of Contents

- [Product Overview](#product-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Product Overview

### What It Does

1. **AI System Inventory** — Register your AI systems: provider, model, use case, deployment context, EU exposure
2. **Risk Classification** — Automated EU AI Act risk tier assignment (prohibited / high-risk / limited-risk / minimal-risk) using a rule-based catalog that mirrors the Act's Annex III criteria
3. **Obligation Mapping** — Per-risk-tier obligations: transparency notices, human oversight, documentation, conformity assessment, AI literacy, GPAI provider requirements
4. **Evidence Gap Tracking** — Track what evidence exists vs. what's needed. Upload documents, assign statuses, request counsel review
5. **Proof Pack Export** — Generate system cards, transparency notices, assessment summaries, and evidence checklists as Markdown or PDF
6. **Shareable Verification Pages** — Publish scoped public proof pages showing readiness status without exposing private evidence
7. **AI-Powered Policy Drafting** — Generate first-draft privacy policies, terms of service, cookie policies via GPT-4 with prompt-injection guardrails
8. **Website Privacy Scanning** — Scan websites for trackers, cookies, compliance signals, AI disclosures
9. **Cookie Consent Banner** — Embeddable consent management with audit logging
10. **DSAR Workflow** — Data subject access request intake and tracking
11. **Team Collaboration** — Multi-user with role-based access (OWNER / ADMIN / MEMBER / VIEWER)
12. **Subscription Billing** — Dodo Payments integration with Free, Growth ($49), Pro ($199), Agency ($999) tiers

### Target Audience

- AI-enabled SaaS startups (seed to Series A) selling to EU enterprise customers
- B2B companies deploying LLMs that need to answer AI governance questionnaires
- Compliance agencies managing AI readiness for multiple client companies

---

## Tech Stack

### Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Language | Java 21 | Modern Java with records, sealed classes, pattern matching |
| Framework | Spring Boot 3.2.0 | REST API, dependency injection, security |
| Build | Maven 3.9 + wrapper | Dependency management, build automation |
| Database | MongoDB 7.0 | Document storage for compliance records |
| Cache | Redis 7 Alpine + Caffeine | Rate limiting, session cache, scan cache |
| Auth | JWT (jjwt 0.12.3) + OAuth2 (Google) | Token-based auth with HttpOnly cookies |
| Rate Limiting | Bucket4j 8.7.0 + Redis Lua | Token-bucket rate limiting (10 tiers) |
| AI | OpenAI GPT-4 (WebClient) | Policy generation, tracker classification, compliance analysis |
| PDF | Apache PDFBox 2.0.31 | Proof-pack PDF export |
| HTML Parsing | Jsoup 1.17.2 | Website scraping, HTML sanitization |
| Payments | Dodo Payments | Subscription billing, webhook processing |
| Email | SMTP / Resend | Transactional emails (25+ templates) |
| Monitoring | Sentry 7.0 | Error tracking (optional, disabled by default) |
| Real-time | WebSocket (STOMP + SockJS) | Scan progress, AI chat streaming |
| Validation | Spring Boot Starter Validation + custom | Input validation, SSRF protection |
| Security | Spring Security + BCrypt (strength 12) | Authentication, CSRF, CSP, HSTS |

### Frontend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14.2.35 (App Router) | Server-side rendering, routing |
| Language | TypeScript 5.3 (strict mode) | Type safety |
| Styling | Tailwind CSS 3.4 + CSS variables | Design system, responsive layout |
| UI Components | Radix UI (dialog, dropdown, select, tabs, toast, tooltip) | Accessible, unstyled primitives |
| State | Zustand 4.5 | Lightweight auth store |
| Forms | React Hook Form + Zod 3.22 | Form validation |
| Charts | Recharts 2.10 | Dashboard analytics, compliance charts |
| Animation | Framer Motion 11 | UI transitions, marketing animations |
| Icons | Lucide React (tree-shaken) | Icon system |
| HTTP | Axios 1.6.5 + CSRF interceptor | API client with automatic CSRF token management |
| Payments | Dodo Payments (client SDK) | Checkout session redirect |
| Monitoring | Sentry 8.0 (Next.js SDK) | Error tracking (optional) |

### Infrastructure

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Containers | Docker + Docker Compose | Local dev, staging, production deployment |
| Reverse Proxy | Nginx (Alpine) | TLS termination, rate limiting, static asset caching |
| CI/CD | GitHub Actions | Test, lint, build, deploy to staging/production |
| Monitoring | Sentry | Error tracking (opt-in) |
| Logging | SLF4J + Logback | Structured logging ready (JSON format available) |

---

## Architecture

### System Flow

```
Browser → Nginx → Next.js (app.zenvyra.com) → Spring Boot (api.zenvyra.com) → MongoDB + Redis
                                                      ↕
                                              OpenAI API
                                              Dodo Payments
                                              SMTP/Resend
```

### Auth Flow

1. User submits email+password → backend validates via Spring Security
2. Backend generates JWT with `token_use` claim (access/refresh)
3. JWT stored in HttpOnly cookies (`zenvyra_access`, `zenvyra_refresh`)
4. Session marker cookie (`zenvyra_session`) lets JavaScript detect auth state without seeing the JWT
5. CSRF token fetched from `/api/csrf` on first unsafe request
6. Middleware checks JWT expiration on server-rendered dashboard pages (Edge runtime)

### Security Architecture

| Control | Implementation |
|---------|---------------|
| Auth | JWT in HttpOnly cookies, SameSite=Lax, Secure flag (default true) |
| CSRF | CookieCsrfTokenRepository with X-CSRF-TOKEN header |
| Rate Limiting | 10 tiers: scanner (3/hr, 5/day), auth (10/5min), API (300/min), etc. |
| SSRF | URL validation blocks private IPs, link-local, metadata endpoints, CGNAT |
| Prompt Injection | AiPromptGuard sanitizes all user-controlled strings before LLM calls |
| XSS | Jsoup whitelist-based HTML sanitization (Safelist.none) |
| Password | BCrypt with strength 12 |
| JWT Validation | Minimum 32-char secret, token_use claim prevents token confusion |
| Webhook | HMAC-SHA256 verification, replay prevention via Redis + MongoDB |
| Audit Integrity | SHA-256 hashing with configurable salt for consent audit logs |
| Production Guard | Fails startup if JWT secret, MongoDB URI, Redis URL, etc. are missing |

---

## Features

### AI System Inventory

Register AI systems with fields for:
- Provider, model name, model version
- Use case, deployment context (cloud/on-premise/edge/SaaS/mobile/API-only)
- EU user exposure, user-facing AI interaction, automated decision-making
- Human oversight, transparency notices, technical documentation status
- 8 high-risk domain flags (healthcare, hiring, finance, education, biometric, government, critical infrastructure, child-related)
- Prohibited use flag, release status (draft/pilot/production/retired)

### Risk Classification

The `AiActRuleCatalogV2026_07` ruleset classifies systems into 4 tiers:
- **Prohibited** — systems that manipulate behavior, exploit vulnerabilities, or enable social scoring
- **High-Risk** — systems operating in Annex III domains (healthcare, hiring, finance, education, biometric, government, critical infrastructure, child-related) OR making automated decisions that affect legal rights
- **Limited-Risk** — user-facing AI interactions (chatbots, AI features) with transparency obligations
- **Minimal-Risk** — internal/prototype systems with no EU user exposure or automated decisions

Confidence is fixed at 0.75 with a mandatory counsel review warning on all assessments.

### Evidence Management

Track evidence items per system with statuses: MISSING → REQUESTED → UPLOADED → REVIEWED → APPROVED → STALE. Each item includes:
- Type (policy, model card, risk assessment, transparency notice, technical documentation, etc.)
- Counsel review status (NOT_REQUIRED / PENDING / APPROVED / REJECTED)
- Due date, file attachment support

### Proof Pack Export

Generate comprehensive compliance documents:
- System card (inventory summary + risk classification)
- Transparency notice (user-facing AI disclosure)
- Assessment summary (risk signals, obligations, gaps)
- Evidence checklist (evidence statuses per obligation)
- Counsel review summary

All exports available as Markdown and PDF.

### Subscription Tiers

| Plan | Price | Websites | Scans/mo | Policies | AI Systems | Features |
|------|-------|----------|----------|----------|------------|----------|
| Free | $0 | 1 | 10 | 3 | 3 | Basic scanning |
| Growth | $49/mo | 3 | 25 | 10 | 10 | Live embed, audit trail |
| Pro | $199/mo | 10 | 100 | 25 | 25 | + DSAR portal, full evidence pack |
| Agency | $999/mo | 50+ | Unlimited | Unlimited | Unlimited | + White-label, SSO (roadmap) |

---

## Getting Started

### Prerequisites

- Java 21 (Temurin or OpenJDK)
- Node.js 20+
- Docker & Docker Compose
- MongoDB 7.0 (local or Atlas)
- Redis 7 (local or cloud)
- OpenAI API key (for AI features)
- Dodo Payments account (for billing)

### Quick Start (Docker)

```bash
# Clone and setup
cp .env.example .env
# Edit .env with your keys (OpenAI, MongoDB URI, Redis URL, JWT_SECRET)

# Start all services
docker compose up -d --build

# Access
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Manual Development

**Backend:**
```bash
cd backend
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Staging:**
```bash
docker compose -f docker-compose.staging.yml up -d --build
```

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/Zenvyra` |
| `REDIS_URL` | Yes | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) | — |
| `OPENAI_API_KEY` | For AI features | OpenAI API key | — |
| `DODO_API_KEY` | For billing | Dodo Payments API key | — |
| `DODO_WEBHOOK_SECRET` | For billing | Dodo webhook secret | — |
| `FRONTEND_URL` | Yes | Frontend origin for CORS | `http://localhost:3000` |
| `APP_URL` | Yes | Public app URL for links | `http://localhost:3000` |
| `EMAIL_HOST` | For email | SMTP host | `smtp.resend.com` |
| `EMAIL_USER` | For email | SMTP username | — |
| `EMAIL_PASS` | For email | SMTP password | — |
| `APP_AUTH_COOKIES_SECURE` | Recommended | Set to `true` in production | `true` |
| `APP_SECURITY_HSTS_ENABLED` | Recommended | Enable HSTS in production | `false` (default) |
| `APP_AUDIT_CONSENT_SALT` | For consent audit | Salt for consent audit hash | (falls back to JWT_SECRET) |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Frontend Sentry DSN | (disabled if unset) |
| `SENTRY_DSN` | Optional | Backend Sentry DSN | (disabled if unset) |

Full list in `.env.example`.

---

## Deployment

### Production Deployment

```bash
# 1. Configure production environment
cp .env.production.example .env.production
# Edit with production values

# 2. Set up SSL certificates
# Place certs in nginx/ssl/ or use Let's Encrypt

# 3. Deploy
docker compose --profile production up -d --build
```

### CI/CD Pipeline

The project uses GitHub Actions with 3 workflows:

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `backend-ci.yml` | Push/PR to `main` touching `backend/` | Compile, test, dependency audit |
| `frontend-ci.yml` | Push/PR to `main` touching `frontend/` | Install, typecheck, lint, build, audit |
| `deploy.yml` | Push to `main` or `staging`, or manual dispatch | Test → Build images → Deploy to staging → Deploy to production |

### Infrastructure

- **Docker Compose** for container orchestration (no Kubernetes needed at current scale)
- **Nginx** reverse proxy for TLS termination, rate limiting, static caching
- **MongoDB 7.0** with `db_init.js` for initialization
- **Redis 7 Alpine** with append-only persistence for rate limiting and caching

---

## Testing

### Backend (267 tests)

```bash
cd backend
./mvnw test
```

Test types:
- **Unit tests**: Services, utilities, domain logic (JUnit 5 + Mockito)
- **Controller tests**: MockMvc with security context
- **Security tests**: Rate limiting, CORS, CSRF, authentication filters
- **Domain tests**: AI Act rule catalog (20+ classification scenarios)
- **Integration tests**: Full application context with test profile

### Frontend (22 tests)

```bash
cd frontend
npm test           # Runs vitest
npm run vitest     # Same
```

Test files:
- `__tests__/auth.test.ts` — Auth cookie naming, token validation, session detection
- `__tests__/middleware.test.ts` — JWT cookie contract, redirect on missing auth
- `__tests__/constants.test.ts` — Pricing plan structure, utility functions

---

## Project Structure

```
Zenvyra/
├── backend/                          # Spring Boot application
│   ├── Dockerfile                    # Multi-stage build (Maven → JRE Alpine)
│   ├── pom.xml                       # Maven build (Spring Boot 3.2, Java 21)
│   ├── src/main/java/com/zenvyra/
│   │   ├── ZenvyraApplication.java   # Entrypoint
│   │   ├── agents/                   # Multi-agent scan pipeline
│   │   │   ├── orchestrator/COO.java # Scan orchestrator (sequential pipeline)
│   │   │   ├── scanner/Scanner.java  # Website HTML scraping
│   │   │   ├── compliance/          # GDPR/CCPA/DPDP rule checking
│   │   │   ├── risk/Risk.java       # Score calculation
│   │   │   ├── legal/Legal.java     # Legal rule expansion
│   │   │   ├── jurisdiction/        # TLD→regulation mapping
│   │   │   ├── autofix/             # Fix suggestion generation
│   │   │   ├── monitoring/          # Change detection
│   │   │   └── report/              # AI analysis reporting
│   │   ├── client/
│   │   │   ├── OpenAiClient.java    # OpenAI API calls (with prompt injection guard)
│   │   │   ├── DodoPaymentsClient.java # Dodo Payments API
│   │   │   └── EmailClient.java     # Email sending
│   │   ├── config/                  # Spring configuration (13 files)
│   │   │   ├── SecurityConfig.java  # Filter chain, CSRF, CORS, CSP, OAuth2
│   │   │   ├── CorsOriginGuard.java # Wildcard rejection in production
│   │   │   ├── ProductionStartupGuard.java # Fails fast on missing config
│   │   │   └── ...
│   │   ├── controller/              # 44 REST controllers
│   │   │   ├── AuthController.java  # Signup, login, refresh, verify email
│   │   │   ├── ScanController.java  # Free + full website scans
│   │   │   ├── AiActController.java # AI Act CRUD + assessment + export
│   │   │   ├── PolicyController.java # Policy generation/editing
│   │   │   ├── SubscriptionController.java # Billing + plan management
│   │   │   ├── WebhookController.java # Dodo payment webhook ingestion
│   │   │   └── ...
│   │   ├── domain/aiact/            # EU AI Act ruleset
│   │   │   ├── AiActRuleCatalogV2026_07.java  # 4-tier risk classifier
│   │   │   ├── AiActRuleCatalog.java           # Rule catalog interface
│   │   │   ├── RiskLevel.java                  # Risk tier enum
│   │   │   └── ...
│   │   ├── dto/                     # Request/response objects (35+ files)
│   │   ├── exception/               # ApiException + GlobalExceptionHandler
│   │   ├── model/                   # MongoDB document models (45+ files)
│   │   │   ├── User.java            # User + auth (implements UserDetails)
│   │   │   ├── Subscription.java    # Subscription + billing
│   │   │   ├── AiSystemInventory.java # AI system record
│   │   │   ├── AiActAssessment.java # Risk assessment result
│   │   │   ├── EvidenceItem.java    # Compliance evidence document
│   │   │   ├── ConsentAuditLog.java # Tamper-evident consent audit
│   │   │   └── ...
│   │   ├── repository/              # MongoDB repositories (38 files)
│   │   ├── scheduler/               # 8 background jobs
│   │   ├── security/                # Security components (15 files)
│   │   │   ├── JwtTokenProvider.java    # JWT creation/validation
│   │   │   ├── JwtAuthenticationFilter.java # Bearer + cookie JWT auth
│   │   │   ├── AuthCookieService.java   # HttpOnly cookie management
│   │   │   ├── ApiKeyAuthenticationFilter.java # API key auth
│   │   │   ├── RateLimitFilter.java     # 10-tier rate limiting
│   │   │   ├── RedisRateLimiter.java    # Redis Lua token-bucket
│   │   │   ├── StandardWebhookSignatureVerifier.java # HMAC verification
│   │   │   └── ...
│   │   ├── service/                 # Business logic (49 files)
│   │   ├── system/                  # System services (backup, health)
│   │   └── util/                    # Utilities (validation, scoring, sanitizers)
│   │       ├── AiPromptGuard.java   # Prompt injection detection
│   │       ├── LogSanitizer.java    # PII redaction for logs
│   │       └── ValidationUtil.java  # Input validation + SSRF protection
│   ├── src/main/resources/
│   │   ├── application.yml          # Default config
│   │   ├── application-dev.yml      # Dev profile (DEBUG logging, insecure cookies)
│   │   ├── application-prod.yml     # Production profile (HSTS, Secure cookies)
│   │   ├── application-staging.yml  # Staging profile (DEBUG logging, Secure cookies)
│   │   ├── application-test.yml     # Test profile (mock services)
│   │   └── prompts/                 # LLM prompt templates
│   └── src/test/                    # 44 test files
│
├── frontend/                        # Next.js 14 application
│   ├── Dockerfile                   # 3-stage build (deps → builder → runner)
│   ├── next.config.js               # CSP headers, rewrites, Sentry, redirects
│   ├── package.json                 # Dependencies (Next 14, React 18, Zustand, etc.)
│   ├── tailwind.config.ts           # Design tokens (colors, typography, shadows)
│   ├── vitest.config.ts             # Vitest configuration
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, SEO, Sentry)
│   │   ├── middleware.ts            # JWT cookie validation for dashboard routes
│   │   ├── (marketing)/             # Public pages (pricing, features, blog, docs)
│   │   ├── (dashboard)/             # Dashboard pages (AI Act, scanner, policies, etc.)
│   │   ├── auth/                    # Login, signup, password reset, verify email
│   │   └── api/                     # API proxy (rewrites to backend)
│   ├── components/
│   │   ├── ui/                      # Reusable primitives (13 files, Radix-based)
│   │   ├── auth/                    # Login/signup forms
│   │   ├── dashboard/               # Sidebar, stats, charts, activity
│   │   ├── scan/                    # Scanner UI, score display
│   │   ├── policies/                # Policy wizard, editor, preview
│   │   ├── monitoring/              # Risk heatmap, alerts
│   │   └── marketing/               # Landing page sections
│   ├── hooks/                       # 8 custom hooks (useAuth, useDashboard, etc.)
│   ├── lib/                         # API client, helpers, constants
│   └── __tests__/                   # Frontend tests (3 files)
│
├── shared/                          # Shared types and constants
│   ├── types/                       # User, Website, Scan, Policy, Subscription
│   └── constants/pricing-plans.ts   # Plan definitions
│
├── nginx/
│   ├── nginx.conf                   # Production reverse proxy config
│   └── ssl/README.md                # SSL certificate setup guide
│
├── docs/                            # Documentation (36 files)
│   ├── api-spec.md                  # API endpoint reference
│   ├── database-schema.md           # MongoDB collection schemas
│   ├── threat-model.md              # Security threat model (11 threats)
│   ├── production-launch-runbook.md # Launch checklist + rollback plan
│   ├── incident-response-runbook.md # Incident response playbook
│   ├── support-playbook.md         # Customer support procedures
│   ├── go-to-market-strategy.md     # GTM plan
│   └── ...
│
├── docker-compose.yml               # Production Docker stack
├── docker-compose.staging.yml       # Staging Docker stack
├── .github/workflows/               # CI/CD (3 workflows)
│   ├── backend-ci.yml
│   ├── frontend-ci.yml
│   └── deploy.yml
└── .env.example                     # Environment variable template
```

---

## API Overview

All endpoints under `/api` context path.

### Authentication
```
POST /auth/signup       — Create account + verify email
POST /auth/login        — Login (returns HttpOnly cookies)
POST /auth/refresh      — Rotate tokens
POST /auth/logout       — Clear cookies
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
```

### AI Act
```
GET    /ai-act/systems       — List AI systems
POST   /ai-act/systems       — Create system
POST   /ai-act/systems/{id}/assess  — Run AI Act assessment
GET    /ai-act/readiness     — Overall readiness summary
POST   /ai-act/export/{systemId}    — Export proof pack
```

### Scanning
```
POST /scan/free     — Free public scan (no auth)
POST /scan/full     — Full scan (authenticated, plan-gated)
```

### Policies
```
POST   /policies         — Create policy (AI-generated)
GET    /policies/{id}    — Get policy
GET    /policies/public/{companySlug}/{type}  — Public policy page
```

### Billing (Dodo Payments)
```
POST /subscription/create   — Create checkout session
GET  /subscription/current  — Get current subscription
POST /subscription/cancel   — Cancel subscription
```

### Health
```
GET /health     — Liveness
GET /health/ready — Readiness (MongoDB + Redis)
```

Full API documentation: `docs/api-spec.md`

---

## Security

| Category | Status |
|----------|--------|
| Authentication | JWT in HttpOnly cookies + OAuth2 (Google) |
| Authorization | Role-based (ROLE_USER, ROLE_ADMIN) + org-level (OWNER/ADMIN/MEMBER/VIEWER) |
| CSRF | CookieCsrfTokenRepository with X-CSRF-TOKEN header |
| Rate Limiting | 10 tiers, Redis token bucket, in-memory fallback |
| SSRF Protection | URL validation, DNS resolution check, private IP blocking |
| XSS Prevention | Jsoup whitelist-based sanitization |
| Prompt Injection | Keyword detection + control char stripping |
| Password Hashing | BCrypt with strength 12 |
| JWT | HS256 with token_use claim (prevents confusion) |
| Webhook Auth | HMAC-SHA256 + replay prevention |
| Cookie Security | HttpOnly + SameSite=Lax + Secure (default true) |
| CSP | `default-src 'none'` (backend), strict policy (frontend) |
| HSTS | Optional (recommended for production) |
| Audit Trail | SHA-256 integrity hashing for consent logs |
| Production Guard | Fails startup on missing config (JWT, MongoDB, Redis, etc.) |

---

## Roadmap

- [x] EU AI Act readiness scanning & reports
- [x] AI system inventory + risk classification
- [x] Evidence management + gap tracking
- [x] Proof pack export (Markdown + PDF)
- [x] Shareable verification pages
- [x] OpenAI resilience, rate limiting & cost alerts
- [x] Cookie consent banner with audit logging
- [x] DSAR workflow
- [x] Subscription billing (Dodo Payments)
- [x] Team collaboration + org-level RBAC
- [x] Staging environment + CI/CD pipeline
- [ ] Multi-language document generation
- [ ] SSO/SAML enterprise auth
- [ ] Zapier/Slack integrations
- [ ] White-label solution
- [ ] SOC 2 / ISO 27001 certification
- [ ] Browser extension scanner

---

## License

MIT License — see [LICENSE](LICENSE).

## Support

- **Documentation**: `/docs` directory
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@zenvyra.com
