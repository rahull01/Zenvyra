# SSO/SAML/OIDC Integration Planning Guide

## Overview

This document outlines the planned enterprise authentication integration for Zenvyra. Single Sign-On (SSO) allows customers to manage user access through their existing identity provider (IdP), enforce centralized security policies, and streamline onboarding for compliance and security teams.

## Objectives

- Allow enterprise customers to sign in to Zenvyra using their corporate identity provider.
- Support the two most common federation protocols: SAML 2.0 and OpenID Connect (OIDC).
- Map IdP groups or roles to Zenvyra organization roles (owner, admin, member, viewer).
- Keep the default email/password and OAuth2 login paths available for smaller teams.

## Supported Identity Providers

**SAML 2.0**
- Okta
- Microsoft Entra ID (Azure AD)
- Google Workspace
- OneLogin
- Any SAML 2.0-compliant IdP

**OpenID Connect (OIDC)**
- Microsoft Entra ID
- Google Identity
- Auth0
- Any OIDC-compliant IdP

## Data Model

### New Entity: OrganizationIdentityProvider

```
{
  id: String (UUID)
  organizationId: String
  protocol: Enum { SAML, OIDC }
  name: String (display name, e.g., "Okta - Engineering")
  status: Enum { PENDING, ACTIVE, DISABLED }

  // SAML fields
  samlMetadataUrl: String
  samlEntityId: String
  samlAcsUrl: String
  samlX509Certificate: String
  samlLogoutUrl: String

  // OIDC fields
  oidcIssuer: String
  oidcAuthorizationEndpoint: String
  oidcTokenEndpoint: String
  oidcUserInfoEndpoint: String
  oidcClientId: String
  oidcClientSecret: String (encrypted)
  oidcScopes: List<String>

  // Role mapping
  defaultRole: OrganizationRole
  roleAttribute: String
  roleMapping: Map<String, OrganizationRole>

  createdAt: LocalDateTime
  updatedAt: LocalDateTime
}
```

### OrganizationMember updates

- Add `provisionedBy` field to track SCIM/SSO-provisioned users.
- Add `identityProviderId` to link members to the IdP that created them.

## Authentication Flow

### SAML 2.0 Flow

```
1. User visits Zenvyra login page and enters email domain.
2. Backend resolves domain to OrganizationIdentityProvider.
3. Backend returns SAML request URL / form post.
4. Browser redirects to IdP.
5. IdP authenticates user and POSTs SAML response to /sso/saml/acs/{providerId}.
6. Backend validates signature, extracts NameID and attributes.
7. Backend finds or creates OrganizationMember.
8. Backend issues JWT access/refresh cookies.
9. Browser redirects to /dashboard.
```

### OIDC Flow

```
1. User visits Zenvyra login page and enters email domain.
2. Backend resolves domain to OrganizationIdentityProvider.
3. Backend redirects browser to IdP authorization endpoint.
4. IdP returns authorization code to /sso/oidc/callback/{providerId}.
5. Backend exchanges code for tokens.
6. Backend fetches userinfo and validates claims.
7. Backend finds or creates OrganizationMember.
8. Backend issues JWT access/refresh cookies.
9. Browser redirects to /dashboard.
```

## API Endpoints

```
POST   /api/v1/admin/sso/providers              Create a new IdP configuration (admin only)
GET    /api/v1/admin/sso/providers              List IdP configurations for organization
GET    /api/v1/admin/sso/providers/{id}         Get IdP configuration
PUT    /api/v1/admin/sso/providers/{id}         Update IdP configuration
DELETE /api/v1/admin/sso/providers/{id}         Disable/remove IdP configuration

POST   /sso/saml/acs/{providerId}               SAML Assertion Consumer Service
GET    /sso/saml/metadata/{providerId}          Public SAML service-provider metadata
POST   /sso/saml/sls/{providerId}               SAML Single Logout Service

GET    /sso/oidc/initiate/{providerId}          Start OIDC authorization flow
GET    /sso/oidc/callback/{providerId}          OIDC callback handler
```

## Security Considerations

- Store `oidcClientSecret` and private SAML signing keys encrypted at rest.
- Validate SAML signatures and assertion timestamps strictly.
- Use `state` and `nonce` parameters for OIDC to prevent CSRF and replay attacks.
- Restrict SSO configuration to organization owners and admins.
- Log SSO login, provisioning, and deprovisioning events for audit.
- Enforce domain verification before an IdP can be activated.

## UI Placement

- Add an "Authentication" section under Settings.
- Allow owners/admins to upload SAML metadata or paste OIDC discovery URL.
- Show a read-only SAML metadata URL for IT administrators.
- Display domain routing hints on the login page.

## Future Enhancements

- Just-in-Time (JIT) provisioning of organization members.
- Force-SSO option that disables password login for the organization.
- Session synchronization with IdP single logout (SLO).
- Support for multiple active identity providers per organization.
