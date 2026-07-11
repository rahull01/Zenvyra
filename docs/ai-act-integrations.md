# AI Act Integrations

This document describes how external systems can integrate with Zenvyra's
AI Act inventory, evidence, and import endpoints.

## Scoped API keys

API keys (`sk_live_...`) authenticate external integrations. Each key carries a
list of scopes that gate which endpoints the caller can invoke.

| Scope | Granted endpoints |
| --- | --- |
| `EVIDENCE_WRITE` | `POST /v1/external/ai-act/evidence` |
| `SYSTEMS_READ`   | `GET /v1/external/ai-act/systems` |
| `SYSTEMS_WRITE`  | `POST /v1/external/ai-act/systems` |

### Authentication

Send the API key via either header:

```
X-API-Key: sk_live_<token>
```

or as a Bearer token:

```
Authorization: Bearer sk_live_<token>
```

### Authorization responses

- `401 Unauthorized` — API key missing, malformed, revoked, or expired.
- `403 Forbidden` — API key valid but missing the required scope for the
  endpoint. Response body indicates the missing scope name.

## External endpoints

All endpoints live under `/v1/external/ai-act`.

### `POST /v1/external/ai-act/evidence`

Required scope: `EVIDENCE_WRITE`.

Creates an evidence item against an AI system owned by the API key holder.
Returns `201 Created` with an `EvidenceItemResponse` body.

Request body (`AiActEvidenceWebhookRequest`):

| Field | Required | Notes |
| --- | --- | --- |
| `systemId` | yes | Must reference a system owned by the API key user. |
| `type` | no | One of `POLICY`, `MODEL_CARD`, `RISK_ASSESSMENT`, `LOG_SAMPLE`, `SCREENSHOT`, `PROCESS_DOCUMENT`, `OWNER_ATTESTATION`, `URL`, `SCANNER_FINDING`. |
| `title` | yes | Short title for the evidence item. |
| `description` | no | Free-text description. |
| `fileUrl` | no | URL where the evidence file is hosted. |
| `fileName` | no | Original filename for display. |
| `owner` | no | Person or team responsible for the item. |
| `status` | no | `MISSING` or `REQUESTED`. Defaults to `REQUESTED`. |
| `dueDate` | no | ISO date (`YYYY-MM-DD`). |
| `externalReferenceId` | no | Caller's idempotency key. Logged for traceability; not currently used to dedupe. |

Example request:

```http
POST /v1/external/ai-act/evidence
X-API-Key: sk_live_xxx
Content-Type: application/json

{
  "systemId": "65f0000000000000000000a1",
  "type": "POLICY",
  "title": "AI usage policy v3",
  "fileUrl": "https://docs.example.com/ai-usage.pdf",
  "fileName": "ai-usage.pdf",
  "owner": "Compliance",
  "status": "REQUESTED",
  "dueDate": "2026-09-30",
  "externalReferenceId": "ext-evt-2026-0001"
}
```

### `GET /v1/external/ai-act/systems`

Required scope: `SYSTEMS_READ`.

Returns a list of AI systems owned by the API key holder.

```http
GET /v1/external/ai-act/systems
X-API-Key: sk_live_xxx
```

## CSV import (authenticated portal)

### `POST /api/ai-act/systems/import`

Accepts `multipart/form-data` with a `file` part containing a CSV. Requires a
normal authenticated session (not an API key).

Example:

```bash
curl -X POST https://app.zenvyra.com/api/ai-act/systems/import \
  -H "Cookie: $SESSION" \
  -F "file=@systems.csv"
```

Response: `AiActImportResult`

| Field | Type | Notes |
| --- | --- | --- |
| `importedCount` | int | Number of rows successfully created. |
| `failedCount` | int | Number of rows that failed validation or creation. |
| `systems` | list | Created AI systems in row order. |
| `errors` | list | Row-level errors with `rowNumber`, `systemName`, `message`. |

### CSV format

Header row required. Column names are case-insensitive and order is flexible.
`systemName` is the only mandatory column.

| Column | Type | Notes |
| --- | --- | --- |
| `systemName` | string | required |
| `purpose` | string | |
| `provider` | string | |
| `modelName` | string | |
| `modelProviderVersion` | string | |
| `modelProviderType` | string | e.g. `third-party`, `in-house` |
| `useCase` | string | |
| `deploymentContext` | string | one of `cloud`, `on-premise`, `edge`, `saas`, `hybrid`, `mobile`, `api-only` |
| `decisionImpactLevel` | string | one of `low`, `medium`, `high`, `critical` |
| `releaseStatus` | string | one of `DRAFT`, `PILOT`, `PRODUCTION`, `RETIRED` |
| `customerFacing` | bool | `true`/`false` |
| `trainingOrFineTuning` | bool | |
| `euUsersAffected` | bool | |
| `userFacingAiInteraction` | bool | |
| `automatedDecisionMaking` | bool | |
| `humanOversight` | bool | |
| `transparencyNoticePublished` | bool | |
| `technicalDocumentationReady` | bool | |
| `riskAssessmentCompleted` | bool | |
| `logsEvidenceRetained` | bool | |
| `monitoringEnabled` | bool | |
| `humanOversightOwner` | string | |
| `dataCategoriesSentToAi` | string | comma-separated |
| `countries` | string | comma-separated |
| `lastReviewedAt` | ISO date/time | e.g. `2026-01-15T10:00:00` |
| `nextReviewAt` | ISO date/time | |

Unknown columns are ignored. Rows with an empty or missing `systemName` are
recorded as errors and skipped. Booleans accept `true`/`false` (case
insensitive), `1`/`0`, or `yes`/`no`. Quoted fields with embedded commas and
escaped double quotes (`""`) are supported.

Example CSV:

```csv
systemName,purpose,euUsersAffected,countries,deploymentContext,releaseStatus
Support Assistant,Customer support,true,"DE,FR",cloud,PRODUCTION
Risk Engine,Risk scoring,false,DE,on-premise,DRAFT
```

## Operational notes

- Scope checks run in `ApiKeyAuthenticationFilter` before the controller is
  invoked, so 403 responses do not allocate controller resources.
- Per-row import failures do not abort the import; the response always
  reports both successes and failures.
- All endpoints emit standard Spring Boot access logs and OpenTelemetry traces.
