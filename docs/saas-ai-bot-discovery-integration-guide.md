# SaaS Platform AI Bot Discovery Integration Guide

## Overview

This document outlines the planned integration for discovering and tracking AI-powered bots and assistants running in SaaS platforms like Slack, Intercom, Discord, and Microsoft Teams.

## Integration Rationale

Organizations increasingly use AI chatbots and assistants within collaboration and customer service platforms:
- **Slack Bots** for internal automation and support
- **Intercom** AI for customer support automation
- **Discord Bots** for community management
- **Teams Bots** for enterprise workflows

Zenvyra needs visibility into these integrations to fully understand AI usage and map to regulatory obligations.

---

## Slack AI Bot Integration

### 1. Overview

Slack supports multiple AI bot patterns:
- **Native Slack AI** (Slack's built-in intelligence)
- **Slack App Bots** (third-party bot apps)
- **Workflow Automation** with AI actions
- **Custom Bot Integrations** (OpenAI, Anthropic, etc.)

### 2. Data Collection

**Authentication:**

```
OAuth Scopes:
- apps:read (list installed apps)
- users:read (read bot user info)
- team_info:read (organization info)
- bots:read (read bot information)
```

**Installation Flow:**
```
1. User clicks "Add to Slack"
2. OAuth flow with requested scopes
3. Store access token (encrypted)
4. Periodic sync of installed apps
```

### 3. Data Collection Methods

**Method 1: Slack App Directory**
```
GET https://slack.com/api/apps.list
{
  token: String,
  include_internal: true,
  include_disabled: false
}

Returns:
[
  {
    app_id: "A...",
    name: "ChatGPT",
    description: "OpenAI's ChatGPT in Slack",
    isBot: true,
    installationsCount: 1,
    creatorName: "OpenAI",
    homepage: "https://openai.com",
    scopes: ["chat:write", "commands"]
  },
  {
    app_id: "A...",
    name: "Internal Support Bot",
    description: "Custom bot",
    isBot: true,
    creatorName: "Internal Development",
    metadata: { customBot: true, integrations: ["anthropic"] }
  }
]
```

**Method 2: Slack Bot Users**
```
GET https://slack.com/api/users.list
?exclude_archived=true

Filter for:
- user.is_bot = true
- user.profile.display_name like "AI" or "Bot"
```

**Method 3: Slack Workflow Audit Logs**
```
GET https://slack.com/api/team.auditLogs
?action=workflow_*
&min_date=<7 days ago>

Returns workflows created/modified
Filter for: AI-related steps (e.g., "send_to_openai")
```

**Method 4: Webhook Detection**
```
// Monitor /slack/events endpoint access patterns
// Identify incoming webhook integrations
// Cross-reference with installed apps
```

### 4. Data Model

**SlackBotIntegration:**
```
{
  id: UUID,
  organizationId: String,
  
  // Slack reference
  slackWorkspaceId: String,
  slackUserId: String (bot user ID),
  
  // Bot identification
  botName: String,
  botDescription: String,
  appId: String,
  
  // Bot classification
  botType: ENUM(NATIVE_SLACK_AI, THIRD_PARTY_APP, CUSTOM_BOT, WORKFLOW_AUTOMATION),
  createdBy: String (creator name),
  
  // AI capabilities
  aiCapabilities: List<String> (e.g., ["chat", "summarization", "sentiment_analysis"]),
  aiModels: List<String> (e.g., ["gpt-4", "claude-3-opus"]),
  aiProviders: List<String> (e.g., ["openai", "anthropic"]),
  
  // Scopes and permissions
  grantedScopes: List<String>,
  permissions: List<String>,
  
  // Usage metadata
  channelsActive: Integer,
  usersInteracting: Integer,
  isActive: Boolean,
  
  // Configuration
  customConfiguration: Map<String, Object>,
  
  // Metadata
  installedAt: LocalDateTime,
  lastAccessedAt: LocalDateTime,
  syncedAt: LocalDateTime
}
```

**SlackBotUsageMetrics:**
```
{
  id: UUID,
  organizationId: String,
  slackBotId: String,
  
  // Time period
  date: LocalDate,
  
  // Usage
  messagesProcessed: Long,
  commandsExecuted: Long,
  worksflowsTriggered: Long,
  
  // Channels
  activeChannels: Integer,
  activeUsers: Integer,
  
  // Performance
  avgResponseTimeMs: Long,
  errorRate: Float,
  
  // Cost (if applicable)
  estimatedApiCallsCost: BigDecimal,
  estimatedTokensCost: BigDecimal,
  
  // Metadata
  syncedAt: LocalDateTime
}
```

### 5. Integration Endpoints

**Endpoint: Connect Slack Workspace**
```
POST /api/ai-act/integrations/slack/connect
{
  accessToken: String (xoxb-...)
}

Returns:
{
  workspaceId: String,
  workspaceName: String,
  botsDiscovered: Integer,
  aiBotsDetected: Integer,
  setupLink: String
}
```

**Endpoint: List Slack AI Bots**
```
GET /api/ai-act/integrations/slack/bots

Returns:
[
  {
    botId: String,
    name: "ChatGPT",
    type: "THIRD_PARTY_APP",
    aiModels: ["gpt-4"],
    channels: 15,
    users: 250,
    isActive: true
  },
  {
    botId: String,
    name: "Internal Support Bot",
    type: "CUSTOM_BOT",
    aiModels: ["claude-3-opus"],
    channels: 5,
    users: 50,
    isActive: true
  }
]
```

**Endpoint: Get Bot Detailed Info**
```
GET /api/ai-act/integrations/slack/bots/{botId}/details

Returns:
{
  id: String,
  name: String,
  description: String,
  aiProviders: ["openai"],
  aiModels: ["gpt-4"],
  installedAt: LocalDateTime,
  lastActivityAt: LocalDateTime,
  channels: [
    {
      channelId: "C...",
      channelName: "customer-support",
      activityCount: 1500
    }
  ],
  permissions: ["chat:write", "commands"],
  linkedAiSystem: String (UUID, optional)
}
```

**Endpoint: Get Usage Analytics**
```
GET /api/ai-act/integrations/slack/bots/{botId}/usage?startDate=2024-01-01&endDate=2024-01-31

Returns:
{
  period: { start, end },
  totalInteractions: 10_000,
  messagesByDay: [...],
  topChannels: [
    {
      channelName: "customer-support",
      interactions: 5_000,
      users: 50
    }
  ],
  errorRate: 0.5,
  avgResponseTime: 1500,
  estimatedCost: 50.00,
  aiModelsUsed: ["gpt-4", "gpt-3.5-turbo"],
  riskFactors: ["customer-facing", "high-volume"]
}
```

**Endpoint: Sync Slack Data**
```
POST /api/ai-act/integrations/slack/sync

Returns:
{
  botsScanned: Integer,
  aiBotsDetected: Integer,
  newBotsFound: Integer,
  botsRemoved: Integer,
  nextSyncScheduled: LocalDateTime
}
```

### 6. AI System Linking

**Automatic Linking:**
1. Bot name pattern matching (e.g., "customer-support-bot" → System)
2. Channel membership analysis
3. Model detection (if bot description mentions model)
4. Manual mapping via dashboard

**Evidence Generation:**
```
EvidenceItemType.SAAS_INTEGRATION
- Title: "Slack AI Bot Integration: {BotName}"
- Platform: "Slack"
- Bot: "{BotName}"
- AI Models: ["gpt-4"]
- Status: ACTIVE
- Monthly interactions: 10,000
- Customer-facing: true
```

---

## Intercom AI Integration

### 1. Overview

Intercom provides customer communication platform with AI-powered features:
- **Intercom AI Copilot** (generative AI for support)
- **Custom AI Agents** (trained on help center)
- **Message Automation** (AI-triggered workflows)

### 2. Data Collection

**Authentication:**

```
Intercom OAuth or API Token
Scopes:
- conversations.read
- contacts.read
- articles.read
```

**Intercom API Endpoints:**

```
// Get workspace info
GET https://api.intercom.io/me
Authorization: Bearer dG9rOmxpdmVfYXBpXzk4MzQyNTQwXzg3YzRmOGE0ZWI0ZDQxMGFiYw==

// List AI agents
GET https://api.intercom.io/ai_agents
?workspace_id={workspaceId}

// Get AI conversations
GET https://api.intercom.io/conversations
?ai_agent_id={agentId}
&created_after={timestamp}
```

### 3. Data Model

**IntercomAiIntegration:**
```
{
  id: UUID,
  organizationId: String,
  
  // Intercom reference
  intercomWorkspaceId: String,
  
  // AI features
  aiCopilotEnabled: Boolean,
  aiAgentCount: Integer,
  
  // Agents
  agents: [
    {
      agentId: String,
      agentName: String,
      agentType: ENUM(COPILOT, CUSTOM_AGENT, AUTOMATION),
      description: String,
      
      // AI configuration
      knowledgeBase: String (help center reference),
      trainingData: { articlesCount, customResponses },
      
      // Performance
      conversationsHandled: Long,
      successRate: Float,
      avgResolutionTime: Long,
      
      // Models
      aiModels: [String],
      aiProviders: [String]
    }
  ],
  
  // Metadata
  syncedAt: LocalDateTime
}
```

**IntercomAiConversationRecord:**
```
{
  id: UUID,
  organizationId: String,
  intercomConversationId: String,
  
  // Conversation details
  timestamp: LocalDateTime,
  agentId: String,
  
  // AI involvement
  aiGenerated: Boolean,
  aiModel: String,
  aiHandledFullyBy: Boolean,
  
  // Interaction
  messageCount: Integer,
  humanHandoffRequired: Boolean,
  
  // Outcome
  resolved: Boolean,
  customerSatisfaction: Float (1-5),
  
  // Cost
  estimatedTokens: Long,
  estimatedCost: BigDecimal,
  
  // Risk
  sensitive: Boolean,
  escalated: Boolean
}
```

### 4. Integration Endpoints

**Endpoint: Connect Intercom Workspace**
```
POST /api/ai-act/integrations/intercom/connect
{
  accessToken: String
  workspaceId: String (optional, extracted from token)
}

Returns:
{
  workspaceId: String,
  workspaceName: String,
  aiAgentsFound: Integer,
  copilotEnabled: Boolean,
  setupLink: String
}
```

**Endpoint: Get AI Agent List**
```
GET /api/ai-act/integrations/intercom/agents

Returns:
[
  {
    agentId: String,
    name: "Customer Support",
    type: "CUSTOM_AGENT",
    conversationsHandled: 5_000,
    successRate: 0.92,
    linkedAiSystem: String (UUID, optional)
  }
]
```

**Endpoint: Get Agent Performance**
```
GET /api/ai-act/integrations/intercom/agents/{agentId}/performance?startDate=2024-01-01

Returns:
{
  period: { start, end },
  conversationsTotal: 5_000,
  conversationsByDay: [...],
  resolutionRate: 0.92,
  avgHandlingTime: 180,
  humanHandoffRate: 0.08,
  customerSatisfaction: 4.2,
  estimatedTokens: 1_000_000,
  estimatedCost: 25.00,
  topIssues: [...]
}
```

---

## Discord Bot Integration

### 1. Overview

Discord allows community-managed AI bots for various purposes:
- Community moderation and support
- Information retrieval
- Entertainment and engagement

### 2. Data Collection

**Discord OAuth + Bot Token:**
```
OAuth Scopes:
- bot (for bot permissions)
- guilds (read guild info)
```

**Collection Methods:**

```
// Get bot info
GET https://discord.com/api/v10/applications/@me
Authorization: Bearer {token}

// Get guild info
GET https://discord.com/api/v10/users/@me/guilds

// Get bot commands/interactions
List MESSAGE_CREATE events from event log
Filter for bot interactions
```

### 3. Data Model (Simplified)

**DiscordBotIntegration:**
```
{
  id: UUID,
  organizationId: String,
  
  botId: String,
  botName: String,
  
  // AI capabilities
  hasAi: Boolean,
  aiModels: List<String>,
  aiProviders: List<String>,
  
  // Guilds (servers) where active
  activeGuilds: Integer,
  
  // Activity
  commandsExecuted: Long,
  lastActivityAt: LocalDateTime,
  
  // Metadata
  syncedAt: LocalDateTime
}
```

---

## Microsoft Teams Bot Integration

### 1. Overview

Teams bots can be AI-powered for enterprise workflows and automation.

### 2. Data Collection

**Microsoft Graph API:**
```
OAuth Scopes:
- AppCatalog.Read.All
- Application.Read.All
```

**Collection:**
```
// List installed apps
GET https://graph.microsoft.com/v1.0/appCatalogs/teamsApps
?$filter=displayName eq 'ChatGPT'

// Get app usage
GET https://graph.microsoft.com/beta/reports/getTeamsUserActivityCounts
```

### 3. Data Model (Similar to other platforms)

**TeamsAiBotIntegration:**
```
{
  id: UUID,
  organizationId: String,
  
  botId: String,
  botName: String,
  
  teamsTeamCount: Integer,
  activeUsers: Integer,
  
  aiModels: List<String>,
  
  syncedAt: LocalDateTime
}
```

---

## Unified SaaS AI Bot Inventory

**Endpoint: Get All SaaS AI Bots**
```
GET /api/ai-act/integrations/saas-ai-bots/summary

Returns:
{
  totalPlatforms: 4,
  totalBotsDiscovered: 25,
  platformBreakdown: {
    slack: {
      botsFound: 15,
      aiBotsDetected: 10,
      models: ["gpt-4", "claude-opus"],
      dailyInteractions: 5_000
    },
    intercom: {
      botsFound: 3,
      aiBotsDetected: 3,
      models: ["gpt-4"],
      dailyInteractions: 2_000
    },
    discord: {
      botsFound: 5,
      aiBotsDetected: 2,
      models: ["gpt-3.5-turbo"],
      dailyInteractions: 500
    },
    teams: {
      botsFound: 2,
      aiBotsDetected: 2,
      models: ["gpt-4"],
      dailyInteractions: 1_000
    }
  },
  totalDailyInteractions: 8_500,
  estimatedMonthlyCost: 500.00,
  riskFactors: {
    customerFacing: 5,
    publiclyAccessible: 3,
    unauthorizedDetected: 0
  }
}
```

---

## Risk Assessment for SaaS AI Bots

**Risk Factors:**
1. **Customer-Facing** (High risk if used with public users)
2. **Data Exposure** (Conversation logs may contain sensitive data)
3. **Unauthorized Bots** (Rogue bots not approved)
4. **Model Updates** (Unexpected model changes)
5. **Cost Explosion** (Uncontrolled usage)

**Evidence Generation:**
```
EvidenceItemType.SAAS_INTEGRATION
- Title: "AI Bot Deployed on {Platform}"
- Platform: "Slack/Intercom/Discord/Teams"
- Bot: "{BotName}"
- AI Models: ["gpt-4"]
- Active: true
- Interactions/Month: 50,000
- Customer-Facing: true
- Risk Level: MEDIUM
```

---

## Implementation Roadmap

### Phase 1: Slack (Week 1-2)
- [ ] Slack OAuth setup
- [ ] Bot discovery
- [ ] Usage metrics collection
- [ ] Testing

### Phase 2: Intercom (Week 3)
- [ ] Intercom API integration
- [ ] Agent discovery
- [ ] Conversation tracking
- [ ] Testing

### Phase 3: Discord + Teams (Week 4)
- [ ] Discord bot detection
- [ ] Teams bot detection
- [ ] Unified inventory
- [ ] Testing

### Phase 4: Risk & Analytics (Week 5+)
- [ ] Cross-platform risk scoring
- [ ] Aggregate analytics dashboard
- [ ] Anomaly detection

---

## Security Considerations

**Access Token Management:**
- Encrypt all platform tokens
- Implement token rotation
- Support multiple workspace connections
- Audit log for token usage

**Data Privacy:**
- Do NOT store user conversation content
- Store only aggregated metrics
- Support user data deletion
- GDPR compliance for conversation records

**Detection Accuracy:**
- May not detect all AI usage (private/local models)
- Relies on bot metadata and names
- False positives possible (non-AI bots)

---

## Testing Strategy

**Unit Tests:**
- OAuth flow simulation
- Bot data parsing
- Usage metrics calculation

**Integration Tests:**
- Mock platform APIs
- Multi-platform sync
- Error handling

**E2E Tests:**
- Real platform connections (with test workspaces)
- Complete inventory sync
- Dashboard accuracy

---

## Questions & Decisions

1. **Real-time vs scheduled?** (Proposal: Scheduled daily for all platforms)
2. **Historical data?** (Proposal: Last 30 days)
3. **Unauthorized bot detection?** (Proposal: Flag bots not in approval list)
4. **Conversation logging?** (Proposal: Never log user messages, metrics only)

## References

- Slack API: https://api.slack.com/
- Intercom API: https://developers.intercom.com/
- Discord Developer Portal: https://discord.com/developers/
- Microsoft Graph API: https://docs.microsoft.com/en-us/graph/
