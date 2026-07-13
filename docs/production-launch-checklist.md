# Production Launch Checklist

## Pre-Launch

- [x] Auth cookie + CSRF flow reviewed and tested
- [x] CORS production guard verified (no wildcard origins outside dev/test)
- [x] CSRF ignore list confirmed (auth, webhooks, public scan, consent)
- [x] API rate limits configured and tested
- [x] Webhook signature verification implemented
- [x] API proxy path blocking reviewed
- [x] No secrets logged (LogSanitizer)
- [x] SSRF protections cover redirects
- [x] Security headers reviewed and in place
- [x] Sentry DSN configured (guarded setup)
- [x] Threat model document created
- [x] Abuse prevention for free scanner

## Pre-Launch

- [ ] Backend unit tests pass
- [ ] Backend integration tests pass
- [x] Frontend TypeScript passes
- [x] Frontend production build passes
- [ ] Frontend component tests for AI Act flow
- [ ] Frontend E2E signup/login/onboarding test
- [ ] E2E AI system to proof pack test
- [ ] E2E public verification test
- [ ] E2E billing checkout mock test
- [ ] Rate-limit tests for configured properties
- [ ] Security regression tests for proxy and CSRF
- [ ] Deterministic Mongo/Redis test infrastructure

## Production Checklist

- [x] MongoDB Atlas backup plan
- [x] Restore drill checklist
- [x] Redis persistence/backup decision
- [x] Health readiness checks
- [x] Sentry DSN setup guide
- [x] Uptime monitor guide
- [x] Structured log fields
- [x] Request correlation check
- [x] Admin ops review
- [x] Incident response runbook