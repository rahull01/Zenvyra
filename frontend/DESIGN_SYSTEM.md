# All — Design System
> Brand portfolio by By Credgenics | https://zenvyra.com/

---

## 1. Context and Goals

**Mission:** Deliver a production-ready, token-driven design system for All that gives every contributor unambiguous rules. The result must be structurally consistent, visually distinctive, and accessible — no one-off deviations across pages or components.

**Audience:** Buyers, teams, and decision-makers using the marketing site.

---

## 2. Design Tokens and Foundations

### 2.1 Typography

| Token | Value |
|---|---|
| Primary family | `Helvetica` |
| Stack | `Helvetica, Arial, sans-serif` |
| Base size | `16px` |
| Base weight | `400` |
| Base line-height | `24px` |

#### Size scale

| Token | Value |
|---|---|
| `xs` | 11 px |
| `sm` | 12 px |
| `md` | 14 px |
| `lg` | 15 px |
| `xl` | 16 px |
| `2xl` | 19 px |
| `3xl` | 20 px |
| `4xl` | 24 px |

Body copy must use `md`. Headlines use `3xl` and `4xl`. All weights must stay within the declared scale; one-off exceptions are not permitted.

---

### 2.2 Color Palette

All color values accept either the named token or its hex pairing.

| Semantic role | Token name | Value |
|---|---|---|
| Primary text | `color.text.primary` | `#1f1e33` |
| Secondary text | `color.text.secondary` | `#1c1b2e` |
| Tertiary text | `color.text.tertiary` | `#ffffff` |
| Inverse text | `color.text.inverse` | `#272545` |
| Surface base | `color.surface.base` | `#000000` |
| Surface muted | `color.surface.muted` | `#4469f3` |
| Surface strong | `color.surface.strong` | `#3d46fb` |
| Border strong | `color.border.strong` | `#e9edfd` |

Buttons must use `surface.strong` for primary CTAs. Hover and active secondary surfaces must reference `surface.muted`. Text rendered directly on `surface.base` must be `text.tertiary (#ffffff)` to satisfy the 4.5 : 1 contrast constraint.

---

### 2.3 Spacing Scale

| Token | Value |
|---|---|
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.5` | 20 px |
| `space.6` | 24 px |
| `space.7` | 32 px |
| `space.8` | 40 px |

The baseline spacing unit is `space.4 (16 px)`. All gaps, padding, and margins in component rows must be multiples of this unit; one-off values are prohibited.

---

### 2.4 Radius, Shadow, and Motion

| Token | Value |
|---|---|
| `radius.xs` | 6 px |
| `radius.sm` | 8 px |

| Token | Value |
|---|---|
| `shadow.1` | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.16) 0px 5px 10px 0px` |
| `shadow.2` | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(68, 105, 243, 0.14) 0px 10px 14px 0px` |

| Token | Value |
|---|---|
| `motion.duration.instant` | 150 ms |
| `motion.duration.fast` | 200 ms |

Cards and panels must use `shadow.1`. Elevated interactive elements (primary CTAs, focus rings, modal surfaces) must use `shadow.2`. All transitions must reference a named duration token, not a magic number.

---

## 3. Component-Level Rules

### 3.1 Primary CTA Button

**Intent:** Drive the highest-priority user action.

- **Anatomy:** Label (required), optional leading icon. Padding `space.6` horizontal, `space.3` vertical. Font `md`, weight `600`.
- **Variants:**
  - **Filled / primary** — background `surface.strong`, text `text.tertiary (#ffffff)`.
  - **Gradient / boost** — `linear-gradient(90deg, surface.strong, surface.muted)`, text `text.tertiary`.
- **States:**

| State | Rule |
|---|---|
| Default | `surface.strong` fill, `shadow.2`, `text.tertiary` |
| Hover | Translate `-2 px`, increase shadow spread |
| Focus-visible | `2 px solid surface.muted` ring, offset 2 px |
| Active | Scale to `0.96` |
| Disabled | Opacity `0.45`, `cursor: not-allowed` |
| Loading | Label replaced by spinner, interaction locked |

- **Responsive / edge case:**
  - Full width at `<= md`.
  - If label exceeds one line, clip with `text-overflow: ellipsis` and place a visible tooltip.
- **Keyboard:** Must fire on `Enter` and `Space`.
- **Pointer:** `cursor: pointer` on hover.
- **Touch:** Minimum hit target `44 × 44 px`.

---

### 3.2 Secondary CTA Button

- **Anatomy:** Same as primary; background `surface.muted`, text `text.tertiary`.
- **States:** same transition and shadow rules; hover background deepens to `surface.strong`.
- **Responsive:** same as primary.

---

### 3.3 Tertiary / Outline Button

- **Anatomy:** Border `border.strong (#e9edfd)`, transparent background, text `text.primary`.
- **States:**
  - Hover fill `color.surface.muted at 10% opacity`.
  - Focus ring same as primary (`surface.muted`).
- **Keyboard:** identical behavior to primary.

---

### 3.4 Ghost Button

- **Anatomy:** Transparent, text `text.primary`.
- **Hover:** Background `surface.base at 4% opacity`.
- **Disabled:** opacity `0.4`, no pointer events.
- **Use:** secondary actions within a tertiary or primary row — never the first CTA.

---

### 3.5 Card

- **Anatomy:** `surface.base` background, `shadow.1`, `border.strong`, inner padding `space.6`, `radius.sm`.
- **States:**

| State | Rule |
|---|---|
| Default | `border.strong`, `shadow.1` |
| Hover | translate `-2 px`, `shadow.2` |
| Focus-visible | `surface.muted` ring |
| Active | scale `0.98` |
| Disabled | opacity `0.6`, static |
| Loading | skeleton using `surface.base` pulse |
| Error | "Content unavailable" fallback |

- **Responsive / overflow:** Content must use `overflow: auto`. Long content must scroll; never clip content without a visible affordance.
- **Keyboard:** Card triggers only through a contained interactive element (button or link).

---

### 3.6 Link

- **Default:** `color.surface.strong`, underline absent.
- **Hover:** `color.surface.muted`, underline `1 px dashed`.
- **Visited:** same as default.
- **Focus-visible:** `2 px solid surface.muted`.
- **Active:** opacity `0.8`.
- **Keyboard:** `Enter` navigates, `Space` follows focus convention of browser default link.
- **Pointer/touch:** minimum touch target `44 px`.
- **No placeholder-as-label rule** applies: anchor text must always be descriptive.

---

### 3.7 Navigation Bar

- **Desktop:** Horizontal flex, gaps `space.4`, items vertically centered.
- **States (active item):** `color.surface.strong` with `font-weight: 600`.
- **Hover (inactive):** `color.surface.muted`.
- **Mega-menu sub-panels:** `color.surface.base` background, `border.strong` border, `shadow.2`.
- **Mobile:** Bottom-aligned drawer or drawer above the fold.

---

### 3.8 Input / Form Field

- **Default:** Border `border.strong`, padding `space.4`, text `color.text.primary`.
- **Hover:** border `color.surface.muted at 30%`.
- **Focus-visible:** `border.color.surface.muted`, ring `surface.muted`, offset 2 px.
- **Error:** border `#EF4444`, helper message visible below.
- **Disabled:** opacity `0.5`, cursor `not-allowed`.
- **Empty state:** placeholder must be `text.secondary`.

---

### 3.9 Badge / Tag

- **Default:** `surface.muted` background, `text.tertiary` label, `radius.xs`, `space.1` horizontal padding.
- **Hover:** `surface.strong` background.
- **States:** must not be interactive; use button-wrapped badge if navigation is required.

---

### 3.10 Hero Section

- **Layout:** Full-width dark hero, centered max-width container at breakpoints.
- **H1:** `color.text.tertiary (#ffffff)`, `font.weight = 700`, width breakpoint-aware.
- **Inline accent word:** `color.surface.muted`.
- **Body copy:** `color.text.tertiary at 65% opacity` — must be ≥ 4.5 : 1 against the `surface.base` background.
- **Links and secondary text:** `color.surface.strong`.
- **CTA stack:** primary first, secondary second — every fold must contain at least one `surface.strong` CTA.

---

## 4. Accessibility Requirements

- **Target:** WCAG 2.2 AA.
- **Contrast:** `text.tertiary` on `surface.base` must equal or exceed 4.5 : 1. `text.secondary` on white or light backgrounds must equal or exceed 4.5 : 1.
- **Focus indicators:** Every interactive element must have `:focus-visible` with `2 px solid color.surface.muted` and `outline-offset: 2 px`. `outline: 0` / `outline: none` must not be applied without an explicit replacement.
- **Keyboard support:** `Tab` / `Shift+Tab` navigates. `Enter` / `Space` trigger primary actions. `Escape` closes all overlays (mega-menu, drawer, modal).

### Acceptance criteria

| Check | Criterion |
|---|---|
| Pass | Tabbing from the page top highlights the first focusable element with the `surface.muted` ring — not the browser default outline. |
| Fail | A button shows a hover lift, but tabbing shows no visible focus change. |
| Pass | Pressing Escape while the mega-menu is open closes it without requiring a second click. |
| Pass | All form inputs accept keyboard entry and submission in every state. |

---

## 5. Content and Tone Standards

**Tone:** Short, direct, action-oriented. Confidence without hype. Specificity without noise.

**Do:**
- Use a verb + object pair in every primary CTA button.
  - ✓ "Start for free"
  - ✓ "View all plans"
**Don't:**
- Use noun-only labels.
  - ✗ "Start"
  - ✗ "Click here"
- Place feature framing in button inline text.
  - ✗ "Start free scan with AI policy automation"

Brand references:
- On pages within the brand domain — reference it only once, in the page title or intro header. Repeat appearances should use the pronoun-based label "it" / "the platform".

---

## 6. Anti-Patterns and Prohibited Implementations

- N **Hidden focus:** Never `outline: 0` without replacing it with the `surface.muted` ring.
- X **Low-contrast text:** Text with an opacity modifier below `0.5` on `surface.base` does not pass AA and must not ship.
- X **One-off spacing / typography:** No pixel values outside the declared scale.
- X **Ambiguous actions:** Buttons, nav items, and card KV pairs must use imperative verb labels.
- X **Raw hex values in component code:** All colours must come from named tokens.
- X **Ghost button as primary CTA:** The first CTA on every full-width section must be primary (`surface.strong`).
- X **Missing loading / disabled states:** Every primary button component must implement loading and disabled states simultaneously.

---

## 7. Page Architecture Count

Below are the established component-density baselines by page. Counts reflect the target pre-launch state; deviations from the table require justification in the PR description.

| Page | Links | Cards | Buttons | Lists | Nav | Inputs | Tables |
|---|---|---|---|---|---|---|---|
| Landing | ~40 | ~12 | ~4 | 1 | 1 | 1 | 0 |
| Features | ~30 | ~8 | ~3 | 1 | 1 | 0 | 0 |
| Solutions | ~28 | ~8 | ~3 | 2 | 1 | 0 | 0 |
| Pricing | ~35 | ~5 | ~3 | 2 | 1 | 0 | 0 |
| Partners | ~25 | ~4 | ~4 | 3 | 1 | 0 | 0 |
| Webinars | ~22 | ~4 | ~2 | 1 | 1 | 1 | 0 |
| Press | ~18 | ~4 | ~3 | 2 | 1 | 0 | 0 |
| Checker | ~15 | ~2 | ~2 | 1 | 0 | 1 | 0 |
| Scanner | ~12 | ~2 | ~2 | 1 | 0 | 1 | 0 |
| All-blogs | ~10 | 0 | ~2 | 1 | 0 | 0 | 0 |

Total page count: **10**  
Link total: **~239**

---

## 8. Component Library Count

| Library type | Count |
|---|---|
| Cards | ~25 |
| Buttons | ~10 |
| Lists | ~5 |
| Navigation | ~3 |
| Inputs | ~1 per page |
| Tables | ~1 |

---

## 9. QA Checklist

### Tokens and foundations
- [ ] All colour values reference named tokens; zero raw hex values in component code.
- [ ] All spacing values in component code follow the scale; zero one-off spacing.
- [ ] Every button uses a named duration token for transitions.

### States
- [ ] Every button defines: default, hover, focus-visible, active, disabled, loading, error.
- [ ] Every input defines: default, hover, focus, error, disabled.
- [ ] All cards define: default, hover, loading (skeleton).

### Accessibility
- [ ] `:focus-visible` ring is present on every interactive element.
- [ ] Contrast ≥ 4.5 : 1 checked on all combinations involving `text.tertiary` on `surface.base`.
- [ ] `Escape` closes all overlays without a second interaction.
- [ ] All keyboard-driven flows have been validated against the acceptance criteria table.

### Content
- [ ] No CTA button contains only a noun — verb + object pairs only.
- [ ] Brand name appears on the page only once (or not at all — pronoun "it" is used thereafter).
- [ ] No placeholders used as labels.

### Responsive
- [ ] MQE `<= md`: all touch targets are ≥ 44 px wide, CTAs go full-width.
- [ ] No horizontal scroll at `320 px`.
- [ ] All multi-column layouts collapse to single-column below `sm`.

---

*Last updated: 2026-05-18*
