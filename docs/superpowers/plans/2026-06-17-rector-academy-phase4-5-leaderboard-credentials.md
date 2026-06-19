# RECTOR Academy — Phase 4.5: Leaderboard + Credentials + Certificates (Sub-Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (controller-inline) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. This sub-plan **inherits the master plan verbatim**: `docs/superpowers/plans/2026-06-17-rector-academy-phase4-tier1-redesigns.md` (Global Constraints + Phase-4 Design Language). Read it first. Apply `superpowers:frontend-design` per surface.

**Goal:** Redesign the LAST Tier-1 cluster — the Leaderboard (page + podium + rows), the Credential viewer + gallery + certificate canvas, and the two deferred gamification primitives (`level-badge` 11-tier rarity ramp, `confetti-animation` palette) — to the locked RECTOR Academy design language, while landing the **full podium chips** on the speed leaderboard (4.3 left it as readable text). Three triplicated off-palette `numeric-trackId → gradient` maps collapse into one single source in `tracks.ts`; a new single-source `level-tiers.ts` drives the 11 level tiers. Every semantic STATUS color (on-chain verification emerald, destructive errors, copy-success checks) is kept intact.

**Architecture:** Two single-source foundations land first (TDD): `tracks.ts` gains a raw-hex `artHex` pair (for the Canvas certificate, which can't read CSS classes) + a `getCredentialTrack()` resolver for the **0-indexed** `credential.attributes.trackId`; and a new `level-tiers.ts` (mirroring `achievements.ts`) maps the 11 level titles → brand tier styles. The leaderboard page adopts the `PageHeader` primitive (it has no personalized hero, unlike dashboard/profile — so it follows the courses/challenges pattern, NOT the 4.4 width-cap-only treatment). The podium + medal + speed-leaderboard top-3 adopt the locked gold/clay/rust podium ramp. The credential viewer, gallery and certificate canvas drop their duplicated track-gradient maps and consume the single `tracks.ts` source; credential/certificate art that overlays **white** text uses the AA-safe DARK `artGradient`/`artHex`.

**Tech Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript strict · Tailwind v4 (CSS-first `@theme`) · shadcn/ui · next-themes · next-intl (en/pt/es/hi) · Vitest · Playwright · pnpm.

---

## Global Constraints (inherits master — load-bearing restatements + 4.5 deltas)

- **Working root:** all commands run from `/Users/rector/local-dev/superteam-academy/app`. Paths below are relative to that `app/` unless they start with `docs/`.
- **★ REPO-SAFETY (load-bearing — a delegated subagent once committed to the WRONG repo):** the controller cwd is the **`core` repo, a structural twin** (both Next.js apps with `src/app/globals.css` + a brand `@theme`). Use **absolute paths**; the shell **RESETS to `core` after every command**, so if a command needs the academy cwd, prefix it with `cd /Users/rector/local-dev/superteam-academy/app &&` every time. **Before each commit** run `git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel` (must end in `/superteam-academy`); commit with `git -C /Users/rector/local-dev/superteam-academy …`; **after each commit** run `git -C /Users/rector/local-dev/core status` and confirm NOTHING academy-related appears there (no `app/`, no `docs/superpowers/`, no `src/components/leaderboard|credentials`, no `src/lib/level-tiers.ts`). Core is RECTOR's ACTIVE repo with its OWN unrelated CV work that comes and goes — **NEVER touch/stage/commit/revert anything in core**; the only invariant you enforce is that no academy path ever appears there. If one does, STOP — you mis-targeted.
- **Branch:** `chore/rector-academy-revival` (NOT main). Do NOT merge (Phase-5 fresh repo integrates). Base HEAD: `76babc7` (end of 4.4).
- **Palette + readable tokens (verified in `globals.css`):** cream `#FFF7E1` / brown `#3B2C22` · skyblue `#41CFFF` · gold `#F9C846` · clay `#E58C2E` · leaf `#A8E063` · rust `#C75A44`. Readable-on-cream text uses `-deep`/`link`: `link #0D7390` · `green-deep #3C6A12` · `clay-deep #8A4A12` · `rust-deep #A23B22`. Bright tokens = decorative FILLS only (backgrounds, borders, rings, icon fills, podium blocks). **NEVER** define/use `--color-sky/yellow/red/green`.
- **Brand CLASSIFICATION** (podium rank, medal, level tier, track art) uses bright tokens for fills and `-deep`/`link` for any readable text, **without** `dark:` variants — exactly as clusters 4.2–4.4 did (deep dark-mode polish is deferred to Phase 5; never ship a redesign that BREAKS dark). **KEEP semantic STATUS** with its existing `dark:` variants: on-chain verification (emerald/destructive), copy-success check (emerald). Theme-managed tokens (`primary`/`background`/`foreground`/`muted`/`secondary`/`border`/`card`/`destructive`) keep their behavior — leave them.
- **★ Locked podium ramp (master plan §Locked color systems):** 1st `bg-gold/20 ring-gold/50 text-clay-deep` · 2nd `bg-clay/15 ring-clay/40 text-clay-deep` · 3rd `bg-rust/15 ring-rust/40 text-rust-deep`. Rank medal/Crown icons use the matching **bright** fill (1st `text-gold`, 2nd `text-clay`, 3rd `text-rust`) — decorative icon fills are allowed.
- **★ Locked confetti palette (master plan):** cream/gold/sky/leaf/clay ONLY, no metallics → exactly `['#FFF7E1','#F9C846','#41CFFF','#A8E063','#E58C2E']`.
- **★ White-text-on-art rule:** credential/certificate art that overlays WHITE text uses a track's **dark** `artGradient` (CSS class, already in `tracks.ts` since 4.2) or `artHex` (raw hex, NEW in this plan) — NOT the light `tintGradient`. The exemplar already shipped: `src/components/courses/credential-preview.tsx` (4.2).
- **Single-source rule:** track art (class + hex) comes from `src/lib/tracks.ts`; level-tier styles from the new `src/lib/level-tiers.ts`; rarity from `src/lib/achievements.ts` (4.4). Never re-hardcode a track/tier hue in a component. This cluster **deletes** three duplicated `numeric-trackId → gradient` maps (credential-detail, credential-gallery, generate-certificate) and one 11-tier `TIER_COLORS` map (level-badge).
- **Icons:** Lucide only, no emoji. **Commits:** conventional `type: description`, **one per task**, **NO AI attribution** (no `Co-Authored-By`, no "Claude"/"Generated with"), GPG-signed. **No shortcuts:** preserve every loading/empty/error/skeleton state + a11y AA + the `prefers-reduced-motion` guards on animations.
- **zsh quoting:** quote any path containing `[locale]`/`(platform)`/`[assetId]`/`[id]` for `rg`/`git`.
- **Testing rhythm (matches 4.0–4.4):** the two single-source modules (`tracks.ts` additions, new `level-tiers.ts`) and the confetti palette are unit-tested (TDD). Visual components gate on **`pnpm build` green + `npx tsc --noEmit` clean + the file's off-palette guard**; the part gate adds `pnpm test:run` + prod-server visual smoke (light + dark) + e2e + opus review.
- **★ Per-task off-palette guard — use the precise `slate-[0-9]`/`stone-[0-9]`/`sky-[0-9]`/`blue-[0-9]`/`yellow-[0-9]` DIGIT forms** (bare `slate` matches `translate` e.g. your-rank-sticky's `translate-y-0`; bare `stone` matches `milestone`). Brand `skyblue` is safe; off-palette default scales are `sky-[0-9]`. `rg` regex is the DEFAULT — use `rg -n 'pat'`, NOT `rg -nE`.
- **★★ `! rg` does NOT gate under `set -e`** (the `!` negation suppresses the failure). Run each guard as a **plain** `rg -n 'pat' <file>` and **eyeball** that the output is empty (or only the documented kept-semantic lines) before committing. Do not wrap guards in a gated `&&`/`set -e` chain and assume a non-zero exit aborts.
- **Per-task gate:** `cd /Users/rector/local-dev/superteam-academy/app && pnpm build` (green, ~16s) + `npx tsc --noEmit` (clean, ~2.4s) + the task's off-palette guard (expected result). tsc catches the only real risk on className-only edits (Tailwind ignores unknown classes, so the build won't fail on a typo'd class) — run tsc + guard per task; a full `pnpm build` per task is fine but the cluster build at the part gate is the hard gate.
- **Part gate (end of sub-plan):** `pnpm test:run` = **398 passing** (387 + 3 tracks + 6 level-tiers + 2 confetti) · cluster off-palette guards (below) return their expected results · prod-server visual smoke light+dark on `/en/leaderboard`, `/en/credentials/<id>` (error state ok pre-seed), and a profile with `LevelBadge` · e2e chromium (reuse prod server) · read-only opus review · SDD ledger.
- **Dev/visual infra:** Turbopack `pnpm dev` first-compile HANGS → use the **prod server** for visual: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && PORT=3000 pnpm start`, then Chrome MCP. Set localStorage `theme` explicitly ('light'/'dark') + reload per theme. e2e: with the prod server on :3000, `pnpm exec playwright test --project=chromium` REUSES it (`reuseExistingServer:!CI`) → ~17s, sidestepping the dev hang.

---

## 4.5-specific design decisions (read before executing)

1. **Leaderboard page → `PageHeader` (NOT width-cap-only).** Unlike dashboard/profile (4.4), the leaderboard has **no personalized hero** — it currently hand-rolls an `<h1 className="text-2xl">`. So it adopts the foundation `<PageHeader>` (title + description + the Refresh button as `actions`) inside a `mx-auto … max-w-7xl` root, exactly mirroring `courses/page.tsx` + `challenges/page.tsx`. No eyebrow/icon (neither existing consumer uses them — house pattern is title+description). The shell `<main>` already pads `p-6 lg:p-8`, so use the inline `max-w-7xl` root, NOT `<PageContainer>` (which would double the px).
2. **Podium + medals → locked gold/clay/rust ramp.** `podium-top3.tsx` PODIUM_CONFIG and `leaderboard-row.tsx` MEDAL_COLORS remap to 1st=gold / 2nd=clay / 3rd=rust (block fill `bg-*/15-20`, avatar `ring-*`, label `text-clay-deep`/`text-rust-deep`, Crown/Medal icon bright fill). The deterministic **HSL identicon avatars** (`walletToGradient`/`walletToHsl`, white initials) are KEPT — they are the same identity-avatar pattern 4.4 kept on `profile-header` (decorative, not a brand classification). The leaderboard streak `Flame` rebrands to `text-clay-deep` (the 4.4 streak decision).
3. **Speed-leaderboard → full podium chips (RECTOR, carried from 4.3).** 4.3 left the speed leaderboard's top-3 as colored rank *text* (1=clay-deep, 2=**muted**, 3=rust-deep). 4.5 converts the top-3 to tinted **podium chips** (a `size-6` rounded chip: tint bg + ring + `-deep` number) using the locked podium ramp — rank 2 moves from neutral → clay, matching the main board. Ranks 4+ stay plain muted numbers. (The mock rows make these chips visible WITHOUT seeding — a rare screenshot-able earned-state surface this cluster.)
4. **Credential/certificate art → single-source `tracks.ts` (dark, white-safe).** `credential-detail.tsx`, `credential-gallery.tsx` and `generate-certificate.ts` each carry a DUPLICATE off-palette `numeric-trackId → gradient` map with **white** Award/title text on near-cream stops (an AA failure). All three delete their local map and consume `tracks.ts`: the two components use `getCredentialTrack(trackId).artGradient` (CSS class); the Canvas uses `getCredentialTrack(trackId).artHex` (raw hex, NEW — Canvas can't read CSS classes). `credential.attributes.trackId` is **0-indexed** (0=Core,1=DeFi,2=NFT,3=Security,4=Gaming — per `credential-attributes.tsx` `TRACK_NAMES`); the resolver maps 0→Core,1→DeFi,2→NFT,3→Security and falls back to Core for `undefined`/Gaming/out-of-range (Gaming has no brand track; credentials don't render in the unseeded demo anyway).
5. **KEEP these as semantic STATUS (master keep-list — do NOT rebrand):** the on-chain **verification badge** (`verification-badge.tsx` emerald valid / destructive invalid — KEEP ENTIRELY); the certificate-canvas **verified badge** (`generate-certificate.ts` green `#22c55e` circle + `rgba(34,197,94,…)` glow + white check — it mirrors the on-page emerald); the **copy-success** checks (`credential-detail.tsx` L176 + `share-credential.tsx` L126 emerald — same status as the 4.4 profile-header copy-check); the page/error **destructive** states (leaderboard page, `[assetId]` page). These carry meaning.
6. **Level-badge → new 11-tier `level-tiers.ts` ramp.** `achievements.ts` (4 rarities) does NOT fit the 11 level tiers, so a parallel module is created (master plan explicitly allows this). The ramp anchors tiers 1–6 to distinct brand hues (1 Newcomer=neutral, 2 Explorer=leaf, 3 Builder=skyblue, 4 Developer=clay, 5 Engineer=gold, 6 Architect=rust) and escalates tiers 7–11 within the warm gold/clay/rust family by **fill intensity + border + ring**, with Legend getting a full-gold border + ring-2 gold/60 + a cream **ring-offset inlay**. No metallics. The `level-badge.tsx` circle gains the tier `ring`.
   - **★ RESOLVED (RECTOR, plan approval): BOTH — ring/fill escalation AND prestige pips.** Tiers 7–11 escalate by fill+border+ring AND render 1–5 prestige dots (7→1, 8→2, 9→3, 10→4, 11→5). The `level-tiers.ts` style carries a `pips: number` (0 for tiers 1–6); `level-badge.tsx` renders a static (no animation → reduced-motion-safe) `aria-hidden` dot row in the tier color below the title.
7. **Confetti → 5 brand hexes.** `confetti-animation.tsx` `COLORS` (10 random hexes incl. metallic `#FFD700`, teal `#4ECDC4`, plum `#DDA0DD`) becomes exactly the 5 brand hexes (decision in Global Constraints). `COLORS` is exported so it can be unit-tested. `level-up-modal.tsx` renders `ConfettiAnimation` but is NOT touched here (already branded in 4.4).

---

## File Structure

**Created (2):** `src/lib/level-tiers.ts` (+ `src/lib/__tests__/level-tiers.test.ts`) · `src/components/gamification/__tests__/confetti-animation.test.ts`.

**Modified (10 + 2 test files):**
- Single-source foundations: `src/lib/tracks.ts` (T1, + `src/lib/__tests__/tracks.test.ts`) · `src/lib/level-tiers.ts` NEW (T2)
- Leaderboard: `src/components/leaderboard/podium-top3.tsx` (T3) · `src/components/leaderboard/leaderboard-row.tsx` (T4) · `src/app/[locale]/(platform)/leaderboard/page.tsx` (T5)
- Credentials + certificate canvas: `src/components/credentials/credential-detail.tsx` (T6) · `src/components/credentials/credential-gallery.tsx` (T7) · `src/lib/utils/generate-certificate.ts` (T8) · `src/components/credentials/share-credential.tsx` (T9)
- Gamification: `src/components/gamification/level-badge.tsx` (T10) · `src/components/gamification/confetti-animation.tsx` (T11, + test)
- Speed leaderboard: `src/components/challenges/speed-leaderboard.tsx` (T12)

**Verify-only (no change — semantic-only / already on-brand / structural):** `leaderboard/layout.tsx` (metadata) · `leaderboard/leaderboard-table.tsx`, `your-rank-sticky.tsx`, `course-filter.tsx`, `time-filter.tsx` (pure theme tokens) · `credentials/[assetId]/page.tsx` (theme + destructive error) · `credential-attributes.tsx` (text labels, no color) · `verification-badge.tsx` (semantic emerald/destructive — KEEP ENTIRELY) · `certificates/[id]/page.tsx` (308 redirect, no UI) · `courses/credential-preview.tsx` (the 4.2 exemplar — already uses `getTrack(String(course.trackId)).artGradient`; its `course.trackId` is tracks.ts-aligned, a DIFFERENT convention than `credential.attributes.trackId`, so leave it).

---

## Task 1: `tracks.ts` — raw `artHex` + 0-indexed `getCredentialTrack` (TDD)

**Files:**
- Modify: `src/lib/tracks.ts`
- Test: `src/lib/__tests__/tracks.test.ts`

**Interfaces:**
- Produces: `Track.artHex: { from: string; to: string }` (raw hex mirroring `artGradient`); `getCredentialTrack(trackId?: number): Track` (0-indexed credential trackId → Track; fallback Core). Consumed by T6/T7/T8.

- [ ] **Step 1: Write the failing tests.** In `src/lib/__tests__/tracks.test.ts`, change the import line (line 2) from `import { TRACKS, ALL_TRACKS, getTrack } from '../tracks';` to `import { TRACKS, ALL_TRACKS, getTrack, getCredentialTrack } from '../tracks';`. Then insert these three `it` blocks immediately before the closing `});` of the `describe('tracks module', …)` block (after the existing `artGradient` test, before line 40's `});`):

```ts
  it('exposes a raw hex art pair (matching the brand palette) for every track', () => {
    const BRAND_HEX = /^#(0D7390|3B2C22|8A4A12|A23B22)$/;
    for (const t of ALL_TRACKS) {
      expect(t.artHex.from).toMatch(BRAND_HEX);
      expect(t.artHex.to).toMatch(BRAND_HEX);
    }
  });

  it('maps a 0-indexed credential trackId to the right track', () => {
    expect(getCredentialTrack(0).slug).toBe('solana-core');
    expect(getCredentialTrack(1).slug).toBe('defi');
    expect(getCredentialTrack(2).slug).toBe('nft');
    expect(getCredentialTrack(3).slug).toBe('security');
  });

  it('falls back to Solana Core for undefined / out-of-range credential trackId', () => {
    expect(getCredentialTrack(undefined).slug).toBe('solana-core');
    expect(getCredentialTrack(4).slug).toBe('solana-core'); // "Gaming" has no brand track
    expect(getCredentialTrack(99).slug).toBe('solana-core');
  });
```

- [ ] **Step 2: Run it — verify it fails.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/tracks.test.ts`
Expected: FAIL — `getCredentialTrack` is not exported / `artHex` undefined.

- [ ] **Step 3: Add the `artHex` field to the interface.** In `src/lib/tracks.ts`, after the `artGradient` field in the `Track` interface (line 27, `artGradient: string;`), add:

```ts
  /** Raw hex pair mirroring artGradient — for the Canvas certificate (Canvas can't read CSS classes). */
  artHex: { from: string; to: string };
```

- [ ] **Step 4: Add `artHex` to each of the four tracks.** Add one line to each track object, immediately after its `artGradient:` line, using the verified token hexes (link `#0D7390`, brown `#3B2C22`, clay-deep `#8A4A12`, rust-deep `#A23B22`):
  - Core (after `artGradient: 'from-link to-brown',`): `artHex: { from: '#0D7390', to: '#3B2C22' },`
  - DeFi (after `artGradient: 'from-clay-deep to-brown',`): `artHex: { from: '#8A4A12', to: '#3B2C22' },`
  - NFT (after `artGradient: 'from-clay-deep to-rust-deep',`): `artHex: { from: '#8A4A12', to: '#A23B22' },`
  - Security (after `artGradient: 'from-rust-deep to-brown',`): `artHex: { from: '#A23B22', to: '#3B2C22' },`

- [ ] **Step 5: Add the `getCredentialTrack` resolver.** At the end of the file (after the existing `getTrack` function), add:

```ts
/**
 * Resolve a track from a credential's 0-indexed `attributes.trackId`
 * (0=Core, 1=DeFi, 2=NFT, 3=Security, 4=Gaming). tracks.ts ids are 1-indexed
 * strings, so map numerically; unknown / Gaming / undefined fall back to Solana Core.
 */
const CREDENTIAL_TRACK_BY_NUMERIC: Record<number, TrackId> = {
  0: '1',
  1: '2',
  2: '3',
  3: '4',
};

export function getCredentialTrack(trackId?: number): Track {
  if (trackId === undefined) return TRACKS['1'];
  return TRACKS[CREDENTIAL_TRACK_BY_NUMERIC[trackId] ?? '1'];
}
```

- [ ] **Step 6: Run it — verify it passes.** Run the same test command. Expected: PASS (8/8 — 5 existing + 3 new).
- [ ] **Step 7: Build + typecheck.** Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit` → green/clean.
- [ ] **Step 8: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel   # must end in /superteam-academy
git -C /Users/rector/local-dev/superteam-academy add app/src/lib/tracks.ts app/src/lib/__tests__/tracks.test.ts
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: add raw artHex and 0-indexed credential track resolver to tracks module"
git -C /Users/rector/local-dev/superteam-academy status   # clean
git -C /Users/rector/local-dev/core status                 # MUST show nothing academy-related
```

---

## Task 2: `level-tiers.ts` — single-source 11-tier level ramp (TDD)

**Files:**
- Create: `src/lib/level-tiers.ts`
- Test: `src/lib/__tests__/level-tiers.test.ts`

**Interfaces:**
- Produces: `LEVEL_TIERS: readonly [...11 names]`; `type LevelTier`; `LEVEL_TIER_STYLES: Record<LevelTier, { bg; border; text; ring }>`; `levelTierStyle(title: string): {...}` (case-insensitive, falls back to newcomer). Consumed by T10.

- [ ] **Step 1: Write the failing test** — create `src/lib/__tests__/level-tiers.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { levelTierStyle, LEVEL_TIER_STYLES, LEVEL_TIERS } from '../level-tiers';

describe('level-tiers module', () => {
  it('defines all eleven tiers in ascending order', () => {
    expect(LEVEL_TIERS).toEqual([
      'newcomer', 'explorer', 'builder', 'developer', 'engineer', 'architect',
      'specialist', 'expert', 'master', 'grandmaster', 'legend',
    ]);
    expect(Object.keys(LEVEL_TIER_STYLES)).toEqual([...LEVEL_TIERS]);
  });

  it('uses AA-readable text tokens (or muted) for every tier', () => {
    for (const s of Object.values(LEVEL_TIER_STYLES)) {
      expect(s.text).toMatch(/text-(link|clay-deep|rust-deep|green-deep|muted-foreground)/);
    }
  });

  it('escalates the ring across prestige tiers (1-6 none, 7-8 ring-1, 9-11 ring-2, legend offset)', () => {
    expect(levelTierStyle('newcomer').ring).toBe('');
    expect(levelTierStyle('architect').ring).toBe('');
    expect(levelTierStyle('specialist').ring).toContain('ring-1');
    expect(levelTierStyle('master').ring).toContain('ring-2');
    expect(levelTierStyle('legend').ring).toContain('ring-2');
    expect(levelTierStyle('legend').ring).toContain('ring-offset');
  });

  it('assigns prestige pips to tiers 7-11 only (1..5), none below', () => {
    expect(levelTierStyle('newcomer').pips).toBe(0);
    expect(levelTierStyle('architect').pips).toBe(0);
    expect(levelTierStyle('specialist').pips).toBe(1);
    expect(levelTierStyle('expert').pips).toBe(2);
    expect(levelTierStyle('master').pips).toBe(3);
    expect(levelTierStyle('grandmaster').pips).toBe(4);
    expect(levelTierStyle('legend').pips).toBe(5);
  });

  it('contains no off-palette or metallic color names', () => {
    expect(JSON.stringify(LEVEL_TIER_STYLES)).not.toMatch(
      /violet|purple|indigo|fuchsia|pink|rose|teal|cyan|slate|orange|emerald|amber|zinc|gray|silver|bronze|metal|red-[0-9]|blue-[0-9]|yellow-[0-9]/i,
    );
  });

  it('is case-insensitive and falls back to newcomer for an unknown title', () => {
    expect(levelTierStyle('LEGEND').border).toBe(LEVEL_TIER_STYLES.legend.border);
    expect(levelTierStyle('does-not-exist').bg).toBe(LEVEL_TIER_STYLES.newcomer.bg);
  });
});
```

- [ ] **Step 2: Run it — verify it fails.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/level-tiers.test.ts`
Expected: FAIL — cannot resolve `../level-tiers`.

- [ ] **Step 3: Create `src/lib/level-tiers.ts`:**

```ts
/**
 * Single-source level-tier ramp for `LevelBadge` (11 tiers matching
 * `LEVEL_TITLES` in `@/lib/solana/xp`). Brand-pure, AA, no metallics.
 *
 * Tiers 1-6 anchor to distinct brand hues; tiers 7-11 escalate within the
 * warm gold/clay/rust family by fill intensity + border + ring (the brand
 * runs out of distinct hues by design). Legend tops out with a full-gold
 * border + ring-2 gold/60 and a cream ring-offset inlay.
 */
export const LEVEL_TIERS = [
  'newcomer',
  'explorer',
  'builder',
  'developer',
  'engineer',
  'architect',
  'specialist',
  'expert',
  'master',
  'grandmaster',
  'legend',
] as const;

export type LevelTier = (typeof LEVEL_TIERS)[number];

interface LevelTierStyle {
  /** Tinted badge fill (decorative). */
  bg: string;
  /** Badge border (escalates with tier). */
  border: string;
  /** AA-readable brand text for the level number + title. */
  text: string;
  /** Ring escalates for prestige tiers (7-11); empty below. No metallics. */
  ring: string;
  /** Prestige dot count (tiers 7-11 → 1..5; 0 below). Rendered as a static aria-hidden dot row. */
  pips: number;
}

export const LEVEL_TIER_STYLES: Record<LevelTier, LevelTierStyle> = {
  newcomer: { bg: 'bg-muted', border: 'border-border', text: 'text-muted-foreground', ring: '', pips: 0 },
  explorer: { bg: 'bg-leaf/15', border: 'border-leaf/40', text: 'text-green-deep', ring: '', pips: 0 },
  builder: { bg: 'bg-skyblue/10', border: 'border-skyblue/40', text: 'text-link', ring: '', pips: 0 },
  developer: { bg: 'bg-clay/15', border: 'border-clay/40', text: 'text-clay-deep', ring: '', pips: 0 },
  engineer: { bg: 'bg-gold/20', border: 'border-gold/50', text: 'text-clay-deep', ring: '', pips: 0 },
  architect: { bg: 'bg-rust/15', border: 'border-rust/40', text: 'text-rust-deep', ring: '', pips: 0 },
  specialist: { bg: 'bg-rust/20', border: 'border-rust/50', text: 'text-rust-deep', ring: 'ring-1 ring-rust/30', pips: 1 },
  expert: { bg: 'bg-clay/25', border: 'border-clay/60', text: 'text-clay-deep', ring: 'ring-1 ring-clay/40', pips: 2 },
  master: { bg: 'bg-gold/25', border: 'border-gold/60', text: 'text-clay-deep', ring: 'ring-2 ring-gold/40', pips: 3 },
  grandmaster: { bg: 'bg-gold/30', border: 'border-rust/60', text: 'text-clay-deep', ring: 'ring-2 ring-rust/50', pips: 4 },
  legend: {
    bg: 'bg-gold/30',
    border: 'border-gold',
    text: 'text-clay-deep',
    ring: 'ring-2 ring-gold/60 ring-offset-2 ring-offset-background',
    pips: 5,
  },
};

/** Resolve a level title (e.g. from `getLevelTitle`) to its brand tier style; falls back to newcomer. */
export function levelTierStyle(title: string): LevelTierStyle {
  return LEVEL_TIER_STYLES[title.toLowerCase() as LevelTier] ?? LEVEL_TIER_STYLES.newcomer;
}
```

- [ ] **Step 4: Run it — verify it passes.** Run the same test command. Expected: PASS (6/6).
- [ ] **Step 5: Build + typecheck.** → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/lib/level-tiers.ts app/src/lib/__tests__/level-tiers.test.ts
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: add single-source 11-tier level ramp module"
git -C /Users/rector/local-dev/core status   # academy-clean check
```

---

## Task 3: `podium-top3.tsx` — locked gold/clay/rust podium ramp

**Files:** Modify `src/components/leaderboard/podium-top3.tsx`

Remap the three `PODIUM_CONFIG` entries (lines 39–82). KEEP `walletToGradient` + the avatar `text-white` (HSL identicon, same pattern 4.4 kept). Exact field replacements:

- [ ] **Step 1: 1st place (lines 44–51)** — `ringColor: "ring-yellow-400"`→`ringColor: "ring-gold/50"` · `bgGradient: "from-yellow-400/20 via-amber-300/10 to-transparent"`→`bgGradient: "from-gold/20 via-gold/10 to-transparent"` · `borderColor: "border-yellow-400/40"`→`borderColor: "border-gold/40"` · `iconColor: "text-yellow-400"`→`iconColor: "text-gold"` · `labelColor: "text-yellow-500 dark:text-yellow-400"`→`labelColor: "text-clay-deep"`.
- [ ] **Step 2: 2nd place (lines 58–65)** — `ringColor: "ring-zinc-400"`→`ringColor: "ring-clay/40"` · `bgGradient: "from-zinc-400/15 via-zinc-300/5 to-transparent"`→`bgGradient: "from-clay/15 via-clay/5 to-transparent"` · `borderColor: "border-zinc-400/30"`→`borderColor: "border-clay/30"` · `iconColor: "text-zinc-400"`→`iconColor: "text-clay"` · `labelColor: "text-zinc-500 dark:text-zinc-400"`→`labelColor: "text-clay-deep"`.
- [ ] **Step 3: 3rd place (lines 72–79)** — `ringColor: "ring-amber-700 dark:ring-amber-600"`→`ringColor: "ring-rust/40"` · `bgGradient: "from-amber-700/15 via-amber-600/5 to-transparent"`→`bgGradient: "from-rust/15 via-rust/5 to-transparent"` · `borderColor: "border-amber-700/30 dark:border-amber-600/30"`→`borderColor: "border-rust/30"` · `iconColor: "text-amber-700 dark:text-amber-600"`→`iconColor: "text-rust"` · `labelColor: "text-amber-700 dark:text-amber-600"`→`labelColor: "text-rust-deep"`.
- [ ] **Step 4: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'yellow-[0-9]|amber|zinc|orange|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|blue-[0-9]|sky-[0-9]' src/components/leaderboard/podium-top3.tsx`
Expected: no matches (empty).

- [ ] **Step 5: Build + typecheck.** → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/leaderboard/podium-top3.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: rebrand the leaderboard podium to the gold/clay/rust ramp"
git -C /Users/rector/local-dev/core status
```

---

## Task 4: `leaderboard-row.tsx` — brand medal colors + clay streak

**Files:** Modify `src/components/leaderboard/leaderboard-row.tsx`

KEEP `walletToHsl` + the mini-avatar `text-white` (identicon).

- [ ] **Step 1: Rebrand `MEDAL_COLORS`** (lines 35–39). Replace:

```tsx
const MEDAL_COLORS: Record<number, string> = {
  1: 'text-yellow-500',
  2: 'text-zinc-400',
  3: 'text-amber-700 dark:text-amber-600',
};
```

with (bright fills matching the podium icons):

```tsx
const MEDAL_COLORS: Record<number, string> = {
  1: 'text-gold',
  2: 'text-clay',
  3: 'text-rust',
};
```

- [ ] **Step 2: Rebrand the streak flame** (line 102). Change `<Flame className="size-4 text-orange-500" />` to `<Flame className="size-4 text-clay-deep" />`.
- [ ] **Step 3: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'yellow-[0-9]|amber|zinc|orange|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|blue-[0-9]|sky-[0-9]' src/components/leaderboard/leaderboard-row.tsx`
Expected: no matches (empty).

- [ ] **Step 4: Build + typecheck.** → green/clean.
- [ ] **Step 5: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/leaderboard/leaderboard-row.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the leaderboard row medals and streak flame"
git -C /Users/rector/local-dev/core status
```

---

## Task 5: `leaderboard/page.tsx` — adopt PageHeader + width cap

**Files:** Modify `src/app/[locale]/(platform)/leaderboard/page.tsx`

- [ ] **Step 1: Add the import.** After the last leaderboard component import (line 17, `import { YourRankSticky } …`), add: `import { PageHeader } from '@/components/ui/page-header';`
- [ ] **Step 2: Width-cap the root.** Change line 102 from `<div className="flex flex-col gap-6">` to `<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">`.
- [ ] **Step 3: Replace the hand-rolled header with `<PageHeader>`.** Replace the entire header block (lines 103–126 — the `{/* Page Header */}` comment through its closing `</div>`):

```tsx
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compete with fellow learners and climb the ranks
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw
            className={cn(
              'size-3.5',
              (isRefreshing || isLoading) && 'animate-spin',
            )}
          />
          Refresh
        </Button>
      </div>
```

with:

```tsx
      {/* Page Header */}
      <PageHeader
        title={t('title')}
        description="Compete with fellow learners and climb the ranks"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="gap-1.5"
          >
            <RefreshCw
              className={cn(
                'size-3.5',
                (isRefreshing || isLoading) && 'animate-spin',
              )}
            />
            Refresh
          </Button>
        }
      />
```

*(`Button`, `RefreshCw`, `cn`, `t` are all already imported. No off-palette colors in this file — the `border-destructive/30 bg-destructive/5` error block is a semantic theme token, KEEP.)*

- [ ] **Step 4: Off-palette guard — expect no matches** (destructive is a theme token, not in pattern):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'yellow-[0-9]|amber|zinc|orange|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|blue-[0-9]|sky-[0-9]|emerald' 'src/app/[locale]/(platform)/leaderboard/page.tsx'`
Expected: no matches (empty).

- [ ] **Step 5: Build + typecheck.** → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add 'app/src/app/[locale]/(platform)/leaderboard/page.tsx'
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: adopt PageHeader and width cap on the leaderboard page"
git -C /Users/rector/local-dev/core status
```

---

## Task 6: `credential-detail.tsx` — single-source track art

**Files:** Modify `src/components/credentials/credential-detail.tsx`

**Interfaces:** Consumes `getCredentialTrack` (T1).

- [ ] **Step 1: Add the import.** After the `cn` import (line 16, `import { cn } from '@/lib/utils';`), add: `import { getCredentialTrack } from '@/lib/tracks';`
- [ ] **Step 2: Delete the duplicated track-gradient map.** Remove the entire `TRACK_GRADIENTS` const + `getTrackGradient` function (lines 26–40):

```tsx
const TRACK_GRADIENTS: Record<number, string> = {
  0: 'from-emerald-500 to-teal-600',
  1: 'from-blue-500 to-indigo-600',
  2: 'from-purple-500 to-violet-600',
  3: 'from-orange-500 to-amber-600',
  4: 'from-rose-500 to-pink-600',
};

function getTrackGradient(trackId: number | undefined): string {
  if (trackId === undefined) return 'from-zinc-500 to-zinc-600';
  return (
    TRACK_GRADIENTS[trackId % Object.keys(TRACK_GRADIENTS).length] ??
    'from-zinc-500 to-zinc-600'
  );
}
```

- [ ] **Step 3: Resolve the gradient from the single source.** Change line 70 from `const gradient = getTrackGradient(credential.attributes.trackId);` to `const gradient = getCredentialTrack(credential.attributes.trackId).artGradient;`

*(The hero `bg-gradient-to-br` at line 99 now uses the AA-safe DARK artGradient, so the white `text-white/80` Award icon + label at lines 113–117 become AA-compliant. KEEP the emerald copy-check at line 176 — copy-success status.)*

- [ ] **Step 4: Off-palette guard — expect ONLY the kept emerald copy-check** (line ~176):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|teal|indigo|violet|purple|orange|amber|rose|pink|fuchsia|zinc|blue-[0-9]|slate-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/credentials/credential-detail.tsx`
Expected: exactly ONE line — `text-emerald-500` on the copy-check (line ~176). No track-gradient color names remain.

- [ ] **Step 5: Build + typecheck.** → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/credentials/credential-detail.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: source credential detail art from the tracks module"
git -C /Users/rector/local-dev/core status
```

---

## Task 7: `credential-gallery.tsx` — single-source track art

**Files:** Modify `src/components/credentials/credential-gallery.tsx`

- [ ] **Step 1: Add the import.** After the `Credential` type import (line 16, `import type { Credential } from '@/lib/solana/credentials';`), add: `import { getCredentialTrack } from '@/lib/tracks';`
- [ ] **Step 2: Delete `TRACK_GRADIENTS`** (lines 24–30 — the whole const). **KEEP `LEVEL_LABELS`** (lines 32–36).
- [ ] **Step 3: Delete the `getTrackGradient` function** (lines 38–41):

```tsx
function getTrackGradient(trackId: number | undefined): string {
  if (trackId === undefined) return 'from-zinc-500 to-zinc-600';
  return TRACK_GRADIENTS[trackId % Object.keys(TRACK_GRADIENTS).length] ?? 'from-zinc-500 to-zinc-600';
}
```

- [ ] **Step 4: Resolve the gradient from the single source.** Change line 45 from `const gradient = getTrackGradient(credential.attributes.trackId);` to `const gradient = getCredentialTrack(credential.attributes.trackId).artGradient;`

*(The card `bg-gradient-to-br` at line 54 now uses the DARK artGradient, so the white `text-white/80` Award icon at line 67 is AA. KEEP the `Badge variant="secondary"` verified overlay — theme token.)*

- [ ] **Step 5: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|teal|indigo|violet|purple|orange|amber|rose|pink|fuchsia|zinc|blue-[0-9]|slate-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/credentials/credential-gallery.tsx`
Expected: no matches (empty).

- [ ] **Step 6: Build + typecheck.** → green/clean.
- [ ] **Step 7: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/credentials/credential-gallery.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: source credential gallery art from the tracks module"
git -C /Users/rector/local-dev/core status
```

---

## Task 8: `generate-certificate.ts` — single-source canvas art (raw hex)

**Files:** Modify `src/lib/utils/generate-certificate.ts`

**Interfaces:** Consumes `getCredentialTrack(...).artHex` (T1).

- [ ] **Step 1: Add the import.** At the top of the file (after the leading block comment, before `interface CertificateData`), add: `import { getCredentialTrack } from '@/lib/tracks';`
- [ ] **Step 2: Delete the duplicated hex map.** Remove the entire `TRACK_COLORS` const + `getTrackColors` function (lines 16–28):

```ts
const TRACK_COLORS: Record<number, { start: string; end: string }> = {
  0: { start: '#10b981', end: '#0d9488' }, // emerald -> teal
  1: { start: '#3b82f6', end: '#4f46e5' }, // blue -> indigo
  2: { start: '#a855f7', end: '#7c3aed' }, // purple -> violet
  3: { start: '#f97316', end: '#f59e0b' }, // orange -> amber
  4: { start: '#f43f5e', end: '#ec4899' }, // rose -> pink
};

function getTrackColors(trackId?: number): { start: string; end: string } {
  if (trackId === undefined) return { start: '#7c3aed', end: '#6366f1' };
  const keys = Object.keys(TRACK_COLORS);
  return TRACK_COLORS[trackId % keys.length] ?? { start: '#7c3aed', end: '#6366f1' };
}
```

- [ ] **Step 3: Resolve the canvas gradient hexes from the single source.** Change line 129 from `const { start, end } = getTrackColors(data.trackId);` to `const { from: start, to: end } = getCredentialTrack(data.trackId).artHex;`

*(KEEP `drawVerificationBadge`'s green `#22c55e` circle + `rgba(34, 197, 94, 0.4)` glow + white check at lines 73/79 — semantic on-chain "verified" badge, mirrors the on-page emerald. KEEP all white/black `rgba(255,…)` / `rgba(0,…)` card chrome.)*

- [ ] **Step 4: Off-palette guard — expect the OLD track hexes gone, the green verify badge kept.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n '10b981|0d9488|3b82f6|4f46e5|a855f7|7c3aed|f97316|f59e0b|f43f5e|ec4899|6366f1' src/lib/utils/generate-certificate.ts`
Expected: no matches (empty — all five off-palette pairs + the violet fallback are gone).
Then confirm the kept semantic badge: `rg -n '22c55e|34, 197, 94' src/lib/utils/generate-certificate.ts` → 2 matches (lines ~73, ~79).

- [ ] **Step 5: Build + typecheck.** → green/clean.
- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/lib/utils/generate-certificate.ts
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: source certificate canvas colors from the tracks module"
git -C /Users/rector/local-dev/core status
```

---

## Task 9: `share-credential.tsx` — brand the QR surface

**Files:** Modify `src/components/credentials/share-credential.tsx`

- [ ] **Step 1: Rebrand the QR placeholder background** (line 45). Change `className="rounded-md border bg-white dark:bg-zinc-900"` to `className="rounded-md border bg-card"` (theme token works both themes; the `fill-foreground` cells keep contrast).

*(KEEP the emerald copy-check at line 126 — copy-success status. The X-share SVG uses `fill="currentColor"` — leave.)*

- [ ] **Step 2: Off-palette guard — expect ONLY the kept emerald copy-check.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'zinc|emerald|teal|indigo|violet|purple|orange|amber|rose|pink|fuchsia|slate-[0-9]|blue-[0-9]|sky-[0-9]|yellow-[0-9]' src/components/credentials/share-credential.tsx`
Expected: exactly ONE line — `text-emerald-500` on the copy-check (line ~126). No `zinc`.

- [ ] **Step 3: Build + typecheck.** → green/clean.
- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/credentials/share-credential.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: brand the share-credential QR surface"
git -C /Users/rector/local-dev/core status
```

---

## Task 10: `level-badge.tsx` — consume the level-tiers module

**Files:** Modify `src/components/gamification/level-badge.tsx`

**Interfaces:** Consumes `levelTierStyle` (T2).

- [ ] **Step 1: Add the import.** After the `cn` import (line 3, `import { cn } from '@/lib/utils';`), add: `import { levelTierStyle } from '@/lib/level-tiers';`
- [ ] **Step 2: Delete the off-palette `TIER_COLORS` map** (lines 17–73 — the whole `const TIER_COLORS: Record<…> = { … };` block, all 11 entries).
- [ ] **Step 3: Replace `getTierColors` with the module.** Delete the `getTierColors` helper (lines 81–84):

```tsx
function getTierColors(title: string) {
  const key = title.toLowerCase();
  return TIER_COLORS[key] ?? TIER_COLORS.newcomer!;
}
```

Then change its call site (line 87) from `const tier = getTierColors(title);` to `const tier = levelTierStyle(title);`.

- [ ] **Step 4: Apply the tier ring on the badge circle.** In the circle `cn(...)` (lines 95–102), add `tier.ring,` immediately after the `tier.text,` line, so the block reads:

```tsx
            className={cn(
              'flex items-center justify-center rounded-full border-2 font-bold transition-transform hover:scale-105',
              tier.bg,
              tier.border,
              tier.text,
              tier.ring,
              dimensions.container,
              dimensions.text,
            )}
```

*(The title `<span>` at lines 108–114 keeps `tier.text` — unchanged. `levelTierStyle` returns `{ bg, border, text, ring, pips }`, so `tier.bg`/`tier.border`/`tier.text`/`tier.ring` still resolve.)*

- [ ] **Step 5: Render the prestige pips (tiers 7–11).** Immediately AFTER the title `<span>`'s closing tag (line ~116, the `</span>` wrapping `{title}`) and still INSIDE the `flex flex-col items-center gap-1` container, add a static, `aria-hidden` dot row (the badge's `aria-label` already announces the tier, so the dots are decorative):

```tsx
          {tier.pips > 0 && (
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: tier.pips }).map((_, i) => (
                <span
                  key={i}
                  className={cn('size-1 rounded-full bg-current', tier.text)}
                />
              ))}
            </div>
          )}
```

*(No animation → no `prefers-reduced-motion` concern. Dots inherit the tier color via `bg-current` + `tier.text`. The `cn` import already exists.)*

- [ ] **Step 6: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'zinc|emerald|blue-[0-9]|violet|purple|amber|orange|rose|red-[0-9]|fuchsia|yellow-[0-9]|teal|indigo|pink|slate-[0-9]|sky-[0-9]' src/components/gamification/level-badge.tsx`
Expected: no matches (empty — all 11 off-palette tiers are gone; styles come from the module).

- [ ] **Step 7: Build + typecheck.** → green/clean.
- [ ] **Step 8: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/gamification/level-badge.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: drive level-badge tiers from the level-tiers module"
git -C /Users/rector/local-dev/core status
```

---

## Task 11: `confetti-animation.tsx` — brand palette (+ TDD)

**Files:**
- Modify: `src/components/gamification/confetti-animation.tsx`
- Test: `src/components/gamification/__tests__/confetti-animation.test.ts`

- [ ] **Step 1: Write the failing test** — create `src/components/gamification/__tests__/confetti-animation.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { COLORS } from '../confetti-animation';

describe('confetti palette', () => {
  it('uses only the five RECTOR brand hexes (cream/gold/sky/leaf/clay)', () => {
    expect([...COLORS].sort()).toEqual(
      ['#FFF7E1', '#F9C846', '#41CFFF', '#A8E063', '#E58C2E'].sort(),
    );
  });

  it('contains no metallic or off-palette confetti colors', () => {
    const joined = COLORS.join(',');
    expect(joined).not.toMatch(
      /FFD700|4ECDC4|45B7D1|96CEB4|DDA0DD|98D8C8|FF8A5C|A8E6CF|FF6B6B|FFEAA7/i,
    );
  });
});
```

- [ ] **Step 2: Run it — verify it fails.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/components/gamification/__tests__/confetti-animation.test.ts`
Expected: FAIL — `COLORS` is not exported (and the old 10-hex palette mismatches).

- [ ] **Step 3: Export + rebrand `COLORS`** (lines 32–43). Replace the whole declaration:

```tsx
const COLORS = [
  '#FFD700', // gold
  '#FF6B6B', // coral
  '#4ECDC4', // teal
  '#45B7D1', // sky
  '#96CEB4', // mint
  '#FFEAA7', // cream
  '#DDA0DD', // plum
  '#98D8C8', // seafoam
  '#FF8A5C', // peach
  '#A8E6CF', // sage
];
```

with the 5 brand hexes (exported for the test):

```tsx
export const COLORS = [
  '#FFF7E1', // cream
  '#F9C846', // gold
  '#41CFFF', // sky
  '#A8E063', // leaf
  '#E58C2E', // clay
];
```

- [ ] **Step 4: Run it — verify it passes.** Run the same test command. Expected: PASS (2/2).
- [ ] **Step 5: Off-palette guard — expect ONLY the 5 brand hexes.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n '#[0-9A-Fa-f]{6}' src/components/gamification/confetti-animation.tsx`
Expected: exactly 5 lines — `#FFF7E1`, `#F9C846`, `#41CFFF`, `#A8E063`, `#E58C2E`. No `#FFD700`/`#4ECDC4`/etc.

- [ ] **Step 6: Build + typecheck.** → green/clean.
- [ ] **Step 7: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/gamification/confetti-animation.tsx app/src/components/gamification/__tests__/confetti-animation.test.ts
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: rebrand the confetti palette to the brand hexes"
git -C /Users/rector/local-dev/core status
```

---

## Task 12: `speed-leaderboard.tsx` — full podium chips

**Files:** Modify `src/components/challenges/speed-leaderboard.tsx`

4.3 left the top-3 as colored rank *text* (rank 2 = neutral). Convert the top-3 to tinted podium **chips** matching the locked ramp.

- [ ] **Step 1: Rebrand `RANK_STYLES` to chip styles** (lines 35–39). Replace:

```tsx
const RANK_STYLES: Record<number, string> = {
  1: 'text-clay-deep',
  2: 'text-muted-foreground',
  3: 'text-rust-deep',
};
```

with (tint bg + ring + readable text — the locked podium ramp):

```tsx
const RANK_STYLES: Record<number, string> = {
  1: 'bg-gold/20 ring-1 ring-gold/50 text-clay-deep',
  2: 'bg-clay/15 ring-1 ring-clay/40 text-clay-deep',
  3: 'bg-rust/15 ring-1 ring-rust/40 text-rust-deep',
};
```

- [ ] **Step 2: Render the chip for top-3, plain number for the rest.** Replace the rank `<span>` (lines 102–109):

```tsx
                <span
                  className={cn(
                    'w-8 font-semibold tabular-nums',
                    RANK_STYLES[entry.rank] ?? 'text-muted-foreground',
                  )}
                >
                  {entry.rank}
                </span>
```

with:

```tsx
                <span className="flex w-8 shrink-0 justify-center">
                  {RANK_STYLES[entry.rank] ? (
                    <span
                      className={cn(
                        'flex size-6 items-center justify-center rounded-full text-xs font-bold tabular-nums',
                        RANK_STYLES[entry.rank],
                      )}
                    >
                      {entry.rank}
                    </span>
                  ) : (
                    <span className="font-semibold tabular-nums text-muted-foreground">
                      {entry.rank}
                    </span>
                  )}
                </span>
```

*(KEEP the `Trophy` header icon `text-clay-deep` at line 65 and the `bg-primary/10 ring-1 ring-primary/20` current-user row highlight — theme/brand tokens.)*

- [ ] **Step 3: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'yellow-[0-9]|amber|zinc|orange|violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|blue-[0-9]|sky-[0-9]|emerald' src/components/challenges/speed-leaderboard.tsx`
Expected: no matches (empty).

- [ ] **Step 4: Build + typecheck.** → green/clean.
- [ ] **Step 5: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/challenges/speed-leaderboard.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: render full podium chips on the speed leaderboard"
git -C /Users/rector/local-dev/core status
```

---

## Part Gate (run after all 12 tasks — do NOT skip)

- [ ] **Unit tests:** `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run` → **398 passing** (387 + 3 tracks + 6 level-tiers + 2 confetti).
- [ ] **Cluster off-palette guard #1 (off-palette Tailwind scales across the 4.5 component surface — precise digit forms):**
  `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'violet|fuchsia|purple|indigo|pink|rose|teal|cyan|slate-[0-9]|stone-[0-9]|orange|blue-[0-9]|sky-[0-9]|yellow-[0-9]|zinc|gray|amber' src/components/leaderboard src/components/credentials src/components/gamification/level-badge.tsx src/components/challenges/speed-leaderboard.tsx src/lib/tracks.ts src/lib/level-tiers.ts 'src/app/[locale]/(platform)/leaderboard'` → **zero**.
- [ ] **Cluster off-palette guard #2 (raw-hex surfaces — confetti + canvas):**
  `rg -n '#[0-9A-Fa-f]{6}' src/components/gamification/confetti-animation.tsx` → exactly the 5 brand hexes. `rg -n '10b981|0d9488|3b82f6|4f46e5|a855f7|7c3aed|f97316|f59e0b|f43f5e|ec4899|6366f1' src/lib/utils/generate-certificate.ts` → zero.
- [ ] **Cluster off-palette guard #3 (kept-semantic audit — emerald/green should appear ONLY where documented):**
  `rg -n 'emerald|22c55e|34, 197, 94' src/components/credentials src/lib/utils/generate-certificate.ts` → expect ONLY: `verification-badge.tsx` (emerald valid state, several lines), `credential-detail.tsx` copy-check (1 line ~176), `share-credential.tsx` copy-check (1 line ~126), `generate-certificate.ts` verify badge (`#22c55e` + `rgba(34, 197, 94, …)`, 2 lines). NO emerald on any track-art surface. Eyeball against this keep-list.
- [ ] **Build + typecheck:** `pnpm build` green · `npx tsc --noEmit` clean.
- [ ] **Visual smoke (prod server, light + dark):** `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && PORT=3000 pnpm start`, Chrome MCP, set `localStorage.theme` per theme + reload. Check:
  - `/en/leaderboard` — PageHeader (gold underline, `text-3xl` title) + width cap; podium 1st gold / 2nd clay / 3rd rust (block fill + avatar ring + Crown/Medal icon + XP label); table medals gold/clay/rust; streak flame clay; sticky-rank bar (scroll) unbroken; error/empty/loading states intact; dark not broken.
  - `/en/challenges` (right column) — speed-leaderboard top-3 podium **chips** (gold/clay/rust circles), rank 4+ plain; Trophy header clay.
  - `/en/credentials/<any-id>` — the error state renders cleanly pre-seed (expected: "Credential Not Found"); if a credential resolves, the hero/gallery art is the DARK track gradient with AA white text. *(Credentials need Phase-5 seeding to populate; verify art mapping via T1 tests + opus review if none render.)*
  - A page rendering `<LevelBadge>` (profile-header / xp-progress-bar) — at minimum the **Newcomer** tier (neutral) renders for a 0-XP wallet; verify the badge ring/border read brand, dark not broken. *(Tiers 2–11 need seeding — verified via T2 tests + opus review.)*
  - The certificate **download** (credential-detail "Download Certificate") triggers a PNG with a dark brand gradient + the kept green verified badge — only testable if a credential resolves; otherwise rely on T1/T8 guards.
- [ ] **e2e (reuse prod server):** with the prod server on :3000, `pnpm exec playwright test --project=chromium` → expect 36/36 (~17s). Infra-block acceptable substitute if the server can't be reused.
- [ ] **Read-only opus review** of the cluster diff (`git -C /Users/rector/local-dev/superteam-academy diff 76babc7..HEAD -- app/`): three duplicated track-gradient maps deleted (credential-detail/gallery/canvas) and replaced by the single `getCredentialTrack` source; `level-badge` TIER_COLORS deleted, driven by `level-tiers.ts`; podium + medals + speed-leaderboard top-3 on the locked gold/clay/rust ramp; confetti = 5 brand hexes; kept-semantic intact (verification-badge emerald/destructive, copy-checks emerald, canvas green verify badge, destructive errors); white-on-art now uses DARK gradients (AA); leaderboard adopts PageHeader; identicon avatars kept; AA holds; theme not broken; import hygiene; no AI attribution.
- [ ] **Update the SDD ledger** `/Users/rector/local-dev/superteam-academy/.git/sdd/progress.md` with the 4.5 result + note that Phase 4 (all 6 clusters 4.0–4.5) is COMPLETE and the remaining items (detail-slug bug, seed/devnet, fresh `RECTOR-LABS/rector-academy` repo) move to Phase 5.

---

## Self-Review (against the master plan + recon)

1. **Master cluster-5 screens:** leaderboard page + podium (T3/T5) · leaderboard rows/medals (T4) · credential detail (T6) · credential gallery (T7) · certificate canvas (T8) · level-badge rarity (T2/T10) · podium ramp (T3) · confetti (T2/T11). ✓ Plus the 4.3-deferred speed-leaderboard full podium chips (T12). ✓
2. **Single-sourcing coverage:** the triplicated `numeric-trackId → gradient` maps (credential-detail + credential-gallery + generate-certificate) collapse into `tracks.ts` `getCredentialTrack`/`artHex` (T1, T6–T8); the 11-tier `TIER_COLORS` map collapses into `level-tiers.ts` (T2, T10). ✓
3. **Locked color systems:** podium 1st gold/2nd clay/3rd rust (T3, T4, T12 — verbatim from master §Locked color systems); rarity ramp 11 tiers warm+pure, no metallics, Legend special (T2 — finalized here as master deferred); confetti cream/gold/sky/leaf/clay only (T11). ✓
4. **White-on-art a11y:** credential/certificate art now uses the DARK `artGradient`/`artHex` (link/clay-deep/rust-deep/brown stops) — fixes the prior white-on-near-cream AA failure; matches the 4.2 `credential-preview` exemplar. ✓
5. **Kept-semantic verified:** verification-badge (emerald/destructive) KEPT entirely; canvas green verify badge KEPT; copy-success checks (credential-detail, share-credential) KEPT; destructive page/error states KEPT. All explicitly out-of-scope and audited by part-gate guard #3. ✓
6. **Page-header decision:** leaderboard adopts `PageHeader` (no hero → courses/challenges pattern), NOT the 4.4 width-cap-only (dashboard/profile had heroes). Documented + justified. ✓
7. **No placeholders:** every code step shows complete code or an exact verbatim find/replace with line refs; every verify step is a runnable command with expected output. ✓
8. **Type consistency:** `getCredentialTrack(trackId?: number): Track` (T1) → consumed as `.artGradient` (T6/T7) and `.artHex` (T8); `levelTierStyle(title: string): { bg; border; text; ring }` (T2) → `tier.bg/border/text/ring` (T10); `Track.artHex.{from,to}` flows T1→T8 destructured as `{ from: start, to: end }`. ✓
9. **Repo-safety** (twin `core`) in every commit step (`git -C` absolute + core-clean check); precise `slate-[0-9]`/`stone-[0-9]`/`sky-[0-9]` guards; `! rg` non-gating noted (eyeball guards). ✓
10. **Right-sized:** 12 independently buildable/guardable/committable tasks (2 TDD modules + 1 confetti TDD + 9 surface edits); each ends with a testable deliverable. ✓
11. **★ RESOLVED (RECTOR, plan approval): BOTH.** level-badge tiers 7–11 distinguished by fill+border+ring escalation AND prestige pips (1..5) — `level-tiers.ts` carries `pips`; `level-badge.tsx` renders a static aria-hidden dot row (T2/T10).
12. **Demo-visibility honesty:** credentials + most level tiers need Phase-5 seeding to render; this cluster verifies those via unit tests + opus review + guards. The leaderboard podium, speed-leaderboard chips, and the Newcomer level badge ARE screenshot-able pre-seed (mock rows / 0-XP default). ✓
