# Production Launch Runbook

Last reviewed: 2026-06-07

This runbook is the go/no-go checklist for a paid beta or public SaaS launch. A checked item means it was verified in the target environment, not only configured locally.

## Launch Gates

| Gate | Paid beta minimum | Public launch minimum |
| --- | --- | --- |
| Backend tests | `mvn test` passes | `mvn test` passes in CI |
| Frontend build | `npm run build` passes | `npm run build` plus lint/type checks pass in CI |
| Payment | Dodo sandbox webhook verified end to end | Live webhook verified with real product ids |
| Email | Welcome/reset/alert test emails delivered | Bounce handling and SPF/DKIM/DMARC verified |
| Monitoring | Error reporting enabled | Error reporting, logs, uptime, alerts enabled |
| Backups | Automated MongoDB backups configured | Restore drill completed and documented |
| Legal | UK/US disclaimers visible | Counsel-reviewed UK/US public terms/privacy/disclaimers |
| Public certificate | PII-redaction checked | Privacy/security review completed |

## Required Credentials

### OpenAI

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- Used for policy generation, compliance analysis, and remediation suggestions.

Production requirement:

- Configure timeout, retry/backoff, rate limit, and fallback behavior.
- Add cost guardrails per account or per scan.
- Validate AI JSON output before saving or displaying it.

### Payment Provider: Dodo

- `DODO_API_KEY`
- `DODO_WEBHOOK_SECRET`
- `DODO_STARTER_PRODUCT_ID`
- `DODO_PRO_PRODUCT_ID`
- `DODO_ENTERPRISE_PRODUCT_ID`
- `NEXT_PUBLIC_DODO_CLIENT_ID`
- `NEXT_PUBLIC_DODO_ENV=live` for production

Webhook endpoints accepted by the backend:

- `/api/dodo/webhooks`
- `/api/webhooks/payment`
- `/api/payments/dodo-webhook`

### Database and Cache

- `MONGODB_URI`
- `REDIS_URL`

Use managed MongoDB/Redis for production. Do not launch public SaaS on a developer laptop, free-tier database without backup, or unmanaged single node.

If you use the local Docker compose file for staging, keep `MONGO_BIND_ADDRESS=127.0.0.1` and `REDIS_BIND_ADDRESS=127.0.0.1` unless a private network/firewall explicitly protects those services. MongoDB and Redis must not be exposed directly to the public internet.

### Auth and Security

- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `APP_URL`
- `FRONTEND_URL`
- `BACKEND_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

Generate `JWT_SECRET` with at least 64 random bytes and rotate it through the secret manager.

### Email

SMTP mode:

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`

Resend SMTP mode:

- `RESEND_API_KEY`

Verified flows:

- Signup/welcome.
- Password reset.
- Low-score alert.
- Team invite.
- Billing/payment issue notification.

## Deployment

1. Create deployment secrets from `.env.production.example`, `backend/.env.production.example`, and `frontend/.env.production.example`.
2. Fill every required value in the production secret store.
3. Build:
   - Backend: `mvn -DskipTests compile`
   - Frontend: `npm run build`
4. Test:
   - Backend: `mvn test`
5. Deploy with Docker or the target platform.
6. Confirm:
   - `/health` returns healthy.
   - `/health/ready` returns healthy only when MongoDB and Redis are reachable.
   - Frontend can call the backend.
   - CORS allows only production domains.
   - No real secret appears in client bundles, logs, screenshots, or docs.

## Monitoring and Error Tracking

At least one error tracker and one log sink must be configured before paid beta.

Recommended options:

- Sentry for frontend and backend exceptions.
- Logtail/Better Stack for structured application logs.
- CloudWatch, Datadog, or Grafana Cloud for infra metrics and alarms.

Required alerts:

- Backend 5xx rate above threshold.
- Frontend build/deploy failure.
- Payment webhook verification failure.
- Payment webhook delivery backlog.
- OpenAI 429/5xx spike.
- Email delivery failure spike.
- MongoDB storage, CPU, memory, connection, and replication lag.
- Redis unavailable or high latency.
- Backup failure.

Minimum log fields:

- `requestId`
- `userId` or `anonymousId` when available
- `organizationId`
- `route`
- `status`
- `durationMs`
- `errorCode`
- `providerEventId` for webhooks

Never log:

- JWTs.
- API key secrets.
- Payment secrets.
- DSAR private payloads.
- Full consent IP/user-agent values unless legally required and access-controlled.

The backend emits an `X-Request-Id` response header and includes the request id in request-completion logs. Forward this header from the reverse proxy and include it in support/debug reports.

The frontend posts sanitized client crash summaries to `/api/client-errors`. These summaries intentionally avoid full stack traces and page data; connect platform logs or Sentry before public launch for long-term retention and alerting.

## MongoDB Backup and Restore Drill

Backup is not ready until restore has been tested.

Paid beta minimum:

1. Enable daily automated encrypted MongoDB backups.
2. Retain at least 7 daily backups.
3. Confirm backup success alerts are enabled.
4. Run one restore into a staging database.
5. Start backend against staging restore with production secrets disabled.
6. Verify login-disabled admin inspection or direct queries for:
   - `users`
   - `websites`
   - `policies`
   - `banners`
   - `consent_logs`
   - `subscriptions`
7. Record restore date, backup id, restore duration, and operator.

Public launch minimum:

- Retain 30 daily backups plus monthly archives.
- Test restore quarterly.
- Document RPO and RTO.
- Restrict backup restore permission to named operators.

## Payment Verification

Sandbox checklist:

- Create checkout.
- Complete payment.
- Receive webhook.
- Verify signature.
- Create/update subscription.
- Idempotently ignore duplicate webhook.
- Cancel subscription.
- Reflect cancellation in app access.

Live checklist:

- Use live product ids and live webhook secret.
- Run a real low-value transaction.
- Confirm invoice/receipt.
- Confirm refund/cancel path.

## Compliance and Legal Disclaimers

Required public copy:

- Zenvyra is not a law firm.
- Generated policies and scan results are not legal advice.
- Customers should review outputs with qualified counsel.
- Public certificates are operational evidence, not legal certification.
- UK workflows are review aids for UK GDPR, PECR, ICO accountability, and DSAR operations.
- US workflows are review aids for state privacy notices, consumer requests, opt-out signals, and FTC-style transparency.

Required product behavior:

- Show confidence and source of tracker classification where possible.
- Separate "detected issue" from "legal violation".
- Avoid guaranteeing UK GDPR, PECR, CCPA/CPRA, or other US state privacy compliance.
- Keep public certificate pages privacy-safe.

## Final Go/No-Go Checklist

- [ ] Backend `mvn test` green.
- [ ] Frontend `npm run build` green.
- [ ] API docs reviewed and match controllers.
- [ ] Database schema docs reviewed and indexes created.
- [ ] Payment webhook tested end to end.
- [ ] Email flows tested.
- [ ] OpenAI retry, timeout, fallback, validation, and cost guardrails verified.
- [ ] Consent/audit logs are tamper-evident or at least append-only with hashes.
- [ ] Public certificate redaction verified.
- [ ] Legal disclaimers visible in marketing, reports, generated policies, and certificate pages.
- [ ] Error monitoring enabled.
- [ ] Structured logs enabled.
- [ ] Uptime checks enabled.
- [ ] MongoDB backup restore drill completed.
- [ ] Git branch clean enough for release review.
- [ ] CI passes on the release branch.
