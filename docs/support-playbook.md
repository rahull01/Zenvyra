# Zenvyra Support Playbook

The playbook customer success uses to triage inbound support tickets,
chat messages, and community posts. Read it once, then refer back as
needed.

## Channels

| Channel | Use it for | Owner |
|---------|-----------|-------|
| `support@zenvyra.com` | Billing, account, security issues | Support team |
| In-app chat (dashboard) | Product questions, how-to | Customer success |
| `#zenvyra-users` (Slack community) | Peer questions, roadmap | Community manager |
| GitHub issues | Bug reports, reproducible problems | Engineering |
| security@zenvyra.com | Vulnerability disclosure | Security lead |

## Triage workflow

Every new ticket gets a category and a priority within 1 business hour:

| Category | Description | First responder |
|----------|-------------|-----------------|
| `bug` | Reproducible incorrect behavior | Engineering |
| `billing` | Subscription, payment, refund | Billing support |
| `question` | Product how-to, configuration | Customer success |
| `feature_request` | Product enhancement | Product (logged, not actioned) |
| `security` | Suspected vulnerability or data issue | Security lead (SEV1 escalation) |

Priorities:

- **P0** — Production down for the customer; data loss; suspected breach.
- **P1** — Major feature unusable; billing broken.
- **P2** — Minor feature broken; workaround exists.
- **P3** — Cosmetic / informational.

Target response times (business hours):

| Priority | First response | Resolution |
|----------|----------------|-----------|
| P0 | < 30 min | < 4 hours |
| P1 | < 4 hours | < 1 business day |
| P2 | < 1 business day | < 3 business days |
| P3 | < 3 business days | Best effort |

## Pre-built responses

### "How do I add my first AI system?"

```
To add your first AI system:

1. Sign in at https://app.zenvyra.com/dashboard
2. Go to AI Act > AI Systems
3. Click "Add AI system"
4. Fill in name, intended purpose, provider, and deployment context
5. Save — Zenvyra runs an initial assessment automatically

The assessment classifies the system under the EU AI Act (prohibited,
high-risk, limited-risk, or minimal-risk) and lists applicable
obligations. The classification and risk level are operational readiness
evidence — they are not a legal determination.
```

### "Why did my compliance score drop?"

```
Scores change for a few reasons:

1. **New cookie or tracker detected** on one of your monitored sites
   (review Tracker dictionary in the dashboard).
2. **New AI system added** without corresponding evidence.
3. **Evidence item marked stale** (default 90 days since last reviewed).
4. **Policy drift** between your public policy page and the policy
   stored in Zenvyra.

Open the dashboard's score breakdown to see which factor changed.
```

### "How do I cancel my subscription?"

```
You can cancel anytime from Dashboard > Settings > Billing >
Cancel subscription. We don't offer refunds for partial periods, but
your access continues until the end of the current billing period.

After cancellation your account is moved back to the Free plan. Your
data is preserved; you can re-subscribe at any time.

Note: cancelling removes scheduled scans. Your evidence history is
retained but new scans will not run.
```

### "Is Zenvyra a substitute for legal advice?"

```
No. Zenvyra is readiness automation software. It helps your team build
and maintain EU AI Act readiness evidence (inventory, gap analysis,
proof packs, public certificates), but it is not a law firm and does
not provide legal opinions.

For decisions that have legal consequences (conformity assessments,
high-risk classifications, regulatory filings), consult qualified
counsel. The disclaimers we display in-product and on public
certificates reflect this.
```

### "I lost access to my account"

```
If you can still receive email at the address on file:

1. Go to https://app.zenvyra.com/auth/forgot-password
2. Enter your email
3. Check your inbox for the reset link (5-minute expiry)
4. Set a new password

If you can no longer access the email address on file, contact
support@zenvyra.com from an alternate address. We'll need to verify
your identity before resetting access.

For organization accounts, OWNER/ADMIN can also remove members from
Dashboard > Team.
```

## Escalation paths

```
P0 / security  ->  security@zenvyra.com  ->  engineering manager
Billing dispute  ->  billing@zenvyra.com  ->  finance lead
Legal threat     ->  legal@zenvyra.com    ->  CEO
GDPR / privacy   ->  privacy@zenvyra.com  ->  DPO
```

## Bug reports

When escalating a bug to engineering, capture:

1. **Customer** and **organization id** (from the support tool).
2. **Steps to reproduce** verbatim.
3. **Expected vs actual** behavior.
4. **Browser / OS** (for UI bugs) or **API endpoint + request** (for
   backend bugs).
5. **Sentry issue id**, if available.
6. **Log Sanitizer-safe log lines** — never share full request bodies
   that contain customer data.

Open a GitHub issue (private security repo for security bugs) and link
the support ticket.

## SLA targets

- 99.9% monthly availability for the dashboard (excluding scheduled
  maintenance, announced 7 days in advance).
- P1 issues acknowledged within 4 business hours.
- 95% of support tickets resolved within 1 business day.

## How to access operational data

- **Sentry:** https://zenvyra.sentry.io (read-only access for support)
- **Logs:** CloudWatch / equivalent (admin-managed, read-only access)
- **Customer data:** Admin dashboard > Users (requires admin role)
- **Audit logs:** Admin dashboard > Audit (requires admin role)

## What NOT to do

- Do not share one customer's data with another customer.
- Do not promise refunds beyond the published refund policy without
  finance approval.
- Do not promise a feature delivery date without checking with product.
- Do not log into a customer's account on their behalf without written
  authorization.
- Do not send a security disclosure to a customer until the security
  lead has approved the wording.
