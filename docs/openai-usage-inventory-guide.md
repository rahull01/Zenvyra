# OpenAI API Usage Inventory Integration Guide

## Overview

This document outlines the planned integration for discovering and tracking OpenAI API usage across an organization's systems and applications.

## Use Case

Organizations using OpenAI's GPT models (ChatGPT, GPT-4, etc.) need to:
- **Inventory all usage** of OpenAI APIs across applications
- **Track API keys** and their associated usage
- **Monitor cost** and token consumption
- **Identify high-risk usage** patterns
- **Link usage** to AI system classifications
- **Audit** historical usage for compliance

## Integration Approach

### 1. Authentication & Authorization

**OpenAI API Key Management:**
- Organization provides OpenAI API key(s) with organization-level permissions
- Support for multiple API keys (e.g., different teams/projects)
- API keys stored encrypted in Zenvyra database
- Read-only access required (usage statistics only, no modifications)
- Scoped to: `organization.read`, `usage.read`

**OAuth Integration (Future):**
- OpenAI OAuth for SaaS integration
- App authorization flow with user consent
- Automatic token refresh

### 2. Data Collection Methods

**Method 1: OpenAI Usage API**
```
GET https://api.openai.com/v1/organization/costs
Authorization: Bearer sk_org_...
```

Returns:
- Daily usage breakdown
- Cost by model
- Token consumption metrics
- User/project attribution (if available)

**Method 2: OpenAI Events/Webhooks (Future)**
- Real-time usage events
- Alert on anomalies
- Per-request attribution

**Method 3: Log Parsing**
- Download usage logs from OpenAI dashboard
- Manual CSV upload for historical data
- Rate limiting-aware imports

### 3. Data Model

**New Entity: OpenAiUsageRecord**
```
{
  id: String (UUID)
  userId: String (Zenvyra user)
  organizationId: String (Zenvyra organization, if multi-tenant)
  
  // OpenAI reference
  openaiOrganizationId: String
  openaiApiKeyId: String (last 4 chars for display)
  
  // Usage period
  date: LocalDate
  usagePeriodStart: LocalDate
  usagePeriodEnd: LocalDate
  
  // Metrics
  totalTokensUsed: Long
  totalTokensPrompt: Long
  totalTokensCompletion: Long
  
  // Cost
  totalCostUsd: BigDecimal
  estimatedMonthlyCostUsd: BigDecimal
  
  // Model breakdown
  modelBreakdown: Map<String, ModelUsageMetrics>
  {
    "gpt-4": {
      tokensUsed: 1_000_000,
      costUsd: 15.50,
      requestCount: 250
    },
    "gpt-3.5-turbo": {
      tokensUsed: 5_000_000,
      costUsd: 2.50,
      requestCount: 1500
    }
  }
  
  // Metadata
  syncedAt: LocalDateTime
  nextSyncAt: LocalDateTime
  syncStatus: Enum (SUCCESS, FAILED, PARTIAL)
  
  // Linking
  linkedAiSystemIds: List<String>
}
```

**New Entity: OpenAiApiKeyTracking**
```
{
  id: String (UUID)
  userId: String
  organizationId: String
  
  // Identification
  apiKeyDisplay: String (last 4 chars only: "sk_...7f8a")
  apiKeyHash: String (SHA-256)
  
  // OpenAI Reference
  openaiOrganizationId: String
  openaiProjectId: String (if available)
  
  // Usage tracking
  totalTokensAllTime: Long
  totalCostAllTime: BigDecimal
  lastUsedAt: LocalDateTime
  activeSinceDays: Integer
  
  // Alerts
  monthlyAlertThresholdUsd: BigDecimal
  alertOnNewModel: Boolean
  
  // Status
  isActive: Boolean
  createdAt: LocalDateTime
  rotatedAt: LocalDateTime (if rotated)
}
```

### 4. Integration Points

**Endpoint: Connect OpenAI Account**
```
POST /api/ai-act/integrations/openai/connect
{
  organizationApiKey: String (sk_org_...)
  apiKeyNickname: String (optional, e.g., "Production", "Testing")
  syncHistoricalData: Boolean (last 90 days)
  alertThresholdUsd: BigDecimal (optional)
}

Returns:
{
  apiKeyId: String
  organizationId: String
  connectedAt: LocalDateTime
  historicalDataSyncedFrom: LocalDate
  totalUsageFound: Long
  estimatedMonthlyUsage: BigDecimal
}
```

**Endpoint: Get Usage Summary**
```
GET /api/ai-act/integrations/openai/usage-summary?startDate=2024-01-01&endDate=2024-01-31

Returns:
{
  period: {
    start: LocalDate,
    end: LocalDate
  },
  totalTokensUsed: Long,
  totalCostUsd: BigDecimal,
  modelBreakdown: [
    {
      model: "gpt-4",
      tokensUsed: 1_000_000,
      costUsd: 15.50,
      percentage: 24.5
    }
  ],
  topApplications: [
    {
      applicationName: "Customer Support Bot",
      estimatedTokens: 2_000_000,
      linkedAiSystem: String (UUID)
    }
  ],
  anomalies: [
    {
      date: LocalDate,
      usageIncrease: 150,
      costIncrease: 45.00,
      recommendation: String
    }
  ]
}
```

**Endpoint: Sync Usage Data**
```
POST /api/ai-act/integrations/openai/sync

Returns:
{
  recordsCreated: Integer,
  recordsUpdated: Integer,
  periodCovered: String (e.g., "2024-01-01 to 2024-01-31"),
  totalCost: BigDecimal,
  nextSyncScheduled: LocalDateTime
}
```

**Endpoint: List Connected API Keys**
```
GET /api/ai-act/integrations/openai/api-keys

Returns:
[
  {
    id: String,
    display: "sk_...7f8a",
    organizationId: String,
    totalCostAllTime: BigDecimal,
    lastUsedAt: LocalDateTime,
    status: String (ACTIVE, ROTATED, ARCHIVED)
  }
]
```

### 5. Automated AI System Linking

**Linking Strategy:**
1. Parse OpenAI usage to identify models used (GPT-4, GPT-3.5, etc.)
2. If AI system uses OpenAI model → automatically link
3. Backfill cost and token data to existing systems
4. Update risk assessment if usage patterns identified

**New Evidence Type:**
```
EvidenceItemType.API_USAGE_LOG
{
  title: "OpenAI API Usage Report"
  description: "Automated sync from OpenAI organization metrics"
  fileUrl: "https://platform.openai.com/account/usage"
  period: "2024-01-01 to 2024-01-31"
  tokensConsumed: 1_000_000
  estimatedCost: 15.50
  status: UPLOADED
}
```

### 6. Risk Assessment Integration

**Cost-Based Risk Scoring:**
- **High-cost usage** (>$1000/month) = potential high-risk usage
- **Sudden spikes** = anomaly detection
- **Multiple models** = complex AI dependencies

**Usage Pattern Analysis:**
- **Streaming requests** = real-time decision making
- **High-volume requests** = at-scale processing
- **Custom models** = specialized usage

**Updated Readiness Score Factors:**
```
- If OpenAI usage found:
  + Mark "trainingOrFineTuning" = true (if fine-tuning endpoints used)
  + Mark "customerFacing" = true (if chat/completion endpoints)
  + Update "modelProviderVersion" with latest model
  + Add evidence of cost/token usage
  + Recalculate risk classification
```

### 7. Data Privacy & Security

**Sensitive Data Handling:**
- Never store complete API keys (only last 4 chars)
- Encrypt API keys at rest (AES-256)
- Encrypt in transit (TLS 1.2+)
- Never log API keys in debug logs
- Implement key rotation reminders

**Data Retention:**
- Keep usage data for compliance period (12+ months)
- Support data deletion on account closure
- Implement data anonymization for analytics

**Access Control:**
- Only organization owners can connect API keys
- Usage data visible to team members
- Audit log of all API access

### 8. Sync Strategy

**Scheduled Synchronization:**
- Full sync: Daily at 00:00 UTC
- Catch-up sync: Every 4 hours
- Manual sync: On-demand via API
- Backfill: First sync covers last 90 days

**Incremental Updates:**
- Track last sync timestamp
- Only fetch data since last sync
- Handle API delays (24-48 hour lag)
- Deduplicate records

**Rate Limiting:**
```
- OpenAI API: 100 requests per minute
- Zenvyra: Queue multiple organizations
- Batch process: 10 organizations per sync cycle
- Exponential backoff on errors
```

### 9. Alerting & Notifications

**Cost Alerts:**
- Threshold-based alerts (e.g., >$500/day)
- Budget exceeded warnings
- Unusual spike detection (>2 std dev)

**Usage Alerts:**
- New model detected
- High-volume requests (>100k tokens/day)
- Streaming requests from new source

**Integration Alerts:**
- Sync failures (retry up to 3 times)
- API key rotation needed
- Quota exceeded

### 10. Testing Strategy

**Unit Tests:**
- Cost calculation accuracy
- Date range handling
- Model breakdown parsing
- Anomaly detection algorithms

**Integration Tests:**
- Mock OpenAI API responses
- Multi-key synchronization
- Edge cases (partial data, delays)
- Error recovery

**E2E Tests:**
- Real OpenAI API integration (optional, with test key)
- Full sync workflow
- Evidence generation and linking

### 11. Implementation Checklist

- [ ] Create OpenAiUsageRecord and OpenAiApiKeyTracking entities
- [ ] Implement OpenAI API client wrapper
- [ ] Add cost calculation and token parsing
- [ ] Implement scheduled sync job
- [ ] Create API endpoints for connection and sync
- [ ] Add usage summary and analytics
- [ ] Implement cost alerting
- [ ] Add AI system linking logic
- [ ] Implement evidence generation
- [ ] Add encryption for API keys
- [ ] Write comprehensive tests
- [ ] Create user documentation
- [ ] Add OpenAI dashboard link
- [ ] Update API specification

## Future Enhancements

1. **Fine-Tuning Cost Tracking:**
   - Separate tracking for fine-tuning jobs
   - Training cost vs inference cost breakdown
   - Model specialization evidence

2. **Per-Request Attribution:**
   - Link requests to specific applications/services
   - Trace data flow through AI pipeline
   - Cost allocation to business units

3. **Anomaly Detection:**
   - ML-based cost spike detection
   - Behavioral change alerts
   - Automated risk notifications

4. **Budget Management:**
   - Soft/hard spending limits
   - Cost forecasting
   - Budget allocation per team

5. **Advanced Analytics:**
   - Cost trends over time
   - Model adoption patterns
   - Efficiency metrics (cost per operation)

## Questions & Decisions

1. **Fetch frequency?** (Decision: Daily full sync, 4-hour incremental updates)
2. **Multi-organization?** (Decision: Support multiple API keys per organization)
3. **Historical backfill?** (Decision: 90 days on first connect)
4. **Auto-linking?** (Decision: Automatic for OpenAI models)

## References

- OpenAI API Documentation: https://platform.openai.com/docs
- OpenAI Billing API: https://platform.openai.com/account/billing/overview
- Model Pricing: https://openai.com/pricing
