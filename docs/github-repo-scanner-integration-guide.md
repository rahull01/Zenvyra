# GitHub Repository Scanner Integration Guide

## Overview

This document outlines the planned integration for scanning GitHub repositories to automatically discover and inventory AI systems being used within codebases.

## Use Case

Organizations need to understand where AI is being used across their repositories. This integration enables:
- **Automated discovery** of AI/ML model imports and dependencies
- **Evidence collection** of AI system usage (OpenAI, Anthropic, etc.)
- **Risk assessment** based on detected AI integrations
- **Compliance tracking** for each detected AI system

## Integration Approach

### 1. Authentication & Authorization

**GitHub Personal Access Token (PAT) Integration:**
- User provides GitHub PAT during setup (OAuth preferred for production)
- PAT scoped to: `repo:read`, `user:read`
- Token stored encrypted in database with user association
- Support for GitHub App integration as future enhancement

### 2. Repository Discovery

**Manual Selection vs. Automatic:**
- Initial phase: Users manually select repositories to scan
- User provides GitHub organization/username and repository list
- Scans public and private repositories (based on PAT scopes)

**Supported Repository Types:**
- Python projects (requirements.txt, setup.py, pyproject.toml, Pipfile)
- JavaScript/TypeScript (package.json, yarn.lock, pnpm-lock.yaml)
- Java projects (pom.xml, build.gradle)
- Go projects (go.mod, go.sum)
- Other ecosystems as expanded over time

### 3. Detection Patterns

**AI Model & Provider Detection:**

File Patterns to Scan:
```
# Python
import openai
from anthropic import Anthropic
import boto3  # SageMaker
from azure.ai.language import...
import vertexai
import replicate
import cohere
import huggingface_hub
from langchain import...
import llama_index
```

Dependency Detection:
- Parse `requirements.txt` for pinned versions
- Parse `package.json` for npm/yarn dependencies
- Parse `pom.xml` for Maven dependencies
- Detect version constraints to track update cadence

**Configuration File Patterns:**
- `.env` / `.env.example` for API key references
- YAML/TOML configuration files with model provider settings
- Docker Compose files with AI services

**Code Pattern Analysis:**
- Function calls to known AI APIs
- Streaming request patterns
- Model fine-tuning code
- Local model deployment (Ollama, etc.)

### 4. Data Model

**New Entity: RepositoryAiScan**
```
{
  id: String (UUID)
  userId: String
  repositoryUrl: String (https://github.com/owner/repo)
  githubOwner: String
  repositoryName: String
  defaultBranch: String (main/master)
  
  // Scan metadata
  scannedAt: LocalDateTime
  nextScanAt: LocalDateTime (if recurring)
  scanFrequency: Enum (MANUAL, WEEKLY, MONTHLY)
  
  // Findings
  detectedDependencies: List<String> (AI library names, versions)
  detectedEnvironmentVariables: List<String> (sanitized key names)
  detectedCodePatterns: List<String> (e.g., "openai_chat_completion_call")
  
  // Extracted evidence
  automatedDecisionMakingRisk: Boolean
  dataProcessingRisk: Boolean
  modelTrainingIndicators: Boolean
  
  // Linking
  linkedAiSystems: List<String> (AI System IDs created from scan)
  status: Enum (PENDING, SCANNING, COMPLETED, FAILED, ARCHIVED)
}
```

### 5. Integration Points

**GitHub Scanning Endpoint:**
```
POST /api/ai-act/integrations/github/scan
{
  organizationOrUser: String
  repositories: [String] // ["repo1", "repo2"]
  includePrivate: Boolean
  createAiSystems: Boolean (auto-create from findings)
}

Returns:
{
  scanId: String
  status: String (INITIATED)
  estimatedCompletionTime: LocalDateTime
}
```

**Scan Status Endpoint:**
```
GET /api/ai-act/integrations/github/scan/{scanId}

Returns:
{
  scanId: String
  status: String (SCANNING, COMPLETED, FAILED)
  progress: Integer (0-100)
  detectedSystems: [
    {
      provider: String
      count: Integer
      repositories: [String]
      highestRiskLevel: String
    }
  ]
  linkedAiSystemIds: [String]
  errors: [String] (if status=FAILED)
}
```

**Auto-Linking to AI Systems:**
- Scan results automatically mapped to existing AI systems
- New AI systems created if requested and not found
- Evidence items generated for each detection

### 6. Evidence Generation

**From Repository Scan Findings:**
- **EvidenceItemType.SCANNER_FINDING** created for each detected AI library
- **EvidenceItemType.TECHNICAL_DOCUMENTATION** for repository URL reference
- **EvidenceItemType.PROCESS_DOCUMENT** for findings report

**Evidence Attributes:**
```
{
  type: SCANNER_FINDING
  title: "OpenAI API detected in repository"
  description: "Found openai package v1.x in requirements.txt, indicating ChatGPT/GPT-4 integration"
  fileUrl: "https://github.com/owner/repo/blob/main/requirements.txt"
  status: UPLOADED
  systemId: (linked AI System)
  confidenceScore: 0.95
}
```

### 7. Rate Limiting & Performance

**GitHub API Rate Limits:**
- GitHub REST API: 60 req/min (unauthenticated), 5000 req/hour (authenticated)
- Implement sliding window rate limiter per user
- Queue scans if rate limit approached
- Batch repository checks to minimize API calls

**Scan Performance:**
- Limit initial scan to first 50 repositories
- Skip very large repositories (>10GB)
- Cache findings for 24 hours
- Support incremental scanning (only changed files)

### 8. Security Considerations

**Token Handling:**
- Store GitHub PAT encrypted with AES-256
- Rotate tokens after N days
- Revoke access if account compromised
- Never expose token in logs/error messages

**Repository Access:**
- Only scan repositories user has access to
- Verify PAT permissions before scanning
- Log all repository access attempts
- Alert user of unauthorized access attempts

**Sensitive Data:**
- Do NOT store secrets from `.env` files
- Sanitize file paths in evidence
- Do NOT expose private email addresses
- Do NOT store full repository content

### 9. Integration Timeline & Phases

**Phase 1 (Sprint 1):**
- [ ] GitHub PAT authentication
- [ ] Basic dependency detection (Python requirements.txt)
- [ ] Manual repository selection
- [ ] Evidence generation

**Phase 2 (Sprint 2):**
- [ ] Expand to JavaScript/TypeScript (package.json)
- [ ] Code pattern detection
- [ ] Environment variable detection
- [ ] Automated AI system creation

**Phase 3 (Future):**
- [ ] GitHub App OAuth integration
- [ ] Organization-wide scanning
- [ ] Recurring scheduled scans
- [ ] Java, Go, and other ecosystems
- [ ] Pull request analysis (detect new AI usage)

### 10. Testing Strategy

**Unit Tests:**
- CSV parser for each dependency format
- Pattern matching for code and config
- Evidence generation logic

**Integration Tests:**
- Mock GitHub API responses
- Full scan workflow
- Error handling and retry logic

**E2E Tests:**
- Real GitHub repository scanning (if credentials provided)
- Evidence linking and verification
- Risk score recalculation

### 11. Implementation Checklist

- [ ] Create RepositoryAiScan entity and repository
- [ ] Implement GitHub API client wrapper
- [ ] Add dependency file parsers (Python, Node.js)
- [ ] Implement code pattern detector
- [ ] Create GitHub scan service
- [ ] Add API endpoints for scan management
- [ ] Implement evidence generation from findings
- [ ] Add authentication (PAT storage, encryption)
- [ ] Write unit and integration tests
- [ ] Create user documentation
- [ ] Update API specification
- [ ] Create monitoring/alerting for failed scans

## Future Enhancements

1. **GitHub App Installation:**
   - Permission model aligned with organization structure
   - Webhook-based real-time detection
   - Installation per organization

2. **Advanced Analysis:**
   - Data flow analysis (what data goes to AI?)
   - Model fine-tuning detection
   - API cost estimation

3. **Multi-Repository Dashboard:**
   - Aggregate risk across all repositories
   - Trend analysis over time
   - Dependency update alerts

4. **Ecosystem Expansion:**
   - Java (Maven, Gradle)
   - Go (go.mod)
   - Rust (Cargo)
   - .NET (csproj, packages.config)

## Questions & Decisions

1. **OAuth vs. PAT?** (Decision: PAT for MVP, OAuth for production)
2. **Scan frequency?** (Proposal: Weekly default, configurable)
3. **Private repositories?** (Decision: Support if user has access)
4. **Create systems automatically?** (Decision: Optional, user selectable)

## References

- GitHub REST API: https://docs.github.com/en/rest
- GitHub App Development: https://docs.github.com/en/apps
- Dependency parser patterns: Standard ecosystem package managers
