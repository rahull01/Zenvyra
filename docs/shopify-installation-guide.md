# Shopify Installation Guide

Last reviewed: 2026-06-07

This guide explains how agencies and ecommerce operators install Zenvyra on Shopify stores for UK/US privacy proof workflows. The installation supports consent banner deployment, hosted policy links, consumer request intake, public certificate links, and recurring monitoring evidence.

Zenvyra provides operational privacy documentation and monitoring evidence. It does not replace legal advice from qualified counsel.

## Installation Outcomes

After installation, the Shopify store should have:

- Consent banner deployment across storefront pages.
- Policy links in the footer, checkout policy area where available, and customer support flows.
- DSAR or consumer request form linked from privacy pages.
- Public privacy certificate or badge that only exposes privacy-safe status.
- Monitoring for new pixels, apps, scripts, policy drift, and missing proof evidence.

## Before You Start

Create these records in Zenvyra:

- Website record for the Shopify primary domain.
- Consent banner for the store.
- Hosted policy drafts for privacy, cookies, and terms where configured.
- Consumer request form for access, deletion, correction, opt-out, or appeal workflows.
- Public certificate for the store.

Required values:

- `bannerId`
- public banner script URL
- hosted policy URLs
- consumer request form URL
- certificate verification URL

## Recommended Agency Setup

For agency-managed Shopify stores:

1. Create one agency workspace.
2. Add the store as a client site.
3. Record the Shopify store URL, primary market, and storefront theme name.
4. Record whether the client uses Shopify Customer Privacy API, Shopify pixels, GTM, or app-based trackers.
5. Enable monthly proof pack delivery for the client.

## Install In Shopify Theme

Use this path when the agency has theme access.

1. Open Shopify admin.
2. Go to Online Store > Themes.
3. Duplicate the live theme before editing.
4. Open the theme code editor.
5. Add the Zenvyra banner script inside `theme.liquid` before the closing `</head>` tag.
6. Save the theme.
7. Preview the theme and verify the banner appears.
8. Publish only after the verification checklist passes.

Example placeholder:

```html
<script
  src="https://app.zenvyra.com/api/banners/public/YOUR_BANNER_ID/banner.js"
  defer
></script>
```

Replace `YOUR_BANNER_ID` with the real banner id from the dashboard.

## Configure Policy Links

Use Shopify legal policy pages where possible:

- Privacy Policy: hosted Zenvyra privacy policy URL or approved copy.
- Cookie Policy: hosted Zenvyra cookie policy URL.
- Terms: hosted terms URL or approved copy.
- Privacy Requests: DSAR or consumer request form URL.
- Privacy Certificate: public verification URL.

For storefront footer menus, add a clear "Privacy Requests" link so UK/US customers can find the request workflow without contacting support first.

## Tracker And App Review

Shopify stores often add trackers through apps, theme code, pixels, and tag managers. Review:

- Shopify pixels and customer events.
- Marketing apps.
- Review apps.
- Chat widgets.
- Analytics scripts.
- Affiliate scripts.
- GTM containers.

Run a Zenvyra scan after any app install, theme publish, or marketing pixel change.

## Verification Checklist

Before marking installation complete:

- Banner appears on homepage, product page, collection page, cart page, and content page.
- Non-essential trackers do not load before consent where blocking is configured.
- Accept, reject, and preferences actions create consent evidence.
- Policy links resolve publicly.
- Consumer request form submits successfully.
- Public certificate does not expose customer PII, admin email, internal notes, or order data.
- Store scan is rerun after theme publish and cache propagation.

## Common Shopify Issues

| Issue | Likely cause | Fix |
| --- | --- | --- |
| Banner appears on storefront but not all templates | Script added to a section instead of `theme.liquid` | Move script to the global theme head. |
| Pixels fire before banner choice | App or customer event loads independently | Configure consent-aware loading or remove uncontrolled pixel injection. |
| Policy links are duplicated | Shopify static policy and hosted policy both linked | Choose one primary route and keep footer labels clear. |
| Theme update removes script | Script was added to a copied theme only | Repeat installation after theme replacement and rerun scan. |
| Certificate has private details | Manual page copied dashboard data | Use only the public verification URL. |

## Client Handoff

Send the client:

- Installed theme name and install date.
- Public policy links.
- Privacy request form URL.
- Public certificate URL.
- First store scan score and open remediation items.
- Reminder that Zenvyra is an operational privacy workflow and not legal advice.

