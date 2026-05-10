# ComplianceAI Production Launch Runbook

This runbook covers all required credentials, environment variables, integrations, and deployment checks before go-live.

## 1) Required API Credentials

### OpenAI
- `OPENAI_API_KEY`
- Where to get it: OpenAI dashboard → API keys.
- Used for: policy generation, AI compliance analysis, remediation suggestions.

### Payment Provider (Dodo currently integrated)
- `DODO_API_KEY`
- `DODO_WEBHOOK_SECRET`
- `DODO_STARTER_PRODUCT_ID`, `DODO_PRO_PRODUCT_ID`, `DODO_ENTERPRISE_PRODUCT_ID`
- `NEXT_PUBLIC_DODO_CLIENT_ID` (frontend public key/client id)
- Where to get: Dodo merchant dashboard.
- Used for: checkout session creation, subscription lifecycle, webhook verification.

### Optional Stripe (if switching provider)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Where to get: Stripe dashboard → Developers.

### Database / Cache
- `MONGODB_URI`
- `REDIS_URL`
- Where to get: managed provider dashboards (MongoDB Atlas, Redis Cloud/ElastiCache).
- Used for: app data storage, monitoring hash/cache state.

### Auth / Security
- `JWT_SECRET`
- Where to get: generate securely (`openssl rand -base64 64`).
- Used for: JWT signing/verification.

### Email
- SMTP mode:
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
- Resend SMTP shortcut:
  - `RESEND_API_KEY` (also usable for SMTP user/pass mapping in current backend config)
- Used for: welcome, password reset, alerts, invitations.

### Domain / URLs
- `APP_URL` (frontend base URL)
- `FRONTEND_URL` (for backend references)
- `BACKEND_URL` (API/public backend URL)
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`
- `CORS_ALLOWED_ORIGINS`

### Generic compatibility aliases
- `PAYMENT_API_KEY`, `WEBHOOK_SECRET`
- Used as optional aliases in backend property resolution.

---

## 2) Production .env Files

- Root combined template: `.env.production.example`
- Backend template: `backend/.env.production.example`
- Frontend template: `frontend/.env.production.example`

Copy one into real deployment secrets:
- `cp .env.production.example .env` (or inject values through your secret manager/CI)

---

## 3) Docker + Env Setup

`docker-compose.yml` now supports:
- `env_file: ./.env` for backend/frontend
- no hardcoded secrets
- explicit variable injection for backend and frontend runtime

Deploy:
1. Create `.env` from `.env.production.example`.
2. Fill every required variable.
3. Run:
   - `docker compose --env-file .env up -d --build`

---

## 4) Payment Setup

Current integration: Dodo.

### Required
- Set `DODO_API_KEY`, `DODO_WEBHOOK_SECRET`, product IDs, and `NEXT_PUBLIC_DODO_CLIENT_ID`.
- Set `NEXT_PUBLIC_DODO_ENV=live` for production.

### Webhook endpoint
- Use: `https://api.yourdomain.com/api/webhooks/payment`
- Backend accepts both:
  - `/api/dodo/webhooks`
  - `/api/webhooks/payment`

### Mode handling
- Sandbox/test: use test keys + test products.
- Production/live: use live keys + live products + live webhook secret.

---

## 5) OpenAI Setup

1. Create API key in OpenAI dashboard.
2. Set `OPENAI_API_KEY`.
3. Optionally tune model via `OPENAI_MODEL`.

Rate limit hardening recommendation:
- Implement retries with exponential backoff (429/5xx).
- Add circuit-breaker/fallback response when upstream is unavailable.

---

## 6) Email Setup

Two supported patterns:
- SMTP provider (`EMAIL_HOST/PORT/USER/PASS`)
- Resend via SMTP (`smtp.resend.com`, API key as credentials)

Configured flows:
- welcome emails
- password reset
- low-score alerts
- team invitations

`APP_URL` is now used for links in email templates.

---

## 7) Domain + Deployment Config

Set:
- `APP_URL=https://app.yourdomain.com`
- `BACKEND_URL=https://api.yourdomain.com`
- `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`
- `CORS_ALLOWED_ORIGINS=https://app.yourdomain.com,https://www.yourdomain.com`

Ensure reverse proxy routes:
- frontend traffic to Next.js service
- `/api/*` traffic to Spring backend

---

## 8) Security Rules

- Never commit real `.env` values.
- Keep secrets in secret manager / CI variables / runtime injection.
- Rotate `JWT_SECRET`, payment keys, webhook secrets periodically.
- Use minimum 64-char random JWT secret.
- Restrict CORS to production origins only.

---

## 9) Final Launch Checklist

- [ ] All env variables set in production secret store.
- [ ] MongoDB and Redis connectivity verified.
- [ ] JWT secret generated and applied.
- [ ] OpenAI API key configured and AI endpoints tested.
- [ ] Payment keys + product IDs configured.
- [ ] Payment webhook delivery verified at `/api/webhooks/payment`.
- [ ] Email provider credentials verified (welcome/reset/alert emails sent).
- [ ] Frontend URLs and backend URLs match deployed domains.
- [ ] CORS configured to only allowed domains.
- [ ] Docker compose deployment uses `env_file` and no hardcoded secrets.
- [ ] Health checks pass and monitoring/logging enabled.
