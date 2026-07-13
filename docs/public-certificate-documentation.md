# Public Certificate Documentation

## Overview

The public certificate (AiActCertificate) provides a shareable verification page and embeddable badge for each AI system.

## Issue Flow

1. User initiates certificate from the system details page
2. Backend creates a new AiActCertificate with:
   - verificationToken (UUID)
   - badgeEmbedCode (HTML <img> tag)
   - active = true
   - issuedAt = now
   - expiresAt = now + 90 days
3. Previous active certificate is revoked
4. Certificate is saved to database

## Verification Page

- URL: `/verify/ai/{token}`
- Shows: readiness score, risk category, assessedAt, ruleset version, disclaimer
- Hides: private evidence details (only types exposed)
- Blocks: expired/revoked certificates

## Badge Endpoint

- URL: `/badge/ai/{token}`
- Returns: PNG image with score and status
- Rate-limited: Same as public verification

## Revocation

- Revoke: Sets active=false, revokedAt=now, revokeReason
- Re-issue: Creates new certificate, revokes old
- Expiry: 90 days from issue

## Public Proof URL

- Displayed in system details page
- Can be shared with customers and partners
- Includes embed code for websites