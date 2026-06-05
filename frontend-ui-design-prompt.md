# Frontend Design Prompt — ComplianceAI Pro Unicorn SaaS UI

## Purpose
Yeh file ek detailed frontend design brief hai jo tumhare dost ko uske product ke landing page aur dashboard ko unicorn SaaS level pe le jaane mein madad karega.

Use this prompt to design a frontend with the same premium style, motion, and visual polish as ComplianceAI Pro. Backend features aur workflow already similar hain: website scanning, policy generation, competitor analysis, real-time monitoring, team collaboration, and payment integration.

---

## Product Positioning
- Product name: `ComplianceAI Pro`
- Tagline: `AI-Powered Compliance Automation SaaS Platform`
- Value proposition: automate website compliance, generate legal documents, monitor changes, and manage teams from one polished dashboard.
- Tone: enterprise-grade, modern, confident, simple yet powerful.

### Key offerings to highlight
- Website Compliance Scanning
- AI-Powered Policy Generation
- Competitor Analysis
- Real-time Monitoring & Alerts
- Multi-language Document Generation
- Team Collaboration with Role-based Access
- Payment / Subscription Management
- Compliance Scoring & Dashboard Analytics

---

## 1. Brand Mood & Visual Identity
- Premium SaaS styling with polished glassy surfaces and bold brand color usage.
- Clean minimal base with white / soft-slate cards and deep dark backgrounds for contrast.
- Use green as the primary accent and cyan / indigo for secondary emphasis.
- Add soft glowing radial gradients and floating color blobs behind hero sections.
- Use rounded corners and premium card shadows so the UI feels modern and expensive.

### Primary palette
- Brand Green: `#22c55e`
- Dark surface: `#0f172a` / `#020617`
- Light surface: `#ffffff` / `#f8fafc`
- Slate text: `#0f172a`, `#475569`, `#94a3b8`
- Accent cyan: `#06b6d4`
- Accent indigo: `#4f46e5`

### Semantic colors
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#22c55e`

---

## 2. Typography
- Primary fonts: `Inter` + `Outfit`
- Headings: bold, black weight, strong presence.
- Body: medium weight, high readability, comfortable line-height.
- Microcopy / tags: uppercase, letter-spaced, high contrast.

### Scale guidance
- Hero headline: extra-large (`text-5xl` to `text-6xl`)
- Section headings: `text-3xl` / `text-4xl`
- Body text: `text-base` / `text-lg`
- Captions: `text-sm` with uppercase tracking.

---

## 3. Global Layout
- Centered max-width container on desktop (`max-w-6xl` / `max-w-7xl`).
- Generous vertical spacing between sections.
- Soft radial glow backgrounds and muted floating gradients behind hero/content.
- Keep page structure consistent across marketing and dashboard.

### Header
- Fixed top navigation with glassy transparency.
- Branding on the left, nav links in center, CTA actions on the right.
- Nav: `Features`, `Pricing`, `Resources`, `Company`.
- Actions: `Log In`, `Start Free`.
- Mobile menu: hamburger toggle, stacked links, visible CTA buttons.
- Scroll behavior: header becomes more opaque with border / shadow.

### Footer
- Minimal styling with light border top.
- Include simple brand reminder, link cluster, and trust copy.

---

## 4. Hero Section
### Layout
- Two-column hero: text and CTA on left, product preview on right.
- Background: light gradient from off-white to pale blue.
- Top badge/chip: `AI-Powered Compliance Automation`.
- Headline: bold, high-conversion copy.
- Subtext: describe scanning, policy generation, monitoring, and team workflows.

### Example hero copy
- Headline: `Launch faster with compliance already handled.`
- Supporting text: `Scan websites, generate legal policies, and monitor regulatory risk with AI.`
- Secondary line: `Automate GDPR, CCPA, accessibility, and policy compliance across products and teams.`

### Scan CTA block
- Rounded input card with soft border and shadow.
- URL input placeholder: `https://your-company.com`.
- Primary CTA: `Scan Now` with icon and spinner state.
- Show proof metrics below the form for trust.

### Preview panel
- Right-side dashboard preview with dark outer card and white analytics card inside.
- Report summary header: `Compliance report`, site label, healthy status badge.
- Compliance score display with large numeric score and progress bar.
- Check metrics: privacy policy coverage, cookie consent parity, regional data rights.
- Bottom highlight note: priority fixes ready.

---

## 5. Marketing Section Patterns
### Features grid
- Responsive 3-4 column card layout.
- Each card has icon, bold title, short value-focused copy.
- Highlight advanced AI policy generation, competitor analysis, real-time monitoring, and enterprise features.

### How it works
- 3–4 step process section.
- Each step shows a number/icon and concise copy.
- Example: `Scan`, `Analyze`, `Generate`, `Monitor`.

### Trust / social proof
- Centered trusted-by logos or customer list.
- Soft text and subtle hover emphasis.

### Pricing / CTA
- Pricing cards with strong tier labels.
- CTA button: `Start Free` or `Book Demo`.
- End section: strong brand CTA and supporting value line.

---

## 6. Dashboard / Product UI
Friend ka product ka frontend bhi polished SaaS hona chahiye, jisse usage aur features enterprise quality lage.

### Dashboard style
- White/light page background with soft slate cards.
- Rounded `2xl` cards, subtle border, premium shadow.
- Clear product sections: `Dashboard`, `Scan`, `Websites`, `Policies`, `Monitoring`, `Competitors`, `Team`, `Settings`, `Billing`.
- Status badges: green for healthy, amber for warning, red for issue.

### Core dashboard content
- Summary cards: `Active scans`, `Compliance score`, `Monitored domains`, `Priority issues`.
- Live monitoring panel with region or alert counts.
- Scan results summary with issue severities.
- Policy generation quick actions.
- Competitor insights preview.
- Team and billing status widget.

### Visual structure
- Use cards with concise metrics and action buttons: `Rescan`, `View report`, `Resolve issue`.
- Display score trends with a chart or progress gauge.
- Show a `Priority fixes` list with checkmarks and short action copy.
- Add a `Recent activity` timeline or update log.

---

## 7. Component Style Guide
### Buttons
- Primary: `bg-brand-500`, `text-slate-950`, uppercase, `font-black`, rounded-xl.
- Secondary: white / neutral with border and subtle hover.
- Ghost: transparent with accent text and hover background.

### Inputs
- Clean background: `#f8fafc` or `#ffffff`.
- Soft border: `1px solid #cbd5e1`.
- Rounded corners: `1.5rem`.
- Placeholder color: `#94a3b8`.

### Cards
- Background: `#ffffff` / `#f8fafc`.
- Border: `1px solid rgba(15, 23, 42, 0.1)`.
- Shadow: `0 24px 48px -24px rgba(15, 23, 42, 0.18)`.
- Border radius: `1.25rem` to `2rem`.

### Badges
- Rounded full pills.
- Use semantic background colors: `emerald-50`, `cyan-50`, `indigo-50`, `rose-50`.
- Uppercase bold microcopy.

### Iconography
- Simple modern icons (Lucide-style recommended).
- Use icons for trust, scan, report, policy, monitor, and security.
- Icon color should reflect meaning: green for success, cyan for info, red for alerts.

---

## 8. Animation & Interaction
- Section reveal animations on scroll.
- Header scroll transition with blur.
- Button hover: slight scale and deeper accent.
- Progress bar fill animations.
- Floating CTA or subtle motion in hero.
- Smooth toast / modal transitions for scan feedback.

---

## 9. SaaS Messaging
Use messaging that reflects enterprise compliance and AI automation.
- `AI-powered automation`
- `Compliance monitoring in real time`
- `Legal document generation`
- `Built for teams and enterprise`
- `Scales with your product`
- `Secure, modern, reliable`

### Suggested copy examples
- `Scan any website for compliance gaps in seconds.`
- `Generate privacy policies, terms, and cookie notices automatically.`
- `Monitor your product continuously for legal and regulatory changes.`
- `Manage your team, permissions, and payments from one dashboard.`

---

## 10. Designer / Developer Instructions
- Build the landing page as a polished enterprise SaaS brand with an AI-first compliance narrative.
- Keep hero, feature, and pricing sections visually strong and consistent.
- Make the product preview panel look like a real compliance analytics dashboard.
- Use consistent spacing, rounded cards, and premium shadow accents.
- The final UI should feel modern, trustworthy, and worthy of a unicorn SaaS startup.

---

## 11. Why this works for your friend
- The backend features can stay advanced and differentiated.
- This brief makes the frontend look like a true enterprise SaaS product.
- It preserves the existing product value while elevating the brand.
- The UI will feel investor-ready and fit for enterprise customers.

---

## 12. Use this file as the single design spec
- File: `frontend-ui-design-prompt.md`
- Share it with the UI/UX designer or frontend developer.
- Tell them: `Build a new UI from this prompt, but keep your product’s feature set intact.`
