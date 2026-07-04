# Zenvyra 10/10 Unicorn Launch Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Transform Zenvyra from a broad compliance platform into a focused, launch-ready, unicorn-worthy SaaS targeting AI startups with AI Act + GDPR compliance.

**Architecture:** Narrow the product to a high-value wedge, harden production readiness, build viral distribution, and launch with premium pricing.

**Tech Stack:** Spring Boot 3.2, Next.js 14, MongoDB Atlas, Redis Cloud, OpenAI GPT-4, Dodo Payments, Resend, Sentry.

---

## Strategic Decisions (Lock These First)

1. **ICP**: AI startups building LLM products, worried about EU AI Act + GDPR.
2. **Positioning**: "AI Act compliance for AI startups — scan, fix, certify in minutes."
3. **Pricing**:
   - Free: 1 scan/month
   - Starter: $49/month
   - Pro: $199/month
   - Enterprise: $999+/month
4. **Launch Date**: End of current month.
5. **Distribution**: Product Hunt + SEO + Twitter/LinkedIn outreach.

---

## Week 1: Foundation & Focus

### Task 1: Lock ICP Positioning
- **Files:**
  - Modify: `frontend/app/(marketing)/page.tsx`
  - Modify: `frontend/lib/seo-schema.ts`
  - Modify: `frontend/app/layout.tsx`
- **Steps:**
  - [ ] Rewrite hero headline to "AI Act compliance for AI startups"
  - [ ] Update meta description to focus on AI Act + GDPR
  - [ ] Update SEO schema
  - [ ] Verify with `npm run build`

### Task 2: Lock New Pricing
- **Files:**
  - Modify: `shared/constants/pricing-plans.ts`
  - Modify: `frontend/lib/pricing-plans.ts`
  - Modify: `frontend/app/(marketing)/pricing/page.tsx`
- **Steps:**
  - [ ] Update plan names and prices
  - [ ] Update feature gating
  - [ ] Create/update Dodo product IDs in env
  - [ ] Verify pricing page renders correctly

### Task 3: Fix Failing Backend Test
- **Files:**
  - Read: `backend/target/surefire-reports/com.zenvyra.controller.AiActControllerWebMvcTest.txt`
  - Modify: `backend/src/test/java/com/zenvyra/controller/AiActControllerWebMvcTest.java` or related config
- **Steps:**
  - [ ] Read error report
  - [ ] Identify root cause (likely missing mock/config)
  - [ ] Fix test
  - [ ] Run `mvn test -Dtest=AiActControllerWebMvcTest`
  - [ ] Verify all tests pass

### Task 4: Align Java Version
- **Files:**
  - Modify: `backend/pom.xml`
  - Modify: `README.md`
  - Verify: `backend/Dockerfile`
  - Verify: `.github/workflows/backend-ci.yml`
- **Steps:**
  - [ ] Change `<java.version>17</java.version>` to `21`
  - [ ] Update README if needed
  - [ ] Verify Dockerfile uses Java 21
  - [ ] Verify CI uses JDK 21
  - [ ] Run build to confirm

### Task 5: Remove Duplicate Dashboard Routes
- **Files:**
  - Investigate: `frontend/app/(dashboard)/dashboard/`
  - Compare: `frontend/app/(dashboard)/`
- **Steps:**
  - [ ] List files in duplicate folder
  - [ ] Check imports/references
  - [ ] Delete duplicates if unused
  - [ ] Verify build passes

### Task 6: Remove Duplicate Marketing Components
- **Files:**
  - Investigate: `frontend/components/marketing/Footer.tsx`
  - Investigate: `frontend/components/marketing/footer/Footer.tsx`
  - Similar for Hero
- **Steps:**
  - [ ] Find all component variants
  - [ ] Check which are imported
  - [ ] Delete unused variants
  - [ ] Update imports
  - [ ] Verify build passes

### Task 7: Add OpenAI Resilience
- **Files:**
  - Modify: `backend/src/main/java/com/zenvyra/config/OpenAiConfig.java`
  - Modify: `backend/src/main/java/com/zenvyra/service/OpenAiService.java`
- **Steps:**
  - [ ] Add WebClient timeout (10s connect, 30s read)
  - [ ] Add retry with exponential backoff (3 attempts)
  - [ ] Add graceful fallback when OpenAI fails
  - [ ] Add test for fallback behavior

### Task 8: Add Scan Rate Limiting
- **Files:**
  - Modify: `backend/src/main/java/com/zenvyra/security/RateLimitFilter.java`
  - Modify: `backend/src/main/java/com/zenvyra/security/RedisRateLimiter.java`
- **Steps:**
  - [ ] Add per-IP free scan limit (e.g., 5/day)
  - [ ] Add per-user authenticated scan limit based on plan
  - [ ] Add tests
  - [ ] Verify with Redis running

### Task 9: Tighten CORS Config
- **Files:**
  - Modify: `backend/src/main/java/com/zenvyra/config/SecurityConfig.java`
- **Steps:**
  - [ ] Replace `allowedMethods("*")` with explicit list
  - [ ] Replace `allowedHeaders("*")` with required headers
  - [ ] Add test for CORS behavior

### Task 10: Review CSRF Strategy
- **Files:**
  - Review: `backend/src/main/java/com/zenvyra/config/SecurityConfig.java`
- **Steps:**
  - [ ] Document decision: keep CSRF cookie-based or remove for stateless JWT
  - [ ] Implement decision
  - [ ] Update tests if needed

---

## Week 2: Legal & Trust

### Task 11: Lawyer Review
- **Files:**
  - Create: `docs/legal/terms-reviewed.md`
  - Create: `docs/legal/privacy-reviewed.md`
  - Modify: `frontend/app/(marketing)/terms/page.tsx`
  - Modify: `frontend/app/(marketing)/privacy/page.tsx`
- **Steps:**
  - [ ] Hire lawyer via Upwork/LawTrades
  - [ ] Send current terms + privacy
  - [ ] Get reviewed versions
  - [ ] Update pages

### Task 12: Add Legal Disclaimers
- **Files:**
  - Modify: `frontend/app/p/[companySlug]/[policyType]/page.tsx`
  - Modify: `frontend/app/(dashboard)/scanner/[id]/results/page.tsx`
  - Modify: `frontend/components/policies/PolicyPreview.tsx`
- **Steps:**
  - [ ] Add "Not legal advice" banner to generated policies
  - [ ] Add disclaimer to scan reports
  - [ ] Add disclaimer to certificates

### Task 13: Configure Sentry Frontend
- **Files:**
  - Modify: `frontend/next.config.js`
  - Modify: `frontend/app/global-error.tsx`
  - Modify: `frontend/app/layout.tsx`
- **Steps:**
  - [ ] Sign up Sentry
  - [ ] Add Sentry Next.js integration
  - [ ] Add DSN to env
  - [ ] Test error capture

### Task 14: Configure Sentry Backend
- **Files:**
  - Modify: `backend/pom.xml`
  - Modify: `backend/src/main/resources/application.yml`
  - Modify: `backend/src/main/java/com/zenvyra/exception/GlobalExceptionHandler.java`
- **Steps:**
  - [ ] Add Sentry Spring Boot dependency
  - [ ] Add DSN config
  - [ ] Integrate with exception handler
  - [ ] Test error capture

### Task 15: Set Up MongoDB Atlas
- **Steps:**
  - [ ] Create Atlas cluster
  - [ ] Configure network access
  - [ ] Create database user
  - [ ] Update `MONGODB_URI`
  - [ ] Enable automated backups
  - [ ] Set backup retention to 30 days

### Task 16: Test Backup Restore
- **Steps:**
  - [ ] Trigger manual backup
  - [ ] Restore to staging database
  - [ ] Start backend against staging
  - [ ] Verify collections: users, websites, policies, banners, consent_logs, subscriptions
  - [ ] Document restore drill

### Task 17: Configure Resend Email
- **Files:**
  - Verify: `backend/src/main/resources/application.yml`
  - Modify: `.env.production.example`
- **Steps:**
  - [ ] Sign up Resend
  - [ ] Add domain
  - [ ] Verify SPF/DKIM/DMARC
  - [ ] Send test emails (welcome, reset, alert)
  - [ ] Verify inbox delivery

### Task 18: Add Trust Page
- **Files:**
  - Create: `frontend/app/(marketing)/security/page.tsx`
  - Modify: `frontend/components/marketing/Footer.tsx`
- **Steps:**
  - [ ] Write security/trust content
  - [ ] Mention encryption, backups, access controls
  - [ ] Mention SOC 2 readiness
  - [ ] Link in footer

---

## Week 3: Viral Engine & GTM

### Task 19: Polish Free AI Act Scanner
- **Files:**
  - Modify: `frontend/app/free-privacy-scanner/page.tsx`
  - Modify: `frontend/app/(dashboard)/scanner/[id]/results/page.tsx`
  - Modify: `backend/src/main/java/com/zenvyra/service/ScanService.java`
- **Steps:**
  - [ ] Rename/rebrand free scanner to "AI Act Compliance Scan"
  - [ ] Make results shareable (URL + OG image)
  - [ ] Show clear score + top 5 issues + AI Act-specific risks
  - [ ] Add CTA to sign up

### Task 20: Build AI Act PDF Report
- **Files:**
  - Modify: `backend/src/main/java/com/zenvyra/service/AiActExportService.java`
  - Create: `frontend/app/(dashboard)/ai-act/page.tsx`
  - Modify: `frontend/lib/api.ts`
- **Steps:**
  - [ ] Ensure backend generates PDF
  - [ ] Build UI to request/download report
  - [ ] Gate behind Pro/Enterprise
  - [ ] Test download

### Task 21: Build Shareable Compliance Badge
- **Files:**
  - Modify: `backend/src/main/java/com/zenvyra/service/BadgeImageService.java`
  - Modify: `backend/src/main/java/com/zenvyra/service/CertificateService.java`
  - Create: `frontend/components/dashboard/BadgeEmbed.tsx`
- **Steps:**
  - [ ] Generate badge image
  - [ ] Build embed code snippet
  - [ ] Link badge to public verification page
  - [ ] Test embed on external site

### Task 22: Set Up Product Hunt Launch
- **Files:**
  - Create: `docs/launch/product-hunt-assets.md`
- **Steps:**
  - [ ] Prepare gallery images (3-5)
  - [ ] Write tagline + description
  - [ ] Create maker profile
  - [ ] Draft first comment
  - [ ] Schedule launch

### Task 23: Build Waitlist Page
- **Files:**
  - Create: `frontend/app/waitlist/page.tsx`
  - Modify: `frontend/lib/api.ts`
  - Modify: `backend/src/main/java/com/zenvyra/controller/ScannerLeadController.java`
- **Steps:**
  - [ ] Build waitlist landing page
  - [ ] Add email capture
  - [ ] Store leads in MongoDB
  - [ ] Add "First 100 get 50% off lifetime" messaging
  - [ ] Connect to Dodo coupon logic

### Task 24: Write 5 SEO Articles
- **Files:**
  - Create: `frontend/app/blog/ai-act-checklist-2026/page.tsx`
  - Create: `frontend/app/blog/gdpr-for-ai-startups/page.tsx`
  - Create: `frontend/app/blog/llm-consent-requirements/page.tsx`
  - Create: `frontend/app/blog/ai-act-fines-explained/page.tsx`
  - Create: `frontend/app/blog/building-trustworthy-ai/page.tsx`
- **Steps:**
  - [ ] Write each article (1500+ words)
  - [ ] Add internal links to product
  - [ ] Optimize meta tags
  - [ ] Publish

### Task 25: Create Demo Video
- **Steps:**
  - [ ] Record 3-min Loom walkthrough
  - [ ] AI Act scan → policy generation → badge embed
  - [ ] Add to homepage
  - [ ] Add to Product Hunt gallery

### Task 26: Content Calendar
- **Files:**
  - Create: `docs/launch/content-calendar.md`
- **Steps:**
  - [ ] Plan 30 days of Twitter/LinkedIn posts
  - [ ] Schedule founder journey content
  - [ ] Schedule product tips
  - [ ] Schedule compliance news commentary

---

## Week 4: Launch

### Task 27: Soft Launch to Waitlist
- **Steps:**
  - [ ] Send personal onboarding emails to 50 waitlist users
  - [ ] Onboard manually via calls/loom
  - [ ] Collect feedback in spreadsheet
  - [ ] Activate 10+ users

### Task 28: Collect Testimonials
- **Steps:**
  - [ ] Ask 5 beta users for testimonials
  - [ ] Collect logos
  - [ ] Add to homepage
  - [ ] Add to Product Hunt page

### Task 29: Product Hunt Launch Day
- **Steps:**
  - [ ] Launch on Product Hunt
  - [ ] Respond to every comment within 15 minutes
  - [ ] Rally supporters on Twitter/LinkedIn
  - [ ] Track upvotes and traffic

### Task 30: Outreach to AI Startup Founders
- **Steps:**
  - [ ] Build list of 100 AI startup founders
  - [ ] Send personalized LinkedIn DMs
  - [ ] Send personalized cold emails
  - [ ] Track replies and demos booked

### Task 31: Public Launch Announcement
- **Steps:**
  - [ ] Post on Indie Hackers
  - [ ] Post on relevant subreddits (r/SaaS, r/artificial, r/OpenAI)
  - [ ] Submit to AI newsletters (The Rundown, Ben's Bites, TLDR AI)
  - [ ] Twitter thread announcement
  - [ ] LinkedIn post

---

## Post-Launch (Week 5+)

### Task 32: Analyze Conversion Funnel
- **Steps:**
  - [ ] Track scan → signup → paid conversion
  - [ ] Identify top 3 drop-offs
  - [ ] A/B test pricing page
  - [ ] Implement top improvements

### Task 33: Add OpenAI Cost Alerts
- **Files:**
  - Modify: `backend/src/main/java/com/zenvyra/service/OpenAiService.java`
  - Modify: `backend/src/main/java/com/zenvyra/config/OpenAiConfig.java`
- **Steps:**
  - [ ] Track daily OpenAI spend
  - [ ] Add alert threshold
  - [ ] Add per-account usage caps
  - [ ] Test alert

---

## Launch Gates (Go/No-Go Checklist)

Before public launch, ALL of these must be true:

- [ ] `mvn test` passes
- [ ] `npm run build` passes
- [ ] All Java versions aligned to 21
- [ ] No duplicate routes/components
- [ ] Lawyer reviewed public terms + privacy
- [ ] Sentry configured frontend + backend
- [ ] MongoDB Atlas + backups live
- [ ] Backup restore tested
- [ ] Resend email verified
- [ ] Dodo Payments live webhooks tested
- [ ] Pricing page updated
- [ ] Homepage positioning updated
- [ ] AI Act scanner works end-to-end
- [ ] 3+ testimonials collected
- [ ] Product Hunt page ready

---

## Scorecard Targets

| Metric | Current | 30-Day Target |
|---|---|---|
| Unicorn Potential | 4.5/10 | 7/10 |
| Production Readiness | 6/10 | 9/10 |
| Codebase Maturity | 7/10 | 9/10 |
| Feature Completeness | 8/10 | 9/10 |
| Go-To-Market Clarity | 5/10 | 8/10 |

---

## Execution Options

**Option 1: Subagent-Driven (recommended)**
- Fresh subagent per task
- Review between tasks
- Fast iteration

**Option 2: Inline Execution**
- Execute tasks in this session
- Batch execution with checkpoints

Choose one to begin.
