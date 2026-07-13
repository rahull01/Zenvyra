# Pricing Strategy

## Overview

Zenvyra uses a tiered pricing model based on plan type and usage limits. The plans are configured in `PRICING_PLANS` in `frontend/lib/pricing-plans.ts`.

## Plans

- **Free**: 3 AI systems, basic scanning
- **Starter**: 10 AI systems, active scanning
- **Pro**: 25 AI systems, full evidence pack
- **Enterprise**: Unlimited AI systems, custom integrations

## Entitlements

Each plan maps to a product ID in the Dodo payments system. The entitlements are enforced at the backend level using `SubscriptionRepository` and `User.plans`.

## Pricing Page

The pricing page is located at `frontend/app/(marketing)/pricing/page.tsx` and includes:
- Feature comparison table
- Plan pricing cards
- FAQ section
- Setup package details

## Billing

Billing is handled through Dodo Payments (dodopayments.com) integration. The `dodo.ts` client handles:
- Checkout session creation
- Subscription management
- Webhook handling
- Product ID mapping