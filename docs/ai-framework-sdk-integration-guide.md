# AI Framework & SDK Integration Planning Guide

## Overview

This document outlines the planned integration for discovering and tracking AI framework usage through higher-level abstraction layers like LangSmith (LangChain monitoring), Vercel AI SDK, LlamaIndex, and other AI orchestration frameworks.

## Integration Rationale

Organizations often use AI frameworks rather than direct provider APIs to:
- Simplify integration complexity
- Handle prompt management
- Chain multiple models
- Cache responses
- Implement retrieval-augmented generation (RAG)
- Monitor and debug AI workflows

Zenvyra needs visibility into these higher-level integrations to understand the complete AI landscape.

---

## LangSmith Integration

### 1. Overview

LangSmith is LangChain's monitoring and debugging platform for LLM applications.

**Supported Frameworks:**
- LangChain (Python, JavaScript)
- LangServe (serving LangChain apps)
- LangGraph (agent orchestration)

### 2. Data Collection

**Authentication:**
```
LangSmith API Key (via LangSmith dashboard)
Endpoint: https://api.smith.langchain.com

OAuth Alternative:
- LangChain Cloud account
- Service-level API access
```

**LangSmith API Endpoints:**

```
// Get organization data
GET /api/v1/organization

// Get projects
GET /api/v1/organization/{organizationId}/projects

// Get runs/traces
GET /api/v1/projects/{projectId}/runs
?start_time=2024-01-01T00:00:00Z
&end_time=2024-01-31T23:59:59Z
&limit=1000

// Get feedback
GET /api/v1/projects/{projectId}/feedback
```

**Run Data Structure:**
```
{
  id: "run-...",
  name: "chat-summary",
  runType: "chain|llm|tool|retriever",
  startTime: "2024-01-15T10:30:00Z",
  endTime: "2024-01-15T10:30:05Z",
  
  // Input/Output
  inputs: { query: "...", context: "..." },
  outputs: { result: "..." },
  
  // Model info
  llmCalls: [
    {
      model: "gpt-4",
      provider: "openai",
      tokenUsage: { prompt: 500, completion: 250 },
      cost: 0.015
    }
  ],
  
  // Metadata
  metadata: { userId: "...", sessionId: "..." },
  tags: ["production", "customer-support"],
  feedbackScores: { thumbsUp: true, rating: 5 },
  
  // Errors
  error: null,
  serializedError: null
}
```

### 3. Data Model

**LangSmithRunRecord:**
```
{
  id: UUID,
  organizationId: String,
  
  // LangSmith reference
  langSmithRunId: String,
  langSmithProjectId: String,
  langSmithProjectName: String,
  
  // Execution details
  startTime: LocalDateTime,
  endTime: LocalDateTime,
  duration: Duration,
  
  // Chain/App identification
  runType: ENUM(CHAIN, LLM, TOOL, RETRIEVER, AGENT),
  runName: String,
  
  // LLM usage (aggregated from nested calls)
  modelsUsed: List<String>,
  totalInputTokens: Long,
  totalOutputTokens: Long,
  estimatedCostUsd: BigDecimal,
  
  // Quality metrics
  succeeded: Boolean,
  feedbackProvided: Boolean,
  feedbackScore: Float (0.0-1.0),
  
  // User context
  userId: String,
  sessionId: String,
  customTags: List<String>,
  
  // Metadata
  syncedAt: LocalDateTime,
  linkedAiSystemIds: List<String>
}
```

**LangSmithProjectMapping:**
```
{
  id: UUID,
  organizationId: String,
  
  langSmithProjectId: String,
  langSmithProjectName: String,
  
  // Link to Zenvyra AI System
  linkedAiSystemId: String (optional),
  
  // Classification
  projectType: ENUM(CHATBOT, RAG, AGENT, TOOL, CHAIN),
  environment: ENUM(DEVELOPMENT, STAGING, PRODUCTION),
  
  // Stats
  totalRuns: Long,
  successRate: Float,
  averageCostPerRun: BigDecimal,
  
  lastSyncedAt: LocalDateTime
}
```

### 4. Integration Endpoints

**Endpoint: Connect LangSmith**
```
POST /api/ai-act/integrations/langsmith/connect
{
  apiKey: String (sk-...)
  apiUrl: String (optional, https://api.smith.langchain.com)
}

Returns:
{
  organizationId: String,
  projectsFound: Integer,
  totalRunsAvailable: Long,
  setupLink: String
}
```

**Endpoint: List LangSmith Projects**
```
GET /api/ai-act/integrations/langsmith/projects

Returns:
[
  {
    langSmithProjectId: String,
    name: String,
    totalRuns: Long,
    averageTokensPerRun: Long,
    linkedAiSystem: String (UUID, optional)
  }
]
```

**Endpoint: Get Project Analysis**
```
GET /api/ai-act/integrations/langsmith/projects/{projectId}/analysis?startDate=2024-01-01&endDate=2024-01-31

Returns:
{
  projectName: String,
  periodCost: BigDecimal,
  totalRuns: Long,
  successRate: Float (percentage),
  modelsUsed: [
    {
      model: "gpt-4",
      runCount: 1500,
      totalTokens: 500_000,
      estimatedCost: 7.50
    }
  ],
  failurePatterns: [
    {
      errorType: "RATE_LIMIT",
      occurrences: 50,
      percentage: 5.0
    }
  ],
  userEngagement: {
    uniqueUsers: 250,
    averageSessionDuration: "5m 30s",
    topSessionTags: ["production", "urgent"]
  }
}
```

**Endpoint: Sync LangSmith Data**
```
POST /api/ai-act/integrations/langsmith/sync
?projectId=...&startDate=2024-01-01&endDate=2024-01-31

Returns:
{
  runsSynced: Integer,
  costAggregated: BigDecimal,
  periodCovered: String,
  newModelsDetected: [String],
  nextSyncScheduled: LocalDateTime
}
```

### 5. AI System Linking

**Automatic Linking Strategy:**
1. LangSmith project name patterns (e.g., "customer-support-bot" → System)
2. Custom tags in runs (e.g., tag: "ai-system-id:...")
3. User metadata linking
4. Manual mapping via dashboard

**Evidence Generation:**
```
EvidenceItemType.APPLICATION_USAGE_LOG
- Title: "LangChain/LangSmith Activity Report"
- Description: "{Project Name} - {Period}"
- Models used: [gpt-4, gpt-3.5-turbo]
- Total runs: 10,000
- Success rate: 98.5%
- Estimated cost: $150.50
```

---

## Vercel AI SDK Integration

### 1. Overview

Vercel AI SDK is a TypeScript library for building AI applications with streaming and OpenAI compatibility.

**Supported Features:**
- Streaming responses
- Tool calling
- Multi-model support
- Prompt templates

### 2. Data Collection

**Instrumentation Points:**

**Option A: Vercel Observability (Native)**
```
// Enable in Next.js config
export const telemetry = {
  isEnabled: true,
  provider: "vercel"
}

// Access via Vercel Dashboard Analytics
```

**Option B: Custom Logging**
```
// Instrument at SDK usage points
import { generateText, streamText } from 'ai'

const result = await generateText({
  model: openai('gpt-4'),
  prompt: 'Generate summary',
  
  // Custom callback instrumentation
  onStart: () => { /* log start */ },
  onChunk: (chunk) => { /* log token */ },
  onFinish: (result) => { /* log completion */ }
})
```

**Option C: Proxy Logging**
```
// Log at HTTP layer
Middleware logs all requests to /api/ai endpoints
Extracts model, tokens, latency
Sends to Zenvyra API
```

### 3. Data Model

**VercelAiSdkUsageRecord:**
```
{
  id: UUID,
  organizationId: String,
  
  // Execution
  timestamp: LocalDateTime,
  endpoint: String (e.g., "/api/chat"),
  
  // Model and provider
  model: String,
  provider: String (OPENAI, ANTHROPIC, GOOGLE),
  
  // Usage
  inputTokens: Integer,
  outputTokens: Integer,
  
  // Performance
  latencyMs: Long,
  streaming: Boolean,
  
  // Tool usage
  toolsUsed: List<String>,
  
  // Metadata
  userId: String (optional),
  sessionId: String,
  customMetadata: Map<String, String>,
  
  // Linking
  linkedAiSystemId: String (optional)
}
```

### 4. Integration Approach

**Method 1: Vercel Analytics Integration**
- Use Vercel's native observability
- Polling API for analytics data
- Less detailed but easier setup

**Method 2: Custom Middleware**
```
// In Next.js middleware or API route wrapper
export function instrumentAiCall(model, tokens, cost) {
  await fetch('/api/internal/log-ai-usage', {
    method: 'POST',
    body: JSON.stringify({
      model,
      inputTokens: tokens.prompt,
      outputTokens: tokens.completion,
      timestamp: new Date(),
      endpoint: request.url
    })
  })
}
```

**Method 3: Environment Variable Detection**
```
// Detect SDK usage from environment variables
OPENAI_API_KEY → Using OpenAI via SDK
ANTHROPIC_API_KEY → Using Anthropic via SDK
LLM_PROVIDER → Configured provider

// Evidence: "Vercel AI SDK configured for {Provider}"
```

### 5. Integration Endpoints

**Endpoint: Analyze SDK Usage**
```
GET /api/ai-act/integrations/vercel-ai/usage-summary?startDate=2024-01-01

Returns:
{
  totalRequests: 50_000,
  averageLatency: 2500,
  modelsUsed: ["gpt-4", "gpt-3.5-turbo", "claude-opus"],
  totalTokens: 10_000_000,
  estimatedCost: 150.00,
  topEndpoints: [
    {
      path: "/api/chat",
      requests: 40_000,
      avgLatency: 2000
    }
  ],
  errorRate: 0.5
}
```

**Endpoint: Get Endpoint Analysis**
```
GET /api/ai-act/integrations/vercel-ai/endpoints/{encodedPath}/analysis

Returns:
{
  endpoint: "/api/chat",
  totalCalls: 40_000,
  modelsUsed: ["gpt-4"],
  inputTokensTotal: 5_000_000,
  outputTokensTotal: 2_500_000,
  successRate: 99.8,
  averageLatency: 2000,
  p95Latency: 5000,
  estimatedCost: 100.00,
  usageByHour: [...]
}
```

---

## LlamaIndex Integration

### 1. Overview

LlamaIndex (formerly GPT Index) is a data framework for LLM applications, especially RAG systems.

### 2. Data Collection

**Similar to LangChain approach:**
- Instrument at query/retrieval points
- Track document loading
- Monitor embeddings generation
- Log LLM calls

**Metrics to Track:**
- Documents processed
- Chunks created
- Embeddings generated
- Retrieval quality
- LLM completion tokens

### 3. Data Model

**LlamaIndexUsageRecord:**
```
{
  id: UUID,
  
  // Index info
  indexName: String,
  indexType: ENUM(VECTOR, SUMMARY, TREE),
  
  // Operation
  operationType: ENUM(BUILD, QUERY, UPDATE),
  
  // Data processing
  documentsProcessed: Integer,
  chunksCreated: Integer,
  totalChunkTokens: Long,
  
  // Embeddings
  embeddingsGenerated: Integer,
  embeddingModel: String,
  embeddingProvider: String,
  embeddingCostUsd: BigDecimal,
  
  // LLM calls
  llmCallsInRetrieval: Integer,
  llmTokensUsed: Long,
  llmCostUsd: BigDecimal,
  
  // Performance
  retrievalLatencyMs: Long,
  generationLatencyMs: Long,
  
  // Metadata
  syncedAt: LocalDateTime
}
```

---

## Unified Framework Monitoring API

**Endpoint: Get All Framework Usage**
```
GET /api/ai-act/integrations/frameworks/summary?startDate=2024-01-01&endDate=2024-01-31

Returns:
{
  period: { start, end },
  frameworks: {
    langchain: {
      projects: 5,
      totalRuns: 50_000,
      estimatedCost: 500.00
    },
    vercelAi: {
      endpoints: 8,
      totalRequests: 100_000,
      estimatedCost: 750.00
    },
    llamaindex: {
      indexes: 3,
      queriesProcessed: 20_000,
      estimatedCost: 150.00
    }
  },
  totalCostUsd: 1_400.00,
  modelsUsed: ["gpt-4", "gpt-3.5-turbo", "claude-opus"],
  topFrameworkByUsage: "vercelAi"
}
```

---

## Risk Assessment for Frameworks

**Framework-Level Risks:**
1. **Prompt Injection** (LangChain chains with user input)
2. **RAG Hallucinations** (LlamaIndex retrieval quality)
3. **Tool Misuse** (LLM calling wrong tools)
4. **Cascade Failures** (Multi-hop chains)
5. **Cost Explosion** (Inefficient retrieval/regeneration)

**Evidence Items:**
```
FrameworkUsageType.FRAMEWORK_INTEGRATION
- Framework: "LangChain"
- Chain type: "RetrievalQA"
- Models used: ["gpt-4"]
- Average cost per query: $0.05
- Success rate: 95%
- Risk factors: ["retrieval_quality", "hallucination_potential"]
```

---

## Implementation Roadmap

### Phase 1: LangSmith (Week 1-2)
- [ ] LangSmith API wrapper
- [ ] Project discovery
- [ ] Run data collection
- [ ] Project-to-system mapping
- [ ] Testing

### Phase 2: Vercel AI SDK (Week 3)
- [ ] Detect SDK in codebase
- [ ] Instrument API routes
- [ ] Collect endpoint metrics
- [ ] Testing

### Phase 3: LlamaIndex (Week 4)
- [ ] LlamaIndex instrumentation
- [ ] Vector store tracking
- [ ] RAG metrics collection
- [ ] Testing

### Phase 4: Unified Analytics (Week 5+)
- [ ] Framework aggregation dashboard
- [ ] Framework-specific risk scoring
- [ ] Cross-framework dependency analysis

---

## Security Considerations

**Framework API Keys:**
- Encrypt LangSmith API keys
- Support multiple framework credentials
- Audit framework API access

**Data Collection:**
- Do NOT log user prompts or sensitive data
- Aggregate tokens and costs only
- Sanitize error messages

**Code Detection:**
- Safe analysis of import statements
- No execution of application code
- Pattern matching for framework usage

---

## Testing Strategy

**Unit Tests:**
- LangSmith API response parsing
- Cost calculations
- Project mapping logic
- Token counting

**Integration Tests:**
- Mock framework APIs
- Multi-framework sync
- Error handling
- Rate limiting

**E2E Tests:**
- Real LangSmith connection (with test project)
- Framework detection in sample apps
- Complete sync workflow

---

## Questions & Decisions

1. **Sync frequency?** (Proposal: LangSmith every 12 hours, Vercel/LlamaIndex on-demand)
2. **Historical data?** (Proposal: Last 30 days for LangSmith, 7 days for others)
3. **Multi-tenant?** (Proposal: Support multiple LangSmith orgs per Zenvyra org)

## References

- LangSmith API: https://docs.smith.langchain.com/
- LangChain Documentation: https://python.langchain.com/
- Vercel AI SDK: https://vercel.com/ai
- LlamaIndex: https://www.llamaindex.ai/
