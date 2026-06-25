# Webflow Installation Guide

Last reviewed: 2026-06-07

This guide explains how agencies install Zenvyra on Webflow sites for UK/US privacy proof workflows. The installation supports consent banner deployment, hosted policy links, DSAR or consumer request intake, public certificate links, and recurring monitoring evidence.

Zenvyra provides operational privacy documentation and monitoring evidence. It does not replace legal advice from qualified counsel.

## Installation Outcomes

After installation, the Webflow site should have:

- Consent banner deployed through site-level custom code.
- Hosted privacy and cookie policy links in the site footer.
- DSAR or consumer request workflow available from the privacy page.
- Public certificate or badge that only exposes privacy-safe site status.
- Monitoring for script changes, embedded tools, tag managers, forms, and policy drift.

## Before You Start

Create these records in Zenvyra:

- Website record for the Webflow custom domain.
- Consent banner for the site.
- Hosted policy drafts reviewed by the operator or customer.
- DSAR or consumer request form.
- Public certificate for the site.

Required values:

- `bannerId`
- public banner script URL
- hosted policy URLs
- request form URL
- certificate verification URL

## Recommended Agency Setup

For agency-managed Webflow sites:

1. Create one agency workspace.
2. Add the Webflow site as a client site.
3. Record the Webflow project name, published domains, and workspace owner.
4. Record whether the site uses GTM, Webflow forms, analytics, chat, embedded scheduling, or ad pixels.
5. Enable monthly proof pack delivery for the client.

## Install In Webflow Site Settings

Use this path for most Webflow sites.

1. Open the Webflow project.
2. Go to Site Settings > Custom Code.
3. Paste the Zenvyra banner script in the Head Code field.
4. Save changes.
5. Publish to the relevant domains.
6. Open the published domain in a private browser window and confirm the banner appears.

Example placeholder:

```html
<script
  src="https://app.zenvyra.com/api/banners/public/YOUR_BANNER_ID/banner.js"
  defer
></script>
```

Replace `YOUR_BANNER_ID` with the real banner id from the dashboard.

## Footer And Utility Pages

Add or update footer links:

- Privacy Policy: hosted Zenvyra privacy policy URL.
- Cookie Policy: hosted Zenvyra cookie policy URL.
- Privacy Requests: DSAR or consumer request form URL.
- Privacy Certificate: public verification URL.

For high-converting sites, keep the certificate link visible but restrained. It should build trust without looking like a legal guarantee.

## Embedded Tools Review

Webflow sites often include third-party tools through embeds, GTM, or custom code. Review:

- GTM containers.
- Analytics scripts.
- Ad pixels.
- Chat widgets.
- Scheduling embeds.
- Form tools.
- Video players.
- Heatmaps and session replay.

Run a Zenvyra scan after any Webflow publish that changes scripts, forms, analytics, marketing pages, or embedded tools.

## Verification Checklist

Before marking installation complete:

- Banner appears on homepage, pricing or services page, contact page, and privacy page.
- Non-essential trackers do not load before consent where blocking is configured.
- Accept, reject, and preferences actions create consent evidence.
- Hosted policy links resolve publicly.
- DSAR or consumer request form submits successfully.
- Public certificate does not expose private customer data or agency notes.
- Published custom domains are scanned, not only the Webflow staging domain.

## Common Webflow Issues

| Issue | Likely cause | Fix |
| --- | --- | --- |
| Banner works in Designer preview but not published site | Site not republished after custom code change | Republish all target domains. |
| Banner not visible on custom domain | Script added to staging or wrong project | Verify the published domain and project settings. |
| Trackers load before consent | GTM or embed loads scripts directly | Move scripts behind consent categories or configure consent-aware tags. |
| Policy links point to old pages | Footer component was not updated globally | Update the shared footer component and republish. |
| Certificate exposes internal notes | Manual page copied dashboard details | Use the public verification URL only. |

## Client Handoff

Send the client:

- Published domains covered.
- Public policy links.
- Privacy request form URL.
- Public certificate URL.
- First scan score and open remediation items.
- Reminder that Zenvyra is an operational privacy workflow and not legal advice.

