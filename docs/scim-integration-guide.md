# SCIM Integration Planning Guide

## Overview

This document outlines the planned SCIM (System for Cross-domain Identity Management) integration for Zenvyra. SCIM enables enterprise customers to automate user provisioning, role updates, and deprovisioning directly from their identity provider.

## Objectives

- Allow IdPs to create, update, and deactivate Zenvyra organization members automatically.
- Keep member records in sync with the customer's central user directory.
- Reduce manual onboarding and offboarding overhead for security teams.
- Complement SSO/SAML/OIDC by handling lifecycle events before the first login.

## Supported Operations

**User Resource (`/scim/v2/Users`)**
- `GET /Users` — list provisioned users
- `GET /Users/{id}` — get a specific user
- `POST /Users` — provision a new member
- `PUT /Users/{id}` — update member attributes and role
- `PATCH /Users/{id}` — partial update, including deactivate/reactivate
- `DELETE /Users/{id}` — deprovision a member

**Group Resource (future)**
- `GET /Groups` — list groups mapped to Zenvyra organizations
- `PUT /Groups/{id}` — update group membership

## Data Model

### SCIM Server Configuration

```
{
  id: String (UUID)
  organizationId: String
  name: String
  status: Enum { ACTIVE, DISABLED }
  token: String (bearer token, hashed)
  tokenHint: String (last 4 characters for display)
  defaultRole: OrganizationRole
  createdAt: LocalDateTime
  updatedAt: LocalDateTime
}
```

### User Mapping

| SCIM Attribute           | Zenvyra Field                    |
|--------------------------|----------------------------------|
| `id`                     | SCIM external id (not User.id)   |
| `userName`               | email                            |
| `name.givenName`         | fullName (first part)            |
| `name.familyName`        | fullName (last part)             |
| `emails[0].value`       | email                            |
| `active`                 | member status (active/inactive)  |
| `roles[0].value`        | OrganizationRole                 |
| `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization` | organizationId |

## API Endpoints

```
GET    /scim/v2/ServiceProviderConfig  SCIM service provider capabilities
GET    /scim/v2/ResourceTypes          Supported resource types
GET    /scim/v2/Schemas                Supported schemas

GET    /scim/v2/Users                  List users (with pagination filters)
POST   /scim/v2/Users                  Create user
GET    /scim/v2/Users/{id}             Get user
PUT    /scim/v2/Users/{id}             Update user
PATCH  /scim/v2/Users/{id}             Partial update
DELETE /scim/v2/Users/{id}             Deactivate user

POST   /api/v1/admin/scim/tokens       Generate a SCIM bearer token
GET    /api/v1/admin/scim/tokens       List tokens
DELETE /api/v1/admin/scim/tokens/{id}  Revoke a token
```

## Authentication

- SCIM endpoints accept a `Authorization: Bearer {token}` header.
- Tokens are scoped to a single organization.
- Tokens are hashed before storage; only the plain text is shown once at creation.
- Tokens are rotated through the admin settings UI.

## Provisioning Flow

```
1. IdP detects a new user assignment to the Zenvyra app.
2. IdP POSTs user data to /scim/v2/Users.
3. Backend validates bearer token and resolves organization.
4. Backend creates a pending OrganizationMember with the mapped role.
5. User receives an invitation email if email is provided.
6. On first SSO login, the pending member is activated.
```

## Deprovisioning Flow

```
1. IdP removes user assignment or sets active=false.
2. IdP sends PATCH or DELETE to /scim/v2/Users/{id}.
3. Backend deactivates the OrganizationMember.
4. Existing sessions expire at next token refresh.
5. Audit log records the deprovisioning event.
```

## Role Synchronization

- Map common IdP role names to OrganizationRole values:
  - `owner`, `admin`, `member`, `viewer`
- If no matching role is found, fall back to the configured `defaultRole`.
- Role changes from the IdP are applied immediately and logged.

## Audit and Security

- Log every SCIM request with correlation ID and organization ID.
- Redact bearer tokens in logs.
- Rate-limit SCIM endpoints per token.
- Require organization admin approval before activating high-privilege roles (owner/admin).

## UI Placement

- Add a "SCIM Provisioning" section under Settings > Authentication.
- Show endpoint URL, token generation, and last sync timestamp.
- Provide an event log for recent provisioning/deprovisioning actions.

## Future Enhancements

- Group-to-organization mapping.
- Automatic reactivation on reassignment.
- Push-based real-time sync via webhooks.
- Directory import for bulk onboarding.
