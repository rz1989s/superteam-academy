# RECTOR Academy — Phase 3: Design-System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the de-branded RECTOR Academy LMS from its default shadcn purple/Inter theme to the RECTOR LABS cream/brown + JetBrains Mono design system by retargeting the central shadcn CSS variables, then sweep the off-palette colors in the Tier-2/shared components Phase 4 will NOT redesign — so the whole app reads RECTOR-branded with zero rework on the Tier-1 pages.

**Architecture:** The app's shared shell (header/footer/sidebar/mobile-nav) and all 30 shadcn UI primitives style themselves with **semantic tokens** (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, …) that resolve through `@theme inline` → CSS variables in `:root`/`.dark` of `app/src/app/globals.css`. Re-pointing those ~30 variable VALUES to the cream/brown palette re-skins the shell + every primitive + every semantic-token component at once — no per-component edits. A second, smaller pass replaces the ~25 **hardcoded** off-palette utilities (`text-violet-*`, `oklch(... 293)`, `bg-slate-*`) that live only in Tier-2/shared components (admin charts/cards, creator, community, onboarding, devnet). Hardcoded accents inside the 12 Tier-1 pages are **intentionally left** for their bespoke Phase 4 redesign (see Appendix A).

**Tech Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript strict · Tailwind v4 (CSS-first `@theme`, no config file) · shadcn/ui · next-themes · next-intl (en/pt/es/hi) · Vitest · Playwright · pnpm. Reference design system: the `core` repo at `/Users/rector/local-dev/core` (`src/app/globals.css` `@theme` block + `docs/DESIGN_SYSTEM.md`).

## Global Constraints

- **Working root:** all `pnpm`/path-relative commands run from `app/` (the deploy root; there is no root `package.json`). All file paths below are relative to `app/` unless they start with `docs/`.
- **Branch:** `chore/rector-academy-revival` (NOT main). Do not merge — final integration is a fresh `RECTOR-LABS/rector-academy` repo in Phase 5.
- **Palette (RECTOR LABS):** cream `#FFF7E1` (bg) · brown `#3B2C22` (text) · sky `#41CFFF` · warm-yellow `#F9C846` · clay `#E58C2E` · leaf-green `#A8E063` · muted-red `#C75A44`.
- **WCAG-AA readable-text tokens (light/cream surface):** `--color-link #0D7390` (links/cyan text, 5.07:1) · `--color-green-deep #3C6A12` (green stat text, 6.02:1) · `--color-clay-deep #8A4A12` (gold/amber badge text, 6.40:1). The **bright** sky/leaf/clay/gold tokens are for **decorative fills only** (backgrounds, borders, rings, chart cells); readable text on cream uses the `-deep`/`link` tokens.
- **Brand-token naming rule (load-bearing):** brand `@theme` tokens use names that do **NOT** collide with Tailwind's default color scales, so the app's existing numbered utilities (`bg-green-50`, `text-red-700`, `bg-amber-950`, …) keep resolving. Approved brand names: `cream`, `brown`, `skyblue`, `clay`, `leaf`, `gold`, `link`, `green-deep`, `clay-deep`. **Never** define `--color-sky`, `--color-yellow`, `--color-red`, `--color-green` (each would override an entire Tailwind scale the app relies on).
- **Theme:** the **light theme is the primary cream RECTOR look**; the dark theme is retained as a secondary option (re-skinned to dark-brown/cream, not deleted).
- **Per-task gate:** `pnpm build` must stay green; run the named guard grep (expected output shown). **Part gate** (end of Part A and Part B): `pnpm test:run` = **364 passing** · `pnpm exec playwright test --project=chromium` = **36 passing** · visual smoke (`pnpm start`, load `/en`).
- **Commits:** conventional (`type: description`), **one focused change per task**, **NO AI attribution** (no `Co-Authored-By`, no "Claude"/"Generated with" — write as a human dev). Commits are GPG-signed automatically.
- **No shortcuts:** production-grade, edge cases + a11y preserved, verify before claiming done.
- **zsh path quoting:** the shell is zsh — always quote command paths containing `[locale]`, `(admin)`, or `(platform)` (e.g. `git add 'src/app/[locale]/layout.tsx'`, `rg pat 'src/app/[locale]'`). Unquoted, zsh expands the brackets/parens as a glob and aborts with `no matches found`.

---

# PART A — Foundation (the design-system core)

Delivers a cream/brown, JetBrains-Mono, light-default app: the shell + all 30 shadcn primitives + every semantic-token component are correctly themed, plus the brand visuals (OG/manifest/offline) and the locale gap.

---

### Task 1: Workspace prep — drop the stale Phase-1 stash

**Files:** none (git housekeeping).

- [ ] **Step 1: Confirm starting state**

Run from repo root `/Users/rector/local-dev/superteam-academy`:
```bash
git rev-parse --short HEAD          # expect: faf9d61
git status --short                  # expect: clean
git stash list                      # expect: stash@{0}: ... phase1: pre-stabilize formatting churn
```

- [ ] **Step 2: Drop the stash**

`stash@{0}` is the Phase-1 single→double-quote reformat churn that was deliberately discarded (NOT logic). Do **not** pop it (it mixes churn with untracked files); drop it. We do not run an app-wide prettier reformat in Phase 3 — that would bury the theme diff. Each edit below stays prettier-consistent with its surrounding code.
```bash
git stash drop stash@{0}
git stash list                      # expect: empty
```

- [ ] **Step 3: Confirm the build baseline is green** (so any later failure is attributable to this phase)

Run from `app/`:
```bash
pnpm build
```
Expected: build completes, ~44 routes, no error.

- [ ] **Step 4: Commit** — none (no tracked changes). Proceed to Task 2.

---

### Task 2: Core token remap — cream/brown shadcn variables + brand `@theme` tokens

This is the 90% win: re-skins the shell + all 30 primitives + every semantic-token component.

**Files:**
- Modify: `src/app/globals.css` (the `@theme inline` font line ~10, the `:root` block lines ~50-83, the `.dark` block lines ~85-117; ADD a brand `@theme` block)

**Interfaces:**
- Produces: brand utilities `bg-cream` `text-brown` `bg-skyblue` `text-clay` `border-leaf` `bg-gold` `text-link` `text-green-deep` `text-clay-deep` (consumed by Part B and Phase 4). Keeps the existing semantic token set (`--color-background`, `--color-primary`, …) — same variable NAMES, new VALUES.

- [ ] **Step 1: Point the sans font token at JetBrains Mono**

In the `@theme inline { … }` block, change line ~10:
```css
  --font-sans: var(--font-inter);
```
to:
```css
  --font-sans: var(--font-jetbrains-mono);
```
Leave `--font-mono: var(--font-jetbrains-mono);` as-is. (The unused `--font-inter` reference disappears with Task 3.)

- [ ] **Step 2: Replace the entire `:root` block with the cream/brown light palette**

Replace the whole `:root { … }` block (currently all `oklch(...)`) with:
```css
:root {
  --radius: 0.625rem;
  --background: #FFF7E1;
  --foreground: #3B2C22;
  --card: #FFFDF6;
  --card-foreground: #3B2C22;
  --popover: #FFFDF6;
  --popover-foreground: #3B2C22;
  --primary: #3B2C22;
  --primary-foreground: #FFF7E1;
  --secondary: #F3E9CC;
  --secondary-foreground: #3B2C22;
  --muted: #F3E9CC;
  --muted-foreground: #76695B; /* brown @ ~70% on cream = 4.98:1 (AA) */
  --accent: #F3E9CC;
  --accent-foreground: #3B2C22;
  --destructive: #C75A44;
  --border: #E7DECA; /* brown @ ~12% on cream */
  --input: #DCD2BE; /* brown @ ~18% on cream */
  --ring: #0D7390; /* brand cyan, AA on cream (focus ring) */
  --chart-1: #41CFFF;
  --chart-2: #A8E063;
  --chart-3: #E58C2E;
  --chart-4: #F9C846;
  --chart-5: #C75A44;
  --sidebar: #FBF4E2;
  --sidebar-foreground: #3B2C22;
  --sidebar-primary: #3B2C22;
  --sidebar-primary-foreground: #FFF7E1;
  --sidebar-accent: #F3E9CC;
  --sidebar-accent-foreground: #3B2C22;
  --sidebar-border: #E7DECA;
  --sidebar-ring: #0D7390;
}
```

- [ ] **Step 3: Replace the entire `.dark` block with the dark-brown secondary palette**

Replace the whole `.dark { … }` block with:
```css
.dark {
  --background: #241C16;
  --foreground: #FFF7E1;
  --card: #3B2C22;
  --card-foreground: #FFF7E1;
  --popover: #3B2C22;
  --popover-foreground: #FFF7E1;
  --primary: #FFF7E1;
  --primary-foreground: #3B2C22;
  --secondary: #4A3829;
  --secondary-foreground: #FFF7E1;
  --muted: #4A3829;
  --muted-foreground: #C9BCA8; /* cream @ ~70% on dark brown (AA) */
  --accent: #4A3829;
  --accent-foreground: #FFF7E1;
  --destructive: #C75A44;
  --border: rgba(255, 247, 225, 0.12);
  --input: rgba(255, 247, 225, 0.15);
  --ring: #41CFFF; /* brand sky pops on dark */
  --chart-1: #41CFFF;
  --chart-2: #A8E063;
  --chart-3: #E58C2E;
  --chart-4: #F9C846;
  --chart-5: #C75A44;
  --sidebar: #1F1813;
  --sidebar-foreground: #FFF7E1;
  --sidebar-primary: #FFF7E1;
  --sidebar-primary-foreground: #3B2C22;
  --sidebar-accent: #4A3829;
  --sidebar-accent-foreground: #FFF7E1;
  --sidebar-border: rgba(255, 247, 225, 0.12);
  --sidebar-ring: #41CFFF;
}
```

- [ ] **Step 4: Add a brand `@theme` block** (insert immediately AFTER the `.dark { … }` block, BEFORE `@layer base`)

```css
@theme {
  /* RECTOR LABS brand palette. Bright tokens are DECORATIVE fills only
     (backgrounds, borders, rings, chart cells); readable text on the cream
     surface uses the AA -deep / link tokens. Names deliberately avoid
     Tailwind's default scales (sky/yellow/red/green) so the app's existing
     numbered utilities (bg-green-50, text-red-700, …) keep working. */
  --color-cream: #FFF7E1;
  --color-brown: #3B2C22;
  --color-skyblue: #41CFFF;
  --color-clay: #E58C2E;
  --color-leaf: #A8E063;
  --color-gold: #F9C846;

  /* WCAG-AA readable-TEXT tokens for the light/cream surface */
  --color-link: #0D7390; /* links / cyan text — 5.07:1 on cream */
  --color-green-deep: #3C6A12; /* green stat text — 6.02:1 on cream */
  --color-clay-deep: #8A4A12; /* gold/amber badge text — 6.40:1 on cream */
}
```

- [ ] **Step 5: Guard + build**

Run from `app/`:
```bash
# No purple/oklch left in the token blocks (the brand block + body are plain):
rg -n 'oklch' src/app/globals.css            # expect: NO matches (exit 1)
pnpm build                                   # expect: green
```

- [ ] **Step 6: Visual smoke** (optional but recommended here)

`pnpm start`, open `http://localhost:3000/en` — the page background is cream `#FFF7E1`, body text deep brown, buttons brown-on-cream. (Stray purple accents on feature pages are expected until Part B / Phase 4.)

- [ ] **Step 7: Commit**
```bash
git add src/app/globals.css
git commit -m "feat: remap shadcn tokens to the RECTOR cream/brown design system"
```

---

### Task 3: Fonts — drop Inter, make JetBrains Mono primary

**Files:**
- Modify: `src/app/[locale]/layout.tsx` (font import line 5, the `inter` const lines 16-20, the `<body>` className line 56)

- [ ] **Step 1: Remove the Inter import**

Change line 5 from:
```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';
```
to:
```tsx
import { JetBrains_Mono } from 'next/font/google';
```

- [ ] **Step 2: Remove the `inter` font instance**

Delete lines 16-20 (the whole `const inter = Inter({ … });` block). Keep the `jetbrainsMono` const.

- [ ] **Step 3: Drop the Inter variable from `<body>`**

Change line 56 from:
```tsx
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
```
to:
```tsx
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
```
(`font-sans` now resolves to `var(--font-sans)` → `var(--font-jetbrains-mono)` from Task 2, so the whole app renders JetBrains Mono.)

- [ ] **Step 4: Guard + build**
```bash
# scoped to the only two files that referenced Inter — a bare `rg inter`
# would false-match "interface", "internal", etc. across the codebase:
rg -n 'Inter|--font-inter' 'src/app/[locale]/layout.tsx' src/app/globals.css   # expect: NO matches (exit 1)
pnpm build                                   # expect: green
```

- [ ] **Step 5: Commit**
```bash
git add src/app/[locale]/layout.tsx
git commit -m "refactor: make JetBrains Mono the primary font, drop Inter"
```

---

### Task 4: Theme default → light (cream-first)

**Files:**
- Modify: `src/components/providers/theme-provider.tsx` (the `defaultTheme` prop, line ~9)

- [ ] **Step 1: Flip the default theme**

Change `defaultTheme="dark"` to `defaultTheme="light"`. Leave `attribute="class"`, `enableSystem`, and `disableTransitionOnChange` as-is — new visitors now land on the cream light theme; the toggle (light/dark/system) still works as the secondary path.
```tsx
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
```

- [ ] **Step 2: Verify no test pinned the old default, then build + test**
```bash
rg -n 'defaultTheme|toClass.*dark' src --glob '*.test.*'   # expect: NO matches
pnpm build                                                  # expect: green
pnpm test:run                                               # expect: 364 passing
```

- [ ] **Step 3: Commit**
```bash
git add src/components/providers/theme-provider.tsx
git commit -m "feat: default to the light cream theme, keep dark as secondary"
```

---

### Task 5: OG image — re-skin to cream/brown

**Files:**
- Modify: `src/app/[locale]/opengraph-image.tsx` (all hex colors; keep copy, layout, `runtime`, locale title/subtitle maps unchanged)

- [ ] **Step 1: Re-color the `ImageResponse` JSX**

Apply these exact value swaps (Satori renders inline styles; structure stays identical):

| Location | From | To |
|---|---|---|
| outer `backgroundColor` (L33) | `'#0a0a0a'` | `'#FFF7E1'` |
| outer `backgroundImage` (L34-35) | `radial-gradient(circle at 25% 25%, #9945FF22 …), radial-gradient(circle at 75% 75%, #14F19522 …)` | `'radial-gradient(circle at 25% 25%, #41CFFF22 0%, transparent 50%), radial-gradient(circle at 75% 75%, #F9C84622 0%, transparent 50%)'` |
| eyebrow "RECTOR Academy" `color` (L50) | `'#9945FF'` | `'#3B2C22'` |
| title `color` (L61) | `'#ffffff'` | `'#3B2C22'` |
| subtitle `color` (L72) | `'#a1a1aa'` | `'rgba(59, 44, 34, 0.7)'` |
| tag pill `border` (L91) | `'1px solid #9945FF44'` | `'1px solid rgba(59, 44, 34, 0.25)'` |
| tag pill `color` (L92) | `'#9945FF'` | `'#3B2C22'` |

- [ ] **Step 2: Guard + build**
```bash
rg -n '9945FF|14F195|#0a0a0a|#ffffff|a1a1aa' src/app/[locale]/opengraph-image.tsx  # expect: NO matches (exit 1)
pnpm build                                   # expect: green
```

- [ ] **Step 3: Visual check** — `pnpm start`, open `http://localhost:3000/en/opengraph-image` (or the localized variant). Expect a cream card, brown title/eyebrow, brown-outlined tag pills.

- [ ] **Step 4: Commit**
```bash
git add src/app/[locale]/opengraph-image.tsx
git commit -m "style: re-skin the OG image to the cream/brown palette"
```

---

### Task 6: PWA manifest + offline page + app theme-color → cream/brown

**Files:**
- Modify: `public/manifest.json` (`background_color`, `theme_color`)
- Modify: `public/offline.html` (theme-color meta + all CSS colors + font)
- Modify: `src/app/[locale]/layout.tsx` (ADD a `viewport` export with the brown `themeColor`)

- [ ] **Step 1: Manifest colors**

In `public/manifest.json`:
```json
  "background_color": "#FFF7E1",
  "theme_color": "#3B2C22",
```
(splash background = cream; PWA toolbar = brown, matching the favicon.)

- [ ] **Step 2: Offline page — full re-skin + JetBrains Mono**

In `public/offline.html` apply these swaps (it is static — cannot use `next/font`, so use the JetBrains Mono CSS stack):

| Selector / line | From | To |
|---|---|---|
| `<meta name="theme-color">` (L6) | `#7c3aed` | `#3B2C22` |
| `body { font-family }` (L22) | `Inter, system-ui, -apple-system, sans-serif` | `'JetBrains Mono', ui-monospace, 'Courier New', monospace` |
| `body { background }` (L23) | `#0f0f12` | `#FFF7E1` |
| `body { color }` (L24) | `#f5f5f7` | `#3B2C22` |
| `.icon-wrapper { background }` (L41) | `linear-gradient(135deg, #7c3aed, #4f46e5)` | `#3B2C22` |
| `.icon-wrapper { box-shadow }` (L45) | `0 0 40px rgba(124, 58, 237, 0.25)` | `0 4px 16px rgba(59, 44, 34, 0.2)` |
| `.icon-wrapper svg { color }` (L51) | `#fff` | `#FFF7E1` |
| `h1 { background / clip / fill }` (L58-61) | violet gradient text-clip | replace the 4 gradient/clip lines with a single `color: #3B2C22;` |
| `p { color }` (L67) | `#a1a1aa` | `rgba(59, 44, 34, 0.7)` |
| `.retry-btn { border }` (L76) | `1px solid rgba(124, 58, 237, 0.4)` | `1px solid rgba(59, 44, 34, 0.4)` |
| `.retry-btn { background }` (L77) | `rgba(124, 58, 237, 0.1)` | `rgba(59, 44, 34, 0.06)` |
| `.retry-btn { color }` (L78) | `#c4b5fd` | `#3B2C22` |
| `.retry-btn:hover { background }` (L87) | `rgba(124, 58, 237, 0.2)` | `rgba(59, 44, 34, 0.12)` |
| `.retry-btn:hover { border-color }` (L88) | `rgba(124, 58, 237, 0.6)` | `rgba(59, 44, 34, 0.6)` |
| `.brand { color }` (L98) | `#52525b` | `rgba(59, 44, 34, 0.6)` |

For the h1, the final rule reads:
```css
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: #3B2C22;
    }
```

- [ ] **Step 3: App-level theme-color (mobile browser chrome)**

In `src/app/[locale]/layout.tsx`, add a `viewport` export next to the existing `metadata` export (import `Viewport` from `next`):
```tsx
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#3B2C22',
};
```
(Read `node_modules/next/dist/docs/` on the `viewport` convention if unsure — this Next version differs from training data.)

- [ ] **Step 4: Guard + build**
```bash
rg -n '7c3aed|0f0f12|4f46e5|124, 58, 237|c4b5fd|818cf8|Inter' public/offline.html public/manifest.json  # expect: NO matches (exit 1)
pnpm build                                   # expect: green
```

- [ ] **Step 5: Commit**
```bash
git add public/manifest.json public/offline.html src/app/[locale]/layout.tsx
git commit -m "style: re-skin the PWA manifest, offline page, and theme-color to cream/brown"
```

---

### Task 7: Locale gap — add `hi` to sitemap + JSON-LD (TDD)

Routing has 4 locales (`['en','pt','es','hi']`) but `sitemap.ts` enumerates only 3 and `json-ld.ts` `inLanguage` only 3 — `hi` pages are missing from the sitemap and the structured-data language list.

**Files:**
- Create: `src/app/[locale]/__tests__/sitemap.test.ts`
- Create: `src/lib/utils/__tests__/json-ld.test.ts`
- Modify: `src/app/[locale]/sitemap.ts:6`
- Modify: `src/lib/utils/json-ld.ts:32`

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/__tests__/sitemap.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import sitemap from '../sitemap';
import { routing } from '@/i18n/routing';

describe('sitemap locale coverage', () => {
  it('emits entries for every routing locale', () => {
    const entries = sitemap();
    for (const locale of routing.locales) {
      const hasLocale = entries.some((e) => e.url.includes(`/${locale}`));
      expect(hasLocale, `missing sitemap entries for locale "${locale}"`).toBe(true);
    }
  });
});
```

`src/lib/utils/__tests__/json-ld.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getCourseJsonLd } from '../json-ld';
import type { CourseWithMeta } from '@/lib/stores/course-store';

const course = {
  title: 'Test', description: 'd', difficulty: 0, estimatedHours: 1, lessonCount: 1,
} as CourseWithMeta;

describe('course JSON-LD language coverage', () => {
  it('lists Hindi alongside en/pt-BR/es', () => {
    const { inLanguage } = getCourseJsonLd(course);
    expect(inLanguage).toEqual(['en', 'pt-BR', 'es', 'hi']);
  });
});
```

- [ ] **Step 2: Run them — verify they FAIL**
```bash
pnpm test:run src/app/[locale]/__tests__/sitemap.test.ts src/lib/utils/__tests__/json-ld.test.ts
```
Expected: both FAIL (`hi` missing).

- [ ] **Step 3: Fix `sitemap.ts`** — line 6:
```ts
  const locales = ['en', 'pt', 'es', 'hi'];
```

- [ ] **Step 4: Fix `json-ld.ts`** — line 32:
```ts
    inLanguage: ['en', 'pt-BR', 'es', 'hi'],
```

- [ ] **Step 5: Run them — verify they PASS**
```bash
pnpm test:run src/app/[locale]/__tests__/sitemap.test.ts src/lib/utils/__tests__/json-ld.test.ts  # expect: PASS
```

- [ ] **Step 6: Commit**
```bash
git add src/app/[locale]/sitemap.ts src/lib/utils/json-ld.ts src/app/[locale]/__tests__/sitemap.test.ts src/lib/utils/__tests__/json-ld.test.ts
git commit -m "fix: include the hi locale in the sitemap and course JSON-LD"
```

---

### Part A acceptance gate

Run from `app/` after Task 7 — do NOT proceed to Part B until all four pass:
- [ ] `pnpm build` → green
- [ ] `pnpm test:run` → **366 passing** (364 prior + 2 new locale tests)
- [ ] `pnpm exec playwright test --project=chromium` → **36 passing**
- [ ] Visual smoke: `pnpm start`, load `/en` → cream background, brown JetBrains-Mono text, brown buttons; toggle to dark → dark-brown surface, cream text; favicon + OG render cream/brown. Confirm `rg -i 'superteam' src README.md docs` is still **zero** (no regression).

---

# PART B — Tier-2 off-palette sweep

Replaces the hardcoded purple/violet/slate/oklch in the Tier-2/shared components Phase 4 will NOT redesign, so admin/creator/community/onboarding/devnet read RECTOR-branded. Uses the brand tokens from Task 2. **Tier-1 page accents are intentionally left for Phase 4 — see Appendix A.**

**Standard mappings used below:**
- Violet "accent" (icon/stat) → brand cyan: `text-violet-600 dark:text-violet-400` → `text-link dark:text-skyblue` · `bg-violet-100 dark:bg-violet-950` → `bg-skyblue/10 dark:bg-skyblue/15` · `text-violet-500` → `text-link` · `bg-violet-500/15` → `bg-skyblue/15`.
- Slate "neutral" → semantic neutral tokens: `text-slate-*` → `text-muted-foreground` · `bg-slate-500/15 … border-slate-500/25` → `bg-muted text-muted-foreground border-border`.
- Hardcoded chart `oklch(...)` → brand hex (decorative fills).

---

### Task 8: Admin charts — oklch → brand palette

**Files:**
- Modify: `src/components/admin/analytics-charts.tsx` (the `CHART_COLORS` array L15-23 + `BG_COLORS` array L25-33)
- Modify: `src/components/admin/enrollment-chart.tsx` (two `stopColor` oklch values L137, L142)

- [ ] **Step 1: `analytics-charts.tsx` — replace `CHART_COLORS`** (7 entries) with brand hex:
```ts
const CHART_COLORS = [
  '#41CFFF', // skyblue
  '#A8E063', // leaf
  '#E58C2E', // clay
  '#F9C846', // gold
  '#C75A44', // muted red
  '#0D7390', // link (deep cyan)
  '#3C6A12', // green-deep
];
```

- [ ] **Step 2: `analytics-charts.tsx` — replace `BG_COLORS`** (legend swatches; order must match `CHART_COLORS`):
```ts
const BG_COLORS = [
  'bg-skyblue',
  'bg-leaf',
  'bg-clay',
  'bg-gold',
  'bg-[#C75A44]',
  'bg-link',
  'bg-green-deep',
];
```
(The old array used `bg-primary`/`bg-accent`, which now resolve to brown / cream-tint — the cream-tint would be invisible as a chart swatch; these brand fills fix that. `bg-[#C75A44]` is an arbitrary value because `--color-red` is intentionally not defined.)

- [ ] **Step 3: `enrollment-chart.tsx` — replace both gradient stops** (L137, L142). The line/points use `stroke-primary`/`fill-primary` (now brown), so match the area gradient to it:
```tsx
                stopColor="#3B2C22"
```
(both occurrences of `stopColor="oklch(0.541 0.267 293)"`).

- [ ] **Step 4: Guard + build**
```bash
rg -n 'oklch' src/components/admin/analytics-charts.tsx src/components/admin/enrollment-chart.tsx  # expect: NO matches (exit 1)
pnpm build                                   # expect: green
```

- [ ] **Step 5: Commit**
```bash
git add src/components/admin/analytics-charts.tsx src/components/admin/enrollment-chart.tsx
git commit -m "style: re-skin admin charts to the brand palette"
```

---

### Task 9: Admin violet stat accents → brand cyan

**Files (all the violet "iconColor/iconBg/color/bg" accent pairs):**
- Modify: `src/components/admin/activity-feed.tsx:51-52`
- Modify: `src/components/admin/stats-cards.tsx:54-55`
- Modify: `src/app/[locale]/(admin)/admin/achievements/page.tsx:95-96`
- Modify: `src/app/[locale]/(admin)/admin/config/page.tsx:173-174`
- Modify: `src/app/[locale]/(admin)/admin/analytics/page.tsx:52-53`

- [ ] **Step 1: Apply the violet→cyan mapping** in each file:
  - `text-violet-600 dark:text-violet-400` → `text-link dark:text-skyblue`
  - `bg-violet-100 dark:bg-violet-950` → `bg-skyblue/10 dark:bg-skyblue/15`

(Each file has exactly one such pair at the lines above; the property keys differ — `color`/`bg`, `iconColor`/`iconBg` — keep the keys, swap only the class strings.)

- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet' src/components/admin 'src/app/[locale]/(admin)'   # expect: NO matches (exit 1)
pnpm build                                                       # expect: green
```

- [ ] **Step 3: Commit**
```bash
git add src/components/admin/activity-feed.tsx src/components/admin/stats-cards.tsx "src/app/[locale]/(admin)/admin/achievements/page.tsx" "src/app/[locale]/(admin)/admin/config/page.tsx" "src/app/[locale]/(admin)/admin/analytics/page.tsx"
git commit -m "style: re-skin admin stat accents to brand cyan"
```

---

### Task 10: Remaining Tier-2 — community, creator, onboarding, devnet

**Files:**
- Modify: `src/components/community/thread-card.tsx:30`
- Modify: `src/components/creator/my-courses.tsx:29`
- Modify: `src/components/onboarding/results-step.tsx:19`
- Modify: `src/components/devnet/transaction-history.tsx:47-48`
- Modify: `src/components/devnet/account-explorer.tsx:193`

- [ ] **Step 1: `community/thread-card.tsx:30`** (violet badge → cyan):
```
'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400'
```
→
```
'bg-skyblue/10 text-link dark:bg-skyblue/15 dark:text-skyblue'
```

- [ ] **Step 2: `creator/my-courses.tsx:29`** (slate draft badge → neutral):
```
draft: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/25',
```
→
```
draft: 'bg-muted text-muted-foreground border-border',
```

- [ ] **Step 3: `onboarding/results-step.tsx:19`** (purple→indigo gradient → warm brand gradient). Read the surrounding usage first to confirm it reads well as a fill behind its content; then:
```
gradient: 'from-purple-600 to-indigo-700',
```
→
```
gradient: 'from-clay to-gold',
```

- [ ] **Step 4: `devnet/transaction-history.tsx:47-48`** (violet → cyan):
```
color: 'text-violet-500',
bgColor: 'bg-violet-500/15',
```
→
```
color: 'text-link',
bgColor: 'bg-skyblue/15',
```

- [ ] **Step 5: `devnet/account-explorer.tsx:193`** (slate → neutral):
```
iconColor: 'text-slate-500',
```
→
```
iconColor: 'text-muted-foreground',
```

- [ ] **Step 6: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|slate' src/components/community/thread-card.tsx src/components/creator/my-courses.tsx src/components/onboarding/results-step.tsx src/components/devnet/transaction-history.tsx src/components/devnet/account-explorer.tsx  # expect: NO matches (exit 1)
pnpm build                                   # expect: green
```

- [ ] **Step 7: Commit**
```bash
git add src/components/community/thread-card.tsx src/components/creator/my-courses.tsx src/components/onboarding/results-step.tsx src/components/devnet/transaction-history.tsx src/components/devnet/account-explorer.tsx
git commit -m "style: re-skin community, creator, onboarding, and devnet accents to brand"
```

---

### Part B acceptance gate

Run from `app/` — Tier-2 is brand-coherent only when all pass:
- [ ] Tier-2 residue guard returns **zero**:
```bash
rg -n 'violet|purple|indigo|fuchsia|slate|oklch' \
  src/components/admin/analytics-charts.tsx src/components/admin/enrollment-chart.tsx \
  src/components/admin/activity-feed.tsx src/components/admin/stats-cards.tsx \
  'src/app/[locale]/(admin)/admin/achievements/page.tsx' 'src/app/[locale]/(admin)/admin/config/page.tsx' 'src/app/[locale]/(admin)/admin/analytics/page.tsx' \
  src/components/community/thread-card.tsx src/components/creator/my-courses.tsx \
  src/components/onboarding/results-step.tsx \
  src/components/devnet/transaction-history.tsx src/components/devnet/account-explorer.tsx   # expect: NO matches
```
- [ ] `pnpm build` → green
- [ ] `pnpm test:run` → **366 passing**
- [ ] `pnpm exec playwright test --project=chromium` → **36 passing**
- [ ] Visual smoke: `pnpm start`, load an admin page (e.g. `/en/admin/analytics`) and the community page → charts/stat accents/badges render in cream/brown + brand cyan, no purple.

---

## Self-Review (completed by plan author)

- **Spec §5 coverage:** token remap (Task 2) · WCAG-AA `-deep`/`link` tokens (Task 2 brand block) · JetBrains Mono primary, Inter dropped (Tasks 2-3) · light theme primary / dark secondary (Tasks 2-4) · shared shell re-skin (automatic via Task 2 — shell uses 100% semantic tokens, verified). ✓
- **Phase-2 carry-forward coverage:** OG image (Task 5) · PWA manifest + offline + app theme-color (Task 6) · `hi` locale in sitemap + json-ld (Task 7). Favicons (`src/app/icon.svg`, `public/icons/icon.svg`) were already set to brown/cream in Phase 2 — verified on read, no task needed. ✓
- **"App-wide token reskin = Tier-2 done":** scoped to the Tier-2/shared components per RECTOR's decision (Tasks 8-10); Tier-1 page accents deferred to Phase 4 (Appendix A). ✓
- **Placeholder scan:** every step has exact paths, exact before→after strings, and a guard command with expected output. No TBD/TODO. ✓
- **Type/name consistency:** brand token names (`skyblue`, `clay`, `leaf`, `gold`, `link`, `green-deep`, `clay-deep`, `cream`, `brown`) are used identically in Task 2 (definition) and Tasks 5/8/9/10 (consumption); none collide with Tailwind defaults. ✓

## Appendix A — Off-palette colors intentionally DEFERRED to Phase 4

These hardcoded accents live inside the 12 Tier-1 screens that Phase 4 redesigns bespoke (`frontend-design` per page). Recoloring them now would be redone in Phase 4 (Israf). Left as-is in Phase 3:

- **landing:** `hero-section.tsx`, `social-proof.tsx`, `gamification-preview.tsx`
- **courses:** `course-card.tsx`, `course-header.tsx`, `credential-preview.tsx`, `track-badge.tsx`
- **dashboard:** `quick-stats.tsx`, `recent-achievements.tsx`, `activity-feed.tsx` (dashboard one), `recommended-courses.tsx`
- **leaderboard:** `leaderboard-row.tsx`, `podium-top3.tsx`
- **profile:** `achievement-grid.tsx`, `completed-courses-list.tsx`, `stats-summary.tsx`, `skill-radar.tsx` (incl. its `rgba(139,92,246,…)`), `profile-header.tsx`
- **credentials:** `credential-detail.tsx`, `credential-gallery.tsx`, `share-credential.tsx`
- **challenges:** `challenge-browser-card.tsx`, `speed-leaderboard.tsx`, `challenges/library/page.tsx`
- **lessons:** `lesson-content.tsx`
- **gamification (Tier-1 surfaces):** `level-badge.tsx` (11 rarity tiers), `streak-counter.tsx`, `confetti-animation.tsx`
- **certificates:** `lib/utils/generate-certificate.ts` (track gradient hexes)

Also deferred (content/demo, not chrome) → Phase 5 demo polish: `lib/sanity/seed-data.ts` track colors (`#9945FF`/`#14F195`), `public/images/courses/*.svg` decorative gradients. **Keep as-is everywhere:** Monaco/VS-Code editor colors (`#1e1e1e`/`#252526`/`#d4d4d4`/`#007acc`) and the footer's Solana-wordmark SVG gradient — these are intentional third-party/brand visuals, not app theme.

## Execution notes

- Order matters only that **Task 2 precedes everything** (defines the brand tokens Tasks 5/8/9/10 consume) and **Part A precedes Part B**. Within a part, tasks are independent.
- This Next version has breaking changes vs training data — read the relevant guide in `node_modules/next/dist/docs/` before touching `viewport`/metadata (Task 6) or any Next-specific API.
