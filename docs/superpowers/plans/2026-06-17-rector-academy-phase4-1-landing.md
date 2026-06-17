# RECTOR Academy — Phase 4.1: Landing Page Bespoke Redesign (SUB-PLAN / EXEMPLAR)

> **For agentic workers:** REQUIRED SUB-SKILL — implement task-by-task via `superpowers:subagent-driven-development`. **Apply `superpowers:frontend-design` on every task** (these are composition redesigns, not color swaps). Steps use checkbox (`- [ ]`). Inherits the master plan's Global Constraints + Design Language verbatim: `docs/superpowers/plans/2026-06-17-rector-academy-phase4-tier1-redesigns.md`. **Depends on Phase 4.0 foundation being merged first** (uses `tracks.ts`, `rust` tokens, the brand recipes).

**Goal:** Redesign the public marketing landing (`(marketing)/page.tsx` + its 7 section components) into a bespoke, warm, mono-first rectorspace.com page — fixing real a11y defects (white/clip text on near-cream gradient stops), removing all off-palette accents, and adopting the track/difficulty systems + gold-divider rhythm — so the landing validates the whole Phase-4 design language before the remaining clusters are planned.

**Architecture:** Each section component is redesigned in its own task (independent, testable by build + guard + visual). The marketing page composition (section rhythm + gold dividers) is the final task. Landing is `'use client'` sections with hardcoded demo content (no store/wallet dependency) — it renders fully out of the box, which is why it's the lowest-risk exemplar.

**Tech Stack:** as master.

## Constraints (landing-specific; rest inherit from master)
- **No new dependencies; no copy rewrites** beyond the honesty fix flagged in Task 6. Keep all `useTranslations` keys and the `generateMetadata`/JSON-LD wiring intact.
- **a11y is the headline defect here:** several sections use `from-primary to-accent` gradients — `--primary` is brown (dark) and `--accent` is `#F3E9CC` (near-cream, very light). White text or `bg-clip-text` on the near-cream stop fails WCAG. Every such gradient MUST move to **dark stops** (brown / link / clay-deep / rust-deep) per the master's a11y rule, or to solid `text-foreground`.
- **Migrate track colors to `tracks.ts`** (Task 2, Task 4) — do not reintroduce hardcoded track hues.
- Per-task gate: `pnpm build` green + the file's off-palette guard returns zero. Part gate: full test 366 · e2e 36 · visual (light + dark).

---

## File Structure (all under `src/`)
- Modify `app/[locale]/(marketing)/page.tsx` — section rhythm + gold dividers (Task 8).
- Modify `components/landing/hero-section.tsx` (Task 1).
- Modify `components/landing/featured-courses.tsx` (Task 2 — adopts `tracks.ts`).
- Modify `components/landing/how-it-works.tsx` (Task 3).
- Modify `components/landing/tracks-overview.tsx` (Task 4 — adopts `tracks.ts`).
- Modify `components/landing/gamification-preview.tsx` (Task 5).
- Modify `components/landing/social-proof.tsx` (Task 6).
- Modify `components/landing/cta-banner.tsx` (Task 7).

---

### Task 1: Hero — readable headline, true-dark terminal, AA badges

**Files:** Modify `components/landing/hero-section.tsx`. Apply frontend-design.

**Off-palette / a11y defects to fix (exact):**
| Location | Current | Problem | Fix |
|---|---|---|---|
| H1 (L182) | `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent` | brown→near-cream clip text; the tail is invisible on cream | `text-foreground` (frontend-design MAY apply a dark-stop gradient `from-brown to-link` to one emphasized span only — AA-verified) |
| Terminal card (L246) | `bg-card` (≈ cream) holding light syntax tokens | light syntax on a light card = unreadable in light mode | make the terminal a **true dark surface** `bg-brown` (`#3B2C22`) so cream/bright syntax reads (matches rectorspace code blocks) |
| Syntax tokens (L30–116) | `text-purple-400` / `text-blue-400` / `text-green-400` / `text-yellow-400` / `text-foreground/70` | off-palette + only legible on dark | on the dark terminal remap to brand decorative on-dark: keywords `text-skyblue`, idents/fn `text-gold`, strings/ok `text-leaf`, types `text-clay`, punctuation `text-cream/70` |
| Traffic-light dots (L250–252) | `bg-red-400/80` `bg-yellow-400/80` `bg-green-400/80` | off-palette | warm to `bg-rust/80` `bg-gold/80` `bg-leaf/80` |
| Floating XP badge (L283–284) | `bg-accent/10` + `text-accent` | `text-accent` is near-cream → invisible | `bg-gold/15` + `Zap` icon `text-clay-deep`; "+250 XP" `text-foreground` |
| Hero "Powered by Solana" badge (L174) | `text-accent` on Zap | near-cream invisible | `text-clay-deep` (or `text-link`) |
| Gradient orbs (L166–167) | `bg-primary/10` `bg-accent/10` blur | decorative blur — fine, but `accent/10` is faint | keep `bg-primary/10`; change the second orb to `bg-skyblue/10` for a warm-cool glow |

**Redesign intent:** keep the strong two-column hero (copy left, code terminal right — the terminal is on-brand for a mono, technical site). Make the terminal a genuine dark "code block" (brown surface, cream/brand syntax, mono `text-[13px]`), fix the headline + badges for AA, and let frontend-design tighten the rhythm (generous whitespace, the stats row, CTA button hierarchy). Keep the `animate-fade-in-up`, the wallet/sign-in CTA logic, and all `useTranslations` keys.

- [ ] **Step 1: Apply the table fixes + dark-terminal redesign** (frontend-design refines composition/spacing; the color targets above are fixed).
- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' src/components/landing/hero-section.tsx   # expect: NO matches
pnpm build   # expect: green
```
- [ ] **Step 3: Visual (Chrome MCP, light + dark) — terminal syntax readable on dark surface; headline + badges AA; commit**
```bash
git add src/components/landing/hero-section.tsx
git commit -m "feat: redesign landing hero with dark terminal and AA-safe headline"
```

---

### Task 2: FeaturedCourses — adopt `tracks.ts`, brand cards, brand difficulty

**Files:** Modify `components/landing/featured-courses.tsx`. Apply frontend-design.

**Changes:**
- Import `getTrack` from `@/lib/tracks`. Replace the per-course `trackColor` / `gradientFrom` / `gradientTo` literals (L47–95, incl. the off-palette `bg-yellow-500/10 …` for NFT L75 and `bg-red-500/10 …` for Security L89) with values from `getTrack(slug-or-id)`: the track badge = `getTrack(...).badgeClass`; the card image-placeholder gradient = `getTrack(...).tintGradient`. Map the four featured courses to track ids `'1'..'4'` (Solana Core, DeFi, NFT, Security) accordingly.
- Difficulty badge: replace `DIFFICULTY_VARIANT` (L98–102, shadcn variants) with the master's **brand difficulty** classes — Beginner `bg-leaf/20 text-green-deep`, Intermediate `bg-gold/20 text-clay-deep`, Advanced `bg-rust/15 text-rust-deep`.
- XP pill (L157–159): `Zap` icon `text-accent` (near-cream, invisible) → `text-clay-deep`; pill bg stays `bg-background/90 backdrop-blur-sm`.
- "Start Course" footer link (L190) `text-primary` (brown) — keep, or `text-link` for the rectorspace link feel.
- Card → brand-card recipe: `rounded-lg border-2 border-brown/10 … hover:border-skyblue/30 hover:shadow-md` (replace the current `hover:border-primary/20` treatment). Keep the `group-hover:scale-[1.01]`.

**Redesign intent:** keep the 4-up grid but give it the warm brand-card treatment + the track-accent system (the track tint gradient as the card header, the track badge using `tracks.ts`). frontend-design tightens the card internal hierarchy (title/description/meta).

- [ ] **Step 1: Apply `tracks.ts` + brand difficulty + brand card + XP-pill fix.**
- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' src/components/landing/featured-courses.tsx   # expect: NO matches
rg -n "from '@/lib/tracks'" src/components/landing/featured-courses.tsx   # expect: 1 match (module adopted)
pnpm build   # expect: green
```
- [ ] **Step 3: Visual + commit**
```bash
git add src/components/landing/featured-courses.tsx
git commit -m "feat: redesign featured courses with tracks module and brand cards"
```

---

### Task 3: HowItWorks — warm step icons

**Files:** Modify `components/landing/how-it-works.tsx`. Apply frontend-design.

**Changes:** the 3 step icon backgrounds/colors (L21–40) currently `bg-primary/10 text-primary` (ok), `bg-accent/10 text-accent` (accent text = near-cream, invisible), `bg-yellow-500/10 text-yellow-600 dark:text-yellow-400` (off-palette). Remap to brand: step 1 `bg-skyblue/10 text-link`, step 2 `bg-clay/15 text-clay-deep`, step 3 `bg-gold/20 text-clay-deep`. Keep the connector-line composition, the step-number badge (`bg-primary text-primary-foreground` = brown/cream, fine), and the `bg-muted/30` section band (or convert to gold-divider rhythm in Task 8).

- [ ] **Step 1: Remap the 3 step icon colors to brand.**
- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' src/components/landing/how-it-works.tsx   # expect: NO matches
pnpm build   # expect: green
```
- [ ] **Step 3: Visual + commit**
```bash
git add src/components/landing/how-it-works.tsx
git commit -m "feat: re-skin how-it-works step icons to brand accents"
```

---

### Task 4: TracksOverview — adopt `tracks.ts`, brand cards

**Files:** Modify `components/landing/tracks-overview.tsx`. Apply frontend-design.

**Changes:** the 4 `TRACKS` literals (L33–74) carry off-palette NFT (`bg-yellow-500/10 …`, `border-l-yellow-500`) + Security (`bg-red-500/10 …`, `border-l-red-500`). Replace the per-track `iconBg`/`iconColor`/`accentBorder` with `tracks.ts`: `getTrack(...).Icon`, the icon tint from the track accent (`bg-skyblue/10 text-link`, etc. — reuse the badge tint), and `getTrack(...).borderClass` for the `border-l-4` accent. Keep the 2-col card grid + the "X courses" count badge + the Explore CTA. Card → brand-card recipe.

- [ ] **Step 1: Replace the local `TRACKS` array's colors/icons with `tracks.ts` values** (keep the descriptions, course counts, difficulty ranges — those are landing copy).
- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' src/components/landing/tracks-overview.tsx   # expect: NO matches
rg -n "from '@/lib/tracks'" src/components/landing/tracks-overview.tsx   # expect: 1 match
pnpm build   # expect: green
```
- [ ] **Step 3: Visual + commit**
```bash
git add src/components/landing/tracks-overview.tsx
git commit -m "feat: redesign tracks overview with tracks module and brand cards"
```

---

### Task 5: GamificationPreview — fix gradient a11y, brand accents, podium

**Files:** Modify `components/landing/gamification-preview.tsx`. Apply frontend-design. (Highest-defect section.)

**Off-palette / a11y defects to fix (exact):**
| Location | Current | Problem | Fix |
|---|---|---|---|
| Level badge (L117–118) | `bg-gradient-to-br from-primary to-accent` + `text-white` | white on near-cream tail = fail | dark-stop gradient `from-link to-brown` (Core-track art), keep `text-white` (AA on dark stops) |
| Streak flame (L138–139) | `bg-orange-500/10` `text-orange-500` | off-palette | `bg-clay/15` + `Flame` `text-clay-deep` |
| Streak calendar bars (L155–161) | `bg-accent` / `bg-accent/50` | near-cream → invisible on card | `bg-leaf` / `bg-leaf/50` (filled days), `bg-muted` (empty) |
| Credential NFT art (L171) | `from-primary via-primary/80 to-accent` + white text | white on near-cream tail = fail | dark art gradient `from-link to-brown` (it's a "Solana Core Credential"); white text now AA |
| Achievement badge colors (L37–64) | `text-yellow-500`/`bg-yellow-500/10`, `text-orange-500`/`bg-orange-500/10`, `text-primary`/`bg-primary/10`, `text-red-500`/`bg-red-500/10` | off-palette mix | brand: `text-clay-deep`/`bg-gold/20`, `text-clay-deep`/`bg-clay/15`, `text-link`/`bg-skyblue/10`, `text-rust-deep`/`bg-rust/15` |
| Mini-leaderboard ranks (L259–263) | `bg-yellow-500/20 text-yellow-600`, `bg-gray-300/20 text-gray-600`, `bg-orange-500/20 text-orange-600` | off-palette + gray | master **podium** map: 1st `bg-gold/20 text-clay-deep`, 2nd `bg-clay/15 text-clay-deep`, 3rd `bg-rust/15 text-rust-deep` |

**Redesign intent:** keep the two-column gamification showcase (XP/streak/credential cards left; achievements + mini-leaderboard right). Apply brand cards + the podium system + the dark-stop credential art. frontend-design refines the credential mockup (it's a hero visual — make it feel like a real warm credential) and the badge grid rhythm. Keep `getLevelTitle`/`calculateLevel` logic + the `Progress` component.

- [ ] **Step 1: Apply all table fixes + brand-card treatment.**
- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' src/components/landing/gamification-preview.tsx   # expect: NO matches
pnpm build   # expect: green
```
- [ ] **Step 3: Visual (light + dark) — verify white text on the credential/level gradients is legible (AA); commit**
```bash
git add src/components/landing/gamification-preview.tsx
git commit -m "feat: redesign gamification preview with AA gradients and podium colors"
```

---

### Task 6: SocialProof — brand partner tiles + honesty fix

**Files:** Modify `components/landing/social-proof.tsx`. Apply frontend-design.

**Off-palette:** `ECOSYSTEM_PARTNERS` gradients (L46–50) are all off-palette (`from-violet-500 to-purple-600`, `from-pink-500 to-rose-600`, `from-orange-400 to-amber-600`, `from-emerald-400 to-teal-600`, `from-indigo-400 to-blue-600`). Replace the rainbow with a brand-accent cycle on the letter tiles: skyblue → gold → clay → leaf → link (use dark-enough fills or `text-brown` on light fills so the initial is AA; e.g. tile `bg-skyblue text-brown`, `bg-gold text-brown`, `bg-clay text-cream`, `bg-leaf text-brown`, `bg-link text-cream`). Stats (L96) `text-3xl font-bold` → keep, but render the numeric values `text-green-deep` (the "earned/achieved" stat feel). Testimonial cards → brand-card recipe; `MessageSquare` icon `text-primary/40` → `text-clay/50`.

**★ HONESTY FIX (Amanah — surface to RECTOR, applied here as the safe default):** the current copy fabricates partnerships ("Trusted by the Solana ecosystem" + Solana Foundation / Metaplex / Helius / Jupiter / Phantom tiles) and metrics (3 named testimonials, "2,500+ Active Learners", "95% Completion Rate", "500+ Credentials Minted"). RECTOR Academy is a portfolio demo, not a partnered platform — shipping fabricated social proof on a public site under RECTOR's name is a brand/honesty risk. **Default applied in this task:** reframe honestly — relabel the partner row as "Built with the Solana ecosystem" (tools the academy is built on: Solana, Anchor, Metaplex, Helius — true) and reframe the stats as a demo/"what you earn" framing (e.g. "On-chain XP", "Soulbound credentials", "4 learning tracks", "100+ challenges" — all true of the seed data) rather than invented user metrics; replace named testimonials with a single honest "what this demo shows" panel. **Flag for RECTOR's confirmation** — if he prefers to keep stylized demo metrics with a visible "demo data" label instead, adjust. Do NOT ship invented partner/metric claims unlabeled.

- [ ] **Step 1: Brand the partner tiles + stats; apply the honesty reframing (or a clearly-labeled demo framing per RECTOR).**
- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' src/components/landing/social-proof.tsx   # expect: NO matches
pnpm build   # expect: green
```
- [ ] **Step 3: Visual + commit**
```bash
git add src/components/landing/social-proof.tsx
git commit -m "feat: redesign social proof with brand tiles and honest framing"
```

---

### Task 7: CtaBanner — AA-safe gradient, warm treatment

**Files:** Modify `components/landing/cta-banner.tsx`. Apply frontend-design.

**a11y defect:** the banner (L17) `bg-gradient-to-br from-primary via-primary/90 to-accent` carries white H2/subtitle/icon — the near-cream `to-accent` tail fails white-text contrast. Fix the gradient to **dark stops**: `from-brown via-brown to-link` (or `from-brown to-clay-deep`) so white text + the white/10 icon chip + white/30 outline button stay AA. Keep the decorative white/5 blobs + grid overlay + the dual CTA (Courses + Leaderboard). The primary CTA `bg-white text-primary` (brown) is fine on the dark banner; keep.

- [ ] **Step 1: Replace the banner gradient with dark stops; verify white text AA on the new gradient.**
- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' src/components/landing/cta-banner.tsx   # expect: NO matches
pnpm build   # expect: green
```
- [ ] **Step 3: Visual + commit**
```bash
git add src/components/landing/cta-banner.tsx
git commit -m "feat: fix CTA banner gradient for AA white text on dark stops"
```

---

### Task 8: Marketing page — gold-divider rhythm + section bands

**Files:** Modify `app/[locale]/(marketing)/page.tsx`. Apply frontend-design.

Current: `page.tsx` stacks the 7 sections with no separators; rhythm comes only from each section's `py-16 md:py-24` and the alternating `bg-muted/30` on HowItWorks + GamificationPreview. Rectorspace separates major sections with the **gold divider**.

**Redesign intent:** introduce the rectorspace section rhythm — keep at most one or two `bg-muted/30` bands for contrast, and place a centered gold divider (`<div className="mx-auto max-w-7xl border-t-2 border-gold/60" />` inside a thin wrapper, or a small `SectionDivider` element) between the remaining major sections (Hero → Featured → HowItWorks → Tracks → Gamification → SocialProof → CTA) so the page reads with intentional, warm pacing rather than uniform stacking. Keep the JSON-LD script + section order + `generateMetadata`. frontend-design decides exact divider placement (not every seam needs one — use them to group: e.g. after Featured, after Tracks, after SocialProof).

- [ ] **Step 1: Add the gold-divider rhythm between sections** (decide bands vs dividers per frontend-design; keep order + JSON-LD).
- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' 'src/app/[locale]/(marketing)/page.tsx'   # expect: NO matches
pnpm build   # expect: green
```
- [ ] **Step 3: Visual (full-page scroll, light + dark) + commit**
```bash
git add 'src/app/[locale]/(marketing)/page.tsx'
git commit -m "feat: add gold-divider section rhythm to the landing page"
```

---

## Part gate (run from `app/` after Task 8 — all must pass)
- [ ] `pnpm build` → green
- [ ] `pnpm test:run` → **374 passing** (unchanged from Phase 4.0; landing has no unit tests)
- [ ] `pnpm exec playwright test --project=chromium` → **36 passing** (clean-slate run; kill stray `next` procs + free :3000 first). `e2e/pages/landing.page.ts` + `accessibility.spec.ts` exercise this page — keep section order, headings, CTA labels, and i18n keys intact (they are preserved by design); if a redesign breaks an e2e selector, update it in the task that changed it (the a11y spec should pass *more* easily after the gradient fixes).
- [ ] Landing off-palette guard returns **zero** across all 8 files:
```bash
rg -n 'violet|purple|indigo|fuchsia|pink|teal|-(amber|orange|rose|sky|blue|green|red|yellow|gray|slate|zinc|neutral)-[0-9]' \
  src/components/landing 'src/app/[locale]/(marketing)/page.tsx'   # expect: NO matches
```
- [ ] `tracks.ts` adopted by the two track-bearing sections:
```bash
rg -l "from '@/lib/tracks'" src/components/landing   # expect: featured-courses.tsx + tracks-overview.tsx
```
- [ ] **Visual + a11y smoke (Chrome MCP, ONE pre-warmed `pnpm dev`):** load `/en` in light AND dark. Verify: hero terminal syntax legible on the dark surface; every gradient that carries white/clip text (hero headline, level badge, credential art, CTA banner) is AA-legible; track badges + difficulty badges use the warm system; gold dividers pace the page; no purple/rainbow anywhere. Run an automated contrast check (axe or manual ratio) on the four gradient surfaces.
- [ ] **RECTOR sign-off on the look** (this is the exemplar gate) + **confirmation of the Task-6 honesty framing** before the remaining clusters (2–5) are planned.

## Self-Review (landing, completed by plan author)
- **Off-palette coverage:** every landing off-palette accent from recon is mapped to a brand replacement (hero syntax/terminal/badges; featured track+difficulty+XP; how-it-works icons; tracks-overview; gamification gradients+badges+podium; social-proof partners+stats; CTA gradient). ✓
- **a11y coverage:** all four `from-primary to-accent` white/clip-text gradients (hero H1, gamification level badge + credential art, CTA banner) moved to dark stops or solid text. ✓
- **Design-Language coverage:** brand cards, brand difficulty, `tracks.ts`, gold-divider rhythm, tinted-badge recipe all applied. ✓
- **Honesty (Amanah):** fabricated partner/metric claims flagged + a true-by-default reframing specified, pending RECTOR's confirm. ✓
- **Placeholder scan:** each task names exact files, exact current→target colors, a guard with expected output, and defers only genuine composition to frontend-design (correct altitude for a redesign). ✓
- **Dependency:** depends on Phase 4.0 (tracks.ts, rust tokens) — stated up front. ✓
