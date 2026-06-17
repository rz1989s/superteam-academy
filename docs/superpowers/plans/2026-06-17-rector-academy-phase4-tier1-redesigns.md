# RECTOR Academy — Phase 4: Tier-1 Bespoke Redesigns (MASTER PLAN)

> **For agentic workers:** This is the **master plan**. It defines the shared Phase-4 **design language**, the page **ordering**, and the **global gates**. Do NOT execute this file directly — execute the **sub-plans** it links, each via `superpowers:subagent-driven-development`, applying `superpowers:frontend-design` per page. Every sub-plan inherits this file's Global Constraints and Design Language verbatim.

**Goal:** Give the ~11 visitor-facing Tier-1 screens genuine bespoke layout / composition / hierarchy redesigns to the rectorspace.com aesthetic — NOT color swaps (Phase 3 already did the token layer) — so RECTOR Academy reads as a polished RECTOR LABS portfolio piece end-to-end.

**Architecture:** One shared **design language** (this doc) → a **foundation sub-plan** (a single `tracks` module, two brand tokens, a shell redesign, and two reusable layout primitives) that lands first → **per-cluster page sub-plans** that consume the foundation. The token layer (cream/brown + JetBrains Mono, light default) and the Tier-2 sweep are already complete on this branch.

**Tech Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript strict · Tailwind v4 (CSS-first `@theme`, no config file) · shadcn/ui · next-themes · next-intl (en/pt/es/hi) · Vitest · Playwright · pnpm. Canonical design reference: the `core` repo at `/Users/rector/local-dev/core` (`src/app/globals.css` `@theme` + `docs/DESIGN_SYSTEM.md`).

**Session scope (RECTOR, 2026-06-17):** Author the master + **foundation** + **landing** sub-plans now (Option B). Landing is the exemplar that validates the design language on a real page before the remaining clusters are planned. Execution happens in later sessions after RECTOR's OK.

---

## Global Constraints (every sub-plan + task inherits these)

- **Working root:** all `pnpm`/path-relative commands run from `app/` (the deploy root; there is no root `package.json`). Paths below are relative to `app/` unless they start with `docs/`.
- **Branch:** `chore/rector-academy-revival` (NOT main). Do NOT merge — final integration is a fresh `RECTOR-LABS/rector-academy` repo in Phase 5. HEAD at plan time: `a47c111`.
- **Palette (RECTOR LABS):** cream `#FFF7E1` (bg) · brown `#3B2C22` (text) · sky `#41CFFF` · warm-yellow/gold `#F9C846` · clay `#E58C2E` · leaf-green `#A8E063` · muted-red `#C75A44`.
- **WCAG-AA readable-text tokens (light/cream surface):** `--color-link #0D7390` (5.07:1) · `--color-green-deep #3C6A12` (6.02:1) · `--color-clay-deep #8A4A12` (6.40:1). Phase 4 ADDS `--color-rust #C75A44` (decorative) + `--color-rust-deep` (AA-verified readable muted-red). The **bright** sky/leaf/clay/gold/rust tokens are **decorative fills only** (backgrounds, borders, rings, chart cells); readable text on cream uses the `-deep`/`link` tokens.
- **Brand-token naming rule (load-bearing):** brand `@theme` token names must NOT collide with Tailwind's default color scales. Approved: `cream`, `brown`, `skyblue`, `clay`, `leaf`, `gold`, `rust`, `link`, `green-deep`, `clay-deep`, `rust-deep`. **NEVER** define `--color-sky`, `--color-yellow`, `--color-red`, `--color-green` (each overrides an entire Tailwind scale the app still uses). Brand muted-red is the named `rust`/`rust-deep` tokens — never `--color-red`.
- **Theme:** light cream is primary; dark (dark-brown/cream) is the retained secondary. Bespoke-tune **light**; **verify dark is not broken** each task (semantic tokens keep it working); deep dark-mode polish is deferred to Phase 5. Never ship a redesign that breaks dark.
- **Locked design decisions (RECTOR, 2026-06-17):**
  1. **Track colors → warm brand remap**, defined ONCE and inherited everywhere: Core=sky, DeFi=gold, NFT=clay, Security=muted-red. (Drop all purple/violet/indigo/teal/pink track gradients.)
  2. **Gamification → warm ramp, palette-pure** (no metallics): rarity ramps across brown→leaf→sky→clay→gold→rust; podium = gold / clay / muted-red; confetti = cream/gold/sky/leaf/clay only.
- **Keep semantic STATUS colors — do NOT sweep:** test pass/fail (emerald/red), lesson-complete checkmark (emerald), admonitions (tip=emerald, warning=amber, info=blue), verification badge (emerald/destructive). These carry meaning. (Difficulty, track, and rarity DO go brand — they are classification, not status.)
- **Keep as-is:** Monaco/VS-Code editor chrome (`#1e1e1e`/`#252526`/`#d4d4d4`/`#007acc`); the footer's Solana-wordmark SVG gradient; seed-data track hexes (`#9945FF`/`#14F195`/`#FFD700`/`#FF6B6B`) and `public/images/courses/*.svg` (content/demo — Phase 5).
- **Icons:** Lucide React only. **No Unicode emoji as UI icons** (global RECTOR rule), even though rectorspace.com prose uses emoji accents.
- **Commits:** conventional (`type: description`), **one focused change per task**, **NO AI attribution** (no `Co-Authored-By`, no "Claude"/"Generated with"). GPG-signed automatically.
- **No shortcuts:** production-grade, edge cases + a11y AA + loading/error states preserved, verify before claiming done.
- **zsh path quoting:** quote any command path containing `[locale]`, `(marketing)`, `(platform)`, `(admin)` (e.g. `rg pat 'src/app/[locale]'`). Unquoted, zsh globs the brackets/parens and aborts with `no matches found`.
- **Per-task gate:** `pnpm build` stays green + the task's named guard grep returns its expected result. **Plan gate** (end of each sub-plan): `pnpm test:run` = **366 passing** · `pnpm exec playwright test --project=chromium` = **36 passing** · visual smoke. ★ e2e GOTCHA: the Turbopack `pnpm dev` webServer cold-starts slowly and times out if hammered — run e2e **once from a clean slate**: `pkill -f 'next dev'; pkill -f 'next-server'; lsof -ti:3000 | xargs kill -9` first, then a single run. For visual verification prefer Chrome MCP against ONE pre-warmed `pnpm dev`.

---

## The Phase-4 Design Language (the shared contract — every page obeys this)

This is the antidote to "N agents invent N looks." Every page sub-plan applies these recipes.

### Source tokens (defined in `app/src/app/globals.css`)
| Purpose | Token / class | Value |
|---|---|---|
| Page background | `bg-background` / `bg-cream` | `#FFF7E1` |
| Primary text / headings | `text-foreground` / `text-brown` | `#3B2C22` |
| Muted text (AA) | `text-muted-foreground` | `#76695B` (4.98:1) |
| Card surface | `bg-card` | `#FFFDF6` |
| Readable cyan / links | `text-link` | `#0D7390` (5.07:1) |
| Readable green stat text | `text-green-deep` | `#3C6A12` (6.02:1) |
| Readable gold/amber badge text | `text-clay-deep` | `#8A4A12` (6.40:1) |
| Readable muted-red text (NEW) | `text-rust-deep` | AA-verified in foundation |
| Decorative fills | `bg-skyblue` `bg-gold` `bg-clay` `bg-leaf` `bg-rust` | bright brand hexes |
| Section-divider accent | `border-gold` | `#F9C846` |

### Typography (mono-only — hierarchy by size/weight/color, never font family)
- Single family: JetBrains Mono (`font-sans` already maps to it). Headings, body, code, labels all mono.
- Page H1 `text-3xl sm:text-4xl font-bold tracking-tight`; section H2 `text-2xl sm:text-3xl font-bold`; card title `text-base`–`text-lg font-semibold`; body `text-sm`–`text-base` with relaxed leading; eyebrow/label `text-xs font-medium uppercase tracking-wider text-muted-foreground`.
- Wallet addresses / code / numeric stats: keep mono (already are).

### Spacing & rhythm
- Section vertical rhythm `py-16 md:py-24` (marketing) / `space-y-8` between dashboard blocks. Container `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` (via `<PageContainer>`); reading-width prose `max-w-3xl`.
- Radius: cards `rounded-lg` / `rounded-xl`; pills `rounded-full`. 8px spacing grid.

### Recipes (concrete Tailwind — use verbatim)
- **Brand card** (replaces generic shadcn card where a warm card is wanted): `rounded-lg border-2 border-brown/10 bg-card transition-all duration-200 hover:border-skyblue/30 hover:shadow-md`. Optional motion accent on list rows: `hover:translate-x-1`.
- **Tinted badge** (always tint-bg + readable-deep text): gold `bg-gold/20 text-clay-deep`; cyan/info `bg-skyblue/10 text-link`; green `bg-leaf/20 text-green-deep`; muted-red `bg-rust/15 text-rust-deep`; neutral `bg-muted text-muted-foreground`. All `rounded-full px-2.5 py-0.5 text-xs font-semibold`.
- **Section divider** (rectorspace signature): `<div className="my-12 border-t-2 border-gold/60" />` (or `border-gold` at full strength between major marketing sections).
- **Stat counter:** value `text-3xl font-bold text-green-deep` (or `text-foreground` when not a "success/earned" number) + label `text-sm text-muted-foreground`. Keep numbers `tabular-nums`.
- **Section header / eyebrow:** a Lucide-icon eyebrow chip `inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground` above an H2; left-aligned or centered per page.
- **Page header:** use `<PageHeader title description? eyebrow? icon? actions? />` (foundation primitive) — do NOT hand-roll `<h1>` blocks per page.
- **Page container:** wrap page content in `<PageContainer>` (foundation primitive; `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`). Full-bleed pages (lesson split view) opt out.

### Locked color systems
**Tracks** (single source `src/lib/tracks.ts` — every consumer imports it):
| id | slug | name | Lucide icon | accent | badge class | tint gradient (no text) |
|----|------|------|-------------|--------|-------------|--------------------------|
| 1 | solana-core | Solana Core | `Blocks` | skyblue | `bg-skyblue/10 text-link` | `from-skyblue/20 to-skyblue/5` |
| 2 | defi | DeFi | `Coins` | gold | `bg-gold/20 text-clay-deep` | `from-gold/20 to-gold/5` |
| 3 | nft | NFT & Metaplex | `Image` | clay | `bg-clay/15 text-clay-deep` | `from-clay/20 to-clay/5` |
| 4 | security | Security | `Shield` | rust | `bg-rust/15 text-rust-deep` | `from-rust/15 to-rust/5` |

For credential/certificate **art that overlays white text**, a track's *dark* art-gradient (AA-safe, dark stops) is defined in the credentials sub-plan (e.g. Core `from-link to-brown`) — NOT the light tint above.

**Difficulty** (classification → brand): Beginner `bg-leaf/20 text-green-deep` · Intermediate `bg-gold/20 text-clay-deep` · Advanced `bg-rust/15 text-rust-deep`.

**Rarity ramp** (11 tiers, warm + pure — principle; finalized in the gamification sub-plan): hue anchors 1 Newcomer = neutral (`bg-muted`), 2 Explorer = leaf, 3 Builder = skyblue, 4 Developer = clay, 5 Engineer = gold, 6 Architect = rust; tiers 7–11 escalate by **fill intensity + ring + pip count** (warm hues are close together by design), top tier "Legend" = gold + cream inlay + a subtle (reduced-motion-safe) ring. No metallics.

**Leaderboard podium:** 1st `bg-gold/20 ring-gold/50 text-clay-deep` · 2nd `bg-clay/15 ring-clay/40 text-clay-deep` · 3rd `bg-rust/15 ring-rust/40 text-rust-deep`.

### a11y rules (non-negotiable)
- **White text on a gradient needs DARK stops** (≥3:1 for large text/icons): brown / clay-deep / link / green-deep / rust-deep are safe with white; **clay / gold / skyblue / leaf are NOT** (too light). Several current `from-primary to-accent` gradients put white text on a near-cream stop — these MUST be fixed to dark stops.
- Readable text on cream uses the `-deep`/`link` tokens; AA ≥4.5:1 normal, ≥3:1 large.
- Preserve focus-visible rings, `aria-*`, and the `prefers-reduced-motion` guard (already in globals.css) for any new animation.

### Keep-as-is (do not "rebrand")
Monaco editor chrome; footer Solana wordmark SVG; semantic status colors (above); seed-data hexes + course SVGs (Phase 5).

---

## Page ordering & sub-plans

| # | Cluster | Screens | Sub-plan | Status |
|---|---------|---------|----------|--------|
| **0** | **Foundation** | tracks module · `rust` tokens · shell (header/sidebar/footer/mobile-nav) · `PageHeader` + `PageContainer` | `docs/superpowers/plans/2026-06-17-rector-academy-phase4-0-foundation.md` | ★ THIS SESSION |
| **1** | **Landing** | marketing page + 7 landing sections | `docs/superpowers/plans/2026-06-17-rector-academy-phase4-1-landing.md` | ★ THIS SESSION |
| 2 | Courses + Lessons | courses index · course detail · lesson view | `…-phase4-2-courses-lessons.md` | planned (later) |
| 3 | Challenges | daily · library · per-course solver | `…-phase4-3-challenges.md` | planned (later) |
| 4 | Dashboard + Profile | dashboard · profile (+ `/[wallet]`) · credential gallery · skill-radar | `…-phase4-4-dashboard-profile.md` | planned (later) |
| 5 | Leaderboard + Credentials | leaderboard · credential detail · certificate canvas · level-badge rarity · podium · confetti | `…-phase4-5-leaderboard-credentials.md` | planned (later) |

**Ordering rationale:** Foundation first (unblocks the track/shell/primitives everything else consumes). Landing next — it is the public showcase, exercises the most shared recipes, and is fully self-contained (no wallet/store dependency), so it validates the design language with the least risk. Clusters 2–5 are planned in later sessions after the landing look is confirmed. Within the deferred clusters, the route reality found in recon holds: `certificates/[id]` is a 308 redirect into the credential detail page; there is no `/credentials` index (the gallery lives in dashboard/profile).

---

## Global acceptance gate (whole phase — checked when all clusters are done)
- `pnpm build` green; `pnpm test:run` 366+; `pnpm exec playwright test --project=chromium` 36 (clean-slate run).
- Off-palette residue across all Tier-1 surfaces returns **zero** (per-cluster guards aggregated), EXCLUDING the documented keep-list.
- Every Tier-1 page rendered in Chrome MCP (light + dark) reads cream/brown RECTOR-branded with intentional composition; AA verified on all text + white-on-gradient.
- No dead buttons / 401s on Tier-1 nav targets (carries into Phase-5 demo polish).

## Self-Review (master)
- **Spec §6 coverage:** all 12 listed screens mapped to clusters 1–5 (certificates folds into cluster 5 per recon; credentials index does not exist). ✓
- **Locked-decision coverage:** track remap (Design Language + foundation tracks.ts) · gamification warm-pure (Design Language + cluster 5) · light-primary/dark-secondary (Global Constraints). ✓
- **Appendix-A deferred accents:** each listed component falls inside a cluster sub-plan that redesigns its page. ✓
- **Naming consistency:** brand token names used here match Phase-3 + the foundation additions (`rust`, `rust-deep`); no Tailwind-scale collisions. ✓
