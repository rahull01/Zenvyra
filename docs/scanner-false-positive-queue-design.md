# Scanner False-Positive Review Queue — Design

This document describes the planned review queue for scanner signals that
the user (or the scanner team) believes are false positives. It is a
design document, not a shipped feature — implementing it depends on
the screenshot-capture work tracked in the master TODO (Phase 8).

## Goal

When a scanner signal fires (cookie detected, chatbot detected,
automated-decision language detected, etc.), the customer should be able
to:

1. See the signal alongside the page snippet that triggered it.
2. Mark the signal as a false positive with a reason.
3. Optionally attach a screenshot for evidence.
4. Have the false-positive suppression remembered for that signal and
   URL pattern, so the same detection does not reappear in future scans.

False positives are expected: every heuristic scanner produces some.
The queue exists to convert those noisy detections into clean,
trustworthy evidence for the proof pack.

## Data model

### `ScannerSignalReview`

```java
@Document(collection = "scanner_signal_reviews")
public class ScannerSignalReview {
    @Id private String id;

    @Indexed private String organizationId;
    @Indexed private String websiteId;
    @Indexed private String scanResultId;
    @Indexed private String signalId;   // points to ScanSignal.id

    private String signalType;          // COOKIE | CHATBOT | AUTOMATED_DECISION | AI_DISCLOSURE | ...
    private String signalLabel;         // the detected cookie name / pattern / phrase
    private String pageUrl;             // the URL where the signal was detected

    @Indexed private String status;     // OPEN | CONFIRMED_FALSE_POSITIVE | CONFIRMED_TRUE_POSITIVE | RESOLVED
    private String reason;              // free-text justification
    private String decidedBy;           // userId of the reviewer
    private LocalDateTime decidedAt;

    private String suppressionRule;     // optional pattern to suppress in future scans
    private Boolean suppressionActive;

    @Indexed private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Indexes

- `organizationId, status` — for "my open reviews" dashboard queries.
- `websiteId, signalType, signalLabel` — for "have we already reviewed
  this signal on this site" lookups.
- `suppressionActive, signalType, signalLabel` — used by the scanner
  at scan time to skip previously-suppressed detections.

### `ScannerSignal`

The scanner currently emits detections as inline fields on
`ScanResult`. To make them reviewable, we extract them into a separate
collection:

```java
@Document(collection = "scanner_signals")
public class ScannerSignal {
    @Id private String id;
    @Indexed private String scanResultId;
    @Indexed private String websiteId;
    @Indexed private String organizationId;

    private String type;          // COOKIE | CHATBOT | AUTOMATED_DECISION | AI_DISCLOSURE
    private String label;         // cookie name / pattern / phrase
    private String pageUrl;       // where it was found
    private String snippet;       // ±200 chars around the match
    private String evidenceUrl;   // optional screenshot key (see screenshot plan)

    @Indexed private Boolean suppressedByRule;
    private String reviewId;      // ScannerSignalReview.id once the user reviews it

    private LocalDateTime detectedAt;
}
```

## Scanner integration

When the scanner runs, it asks the `ScannerSignalReviewRepository` for
all active suppressions for this `(websiteId, signalType, signalLabel)`
tuple and tags any matched detection with `suppressedByRule=true`.
Suppressed detections still appear in the raw `ScanResult` but are
hidden from the proof-pack output and from the user's gap list.

```java
public class ScannerSignalSuppressionService {
    public boolean isSuppressed(String websiteId, String type, String label) {
        return reviewRepository.existsByWebsiteIdAndSignalTypeAndSignalLabelAndSuppressionActive(
            websiteId, type, label, true);
    }
}
```

The suppression check runs before writing the signal to the database so
that previously-suppressed detections are recorded as suppressed rather
than re-listed.

## API endpoints

```
GET  /websites/{id}/signals?status=OPEN
  -> returns the open signals for review (paginated)

POST /websites/{id}/signals/{signalId}/review
  body: { status, reason, suppressionActive?, suppressionRule? }
  -> creates a ScannerSignalReview; updates ScannerSignal.reviewId

POST /websites/{id}/signals/{signalId}/screenshot
  -> attaches a screenshot artifact to the signal (see screenshot plan)

GET  /admin/scanner/suppressions
  -> admin view of all active suppressions across orgs
```

All endpoints require authentication; admin endpoints require
`hasRole('ADMIN')`.

## UI

The dashboard `/scanner` page (or a new `/scanner/queue`) shows:

- A list of signals for the current website, filterable by status.
- For each signal: the snippet, the page URL, a "Mark as false
  positive" / "Mark as confirmed" pair, and a reason field.
- A bulk-action toolbar to mark many signals at once.

The screenshot view (when Phase S1 ships) shows the captured page
inline next to the signal.

## Audit log

Every review action writes an entry to `ActivityLog`:

- `action = "SCANNER_SIGNAL_REVIEWED"` with `targetId = signalId`,
  `details = { status, reason, suppressionRule? }`.
- Suppression activation writes an additional entry:
  `action = "SCANNER_SUPPRESSION_ACTIVATED"` (or
  `_DEACTIVATED`).

These are reviewable from the existing admin dashboard.

## Retention

- `ScannerSignal` rows are kept for 1 year (matches existing scan
  retention).
- `ScannerSignalReview` rows are kept indefinitely (they represent
  customer decisions and feed the suppression dictionary).
- Suppression rules can be deactivated by the customer; deactivated
  rules remain in the collection for auditability but no longer affect
  scans.

## Security review checklist

- [ ] Suppression rules are scoped to the customer's orgId — no
      cross-tenant suppression.
- [ ] Suppression rules cannot disable critical signals (e.g. a
      prohibited-use detection under the EU AI Act). The scanner
      always emits these regardless of suppression state; suppression
      only hides them from the customer-facing list, never from the
      backend audit log.
- [ ] Admin cross-org suppression view is audit-logged.
- [ ] Bulk review actions are rate-limited.

## Open questions

1. **Should false-positive confirmations count toward evidence?** No —
   a confirmed false positive is NOT evidence that the underlying
   behavior is compliant. It is a signal that the scanner misfired.
   Evidence items remain the source of truth for compliance posture.
2. **Should suppressions sync across team members?** Yes — any team
   member with edit rights on the website can create a review; the
   most recent decision wins.
3. **Should we expose suppression as an API?** Phase 2 — the first
   iteration is UI-only.
4. **What about signals on pages the customer doesn't own (e.g. CDN
   resources)?** Suppress by `(host, signalType, signalLabel)` rather
   than by URL, so a CDN-hosted asset is suppressed across the site.

## Related work

- `docs/scanner-screenshot-evidence-plan.md` — the screenshot feature
  that backs the visual evidence in the queue.
- `docs/threat-model.md` T4 (scanner abuse) — the queue itself does
  not change the threat model, but the suppression mechanism must not
  become a backdoor for hiding prohibited AI uses.
- `backend/src/main/java/com/zenvyra/service/AiActScannerIntegrationService.java`
  — the existing scanner-to-AI-Act integration. The new collection
  must be populated from this service so the queue reflects what was
  fed into the AI Act assessment.
