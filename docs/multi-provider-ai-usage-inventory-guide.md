# Multi-Provider AI Model Usage Inventory Guide

## Overview

This document outlines the planned integration for discovering and tracking AI model usage across multiple providers: Anthropic (Claude), Google (Gemini/VertexAI), and Microsoft Azure OpenAI.

## Support Strategy

### Provider Priority Roadmap

1. **Anthropic Claude** (Priority 1)
   - Direct API access via Anthropic Console
   - Usage tracking via Anthropic API
   - Similar to OpenAI implementation

2. **Google Gemini/VertexAI** (Priority 2)
   - Google Cloud integration
   - OAuth via Google Cloud Console
   - Usage via Google Cloud Billing API

3. **Microsoft Azure OpenAI** (Priority 3)
   - Azure subscription integration
   - Azure Portal metrics
   - Consumption tracking via Azure Billing

4. **Mistral, Cohere, LLaMA** (Future)
   - Vendor API available
   - Community models via HuggingFace
   - Open-source deployments

## Anthropic Claude Integration

### 1. Authentication

**Anthropic Console API Integration:**
- User provides Anthropic API key (anthropic-api-key-...)
- API key stored encrypted
- Support for organization-level API keys
- Read-only access: `read:usage`, `read:organization`

### 2. Data Collection

**Anthropic Usage API:**
```
GET https://api.anthropic.com/v1/usage
Authorization: Bearer anthropic-api-key-...

Response:
{
  "usage": {
    "date": "2024-01-15",
    "input_tokens": 1_000_000,
    "output_tokens": 500_000,
    "cost": {
      "input_usd": 3.00,
      "output_usd": 1.50,
      "total_usd": 4.50
    },
    "models": {
      "claude-3-opus": {
        "input_tokens": 600_000,
        "output_tokens": 300_000
      },
      "claude-3-sonnet": {
        "input_tokens": 400_000,
        "output_tokens": 200_000
      }
    }
  }
}
```

### 3. Data Model

**AnthropicUsageRecord:**
```
{
  id: UUID,
  organizationId: String,
  date: LocalDate,
  
  // Metrics
  inputTokens: Long,
  outputTokens: Long,
  totalCostUsd: BigDecimal,
  
  // Model breakdown
  modelBreakdown: Map<String, ModelMetrics>,
  
  // Metadata
  syncedAt: LocalDateTime,
  syncStatus: ENUM(SUCCESS, FAILED, PARTIAL)
}
```

### 4. Integration Endpoints

```
POST /api/ai-act/integrations/anthropic/connect
GET  /api/ai-act/integrations/anthropic/usage-summary
POST /api/ai-act/integrations/anthropic/sync
```

### 5. Risk Mapping

- **claude-opus** (high cost) = Higher risk classification
- **claude-sonnet** (moderate) = Medium risk
- High token volume = potential automated decision-making

---

## Google Gemini/VertexAI Integration

### 1. Authentication

**Google Cloud OAuth:**
```
OAuth Scopes:
- cloud-platform (read-only for metrics)
- compute.readonly
- billing.readonly
```

**Setup Flow:**
1. User connects Google Cloud project
2. OAuth grant for service account
3. Enable Vertex AI and Billing APIs
4. Store service account credentials encrypted

### 2. Data Collection

**VertexAI Metrics via Google Cloud Monitoring:**

```
get_timeseries({
  metric: "aiplatform.googleapis.com/prediction/online_prediction_count",
  filters: {
    resource.type: "aiplatform.googleapis.com/Model",
    metric.model_id: [...models...]
  }
})

get_timeseries({
  metric: "serviceruntime.googleapis.com/api/consumer/quota_used_count",
  filters: {
    metric.service: "generativelanguage.googleapis.com"
  }
})
```

**Google Cloud Billing API:**
```
GET https://www.googleapis.com/cloudbilling/v1/projects/{projectId}/billingInfo

Returns:
{
  billingAccountName: "billingAccounts/...",
  projectId: "...",
  billingEnabled: true
}

// Get costs
GET https://www.googleapis.com/cloudbilling/v1/billingAccounts/{accountId}/costs

Returns:
{
  costs: [
    {
      date: "2024-01-15",
      service: "Vertex AI",
      amount_usd: 25.50,
      models: [...]
    }
  ]
}
```

### 3. Data Model

**GeminiVertexAiUsageRecord:**
```
{
  id: UUID,
  organizationId: String,
  googleProjectId: String,
  
  date: LocalDate,
  
  // Metrics
  predictionRequests: Long,
  tokensGenerated: Long,
  
  // Services breakdown
  services: Map<String, ServiceMetrics> {
    "generativelanguage-api": {
      requestCount: 10_000,
      costUsd: 12.50
    },
    "vertex-ai-predictions": {
      requestCount: 5_000,
      costUsd: 8.00
    }
  },
  
  // Cost
  totalCostUsd: BigDecimal,
  
  // Metadata
  syncedAt: LocalDateTime
}
```

### 4. Models Tracked

- **Gemini Pro** (via generativelanguage API)
- **Gemini Pro Vision**
- **PaLM 2** (legacy, if still in use)
- **Custom Tuned Models** (VertexAI)
- **Imagen** (image generation)
- **Codey** (code generation)

### 5. Integration Endpoints

```
POST /api/ai-act/integrations/google/connect
GET  /api/ai-act/integrations/google/usage-summary
POST /api/ai-act/integrations/google/sync
```

---

## Microsoft Azure OpenAI Integration

### 1. Authentication

**Azure AD OAuth:**
```
OAuth Scopes:
- https://management.azure.com/.default (read-only)
```

**Setup Flow:**
1. User logs in via Azure AD
2. Select Azure subscription
3. Grant Zenvyra service principal read permissions
4. Enable Azure OpenAI resource visibility

### 2. Data Collection

**Azure Monitor Metrics:**
```
GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.CognitiveServices/accounts/{resourceName}/providers/Microsoft.Insights/metrics

Metrics:
- Tokens_sent
- Tokens_received  
- Inference_time
- Deployment_usage_percent
- Total_requests
```

**Azure Billing API:**
```
GET /subscriptions/{subscriptionId}/providers/Microsoft.Consumption/usageDetails

Returns:
[
  {
    name: "...",
    type: "Microsoft.Consumption/usageDetails",
    properties: {
      date: "20240115",
      meteredServiceName: "Azure OpenAI Service",
      meterSubCategory: "GPT-4 Tokens",
      quantity: 1000000,
      cost: 15.50,
      ...
    }
  }
]
```

### 3. Data Model

**AzureOpenAiUsageRecord:**
```
{
  id: UUID,
  organizationId: String,
  azureSubscriptionId: String,
  azureResourceName: String,
  
  date: LocalDate,
  
  // Metrics per deployment
  deploymentMetrics: Map<String, AzureDeploymentMetrics> {
    "gpt-4-deployment": {
      tokensSent: 1_000_000,
      tokensReceived: 500_000,
      totalRequests: 250,
      costUsd: 15.50
    },
    "gpt-35-turbo-deployment": {
      tokensSent: 2_000_000,
      tokensReceived: 1_000_000,
      totalRequests: 500,
      costUsd: 3.00
    }
  },
  
  // Total
  totalTokens: Long,
  totalCostUsd: BigDecimal,
  
  // Metadata
  syncedAt: LocalDateTime
}
```

### 4. Models Tracked

- **GPT-4**
- **GPT-4 Turbo**
- **GPT-3.5 Turbo**
- **DALL-E 3** (image generation)
- **Embeddings models**

### 5. Integration Endpoints

```
POST /api/ai-act/integrations/azure/connect
GET  /api/ai-act/integrations/azure/usage-summary
POST /api/ai-act/integrations/azure/sync
```

---

## Unified Data Model

**ProviderAgnosticAiUsageMetrics:**
```
{
  id: UUID,
  organizationId: String,
  
  // Provider identification
  provider: ENUM(OPENAI, ANTHROPIC, GOOGLE, AZURE, OTHER),
  providerOrganizationId: String,
  providerResourceId: String,
  
  // Time period
  date: LocalDate,
  period: ENUM(DAILY, WEEKLY, MONTHLY),
  
  // Normalized metrics
  totalInputTokens: Long,
  totalOutputTokens: Long,
  totalRequests: Long,
  
  // Cost (normalized to USD)
  totalCostUsd: BigDecimal,
  estimatedMonthlyCostUsd: BigDecimal,
  
  // Models used
  modelsUsed: List<String>,
  primaryModel: String,
  
  // Metadata
  lastSync: LocalDateTime,
  nextSync: LocalDateTime,
  syncStatus: ENUM(SUCCESS, FAILED, PENDING),
  
  // Linking
  linkedAiSystemIds: List<String>
}
```

---

## Aggregated Analytics API

**Endpoint: Get Multi-Provider Usage Dashboard**
```
GET /api/ai-act/integrations/usage-dashboard?startDate=2024-01-01&endDate=2024-01-31

Returns:
{
  period: { start, end },
  totalCostUsd: 1000.50,
  costByProvider: {
    openai: 500.00,
    anthropic: 300.00,
    google: 150.00,
    azure: 50.50
  },
  costByModel: {
    "gpt-4": 400.00,
    "claude-3-opus": 250.00,
    "gemini-pro": 100.00
  },
  topAiSystems: [
    {
      systemId: "...",
      systemName: "Customer Support",
      providers: ["openai", "anthropic"],
      totalCost: 350.00
    }
  ],
  riskSummary: {
    highRiskSystems: 3,
    newProviderDetected: false,
    costAnomalies: [...]
  }
}
```

---

## Cross-Provider Risk Assessment

**Multi-Provider Scoring:**
```
Risk Score Factors:
1. Total monthly cost across all providers
2. Number of different models in use
3. Novelty of model (recently released)
4. Data category sensitivity (handled by AI)
5. Geographic data transfer (if applicable)

Final Risk = Weighted sum of factors
```

**Evidence Generation:**
```
EvidenceItemType.API_USAGE_LOG
- Title: "{Provider} API Usage Report"
- Period: YYYY-MM to YYYY-MM
- Models: [list of models]
- Cost: $XXX.XX
- Status: UPLOADED
```

---

## Implementation Roadmap

### Phase 1: Anthropic (Week 1-2)
- [ ] Anthropic auth and API wrapper
- [ ] Usage data collection
- [ ] Evidence generation
- [ ] Testing

### Phase 2: Google (Week 3-4)
- [ ] Google OAuth setup
- [ ] Cloud Monitoring integration
- [ ] Billing API integration
- [ ] Testing

### Phase 3: Azure (Week 5-6)
- [ ] Azure AD integration
- [ ] Azure Monitor setup
- [ ] Billing API integration
- [ ] Testing

### Phase 4: Aggregation (Week 7+)
- [ ] Unified data model
- [ ] Cross-provider analytics
- [ ] Multi-provider risk scoring
- [ ] Dashboard implementation

---

## Security Considerations

**Multi-Provider Token Management:**
- Encrypt all provider credentials (AES-256)
- Implement credential rotation alerts
- Support for multiple credentials per provider
- Audit trail for all credential access

**Data Privacy:**
- No storage of actual API responses (only aggregated metrics)
- Sanitize provider organization IDs in logs
- Support GDPR data deletion
- PII detection in usage logs

**Access Control:**
- Organization admin only for credential management
- Team members can view aggregated usage
- Separate audit logs per provider

---

## Testing Strategy

**Unit Tests:**
- Cost calculation across providers
- Token normalization
- Date range handling
- Model mapping

**Integration Tests:**
- Mock API responses per provider
- Sync workflow testing
- Error recovery
- Rate limiting

**E2E Tests:**
- Real provider integration (with test keys)
- Multi-provider simultaneous sync
- Aggregate dashboard accuracy

---

## Questions & Decisions

1. **Sync frequency per provider?** (Proposal: Daily, staggered to avoid conflicts)
2. **Historical backfill?** (Proposal: 90 days for each provider)
3. **Cost normalization?** (Proposal: Per-provider native currency → USD)
4. **Model taxonomy?** (Proposal: Maintain provider-specific names + normalized category)

## References

- Anthropic Console: https://console.anthropic.com
- Google Cloud Console: https://console.cloud.google.com
- Azure Portal: https://portal.azure.com
- OpenAI Platform: https://platform.openai.com
