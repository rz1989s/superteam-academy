# RECTOR Academy — Phase 4.3: Challenges (Sub-Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. This sub-plan **inherits the master plan verbatim**: `docs/superpowers/plans/2026-06-17-rector-academy-phase4-tier1-redesigns.md` (Global Constraints + Phase-4 Design Language). Read it first. Apply `superpowers:frontend-design` per page.

**Goal:** Redesign the three Challenges routes (daily index · library · per-course solver) and their components to the locked RECTOR Academy design language — introduce two single-source style modules (brand difficulty + brand challenge-categories) to kill the duplicated/off-palette local maps, re-brand the speed-leaderboard podium, adopt `PageHeader`, and sweep the stray `neutral-*` greys — while keeping the test pass/fail, hint, and Monaco semantics intact.

**Architecture:** Two new `src/lib` modules (`difficulty.ts`, `challenge-categories.ts`) become the single source of truth for difficulty + category colors (mirroring `tracks.ts`); every challenge component and the 4.2 course `DifficultyBadge` consume them. Then per-surface redesigns adopt the modules, `PageHeader`, the width cap, and the brand podium. The full-bleed solver layout is preserved.

**Tech Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript strict · Tailwind v4 (CSS-first `@theme`) · shadcn/ui · next-themes · next-intl (en/pt/es/hi) · Vitest · Playwright · pnpm.

---

## Global Constraints (inherits master — load-bearing restatements + 4.3 deltas)

- **Working root:** all commands run from `/Users/rector/local-dev/superteam-academy/app`. Paths below are relative to that `app/` unless they start with `docs/`.
- **★ REPO-SAFETY (load-bearing):** the controller cwd is the **`core` repo, a structural twin**. Use **absolute paths**; if the shell cwd is not the academy, `cd /Users/rector/local-dev/superteam-academy/app` first; **before each commit** confirm `git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel` ends in `superteam-academy`, and after each commit confirm `git -C /Users/rector/local-dev/core status` is clean. The 4.3 files are academy-only (fail-loud if mis-targeted) but verify anyway.
- **Branch:** `chore/rector-academy-revival` (NOT main). Do NOT merge (Phase-5 fresh repo integrates). Base HEAD: `031eac0` (end of 4.2).
- **Palette + readable tokens:** cream `#FFF7E1` / brown `#3B2C22` + skyblue/gold/clay/leaf/rust. Readable-on-cream text uses `-deep`/`link`: `link #0D7390` · `green-deep #3C6A12` · `clay-deep #8A4A12` · `rust-deep #A23B22`. Bright tokens = decorative fills only. **NEVER** define/use `--color-sky/yellow/red/green`.
- **Single-source rule:** challenge **category** colors come from the new `src/lib/challenge-categories.ts`; **difficulty** colors from the new `src/lib/difficulty.ts`. Never re-hardcode a category/difficulty hue in a component.
- **KEEP semantic STATUS colors — do NOT sweep:** test pass/fail (emerald/red) in `test-case-row`, `test-results-panel`, `past-challenges` `RESULT_CONFIG`, and the daily-card "already attempted" emerald check; hint/solution warnings (amber) in `hint-accordion` + `solution-toggle` dialog; Monaco chrome (`#1e1e1e`/`#252526`/`#d4d4d4`/`#007acc`); `destructive` errors. **Classification** (difficulty, challenge-category, podium rank) **does** go brand.
- **Theme:** light cream is primary. For brand classification use the `-deep`/`link` readable tokens **without** `dark:` variants — exactly as cluster 4.2 did (`difficulty-badge`, `track-badge`). Deep dark-mode polish is deferred to Phase 5 (master plan). Kept-semantic colors retain their existing `dark:` variants. Never ship a change that **breaks** dark (verify it still renders).
- **Icons:** Lucide only, no emoji. **Commits:** conventional, **one per task**, **NO AI attribution**, GPG-signed. **No shortcuts:** preserve loading/empty states + a11y AA.
- **zsh quoting:** quote any path containing `[locale]`/`(platform)` for `rg`/`git`.
- **Testing rhythm (matches 4.0–4.2):** the two new `src/lib` modules are unit-tested (full TDD). Visual components gate on **`pnpm build` green + `npx tsc --noEmit` clean + the file's off-palette guard returns no matches**; the part gate adds `pnpm test:run` + prod-server visual smoke (light + dark).
- **Per-task gate:** `cd /Users/rector/local-dev/superteam-academy/app && pnpm build` (green) + `npx tsc --noEmit` (clean) + the task's off-palette guard (no matches). *(`rg` regex is the default — use `rg -n 'pat'`, NOT `rg -nE`.)*
- **Part gate (end of sub-plan):** `pnpm test:run` = **382 passing** (375 + 7 new module tests) · cluster off-palette guards return zero (below) · prod-server visual smoke light+dark on all three routes · read-only opus review.
- **Dev/visual infra:** Turbopack `pnpm dev` first-compile HANGS here → use the **prod server** for visual: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && PORT=3000 pnpm start`, then Chrome MCP. localStorage may hold a stale `theme` — set it explicitly per theme.

---

## 4.3-specific design decisions (read before executing)

1. **`StreakCounter` is OUT of 4.3.** `gamification/streak-counter.tsx` is off-palette (orange/sky-400) but its **only** consumer is `dashboard/welcome-banner.tsx` — it belongs to cluster **4.4 (Dashboard + Profile)**. Leave it untouched here; flag it for 4.4.
2. **Two single-source modules** (mirror `tracks.ts`):
   - `src/lib/difficulty.ts` — `difficultyClass(level: DifficultyLevel | number)` returns the brand classification class; `DIFFICULTY_LEVELS = ['beginner','intermediate','advanced']`. Replaces **5** duplicated local `DIFFICULTY_STYLES` maps (course `difficulty-badge` + `daily-challenge-card` + `past-challenges` + `challenge-instructions` + `challenge-browser-card`).
   - `src/lib/challenge-categories.ts` — `challengeCategoryStyle(category)` returns `{ borderClass, badgeClass, statClass }` for the 5 challenge categories, mapped to the brand accents **skyblue / gold / clay / rust / leaf** (the 5th, `token-extensions`, takes `leaf` — the brand accent no course track uses). Replaces the violet/fuchsia/rose maps in `challenge-browser-card` + `library/page`.
3. **Difficulty values stay identical to 4.2** (`beginner` leaf/green-deep · `intermediate` gold/clay-deep · `advanced` rust/rust-deep), so course and challenge difficulty badges finally match. Sourcing `difficulty-badge.tsx` (a 4.2 file) from the new module is a DRY improvement, not a behavior change.
4. **Speed-leaderboard podium → brand text** (compact widget): 1st `text-clay-deep` · 2nd `text-muted-foreground` · 3rd `text-rust-deep`; Trophy `text-clay-deep`. (Full tinted podium chips with rings land on the **main** leaderboard in cluster 4.5; this compact widget uses readable text colors to avoid a layout change.)
5. **`PageContainer` deviation (same as 4.2):** the `(platform)` shell `<main>` already pads (`p-6 lg:p-8`). Adopt `PageHeader` + a px-less `mx-auto w-full max-w-7xl` wrapper on the two contained pages (daily, library). The solver page stays **full-bleed** (`-m-6 lg:-m-8`, like the lesson view) — no `PageHeader`, no width cap.
6. **Daily page header is English-hardcoded today** (the library page is i18n-keyed). Preserve that: pass the existing English strings to `PageHeader` on the daily page; use the existing `t('library_title')`/`t('library_description')` keys on the library page. (Full daily-page i18n is out of scope.)

---

## File Structure

**Created (2):** `src/lib/difficulty.ts` (+ `src/lib/__tests__/difficulty.test.ts`) · `src/lib/challenge-categories.ts` (+ `src/lib/__tests__/challenge-categories.test.ts`).

**Modified (10):**
- `src/components/courses/difficulty-badge.tsx` — source from `difficulty.ts` (Task 3)
- `src/components/challenges/daily-challenge-card.tsx` (Task 4) · `past-challenges.tsx` (Task 5) · `challenge-instructions.tsx` (Task 6) — `difficultyClass`
- `src/components/challenges/challenge-browser-card.tsx` (Task 7) — category + difficulty modules
- `src/components/challenges/speed-leaderboard.tsx` (Task 8) — brand podium
- `src/app/[locale]/(platform)/challenges/page.tsx` (Task 9) — PageHeader + width cap
- `src/app/[locale]/(platform)/challenges/library/page.tsx` (Task 10) — category stats + PageHeader + width cap
- `src/components/challenges/solution-toggle.tsx` (Task 11) — `neutral-*` → semantic tokens

**Verify-only (no change — already on-brand / semantic-only):** `challenge-grid.tsx`, `challenge-filter-sidebar.tsx`, `challenge-timer.tsx` (neutral, no urgency color), `hint-accordion.tsx` (amber hints kept), `test-case-row.tsx` + `test-results-panel.tsx` (emerald/red test status kept), `challenges/layout.tsx`, and the solver route `courses/[courseId]/challenge/page.tsx` (full-bleed split, `bg-emerald-600 text-white` submit button = semantic success, AA-fine).

---

## Task 1: `difficulty.ts` — single-source brand difficulty (TDD)

**Files:**
- Create: `src/lib/difficulty.ts`
- Test: `src/lib/__tests__/difficulty.test.ts`

**Interfaces:**
- Produces: `DIFFICULTY_LEVELS: readonly ['beginner','intermediate','advanced']`; `type DifficultyLevel`; `difficultyClass(level: DifficultyLevel | number): string`. Consumed by Tasks 3–7.

- [ ] **Step 1: Write the failing test** — create `src/lib/__tests__/difficulty.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { difficultyClass, DIFFICULTY_LEVELS } from '../difficulty';

describe('difficulty module', () => {
  it('maps the three levels to warm brand classification classes', () => {
    expect(difficultyClass('beginner')).toContain('text-green-deep');
    expect(difficultyClass('intermediate')).toContain('text-clay-deep');
    expect(difficultyClass('advanced')).toContain('text-rust-deep');
  });

  it('resolves a numeric index to the same class as its level name', () => {
    DIFFICULTY_LEVELS.forEach((level, i) => {
      expect(difficultyClass(i)).toBe(difficultyClass(level));
    });
  });

  it('uses no off-palette or status colors', () => {
    const all = DIFFICULTY_LEVELS.map((l) => difficultyClass(l)).join(' ');
    expect(all).not.toMatch(/emerald|amber|red-[0-9]|violet|fuchsia|rose|slate|orange/);
  });
});
```

- [ ] **Step 2: Run it — verify it fails.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/difficulty.test.ts`
Expected: FAIL — cannot resolve `../difficulty`.

- [ ] **Step 3: Create `src/lib/difficulty.ts`:**

```ts
export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

const DIFFICULTY_CLASS: Record<DifficultyLevel, string> = {
  beginner: 'border-leaf/30 bg-leaf/20 text-green-deep',
  intermediate: 'border-gold/30 bg-gold/20 text-clay-deep',
  advanced: 'border-rust/30 bg-rust/15 text-rust-deep',
};

/** Brand classification class for a difficulty, by level name or 0-based index. */
export function difficultyClass(level: DifficultyLevel | number): string {
  const key =
    typeof level === 'number' ? DIFFICULTY_LEVELS[level] ?? 'beginner' : level;
  return DIFFICULTY_CLASS[key] ?? DIFFICULTY_CLASS.beginner;
}
```

- [ ] **Step 4: Run it — verify it passes.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/difficulty.test.ts`
Expected: PASS (3/3).

- [ ] **Step 5: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 6: Commit** (verify repo first):

```bash
git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel   # must end in /superteam-academy
git -C /Users/rector/local-dev/superteam-academy add app/src/lib/difficulty.ts app/src/lib/__tests__/difficulty.test.ts
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: add single-source brand difficulty module"
git -C /Users/rector/local-dev/superteam-academy status   # branch + clean check
```

---

## Task 2: `challenge-categories.ts` — single-source brand categories (TDD)

**Files:**
- Create: `src/lib/challenge-categories.ts`
- Test: `src/lib/__tests__/challenge-categories.test.ts`

**Interfaces:**
- Produces: `type ChallengeCategory`; `challengeCategoryStyle(category: string): { borderClass: string; badgeClass: string; statClass: string }`. Consumed by Tasks 7 + 10.

- [ ] **Step 1: Write the failing test** — create `src/lib/__tests__/challenge-categories.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  challengeCategoryStyle,
  CHALLENGE_CATEGORY_STYLES,
} from '../challenge-categories';

describe('challenge-categories module', () => {
  it('styles all five categories', () => {
    expect(Object.keys(CHALLENGE_CATEGORY_STYLES)).toEqual([
      'solana-fundamentals',
      'defi',
      'nft-metaplex',
      'security',
      'token-extensions',
    ]);
  });

  it('uses AA-readable text tokens in every badge + stat class', () => {
    for (const c of Object.values(CHALLENGE_CATEGORY_STYLES)) {
      expect(c.badgeClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep)/);
      expect(c.statClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep)/);
    }
  });

  it('contains no off-palette color names', () => {
    expect(JSON.stringify(CHALLENGE_CATEGORY_STYLES)).not.toMatch(
      /violet|purple|indigo|fuchsia|pink|rose|teal|slate|orange|emerald|amber/i,
    );
  });

  it('falls back to a valid style for an unknown category', () => {
    expect(challengeCategoryStyle('does-not-exist').badgeClass).toBe(
      CHALLENGE_CATEGORY_STYLES['solana-fundamentals'].badgeClass,
    );
  });
});
```

- [ ] **Step 2: Run it — verify it fails.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/challenge-categories.test.ts`
Expected: FAIL — cannot resolve `../challenge-categories`.

- [ ] **Step 3: Create `src/lib/challenge-categories.ts`:**

```ts
export type ChallengeCategory =
  | 'solana-fundamentals'
  | 'defi'
  | 'nft-metaplex'
  | 'security'
  | 'token-extensions';

interface CategoryStyle {
  /** Left-border accent (decorative bright fill). */
  borderClass: string;
  /** Tinted badge: tint bg + AA-readable -deep/link text. */
  badgeClass: string;
  /** AA-readable text for the large category stat number. */
  statClass: string;
}

export const CHALLENGE_CATEGORY_STYLES: Record<ChallengeCategory, CategoryStyle> = {
  'solana-fundamentals': {
    borderClass: 'border-l-skyblue',
    badgeClass: 'bg-skyblue/10 text-link',
    statClass: 'text-link',
  },
  defi: {
    borderClass: 'border-l-gold',
    badgeClass: 'bg-gold/20 text-clay-deep',
    statClass: 'text-clay-deep',
  },
  'nft-metaplex': {
    borderClass: 'border-l-clay',
    badgeClass: 'bg-clay/15 text-clay-deep',
    statClass: 'text-clay-deep',
  },
  security: {
    borderClass: 'border-l-rust',
    badgeClass: 'bg-rust/15 text-rust-deep',
    statClass: 'text-rust-deep',
  },
  'token-extensions': {
    borderClass: 'border-l-leaf',
    badgeClass: 'bg-leaf/20 text-green-deep',
    statClass: 'text-green-deep',
  },
};

/** Resolve a category's brand style; falls back to Solana Fundamentals. */
export function challengeCategoryStyle(category: string): CategoryStyle {
  return (
    CHALLENGE_CATEGORY_STYLES[category as ChallengeCategory] ??
    CHALLENGE_CATEGORY_STYLES['solana-fundamentals']
  );
}
```

- [ ] **Step 4: Run it — verify it passes.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/challenge-categories.test.ts`
Expected: PASS (4/4).

- [ ] **Step 5: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/lib/challenge-categories.ts app/src/lib/__tests__/challenge-categories.test.ts
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: add single-source brand challenge-categories module"
```

---

## Task 3: `difficulty-badge.tsx` — source from `difficulty.ts` (DRY)

**Files:**
- Modify: `src/components/courses/difficulty-badge.tsx`

- [ ] **Step 1: Replace the whole file** (drops the local `DIFFICULTY_CONFIG`; same brand classes now come from the module; `t(key)` label preserved):

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { difficultyClass, DIFFICULTY_LEVELS } from '@/lib/difficulty';

interface DifficultyBadgeProps {
  difficulty: number;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const t = useTranslations('courses');
  const key = DIFFICULTY_LEVELS[difficulty] ?? DIFFICULTY_LEVELS[0];

  return (
    <Badge variant="outline" className={cn(difficultyClass(difficulty), className)}>
      {t(key)}
    </Badge>
  );
}
```

- [ ] **Step 2: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|red-[0-9]|violet|fuchsia|rose|slate|orange' src/components/courses/difficulty-badge.tsx`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.** Run: `pnpm build && npx tsc --noEmit` → green/clean.

- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/courses/difficulty-badge.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "refactor: source difficulty badge from the difficulty module"
```

---

## Task 4: `daily-challenge-card.tsx` — brand difficulty

**Files:**
- Modify: `src/components/challenges/daily-challenge-card.tsx`

- [ ] **Step 1: Add the import** (after the `cn` import, line 6):

```tsx
import { difficultyClass } from '@/lib/difficulty';
```

- [ ] **Step 2: Delete the local `DIFFICULTY_STYLES` const** (lines 29–33, the whole `const DIFFICULTY_STYLES: Record<Difficulty, string> = { … };` block).

- [ ] **Step 3: Swap the usage.** Change line 74 from:

```tsx
          <Badge variant="outline" className={cn(DIFFICULTY_STYLES[difficulty])}>
```

to:

```tsx
          <Badge variant="outline" className={cn(difficultyClass(difficulty))}>
```

*(Leave the emerald "Already attempted" check at line 96 — semantic status, kept. The `Difficulty` type alias on line 18 stays; it still types the prop.)*

- [ ] **Step 4: Off-palette guard — expect no matches** (emerald check kept, excluded):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'amber|red-[0-9]|violet|fuchsia|rose|slate|orange|purple|indigo|pink|teal|cyan' src/components/challenges/daily-challenge-card.tsx`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.** → green/clean.

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/challenges/daily-challenge-card.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the daily challenge card difficulty badge"
```

---

## Task 5: `past-challenges.tsx` — brand difficulty (keep result status)

**Files:**
- Modify: `src/components/challenges/past-challenges.tsx`

- [ ] **Step 1: Add the import** (after the `cn` import, line 5):

```tsx
import { difficultyClass } from '@/lib/difficulty';
```

- [ ] **Step 2: Delete the local `DIFFICULTY_STYLES` const** (lines 28–32). **Keep `RESULT_CONFIG`** (lines 34–54 — passed=emerald / failed=red / not_attempted=muted are semantic status).

- [ ] **Step 3: Swap the usage.** Change the badge (around line 198–201) from:

```tsx
                  <Badge
                    variant="outline"
                    className={cn('shrink-0', DIFFICULTY_STYLES[challenge.difficulty])}
                  >
```

to:

```tsx
                  <Badge
                    variant="outline"
                    className={cn('shrink-0', difficultyClass(challenge.difficulty))}
                  >
```

- [ ] **Step 4: Off-palette guard — expect no matches** (emerald/red result colors kept, excluded):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'amber|violet|fuchsia|rose|slate|orange|purple|indigo|pink|teal|cyan' src/components/challenges/past-challenges.tsx`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.** → green/clean.

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/challenges/past-challenges.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the past-challenges difficulty badges"
```

---

## Task 6: `challenge-instructions.tsx` — brand difficulty

**Files:**
- Modify: `src/components/challenges/challenge-instructions.tsx`

- [ ] **Step 1: Add the import** (after the `cn` import, line 15):

```tsx
import { difficultyClass } from '@/lib/difficulty';
```

- [ ] **Step 2: Delete the local `DIFFICULTY_STYLES` const** (lines 43–47, the `const DIFFICULTY_STYLES = { … } as const;` block).

- [ ] **Step 3: Swap the usage.** Change the badge (lines 103–109) from:

```tsx
            <Badge
              variant="secondary"
              className={cn(
                'text-xs capitalize',
                DIFFICULTY_STYLES[challenge.difficulty],
              )}
            >
```

to:

```tsx
            <Badge
              variant="outline"
              className={cn('text-xs capitalize', difficultyClass(challenge.difficulty))}
            >
```

*(Switched `variant="secondary"` → `variant="outline"` to match every other difficulty badge in the app.)*

- [ ] **Step 4: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|red-[0-9]|violet|fuchsia|rose|slate|orange|purple|indigo|pink|teal|cyan' src/components/challenges/challenge-instructions.tsx`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.** → green/clean.

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/challenges/challenge-instructions.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the challenge instructions difficulty badge"
```

---

## Task 7: `challenge-browser-card.tsx` — category + difficulty modules

**Files:**
- Modify: `src/components/challenges/challenge-browser-card.tsx`

**Interfaces:**
- Consumes: `challengeCategoryStyle` (Task 2), `difficultyClass` (Task 1).

- [ ] **Step 1: Replace the imports + the three local maps** (lines 1–29) with:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Clock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { difficultyClass } from '@/lib/difficulty';
import { challengeCategoryStyle } from '@/lib/challenge-categories';
import type { CodingChallenge } from '@/lib/challenges';
```

- [ ] **Step 2: Resolve the style inside the component.** Immediately after `const t = useTranslations('challenges_page');` (line 37), add:

```tsx
  const category = challengeCategoryStyle(challenge.category);
```

- [ ] **Step 3: Use the brand left-border.** Change the root wrapper (lines 40–46) from:

```tsx
      className={cn(
        'group relative flex flex-col gap-3 rounded-lg border-l-4 border bg-card p-4 transition-colors hover:bg-accent/50',
        CATEGORY_ACCENT[challenge.category],
        className,
      )}
```

to:

```tsx
      className={cn(
        'group relative flex flex-col gap-3 rounded-lg border-l-4 border bg-card p-4 transition-colors hover:bg-accent/50',
        category.borderClass,
        className,
      )}
```

- [ ] **Step 4: Use the brand category + difficulty badges.** Change the badge row (lines 49–54) from:

```tsx
        <Badge variant="secondary" className={cn('text-[10px]', CATEGORY_BADGE[challenge.category])}>
          {t(challenge.category.replace('-', '_') as 'solana_fundamentals' | 'defi' | 'nft_metaplex' | 'security' | 'token_extensions')}
        </Badge>
        <Badge variant="outline" className={cn('text-[10px]', DIFFICULTY_STYLES[challenge.difficulty])}>
          {t(challenge.difficulty)}
        </Badge>
```

to:

```tsx
        <Badge variant="outline" className={cn('text-[10px]', category.badgeClass)}>
          {t(challenge.category.replace('-', '_') as 'solana_fundamentals' | 'defi' | 'nft_metaplex' | 'security' | 'token_extensions')}
        </Badge>
        <Badge variant="outline" className={cn('text-[10px]', difficultyClass(challenge.difficulty))}>
          {t(challenge.difficulty)}
        </Badge>
```

- [ ] **Step 5: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|red-[0-9]|violet|fuchsia|rose|slate|orange|purple|indigo|pink|teal|cyan' src/components/challenges/challenge-browser-card.tsx`
Expected: no matches (exit 1).

- [ ] **Step 6: Build + typecheck.** → green/clean.

- [ ] **Step 7: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/challenges/challenge-browser-card.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: source challenge card colors from the brand modules"
```

---

## Task 8: `speed-leaderboard.tsx` — brand podium

**Files:**
- Modify: `src/components/challenges/speed-leaderboard.tsx`

- [ ] **Step 1: Re-brand the rank map.** Change `RANK_STYLES` (lines 35–39) from:

```tsx
const RANK_STYLES: Record<number, string> = {
  1: 'text-amber-500',
  2: 'text-slate-400',
  3: 'text-amber-700 dark:text-amber-600',
};
```

to:

```tsx
const RANK_STYLES: Record<number, string> = {
  1: 'text-clay-deep',
  2: 'text-muted-foreground',
  3: 'text-rust-deep',
};
```

- [ ] **Step 2: Re-brand the Trophy icon.** Change line 65 from:

```tsx
          <Trophy className="size-4 text-amber-500" />
```

to:

```tsx
          <Trophy className="size-4 text-clay-deep" />
```

*(The rank usage on line 105 — `RANK_STYLES[entry.rank] ?? 'text-muted-foreground'` — is unchanged.)*

- [ ] **Step 3: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'amber|slate|violet|fuchsia|rose|orange|purple|indigo|pink|teal|cyan' src/components/challenges/speed-leaderboard.tsx`
Expected: no matches (exit 1).

- [ ] **Step 4: Build + typecheck.** → green/clean.

- [ ] **Step 5: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/challenges/speed-leaderboard.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: re-brand the speed leaderboard podium colors"
```

---

## Task 9: `challenges/page.tsx` (daily) — PageHeader + width cap

**Files:**
- Modify: `src/app/[locale]/(platform)/challenges/page.tsx`

- [ ] **Step 1: Add the import** (after the `Badge` import, line 6):

```tsx
import { PageHeader } from '@/components/ui/page-header';
```

- [ ] **Step 2: Cap the page width.** Change the root (line 24) from:

```tsx
    <div className="flex flex-col gap-6">
```

to:

```tsx
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
```

- [ ] **Step 3: Replace the hand-rolled header** (lines 42–51, the `{/* Page Header */}` block) with the `PageHeader` recipe (preserving the existing English copy):

```tsx
      {/* Page Header */}
      <PageHeader
        title="Daily Challenges"
        description="Test your skills with a new coding challenge every day. One attempt per day -- make it count."
      />
```

- [ ] **Step 4: Off-palette guard — expect no matches** (primary rules-banner kept):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'amber|slate|violet|fuchsia|rose|orange|purple|indigo|pink|teal|cyan|blue-[0-9]' 'src/app/[locale]/(platform)/challenges/page.tsx'`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.** → green/clean.

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add 'app/src/app/[locale]/(platform)/challenges/page.tsx'
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: adopt PageHeader and width cap on the daily challenges page"
```

---

## Task 10: `challenges/library/page.tsx` — category stats + PageHeader + width cap

**Files:**
- Modify: `src/app/[locale]/(platform)/challenges/library/page.tsx`

- [ ] **Step 1: Add the imports** (after the `cn` import, line 20):

```tsx
import { PageHeader } from '@/components/ui/page-header';
import { challengeCategoryStyle } from '@/lib/challenge-categories';
```

- [ ] **Step 2: Re-brand the category stat colors.** Change `CATEGORY_STATS` (lines 29–35) from the `color:` per row to use the module (drop the `text-violet-400`/`text-fuchsia-400` etc.):

```tsx
const CATEGORY_STATS = [
  { key: 'solana-fundamentals', labelKey: 'solana_fundamentals' },
  { key: 'defi', labelKey: 'defi' },
  { key: 'nft-metaplex', labelKey: 'nft_metaplex' },
  { key: 'security', labelKey: 'security' },
  { key: 'token-extensions', labelKey: 'token_extensions' },
] as const;
```

- [ ] **Step 3: Cap the page width.** Change the root (line 104) from:

```tsx
    <div className="flex flex-col gap-6">
```

to:

```tsx
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
```

- [ ] **Step 4: Replace the hand-rolled header** (lines 122–133, the `{/* Page header */}` block) with:

```tsx
      {/* Page header */}
      <PageHeader title={t('library_title')} description={t('library_description')} />
```

- [ ] **Step 5: Use the module for the stat number color.** Change the stat number span (line 148) from:

```tsx
            <span className={cn('text-2xl font-bold', cat.color)}>
```

to:

```tsx
            <span className={cn('text-2xl font-bold', challengeCategoryStyle(cat.key).statClass)}>
```

- [ ] **Step 6: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|rose|slate|orange|purple|indigo|pink|teal|cyan|blue-[0-9]' 'src/app/[locale]/(platform)/challenges/library/page.tsx'`
Expected: no matches (exit 1).

- [ ] **Step 7: Build + typecheck.** → green/clean.

- [ ] **Step 8: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add 'app/src/app/[locale]/(platform)/challenges/library/page.tsx'
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand category stats and adopt PageHeader on the challenge library"
```

---

## Task 11: `solution-toggle.tsx` — `neutral-*` → semantic tokens

**Files:**
- Modify: `src/components/challenges/solution-toggle.tsx`

- [ ] **Step 1: Re-skin the code-block chrome** (keep the Monaco hexes `#1e1e1e`/`#d4d4d4`). Change the `SolutionCodeBlock` wrapper + header + line-number span:

Line 36 — from:

```tsx
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
```

to:

```tsx
    <div className="overflow-hidden rounded-lg border">
```

Line 37 — from:

```tsx
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
```

to:

```tsx
      <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
```

Line 48 — from:

```tsx
              <span className="mr-4 inline-block w-8 select-none text-right text-neutral-600">
```

to:

```tsx
              <span className="mr-4 inline-block w-8 select-none text-right text-muted-foreground">
```

- [ ] **Step 2: Off-palette guard — expect no matches** (Monaco `#1e1e1e`/`#d4d4d4` kept; amber dialog warning kept):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'neutral-[0-9]|violet|fuchsia|rose|slate|orange|purple|indigo|pink|teal|cyan' src/components/challenges/solution-toggle.tsx`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.** → green/clean.

- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/challenges/solution-toggle.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: replace neutral greys with semantic tokens in solution toggle"
```

---

## Part Gate (run after all 11 tasks — do NOT skip)

- [ ] **Unit tests:** `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run` → **382 passing** (375 + 3 difficulty + 4 challenge-categories).
- [ ] **Cluster off-palette guard #1 (track/decorative + metallic intruders — NOT the kept emerald/red/amber/blue):**
  `rg -n 'violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate|orange' src/components/challenges 'src/app/[locale]/(platform)/challenges' src/lib/challenge-categories.ts src/lib/difficulty.ts` → **zero**.
- [ ] **Cluster off-palette guard #2 (neutral greys in challenge components):**
  `rg -n 'neutral-[0-9]' src/components/challenges` → **zero**.
- [ ] **Build + typecheck:** `pnpm build` green · `npx tsc --noEmit` clean.
- [ ] **Visual smoke (prod server, light + dark)** on all three routes: daily (`/en/challenges`), library (`/en/challenges/library`), solver (`/en/courses/solana-101/challenge`). Confirm: PageHeader gold dividers; brand category cards (skyblue/gold/clay/rust/leaf left-borders + badges); brand difficulty badges matching the course pages; brand podium (1st clay-deep / 3rd rust-deep) + clay-deep Trophy; solver still full-bleed with Monaco + test pass/fail (emerald/red) + amber hints intact; dark not broken. *(Direct-load detail-page caveat from 4.2 may affect the solver if it shares the course store — note any anomaly; it's the known pre-existing bug, not a 4.3 regression.)*
- [ ] **e2e (if the dev server cooperates / in CI):** clean-slate `pkill -f 'next dev'; pkill -f 'next-server'; lsof -ti:3000 | xargs kill -9` then one `pnpm exec playwright test --project=chromium`. Infra-block is acceptable evidence-substitute (precedent 4.0–4.2).
- [ ] **Read-only opus review** of the cluster diff (`git -C /Users/rector/local-dev/superteam-academy diff 031eac0..HEAD -- app/`): difficulty + category single-sourcing complete (no residual local maps), no off-palette residue (minus kept-list), podium brand, AA holds, theme not broken, import hygiene, no AI attribution.
- [ ] **Update the SDD ledger** `/Users/rector/local-dev/superteam-academy/.git/sdd/progress.md` with the cluster result + note `streak-counter` deferred to 4.4.

---

## Self-Review (against the master plan + recon)

1. **Single-sourcing coverage:** the 5 duplicated `DIFFICULTY_STYLES` maps (course `difficulty-badge` + 4 challenge components) all migrate to `difficulty.ts` (Tasks 3–7); the violet/fuchsia category maps in `challenge-browser-card` + `library/page` migrate to `challenge-categories.ts` (Tasks 7, 10). ✓
2. **Master Appendix-A / Challenges screens:** daily (Task 9), library (Tasks 7/10), per-course solver (Tasks 6/11 components; page is full-bleed verify-only). ✓
3. **Kept-semantic verified:** test pass/fail (emerald/red), hint/solution warnings (amber), Monaco hexes, destructive, daily-card "attempted" emerald, `past-challenges` `RESULT_CONFIG` — all explicitly out-of-scope. ✓
4. **Podium → brand** (Task 8); difficulty + category → brand classification (single source). ✓
5. **PageHeader recipe** on both contained pages (Tasks 9, 10); solver stays full-bleed; `PageContainer` deviation documented (same as 4.2). ✓
6. **No placeholders:** every code step shows complete code; every verify step is a runnable command with expected output. ✓
7. **Type consistency:** `difficultyClass` accepts `DifficultyLevel | number`; challenge difficulty is the string level, course `difficulty` is the numeric index — both supported. `challengeCategoryStyle(category: string)` tolerates the `CodingChallenge.category` union. Modules (Tasks 1–2) defined before their Task 3–10 consumers. ✓
8. **`StreakCounter` correctly deferred to 4.4** (only consumer is the dashboard welcome-banner). ✓
9. **Repo-safety** (twin `core`) in every commit step. ✓
10. **Right-sized:** 11 independently buildable/guardable/committable tasks; the rest verify-only with stated reasons.
