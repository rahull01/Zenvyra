# Zenvyra Database Schema

Last reviewed: 2026-06-07

Primary datastore: MongoDB via Spring Data MongoDB. Cache/rate-limit state uses Redis.

## Core Collections

| Collection | Model | Purpose |
| --- | --- | --- |
| `users` | `User` | Account identity, roles, organization links, agency/white-label fields. |
| `organizations` | `Organization` | Company profile, billing owner, branding settings. |
| `subscriptions` | `Subscription` | Plan, billing provider ids, subscription status, renewal/cancel state. |
| `invoices` | `Invoice` | Billing invoices and payment history. |
| `refresh_tokens` | `RefreshToken` | Refresh token rotation and expiry. |
| `teams` | `Team` | Team workspace and members. |
| `team_invites` | `TeamInvite` | Pending invitations. |
| `websites` | `Website` | Customer sites, compliance score, issues, scan history. |
| `scan_results` | `ScanResult` | Full scan results and score details. |
| `website_scan_results` | `WebsiteScanResult` | Website scanner output and classified trackers. |
| `scan_audit_logs` | `ScanAuditLog` | Tamper-aware scan activity trail. |
| `cookie_scans` | `CookieScan` | Cookie inventory and categorized cookie details. |
| `tracker_dictionary` | `TrackerDictionaryEntry` | Known tracker/vendor classification dictionary. |
| `policies` | `Policy` | Current hosted policy content and metadata. |
| `policy_versions` | `PolicyVersion` | Historical policy versions. |
| `banners` | `Banner` | Cookie banner config, language config, regional rules, A/B tests. |
| `consent_logs` | `ConsentLog` | Consent events from public banners. |
| `ConsentAuditLog` | `ConsentAuditLog` | Structured consent evidence/audit events. |
| `cross_domain_consent_tokens` | `CrossDomainConsentToken` | Cross-domain consent sync tokens. |
| `dsar_forms` | `DSARForm` | Public DSAR form config. |
| `dsar_submissions` | `DSARSubmission` | DSAR request lifecycle and response status. |
| `certificates` | `ComplianceCertificate` | Public verification token, score snapshot, issue summary. |
| `alerts` | `Alert` | Monitoring alerts. |
| `notifications` | `Notification` | In-app notification records. |
| `notification_queue` | `QueuedNotification` | Pending notification delivery jobs. |
| `notification_preferences` | `NotificationPreference` | User notification preferences. |
| `push_subscriptions` | `PushSubscription` | Browser push subscription data. |
| `push_tracking` | `PushTracking` | Push delivery/open tracking. |
| `competitors` | `Competitor` | Competitor sites, score history, alerts. |
| `regulations` | `Regulation` | Regulation catalog. |
| `regulation_changes` | `RegulationChange` | Regulatory change tracking. |
| `activity_logs` | `ActivityLog` | User and system activity timeline. |
| `api_keys` | `ApiKey` | Developer API key metadata and hashed secret material. |
| `webhooks` | `Webhook` | Customer webhook endpoint config. |
| `webhook_deliveries` | `WebhookDelivery` | Delivery attempts and response metadata. |
| `processed_webhooks` | `ProcessedWebhook` | Payment/webhook idempotency ledger. |
| `email_templates` | `EmailTemplate` | Editable email templates. |
| `agency_outreach_leads` | `AgencyOutreachLead` | Founder-led/agency sales pipeline leads. |
| `user_engagement_sessions` | `UserEngagementSession` | Product usage heartbeat sessions. |
| `user_experience_flags` | `UserExperienceFlag` | UX flags and onboarding state. |

## Required Indexes

Create and verify these indexes before launch:

| Collection | Index | Reason |
| --- | --- | --- |
| `users` | unique `email` | Login/account identity. |
| `users` | `organizationId` | Workspace queries. |
| `websites` | `userId`, `organizationId`, `url` | Dashboard and duplicate checks. |
| `scan_results` | `websiteId`, `createdAt` descending | Scan history. |
| `website_scan_results` | `websiteId`, `createdAt` descending | Tracker history. |
| `policies` | `userId`, `websiteId`, `companySlug`, `policyType` | Hosted policies and dashboard list. |
| `policy_versions` | `policyId`, `createdAt` descending | Version history. |
| `banners` | `userId`, `websiteId` | Banner management. |
| `consent_logs` | `bannerId`, `createdAt` descending | Consent exports. |
| `ConsentAuditLog` | `siteId`, `timestamp` descending | Evidence exports. |
| `ConsentAuditLog` | `hash` unique when present | Tamper-evidence checks. |
| `dsar_submissions` | `formId`, `status`, `createdAt` | SLA queues. |
| `certificates` | unique `verificationToken` | Public verification. |
| `certificates` | `websiteId`, `createdAt` descending | Certificate history. |
| `subscriptions` | `userId`, `providerSubscriptionId` | Billing lookup/webhooks. |
| `processed_webhooks` | unique `eventId` | Idempotency. |
| `api_keys` | `ownerId`, `prefix`, `active` | Key lookup and revocation. |
| `webhook_deliveries` | `webhookId`, `createdAt` descending | Delivery debugging. |

## Data Protection Rules

- Store API keys as hashed secrets only. Keep a short non-secret prefix for lookup/display.
- Never expose consent log IP addresses, raw user agent strings, customer emails, or DSAR payloads on public certificate pages.
- Keep payment provider raw payloads only if required for audit, and redact card/customer secrets.
- Encrypt backups at rest and restrict restore access to production operators only.
- Define retention windows before public launch:
  - Consent logs: default 24 months unless customer config says otherwise.
  - DSAR submissions: delete or anonymize after legal retention window.
  - Raw scan HTML/script samples: minimize and purge after classification when possible.

## Redis Usage

- Rate limiting buckets.
- Tracker classification cache.
- Monitoring/status cache.
- Short-lived workflow state.

Redis data is operational cache and should not be the source of record.

