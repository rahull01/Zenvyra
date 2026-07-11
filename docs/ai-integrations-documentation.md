# AI Usage Integrations: Comprehensive Documentation

## Overview

Zenvyra's integration architecture provides automated discovery, tracking, and analysis of AI usage across your organization's technology stack. This umbrella documentation connects all integration guides and provides a unified framework for understanding your complete AI landscape.

## Integration Categories

### Category 1: Cloud Provider APIs (Direct)
**Direct consumption of cloud provider AI services**
- **OpenAI** (GPT-4, GPT-3.5, DALL-E, Embeddings)
- **Anthropic** (Claude models)
- **Google** (Gemini, VertexAI, Codey, Imagen)
- **Microsoft Azure** (Azure OpenAI Service)

**Documentation:** [Multi-Provider AI Usage Inventory Guide](multi-provider-ai-usage-inventory-guide.md)

**Key Metrics:**
- Token usage (input/output)
- Cost per model
- API call patterns
- Usage trends

**Risk Assessment:**
- High-cost usage flagged
- Anomaly detection on spikes
- Model version tracking
- Unauthorized provider detection

---

### Category 2: Higher-Level Frameworks
**AI frameworks that abstract provider APIs**
- **LangChain** (Python/JavaScript orchestration)
- **LangSmith** (LangChain monitoring & observability)
- **Vercel AI SDK** (TypeScript/Next.js integration)
- **LlamaIndex** (Retrieval-Augmented Generation)

**Documentation:** [AI Framework & SDK Integration Guide](ai-framework-sdk-integration-guide.md)

**Key Metrics:**
- Application/chain-level metrics
- End-to-end latency
- Tool usage patterns
- Error rates and failure modes

**Risk Assessment:**
- Prompt injection vulnerabilities
- RAG hallucination tracking
- Tool misuse detection
- Cascade failure analysis

---

### Category 3: Code Repository Dependencies
**AI packages and models detected in code**
- **GitHub** (dependency scanning, model detection)
- **PyPI/NPM packages** (LangChain, OpenAI SDK, Anthropic SDK)
- **Model downloads** (HuggingFace, ONNX registries)
- **Local deployments** (LLaMA, Mistral, other open-source)

**Documentation:** [GitHub Repo Scanner Integration Guide](github-repo-scanner-integration-guide.md)

**Key Metrics:**
- Dependency versions
- License compliance
- Security vulnerabilities
- Model package signatures

**Risk Assessment:**
- Outdated/vulnerable dependencies
- Unlicensed models
- Supply chain risks
- Local model version tracking

---

### Category 4: SaaS Platform AI Features
**AI bots and assistants in communication/service platforms**
- **Slack** (ChatGPT, Claude bots, custom automations)
- **Intercom** (AI Copilot, custom agents, automations)
- **Discord** (Community AI bots)
- **Microsoft Teams** (Teams AI apps)

**Documentation:** [SaaS AI Bot Discovery Integration Guide](saas-ai-bot-discovery-integration-guide.md)

**Key Metrics:**
- Bot activity and interactions
- User engagement patterns
- Resolution rates
- Customer satisfaction scores

**Risk Assessment:**
- Customer-facing AI detection
- Unauthorized bot discovery
- Data exposure in conversations
- Cost per interaction

---

## Unified Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   ZENVYRA CORE                              │
│            (AI Act Readiness Platform)                      │
│                                                              │
│  • AI System Inventory                                      │
│  • Evidence Management                                      │
│  • Risk Assessment                                          │
│  • Audit Trails                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬─────────────┐
        │            │            │             │
        ▼            ▼            ▼             ▼
   ┌────────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐
   │  Provider  │ │Framework│ │Repository│ │  SaaS  │
   │   APIs     │ │Tracking │ │Scanning  │ │ Bots   │
   │            │ │         │ │          │ │        │
   │ OpenAI     │ │LangSmith│ │GitHub    │ │Slack   │
   │Anthropic   │ │LangChain│ │PyPI      │ │Intercom│
   │Google      │ │Vercel AI│ │HuggingFace│ │Discord│
   │Azure       │ │LlamaIndex│           │ │Teams   │
   └────┬───────┘ └────┬────┘ └─────┬────┘ └───┬────┘
        │              │           │          │
        └──────────────┴───────────┴──────────┘
                      │
        ┌─────────────▼──────────────┐
        │   INTEGRATION LAYER        │
        │                            │
        │ • Authentication           │
        │ • Data Normalization       │
        │ • Conflict Resolution      │
        │ • Deduplication            │
        │ • Rate Limiting            │
        │ • Error Handling           │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │  UNIFIED DATA MODEL        │
        │                            │
        │ • AiSystemInventory        │
        │ • ProviderUsageMetrics     │
        │ • EvidenceItem             │
        │ • AiActAuditLog            │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │  ANALYTICS & ASSESSMENT    │
        │                            │
        │ • Risk Scoring             │
        │ • Cost Aggregation         │
        │ • Anomaly Detection        │
        │ • Compliance Mapping       │
        │ • Dashboard Visualization  │
        └────────────────────────────┘
```

---

## Data Normalization Pipeline

### Input Heterogeneity

Each integration provides different data formats:
- **Provider APIs:** Token usage, cost, model names, timestamps
- **Frameworks:** Chain/run identifiers, latency, tool usage, metadata
- **Repository:** Package versions, dependency graphs, file locations
- **SaaS Bots:** Interaction counts, user IDs, platform-specific metrics

### Normalization Steps

1. **Provider Abstraction**
   - Map provider-specific models to unified taxonomy
   - Convert cost to USD using current exchange rates
   - Standardize timestamps (UTC, ISO 8601)

2. **Deduplication**
   - Same API usage tracked by multiple integrations
   - Example: OpenAI usage via both direct API and Vercel AI SDK
   - Resolution: Use canonical entry, link alternatives

3. **Enrichment**
   - Combine repository dependency data with API usage
   - Link SaaS bots to identified systems
   - Cross-reference to compliance obligations

4. **Aggregation**
   - Roll up daily metrics to weekly/monthly views
   - Combine multiple providers into unified cost
   - Generate system-level summaries

---

## Integration Sync Strategy

### Scheduling Model

**Provider APIs (Daily Sync)**
```
OpenAI:        00:00 UTC
Anthropic:     04:00 UTC (staggered)
Google:        08:00 UTC
Azure:         12:00 UTC
```
- Rationale: Billing systems update daily; avoid API conflicts

**Frameworks (Continuous/Hourly)**
```
LangSmith:     Every 6 hours
Vercel AI:     Every 12 hours (batch processed)
LlamaIndex:    On-demand (lightweight)
```
- Rationale: Finer granularity useful for performance analysis

**Repository Scanning (Daily)**
```
GitHub:        01:00 UTC
Dependencies:  01:30 UTC (after repo scan)
```
- Rationale: Code rarely changes frequently

**SaaS Bots (Daily)**
```
Slack:         02:00 UTC
Intercom:      06:00 UTC
Discord:       10:00 UTC
Teams:         14:00 UTC
```
- Rationale: Activity patterns change daily

### Incremental vs Full Sync

**Full Sync** (Monthly, first of month)
- Re-scan all integrations
- Reconcile all records
- Fix deduplication issues

**Incremental Sync** (Daily/Hourly)
- Fetch only new/changed data
- Update aggregates
- Flag anomalies

---

## Duplicate Detection & Resolution

### Scenarios

**Scenario 1: Double Counting via Multiple Channels**
```
Issue:
- OpenAI API call detected via direct API integration
- Same call detected via Vercel AI SDK integration

Resolution:
- Keep canonical record from provider API
- Mark SDK record as "superceded"
- Deduplicate in analytics
```

**Scenario 2: Cost Reconciliation**
```
Issue:
- Provider reports $100 daily cost
- Aggregated API calls calculate $95 cost

Resolution:
- Use provider-reported cost as canonical
- Flag as "reconciled" if within 5% threshold
- Investigate if >5% variance
```

**Scenario 3: Model Version Mismatch**
```
Issue:
- Repository shows gpt-4 dependency
- API usage shows gpt-4-turbo was actually used

Resolution:
- Use actual API usage (ground truth)
- Flag repository dependency as "stale"
- Recommend update
```

### Deduplication Algorithm

```
For each new usage record:
1. Hash key: (provider, model, timestamp_date, systemId)
2. Check if hash exists in recent (last 7 days)
3. If found:
   - Compare metrics (within 10% tolerance?)
   - If match: mark as duplicate, use canonical
   - If different: investigate, may be separate usage
4. If not found: insert as new record
5. Update daily aggregates
```

---

## Cross-Integration Linking

### System-Level Linking

**Direct Detection:**
```
Algorithm:
1. Scan all integrations for system name patterns
2. Match against AI System Inventory
3. If confidence > 80%: Auto-link
4. If 50-80% confidence: Suggest to user
5. If < 50%: Manual review queue
```

**Example Patterns:**
- Repository name "customer-support-bot" → System named "Customer Support"
- Slack bot "ChatGPT Support" → System with tag "support"
- Intercom agent "FAQ Assistant" → System of type "Assistant"

### Provider Linking

**Cross-Provider Analysis:**
```
If:
  - Repository detects OpenAI dependency
  - API integration shows GPT-4 usage
  - Framework shows LangChain + GPT-4
THEN:
  - Single evidence item aggregating all signals
  - Multiple data points strengthen classification
```

### Evidence Consolidation

**Single AI System → Multiple Integrations:**
```
Example: Internal Chatbot

Evidence Items:
1. GitHub: Found openai ^0.27.0 in requirements.txt
2. OpenAI API: GPT-4 usage $50/month detected
3. LangSmith: 5,000 runs/day in "chatbot-api" project
4. Slack: ChatGPT bot "internal-support" with 1,000 interactions/day
5. Intercom: (not using, but evidence record created for absence)

Consolidated View:
- System: Internal Chatbot
- Primary Model: GPT-4
- Architecture: LangChain (Python) → OpenAI API
- Integrations: Slack (1K daily), Intercom (not yet)
- Monthly Cost: $50
- Risk Level: Medium (internal-facing, moderate volume)
- Audit Trail: Linked to all 5 evidence items
```

---

## Cost Aggregation & Reporting

### Cost Model

**Provider-Native Costs:**
- Direct API: Use provider billing
- Framework: Calculate from token counts
- Repository: Zero cost (deployment cost separate)
- SaaS Bots: Extract from platform bills or estimate

**Example Calculation:**
```
OpenAI GPT-4:
- Input: $0.03 per 1K tokens
- Output: $0.06 per 1K tokens
- If 1M input + 500K output tokens:
  Cost = (1M * 0.03 / 1000) + (500K * 0.06 / 1000)
       = $30 + $30 = $60

Anthropic Claude:
- Input: $0.003 per 1K tokens
- Output: $0.015 per 1K tokens
- (Same usage pattern: $6 total)
```

### Multi-Tenant Attribution

**By Organization:**
```
If organization = Acme Corp:
- All Acme systems' AI usage aggregated
- Separate from other organizations
```

**By Department (Future):**
```
If department tracking available:
- Finance: $500/month (OpenAI)
- Engineering: $2000/month (mixed)
- Sales: $300/month (Slack bots)
```

**By System:**
```
Customer Support Bot:
  - Direct API: $50
  - LangSmith: $5 (monitoring)
  - Slack integration: $2 (if charged)
  - Total: $57/month
```

### Reporting Endpoints

**Endpoint: Cost Breakdown**
```
GET /api/ai-act/integrations/cost-analysis?period=monthly

Returns:
{
  period: "2024-01",
  totalCostUsd: 5000,
  byProvider: {
    openai: 3000,
    anthropic: 1500,
    google: 300,
    azure: 200
  },
  byCategory: {
    provider_apis: 4000,
    frameworks: 500,
    saas_bots: 500
  },
  bySystem: [
    {
      systemId: "...",
      systemName: "Customer Support Bot",
      cost: 1500,
      providers: ["openai"],
      trends: { monthOverMonth: -5 }
    }
  ],
  anomalies: [
    {
      date: "2024-01-15",
      system: "Research Assistant",
      cost: 500,
      increase: 300,
      recommendation: "Investigate spike"
    }
  ]
}
```

---

## Anomaly Detection

### Detectable Patterns

1. **Cost Spikes**
   - Daily cost > mean + 2σ
   - Weekly trend change > 50%
   - New provider detected

2. **Usage Anomalies**
   - API call rate spike
   - New model introduction
   - Unusual time-of-day patterns

3. **Bot Activity**
   - New Slack bot deployment
   - Increased Intercom agent usage
   - Discord bot becoming more active

4. **Dependency Issues**
   - Outdated model package
   - Security vulnerability detected
   - Deprecated API version

### Response Workflow

```
Anomaly Detected
    ↓
Classify Severity (Low/Medium/High)
    ↓
Send Alert to:
  - Organization admin (always)
  - System owner (if known)
  - Compliance team (if high-risk)
    ↓
Auto-create Investigation Task:
  - Link to anomaly
  - Suggest investigation steps
  - Set follow-up date
    ↓
Resolution:
  - Mark as reviewed
  - Document explanation
  - Adjust thresholds if needed
```

---

## Security & Privacy Guardrails

### Secrets Management

**Credential Storage:**
- All integration credentials encrypted at rest (AES-256)
- In-transit TLS 1.3 only
- Rotation reminders (every 90 days)
- Audit log on every access

**Supported Integrations:**
```
✓ OpenAI: API key (sk_org_...)
✓ Anthropic: API key
✓ Google Cloud: Service account JSON
✓ Azure: Service principal
✓ Slack: OAuth token (xoxb-...)
✓ Intercom: API token
✓ GitHub: Personal access token
```

### Data Privacy

**What We DON'T Store:**
- User prompts or conversations
- Personal data from SaaS platforms
- Sensitive documents or files
- Raw request/response bodies

**What We DO Store:**
- Aggregated metrics (tokens, cost, counts)
- Metadata (model names, timestamps, system IDs)
- Configuration settings
- Audit trail (who accessed, when)

**Compliance:**
- GDPR: Support data deletion, export
- HIPAA: Available for healthcare organizations
- SOC 2: Third-party audit in progress

---

## Risk Assessment Framework

### Integration-Specific Risks

**Provider APIs:**
- Cost explosion (runaway usage)
- Model drift (behavior changes)
- Rate limiting (service disruption)
- Provider deprecation (migration required)

**Frameworks:**
- Prompt injection (via user input)
- Hallucinations (inaccurate outputs)
- Latency (slow chains)
- Tool misuse (wrong decision)

**Repository:**
- Vulnerable dependencies
- Outdated models
- License violations
- Supply chain attacks

**SaaS Bots:**
- Unauthorized access (shared credentials)
- Customer data exposure
- Rogue bots
- Costly API overages

### Unified Risk Scoring

```
Risk Score = (
  (CostFactor * 0.2) +
  (UsageFactor * 0.2) +
  (NoveltyFactor * 0.2) +
  (DataSensitivityFactor * 0.2) +
  (VulnerabilityFactor * 0.2)
)

Where:
- CostFactor: Cost vs budget (0-1)
- UsageFactor: Usage volume (0-1)
- NoveltyFactor: Days since first seen (0-1, newer = higher)
- DataSensitivityFactor: PII/sensitive data involvement (0-1)
- VulnerabilityFactor: Known vulnerabilities (0-1)

Final Risk = Low (<0.3) | Medium (0.3-0.7) | High (>0.7)
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Implement unified data model
- [ ] Create integration authentication framework
- [ ] Build sync scheduling system
- [ ] Implement deduplication logic
- [ ] Set up monitoring/alerting

### Phase 2: Provider APIs (Week 3-4)
- [ ] OpenAI API integration
- [ ] Anthropic API integration
- [ ] Google Cloud integration
- [ ] Azure integration
- [ ] Cost aggregation

### Phase 3: Frameworks (Week 5-6)
- [ ] LangSmith integration
- [ ] Vercel AI SDK integration
- [ ] LlamaIndex integration
- [ ] Cross-framework linking

### Phase 4: Repository Scanning (Week 7-8)
- [ ] GitHub integration
- [ ] Dependency detection
- [ ] Model tracking
- [ ] Vulnerability scanning

### Phase 5: SaaS Bots (Week 9-10)
- [ ] Slack integration
- [ ] Intercom integration
- [ ] Discord integration
- [ ] Teams integration

### Phase 6: Analytics & Dashboard (Week 11-12)
- [ ] Cost analytics dashboard
- [ ] Usage trends visualization
- [ ] Anomaly detection dashboard
- [ ] System-level linking UI
- [ ] Evidence aggregation view

### Phase 7: Compliance & Risk (Week 13+)
- [ ] Risk scoring engine
- [ ] Compliance gap analysis
- [ ] Audit trail generation
- [ ] Remediation workflows
- [ ] Certification export

---

## API Reference Summary

### Authentication Endpoints
- `POST /api/ai-act/integrations/{platform}/connect`
- `GET /api/ai-act/integrations/{platform}/status`
- `DELETE /api/ai-act/integrations/{platform}/disconnect`

### Data Retrieval Endpoints
- `GET /api/ai-act/integrations/{platform}/summary`
- `GET /api/ai-act/integrations/{platform}/usage?startDate=...&endDate=...`
- `GET /api/ai-act/integrations/{platform}/{resourceId}/details`

### Sync Endpoints
- `POST /api/ai-act/integrations/{platform}/sync`
- `POST /api/ai-act/integrations/sync-all`
- `GET /api/ai-act/integrations/sync-status`

### Analytics Endpoints
- `GET /api/ai-act/integrations/cost-analysis`
- `GET /api/ai-act/integrations/usage-dashboard`
- `GET /api/ai-act/integrations/anomalies`
- `GET /api/ai-act/integrations/linking-suggestions`

### Admin Endpoints
- `GET /api/ai-act/integrations/health`
- `POST /api/ai-act/integrations/test-connection`
- `GET /api/ai-act/integrations/sync-logs`

---

## Troubleshooting Guide

### Common Issues

**Issue: API Key Not Accepted**
- Verify correct key format (provider-specific)
- Check expiration date
- Confirm scope/permissions
- Test directly with provider API

**Issue: Zero Usage Detected**
- Allow 24-48 hours for initial sync
- Verify system actually uses that provider
- Check rate limiting hasn't been hit
- Review authentication logs

**Issue: Duplicate Records**
- Confirm deduplication is enabled
- Review deduplication thresholds
- Check for time zone issues
- Contact support if pattern persists

**Issue: Cost Mismatch**
- Compare to provider's own billing
- Account for previous month's usage
- Check for currency conversion issues
- Verify model pricing hasn't changed

---

## Future Roadmap

- [ ] Real-time streaming integrations
- [ ] ML-based cost forecasting
- [ ] Automatic budget allocation
- [ ] Fine-tuning cost tracking
- [ ] Custom model deployments
- [ ] Federated learning detection
- [ ] Autonomous agent tracking
- [ ] Multi-modal usage aggregation

---

## Contact & Support

**Documentation Issues:**
- File issue on GitHub
- Email: integration-docs@zenvyra.ai

**Integration Support:**
- Integration-specific chat support
- Email: integrations@zenvyra.ai

**Security Concerns:**
- Email: security@zenvyra.ai

## See Also

- [Multi-Provider AI Usage Inventory Guide](multi-provider-ai-usage-inventory-guide.md)
- [AI Framework & SDK Integration Guide](ai-framework-sdk-integration-guide.md)
- [GitHub Repo Scanner Integration Guide](github-repo-scanner-integration-guide.md)
- [SaaS AI Bot Discovery Integration Guide](saas-ai-bot-discovery-integration-guide.md)
