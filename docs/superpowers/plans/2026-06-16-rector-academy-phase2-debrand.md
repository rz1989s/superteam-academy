# RECTOR Academy — Phase 2: De-brand (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Nature of this plan:** This is a mechanical **rebrand/refactor**, not new behavior — so it is *verification-gated*, not test-first. Each task ends by (a) keeping the existing suites green (Vitest 364, Playwright e2e chromium 36) and (b) proving the target strings are gone via `rg`. Do NOT write new failing-test-first cycles for string swaps. Task 12 is the global brand-guard gate.

**Goal:** Remove 100% of Superteam intellectual property from the shipped app (`app/`) and rebrand it as **RECTOR Academy**, folded into the RECTOR LABS ecosystem — zero "Superteam" strings remain in `src/` + `public/`, build + tests stay green.

**Architecture:** Find/replace across ~55 files in 12 ordered tasks grouped by concern (i18n → metadata → URLs → shell → landing → UI → certificate/content → storage keys → env/comments → PWA/OG/favicon → package/docs → guard). All 97 refs were inventoried up-front (see "Full Inventory" appendix). No on-chain PDA seeds are touched — every hit is display text, a comment, an env-var name, an external link, or a localStorage key.

**Tech Stack:** Next.js 16.1.6 (App Router, Turbopack), pnpm 10, next-intl (locales `en/pt/es/hi`), Tailwind v4, shadcn/ui, Vitest, Playwright. Repo root `/Users/rector/local-dev/superteam-academy`, deploy root `app/`, branch `chore/rector-academy-revival`.

---

## Brand Reference (use these EXACT values for every replacement)

| Field | Old (Superteam) | New (RECTOR Academy) |
|---|---|---|
| Product name | `Superteam Academy` | `RECTOR Academy` |
| Lowercase/terminal token | `superteam_academy` / `superteam-academy` | `rector_academy` / `rector-academy` |
| Canonical domain | `academy.superteam.fun`, `superteam-academy.rectorspace.com` | `academy.rectorspace.com` |
| GitHub | `github.com/solanabr/superteam-academy` | `github.com/rz1989s` |
| X / Twitter | `x.com/SuperteamBR` | `x.com/RZ1989sol` |
| Parent / ecosystem link | `Superteam` → `superteam.fun` | `RECTOR LABS` → `https://rectorspace.com` |
| localStorage key prefix | `superteam-` | `rector-academy-` |
| Helius env var | `SUPERTEAM_ACADEMY_HELIUS_API_KEY` | `RECTOR_ACADEMY_HELIUS_API_KEY` |
| Brand colors (OG/favicon) | — | cream `#FFF7E1` bg, brown `#3B2C22` ink (RECTOR LABS) |

> **Note on the wordmark:** the "logo" is currently a **text wordmark** (header/footer `<span>`), not an image. Phase 2 keeps it text ("RECTOR Academy"); the bespoke visual design (typography, mark) is finalized in Phase 3 (design system) + Phase 4. Phase 2's favicon/OG are a *functional* rebrand (correct name + RECTOR colors), not final art.

**Per-task loop:** edit → `pnpm build` (from `app/`) stays green → `rg -i superteam <files>` returns nothing for the touched files → relevant unit tests pass → `git add <files> && git commit -m "<conventional msg>"`. One commit per task.

---

## Task 1: De-brand the i18n message catalogs

**Files (Modify):** `app/src/messages/en.json`, `app/src/messages/pt.json`, `app/src/messages/es.json`, `app/src/messages/hi.json`

Exactly two keys per catalog reference the brand (lines 625 `issuer`, 695 `copyright`). Replace "Superteam Academy" with "RECTOR Academy", preserving each language's surrounding words.

- [ ] **Step 1: Edit all four catalogs**

| File:line | Old value | New value |
|---|---|---|
| `en.json:625` | `"Issued by Superteam Academy"` | `"Issued by RECTOR Academy"` |
| `en.json:695` | `"© {year} Superteam Academy. All rights reserved."` | `"© {year} RECTOR Academy. All rights reserved."` |
| `es.json:625` | `"Emitido por Superteam Academy"` | `"Emitido por RECTOR Academy"` |
| `es.json:695` | `"© {year} Superteam Academy. Todos los derechos reservados."` | `"© {year} RECTOR Academy. Todos los derechos reservados."` |
| `pt.json:625` | `"Emitido pela Superteam Academy"` | `"Emitido pela RECTOR Academy"` |
| `pt.json:695` | `"© {year} Superteam Academy. Todos os direitos reservados."` | `"© {year} RECTOR Academy. Todos os direitos reservados."` |
| `hi.json:625` | `"Superteam Academy द्वारा जारी"` | `"RECTOR Academy द्वारा जारी"` |
| `hi.json:695` | `"© {year} Superteam Academy. सर्वाधिकार सुरक्षित।"` | `"© {year} RECTOR Academy. सर्वाधिकार सुरक्षित।"` |

(The `©` shows as `©` in the raw files — keep the existing escape; only change the brand word.)

- [ ] **Step 2: Verify** — `cd app && rg -i superteam src/messages` returns nothing. JSON still valid: `node -e "['en','pt','es','hi'].forEach(l=>JSON.parse(require('fs').readFileSync('src/messages/'+l+'.json')))" && echo OK`.
- [ ] **Step 3: Commit** — `git commit -m "chore: rebrand i18n catalogs to RECTOR Academy"`

---

## Task 2: De-brand page metadata (titles + descriptions)

**Files (Modify):**
- `app/src/app/[locale]/layout.tsx:30-31`
- `app/src/app/[locale]/(marketing)/layout.tsx:10`
- `app/src/app/[locale]/(platform)/layout.tsx:9`
- `app/src/app/[locale]/(admin)/layout.tsx:9`
- `app/src/app/[locale]/(platform)/community/layout.tsx:6`
- `app/src/app/[locale]/(platform)/settings/layout.tsx:6`
- `app/src/app/[locale]/onboarding/layout.tsx:6`
- `app/src/app/[locale]/(platform)/creator/page.tsx:83`
- `app/src/app/api/notifications/route.ts:27`

- [ ] **Step 1: Replace each occurrence** of `Superteam Academy` → `RECTOR Academy` at these exact sites:

| File:line | Context |
|---|---|
| `[locale]/layout.tsx:30` | `default: 'Superteam Academy'` → `default: 'RECTOR Academy'` |
| `[locale]/layout.tsx:31` | `template: '%s \| Superteam Academy'` → `'%s \| RECTOR Academy'` |
| `(marketing)/layout.tsx:10` | `title: 'Superteam Academy'` → `'RECTOR Academy'` |
| `(platform)/layout.tsx:9` | `template: '%s \| Superteam Academy'` → `'%s \| RECTOR Academy'` |
| `(admin)/layout.tsx:9` | `template: '%s \| Admin \| Superteam Academy'` → `'%s \| Admin \| RECTOR Academy'` |
| `(platform)/community/layout.tsx:6` | `…in the Superteam Academy forum.` → `…in the RECTOR Academy forum.` |
| `(platform)/settings/layout.tsx:6` | `Manage your Superteam Academy account…` → `Manage your RECTOR Academy account…` |
| `onboarding/layout.tsx:6` | `Set up your Superteam Academy profile…` → `Set up your RECTOR Academy profile…` |
| `creator/page.tsx:83` | `Create and manage your courses on Superteam Academy` → `…on RECTOR Academy` |
| `api/notifications/route.ts:27` | `title: 'Welcome to Superteam Academy'` → `'Welcome to RECTOR Academy'` |

- [ ] **Step 2: Verify** — `rg -i superteam src/app/'[locale]' src/app/api/notifications` returns nothing.
- [ ] **Step 3: Build gate** — `pnpm build` green.
- [ ] **Step 4: Commit** — `git commit -m "chore: rebrand page metadata to RECTOR Academy"`

---

## Task 3: Fix canonical / base URLs (Superteam domains → academy.rectorspace.com)

**Files (Modify):** `app/src/app/[locale]/sitemap.ts:3`, `app/src/app/robots.ts:4`, `app/src/lib/utils/json-ld.ts:13-29`

- [ ] **Step 1: Replace the base-URL fallbacks and JSON-LD identity**

| File:line | Old | New |
|---|---|---|
| `sitemap.ts:3` | `process.env.NEXT_PUBLIC_BASE_URL ?? 'https://academy.superteam.fun'` | `process.env.NEXT_PUBLIC_BASE_URL ?? 'https://academy.rectorspace.com'` |
| `robots.ts:4` | `process.env.NEXT_PUBLIC_BASE_URL ?? 'https://academy.superteam.fun'` | `process.env.NEXT_PUBLIC_BASE_URL ?? 'https://academy.rectorspace.com'` |
| `json-ld.ts:13` | `name: 'Superteam Academy'` | `name: 'RECTOR Academy'` |
| `json-ld.ts:14` | `url: 'https://superteam-academy.rectorspace.com'` | `url: 'https://academy.rectorspace.com'` |
| `json-ld.ts:17` | `sameAs: ['https://github.com/solanabr/superteam-academy']` | `sameAs: ['https://github.com/rz1989s']` |
| `json-ld.ts:29` | `name: 'Superteam Academy'` | `name: 'RECTOR Academy'` |

- [ ] **Step 2: Verify** — `rg -i 'superteam' src/app/'[locale]'/sitemap.ts src/app/robots.ts src/lib/utils/json-ld.ts` returns nothing.
- [ ] **Step 3: Commit** — `git commit -m "chore: point base/canonical URLs at academy.rectorspace.com"`

---

## Task 4: De-brand the shell — header, footer, mobile nav (wordmark + external links)

**Files (Modify):** `app/src/components/layout/header.tsx:33,37`, `app/src/components/layout/footer.tsx:125,135,210,219-220,251,254`, `app/src/components/layout/mobile-nav.tsx:65`

- [ ] **Step 1: Wordmarks** — replace `Superteam Academy` → `RECTOR Academy` at: `header.tsx:33` (aria-label), `header.tsx:37` (visible text), `footer.tsx:251` (aria-label), `footer.tsx:254` (`<span>` text), `mobile-nav.tsx:65` (visible text).

- [ ] **Step 2: External links** in `footer.tsx` — swap Superteam handles for RECTOR's:

| Line | Old | New |
|---|---|---|
| `125` | `href: 'https://x.com/SuperteamBR'` | `href: 'https://x.com/RZ1989sol'` |
| `135` | `href: 'https://github.com/solanabr/superteam-academy'` | `href: 'https://github.com/rz1989s'` |
| `210` | `href: 'https://github.com/solanabr/superteam-academy'` | `href: 'https://github.com/rz1989s'` |
| `219` | `label: 'Superteam'` | `label: 'RECTOR LABS'` |
| `220` | `href: 'https://superteam.fun'` | `href: 'https://rectorspace.com'` |

- [ ] **Step 3: Verify** — `rg -i superteam src/components/layout` returns nothing. `pnpm build` green.
- [ ] **Step 4: Commit** — `git commit -m "chore: rebrand header/footer/mobile-nav to RECTOR Academy"`

---

## Task 5: De-brand the landing page (partner badge, testimonial, hero, gamification)

**Files (Modify):** `app/src/components/landing/social-proof.tsx:18,51`, `app/src/components/landing/hero-section.tsx:41`, `app/src/components/landing/gamification-preview.tsx:175`

- [ ] **Step 1: Remove the Superteam ecosystem-partner badge** — in `social-proof.tsx`, delete the array entry at line 51: `{ name: 'Superteam', initial: 'ST', gradient: 'from-cyan-400 to-sky-600' },`. First read the full `ECOSYSTEM_PARTNERS` array (≈lines 45-55); keep all non-Superteam partners (Solana, Anchor, etc.) intact — remove only the Superteam object. If removing it leaves a dangling comma, fix it.

- [ ] **Step 2: Testimonial** — `social-proof.tsx:18`: `'Superteam Academy gave me the structured path…'` → `'RECTOR Academy gave me the structured path…'` (only the brand word changes).

- [ ] **Step 3: Hero terminal text** — `hero-section.tsx:41`: `{ text: "superteam_academy ", color: "text-green-400" }` → `{ text: "rector_academy ", color: "text-green-400" }` (keep the trailing space + color).

- [ ] **Step 4: Gamification preview** — `gamification-preview.tsx:175`: visible `Superteam Academy` → `RECTOR Academy`.

- [ ] **Step 5: Verify** — `rg -i superteam src/components/landing` returns nothing. `pnpm build` green.
- [ ] **Step 6: Commit** — `git commit -m "chore: rebrand landing page; remove Superteam partner badge"`

---

## Task 6: De-brand remaining UI display strings (creator, credentials)

**Files (Modify):** `app/src/components/creator/drafts.tsx:69`, `app/src/components/credentials/credential-detail.tsx:75`, `app/src/components/credentials/share-credential.tsx:90`

- [ ] **Step 1: Replace** `Superteam Academy` → `RECTOR Academy` at:

| File:line | Context |
|---|---|
| `creator/drafts.tsx:69` | `…to start teaching on Superteam Academy` |
| `credentials/credential-detail.tsx:75` | `credential.name \|\| 'Superteam Academy Credential'` → `'RECTOR Academy Credential'` |
| `credentials/share-credential.tsx:90` | `Check out my Superteam Academy credential: …` → `Check out my RECTOR Academy credential: …` |

- [ ] **Step 2: Verify** — `rg -i superteam src/components/creator src/components/credentials` returns nothing.
- [ ] **Step 3: Commit** — `git commit -m "chore: rebrand creator + credentials UI strings"`

---

## Task 7: De-brand the certificate generator + challenge content + seed data

**Files (Modify):** `app/src/lib/utils/generate-certificate.ts:178,290`, `app/src/lib/challenges/token-extensions.ts:2997,3145`, `app/src/lib/sanity/seed-data.ts:2`

- [ ] **Step 1: Certificate canvas + filename** — `generate-certificate.ts:178`: `ctx.fillText('SUPERTEAM ACADEMY', …)` → `ctx.fillText('RECTOR ACADEMY', …)`. Line 290: `link.download = \`superteam-certificate-${Date.now()}.png\`` → `\`rector-academy-certificate-${Date.now()}.png\``.

- [ ] **Step 2: Challenge copy** — `token-extensions.ts:2997` and `:3145`: replace `Superteam Academy` → `RECTOR Academy` in the two challenge-description strings (keep the rest of the educational text verbatim).

- [ ] **Step 3: Seed-data comment** — `seed-data.ts:2`: `* Comprehensive CMS seed data for Superteam Academy.` → `* Comprehensive CMS seed data for RECTOR Academy.`

- [ ] **Step 4: Verify** — `rg -i superteam src/lib/utils/generate-certificate.ts src/lib/challenges/token-extensions.ts src/lib/sanity/seed-data.ts` returns nothing. Run the affected unit tests: `pnpm test:run -- token-extensions seed-data 2>&1 | tail -8` (expect pass).
- [ ] **Step 5: Commit** — `git commit -m "chore: rebrand certificate, challenge content, seed data"`

---

## Task 8: Rename internal storage keys + collection IDs (atomic + consistent)

**Files (Modify):** `app/src/lib/stores/user-store.ts:54`, `app/src/lib/stores/__tests__/user-store.test.ts:223,404`, `app/src/components/settings/appearance-settings.tsx:26`, `app/src/components/settings/notification-settings.tsx:16`, `app/src/components/settings/danger-zone.tsx:41`, `app/src/app/[locale]/(platform)/settings/page.tsx:27,104,119`, `app/src/app/[locale]/(platform)/profile/[wallet]/page.tsx:26`, `app/src/lib/services/learning-progress.ts:184,200`

> **Why atomic:** the data-clearing logic uses the `superteam-` prefix (`danger-zone.tsx:41`, `settings/page.tsx:104` do `startsWith('superteam-')`). If keys are renamed but a prefix check is missed, "clear my data" silently breaks. Rename ALL keys AND ALL prefix checks together. This is a fresh demo (no real users) so changing the keys loses no production data.

- [ ] **Step 1: Rename the literal keys** (`superteam-` → `rector-academy-`):

| File:line | Old | New |
|---|---|---|
| `user-store.ts:54` | `'superteam-streak'` | `'rector-academy-streak'` |
| `user-store.test.ts:223` | `'superteam-streak'` | `'rector-academy-streak'` |
| `user-store.test.ts:404` | `'superteam-streak'` | `'rector-academy-streak'` |
| `appearance-settings.tsx:26` | `'superteam-font-size'` | `'rector-academy-font-size'` |
| `notification-settings.tsx:16` | `'superteam-notifications'` | `'rector-academy-notifications'` |
| `settings/page.tsx:27` | `'superteam-profile'` | `'rector-academy-profile'` |
| `profile/[wallet]/page.tsx:26` | `'superteam-profile'` | `'rector-academy-profile'` |
| `settings/page.tsx:119` | `\`superteam-academy-export-${dateStr}.json\`` | `\`rector-academy-export-${dateStr}.json\`` |

- [ ] **Step 2: Update the prefix checks** (`'superteam-'` → `'rector-academy-'`): `danger-zone.tsx:41` and `settings/page.tsx:104` both call `.startsWith('superteam-')` → `.startsWith('rector-academy-')`.

- [ ] **Step 3: Collection IDs** — `learning-progress.ts:184` and `:200`: `collection: 'superteam-academy-v1'` → `collection: 'rector-academy-v1'` (both occurrences).

- [ ] **Step 4: Verify** — `rg -i superteam src/lib/stores src/components/settings src/app/'[locale]'/'(platform)'/settings src/app/'[locale]'/'(platform)'/profile src/lib/services/learning-progress.ts` returns nothing. Run: `pnpm test:run -- user-store learning-progress 2>&1 | tail -8` (expect pass).
- [ ] **Step 5: Commit** — `git commit -m "chore: rename superteam-* storage keys + collections to rector-academy-*"`

---

## Task 9: Rename the Helius env var + de-brand code comments

**Files (Modify):** `app/src/lib/solana/constants.ts:25-35`, `app/.env.example`, `app/src/components/leaderboard/podium-top3.tsx:215`, and doc comments in `app/src/lib/solana/{accounts.ts:21, claim-achievement.ts:12, enrollment.ts:13,56, events.ts:2, program.ts:6, idl/onchain-academy-types.ts:5}`

> The `rector-academy` Vercel project has **no env vars set yet**, so renaming the Helius var now is free (nothing to migrate). When the key is eventually added, use the new name.

- [ ] **Step 1: Rename the env var** everywhere — `SUPERTEAM_ACADEMY_HELIUS_API_KEY` → `RECTOR_ACADEMY_HELIUS_API_KEY` and `NEXT_PUBLIC_SUPERTEAM_ACADEMY_HELIUS_API_KEY` → `NEXT_PUBLIC_RECTOR_ACADEMY_HELIUS_API_KEY`:
  - `constants.ts:25,26,31(comment),34,35`
  - `.env.example` (the two lines `NEXT_PUBLIC_SUPERTEAM_ACADEMY_HELIUS_API_KEY=` and `SUPERTEAM_ACADEMY_HELIUS_API_KEY=`, plus the `# Falls back to …` comment)
  - `podium-top3.tsx:215` user-facing error: `…Set NEXT_PUBLIC_SUPERTEAM_ACADEMY_HELIUS_API_KEY in your environment.` → `…Set NEXT_PUBLIC_RECTOR_ACADEMY_HELIUS_API_KEY…`

- [ ] **Step 2: De-brand doc comments** — replace `Superteam Academy` → `RECTOR Academy` in the JSDoc/comment lines: `accounts.ts:21`, `claim-achievement.ts:12`, `enrollment.ts:13`, `enrollment.ts:56`, `events.ts:2`, `program.ts:6`, `idl/onchain-academy-types.ts:5`.

- [ ] **Step 3: Verify** — `rg -i superteam src/lib/solana src/components/leaderboard/podium-top3.tsx .env.example` returns nothing. `pnpm build` green.
- [ ] **Step 4: Commit** — `git commit -m "chore: rename Helius env var + rebrand solana code comments"`

---

## Task 10: De-brand PWA assets, favicon, and OG image

**Files (Modify):** `app/public/manifest.json:2`, `app/public/offline.html:7,129`, `app/public/sw.js:1`, `app/src/app/icon.svg`, `app/public/icons/icon.svg`, `app/src/app/[locale]/opengraph-image.tsx:4,55`

- [ ] **Step 1: PWA text** — `manifest.json:2` `"name": "Superteam Academy"` → `"RECTOR Academy"` (also set `"short_name"` to `"RECTOR Academy"` if present). `offline.html:7` `<title>Offline — Superteam Academy</title>` → `RECTOR Academy`; `offline.html:129` `<div class="brand">Superteam Academy</div>` → `RECTOR Academy`. `sw.js:1` comment → `/// Service Worker — RECTOR Academy PWA` (if `sw.js` defines a cache name containing `superteam`, rename it too — re-grep `sw.js` after editing).

- [ ] **Step 2: OG image** — `opengraph-image.tsx:4` `export const alt = 'Superteam Academy - Learn Solana Development'` → `'RECTOR Academy - Learn Solana Development'`; `:55` rendered `Superteam Academy` → `RECTOR Academy`. Read the full file and retheme the inline styles toward RECTOR colors where trivial (background → cream `#FFF7E1`, primary text → brown `#3B2C22`). Full bespoke OG art is Phase 3/4 — keep this change minimal + on-brand.

- [ ] **Step 3: Favicon** — replace the contents of BOTH `app/src/app/icon.svg` and `app/public/icons/icon.svg` with a simple RECTOR Academy mark (brown `#3B2C22` on cream `#FFF7E1`). Starter SVG (refine in Phase 3):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="7" fill="#3B2C22"/>
  <text x="16" y="22" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="700" fill="#FFF7E1" text-anchor="middle">R</text>
</svg>
```

- [ ] **Step 4: Verify** — `rg -i superteam public src/app/icon.svg src/app/'[locale]'/opengraph-image.tsx` returns nothing. `pnpm build` green (the `/icon.svg`, `/[locale]/opengraph-image`, `/robots.txt`, manifest routes all build).
- [ ] **Step 5: Commit** — `git commit -m "chore: rebrand PWA manifest, offline page, favicon, OG image"`

---

## Task 11: Rename the package + de-brand docs; delete the bounty artifact

**Files (Modify):** `app/package.json:2`, root `README.md`, `app/README.md`, `app/CUSTOMIZATION.md`, `app/ARCHITECTURE.md`, `app/CMS_GUIDE.md`. **Delete:** `app/docs/plans/2026-02-28-bounty-100-percent.md`.

- [ ] **Step 1: Package name** — `app/package.json:2` `"name": "app"` → `"name": "rector-academy"`.

- [ ] **Step 2: Delete the bounty artifact** — `git rm app/docs/plans/2026-02-28-bounty-100-percent.md` (residual Superteam Brazil bounty plan; spec §4 "scrub residual bounty artifacts"). Then re-grep `app/docs` for any other `superteam`/`bounty` plan docs and remove/clean them.

- [ ] **Step 3: README rewrite** — rewrite the root `README.md` to describe **RECTOR Academy** (a Solana learning platform demo in the RECTOR LABS ecosystem → `academy.rectorspace.com`). Remove every "Superteam"/"Superteam Brazil"/bounty mention. Keep accurate tech-stack + run instructions.

- [ ] **Step 4: Dev docs** — in `app/README.md`, `app/CUSTOMIZATION.md`, `app/ARCHITECTURE.md`, `app/CMS_GUIDE.md`, replace `Superteam Academy` → `RECTOR Academy` and remove Superteam Brazil / bounty / partner references. (These are internal docs — a straight find/replace of the brand name + deletion of bounty paragraphs is sufficient.)

- [ ] **Step 5: Verify** — `rg -i 'superteam\|bounty' README.md app/README.md app/CUSTOMIZATION.md app/ARCHITECTURE.md app/CMS_GUIDE.md app/docs` returns nothing (or only unavoidable history you explicitly decide to keep — default zero).
- [ ] **Step 6: Commit** — `git commit -m "chore: rename package to rector-academy; rebrand docs; remove bounty artifact"`

---

## Task 12: Global brand-guard + full verification gate

**Files:** none (verification only)

- [ ] **Step 1: Zero-Superteam guard (the spec's hard requirement)** — from repo root:

```bash
cd /Users/rector/local-dev/superteam-academy
rg -i 'superteam' app/src app/public app/package.json app/.env.example app/README.md README.md app/CUSTOMIZATION.md app/ARCHITECTURE.md app/CMS_GUIDE.md app/docs
```
Expected: **no output** (exit 1 = "no matches" = success). Any hit must be resolved before completing the phase.

- [ ] **Step 2: Full build** — `cd app && pnpm build` → `✓ Compiled successfully`, 44 routes, no errors.
- [ ] **Step 3: Unit tests** — `pnpm test:run 2>&1 | tail -6` → **364 passed** (same as Phase 1 baseline; storage-key + content edits updated their tests in Tasks 7-8).
- [ ] **Step 4: e2e** — `pnpm exec playwright test --project=chromium --reporter=line 2>&1 | tail -6` → **36 passed** (selectors that asserted "Superteam Academy" wordmark, if any, were updated; if an e2e asserts the brand text, update it to "RECTOR Academy" and note it).
- [ ] **Step 5: Visual smoke** — start `pnpm dev`, load `/en`, confirm header/footer/hero now read "RECTOR Academy" and no "Superteam" is visible; stop the server.
- [ ] **Step 6: No commit** (verification only). If Steps 3-4 required test edits, those were committed within their tasks.

---

## Done criteria
- `rg -i superteam` over `app/src`, `app/public`, package, env, and docs returns **zero** matches.
- Header/footer/hero/OG/favicon/metadata all read **RECTOR Academy**; external links point to RECTOR's GitHub/X + rectorspace.com; canonical URLs use `academy.rectorspace.com`.
- Superteam ecosystem-partner badge removed; bounty artifact deleted.
- `pnpm build` green; Vitest **364**; e2e chromium **36**.
- No on-chain seeds or program IDs changed (out of scope); behavior identical apart from brand.

---

## Self-review (run against spec §4 before executing)
- **Spec: rename across UI + en/pt/es i18n + title/metadata + package.json + README** → Tasks 1,2,4,5,6,7,11 (+ caught the 4th locale `hi`). ✅
- **Spec: remove Superteam logo/partner badges/marks + add RECTOR wordmark** → Task 4 (wordmark), Task 5 (partner badge), Task 10 (favicon/OG). ✅
- **Spec: strip Superteam Brazil / partner / bounty copy** → Task 4 (SuperteamBR/solanabr/superteam.fun links), Task 11 (bounty doc + doc copy). ✅
- **Spec: new OG image + favicon** → Task 10. ✅
- **Spec: scrub residual bounty artifacts** → Task 11 Step 2. ✅
- **Beyond spec (correctness):** base-URL fallbacks pointed at `academy.superteam.fun` (Task 3); Helius env var + localStorage keys carried "superteam" (Tasks 8-9) — included for a true zero-Superteam result.

---

## Appendix — Full Inventory (97 refs, captured 2026-06-16)
All `superteam` refs in `src/` + `public/` are addressed by Tasks 1-10; docs by Task 11. Source of truth for the guard is Task 12 Step 1. Notable non-display hits that are NOT PDA seeds (safe to rename): `constants.ts` (env var names), `solana/*.ts` (doc comments only), `learning-progress.ts` (collection id string), `*-store.ts`/settings (localStorage keys). `NEXT_PUBLIC_PROGRAM_ID`/`NEXT_PUBLIC_AUTHORITY` in `.env.example` are program addresses (NOT brand — leave them).
```

> **Carry-over from Phase 1 (do NOT lose):** the spec/old-handoff say "Next.js 15" — it's actually **16.1.6**; fix that string when you touch the spec. The `middleware`→`proxy` rename and the `AUTH_SECRET` (`NEXTAUTH_SECRET`) for hiding OAuth are **Phase 3/Phase 5** items, not Phase 2.
