# Phase 5 · Sub-plan 5 — The Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (CONTROLLER-INLINE — implement yourself, NEVER delegate to subagents; `core` is a structural twin of this repo). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship the Phases 1–5.4 RECTOR Academy demo as a public, clickable portfolio at `academy.rectorspace.com`, served from a fresh, de-branded, non-fork `RECTOR-LABS/rector-academy` repo.

**Architecture:** Export the tracked `app/` subtree (flattened to root via `git archive HEAD:app`) into a scratch dir, add a fresh RECTOR LABS README + MIT LICENSE, make ONE signed commit. Verify the flattened tree builds/tests/e2e's self-sufficiently. Then (on RECTOR's go) create the private repo + push, deploy a **private** Vercel preview, and hand RECTOR the outward/irreversible steps (public, production, DNS, domain) — which he executes and I verify.

**Tech Stack:** Next.js 16.1.6, pnpm 10, Tailwind v4, Vitest + Playwright, Vercel (project `rector-academy`), Cloudflare DNS (RECTOR personal account). Source design: `docs/superpowers/specs/2026-06-21-rector-academy-phase5-5-launch-design.md`.

## Global Constraints

- **Working root:** the source repo is `/Users/rector/local-dev/superteam-academy`; the scratch/launch tree is `/tmp/rector-academy-launch`. The controller cwd is `core` (a structural TWIN) → use **absolute paths** for everything and `git -C <path>` for every git op.
- **★ Twin-repo safety:** after every step, `git -C /Users/rector/local-dev/core status --short` must show NOTHING academy/launch. The source repo's working tree stays clean (we only READ it via `git archive`).
- **De-brand is load-bearing:** the public tree must contain ZERO `superteam` / `solanabr` references and ZERO real secrets (only `.env.example` placeholders). Grep-verified in Task 1.
- **LICENSE (RECTOR-approved):** fresh `MIT License — Copyright (c) 2026 RECTOR LABS` (replaces the inherited `MIT © Superteam Brazil`, which lived only at the old monorepo root and is NOT in the `app/` subtree).
- **Demo deploy:** production runs with `NEXT_PUBLIC_DEMO_MODE=true` (inlined at build → must be set for every build/deploy). The app is a portfolio demo, not a live platform.
- **★ Outward/irreversible steps are RECTOR's:** flipping the repo public, promoting to production, Cloudflare DNS changes, and attaching the domain are executed BY RECTOR. I prepare exact commands + verify after; I never run them.
- **Commits:** conventional `type: description`, GPG-signed (`-S`), **NO AI attribution** (no `Co-Authored-By`, `Claude`, `Generated with`, robot emoji).
- **Plan-tier caveat:** a production `*.vercel.app` is publicly reachable the moment it exists on this Vercel tier → never `--prod` before RECTOR's sign-off; preview-only until Task 5.

## File Structure (the fresh repo, after flatten)

| Path (new repo root) | Source | Notes |
|---|---|---|
| `src/ public/ messages? e2e/ sanity/ scripts/` | `app/*` (tracked) | flattened from `app/` via `git archive` |
| `package.json pnpm-lock.yaml pnpm-workspace.yaml` | `app/*` | workspace = `packages: []` (self-contained) |
| `next.config.ts tsconfig.json vitest.config.ts playwright.config.ts eslint.config.mjs postcss.config.mjs components.json` | `app/*` | configs |
| `sentry.{client,server,edge}.config.ts` | `app/*` | Sentry no-ops without `SENTRY_DSN` (verify in Task 2) |
| `.gitignore .env.example` | `app/*` | `.env.example` = placeholders only |
| `ARCHITECTURE.md` (+ `CMS_GUIDE.md`/`CUSTOMIZATION.md` if kept) | `app/*` | de-brand-clean (grep-verified); keep useful, drop stale-template |
| `README.md` | **NEW** | fresh RECTOR LABS readme (replaces inherited) |
| `LICENSE` | **NEW** | fresh `MIT (c) 2026 RECTOR LABS` |

---

## Task 1: Assemble the de-branded fresh tree (local, fully reversible)

**Files:** Create `/tmp/rector-academy-launch/**` (the flattened tree) + new `README.md` + `LICENSE`. Reads the source repo via `git archive` only — no source mutation.

- [ ] **Step 1: Clean scratch dir + export the flattened tracked tree**

```bash
rm -rf /tmp/rector-academy-launch && mkdir -p /tmp/rector-academy-launch
git -C /Users/rector/local-dev/superteam-academy archive HEAD:app | tar -x -C /tmp/rector-academy-launch
ls -1A /tmp/rector-academy-launch   # expect src/ public/ package.json next.config.ts pnpm-lock.yaml .gitignore .env.example ... ; NO node_modules/.next/.vercel/.env
```

Expected: tracked `app/` contents at the root (the `app/` prefix is stripped by `HEAD:app`); gitignored junk (`node_modules`, `.next`, `.vercel`, `.env`, `playwright-report`, `test-results`, `tsconfig.tsbuildinfo`) is absent because `git archive` only exports tracked files.

- [ ] **Step 2: Write the fresh RECTOR LABS README** (replaces the inherited `README.md`)

```bash
cat > /tmp/rector-academy-launch/README.md <<'EOF'
# RECTOR Academy

An interactive, on-chain developer-education experience for the Solana ecosystem — structured course tracks, in-browser coding challenges, soulbound credential NFTs, XP, levels, and a live leaderboard.

> **This is an interactive portfolio demo by [RECTOR LABS](https://rectorspace.com) — not a live platform.** It runs in demo mode with a seeded sample learner, so you can explore the full experience end to end without a wallet or any on-chain setup.

**Live:** https://academy.rectorspace.com

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · next-intl · Monaco · Vitest · Playwright · Solana web3.js / wallet-adapter. Deployed on Vercel.

## Local development

```bash
pnpm install
pnpm dev            # dev server
pnpm build          # production build
pnpm test:run       # unit tests (Vitest)
pnpm exec playwright test --project=chromium   # e2e (needs a built server on :3000)
```

Demo mode (seed data — no wallet or RPC needed) is gated behind `NEXT_PUBLIC_DEMO_MODE=true`; set it for the build to run the seeded portfolio experience.

## License

[MIT](./LICENSE) © 2026 RECTOR LABS
EOF
```

- [ ] **Step 3: Write the fresh LICENSE**

```bash
cat > /tmp/rector-academy-launch/LICENSE <<'EOF'
MIT License

Copyright (c) 2026 RECTOR LABS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

- [ ] **Step 4: Review the inherited extra docs** — read `CMS_GUIDE.md` and `CUSTOMIZATION.md` in the launch tree; KEEP `ARCHITECTURE.md` (and either) if it's accurate + useful for a public repo, else `rm` the stale-template ones. (All three are de-brand-clean per Task-0 grep, so this is a usefulness call, not a safety one.)

- [ ] **Step 5: Verify clean — zero Superteam, zero secrets**

```bash
cd /tmp/rector-academy-launch
echo "superteam/solanabr refs (expect NONE):"; grep -riE "superteam|solanabr|solana brazil" . --exclude-dir=node_modules || echo "CLEAN"
echo "real env files (expect ONLY .env.example):"; find . -name ".env*" -not -name ".env.example"; echo "(empty above = no secrets)"
echo "license holder:"; grep -i "copyright" LICENSE
```

Expected: `CLEAN`; no `.env*` besides `.env.example`; copyright = RECTOR LABS.

- [ ] **Step 6: Init + single signed commit**

```bash
cd /tmp/rector-academy-launch
git init -b main
git add -A
git -c user.signingkey=BF47B9DC1FA320FA commit -S -m "feat: RECTOR Academy — interactive on-chain developer-education demo"
git log --format="%h %G? %s" -1   # expect one commit, G (good sig)
git -C /Users/rector/local-dev/core status --short   # expect NOTHING (twin clean)
```

---

## Task 2: Verify the flattened tree is self-sufficient

**Files:** none modified — this task proves the flatten didn't break path assumptions and pins the minimal demo-build env.

- [ ] **Step 1: Install from the new root**

```bash
cd /tmp/rector-academy-launch && pnpm install --frozen-lockfile
```
Expected: resolves from `pnpm-lock.yaml`, no missing-workspace errors (workspace is `packages: []`).

- [ ] **Step 2: Demo build (pins the minimal env)**

```bash
cd /tmp/rector-academy-launch && NEXT_PUBLIC_DEMO_MODE=true pnpm build
```
Expected: GREEN. **If it fails on a missing env var** (e.g. a module-load Sanity/Sentry read), record the exact var → it becomes a required Vercel env in Task 4 (demo defaults: the public devnet `NEXT_PUBLIC_PROGRAM_ID`/`AUTHORITY`/`CLUSTER` from `.env.example` are harmless; Sentry no-ops without a DSN). Do NOT add secrets — only the demo flag + any harmless public default the build hard-requires.

- [ ] **Step 3: Unit + e2e gate**

```bash
cd /tmp/rector-academy-launch && pnpm test:run 2>&1 | tail -3      # expect 423/423
NEXT_PUBLIC_DEMO_MODE=true PORT=3000 pnpm start > /tmp/rca-launch-server.log 2>&1 &
for i in $(seq 1 30); do curl -sf -o /dev/null http://localhost:3000/en && break; sleep 1; done
cd /tmp/rector-academy-launch && pnpm exec playwright test --project=chromium 2>&1 | tail -3   # expect 36/36
lsof -ti:3000 | xargs kill 2>/dev/null
```

- [ ] **Step 4: STOP — report the gate to RECTOR.** Present: build green, 423 tests, 36 e2e, the pinned minimal env, and the launch tree manifest. Get RECTOR's explicit "go" before Task 3 (the first step that creates anything off-machine).

---

## Task 3: Create the private repo + push (on RECTOR's "go")

**Files:** none local — creates `RECTOR-LABS/rector-academy` on GitHub (PRIVATE) and pushes the single commit.

- [ ] **Step 1: Create the private repo from the launch tree**

```bash
cd /tmp/rector-academy-launch
gh repo create RECTOR-LABS/rector-academy --private --source=. --remote=origin --description "Interactive on-chain developer-education demo — a RECTOR LABS portfolio piece."
git push -u origin main
```

- [ ] **Step 2: Verify**

```bash
gh repo view RECTOR-LABS/rector-academy --json name,visibility,isFork -q '.name + " | " + .visibility + " | fork=" + (.isFork|tostring)'
# expect: rector-academy | PRIVATE | fork=false
gh api repos/RECTOR-LABS/rector-academy/commits -q 'length'   # expect 1
```

Expected: private, NOT a fork, one commit. (No GitLab mirror — `RECTOR-LABS` org repos mirror only if a workflow is added; this fresh repo has none, and `main` push won't trigger one.)

---

## Task 4: Vercel — env + framework + PRIVATE preview deploy

**Files:** none local — configures + deploys the existing `rector-academy` Vercel project (team `rectors-projects`).

- [ ] **Step 1: Link the launch tree to the existing project**

```bash
cd /tmp/rector-academy-launch
vercel link --yes --scope rectors-projects --project rector-academy
```

- [ ] **Step 2: Set the framework + root + demo env**

```bash
# Root directory is the repo root (flattened) — confirm the project's Root Directory is "" / "." (not "app/").
printf 'true' | vercel env add NEXT_PUBLIC_DEMO_MODE production --scope rectors-projects
printf 'true' | vercel env add NEXT_PUBLIC_DEMO_MODE preview --scope rectors-projects
# + any harmless public default Task 2 Step 2 flagged as build-required (none expected).
```
If the project's **Root Directory** is still `app/` (from the prior link) or **Framework** isn't `Next.js`, fix both in the Vercel dashboard (Project → Settings → General) → Root Directory = `.`, Framework Preset = Next.js. (The parent spec's gotcha: `framework:None` → 404s on every route.)

- [ ] **Step 3: Enable deployment protection (keep the preview private)**

In the Vercel dashboard (Project → Settings → Deployment Protection), enable **Vercel Authentication** (Standard Protection) so preview/deployment URLs require a logged-in team member. This is what makes the preview private on this plan tier. (Custom domains get exempted later, at launch.)

- [ ] **Step 4: Deploy a PREVIEW (never --prod yet)**

```bash
cd /tmp/rector-academy-launch
vercel deploy --scope rectors-projects   # PREVIEW target — prints the preview URL
```

- [ ] **Step 5: Smoke the private preview** — with Chrome MCP (logged into Vercel) or curl-with-auth: key routes return 200, console clean (the external wallet-extension `#418` is expected/benign — sub-plan 3 finding), seed data populated (demo identity `4WcC…n3SA`, Level 8 / 6,400 XP), `/admin` locked, **both themes** render with the 5.4 dark polish. Note anything off.

- [ ] **Step 6: STOP — hand RECTOR the preview URL for his pixel-perfect both-theme sign-off** across all ~12 screens. This is the launch gate. Do NOT proceed to Task 5 without his explicit sign-off.

---

## Task 5: The gated public launch (RECTOR executes; I supply + verify)

**Files:** none — outward/irreversible platform changes. **I prepare the exact commands/records below and verify after; RECTOR runs each.**

- [ ] **Step 1: Promote to production** (RECTOR)

```bash
cd /tmp/rector-academy-launch
vercel --prod --scope rectors-projects   # builds + promotes to the production *.vercel.app
```

- [ ] **Step 2: Flip the repo public** (RECTOR)

```bash
gh repo edit RECTOR-LABS/rector-academy --visibility public --accept-visibility-change-consequences
```

- [ ] **Step 3: Cloudflare DNS — add the `academy` CNAME** (RECTOR, personal Cloudflare account, zone `rectorspace.com` = `3a150ea29cd0cd2c07476dd2cc7b0632`)

- Record: **Type** CNAME · **Name** `academy` · **Target** `cname.vercel-dns.com` · **Proxy** DNS-only (grey cloud) · TTL Auto. (DNS-only/grey is the `core` migration's proven pattern — avoids the Full-strict origin-cert race.)
- Dashboard: rectorspace.com zone → DNS → Add record. (Or the exact `curl` to the CF API — I'll supply it with RECTOR's `CLOUDFLARE` token at execution; DNS edits = his action.)

- [ ] **Step 4: Attach the domain in Vercel** (RECTOR)

```bash
vercel domains add academy.rectorspace.com rector-academy --scope rectors-projects
# then exempt the custom domain from Deployment Protection so the public can reach it
# (Project → Settings → Deployment Protection → "all except custom domains")
```

- [ ] **Step 5: Post-cutover verify** (me)

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://academy.rectorspace.com/en      # expect 200
curl -sI https://academy.rectorspace.com/en | grep -iE "strict-transport|server: Vercel"   # SSL/Vercel
```
Then a Chrome MCP live smoke: `https://academy.rectorspace.com` loads in **both themes**, demo identity populated, key routes work, console clean. Report the live result.

---

## Task 6: Record + handoff

- [ ] **Step 1: Append the 5.5 record to the SDD ledger** `/Users/rector/local-dev/superteam-academy/.git/sdd/progress.md` — the launch facts (new repo, commit, preview URL, production URL, domain, the env set, gate results). Mark **Phase 5 COMPLETE (5/5)**.
- [ ] **Step 2: Update memory** (`rector_academy.md` + `MEMORY.md`): RECTOR Academy is LIVE at `academy.rectorspace.com`; repo `RECTOR-LABS/rector-academy` (public); `rz1989s/superteam-academy` = historical backup.
- [ ] **Step 3: Decide PR #1** with RECTOR — close it (the launch shipped from the fresh repo, as always planned) or leave as the historical working record.

---

## Self-Review (against the 5.5 spec)

- **Fresh single-commit, app/→root, no fork history:** Task 1 (`git archive HEAD:app` flatten + one signed commit) + Task 3 (`--source=.`, verify `isFork=false`, 1 commit). ✓
- **Verify before anything leaves the machine:** Task 2 (install + demo build + 423 tests + 36 e2e + smoke), with a hard STOP for RECTOR's go. ✓
- **Reuse the rector-academy project + demo flag + framework:nextjs:** Task 4 Steps 1–2. ✓
- **Private preview → sign-off → then public:** Task 4 Step 3 (protection) + Step 6 (STOP for sign-off); Task 5 is gated behind it. ✓
- **RECTOR triggers outward/irreversible steps:** Task 5 — every step labelled (RECTOR); I only prepare + verify. ✓
- **LICENSE = MIT © RECTOR LABS:** Task 1 Step 3. ✓
- **De-brand + no secrets:** Task 1 Step 5 grep gate. ✓
- **Domain = DNS-only CNAME on the personal CF zone:** Task 5 Step 3. ✓
- **Out of scope (git-integration CI, real auth/CMS/on-chain):** not in any task. ✓
