# RECTOR Academy — Phase 5 Design: Demo Polish + Public Launch

**Date:** 2026-06-20
**Status:** Design approved (RECTOR "Lgtm") — pending `writing-plans`
**Base:** branch `chore/rector-academy-revival` HEAD `7732235` (end of Phase 4.5; Phase 4 complete — all 6 Tier-1 clusters done)
**Parent spec:** `2026-06-16-rector-academy-design.md` (§7 Demo Polish, §8 Deployment, §9 Repository, §10 Out of Scope)

---

## 1. Goal

Phase 5 is the **last** phase: turn the bespoke-redesigned RECTOR Academy shell (Phases 1–4) into a polished, public, clickable **demo** at `academy.rectorspace.com`. It is **NOT a redesign cluster** — it is launch logistics + data.

The bar (parent spec §7, "feels real, nothing broken"):

- Zero empty states on every Tier-1 page.
- Zero dead buttons, zero 401s — every nav target resolves.
- Clean browser console.
- **Both themes** (cream light primary + dark secondary) ship pixel-perfect.

---

## 2. Locked decisions (this brainstorm)

| Decision | Choice | Rationale |
|---|---|---|
| **Data / seeding** | **Seed-data demo mode** | Deterministic fixtures, no external infra (no Helius key, no devnet funding, no RPC flakiness), reproducible screenshots, never breaks. The **only** option that can populate credentials — real on-chain minting is out of scope (parent §10). Spec-aligned (§7). |
| **Demo identity** | **Auto-demo identity (no wallet needed)** | Recruiter/peer-facing showcase; most visitors have no Solana wallet. A fixed demo learner is fully populated on load → guarantees "no empty states" for everyone, zero friction. Wallet-connect stays a real devnet adapter (demonstrates the integration) but the demo never depends on it. |
| **Dark mode** | **Include a dark-polish pass** | Meets the Ihsan / 100%-working bar — both themes pixel-perfect. Through Phase 4 dark was kept "not broken" but never bespoke-tuned (classification colors have no `dark:` variants); Phase 5 makes "not broken" → "intentional". |
| **Launch gate** | **Private preview → RECTOR sign-off → then public domain** | Matches parent §8 ("public only at the end") + the established per-phase rhythm. Preview URLs are protectable on this plan tier (proven in the `core` migration). |

---

## 3. Structure & sequencing

Phase 5 decomposes into **5 sub-plans** (`writing-plans` produces one per subsystem), executed **controller-inline** in dependency order. One focused commit per task; RECTOR confirms before any push.

| Order | Sub-plan | Primary skill | Why this position |
|---|---|---|---|
| 1 | **Slug bugfix** — `/courses/{slug}` renders the wrong course (always `solana-101`) on direct URL load | systematic-debugging | Quick, isolated; unblocks visual verification of the gold/clay/rust course `artGradient` heroes/credentials before seeding lands |
| 2 | **Seed-data demo mode + auto-demo identity** | test-driven-development | ★ The big unblocker — makes every earned state from clusters 4.4/4.5 render for the first time |
| 3 | **Demo-gating + console cleanup** | — | Hide OAuth/CMS/minting; resolve the authjs + next-themes #418 console errors; audit for dead buttons / 401s |
| 4 | **Dark-mode polish pass** | — | Audit all ~12 Tier-1 screens in dark; add intentional `dark:` variants for classification/fills |
| 5 | **Fresh repo + domain + deploy** | — | `RECTOR-LABS/rector-academy` repo + Vercel project `rector-academy` + `academy.rectorspace.com` — the final, gated step |

**Branch:** Phase-5 commits continue on `chore/rector-academy-revival` (extending PR #1). The final step pushes the whole branch to the fresh `RECTOR-LABS/rector-academy` repo (the real integration home — PR #1 on `rz1989s/superteam-academy` was always just the working record, never merged).

---

## 4. Seed-mode architecture (the core sub-plan)

A purely **additive** branch at each data seam — the real-mode code paths stay intact and untouched (they continue to degrade gracefully as today).

### 4.1 Flag

- **`NEXT_PUBLIC_DEMO_MODE`** — client+server readable (both API routes and client store/hooks need it). Set `true` on the Vercel `rector-academy` project; default off → "real" mode. (Next inlines `NEXT_PUBLIC_*` at **build** time → it must be present for the build/deploy and for the local visual gate's `pnpm build`, not only at runtime.)
- A single tiny helper `isDemoMode()` (e.g. `src/lib/demo/index.ts`) centralizes the check so the branch is one import everywhere.

### 4.2 Seed fixtures module — `src/lib/demo/seed.ts` (new, single source, unit-tested)

Mirrors the existing `src/lib/sanity/seed-data.ts` precedent (which already seed-drives courses/lessons/challenges). Holds:

- **Demo identity** — a real devnet pubkey (for display + explorer links, never read on-chain), handle/display name, XP total, derived level/title, current streak.
- **Achievements + credentials** for the demo identity (drives the medallions, credential gallery/detail, and certificate canvas).
- **Leaderboard cohort** — the demo identity ranked among ~20 plausible peers so the podium's locked gold/clay/rust 1st/2nd/3rd ramp renders, plus enough rows for the table.

All values AA-safe by construction (they flow through the existing single-source style modules: `tracks.ts`, `level-tiers.ts`, `achievements.ts`, etc.).

### 4.3 Seams that get the demo branch

| Seam | Today | Demo branch |
|---|---|---|
| `src/app/api/profile/[wallet]/route.ts` | Reads on-chain Token-2022 XP via Helius → derives level/title | Returns the seed profile (XP/level/title) |
| `src/app/api/leaderboard/route.ts` | Reads Helius DAS `getTokenAccounts` (else `dasUnavailable:true` empty state) | Returns the seed cohort (ranked) |
| Credentials path (`use-credentials` / `lib/solana/credentials.ts`) | Reads on-chain MPL-Core assets | Returns seed credentials |
| `src/lib/stores/user-store.ts` | Keys the "current learner" off the connected wallet | In demo mode, seeds the current learner as the demo identity → dashboard/profile populate **without a wallet connect** |

### 4.4 Wallet

The wallet adapter stays a **real devnet connection** (functional, demonstrates the integration). The demo's populated state does not depend on it — connecting is optional/cosmetic.

### 4.5 What this unblocks

Once seed mode lands, **all** the cluster-4.4/4.5 earned-state visuals become screenshot-verifiable for the first time: leaderboard live podium (gold/clay/rust), credential viewer + gallery art, circular level-badge earned tiers 7–11 (prestige pips), active streak (clay flame), colored stat values, tinted achievement medallions, and the XP / level-up / lesson-complete toasts + confetti.

---

## 5. Other workstreams (design-level)

- **Slug bugfix (sub-plan 1):** reproduce direct-load `/courses/sec-301` & `/courses/defi-201` (both currently show `solana-101`), trace the slug-resolution / store-hydration defect to root cause, fix, add a regression test. Persisted after full storage clear in 4.2 testing → not a caching artifact.
- **Demo-gating (sub-plan 3):** hide OAuth sign-in (removes the authjs config error), the Sanity/CMS studio route, and on-chain minting/claim controls — gated behind the demo flag or removed from nav. Audit every Tier-1 nav target for dead buttons / 401s (parent §7). GA4 / Clarity / Sentry stay silently disabled (no env vars).
- **Console cleanup (sub-plan 3):** next-themes React #418 hydration (mounted-gate / `suppressHydrationWarning` pattern) + the authjs "server configuration" error (gone once OAuth is gated). Target: clean console on the demo.
- **Dark-polish pass (sub-plan 4):** systematic audit of all ~12 Tier-1 screens in dark mode; add `dark:` variants where classification/fills read "functional" rather than "designed". Keep semantic status tokens (emerald/red pass-fail, amber hints, Monaco chrome). Both themes ship pixel-perfect.

---

## 6. Success criteria & testing

- **Demo bar (parent §7):** zero empty states on every Tier-1 page; zero dead buttons / 401s; clean console; both themes pixel-perfect.
- **Per-sub-plan gate (established rhythm):** `pnpm build` green · `pnpm test:run` (new seed-fixture + API-demo-branch + slug-regression tests) · `playwright --project=chromium` 36/36 (reuses the running prod server on :3000) · per-sub-plan off-palette / demo guards · read-only opus review.
- **Visual gate:** prod-server **built with `NEXT_PUBLIC_DEMO_MODE=true`** (`pnpm build && PORT=3000 pnpm start`) + Chrome MCP, **both themes** — with seed mode on, now finally covering the earned states that were code/test/opus-verified-only through Phase 4.
- **Launch verification:** private preview smoke (all routes 200, console clean, seed data populated, both themes) → RECTOR sign-off → attach public domain → post-cutover live smoke.

---

## 7. Deployment & launch gate

- **Vercel project `rector-academy`** already exists (projectId `prj_XSDC8bwdASqw2SpAkvuvrKiuCDH8`, team `rectors-projects`, 0 deploys). Root directory = `app/`, pnpm.
- **Env (minimal, parent §8):** `NEXT_PUBLIC_DEMO_MODE=true`, `NEXT_PUBLIC_CLUSTER=devnet`, `NEXT_PUBLIC_BASE_URL`. No OAuth / Sanity / signer secrets. (A devnet Helius key is **not required** — seed mode replaces all Helius reads.)
- **Gotcha (from `core` migration):** a fresh Vercel project may default to `framework:None` → 404s on every route. Set `framework:nextjs` then redeploy.
- **Sequencing:** private preview deploys throughout (protectable on this tier via `ssoProtection`); the public domain is attached **only at the end**, after RECTOR's pixel-perfect sign-off in both themes.
- **Domain:** `academy.rectorspace.com` — a CNAME on RECTOR's personal Cloudflare account (zone `3a150ea29cd0cd2c07476dd2cc7b0632`) → Vercel; SSL via Vercel. DNS-only/grey (the `core` migration's proven pattern to dodge the Full-strict cert race).

---

## 8. Repository

- Create a fresh, unarchived **`RECTOR-LABS/rector-academy`** repo; push the de-branded + redesigned `chore/rector-academy-revival` branch as the new `main`. Connect the Vercel project's git integration to it (prodBranch = main).
- The archived `RECTOR-LABS/superteam-academy` (local remote → redirected `rz1989s/superteam-academy`) stays as a historical record.

---

## 9. Out of scope (unchanged from parent §10)

Real auth (OAuth), live Sanity CMS, real on-chain credential minting, the `onchain-academy/` Anchor program deployment, and new course-content authoring. Tier-2 token-reskin pages are not promoted to bespoke Tier-1 in this phase.

---

## 10. Risks / execution notes

- **★ Twin-repo hazard (load-bearing):** the controller cwd is the `core` repo — a structural twin of `superteam-academy` (both Next.js apps with `src/app/globals.css` + a brand `@theme`). All paths absolute; `pnpm` runs from `app/`; before every commit verify `git -C …/superteam-academy rev-parse --show-toplevel` ends in `/superteam-academy`; after every commit `git -C …/core status` must show **no** academy path. `core` is RECTOR's active repo with its own unrelated CV work — never touch it.
- **Seed mode is additive:** it must not alter real-mode behavior. The demo branch sits at the top of each seam and returns early; the existing Helius/on-chain paths remain the `else`.
- **Guard-regex gotchas (carried):** use the `-[0-9]` digit form for color scales whose name is a substring of a real word (`slate-[0-9]`, `stone-[0-9]`); `! rg` is exempt from `set -e` — use explicit `if rg …; then exit 1; fi` verdicts.
- **Durable ledger:** `.git/sdd/progress.md` (untracked, in `.git/`).
- **Commits:** conventional `type: description`, one per task, GPG-signed, **no AI attribution**.

---

**Next:** `writing-plans` → produce the 5 per-subsystem implementation plans under `docs/superpowers/plans/2026-06-20-rector-academy-phase5-*.md`, in the sequence above.
