# Zenvyra Threat Model

This document describes the threat model for Zenvyra as of the current
production candidate. It is maintained alongside the security controls in
`backend/src/main/java/com/zenvyra/security/` and the rate limits in
`backend/src/main/java/com/zenvyra/config/RateLimitProperties.java`.

> **Scope:** The web application (`app.zenvyra.com`), the public API
> (`api.zenvyra.com/api/**`), the public verification endpoints
> (`/verify/**`, `/badge/**`), and the scanner agents that fetch remote
> URLs.
>
> **Out of scope:** Zenvyra's internal MongoDB Atlas cluster, the
> payment provider (Dodo Payments), the email provider (Resend), and
> the application hosting platform. Those are secured via their own
> controls and contractual terms.

## Trust boundaries

```
                +---------------------+
                |  Public Internet    |
                +----------+----------+
                           |
                           v
+--------------------------+--------------------------+
|  Cloudflare / WAF        |  (TLS, DDoS, bot mgmt)    |
+--------------------------+--------------------------+
                           |
                           v
+--------------------------+--------------------------+
|  Next.js frontend        |  /verify, /badge, /api/*  |
|  (app.zenvyra.com)       |  (rewrites /api -> backend)|
+--------------------------+--------------------------+
                           |
                           v
+--------------------------+--------------------------+
|  Spring Boot backend     |  /api/auth, /api/team,     |
|  (api.zenvyra.com)       |  /api/ai-act, /api/admin   |
+--------------------------+--------------------------+
        |              |                |
        v              v                v
  +----------+   +-----------+   +-------------+
  | MongoDB  |   | Redis     |   | Dodo Pay.   |
  +----------+   +-----------+   +-------------+
```

The **main trust boundary** is between the Next.js reverse-proxy and the
Spring Boot backend. The frontend forwards user requests via Next.js
`rewrites()` with `withCredentials: true`. Backend auth state lives in
HttpOnly cookies (`zenvyra_access`, `zenvyra_refresh`) so the JWT never
crosses the JS boundary.

## Threat actors

| Actor | Motivation | Capability |
|-------|-----------|-----------|
| **External attacker** | Account takeover, scanner abuse, billing fraud | Public network, can register accounts, can submit URLs to the free scanner |
| **Authenticated user (tenant)** | Cross-tenant data access, privilege escalation within their tenant | Valid credentials, can call authenticated APIs |
| **Malicious tenant admin** | Data exfiltration of other tenants, fraudulent invitations | Valid OWNER/ADMIN credentials within their tenant |
| **Insider (employee with code or ops access)** | Data leak, malicious config change | Source code, deploy access, possibly production console access |
| **Compromised third-party SDK** (Sentry, Resend, Dodo) | Data exfiltration via telemetry | Outbound HTTPS from backend |

## Threats and mitigations

### T1 — Account takeover via stolen JWT

**Description:** Attacker obtains the JWT (e.g. via XSS, browser
extension, or shoulder-surfing a dev console).

**Mitigations:**
- JWTs are stored in HttpOnly cookies — JavaScript cannot read them
  (`AuthCookieService` uses `ResponseCookie.httpOnly(true)`).
- SameSite=Lax cookies prevent cross-site CSRF.
- JWT secret is sourced from `JWT_SECRET` env var; `JwtTokenProvider`
  rejects startup if the secret is shorter than 32 chars or matches the
  example placeholder.
- JWT access token TTL is `JWT_EXPIRATION` (default 24h).
- Refresh tokens are stored server-side in the `RefreshToken` collection
  and can be revoked (e.g. on password reset, see
  `AuthService.resetPassword`).

**Status:** Mitigated.

### T2 — Cross-tenant data access (RBAC bypass)

**Description:** Authenticated user from org A reads or writes data in
org B.

**Mitigations (post Phase A audit):**
- `OrgSecurityService` provides server-side authorization checks
  (`canViewOrganization`, `canManageOrganization`, `canManageMembers`)
  wired into controllers via `@PreAuthorize`.
- `Team` model has an `organizationId` field; every team-scoped endpoint
  requires the caller to be a member of that org.
- `OrganizationController` resolves the user's primary org via
  `OrganizationMemberRepository.findFirstByEmailOrderByCreatedAtAsc` and
  passes the org id to the security service.

**Residual risk:** Repository methods that accept an orgId from the
caller (e.g. `findByOrganizationId`) must continue to be wrapped by
`OrgSecurityService.requireMember`. Static analysis of new controllers
should enforce this.

**Status:** Mitigated for org-scoped endpoints covered in Phase A.
Audit coverage must extend to all controllers.

### T3 — CSRF on state-changing authenticated requests

**Description:** Attacker tricks a logged-in user's browser into
submitting a state-changing request via a cross-origin form.

**Mitigations:**
- `SecurityConfig` enables CSRF protection with
  `CookieCsrfTokenRepository.withHttpOnlyFalse()` so the SPA can read
  the token and attach it as the `X-CSRF-TOKEN` header.
- The frontend axios interceptor (`frontend/lib/api.ts`) automatically
  fetches the CSRF token from `/api/csrf` on first unsafe request and
  attaches it as `X-CSRF-TOKEN`.
- Auth, payment webhooks, scanner, and consent endpoints are explicitly
  excluded from CSRF (they have their own auth: login form, webhook
  signature, etc.).

**Status:** Mitigated.

### T4 — Scanner abuse (SSRF + resource exhaustion)

**Description:** Attacker submits internal URLs to the free scanner,
causing SSRF to internal services or exhausting scanner resources.

**Mitigations:**
- `SafeWebFetchService` follows redirects manually and validates the
  target URL at every hop (`ValidationUtil.isSafeUrlForScanning`,
  `ValidationUtil.validateHostResolvesToPublicAddresses`).
- Free scanner rate limit: 3/hour and 5/day per client IP via
  `RateLimitFilter` (Redis-backed token bucket).
- Public-write endpoints (including scanner and consent) have a 64 KB
  request body cap (`RateLimitProperties.publicWriteMaxBytes`).

**Status:** Mitigated. Residual risk: an attacker who controls a DNS
record that resolves to a public IP could still bypass SSRF checks if
they can make the IP appear public. Monitor for unusual scanner
patterns.

### T5 — Webhook spoofing

**Description:** Attacker sends forged webhook events to Dodo endpoints
to grant themselves paid access or cancel subscriptions.

**Mitigations:**
- `StandardWebhookSignatureVerifier` validates HMAC-SHA256 signatures
  using the secret from `DODO_WEBHOOK_SECRET`, with a 5-minute clock
  skew window and `whsec_` prefix decoding per the Standard Webhooks
  spec.
- Legacy HMAC verification is supported for older payloads.
- `WebhookController.processWebhookEvent` reserves the webhook id in
  Redis (`reserveWebhookId`) and the `ProcessedWebhook` collection to
  prevent replay.
- Spring Security `permitAll()` for `/dodo/webhooks/**`,
  `/webhooks/payment`, `/payments/dodo-webhook` is restricted to those
  exact paths.

**Status:** Mitigated.

### T6 — Cookie exfiltration via Next.js rewrite proxy

**Description:** Browser cookie set on `app.zenvyra.com` is forwarded
through the Next.js rewrite proxy to the backend at `api.zenvyra.com`.

**Mitigations:**
- `next.config.js` rewrites `/api/*` to `API_BASE_URL/api/*` and the
  frontend api client uses `withCredentials: true`. The browser attaches
  cookies to the rewrite path on the same origin (`app.zenvyra.com`).
- `next.config.js` enforces HSTS, X-Frame-Options DENY, and a strict
  Permissions-Policy.

**Residual risk:** The rewrite does not block access to backend-only
paths (e.g. `/api/admin/**`). Backend auth is the only barrier. If new
admin paths are added, they must be protected by `@PreAuthorize`.

**Status:** Mitigated.

### T7 — Rate-limit bypass via distributed clients

**Description:** Attacker uses a botnet to exceed the per-IP scanner
quota.

**Mitigations:**
- Per-IP rate limit via `RateLimitFilter` + Redis Lua token bucket.
- Per-user full-scan rate limit by plan tier.
- Per-org full-scan rate limit (multiplier of per-user limit).

**Residual risk:** True distributed abuse is not blocked — for that,
add Cloudflare bot management or a CAPTCHA challenge for unauthenticated
scanner traffic.

**Status:** Partially mitigated.

### T8 — Secrets leaked via logs

**Description:** A developer logs a request body, an email content, or
a JWT into the application log.

**Mitigations:**
- `LogSanitizer` redacts emails, IPs, IDs, exception messages, and
  stack traces at the log call site.
- `StandardWebhookSignatureVerifier` logs only `webhook-id`, never the
  payload.
- `JwtAuthenticationFilter` logs the user email only after
  successful token validation.

**Status:** Mitigated, but requires continued code review of any new
`log.info` / `log.error` calls.

### T9 — Backend Sentry DSN leak / disabled backend telemetry

**Description:** Without backend Sentry, production errors are silently
dropped, making incident response harder.

**Current state:** `application.yml` already binds `SENTRY_DSN`,
`SENTRY_ENVIRONMENT`, `SENTRY_TRACES_SAMPLE_RATE`. The frontend guards
Sentry initialization on `SENTRY_DSN` in `instrumentation.ts`.

**Residual:** The backend has no `sentry-spring` SDK dependency in
`pom.xml`. Backend errors will not be reported to Sentry until the
dependency is added and an `Initializer` is wired.

**Status:** Frontend guarded. Backend telemetry missing.

### T10 — Production startup misconfiguration

**Description:** Deploy with missing required env vars (e.g. empty JWT
secret) causes silent runtime failures.

**Mitigations:**
- `ProductionStartupGuard` runs on `prod` profile boot and refuses to
  start if any of `app.jwt.secret`, `dodo.webhook-secret`,
  `spring.data.mongodb.uri`, `spring.data.redis.url`, `app.url`,
  `frontend.url`, `cors.allowed-origins` is missing.

**Status:** Mitigated.

### T11 — Free scanner as abuse vector

**Description:** Free scanner used to fingerprint or DoS third-party
sites by repeatedly submitting their URLs.

**Mitigations:** Per-IP rate limit (T7). No CAPTCHA. No proof-of-work.

**Status:** Partially mitigated. Consider adding Cloudflare Turnstile
or a JS challenge before scanning.

## Security headers (current)

The Next.js frontend applies these headers to every response via
`next.config.js` `headers()`:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy-Report-Only` — currently in report-only mode
  for the main app; enforced only on `/p/:companySlug/:policyType`.

The Spring backend additionally applies:
- `default-src 'none'; frame-ancestors 'none'; base-uri 'none'` CSP for
  all responses (see `SecurityConfig`).

## Incident response

See `docs/incident-response-runbook.md` for the response playbook.
Key thresholds:
- Auth failure spike (> 5x baseline in 5 min) -> investigate T1/T2.
- Scanner error spike -> investigate T4.
- Webhook signature failure spike -> investigate T5.
- Public verification page 5xx -> investigate certificate issuer.
