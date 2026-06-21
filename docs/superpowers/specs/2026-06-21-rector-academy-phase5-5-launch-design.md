# RECTOR Academy — Sub-plan 5.5 Design: The Launch (fresh repo + domain + deploy)

**Date:** 2026-06-21
**Parent spec:** `2026-06-20-rector-academy-phase5-demo-launch-design.md` (§5 Sub-plans, §7 Deployment & launch gate, §Repository). This document **refines and supersedes** that spec's launch-mechanics where they differ (see §2) — the gate, env, and domain decisions from the parent still hold.

---

## 1. Goal

Ship the Phases 1–5.4 RECTOR Academy demo as a **public, clickable portfolio piece** at `academy.rectorspace.com`, served from a **clean, de-branded, non-fork** repo under the RECTOR LABS org. The app is explicitly a *demo* (its own copy says "an interactive portfolio piece from RECTOR LABS, not a live platform"), so production runs with `NEXT_PUBLIC_DEMO_MODE=true`; the on-chain / Helius / Sanity / NextAuth / backend-signer paths stay bypassed by the demo seams added in 5.2–5.3.

## 2. Decisions (RECTOR-approved 2026-06-21) — what this supersedes

| Topic | Parent spec (2026-06-20) | **5.5 decision (this spec)** |
|---|---|---|
| **Repo move** | "push the whole `chore/rector-academy-revival` branch/history as the new `main`" | **Fresh start: single GPG-signed initial commit, NO fork/Superteam history.** The full revival history stays in `rz1989s/superteam-academy` (origin) as the durable backup. |
| **Layout** | keep `app/` subdir; Vercel root directory = `app/` | **Flatten `app/` → repo root.** The Next.js app *is* the repo. Vercel root directory = `.` |
| **Deploy trigger** | connect Vercel git integration (prodBranch = main, auto-deploy) | **CLI deploy to a private PREVIEW first** for controlled gating. Git integration is optional and only connected (by RECTOR) *after* launch, if wanted for ongoing deploys. |
| **Hands-on split** | (unspecified) | On RECTOR's go: **I** create the repo (PRIVATE), push the 1 commit, deploy the private preview. **RECTOR** triggers every outward/irreversible step (flip public, promote to production, Cloudflare DNS, attach domain). |

**Unchanged from the parent:** launch gate = private preview → RECTOR pixel-perfect both-theme sign-off → *then* public domain · `NEXT_PUBLIC_DEMO_MODE=true` on the Vercel project (inlined at build) · domain `academy.rectorspace.com` = CNAME on RECTOR's personal Cloudflare account (zone `3a150ea29cd0cd2c07476dd2cc7b0632`) → Vercel, **DNS-only / grey-cloud** (dodges the Full-strict cert race) · Vercel project `rector-academy` (`prj_XSDC8bwdASqw2SpAkvuvrKiuCDH8`, team `rectors-projects`).

## 3. Build the fresh repo content (local, fully reversible)

Assemble the new tree in a scratch dir (e.g. `/tmp/rector-academy-launch`) from the current `app/` working tree, flattened to root. Nothing mutates the existing repos.

- **Include** (everything the app needs to build + test + run): `src/`, `public/`, `messages/` (i18n), `e2e/`, `scripts/`, `sanity/`, `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `tsconfig.json`, `vitest.config.*`, `playwright.config.*`, `postcss`/`eslint`/`components.json` configs, `.gitignore`, `.env.example`, plus a **fresh RECTOR LABS `README.md`**.
- **Exclude**: `node_modules`, `.next`, `.vercel` (re-link fresh), `.env*` secrets, all git history, and everything outside `app/` — the monorepo `onchain-academy/` (out of scope), `assets/`, and the dev-internal `CLAUDE.md` / `ROADMAP.md` / `STRATEGY.md` / `docs/superpowers/`.
- **README** (RECTOR LABS voice, no emojis, no Superteam references, accurate): what the demo is, the live link, the stack, "interactive portfolio piece / not a live platform", local-dev quickstart.
- **LICENSE (RESOLVED 2026-06-21 by RECTOR):** ship a fresh **`MIT License — Copyright (c) 2026 RECTOR LABS`**, replacing the inherited `MIT © 2026 Superteam Brazil`. The codebase was RECTOR's own ~89%-built bounty work; RECTOR LABS is the de-branded public holder.
- `git init` → stage all → **one** signed commit (`-S`), conventional subject, **zero AI attribution**.
- ★ The flatten is the only structural change. The app already treats `app/` as its root (`process.cwd()` reads `src/`, etc. relative to `app/`), so promoting `app/` to the repo root keeps every path identical — no code edits expected. The build/test gate (§4) proves this.

## 4. Verify before anything leaves the machine

From the flattened root, all green before any push/deploy:
1. `pnpm install` (lockfile honored).
2. `NEXT_PUBLIC_DEMO_MODE=true pnpm build` — green; pins the **minimal env the demo build needs** (expected: just the flag + the public devnet defaults baked in `.env.example`; if the build imports Sanity/anything at module-load that needs a value, capture it here).
3. `pnpm test:run` → 423/423.
4. `NEXT_PUBLIC_DEMO_MODE=true PORT=3000 pnpm start` + `pnpm exec playwright test --project=chromium` → 36/36.
5. Local both-theme smoke (dashboard / a course-detail / leaderboard) — sanity that the flatten didn't break asset/content resolution.

## 5. Deploy — private preview (gated)

- Reuse the `rector-academy` Vercel project. **Set env `NEXT_PUBLIC_DEMO_MODE=true`** on Production + Preview (and `framework: nextjs` — the parent's gotcha: a fresh/misconfigured project can default to `framework:None` → 404s on every route).
- **CLI deploy to a PREVIEW target** (protectable on this plan tier via `ssoProtection`; a production `*.vercel.app` would be public immediately on this tier, so production waits). Root directory = `.`
- Smoke the private preview: all key routes 200, console clean (the external wallet-extension #418 is expected/benign — see 5.3), seed data populated, demo identity (`4WcC…n3SA`, Level 8 / 6,400 XP), `/admin` locked, **both themes**.

## 6. The launch gate (RECTOR triggers the outward steps, in order)

1. *(me, on RECTOR's go)* §3 build + §4 verify → create `RECTOR-LABS/rector-academy` **private** → push the 1 commit → §5 private preview deploy → hand RECTOR the preview URL.
2. **RECTOR** — pixel-perfect sign-off, **both themes**, across all ~12 screens, on the private preview.
3. **RECTOR** — the irreversible public steps (I supply exact commands/records, I do **not** execute them): promote to production → flip the repo **public** → add the `academy` CNAME in Cloudflare (DNS-only/grey) → attach `academy.rectorspace.com` in Vercel (SSL via Vercel).
4. *(me)* post-cutover live verify: `https://academy.rectorspace.com` serves, SSL valid, both themes, demo identity loads, console clean.

## 7. Out of scope (this sub-plan)

Real auth/OAuth, live Sanity CMS, real on-chain credential minting, the `onchain-academy/` Anchor program, new course authoring, and connecting Vercel git-integration for ongoing CI/CD (RECTOR may do that post-launch). The deferred sub-plan-2 nits (peer-profile shows the demo learner's store data; fixed past dates read stale) stay deferred — they don't block a demo launch but can be noted in the README's known-limitations if RECTOR wants.

## 8. Risks / guardrails

- **Public-on-this-tier:** production `*.vercel.app` is public the moment it exists on this plan → never `--prod` before sign-off; preview-only until step 3.
- **Twin-repo hazard:** the controller cwd (`core`) is a structural twin → the scratch tree is built under `/tmp`, all paths absolute, and `core` is verified clean after every action.
- **Path assumptions after flatten:** proven by the §4 build+test+e2e from the new root before any push.
- **DNS:** DNS-only / grey-cloud CNAME (the `core` migration's proven pattern); RECTOR applies it on his personal Cloudflare account.
- **No secrets in the repo:** `.env*` excluded; only `.env.example` (placeholders) ships.
