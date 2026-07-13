# Zenvyra API Specification

## Overview

Zenvyra provides a comprehensive API for AI Act readiness compliance, privacy scanning, and evidence management.

## Base URL

Production: `https://api.zenvyra.com`
Development: `http://localhost:8080`

## Authentication

- **Bearer Token**: `Authorization: Bearer <jwt>` for authenticated endpoints
- **API Key**: `X-Api-Key` header for external integrations
- **CSRF**: `X-XSRF-TOKEN` header for state-changing requests

## Endpoints

### Auth
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Reset password
- `POST /auth/verify-email` - Verify email

### AI Act
- `GET /ai-act/systems` - List AI systems
- `POST /ai-act/systems` - Create AI system
- `GET /ai-act/systems/{id}` - Get AI system details
- `PUT /ai-act/systems/{id}` - Update AI system
- `POST /ai-act/systems/{id}/assess` - Run readiness assessment
- `GET /ai-act/systems/{id}/readiness` - Get assessment
- `POST /ai-act/systems/{id}/scan-disclosures` - Scan for AI disclosures
- `POST /ai-act/systems/{id}/certificate` - Issue certificate
- `DELETE /ai-act/systems/{id}/certificate` - Revoke certificate
- `GET /ai-act/export/systems/{id}/proof-pack` - Export proof pack
- `GET /ai-act/export/systems/{id}/system-card` - Export system card
- `GET /ai-act/export/assessments/{id}/summary` - Export assessment

### Evidence
- `GET /ai-act/evidence/system/{id}` - List evidence
- `POST /ai-act/evidence/system/{id}` - create evidence item
- `PUT /ai-act/evidence/{id}` - Update evidence
- `DELETE /ai-act/evidence/{id}` - Delete evidence

### Audit
- `GET /ai-act/audit/system/{id}` - Get audit log

### Scanner
- `POST /scan/free` - Free privacy scanner
- `POST /scan/leads` - Lead scanner
- `GET /scan/{id}/results` - Get scan results