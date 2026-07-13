# Zenvyra Incident Response Runbook

This runbook is the on-call playbook for the Zenvyra production
environment. It pairs with `docs/threat-model.md`, which describes the
threat model in scope.

## Roles

| Role | Who | Responsibilities |
|------|-----|------------------|
| **Incident Commander (IC)** | On-call engineer | Owns the incident end-to-end. Decides severity, drives the timeline, calls the roll. |
| **Comms Lead** | Customer success / product | Owns status-page updates and customer comms. Posts every 30 min during SEV1/SEV2. |
| **Tech Lead** | Senior engineer | Drives the technical fix. Coordinates with engineering if the IC is not deeply technical. |
| **Scribe** | Anyone free | Captures the live timeline in `#incident-<id>`. Records every action, decision, and timestamp. |

## Severity classification

| Sev | Criteria | Response time | Comms cadence |
|-----|----------|---------------|---------------|
| **SEV1** | Production down for all users, or data loss / breach confirmed | Immediate | Every 30 min |
| **SEV2** | Major feature broken for many users, or suspected security incident | < 30 min | Every 60 min |
| **SEV3** | Minor feature broken, or single user impacted | < 4 hours | Daily summary |
| **SEV4** | Cosmetic / non-urgent | Next business day | None |

## First 15 minutes

1. **Acknowledge** the alert in PagerDuty / Sentry / uptime monitor.
2. **Open an incident channel:** `#incident-<short-id>` in Slack.
3. **Assign roles:** IC, Comms Lead, Tech Lead, Scribe.
4. **Post a status-page update** acknowledging the incident.
5. **Capture state** before changing anything:
   - Sentry issues around the timestamp
   - Cloudflare / WAF logs for the affected path
   - Backend logs (last 30 min) for the affected service
   - Database slow query log / Mongo profiler output
6. **Form a hypothesis** before any fix. State it in the channel.
7. **If customer data may be exposed**, escalate to SEV1 and notify the
   security lead and legal counsel.

## Communication templates

### Initial status page (within 5 min)

```
Title: Investigating elevated errors on <feature>
Body: We are investigating reports of <symptom>. Engineers are engaged.
      Updates will follow within 30 minutes.
```

### In-progress (every 30 min for SEV1/2)

```
Title: Update — <feature>
Body: We have identified the issue as <root cause summary>.
      Mitigation in progress: <what we are doing>.
      ETA: <best estimate>.
```

### Resolved

```
Title: Resolved — <feature>
Body: The incident affecting <feature> is resolved. Service is fully
      restored as of <time>. A full postmortem will follow within 5
      business days.
```

### Customer email (SEV1/SEV2 with user impact)

```
Subject: [Zenvyra] Service incident update

Hi,

We experienced an incident affecting <feature> between <start> and <end>.
If your account was impacted, you may notice <symptom>. No action is
required on your part.

We are reviewing logs and will publish a postmortem at
https://docs.zenvyra.com/postmortems/<id> within 5 business days.

If you have urgent questions, reply to this email.

— The Zenvyra team
```

## Postmortem template

Save the postmortem to `docs/postmortems/<YYYY-MM-DD>-<short-title>.md`.

```
# Postmortem: <Title>

- **Date:** YYYY-MM-DD
- **Severity:** SEV?
- **Duration:** <start> to <end>
- **IC:** <name>
- **Status:** Draft | Reviewed | Published

## Summary
One-paragraph description of what happened.

## Impact
What users saw, how many were affected, what data was exposed.

## Timeline (UTC)
- HH:MM — <event>
- HH:MM — <event>

## Root cause
The actual underlying cause, not the symptom.

## Contributing factors
What made this possible or worse.

## What went well
What helped us detect, respond, or mitigate.

## What went poorly
What slowed us down or made things worse.

## Action items
- [ ] <owner>: <action> (<deadline>)
```

## Specific Zenvyra scenarios

### Auth / JWT secret leak

**Indicators:** Unusual login activity, tokens appearing on public paste
sites, Sentry alert on `JwtTokenProvider` rejection.

**Steps:**
1. Treat as SEV1 — rotate immediately.
2. Generate a new secret (≥32 chars): `openssl rand -base64 48`.
3. Update `JWT_SECRET` in the production secrets store.
4. Restart all backend instances. New tokens will be signed with the new
   key.
5. Existing tokens are invalidated on first request because they cannot
   be verified with the new key — users must re-authenticate.
6. Post a status-page update; expect a wave of re-login requests.
7. Add a postmortem.

### MongoDB compromise

**Indicators:** Anomalous reads from new IPs, alerts from Atlas on
unusual query patterns, public paste of credentials.

**Steps:**
1. SEV1. Notify security and legal.
2. Rotate database credentials; Atlas allows live rotation.
3. Audit `db.users.find()` and `db.activity_logs.find()` for the time
   window for evidence of exfiltration.
4. If user data was exposed, prepare breach-notification emails and
   coordinate with legal before any external comms.
5. Enable IP allow-listing on Atlas for the application subnets.
6. Review and revoke any compromised API keys.

### Webhook secret leak

**Indicators:** Sentry alert on `StandardWebhookSignatureVerifier`
failures spiking, alerts on `WebhookController` 503 responses.

**Steps:**
1. SEV2. The secret is used to validate inbound webhooks from Dodo.
2. Generate a new webhook secret in the Dodo dashboard.
3. Update `DODO_WEBHOOK_SECRET` in the production secrets store.
4. Backend picks up the new value on the next config refresh (or
   restart if not using Spring Cloud Config).
5. Coordinate with Dodo support to roll the secret on their side
   without dropping events.

### Public scanner DDoS

**Indicators:** Free-scanner rate-limit metrics saturating; high
backend CPU; Sentry alert on `SafeWebFetchService` timeouts.

**Steps:**
1. SEV2 if user-visible; SEV3 if internal-only.
2. Inspect `RateLimitFilter` metrics in Redis to identify the source IP
   or IP range.
3. Add a Cloudflare WAF rule to block the offending range.
4. If the pattern is from a distributed botnet, enable Cloudflare
   Bot Fight Mode (or equivalent) at the edge.
5. Consider lowering the public-scanner rate limit temporarily via
   `RATE_LIMIT_PUBLIC_SCANNER_HOURLY` and `RATE_LIMIT_PUBLIC_SCANNER_DAILY`.
6. After mitigation, review the scanner abuse-prevention roadmap
   (CAPTCHA, proof-of-work) — see `docs/threat-model.md` T11.

### Dodo Payments outage

**Indicators:** Subscription webhooks stop arriving; checkout failures
spike; users cannot subscribe.

**Steps:**
1. SEV2.
2. Confirm the outage on `https://status.dodopayments.com` (or contact
   support).
3. Pause billing-related campaigns / marketing that promises
   subscription.
4. New checkouts will fail until Dodo recovers; surface a friendly
   message in the UI.
5. Once Dodo recovers, reconcile any webhook backlog: replay missed
   events from the Dodo dashboard.

### Data breach (user PII exposed)

**Indicators:** Audit log shows unauthorized reads; user report of
their data being leaked; third-party notification.

**Steps:**
1. SEV1. Treat as suspected breach until proven otherwise.
2. Notify security lead and legal counsel within 1 hour.
3. Snapshot relevant logs and database state for forensic analysis.
4. Do NOT delete logs or rotate credentials until counsel approves.
5. Prepare breach-notification emails per legal requirements (GDPR
   requires within 72 hours).
6. File required regulatory notifications (ICO / supervisory
   authority).

## Dashboards and runbooks

- **Status page:** https://status.zenvyra.com (admin-managed)
- **Sentry:** https://zenvyra.sentry.io
- **MongoDB Atlas:** https://cloud.mongodb.com (admin-managed)
- **Cloudflare:** https://dash.cloudflare.com (admin-managed)
- **Dodo Payments:** https://app.dodopayments.com (admin-managed)

## On-call rotation

- **Primary:** on-call engineer (rotates weekly)
- **Secondary:** senior engineer (rotates weekly)
- **Escalation:** engineering manager
- **Security escalation:** security@zenvyra.com
- **Legal escalation:** legal@zenvyra.com
