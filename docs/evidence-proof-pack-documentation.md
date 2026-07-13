# Evidence / Proof Pack Documentation

## Overview

The proof pack is a comprehensive markdown document that combines system inventory, risk assessment, obligations, gaps, evidence, next actions, and legal disclaimers into a single exportable report.

## Structure

- System inventory: All fields from AiSystemInventory
- Risk classification: Risk level, rationale, explanation
- Obligations: Applicable obligations per risk level
- Gaps: Grouped gap register
- Evidence: Merged evidence checklist + real evidence items
- Next actions: From assessment
- Legal disclaimer: "Not legal advice / not a conformity declaration"
- Version: Ruleset version
- Date: Generated-at timestamp

## Export Endpoints

- `GET /api/ai-act/export/systems/{id}/proof-pack` - Full proof pack (markdown)
- `GET /api/ai-act/export/systems/{id}/system-card` - System card (markdown)
- `GET /api/ai-act/export/assessments/{id}/summary` - Assessment summary (markdown)
- `GET /api/ai-act/export/systems/{id}/proof-pack.pdf` - Proof pack (PDF via PDFBox)

## PDF Export

The PDF export uses `PDFBox` to render the proof pack as a PDF document. It's a separate endpoint that delegates to the markdown service, then converts to PDF.

## Public Verification

- `GET /verify/ai/{token}` - Public verification page
- `GET /badge/ai/{token}` - Badge endpoint (returns PNG)
- Public verification shows: score, last assessed date, scope, disclaimer
- Evidence categories are shown without private document links
- Expired/revoked certificates are rejected