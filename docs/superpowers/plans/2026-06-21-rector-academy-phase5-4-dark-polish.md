# Phase 5 · Sub-plan 4 — Dark-Mode Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (CONTROLLER-INLINE — implement edits yourself, NEVER delegate to subagents; `core` is a structural twin of this repo). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Turn dark mode from "not broken" into "intentional" — give the brand *classification* colors (difficulty / category / track / rarity / level-tier) AA-readable `dark:` variants so every Tier-1 screen reads as *designed* in dark, both themes pixel-perfect.

**Architecture:** Through Phase 4, dark mode worked for the *semantic* shadcn tokens (the `.dark` block in `globals.css` remaps `--background`/`--card`/`--foreground`/`--muted-foreground`/… so `bg-card`, `text-foreground`, `text-muted-foreground` auto-adapt). But the **brand classification tokens are fixed hex tuned for the cream surface** (`--color-link #0D7390`, `--color-green-deep #3C6A12`, `--color-clay-deep #8A4A12`, `--color-rust-deep #A23B22`) and have **no `dark:` variants** — on dark surfaces they read as dark-on-dark. The fix: pair each readable `-deep`/`link` text with a bright-brand `dark:` sibling (the established `text-link dark:text-skyblue` convention), applied **first in the 5 single-source style modules** (`src/lib/{difficulty,challenge-categories,tracks,achievements,level-tiers}.ts` → propagates to ~30 consumers), then in the bespoke per-surface usages the modules don't cover. Decorative *fills* (`bg-*/20`, `border-l-*`, rings) and the dark `artGradient`/white-text surfaces already work in both themes and stay unchanged.

**Tech Stack:** Next.js 16.1.6 App Router, TypeScript, Tailwind v4 (CSS-first `@theme` + `@custom-variant dark (&:is(.dark *))` in `src/app/globals.css`), Vitest, pnpm (from `app/`). next-themes (`attribute="class"`, class `.dark` on `<html>`).

## Global Constraints

- **Working root:** `/Users/rector/local-dev/superteam-academy/app`; the shell resets to `core` after each command → prefix every command with `cd /Users/rector/local-dev/superteam-academy/app &&` and use **absolute paths** for all reads/edits.
- **★ Twin-repo safety:** before every commit `git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel` ends in `/superteam-academy`; commit with `git -C …`; after every commit `git -C /Users/rector/local-dev/core status --short` shows nothing academy. NEVER stage/commit in `core`. (Reads bite too — a relative `src/...` path reads `core`'s twin file; always `cd` first.)
- **Additive + dark-only:** every change ADDS a `dark:` utility (or a new dark-only token); the existing light-mode class is byte-unchanged. No light-mode regression.
- **Design language (locked, RECTOR-approved at 4.1):** cream `#FFF7E1` bg / brown `#3B2C22` text. Bright accents = DECORATIVE FILLS only (light); readable text = AA `-deep`/`link` (light) **+ bright `dark:` sibling (dark)**. **KEEP semantic status tokens** in BOTH themes: emerald/red test pass-fail, amber hints/warnings, Monaco chrome (`#1e1e1e`/`#d4d4d4`), the cert `#22c55e` verify badge. Do NOT add `dark:` to those.
- **AA on dark is load-bearing:** every new `dark:text-*` must be ≥4.5:1 (normal text) on the dark surface it sits on — primarily `--card #3B2C22` (L≈0.0273) and `--secondary #4A3829` (L≈0.045), and on the dark tint (`bg-*/15–30` over those). Verified bright-token contrast on `--card`: **skyblue 7.5 · gold 8.7 · leaf 8.7 · clay 5.25 — all AA/AAA; rust #C75A44 = 3.2:1 → FAILS normal-text AA** (see Decisions).
- **Per-task gate:** `cd app && pnpm build` (green) + `npx tsc --noEmit` (clean) + the task's tests + the off-palette/`dark:`-coverage guard.
- **Commits:** conventional `type: description`, one per task, GPG-signed (`-S`), **NO AI attribution** (no `Co-Authored-By`, `Claude`, `Generated with`, robot emoji).
- **Visual gate:** build with `NEXT_PUBLIC_DEMO_MODE=true` (seed data fills every screen), `PORT=3000 pnpm start`, Chrome MCP. Clear the stale `rca-v1-*` SW once before reading (5.3 disabled SW in demo, but an older registration may persist in-browser). Set `localStorage.theme='dark'` + reload per screen. **A wallet-extension `#418` console line is expected and external (sub-plan 3 finding) — ignore it.**

## Decisions (defaults — confirm at review)

1. **The `dark:` mapping (readable `-deep`/link → bright sibling, matched to the entry's fill accent):**
   | Light readable | Brand family | Dark sibling | AA on `--card` |
   |---|---|---|---|
   | `text-link` | Solana/cyan | `dark:text-skyblue` | 7.5 ✓ (established precedent) |
   | `text-green-deep` | leaf/green | `dark:text-leaf` | 8.7 ✓ |
   | `text-clay-deep` **on a gold fill** (`bg-gold/*`, `ring-gold`) | DeFi/gold | `dark:text-gold` | 8.7 ✓ |
   | `text-clay-deep` **on a clay fill** (`bg-clay/*`, `ring-clay`) | NFT/clay | `dark:text-clay` | 5.25 ✓ |
   | `text-rust-deep` | Security/rust | **see #2** | — |

   The `text-clay-deep` disambiguation is by the **fill in the same style entry** (gold-family → `dark:text-gold`; clay-family → `dark:text-clay`). This keeps DeFi (gold) and NFT (clay) distinct in dark.

2. **★ `text-rust-deep` dark variant (the one open design call):** the bright `rust #C75A44` is only **3.2:1** on `--card` (fails normal-text AA), so it can't be the dark sibling. **Default:** add a new dark-readable token **`--color-rust-bright: #F0926F`** (a lightened coral-rust; verify ≥4.5:1 on both `--card` and `--secondary` at execution — brighten toward `#F59B7A` if `--secondary` falls short) and map `text-rust-deep → dark:text-rust-bright`. This keeps **Security visually distinct** (warm red) from NFT (`clay` orange) and DeFi (`gold`). **Alternative (simpler, no new token):** map `text-rust-deep → dark:text-clay` and accept that Security and NFT both read orange-ish in dark. *Recommend the new token.*

3. **Scope of "fills":** decorative tint fills (`bg-gold/20`, `border-l-skyblue`, rings) and the dark `artGradient` hero/credential/cert surfaces (white text on a dark gradient — already correct in both themes) are **OUT** — only readable classification *text* gets `dark:` variants. If a specific tint reads muddy in dark during the visual gate, note it; don't pre-emptively restyle fills.

4. **Demo data nits (carry-forward):** fold the visible **Level-7 vs Level-8 sidebar XP** inconsistency into this sub-plan (it shows on every course-detail page); the other sub-plan-2 nits (peer-profile shows the demo learner's store data; fixed dates read stale) are noted but **deferred** unless trivially fixed.

## File Structure

| File | Change |
|---|---|
| `src/app/globals.css` | (Decision #2) add `--color-rust-bright` raw var (`:root` + `@theme`) — dark-readable Security text |
| `src/lib/difficulty.ts` | add `dark:` sibling to each level's `text-*-deep` |
| `src/lib/challenge-categories.ts` | add `dark:` sibling to `badgeClass` + `statClass` |
| `src/lib/tracks.ts` | add `dark:` sibling to each track's `badgeClass` |
| `src/lib/achievements.ts` | add `dark:` sibling to rare/epic/legendary `iconClass` + `textClass` |
| `src/lib/level-tiers.ts` | add `dark:` sibling to each tier's `text` |
| `src/lib/__tests__/*.test.ts` | extend the existing module tests to assert the `dark:` class is present |
| bespoke surfaces (per-cluster, §Tasks 7–11) | add `dark:` siblings to `-deep`/link text not sourced from the modules |
| `src/components/…` (sidebar XP widget) | fix the Level-7/8 seed/display mismatch |

---

## Task 1: Add the dark-readable Security token (`--color-rust-bright`)

**Files:** Modify `src/app/globals.css` (`:root`, `.dark` is unaffected — this token is identical in both themes; it's only *used* under `dark:`), and the `@theme` map so Tailwind emits `text-rust-bright`.

> Skip this task entirely if Decision #2 is settled as the `dark:text-clay` alternative.

- [ ] **Step 1: Pick the value** — start at `#F0926F`. Compute contrast on `--card #3B2C22` and `--secondary #4A3829`; require ≥4.5:1 on both. If `--secondary` < 4.5, step lighter (`#F39A78` → `#F59B7A`) and recompute. Record the chosen hex + both ratios in the commit body.

- [ ] **Step 2: Add the raw var** — in `:root` (near `--color-rust-deep`), add:
```css
  --color-rust-bright: #F0926F; /* dark-mode-readable Security text — AA on dark --card/--secondary */
```
And in the `@theme` block (near the other `--color-rust*` entries) add the same `--color-rust-bright: #F0926F;` so Tailwind generates `text-rust-bright`.

- [ ] **Step 3: Build + tsc** — `cd app && pnpm build && npx tsc --noEmit` → green/clean. Grep the compiled CSS to confirm the utility exists: `cd app && pnpm build && grep -rl "rust-bright" .next` (or assert via a temporary `<span className="text-rust-bright">` smoke during the visual gate).

- [ ] **Step 4: Commit** — `feat: add a dark-readable rust-bright token for Security classification text`

---

## Task 2: difficulty.ts — dark difficulty text

**Files:** Modify `src/lib/difficulty.ts`; extend `src/lib/__tests__/difficulty.test.ts`.

Current `DIFFICULTY_CLASS`: beginner `…text-green-deep`, intermediate (`bg-gold/20`) `…text-clay-deep`, advanced (`bg-rust/15`) `…text-rust-deep`.

- [ ] **Step 1: Write the failing assertions** — in `difficulty.test.ts`, add to the existing suite:
```ts
it('pairs each difficulty text with a bright dark: sibling', () => {
  expect(difficultyClass('beginner')).toContain('dark:text-leaf');
  expect(difficultyClass('intermediate')).toContain('dark:text-gold');
  expect(difficultyClass('advanced')).toContain('dark:text-rust-bright');
});
```
- [ ] **Step 2: Run → FAIL** — `cd app && pnpm test:run src/lib/__tests__/difficulty.test.ts` → fails (no `dark:` yet).
- [ ] **Step 3: Implement** — update `DIFFICULTY_CLASS`:
```ts
const DIFFICULTY_CLASS: Record<DifficultyLevel, string> = {
  beginner: 'border-leaf/30 bg-leaf/20 text-green-deep dark:text-leaf',
  intermediate: 'border-gold/30 bg-gold/20 text-clay-deep dark:text-gold',
  advanced: 'border-rust/30 bg-rust/15 text-rust-deep dark:text-rust-bright',
};
```
- [ ] **Step 4: Run → PASS** — same command → green.
- [ ] **Step 5: Build + tsc** → green/clean.
- [ ] **Step 6: Commit** — `feat: add dark-mode difficulty text variants`

---

## Task 3: challenge-categories.ts — dark category text

**Files:** Modify `src/lib/challenge-categories.ts`; extend `src/lib/__tests__/challenge-categories.test.ts`.

Apply the mapping to BOTH `badgeClass` and `statClass` per category (fill accent → sibling): solana `text-link`→`dark:text-skyblue`; defi (gold) `text-clay-deep`→`dark:text-gold`; nft (clay) `text-clay-deep`→`dark:text-clay`; security `text-rust-deep`→`dark:text-rust-bright`; token-extensions `text-green-deep`→`dark:text-leaf`.

- [ ] **Step 1: Failing test** — assert e.g. `challengeCategoryStyle('security').statClass` contains `dark:text-rust-bright` and `…('defi').badgeClass` contains `dark:text-gold` and `…('nft').statClass` contains `dark:text-clay`.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** — append the `dark:` sibling to every `text-link`/`text-*-deep` occurrence in `CHALLENGE_CATEGORY_STYLES` (10 strings: badge + stat × 5). Leave `borderClass` (decorative) untouched.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Build + tsc** → green/clean.
- [ ] **Step 6: Commit** — `feat: add dark-mode challenge-category text variants`

---

## Task 4: tracks.ts — dark track-badge text

**Files:** Modify `src/lib/tracks.ts`; extend `src/lib/__tests__/tracks.test.ts`.

Only `badgeClass` carries readable text. Map: Core `text-link`→`dark:text-skyblue`; DeFi (gold) `text-clay-deep`→`dark:text-gold`; NFT (clay) `text-clay-deep`→`dark:text-clay`; Security `text-rust-deep`→`dark:text-rust-bright`. **Do NOT touch** `tintGradient`/`artGradient`/`artHex`/`borderClass` (decorative / white-text dark surfaces already correct).

- [ ] **Step 1: Failing test** — assert `getTrack('2').badgeClass` contains `dark:text-gold`, `getTrack('3').badgeClass` contains `dark:text-clay`, `getTrack('4').badgeClass` contains `dark:text-rust-bright`, `getTrack('1').badgeClass` contains `dark:text-skyblue`.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** — update the 4 `badgeClass` strings only.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Build + tsc** → green/clean.
- [ ] **Step 6: Commit** — `feat: add dark-mode track-badge text variants`

---

## Task 5: achievements.ts — dark rarity text

**Files:** Modify `src/lib/achievements.ts`; extend `src/lib/__tests__/achievements.test.ts`.

`common` uses `text-muted-foreground` (auto-adapts via the `.dark` remap → NO change). Map the rest (`iconClass` + `textClass`): rare `text-green-deep`→`dark:text-leaf`; epic (clay fill) `text-clay-deep`→`dark:text-clay`; legendary (gold fill) `text-clay-deep`→`dark:text-gold`.

- [ ] **Step 1: Failing test** — assert `achievementRarityStyle('legendary').textClass` contains `dark:text-gold`, `('epic').iconClass` contains `dark:text-clay`, `('rare').textClass` contains `dark:text-leaf`, and `('common').textClass` is unchanged (`text-muted-foreground`, no `dark:`).
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** — append `dark:` siblings to rare/epic/legendary `iconClass` + `textClass` (6 strings). Leave `common`, `badgeClass`, `ringClass` untouched.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Build + tsc** → green/clean.
- [ ] **Step 6: Commit** — `feat: add dark-mode achievement-rarity text variants`

---

## Task 6: level-tiers.ts — dark level-tier text

**Files:** Modify `src/lib/level-tiers.ts`; extend `src/lib/__tests__/level-tiers.test.ts`.

`newcomer` = `text-muted-foreground` (NO change). Map the `text` field per tier by its fill accent: explorer (leaf) →`dark:text-leaf`; builder (skyblue) `text-link`→`dark:text-skyblue`; developer/expert (clay) `text-clay-deep`→`dark:text-clay`; engineer/master/grandmaster/legend (gold) `text-clay-deep`→`dark:text-gold`; architect/specialist (rust) `text-rust-deep`→`dark:text-rust-bright`.

- [ ] **Step 1: Failing test** — assert `levelTierStyle('legend').text` contains `dark:text-gold`, `('expert').text` contains `dark:text-clay`, `('architect').text` contains `dark:text-rust-bright`, `('builder').text` contains `dark:text-skyblue`, `('explorer').text` contains `dark:text-leaf`, `('newcomer').text` has no `dark:`.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** — append the `dark:` sibling to the 10 non-`newcomer` `text` strings per the accent rule above. Leave `bg`/`border`/`ring`/`pips` untouched.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Build + tsc** → green/clean.
- [ ] **Step 6: Commit** — `feat: add dark-mode level-tier text variants`

---

## Tasks 7–11: Per-cluster bespoke-surface audit

The 5 modules cover every consumer that sources classification via `getTrack`/`difficultyClass`/`challengeCategoryStyle`/`achievementRarityStyle`/`levelTierStyle`. These tasks catch the surfaces that **hardcode** `-deep`/link text directly. **Method per file:** read it; for each `text-link`/`text-*-deep` on a surface that goes dark, append the mapped `dark:` sibling (Decision #1/#2) — matched to the nearby fill accent; KEEP semantic emerald/amber/red. Skip `(admin)/admin/*` (URL-only, locked in demo — lowest priority; do last or defer). Per-cluster gate: build + tsc + a guard that every `text-(link|clay-deep|green-deep|rust-deep)` in the touched files has a `dark:` sibling on the same `className`.

Cluster→files (from grep — verify each at execution):
- **Task 7 — Landing:** `landing/{hero-section,featured-courses,gamification-preview,how-it-works,social-proof,tracks-overview}.tsx`. Commit: `feat: dark-mode polish for the landing surfaces`.
- **Task 8 — Dashboard:** `dashboard/{quick-stats,activity-feed,recommended-courses}.tsx`. Commit: `feat: dark-mode polish for the dashboard surfaces`.
- **Task 9 — Profile + gamification:** `profile/{stats-summary,completed-courses-list,achievement-badge}.tsx`, `gamification/{achievement-toast,xp-toast,streak-counter,lesson-complete-animation}.tsx`. (Toasts render on `bg-card`-like surfaces — verify the bright sibling on the toast bg.) Commit: `feat: dark-mode polish for the profile and gamification surfaces`.
- **Task 10 — Leaderboard + courses/community:** `leaderboard/{leaderboard-row,podium-top3}.tsx`, `challenges/speed-leaderboard.tsx`, `courses/{course-card,lesson-row,recommended-courses}.tsx`, `community/thread-card.tsx`, `devnet/transaction-history.tsx`. (Several already consume the modules — confirm and skip the covered ones.) Commit: `feat: dark-mode polish for the leaderboard, course and community surfaces`.
- **Task 11 — Admin (optional/last):** `(admin)/admin/{achievements,analytics,config}/page.tsx`, `admin/{activity-feed,stats-cards}.tsx` (the latter two already use `dark:text-skyblue`). Demo-locked, so lowest priority. Commit: `feat: dark-mode polish for the admin surfaces` (or defer with a note).

---

## Task 12: Fix the Level-7/8 sidebar XP mismatch (demo data nit)

**Files:** TBD by investigation — the platform-shell left sidebar's XP/level widget (likely `src/components/layout/sidebar.tsx` reading an XP-card field) shows **Level 7 · 2,450/5,000 XP** on course-detail pages while the dashboard/profile correctly show **Level 8 / 6,400 XP** (seeded).

- [ ] **Step 1: Reproduce + root-cause (systematic-debugging)** — build with the flag, load `/en/courses/nft-201`, read the sidebar XP widget vs the dashboard. Trace which store field / fetch the sidebar reads (is it a non-seeded default, an un-hydrated `useUserStore`, or a second `fetchUserData` path that ignores the demo seam?). It is likely the sub-plan-2 nit (c) "redundant fetchUserData" surfacing a pre-seed default before hydration.
- [ ] **Step 2: Fix at root** — make the sidebar widget read the same seeded source the dashboard uses (the demo user-store identity), so it shows Level 8 / 6,400 XP consistently. Add a regression test if the source is unit-testable.
- [ ] **Step 3: Build + tsc + test** → green/clean.
- [ ] **Step 4: Commit** — `fix: show the seeded level/XP in the sidebar widget (demo)` (message reflects the actual root cause).

---

## Task 13: Visual dark gate + opus review + ledger

- [ ] **Step 1: Unit gate** — `cd app && pnpm test:run` (all green, incl. the new module `dark:` assertions) + `npx tsc --noEmit` clean.
- [ ] **Step 2: Coverage guard** — over all touched files, assert NO bare readable token without a `dark:` sibling: every `text-link`/`text-clay-deep`/`text-green-deep`/`text-rust-deep` occurrence on readable text has a `dark:text-*` on the same `className` (allow the documented exceptions: dark `artGradient` white-text surfaces, `text-muted-foreground`). Use precise digit-form for any scale name that's a substring of a word.
- [ ] **Step 3: Build with flag + serve** — `NEXT_PUBLIC_DEMO_MODE=true pnpm build && NEXT_PUBLIC_DEMO_MODE=true PORT=3000 pnpm start`.
- [ ] **Step 4: e2e** — `pnpm exec playwright test --project=chromium` → 36/36 (reuses :3000).
- [ ] **Step 5: Chrome MCP — DARK sweep of all ~12 Tier-1 screens** — clear the stale SW once; `localStorage.theme='dark'` + reload per screen. Verify on each: landing, courses catalog + detail, lesson, challenges daily + library + solver, dashboard, profile, leaderboard, credential detail + gallery, settings, community. Confirm: difficulty/category/track/rarity/level badges + stat numbers are **bright + AA-readable** (not dark-on-dark); decorative tints/rings still read; semantic emerald/amber/red unchanged; no light-mode regression on a spot re-check (`theme='light'`). Ignore the external wallet-extension `#418`.
- [ ] **Step 6: Cleanup** — `lsof -ti:3000 | xargs kill`; close the Chrome tab.
- [ ] **Step 7: Read-only opus review** over the sub-plan diff (adversarial; verify AA math on the real dark surfaces, single-source coverage, no semantic-token drift, no AI attribution). Resolve Critical/Important.
- [ ] **Step 8: Ledger** — append the sub-plan-4 record to `.git/sdd/progress.md`.

---

## Self-Review (against the spec §5 "Dark-polish pass")

- **"systematic audit of all ~12 Tier-1 screens in dark":** Task 13 Step 5 sweeps every Tier-1 screen.
- **"add `dark:` variants where classification/fills read 'functional'":** Tasks 1–11 add `dark:` siblings to every classification text token (modules first, then bespoke).
- **"Keep semantic status tokens (emerald/red, amber, Monaco)":** Global Constraints + each task explicitly leave semantic tokens untouched; the coverage guard whitelists them.
- **"Both themes pixel-perfect":** additive-only (no light-mode change) + the dark sweep + a light spot re-check.
- **AA on dark:** the rust-deep gap (3.2:1) is resolved by Decision #2 (`--color-rust-bright`, verified ≥4.5:1); all other bright siblings are AA/AAA (computed).
- **Out of scope (sub-plan 5):** fresh `RECTOR-LABS/rector-academy` repo + `academy.rectorspace.com` + the launch deploy.
- **Carried nit:** the Level-7/8 sidebar mismatch is folded in (Task 12); the other sub-plan-2 nits (peer-profile, fixed dates) stay deferred unless trivial.
