# WordPress Installation Guide

Last reviewed: 2026-06-07

This guide explains how an agency or site owner installs Zenvyra on a WordPress website for UK/US privacy proof workflows. The installation supports consent banner deployment, hosted policy links, DSAR intake, public certificate links, and monthly monitoring evidence.

Zenvyra provides operational privacy documentation and monitoring evidence. It does not replace legal advice from qualified counsel.

## Installation Outcomes

After installation, the WordPress site should have:

- A Zenvyra consent banner loading before non-essential marketing or analytics scripts.
- Hosted policy links for privacy policy, cookie policy, and terms where configured.
- A DSAR or consumer request link in the footer or privacy page.
- A public privacy certificate or badge that only exposes privacy-safe site status.
- Monitoring enabled for tracker drift, policy drift, and missing evidence.

## Before You Start

Create these records in Zenvyra:

- Website record for the WordPress domain.
- Consent banner for the website.
- Hosted policy drafts reviewed by the operator or customer.
- DSAR form for privacy rights requests.
- Public certificate for the website.

Required values:

- `bannerId`
- public banner script URL
- hosted policy URLs
- DSAR form URL
- certificate verification URL

## Recommended Agency Setup

For agency-managed WordPress sites:

1. Create one agency workspace.
2. Add each client as a client site.
3. Store the WordPress admin URL and technical contact on the client record.
4. Assign an implementation owner and review owner.
5. Enable monthly proof pack delivery for the client.

Use the agency name only where the client has approved white-label branding.

## Install With Header/Footer Injection

Use this path when the site already has a trusted header/footer script manager.

1. Open WordPress admin.
2. Install or open the existing header/footer code manager.
3. Paste the Zenvyra banner script into the global header.
4. Place it as high in the head as the theme allows.
5. Save and clear any WordPress, CDN, or host cache.
6. Open the site in a private browser window and confirm the banner appears.

Example placeholder:

```html
<script
  src="https://app.zenvyra.com/api/banners/public/YOUR_BANNER_ID/banner.js"
  defer
></script>
```

Replace `YOUR_BANNER_ID` with the real banner id from the dashboard.

## Install With Theme Template

Use this path only when the agency controls the theme or child theme.

1. Open the active child theme.
2. Add the banner script to the document head.
3. Avoid editing parent theme files directly.
4. Commit the theme change if the site is managed in Git.
5. Deploy through the normal agency release process.

## Footer Links

Add these links to the WordPress footer, privacy page, or legal menu:

- Privacy Policy: hosted Zenvyra privacy policy URL.
- Cookie Policy: hosted Zenvyra cookie policy URL.
- Privacy Requests: DSAR or consumer request form URL.
- Privacy Certificate: public verification URL.

For UK websites, keep cookie and tracking language aligned with UK GDPR and PECR expectations. For US websites, describe consumer privacy request workflows without claiming automatic legal compliance.

## Verification Checklist

Before marking installation complete:

- Banner loads on the homepage and at least three high-traffic pages.
- Non-essential trackers do not load before consent where blocking is configured.
- Accept, reject, and preferences actions create consent evidence.
- Policy links resolve publicly.
- DSAR or consumer request form submits successfully.
- Public certificate page does not expose private customer data, emails, or internal notes.
- Zenvyra monitoring scan is run after cache clear.

## Common WordPress Issues

| Issue | Likely cause | Fix |
| --- | --- | --- |
| Banner does not appear | Cache, optimization plugin, or wrong banner id | Clear cache and verify the script URL. |
| Banner appears late | Script placed near footer | Move script into the head area. |
| Trackers fire before consent | Tag manager or plugin loads scripts independently | Move scripts behind consent categories or configure GTM consent mode. |
| Policy page is stale | Static WordPress page was copied from an older draft | Link to the hosted policy URL or update the static copy. |
| Certificate exposes too much | Custom page copied internal data | Use the public verification URL only. |

## Client Handoff

Send the client:

- Installed banner location.
- Public policy links.
- Public certificate link.
- First scan score and open remediation items.
- Reminder that Zenvyra is an operational privacy workflow and not legal advice.

