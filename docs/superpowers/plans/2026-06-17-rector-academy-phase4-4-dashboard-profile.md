# RECTOR Academy — Phase 4.4: Dashboard + Profile (Sub-Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (controller-inline) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. This sub-plan **inherits the master plan verbatim**: `docs/superpowers/plans/2026-06-17-rector-academy-phase4-tier1-redesigns.md` (Global Constraints + Phase-4 Design Language). Read it first. Apply `superpowers:frontend-design` per surface.

**Goal:** Redesign the Dashboard + Profile surfaces (dashboard page + 8 components · profile pages + 6 components · the deferred streak-counter · the gamification toasts/modals) to the locked RECTOR Academy design language — introduce one single-source `achievements.ts` rarity module (tinted, AA medallions), reuse the existing `difficulty.ts` to kill two off-brand difficulty-variant maps, apply a consistent stat-type→brand-family convention to the stat/activity surfaces, rebrand the streak to clay/gold, width-cap the contained pages — while keeping every semantic STATUS color (verification/complete emerald, destructive, locked) and all loading/empty/error states intact.

**Architecture:** A new `src/lib/achievements.ts` (rarity → tinted-medallion style, mirroring `difficulty.ts`/`challenge-categories.ts`) becomes the single source for achievement-badge colors; the three achievement-display components swap their off-palette `id→gradient` maps for a `rarity` field + the module. Stat/activity components adopt a documented stat-type→brand-family convention (XP=gold · Level/Lessons=skyblue · Streak=clay · Courses/Completed=leaf · Rank/Achievements=rust). The personalized heroes (`WelcomeBanner`, `ProfileHeader`) remain the page headers — contained pages get a width cap only (no redundant `PageHeader` band). Gamification overlays go to the gold/clay celebratory family.

**Tech Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript strict · Tailwind v4 (CSS-first `@theme`) · shadcn/ui · next-themes · next-intl (en/pt/es/hi) · Vitest · Playwright · pnpm.

---

## Global Constraints (inherits master — load-bearing restatements + 4.4 deltas)

- **Working root:** all commands run from `/Users/rector/local-dev/superteam-academy/app`. Paths below are relative to that `app/` unless they start with `docs/`.
- **★ REPO-SAFETY (load-bearing):** the controller cwd is the **`core` repo, a structural twin**. Use **absolute paths**; if the shell cwd is not the academy, `cd /Users/rector/local-dev/superteam-academy/app` first (the shell RESETS to `core` after every command — re-cd each time); **before each commit** confirm `git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel` ends in `superteam-academy`, and after each commit confirm `git -C /Users/rector/local-dev/core status` is clean. Commit with `git -C /Users/rector/local-dev/superteam-academy …`.
- **Branch:** `chore/rector-academy-revival` (NOT main). Do NOT merge (Phase-5 fresh repo integrates). Base HEAD: `6375c58` (end of 4.3).
- **Palette + readable tokens:** cream `#FFF7E1` / brown `#3B2C22` + skyblue/gold/clay/leaf/rust. Readable-on-cream text uses `-deep`/`link`: `link #0D7390` · `green-deep #3C6A12` · `clay-deep #8A4A12` · `rust-deep #A23B22`. Bright tokens = decorative fills only. **NEVER** define/use `--color-sky/yellow/red/green`.
- **Brand CLASSIFICATION** (stat-type, rarity, streak, skill) uses the `-deep`/`link` readable tokens **without** `dark:` variants — exactly as clusters 4.2/4.3 did. **KEEP semantic STATUS** with its existing `dark:` variants: verification/earned check (emerald), lesson-complete checkmark (emerald), `destructive` errors, locked (`bg-muted`). Theme-managed tokens (`primary`/`background`/`foreground`/`muted`/`secondary`/`border`/`card`) keep their `dark:` variants — leave them.
- **★ Stat-type → brand-family convention (4.4 single source of truth — apply identically in `quick-stats`, `stats-summary`, `activity-feed`, `recommended-courses`):**
  | Stat type | iconBg (tint) | icon + accent text (AA) |
  |---|---|---|
  | XP / points | `bg-gold/20` | `text-clay-deep` |
  | Level | `bg-skyblue/10` | `text-link` |
  | Streak (active) | `bg-clay/15` | `text-clay-deep` |
  | Streak (inactive) | `bg-muted` | `text-muted-foreground` |
  | Courses / Enrolled | `bg-leaf/20` | `text-green-deep` |
  | Completed | `bg-leaf/20` | `text-green-deep` |
  | Lessons | `bg-skyblue/10` | `text-link` |
  | Credentials | `bg-clay/15` | `text-clay-deep` |
  | Rank / Achievements | `bg-rust/15` | `text-rust-deep` |
  Collisions across only 5 brand families are expected and acceptable — the icon + label disambiguate. **Drop all `dark:` variants** on these classification colors.
- **Single-source rule:** achievement medallion colors come from the new `src/lib/achievements.ts` (by rarity); difficulty colors from the existing `src/lib/difficulty.ts`; track tints from the existing `src/lib/tracks.ts`. Never re-hardcode a rarity/difficulty/track hue in a component.
- **Icons:** Lucide only, no emoji. **Commits:** conventional, **one per task**, **NO AI attribution**, GPG-signed. **No shortcuts:** preserve every loading/empty/error state + a11y AA + the `prefers-reduced-motion` guards on animations.
- **zsh quoting:** quote any path containing `[locale]`/`(platform)`/`[wallet]` for `rg`/`git`.
- **Testing rhythm (matches 4.0–4.3):** the new `achievements.ts` module is unit-tested (full TDD). Visual components gate on **`pnpm build` green + `npx tsc --noEmit` clean + the file's off-palette guard returns no matches**; the part gate adds `pnpm test:run` + prod-server visual smoke (light + dark) + e2e.
- **★ Per-task off-palette guard — use the precise `slate-[0-9]` form, NOT bare `slate`** (bare `slate` matches Tailwind's `translate` utility — the false positive that bit the 4.3 plan). Likewise the brand `skyblue` token is safe; the off-palette default `sky` scale is `sky-[0-9]`. Standard 4.4 guard body (tailor the kept-semantic exclusions per task): `'violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]|zinc|gray|stone'` plus `amber|emerald|red-[0-9]|green-[0-9]|neutral-[0-9]` where those are NOT kept-semantic in the file.
- **Per-task gate:** `cd /Users/rector/local-dev/superteam-academy/app && pnpm build` (green) + `npx tsc --noEmit` (clean) + the task's off-palette guard (expected result). *(`rg` regex is the default — use `rg -n 'pat'`, NOT `rg -nE`.)*
- **Part gate (end of sub-plan):** `pnpm test:run` = **386 passing** (382 + 4 new `achievements.ts` tests) · cluster off-palette guards (below) return their expected results · prod-server visual smoke light+dark on `/en/dashboard` + `/en/profile/<wallet>` · e2e chromium (reuse prod server) · read-only opus review.
- **Dev/visual infra:** Turbopack `pnpm dev` first-compile HANGS → use the **prod server** for visual: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && PORT=3000 pnpm start`, then Chrome MCP. localStorage may hold a stale `theme` — set it explicitly per theme. e2e: with the prod server already on :3000, `pnpm exec playwright test --project=chromium` REUSES it (`reuseExistingServer:!CI`) → runs in ~16s, sidestepping the dev hang.

---

## 4.4-specific design decisions (RECTOR-confirmed 2026-06-19 — read before executing)

1. **Streak → clay/gold (RECTOR).** Every streak indicator rebrands: active flame → `text-clay-deep` (+ optional gold glow `rgba(249,200,70,…)`); the freeze/snowflake power-up → skyblue/link (`text-link`, `bg-skyblue/10`, skyblue glow `rgba(65,207,255,…)`). Applied consistently across `streak-counter`, `quick-stats` streak card, `stats-summary` streak card, and `activity-feed` `streak_milestone`. Inactive streak stays `text-muted-foreground`/`bg-muted`.
2. **Achievements → tinted, rarity-driven medallions (RECTOR).** New `src/lib/achievements.ts` maps rarity → tinted medallion (NOT white-on-gradient): `common → bg-muted` (no ring) · `rare → bg-leaf/20` (+`ring-1 ring-leaf/40`) · `epic → bg-clay/15` (+`ring-2 ring-clay/40`) · `legendary → bg-gold/20` (+`ring-2 ring-gold/50`); icon + label use the matching AA token (`text-muted-foreground`/`text-green-deep`/`text-clay-deep`/`text-clay-deep`). This is a deliberate visual shift from the current gradient medallions + white trophy icons (white-on-light fails AA). The `AchievementDefinition.color` gradient field is replaced by a `rarity` field; the duplicated `id→gradient` maps are deleted.
3. **Extended gamification scope (RECTOR).** This cluster ALSO rebrands the gamification overlays `achievement-toast`, `xp-toast`, `level-up-modal`, `lesson-complete-animation` to the gold/clay celebratory family. **Still deferred to 4.5:** `level-badge` (rarity tiers) + `confetti-animation` (the `COLORS` hex array) — `level-up-modal` renders `ConfettiAnimation` but must NOT touch it.
4. **Page headers = width cap only.** The dashboard's `WelcomeBanner` and the profile's `ProfileHeader` are already personalized heroes (they own the `<h1>`). Adding `<PageHeader>` would stack two heading bands. So the two contained pages get the px-less `mx-auto w-full max-w-7xl` wrapper ONLY — no `PageHeader`, no `PageContainer` (shell `<main>` already pads `p-6 lg:p-8`). `profile/page.tsx` is a centered connect-prompt gate → untouched.
5. **KEEP these emeralds as semantic STATUS (master-plan keep-list — do NOT rebrand):** the achievement-badge "earned" check dot (`bg-emerald-500`), the profile-header copy-success check (`text-emerald-500`), the claim-achievement-button "Claimed on-chain" success link (emerald), and the `lesson-complete-animation` success **checkmark** (circle + check path emerald). In `lesson-complete-animation` only the floating "+XP" celebratory text rebrands.
6. **skill-radar → single skyblue.** Replace the violet `SKILL_COLORS` RGBA object with skyblue (`#41CFFF` = `rgba(65,207,255,…)`); collapse the dual light/dark polygons to one (brand classification has no `dark:`); keep `fill-foreground` axis labels (AA) and `stroke-border` grid.
7. **Difficulty single-source.** `continue-learning` + `recommended-courses` drop their local `DIFFICULTY_VARIANT(S)` maps (whose `destructive`/red Advanced is off-brand) and render the difficulty badge via `difficultyClass()` from `src/lib/difficulty.ts` (accepts numeric index AND lowercase level name).

---

## File Structure

**Created (2):** `src/lib/achievements.ts` (+ `src/lib/__tests__/achievements.test.ts`).

**Modified (18):**
- Module consumers (achievements): `src/components/profile/achievement-badge.tsx` (T2) · `src/components/profile/achievement-grid.tsx` (T3) · `src/components/dashboard/recent-achievements.tsx` (T4)
- Dashboard: `src/components/dashboard/quick-stats.tsx` (T5) · `activity-feed.tsx` (T6) · `activity-heatmap.tsx` (T7) · `continue-learning.tsx` (T8) · `recommended-courses.tsx` (T9) · `src/app/[locale]/(platform)/dashboard/page.tsx` (T10)
- Profile: `src/components/profile/stats-summary.tsx` (T11) · `completed-courses-list.tsx` (T12) · `skill-radar.tsx` (T13) · `src/app/[locale]/(platform)/profile/[wallet]/page.tsx` (T14)
- Gamification: `src/components/gamification/streak-counter.tsx` (T15) · `achievement-toast.tsx` (T16) · `xp-toast.tsx` (T17) · `level-up-modal.tsx` (T18) · `lesson-complete-animation.tsx` (T19)

**Verify-only (no change — semantic-only / already on-brand):** `dashboard/layout.tsx` (metadata), `dashboard/welcome-banner.tsx` (theme tokens; verify StreakCounter render unaffected), `dashboard/claim-achievement-button.tsx` (emerald claimed-link = success status, KEEP), `profile/page.tsx` (connect-prompt gate), `profile/profile-header.tsx` (random-HSL avatar + emerald copy-check = status). **Deferred to 4.5:** `gamification/level-badge.tsx`, `gamification/confetti-animation.tsx`.

---

## Task 1: `achievements.ts` — single-source rarity module (TDD)

**Files:**
- Create: `src/lib/achievements.ts`
- Test: `src/lib/__tests__/achievements.test.ts`

**Interfaces:**
- Produces: `ACHIEVEMENT_RARITIES: readonly ['common','rare','epic','legendary']`; `type AchievementRarity`; `achievementRarityStyle(rarity: string): { badgeClass: string; iconClass: string; textClass: string; ringClass: string }`. Consumed by Tasks 2–4.

- [ ] **Step 1: Write the failing test** — create `src/lib/__tests__/achievements.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  achievementRarityStyle,
  ACHIEVEMENT_RARITY_STYLES,
  ACHIEVEMENT_RARITIES,
} from '../achievements';

describe('achievements rarity module', () => {
  it('styles all four rarities in ascending order', () => {
    expect(ACHIEVEMENT_RARITIES).toEqual(['common', 'rare', 'epic', 'legendary']);
    expect(Object.keys(ACHIEVEMENT_RARITY_STYLES)).toEqual([
      'common',
      'rare',
      'epic',
      'legendary',
    ]);
  });

  it('uses AA-readable text tokens (or muted) for every icon + label', () => {
    for (const s of Object.values(ACHIEVEMENT_RARITY_STYLES)) {
      expect(s.iconClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep|muted-foreground)/);
      expect(s.textClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep|muted-foreground)/);
    }
  });

  it('escalates the ring with rarity (common has none, legendary has the strongest)', () => {
    expect(achievementRarityStyle('common').ringClass).toBe('');
    expect(achievementRarityStyle('legendary').ringClass).toContain('ring-2');
  });

  it('contains no off-palette color names', () => {
    expect(JSON.stringify(ACHIEVEMENT_RARITY_STYLES)).not.toMatch(
      /violet|purple|indigo|fuchsia|pink|rose|teal|cyan|slate|orange|emerald|amber|zinc|red-[0-9]|blue-[0-9]/i,
    );
  });

  it('falls back to common for an unknown rarity', () => {
    expect(achievementRarityStyle('does-not-exist').badgeClass).toBe(
      ACHIEVEMENT_RARITY_STYLES.common.badgeClass,
    );
  });
});
```

- [ ] **Step 2: Run it — verify it fails.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/achievements.test.ts`
Expected: FAIL — cannot resolve `../achievements`.

- [ ] **Step 3: Create `src/lib/achievements.ts`:**

```ts
export const ACHIEVEMENT_RARITIES = ['common', 'rare', 'epic', 'legendary'] as const;
export type AchievementRarity = (typeof ACHIEVEMENT_RARITIES)[number];

interface RarityStyle {
  /** Tinted medallion fill (decorative). */
  badgeClass: string;
  /** AA-readable brand icon color on the tint. */
  iconClass: string;
  /** AA-readable rarity label text. */
  textClass: string;
  /** Ring intensity escalates with rarity; no metallics. */
  ringClass: string;
}

export const ACHIEVEMENT_RARITY_STYLES: Record<AchievementRarity, RarityStyle> = {
  common: {
    badgeClass: 'bg-muted',
    iconClass: 'text-muted-foreground',
    textClass: 'text-muted-foreground',
    ringClass: '',
  },
  rare: {
    badgeClass: 'bg-leaf/20',
    iconClass: 'text-green-deep',
    textClass: 'text-green-deep',
    ringClass: 'ring-1 ring-leaf/40',
  },
  epic: {
    badgeClass: 'bg-clay/15',
    iconClass: 'text-clay-deep',
    textClass: 'text-clay-deep',
    ringClass: 'ring-2 ring-clay/40',
  },
  legendary: {
    badgeClass: 'bg-gold/20',
    iconClass: 'text-clay-deep',
    textClass: 'text-clay-deep',
    ringClass: 'ring-2 ring-gold/50',
  },
};

/** Resolve a rarity's brand medallion style; falls back to common. */
export function achievementRarityStyle(rarity: string): RarityStyle {
  return (
    ACHIEVEMENT_RARITY_STYLES[rarity as AchievementRarity] ??
    ACHIEVEMENT_RARITY_STYLES.common
  );
}
```

- [ ] **Step 4: Run it — verify it passes.** Run the same test command. Expected: PASS (5/5).
- [ ] **Step 5: Build + typecheck.** Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit` → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel   # must end in /superteam-academy
git -C /Users/rector/local-dev/superteam-academy add app/src/lib/achievements.ts app/src/lib/__tests__/achievements.test.ts
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: add single-source achievement rarity module"
git -C /Users/rector/local-dev/superteam-academy status   # clean check; then verify core clean
```

---

## Task 2: `achievement-badge.tsx` — rarity field + tinted medallion

**Files:** Modify `src/components/profile/achievement-badge.tsx`

**Interfaces:** Consumes `achievementRarityStyle` (T1). Produces the changed `AchievementDefinition` (drops `color`, adds `rarity: AchievementRarity`) consumed by T3/T4.

- [ ] **Step 1: Swap the import + interface.** Change the import block (lines 3–9) to add the module, and change the interface `color` field to `rarity`. Replace:

```tsx
import { Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  color: string;
}
```

with:

```tsx
import { Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { achievementRarityStyle, type AchievementRarity } from '@/lib/achievements';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  rarity: AchievementRarity;
}
```

- [ ] **Step 2: Resolve the style + rebrand the main medallion.** Immediately after the function signature open `}: AchievementBadgeProps) {` (line 28), add `const style = achievementRarityStyle(achievement.rarity);` as the first line of the body. Then replace the earned branch of the main medallion (lines 45–52):

```tsx
                isEarned
                  ? cn(
                    'bg-gradient-to-br shadow-lg',
                    achievement.color,
                    'shadow-current/20',
                  )
                  : 'bg-muted border-2 border-dashed border-muted-foreground/30',
```

with:

```tsx
                isEarned
                  ? cn(style.badgeClass, style.ringClass, 'shadow-sm')
                  : 'bg-muted border-2 border-dashed border-muted-foreground/30',
```

- [ ] **Step 3: Rebrand the earned trophy icon (main + popover).** Change line 55 from `<Trophy className="size-6 text-white drop-shadow-sm" />` to `<Trophy className={cn('size-6', style.iconClass)} />`. Change line 100 from `<Trophy className="size-3.5 text-white" />` to `<Trophy className={cn('size-3.5', style.iconClass)} />`.

- [ ] **Step 4: Rebrand the popover mini-medallion.** Change the earned branch (line 95) from `? cn('bg-gradient-to-br', achievement.color)` to `? cn(style.badgeClass, style.ringClass)`.

- [ ] **Step 5: Rebrand the locked hint (amber → clay-deep, classification not status).** Change line 118 from `<p className="text-[10px] font-medium text-amber-600 dark:text-amber-400">` to `<p className="text-[10px] font-medium text-clay-deep">`.

*(KEEP the earned check dot `bg-emerald-500` at line 62 — semantic earned/verified status. KEEP the locked `bg-muted` / `text-muted-foreground` states.)*

- [ ] **Step 6: Off-palette guard — expect no matches** (emerald check dot kept, excluded):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/profile/achievement-badge.tsx`
Expected: no matches (exit 1). Then confirm the kept emerald dot is still present: `rg -n 'bg-emerald-500' src/components/profile/achievement-badge.tsx` (1 match, line ~62).

- [ ] **Step 7: Build + typecheck.** → green/clean. *(Will FAIL tsc until T3/T4 update their catalogs to supply `rarity` — that's expected; the executor may run the full build after T4. If executing strictly per-task, expect a tsc error about missing `rarity`/excess `color` in the catalogs; proceed to T3/T4 which fix it, then build green at T4.)*
- [ ] **Step 8: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/profile/achievement-badge.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: render tinted rarity-driven achievement medallions"
```

---

## Task 3: `achievement-grid.tsx` — catalog rarity + module

**Files:** Modify `src/components/profile/achievement-grid.tsx`

- [ ] **Step 1: Replace each `color:` gradient with a `rarity:` in `ALL_ACHIEVEMENTS`** (lines 16–95). For each entry, delete the `color: 'from-… to-…',` line and add `rarity: '<value>',` using this id→rarity map:

```
first-lesson → common      first-course → common     streak-7 → rare
streak-30 → epic           streak-100 → legendary    xp-1000 → rare
xp-5000 → legendary        first-credential → epic   all-beginner → rare
defi-track → epic          nft-track → epic          security-track → legendary
core-track → epic
```

Concretely, change each `color:` line: L21 `color: 'from-emerald-400 to-emerald-600',`→`rarity: 'common',` · L27 `color: 'from-blue-400 to-blue-600',`→`rarity: 'common',` · L33 `color: 'from-orange-400 to-orange-600',`→`rarity: 'rare',` · L39 `color: 'from-red-400 to-red-600',`→`rarity: 'epic',` · L45 `color: 'from-amber-500 to-red-700',`→`rarity: 'legendary',` · L51 `color: 'from-yellow-400 to-yellow-600',`→`rarity: 'rare',` · L57 `color: 'from-amber-400 to-amber-600',`→`rarity: 'legendary',` · L63 `color: 'from-violet-400 to-violet-600',`→`rarity: 'epic',` · L69 `color: 'from-teal-400 to-teal-600',`→`rarity: 'rare',` · L75 `color: 'from-blue-500 to-indigo-600',`→`rarity: 'epic',` · L81 `color: 'from-pink-400 to-rose-600',`→`rarity: 'epic',` · L87 `color: 'from-orange-500 to-red-600',`→`rarity: 'legendary',` · L93 `color: 'from-purple-400 to-violet-600',`→`rarity: 'epic',`.

*(The `AchievementDefinition` type imported from `achievement-badge` now requires `rarity` and forbids `color`, so these edits make the file typecheck.)*

- [ ] **Step 2: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]|red-[0-9]' src/components/profile/achievement-grid.tsx`
Expected: no matches (exit 1). *(Verify no residual `color: 'from-` remains: `rg -n "color: 'from-" src/components/profile/achievement-grid.tsx` → none.)*

- [ ] **Step 3: Build + typecheck.** → green/clean.
- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/profile/achievement-grid.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: drive achievement grid colors from the rarity module"
```

---

## Task 4: `recent-achievements.tsx` — catalog rarity + module medallion

**Files:** Modify `src/components/dashboard/recent-achievements.tsx`

- [ ] **Step 1: Add the import.** After the existing imports (the `cn` import), add:

```tsx
import { achievementRarityStyle, type AchievementRarity } from '@/lib/achievements';
```

- [ ] **Step 2: Change the `ACHIEVEMENT_META` type + entries.** Change the declaration (line 34) from `const ACHIEVEMENT_META: Record<string, { name: string; description: string; color: string }> = {` to `const ACHIEVEMENT_META: Record<string, { name: string; description: string; rarity: AchievementRarity }> = {`. Then replace each entry's `color:` line with a `rarity:` (same id→rarity map as T3 for the shared ids): L38 `color: 'from-emerald-400 to-emerald-600',`→`rarity: 'common',` · L43 `color: 'from-blue-400 to-blue-600',`→`rarity: 'common',` · L48 `color: 'from-orange-400 to-orange-600',`→`rarity: 'rare',` · L53 `color: 'from-red-400 to-red-600',`→`rarity: 'epic',` · L58 `color: 'from-amber-500 to-red-700',`→`rarity: 'legendary',` · L63 `color: 'from-yellow-400 to-yellow-600',`→`rarity: 'rare',` · L68 `color: 'from-amber-400 to-amber-600',`→`rarity: 'legendary',` · L73 `color: 'from-violet-400 to-violet-600',`→`rarity: 'epic',` · L78 `color: 'from-teal-400 to-teal-600',`→`rarity: 'rare',`.

- [ ] **Step 3: Fix the fallback.** Change the fallback object (lines 84–88) from:

```tsx
    ACHIEVEMENT_META[id] ?? {
      name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: 'Achievement unlocked',
      color: 'from-zinc-400 to-zinc-600',
    }
```

to (replace `color` with `rarity: 'common'`):

```tsx
    ACHIEVEMENT_META[id] ?? {
      name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: 'Achievement unlocked',
      rarity: 'common' as AchievementRarity,
    }
```

- [ ] **Step 4: Rebrand the medallion render.** The medallion (lines ~102–106) uses `bg-gradient-to-br … meta.color` with a white Trophy. Change the medallion wrapper to use the module and the Trophy to the brand icon. Replace the medallion `className` segment `'flex size-12 … rounded-full bg-gradient-to-br shadow-sm …', meta.color` with `'flex size-12 … rounded-full', achievementRarityStyle(meta.rarity).badgeClass, achievementRarityStyle(meta.rarity).ringClass` (keep the existing size/layout classes verbatim; only swap `bg-gradient-to-br shadow-sm` + `meta.color` for the module classes), and change the Trophy `text-white` (line 106) to `className={cn('size-5', achievementRarityStyle(meta.rarity).iconClass)}`.

*(Read the exact lines 100–107 immediately before editing and match the surrounding layout classes verbatim. If a `const style = achievementRarityStyle(meta.rarity)` local inside the `.map` callback reads cleaner than calling it 3×, use that.)*

- [ ] **Step 5: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]|red-[0-9]|zinc' src/components/dashboard/recent-achievements.tsx`
Expected: no matches (exit 1).

- [ ] **Step 6: Build + typecheck.** → green/clean (this is where T2's deferred build turns green — all catalogs now supply `rarity`).
- [ ] **Step 7: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/dashboard/recent-achievements.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: drive recent achievements colors from the rarity module"
```

---

## Task 5: `quick-stats.tsx` — brand stat cards

**Files:** Modify `src/components/dashboard/quick-stats.tsx`

Apply the stat-type→family convention. Make these exact replacements (drop every `dark:` variant):

- [ ] **Step 1: XP card** — L104 `text-yellow-600 dark:text-yellow-400`→`text-clay-deep` · L105 `bg-yellow-100 dark:bg-yellow-900/40`→`bg-gold/20` · L108 `text-yellow-600 dark:text-yellow-400`→`text-clay-deep`.
- [ ] **Step 2: Level card** — L115 `text-blue-600 dark:text-blue-400`→`text-link` · L116 `bg-blue-100 dark:bg-blue-900/40`→`bg-skyblue/10` · L120 `text-blue-600 dark:text-blue-400`→`text-link`.
- [ ] **Step 3: Streak card (→ clay, RECTOR)** — L130 `'text-orange-500'`→`'text-clay-deep'` · L138 `'bg-orange-100 dark:bg-orange-900/40'`→`'bg-clay/15'` · L145 `'text-orange-500'`→`'text-clay-deep'`. (Keep the inactive branches `text-muted-foreground`/`bg-muted` untouched.)
- [ ] **Step 4: Courses card** — L152 `text-emerald-600 dark:text-emerald-400`→`text-green-deep` · L153 `bg-emerald-100 dark:bg-emerald-900/40`→`bg-leaf/20` · L156 `text-emerald-600 dark:text-emerald-400`→`text-green-deep`.
- [ ] **Step 5: Rank card** — L161 `text-purple-600 dark:text-purple-400`→`text-rust-deep` · L162 `bg-purple-100 dark:bg-purple-900/40`→`bg-rust/15` · L165 `text-purple-600 dark:text-purple-400`→`text-rust-deep`.
- [ ] **Step 6: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/dashboard/quick-stats.tsx`
Expected: no matches (exit 1).

- [ ] **Step 7: Build + typecheck.** → green/clean.
- [ ] **Step 8: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/dashboard/quick-stats.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the dashboard quick-stats cards"
```

---

## Task 6: `activity-feed.tsx` — brand activity colors

**Files:** Modify `src/components/dashboard/activity-feed.tsx`

- [ ] **Step 1: Rebrand `ACTIVITY_COLOR`** (lines 60–67). Replace the whole map:

```tsx
const ACTIVITY_COLOR: Record<ActivityType, string> = {
  lesson_completed: 'text-blue-500 bg-blue-500/10',
  course_enrolled: 'text-emerald-500 bg-emerald-500/10',
  achievement_earned: 'text-amber-500 bg-amber-500/10',
  xp_earned: 'text-yellow-500 bg-yellow-500/10',
  streak_milestone: 'text-orange-500 bg-orange-500/10',
  challenge_completed: 'text-violet-500 bg-violet-500/10',
};
```

with (XP+achievement = gold/clay; lesson = sky/link; course = leaf/green; streak = clay per RECTOR; challenge = rust):

```tsx
const ACTIVITY_COLOR: Record<ActivityType, string> = {
  lesson_completed: 'text-link bg-skyblue/10',
  course_enrolled: 'text-green-deep bg-leaf/20',
  achievement_earned: 'text-clay-deep bg-gold/20',
  xp_earned: 'text-clay-deep bg-gold/20',
  streak_milestone: 'text-clay-deep bg-clay/15',
  challenge_completed: 'text-rust-deep bg-rust/15',
};
```

- [ ] **Step 2: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/dashboard/activity-feed.tsx`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.** → green/clean.
- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/dashboard/activity-feed.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the dashboard activity-feed type colors"
```

---

## Task 7: `activity-heatmap.tsx` — brand intensity ramp

**Files:** Modify `src/components/dashboard/activity-heatmap.tsx`

- [ ] **Step 1: Rebrand `getIntensityClass`** (lines 77–83). Replace the emerald ramp:

```tsx
  if (count === 0) return 'bg-muted';
  if (count <= 1) return 'bg-emerald-200 dark:bg-emerald-900';
  if (count <= 3) return 'bg-emerald-400 dark:bg-emerald-700';
  if (count <= 5) return 'bg-emerald-500 dark:bg-emerald-500';
  return 'bg-emerald-700 dark:bg-emerald-400';
```

with a leaf→green-deep brand ramp (4 distinguishable intensities on cream; the legend reuses this fn so it updates automatically):

```tsx
  if (count === 0) return 'bg-muted';
  if (count <= 1) return 'bg-leaf/30';
  if (count <= 3) return 'bg-leaf/60';
  if (count <= 5) return 'bg-leaf';
  return 'bg-green-deep';
```

- [ ] **Step 2: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/dashboard/activity-heatmap.tsx`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.** → green/clean.
- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/dashboard/activity-heatmap.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the activity heatmap intensity ramp"
```

---

## Task 8: `continue-learning.tsx` — difficulty via module

**Files:** Modify `src/components/dashboard/continue-learning.tsx`

- [ ] **Step 1: Add the import** (after the `cn` import): `import { difficultyClass } from '@/lib/difficulty';`
- [ ] **Step 2: Delete the `DIFFICULTY_VARIANTS` map** (lines 33–37, the whole `const DIFFICULTY_VARIANTS: Record<number, 'default' | 'secondary' | 'destructive'> = { … };` block). **Keep `DIFFICULTY_LABELS`** (lines 27–31 — still used for the label text).
- [ ] **Step 3: Swap the badge usage** (around lines 126–131). Change from `<Badge variant={DIFFICULTY_VARIANTS[difficulty]} className="text-[10px] shrink-0">` to `<Badge variant="outline" className={cn('text-[10px] shrink-0', difficultyClass(difficulty))}>` (the `difficulty` here is the numeric index — `difficultyClass` accepts it). Keep the label child `{DIFFICULTY_LABELS[difficulty]}` unchanged.
- [ ] **Step 4: Off-palette guard — expect no matches** (uses `bg-primary/10 text-primary` elsewhere = on-palette):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/dashboard/continue-learning.tsx`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.** → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/dashboard/continue-learning.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: source continue-learning difficulty from the difficulty module"
```

---

## Task 9: `recommended-courses.tsx` — brand tints + difficulty + XP

**Files:** Modify `src/components/dashboard/recommended-courses.tsx`

- [ ] **Step 1: Add the import** (after `cn`): `import { difficultyClass, type DifficultyLevel } from '@/lib/difficulty';`
- [ ] **Step 2: Rebrand the 3 `gradient` fields** in `RECOMMENDED` — L40 `gradient: 'from-emerald-500/10 to-teal-500/10',`→`gradient: 'from-skyblue/20 to-skyblue/5',` · L50 `gradient: 'from-blue-500/10 to-indigo-500/10',`→`gradient: 'from-gold/20 to-gold/5',` · L60 `gradient: 'from-violet-500/10 to-purple-500/10',`→`gradient: 'from-clay/20 to-clay/5',`.
- [ ] **Step 3: Delete the `DIFFICULTY_VARIANT` map** (lines 64–68).
- [ ] **Step 4: Swap the difficulty badge** (lines 113–118). Change `<Badge variant={DIFFICULTY_VARIANT[course.difficulty]} className="text-[10px]">` to `<Badge variant="outline" className={cn('text-[10px]', difficultyClass(course.difficulty.toLowerCase() as DifficultyLevel))}>` (the data is `'Beginner'`/`'Intermediate'`/`'Advanced'`; lowercase to match the module's level names).
- [ ] **Step 5: Rebrand the XP span** (line 123). Change `<span className="flex items-center gap-0.5 text-[10px] text-yellow-600 dark:text-yellow-400">` to `<span className="flex items-center gap-0.5 text-[10px] text-clay-deep">`.
- [ ] **Step 6: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/dashboard/recommended-courses.tsx`
Expected: no matches (exit 1).

- [ ] **Step 7: Build + typecheck.** → green/clean.
- [ ] **Step 8: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/dashboard/recommended-courses.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand recommended-courses tints, difficulty and XP"
```

---

## Task 10: `dashboard/page.tsx` — width cap

**Files:** Modify `src/app/[locale]/(platform)/dashboard/page.tsx`

- [ ] **Step 1: Cap the page width.** Change the root (line 62) from `<div className="flex flex-col gap-6">` to `<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">`. *(No PageHeader — WelcomeBanner is the personalized hero per decision 4.)*
- [ ] **Step 2: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' 'src/app/[locale]/(platform)/dashboard/page.tsx'`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.** → green/clean.
- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add 'app/src/app/[locale]/(platform)/dashboard/page.tsx'
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: width-cap the dashboard page"
```

---

## Task 11: `stats-summary.tsx` — brand stat cards (8)

**Files:** Modify `src/components/profile/stats-summary.tsx`

Apply the stat-type→family convention to all 8 `<StatItem>` cards (drop every `dark:`). Exact replacements:

- [ ] **Step 1: XP (L110/111/114)** — `text-yellow-600 dark:text-yellow-400`→`text-clay-deep` (L110) · `bg-yellow-100 dark:bg-yellow-900/40`→`bg-gold/20` (L111) · `text-yellow-600 dark:text-yellow-400`→`text-clay-deep` (L114).
- [ ] **Step 2: Level (L120/121/125)** — `text-blue-600 dark:text-blue-400`→`text-link` · `bg-blue-100 dark:bg-blue-900/40`→`bg-skyblue/10` · `text-blue-600 dark:text-blue-400`→`text-link`.
- [ ] **Step 3: Streak (L134-135/141-143/149-151 → clay)** — active `'text-orange-500'`→`'text-clay-deep'` (L134, L149) · `'bg-orange-100 dark:bg-orange-900/40'`→`'bg-clay/15'` (L141). Keep the inactive `text-muted-foreground`/`bg-muted` branches. Keep the `fill={… ? 'currentColor' : 'none'}` logic.
- [ ] **Step 4: Enrolled (L156/157/161)** — `text-emerald-600 dark:text-emerald-400`→`text-green-deep` · `bg-emerald-100 dark:bg-emerald-900/40`→`bg-leaf/20` · `text-emerald-600 dark:text-emerald-400`→`text-green-deep`.
- [ ] **Step 5: Completed (L165/168/170)** — `text-teal-600 dark:text-teal-400`→`text-green-deep` · `bg-teal-100 dark:bg-teal-900/40`→`bg-leaf/20` · `text-teal-600 dark:text-teal-400`→`text-green-deep`.
- [ ] **Step 6: Lessons (L174/175/179)** — `text-indigo-600 dark:text-indigo-400`→`text-link` · `bg-indigo-100 dark:bg-indigo-900/40`→`bg-skyblue/10` · `text-indigo-600 dark:text-indigo-400`→`text-link`.
- [ ] **Step 7: Credentials (L183/184/188)** — `text-violet-600 dark:text-violet-400`→`text-clay-deep` · `bg-violet-100 dark:bg-violet-900/40`→`bg-clay/15` · `text-violet-600 dark:text-violet-400`→`text-clay-deep`.
- [ ] **Step 8: Achievements (L192/193/197)** — `text-rose-600 dark:text-rose-400`→`text-rust-deep` · `bg-rose-100 dark:bg-rose-900/40`→`bg-rust/15` · `text-rose-600 dark:text-rose-400`→`text-rust-deep`.
- [ ] **Step 9: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/profile/stats-summary.tsx`
Expected: no matches (exit 1).

- [ ] **Step 10: Build + typecheck.** → green/clean.
- [ ] **Step 11: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/profile/stats-summary.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the profile stats-summary cards"
```

---

## Task 12: `completed-courses-list.tsx` — brand placeholder + credential link

**Files:** Modify `src/components/profile/completed-courses-list.tsx`

- [ ] **Step 1: Rebrand the course-image placeholder tile** (L37). Change `bg-gradient-to-br from-violet-500/20 to-purple-500/20` to a brand tint `bg-gradient-to-br from-skyblue/20 to-skyblue/5`.
- [ ] **Step 2: Rebrand the placeholder icon** (L38). Change `<BookOpen className="size-6 text-violet-600 dark:text-violet-400" />` to `<BookOpen className="size-6 text-link" />`.
- [ ] **Step 3: Rebrand the credential link** (L68). Change `border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-400 transition-colors hover:bg-violet-500/20` to `border border-clay/30 bg-clay/15 px-3 py-1.5 text-xs font-medium text-clay-deep transition-colors hover:bg-clay/25` (credential = clay/NFT family). Keep the rest of the link's classes (layout/`rounded-md`/`inline-flex`) verbatim.

*(Keep the `Badge variant="secondary"` lessons/XP pills — theme-driven.)*

- [ ] **Step 4: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/profile/completed-courses-list.tsx`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.** → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/profile/completed-courses-list.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand completed-courses placeholder and credential link"
```

---

## Task 13: `skill-radar.tsx` — skyblue polygon

**Files:** Modify `src/components/profile/skill-radar.tsx`

- [ ] **Step 1: Rebrand `SKILL_COLORS`** (lines 23–28). Replace the violet RGBA object:

```tsx
const SKILL_COLORS = {
  fill: 'rgba(139, 92, 246, 0.25)',
  stroke: 'rgba(139, 92, 246, 0.8)',
  fillDark: 'rgba(167, 139, 250, 0.2)',
  strokeDark: 'rgba(167, 139, 250, 0.75)',
};
```

with skyblue (`#41CFFF` = `65,207,255`); drop the dark variants (brand classification is single-theme):

```tsx
const SKILL_COLORS = {
  fill: 'rgba(65, 207, 255, 0.25)',
  stroke: 'rgba(65, 207, 255, 0.85)',
};
```

- [ ] **Step 2: Collapse the dual light/dark polygons to one.** The data polygon currently renders twice — a light one (`className="dark:hidden …"`, L149) using `SKILL_COLORS.fill/stroke` (L145–146) and a dark one (`className="hidden dark:block …"`, L159) using `fillDark/strokeDark` (L155–156). Delete the dark polygon element (the `hidden dark:block` one) entirely and remove the `dark:hidden` from the remaining polygon's className (so one polygon always shows). Update its `fill={SKILL_COLORS.fill}` / `stroke={SKILL_COLORS.stroke}` (unchanged keys).
- [ ] **Step 3: Rebrand the data-point dots** (L171). Change `className="fill-violet-500 dark:fill-violet-400 stroke-background"` to `className="fill-skyblue stroke-background"`.

*(KEEP `stroke-border` grid (L123, L137) and `fill-foreground` labels (L185) — on-palette/AA. KEEP the `n < 3` empty state.)*

- [ ] **Step 4: Off-palette guard — expect no matches** (RGBA hexes are gone; `fill-skyblue` is brand):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|139, 92, 246|167, 139, 250' src/components/profile/skill-radar.tsx`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.** → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/profile/skill-radar.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: rebrand the skill radar to a single skyblue polygon"
```

---

## Task 14: `profile/[wallet]/page.tsx` — width cap

**Files:** Modify `src/app/[locale]/(platform)/profile/[wallet]/page.tsx`

- [ ] **Step 1: Cap the page width.** Change the main success-return root (line 287) from `<div className="flex flex-col gap-6">` to `<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">`. *(No PageHeader — ProfileHeader is the hero; no `profile` title i18n key exists. KEEP the `bg-destructive/10` invalid-wallet/error states + the `Lock` private-profile state — semantic.)*
- [ ] **Step 2: Off-palette guard — expect no matches** (destructive kept = theme token, not in pattern):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]' 'src/app/[locale]/(platform)/profile/[wallet]/page.tsx'`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.** → green/clean.
- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add 'app/src/app/[locale]/(platform)/profile/[wallet]/page.tsx'
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: width-cap the public profile page"
```

---

## Task 15: `streak-counter.tsx` — clay/gold flame + skyblue freeze

**Files:** Modify `src/components/gamification/streak-counter.tsx`

The props/API (`currentStreak`, `longestStreak`, `freezesAvailable`, `isFreezeActiveToday`, `onUseFreeze?`, `className?`) stay IDENTICAL — only className/style strings change, so the `welcome-banner` consumer is unaffected.

- [ ] **Step 1: Rebrand the flame/freeze text chain** (lines 38–44). Change the freeze-active color `'text-sky-400'`→`'text-link'` and the active flame `'text-orange-500'`→`'text-clay-deep'` (keep the inactive `'text-muted-foreground'`).
- [ ] **Step 2: Rebrand the glows.** Snowflake glow (L51–53) `rgba(56,189,248,0.5)`→`rgba(65,207,255,0.5)` (skyblue). Flame glow (L58) `rgba(249,115,22,0.5)`→`rgba(249,200,70,0.5)` (gold). Keep the `animate-pulse` + `drop-shadow-[…]` structure.
- [ ] **Step 3: Rebrand the tooltip freeze line** (L77). Change `<p className="text-sky-400">` to `<p className="text-link">`.
- [ ] **Step 4: Rebrand the freeze button** (L92–93). Change `'bg-sky-500/10 text-sky-400 transition-colors'`→`'bg-skyblue/10 text-link transition-colors'` and `'hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50'`→`'hover:bg-skyblue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skyblue/50'`.
- [ ] **Step 5: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'orange|sky-[0-9]|amber|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|blue-[0-9]|yellow-[0-9]|56,189,248|249,115,22' src/components/gamification/streak-counter.tsx`
Expected: no matches (exit 1).

- [ ] **Step 6: Build + typecheck.** → green/clean.
- [ ] **Step 7: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/gamification/streak-counter.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: rebrand the streak counter to clay flame and skyblue freeze"
```

---

## Task 16: `achievement-toast.tsx` — gold/clay celebratory

**Files:** Modify `src/components/gamification/achievement-toast.tsx`

- [ ] **Step 1: Rebrand the toast surface** (L76). Change `'border-amber-400/30 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/95 dark:to-yellow-950/95 dark:border-amber-500/20',` to `'border-gold/40 bg-gold/20',` (tinted, no gradient/`dark:`).
- [ ] **Step 2: Rebrand the icon medallion** (L85). Change `bg-gradient-to-br from-amber-400 to-yellow-500 shadow-inner` to `bg-gold shadow-inner` (solid gold fill).
- [ ] **Step 3: Rebrand the Trophy icon** (L89). Change `<Trophy className="size-5 text-white" />` to `<Trophy className="size-5 text-clay-deep" />` (clay-deep on gold = AA).
- [ ] **Step 4: Rebrand the text** — L95 label `text-amber-600/70 dark:text-amber-400/70`→`text-clay-deep` · L98 name `text-amber-800 dark:text-amber-200`→`text-brown` · L101 XP `text-amber-600 dark:text-amber-400`→`text-clay-deep`.
- [ ] **Step 5: Rebrand the dismiss control** (L110). Change `text-amber-500/60 transition-colors hover:text-amber-700 dark:hover:text-amber-300` to `text-muted-foreground transition-colors hover:text-brown`.
- [ ] **Step 6: Rebrand the progress bar** — L120 track `bg-amber-200/30 dark:bg-amber-800/30`→`bg-gold/20` · L122 fill `bg-gradient-to-r from-amber-400 to-yellow-500`→`bg-gold`.
- [ ] **Step 7: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'amber|yellow-[0-9]|emerald|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]' src/components/gamification/achievement-toast.tsx`
Expected: no matches (exit 1).

- [ ] **Step 8: Build + typecheck.** → green/clean.
- [ ] **Step 9: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/gamification/achievement-toast.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the achievement unlock toast"
```

---

## Task 17: `xp-toast.tsx` — gold/clay

**Files:** Modify `src/components/gamification/xp-toast.tsx`

- [ ] **Step 1: Surface** (L70). Change `'border-amber-400/40 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/90 dark:to-yellow-950/90 dark:border-amber-500/30',` to `'border-gold/40 bg-gold/20',`.
- [ ] **Step 2: Icon medallion** (L77). Change `bg-gradient-to-br from-amber-400 to-yellow-500 shadow-inner` to `bg-gold shadow-inner`.
- [ ] **Step 3: Sparkles icon** (L78). Change `<Sparkles className="size-5 text-white" />` to `<Sparkles className="size-5 text-clay-deep" />`.
- [ ] **Step 4: XP value text** (L85). Change `'text-lg font-bold tabular-nums tracking-tight text-amber-700 dark:text-amber-300 motion-reduce:animate-none',` to `'text-lg font-bold tabular-nums tracking-tight text-clay-deep motion-reduce:animate-none',` (KEEP the `motion-reduce:animate-none`).
- [ ] **Step 5: Sub-label** (L91). Change `text-amber-600/70 dark:text-amber-400/70`→`text-clay-deep`.
- [ ] **Step 6: Sparkle particle** (L101). Change `bg-amber-400/50`→`bg-gold/50`.
- [ ] **Step 7: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'amber|yellow-[0-9]|emerald|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]' src/components/gamification/xp-toast.tsx`
Expected: no matches (exit 1).

- [ ] **Step 8: Build + typecheck.** → green/clean.
- [ ] **Step 9: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/gamification/xp-toast.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the XP gain toast"
```

---

## Task 18: `level-up-modal.tsx` — brand perk icons

**Files:** Modify `src/components/gamification/level-up-modal.tsx`

*(The modal chrome uses `primary`/`background`/`foreground`/`muted-foreground` theme tokens — leave them, incl. their `dark:` variants. It renders `ConfettiAnimation` — do NOT touch confetti (4.5). `LEVEL_PERKS` is content strings — leave.)*

- [ ] **Step 1: Rebrand the Star perk icon** (L147). Change `<Star className="size-4 shrink-0 text-amber-500" />` to `<Star className="size-4 shrink-0 text-clay" />` (decorative bright fill on an icon is allowed).
- [ ] **Step 2: Rebrand the Zap perk icon** (L151). Change `<Zap className="size-4 shrink-0 text-emerald-500" />` to `<Zap className="size-4 shrink-0 text-leaf" />`. *(This emerald is a decorative rotating perk icon — `i % 3` — NOT verification status, so it debrands to leaf. Line 149's `text-primary` stays.)*
- [ ] **Step 3: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'amber|emerald|yellow-[0-9]|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]' src/components/gamification/level-up-modal.tsx`
Expected: no matches (exit 1).

- [ ] **Step 4: Build + typecheck.** → green/clean.
- [ ] **Step 5: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/gamification/level-up-modal.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the level-up modal perk icons"
```

---

## Task 19: `lesson-complete-animation.tsx` — brand the floating XP (keep success checkmark)

**Files:** Modify `src/components/gamification/lesson-complete-animation.tsx`

*(Per the master-plan keep-list, the lesson-complete **checkmark** emerald is semantic success status — KEEP lines 75, 87, 106 untouched. Only the floating "+XP" celebratory text rebrands.)*

- [ ] **Step 1: Rebrand the floating "+XP" text** (L119). Change the `text-emerald-600 dark:text-emerald-400` segment to `text-clay-deep` (XP = gold/clay family), keeping the rest of the className (`'absolute -top-1 left-1/2 -translate-x-1/2 text-sm font-bold tabular-nums …'`) verbatim. Result: `'absolute -top-1 left-1/2 -translate-x-1/2 text-sm font-bold tabular-nums text-clay-deep',`.
- [ ] **Step 2: Off-palette guard — expect ONLY the kept success-checkmark emerald** (lines 75/87/106):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald' src/components/gamification/lesson-complete-animation.tsx`
Expected: exactly the 3 kept checkmark lines (75, 87, 106); NO emerald on the +XP line (119). Then: `rg -n 'amber|yellow-[0-9]|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]' src/components/gamification/lesson-complete-animation.tsx` → no matches.

- [ ] **Step 3: Build + typecheck.** → green/clean.
- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/gamification/lesson-complete-animation.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the lesson-complete floating XP text"
```

---

## Part Gate (run after all 19 tasks — do NOT skip)

- [ ] **Unit tests:** `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run` → **386 passing** (382 + 4 achievements).
- [ ] **Cluster off-palette guard #1 (off-palette scales across the 4.4 surface — uses precise `slate-[0-9]`/`sky-[0-9]`):**
  `rg -n 'violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]|zinc|gray|stone' src/components/dashboard src/components/profile src/components/gamification/streak-counter.tsx src/components/gamification/achievement-toast.tsx src/components/gamification/xp-toast.tsx src/components/gamification/level-up-modal.tsx src/components/gamification/lesson-complete-animation.tsx src/lib/achievements.ts 'src/app/[locale]/(platform)/dashboard' 'src/app/[locale]/(platform)/profile'` → **zero**.
- [ ] **Cluster off-palette guard #2 (kept-semantic audit — emerald/amber/red should appear ONLY where documented):**
  `rg -n 'emerald|amber|red-[0-9]' src/components/dashboard src/components/profile src/components/gamification/lesson-complete-animation.tsx` → expect ONLY: achievement-badge earned check dot (emerald), claim-achievement-button claimed link (emerald), profile-header copy-check (emerald), past status if any, lesson-complete checkmark (emerald lines 75/87/106). NO amber, NO red-N, NO emerald on any stat/activity/medallion. Eyeball the list against the keep-list.
- [ ] **Build + typecheck:** `pnpm build` green · `npx tsc --noEmit` clean.
- [ ] **Visual smoke (prod server, light + dark)** on `/en/dashboard` and `/en/profile/<a-wallet>` (connect a wallet or use a seeded wallet address route). Confirm: width cap on both; quick-stats 5 cards = gold/sky/clay/leaf/rust; activity feed type chips brand; heatmap leaf ramp; recent-achievements + achievement-grid tinted rarity medallions (common muted → legendary gold + ring) with brand trophy icons (NOT white); stats-summary 8 cards brand; skill-radar skyblue polygon + AA labels; completed-courses credential link clay; streak clay flame / skyblue freeze; (trigger a toast if feasible) gold/clay toasts; dark NOT broken; all loading/empty/error states intact. *(The known pre-existing detail-slug bug is unrelated; note any anomaly but don't fix here.)*
- [ ] **e2e (reuse prod server):** with the prod server on :3000, `pnpm exec playwright test --project=chromium` → expect 36/36 (theme/nav/a11y/dashboard/responsive cover the shell + dashboard). Infra-block acceptable substitute if the server can't be reused.
- [ ] **Read-only opus review** of the cluster diff (`git -C /Users/rector/local-dev/superteam-academy diff 6375c58..HEAD -- app/`): achievements rarity module single-sourced (no residual `id→gradient` maps, no `color` field), difficulty single-sourced in continue-learning + recommended-courses (no `DIFFICULTY_VARIANT(S)`, no `destructive` Advanced), stat-type convention applied consistently, streak clay/gold everywhere, gamification toasts gold/clay, kept-semantic emeralds intact (earned dot / copy-check / claim link / lesson-complete checkmark), skill-radar single skyblue + AA labels, width caps, no off-palette residue (minus keep-list), AA holds, theme not broken, import hygiene, no AI attribution.
- [ ] **Update the SDD ledger** `/Users/rector/local-dev/superteam-academy/.git/sdd/progress.md` with the cluster result + note that `level-badge` + `confetti-animation` remain for 4.5.

---

## Self-Review (against the master plan + recon)

1. **Single-sourcing coverage:** the duplicated achievement `id→gradient` maps (recent-achievements + achievement-grid) + the `AchievementDefinition.color` field migrate to `achievements.ts` rarity (Tasks 1–4); the two off-brand difficulty-variant maps (continue-learning + recommended-courses) migrate to the existing `difficulty.ts` (Tasks 8–9). ✓
2. **Master cluster-4 screens:** dashboard (Tasks 5–10) · profile + `/[wallet]` (Tasks 11–14) · credential gallery (achievement-grid/badge, Tasks 2–3) · skill-radar (Task 13). ✓ The deferred streak-counter (Task 15) + the extended gamification overlays (Tasks 16–19) included per RECTOR. ✓
3. **Kept-semantic verified:** earned check dot, copy-check, claim-link, lesson-complete checkmark (emerald); destructive errors; locked `bg-muted`; Monaco/admonition colors not on this surface. All explicitly out-of-scope. ✓
4. **Stat-type convention** applied identically across quick-stats, stats-summary, activity-feed, recommended-courses; streak → clay/gold everywhere (RECTOR). ✓
5. **Width-cap-only** on the two contained pages (personalized heroes are the headers); `profile/page.tsx` connect-gate untouched. ✓
6. **No placeholders:** every code step shows complete code or an exact verbatim find/replace with line refs; every verify step is a runnable command with expected output. The only "read before editing" notes are on `recent-achievements` medallion (T4 S4) and a couple of files where the exact surrounding layout must be matched character-for-character — flagged explicitly. ✓
7. **Type consistency:** `achievementRarityStyle(rarity: string)` tolerates the catalog string; `AchievementDefinition.rarity: AchievementRarity` flows from the type in T2 to the catalogs in T3/T4 (T2's build is intentionally deferred to T4 when all catalogs supply `rarity`). `difficultyClass` accepts numeric index (continue-learning) and lowercased level name (recommended-courses). ✓
8. **`level-badge` + `confetti` correctly deferred to 4.5** (level-up-modal renders confetti but does not touch it). ✓
9. **Repo-safety** (twin `core`) in every commit step; precise `slate-[0-9]`/`sky-[0-9]` guards (the 4.3 false-positive fix). ✓
10. **Right-sized:** 19 independently buildable/guardable/committable tasks (1 TDD module + 18 surface edits); the achievements trio (T2–T4) shares one build-green checkpoint at T4; the rest verify-only with stated reasons.
