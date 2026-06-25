# Zenvyra API Specification

Last reviewed: 2026-06-07

Base path: `/api` in production when routed through the frontend proxy or reverse proxy. Backend controllers are mounted without the `/api` prefix.

## Authentication

- Browser user auth uses HttpOnly `zenvyra_access` and `zenvyra_refresh` cookies set by `/auth/signup`, `/auth/login`, `/auth/refresh`, and cleared by `/auth/logout`.
- Server-to-server or legacy clients may use JWT bearer tokens: `Authorization: Bearer <token>`.
- Developer integrations use scoped API keys created under `/developer/api-keys`; raw API key material is shown only once at creation or rotation.
- Public banner, policy, certificate, badge, and verification endpoints must not return private customer data.
- Payment webhooks must be verified with the configured Dodo webhook secret before processing.

## Core Endpoints

| Area | Method | Path | Auth | Purpose |
| --- | --- | --- | --- | --- |
| Health | GET | `/health` | Public | Runtime health probe. |
| Auth | POST | `/auth/signup` | Public | Create user account. |
| Auth | POST | `/auth/login` | Public | Exchange credentials for HttpOnly auth cookies. |
| Auth | POST | `/auth/refresh` | Refresh token | Rotate access token. |
| Auth | POST | `/auth/logout` | Cookie | Clear auth cookies. |
| Auth | POST | `/auth/forgot-password` | Public | Start reset flow. |
| Users | GET | `/users/me` | JWT | Current user profile. |
| Users | PUT | `/users/me` | JWT | Update profile. |
| Users | DELETE | `/users/me` | JWT | Delete account. |
| Organization | GET | `/organization` | JWT | Current organization. |
| Organization | PUT | `/organization` | JWT | Update organization settings. |
| Websites | POST | `/websites` | JWT | Add website. |
| Websites | GET | `/websites` | JWT | List websites. |
| Websites | GET | `/websites/{id}` | JWT | Website detail. |
| Websites | PUT | `/websites/{id}` | JWT | Update website. |
| Websites | DELETE | `/websites/{id}` | JWT | Delete website. |
| Websites | POST | `/websites/{id}/scan` | JWT | Start authenticated website scan. |
| Scan | POST | `/scan/free` | Public | Limited free scanner. |
| Scan | GET | `/scan/free` | Public | Free scan status/result lookup. |
| Scan | POST | `/scan/full` | JWT | Full scan with saved history. |
| Scan | GET | `/scan/history/{websiteId}` | JWT | Scan history. |
| Scan | POST | `/scan/trackers` | JWT | Tracker scan/classification. |
| Scan | GET | `/scan/trackers/{id}` | JWT | Tracker scan result. |
| Policies | POST | `/policies` | JWT | Create policy. |
| Policies | GET | `/policies` | JWT | List policies. |
| Policies | GET | `/policies/{id}` | JWT | Policy detail. |
| Policies | PUT | `/policies/{id}` | JWT | Update policy. |
| Policies | POST | `/policies/{id}/draft-ai` | JWT | AI-assisted draft. |
| Policies | GET | `/policies/public/{companySlug}/{policyType}` | Public | Hosted public policy. |
| Banners | POST | `/banners` | JWT | Create consent banner. |
| Banners | GET | `/banners` | JWT | List banners. |
| Banners | GET | `/banners/{id}` | JWT | Banner detail. |
| Banners | PUT | `/banners/{id}` | JWT | Update banner. |
| Banners | DELETE | `/banners/{id}` | JWT | Delete banner. |
| Banners | GET | `/banners/public/{id}/config` | Public | Public banner config. |
| Banners | GET | `/banners/public/{id}/trackers` | Public | Public tracker config. |
| Banners | GET | `/banners/public/{id}/banner.js` | Public | Embeddable banner script. |
| Consent | POST | `/consent/log` | Public/JWT | Store banner consent event. |
| Consent | GET | `/consent/logs/{bannerId}` | JWT | Consent log export/listing. |
| Consent | POST | `/consent/audit-log` | API key/JWT | Store structured audit event. |
| Consent | GET | `/consent/sync` | Public | Cross-domain consent lookup. |
| Consent | POST | `/consent/sync` | Public | Cross-domain consent sync. |
| DSAR | POST | `/dsar/submit` | Public | Submit data subject request. |
| DSAR | GET | `/dsar/submissions` | JWT | List submissions. |
| DSAR | GET | `/dsar/submissions/form/{formId}` | JWT | List by form. |
| DSAR | PATCH | `/dsar/submissions/{id}/status` | JWT | Update request status. |
| Certificates | POST | `/certificates/issue/{websiteId}` | JWT | Issue/reissue certificate. |
| Certificates | GET | `/certificates/verify/{token}` | Public | Verify certificate token. |
| Certificates | GET | `/certificates/my` | JWT | Current user certificates. |
| Public Verification | GET | `/verify/{siteId}` | Public | Privacy-safe site status. |
| Public Badge | GET | `/badge/{siteId}` | Public | PNG badge. |
| Dashboard | GET | `/dashboard/stats` | JWT | Dashboard metrics. |
| Dashboard | GET | `/dashboard/compliance-score` | JWT | Aggregate score. |
| Dashboard | GET | `/dashboard/websites` | JWT | Website overview. |
| Dashboard | GET | `/dashboard/recent-scans` | JWT | Recent scans. |
| Dashboard | GET | `/dashboard/ai-insights` | JWT | AI insights. |
| Dashboard | GET | `/dashboard/tasks` | JWT | Tasks/remediation. |
| Dashboard | GET | `/dashboard/usage` | JWT | Usage metrics. |
| Dashboard | GET | `/dashboard/activity` | JWT | Recent activity. |
| Monitoring | GET | `/monitoring/alerts` | JWT | Alerts. |
| Monitoring | PUT | `/monitoring/alerts/{id}/read` | JWT | Mark alert read. |
| Monitoring | GET | `/monitoring/status` | JWT | Monitoring status. |
| Monitoring | POST | `/monitoring/toggle/{websiteId}` | JWT | Toggle monitoring. |
| Subscription | POST | `/subscription/create` | JWT | Create checkout/subscription. |
| Subscription | GET | `/subscription/current` | JWT | Current subscription. |
| Subscription | POST | `/subscription/cancel` | JWT | Cancel subscription. |
| Subscription | POST | `/subscription/upgrade` | JWT | Upgrade subscription. |
| Payments | POST | `/dodo/webhooks` | Dodo signature | Payment webhook. |
| Payments | POST | `/webhooks/payment` | Dodo signature | Payment webhook alias. |
| Payments | POST | `/payments/dodo-webhook` | Dodo signature | Payment webhook alias. |
| Developer | GET | `/developer/api-keys` | JWT | List API keys. |
| Developer | POST | `/developer/api-keys` | JWT | Create API key. Secret should be shown once. |
| Developer | POST | `/developer/api-keys/{id}/roll` | JWT | Rotate key. |
| Developer | DELETE | `/developer/api-keys/{id}` | JWT | Revoke key. |
| Developer | POST | `/developer/webhooks` | JWT | Create webhook endpoint. |
| Developer | GET | `/developer/webhooks` | JWT | List webhook endpoints with signing secrets redacted. |
| Integrations | GET | `/integrations/wordpress/download/{bannerId}` | JWT | WordPress integration package. |
| Integrations | GET | `/integrations/shopify/pixel/{bannerId}` | JWT | Shopify pixel script. |
| Integrations | GET | `/integrations/gtm/template/{bannerId}` | JWT | GTM template. |
| Team | POST | `/team` | JWT | Create team. |
| Team | GET | `/team` | JWT | List teams. |
| Team | POST | `/team/{teamId}/members` | JWT | Invite/add member. |
| Team | DELETE | `/team/{teamId}/members/{memberId}` | JWT | Remove member. |
| Competitors | POST | `/competitors` | JWT | Add competitor. |
| Competitors | GET | `/competitors` | JWT | List competitors. |
| Competitors | DELETE | `/competitors/{id}` | JWT | Remove competitor. |
| Competitors | GET | `/competitors/report` | JWT | Competitor report. |
| Admin Export | GET | `/admin/compliance/export/{siteId}` | Admin/JWT | Export compliance evidence. |
| Telemetry | POST | `/v1/telemetry/heartbeat` | JWT/API key | Product usage heartbeat. |

## Required Production Behaviors

- Return `401` for missing/invalid auth, `403` for wrong plan/role, `429` for rate limits, and `5xx` only for unexpected runtime failures.
- Validate all request bodies with DTO validation. Never pass raw user input into AI prompts without guardrails.
- Redact secrets in logs and responses. API key material and webhook signing secrets must be displayed once at creation or rotation only.
- Public verification responses must include score/status metadata only, not consent records, IP addresses, requestor emails, or private scan payloads.
- All payment webhook handlers must be idempotent using a processed webhook record.
