# RECTOR Academy — Phase 4.0: Design-Language Foundation (SUB-PLAN)

> **For agentic workers:** REQUIRED SUB-SKILL — implement task-by-task via `superpowers:subagent-driven-development` (fresh implementer + two-stage review per task). Steps use checkbox (`- [ ]`) syntax. This sub-plan **inherits the master plan's Global Constraints and Design Language verbatim**: `docs/superpowers/plans/2026-06-17-rector-academy-phase4-tier1-redesigns.md`. Apply `superpowers:frontend-design` on the shell tasks (5–8).

**Goal:** Land the shared Phase-4 layer everything else consumes — two readable muted-red brand tokens, one single-source `tracks` module (warm remap), two reusable layout primitives (`PageContainer`, `PageHeader`), and a bespoke redesign of the shared chrome (header, sidebar, footer, mobile-nav) to the rectorspace.com warm aesthetic.

**Architecture:** Tokens + module + primitives are additive and mechanical (TDD where there's logic). The shell components are already Phase-3 token-clean (semantic tokens, no off-palette), so their redesign is **compositional/aesthetic** — active-route states, the gold-divider motif, warm spacing/hierarchy — not a color sweep. No page routes change in this sub-plan.

**Tech Stack:** as master. Reference: `core` repo `globals.css` + `DESIGN_SYSTEM.md`.

## Constraints (foundation-specific; the rest inherit from master)
- The shell components are shared by marketing, platform, AND admin — changes here affect every page. Keep nav structure, i18n keys, collapse behavior, and the `MOCK_XP` placeholder intact (real data is Phase 5).
- Do NOT migrate the 11 existing track-color consumers in this sub-plan — each page cluster migrates its own components to import `tracks.ts` as part of that page's redesign (avoids double-touch / Israf). Foundation only **creates** the module + its first tests.
- Per-task gate: `pnpm build` green + the named guard. Part gate at the end: `pnpm test:run` 366+ (foundation ADDS tests — see gate) · `pnpm exec playwright test --project=chromium` 36 · visual smoke (light + dark).

---

## File Structure

- **Modify** `src/app/globals.css` — add `--color-rust` + `--color-rust-deep` to the brand `@theme` block (lines ~119–136).
- **Create** `src/lib/tracks.ts` — single source for the 4 tracks (warm remap). Consumed by landing + all later clusters.
- **Create** `src/lib/__tests__/tracks.test.ts` — unit tests for the module.
- **Create** `src/components/ui/page-container.tsx` — `<PageContainer>` max-width wrapper.
- **Create** `src/components/ui/page-header.tsx` — `<PageHeader>` (mono heading + gold under-divider + optional eyebrow/actions).
- **Create** `src/components/ui/__tests__/page-header.test.tsx` — render tests for `PageHeader` (+ a light `PageContainer` assertion).
- **Modify** `src/components/layout/header.tsx` — active-route nav state + warm polish.
- **Modify** `src/components/layout/sidebar.tsx` — stronger active state + warm XP footer.
- **Modify** `src/components/layout/footer.tsx` — gold-divider motif + warm newsletter card.
- **Modify** `src/components/layout/mobile-nav.tsx` — active-route state matching the header.

---

### Task 1: Brand tokens — `--color-rust` + `--color-rust-deep`

**Files:** Modify `src/app/globals.css` (brand `@theme` block, after `--color-clay-deep` line ~135).

**Interfaces:**
- Produces: utilities `bg-rust` `text-rust` `border-rust` `border-l-rust` `ring-rust` (decorative muted-red fills) and `text-rust-deep` (AA-readable muted-red text on cream). Consumed by `tracks.ts` (Task 2) and all later difficulty/Security/podium work.

- [ ] **Step 1: Add the two tokens**

In `src/app/globals.css`, inside the second `@theme { … }` block (the brand block beginning ~line 119), add after the `--color-clay-deep` line:
```css
  /* muted-red brand accent — named 'rust' to avoid colliding with Tailwind's red-* scale */
  --color-rust: #C75A44; /* decorative fill: Security track, Advanced difficulty, podium 3rd */
  --color-rust-deep: #A23B22; /* readable muted-red TEXT on cream — verify AA in Step 2 */
```

- [ ] **Step 2: Verify `--color-rust-deep` is AA on cream (≥4.5:1)**

Compute the WCAG contrast of `#A23B22` text on `#FFF7E1`:
```bash
node -e "const h=s=>parseInt(s,16)/255,lin=c=>c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4,L=(r,g,b)=>0.2126*lin(h(r))+0.7152*lin(h(g))+0.0722*lin(h(b));const fg=L('a2','3b','22'),bg=L('ff','f7','e1');const c=(Math.max(fg,bg)+0.05)/(Math.min(fg,bg)+0.05);console.log('contrast',c.toFixed(2),c>=4.5?'PASS':'FAIL')"
```
Expected: `contrast 6.xx PASS` (≥4.5:1). If it prints `FAIL`, darken `--color-rust-deep` (e.g. `#8F3320`) and re-run until PASS; record the final ratio in a trailing comment on the token line.

- [ ] **Step 3: Guard + build**
```bash
rg -n 'color-rust' src/app/globals.css   # expect: 2 matches (rust, rust-deep)
pnpm build                               # expect: green
```

- [ ] **Step 4: Commit**
```bash
git add src/app/globals.css
git commit -m "feat: add rust/rust-deep brand tokens for muted-red accents"
```

---

### Task 2: `tracks.ts` — single-source warm track remap (TDD)

**Files:** Create `src/lib/tracks.ts`; Create `src/lib/__tests__/tracks.test.ts`. (Depends on Task 1 tokens.)

**Interfaces:**
- Produces: `TrackId`, `TrackSlug`, `Track` types; `TRACKS: Record<TrackId, Track>`; `ALL_TRACKS: Track[]`; `getTrack(idOrSlug: string): Track`. Each `Track` has `{ id, slug, name, Icon (LucideIcon), accent, badgeClass, borderClass, tintGradient }`. Consumed by the landing sub-plan (featured-courses, tracks-overview) and all later clusters.

- [ ] **Step 1: Write the failing test** — `src/lib/__tests__/tracks.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { TRACKS, ALL_TRACKS, getTrack } from '../tracks';

describe('tracks module', () => {
  it('maps the four tracks to warm brand accents in order', () => {
    expect(ALL_TRACKS.map((t) => t.accent)).toEqual([
      'skyblue',
      'gold',
      'clay',
      'rust',
    ]);
  });

  it('uses AA-readable text tokens in every badge class', () => {
    for (const t of ALL_TRACKS) {
      expect(t.badgeClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep)/);
    }
  });

  it('contains no off-palette color names', () => {
    expect(JSON.stringify(TRACKS)).not.toMatch(
      /violet|purple|indigo|fuchsia|pink|teal|9945FF|14F195/i,
    );
  });

  it('resolves by id and slug with a safe fallback to Solana Core', () => {
    expect(getTrack('1').slug).toBe('solana-core');
    expect(getTrack('security').id).toBe('4');
    expect(getTrack('does-not-exist').id).toBe('1');
  });
});
```

- [ ] **Step 2: Run it — verify FAIL**
```bash
pnpm test:run src/lib/__tests__/tracks.test.ts   # expect: FAIL (module not found)
```

- [ ] **Step 3: Create `src/lib/tracks.ts`**
```ts
import {
  Blocks,
  Coins,
  Image as ImageIcon,
  Shield,
  type LucideIcon,
} from 'lucide-react';

export type TrackId = '1' | '2' | '3' | '4';
export type TrackSlug = 'solana-core' | 'defi' | 'nft' | 'security';

export interface Track {
  id: TrackId;
  slug: TrackSlug;
  name: string;
  /** Lucide icon for this track. */
  Icon: LucideIcon;
  /** Brand accent token name (decorative fills/borders/rings). */
  accent: 'skyblue' | 'gold' | 'clay' | 'rust';
  /** Tinted badge: tint background + AA-readable -deep/link text. */
  badgeClass: string;
  /** Left-border accent (track cards). */
  borderClass: string;
  /** Light tint gradient for image placeholders with NO overlaid text. */
  tintGradient: string;
}

export const TRACKS: Record<TrackId, Track> = {
  '1': {
    id: '1',
    slug: 'solana-core',
    name: 'Solana Core',
    Icon: Blocks,
    accent: 'skyblue',
    badgeClass: 'bg-skyblue/10 text-link',
    borderClass: 'border-l-skyblue',
    tintGradient: 'from-skyblue/20 to-skyblue/5',
  },
  '2': {
    id: '2',
    slug: 'defi',
    name: 'DeFi',
    Icon: Coins,
    accent: 'gold',
    badgeClass: 'bg-gold/20 text-clay-deep',
    borderClass: 'border-l-gold',
    tintGradient: 'from-gold/20 to-gold/5',
  },
  '3': {
    id: '3',
    slug: 'nft',
    name: 'NFT & Metaplex',
    Icon: ImageIcon,
    accent: 'clay',
    badgeClass: 'bg-clay/15 text-clay-deep',
    borderClass: 'border-l-clay',
    tintGradient: 'from-clay/20 to-clay/5',
  },
  '4': {
    id: '4',
    slug: 'security',
    name: 'Security',
    Icon: Shield,
    accent: 'rust',
    badgeClass: 'bg-rust/15 text-rust-deep',
    borderClass: 'border-l-rust',
    tintGradient: 'from-rust/15 to-rust/5',
  },
};

const BY_SLUG: Record<string, Track> = Object.fromEntries(
  Object.values(TRACKS).map((t) => [t.slug, t]),
);

export const ALL_TRACKS: Track[] = Object.values(TRACKS);

/** Resolve a track by id ('1'..'4') or slug; falls back to Solana Core. */
export function getTrack(idOrSlug: string): Track {
  return TRACKS[idOrSlug as TrackId] ?? BY_SLUG[idOrSlug] ?? TRACKS['1'];
}
```

- [ ] **Step 4: Run it — verify PASS**
```bash
pnpm test:run src/lib/__tests__/tracks.test.ts   # expect: PASS (4 tests)
```

- [ ] **Step 5: Build (Tailwind must generate the brand utilities the module names)**
```bash
pnpm build   # expect: green — confirms bg-skyblue/border-l-rust/etc. resolve
```

- [ ] **Step 6: Commit**
```bash
git add src/lib/tracks.ts src/lib/__tests__/tracks.test.ts
git commit -m "feat: add single-source tracks module with warm brand remap"
```

---

### Task 3: `<PageContainer>` primitive

**Files:** Create `src/components/ui/page-container.tsx`.

**Interfaces:**
- Produces: `PageContainer({ className?, children })` — `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`. Consumed by later platform clusters (full-bleed pages opt out).

- [ ] **Step 1: Create the component**
```tsx
import { cn } from '@/lib/utils';

export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Build**
```bash
pnpm build   # expect: green
```
(Render assertion is covered alongside `PageHeader` in Task 4's test file.)

- [ ] **Step 3: Commit**
```bash
git add src/components/ui/page-container.tsx
git commit -m "feat: add PageContainer layout primitive"
```

---

### Task 4: `<PageHeader>` primitive (TDD)

**Files:** Create `src/components/ui/page-header.tsx`; Create `src/components/ui/__tests__/page-header.test.tsx`.

**Interfaces:**
- Produces: `PageHeader({ title, description?, eyebrow?, icon?, actions?, className? })`. The gold under-border is the rectorspace section-divider motif applied to page headers. Consumed by all later platform clusters.

- [ ] **Step 1: Write the failing test** — `src/components/ui/__tests__/page-header.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../page-header';
import { PageContainer } from '../page-container';

describe('PageHeader', () => {
  it('renders the title as a level-1 heading', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
  });

  it('renders the eyebrow and description when provided', () => {
    render(<PageHeader title="Courses" eyebrow="Catalog" description="Browse all tracks" />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Browse all tracks')).toBeInTheDocument();
  });

  it('omits the description node when not provided', () => {
    const { container } = render(<PageHeader title="Profile" />);
    expect(container.querySelector('p')).toBeNull();
  });
});

describe('PageContainer', () => {
  it('constrains width and renders children', () => {
    const { container } = render(<PageContainer>content</PageContainer>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('max-w-7xl');
    expect(root).toHaveTextContent('content');
  });
});
```

- [ ] **Step 2: Run it — verify FAIL**
```bash
pnpm test:run src/components/ui/__tests__/page-header.test.tsx   # expect: FAIL (PageHeader not found)
```

- [ ] **Step 3: Create `src/components/ui/page-header.tsx`**
```tsx
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b-2 border-gold/60 pb-6 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {Icon && <Icon className="size-3.5" aria-hidden="true" />}
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run it — verify PASS**
```bash
pnpm test:run src/components/ui/__tests__/page-header.test.tsx   # expect: PASS (4 tests)
```

- [ ] **Step 5: Build + commit**
```bash
pnpm build   # expect: green
git add src/components/ui/page-header.tsx src/components/ui/__tests__/page-header.test.tsx
git commit -m "feat: add PageHeader primitive with the gold-divider motif"
```

---

### Task 5: Header redesign — active-route state + warm polish

**Files:** Modify `src/components/layout/header.tsx`. **Apply `superpowers:frontend-design`.**

Current state: sticky, `border-b bg-background/95 backdrop-blur`, GraduationCap logo + wordmark, three nav links styled `text-muted-foreground … hover:text-foreground` with **no active state**, then ThemeToggle/LanguageSwitcher/SignInMenu/WalletConnectButton, then `<MobileNav />`. Already token-clean.

**Redesign intent (rectorspace warm):**
- Give nav links a real **active-route state**: active = `text-foreground font-semibold` with a 2px **gold underline**; inactive = `text-muted-foreground hover:text-foreground`. Use `usePathname()` from `@/i18n/routing` with the active rule `pathname === item.href || pathname.startsWith(\`${item.href}/\`)` (mirror the sidebar).
- Keep the sticky + backdrop-blur; keep `max-w-7xl`. Logo: GraduationCap `text-brown`, wordmark `text-foreground font-bold`.
- frontend-design: refine the underline (e.g. an animated `after:` gold bar or a `border-b-2` on the link), hover transition timing, and gap/rhythm so the bar reads as intentional, not default.

- [ ] **Step 1: Extract a `HeaderNavLink` with active state.** Add `import { usePathname } from '@/i18n/routing';` and implement the active treatment described above. Concrete active-class baseline (frontend-design may refine the underline mechanic, not the color):
```tsx
// active:
'relative text-foreground font-semibold after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-gold'
// inactive:
'text-muted-foreground hover:text-foreground'
```

- [ ] **Step 2: Guard — no off-palette introduced**
```bash
rg -n 'violet|purple|indigo|fuchsia|slate|gray-' src/components/layout/header.tsx   # expect: NO matches
pnpm build   # expect: green
```

- [ ] **Step 3: Visual check (Chrome MCP, single pre-warmed dev).** Active route shows the gold underline; light + dark both legible (AA). Then commit:
```bash
git add src/components/layout/header.tsx
git commit -m "feat: redesign header nav with active-route gold underline"
```

---

### Task 6: Sidebar redesign — stronger active state + warm XP footer

**Files:** Modify `src/components/layout/sidebar.tsx` (both `Sidebar` and `SidebarMobileContent`). **Apply `superpowers:frontend-design`.**

Current state: collapsible `w-16`/`w-64`, 7 `NAV_ITEMS`, active = `bg-primary/10 text-primary` (subtle), `XPProgressSection` (MOCK_XP) + collapse button. Token-clean.

**Redesign intent:**
- Strengthen the active item to a clear rectorspace treatment: `bg-secondary text-foreground font-semibold` + a left accent bar `border-l-2 border-link` (icon `text-link` when active). Apply identically in `Sidebar` and `SidebarMobileContent`.
- Warm the XP footer block: wrap it as a soft brand card (`rounded-lg border-2 border-brown/10 bg-card/60 p-3`); keep the `Progress` (token-driven), the level `Badge`, and the collapse button. Keep `MOCK_XP` (Phase 5 wires real data).
- frontend-design: spacing, the active-bar alignment in collapsed vs expanded, hover transitions.

- [ ] **Step 1: Apply the active-state + XP-card changes** in both components (keep collapse logic, tooltips, `aria-current`).

- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|slate|gray-' src/components/layout/sidebar.tsx   # expect: NO matches
pnpm build   # expect: green
```

- [ ] **Step 3: Visual (Chrome MCP) — active item obvious, collapsed rail still legible; commit**
```bash
git add src/components/layout/sidebar.tsx
git commit -m "feat: redesign sidebar active state and XP footer to brand"
```

---

### Task 7: Footer redesign — gold-divider motif + warm newsletter card

**Files:** Modify `src/components/layout/footer.tsx`. **Apply `superpowers:frontend-design`.**

Current state: `max-w-7xl`, brand col + 3 link columns + newsletter (`bg-muted/30`) + `<Separator className="my-8" />` + bottom bar (copyright, "Built on Solana" badge w/ Solana SVG, social icons). Token-clean. **Keep the `SolanaLogo` SVG gradient as-is** (intentional brand mark).

**Redesign intent:**
- Replace the plain `<Separator className="my-8" />` above the bottom bar with the rectorspace **gold divider**: `<div className="my-8 border-t-2 border-gold/60" />`.
- Promote the newsletter block to a brand card: `rounded-lg border-2 border-brown/10 bg-secondary/40 p-6` (keep `NewsletterForm` + the sonner toast).
- Column link hover already `hover:text-primary`; keep. frontend-design: column rhythm, the "Built on Solana" pill warmth, social-icon hover.

- [ ] **Step 1: Apply the divider + newsletter-card changes** (leave `SolanaLogo`, `socialLinks`, `columns`, i18n untouched).

- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|slate|gray-' src/components/layout/footer.tsx   # expect: NO matches
pnpm build   # expect: green
```

- [ ] **Step 3: Visual (Chrome MCP) + commit**
```bash
git add src/components/layout/footer.tsx
git commit -m "feat: redesign footer with gold divider and warm newsletter card"
```

---

### Task 8: MobileNav redesign — active-route state matching the header

**Files:** Modify `src/components/layout/mobile-nav.tsx`. **Apply `superpowers:frontend-design`.**

Current state: a `Sheet` with 3 nav links (`text-foreground/80 hover:bg-accent/50`), theme/language toggles, SignInMenu, full-width WalletConnectButton. No active state.

**Redesign intent:** give the 3 links the same active treatment as the header (active = `bg-secondary text-foreground font-semibold` + `text-link` icon; the underline motif doesn't suit a vertical sheet, so use the filled-row active style like the sidebar). Use `usePathname()` from `@/i18n/routing`. Keep the sheet, toggles, wallet button.

- [ ] **Step 1: Add `usePathname` + the active-row treatment** to the nav links.

- [ ] **Step 2: Guard + build**
```bash
rg -n 'violet|purple|indigo|fuchsia|slate|gray-' src/components/layout/mobile-nav.tsx   # expect: NO matches
pnpm build   # expect: green
```

- [ ] **Step 3: Visual (Chrome MCP, mobile width) + commit**
```bash
git add src/components/layout/mobile-nav.tsx
git commit -m "feat: add active-route state to mobile nav"
```

---

## Part gate (run from `app/` after Task 8 — all must pass)
- [ ] `pnpm build` → green
- [ ] `pnpm test:run` → **374 passing** (366 prior — verified — + 4 tracks + 4 page-header/container tests; zero regressions. No shell unit tests exist, so the shell tasks add none.)
- [ ] `pnpm exec playwright test --project=chromium` → **36 passing** (clean-slate run: `pkill -f 'next dev'; pkill -f 'next-server'; lsof -ti:3000 | xargs kill -9` first, then ONE run). The e2e page-objects (`e2e/pages/*.page.ts`) and `accessibility.spec.ts` may select shell elements; if a shell change breaks a selector, update that selector as part of the task that changed it (prefer role/text selectors over class selectors).
- [ ] Tier-clean guard across the touched shell files returns zero off-palette:
```bash
rg -n 'violet|purple|indigo|fuchsia|slate|gray-' \
  src/components/layout/header.tsx src/components/layout/sidebar.tsx \
  src/components/layout/footer.tsx src/components/layout/mobile-nav.tsx   # expect: NO matches
```
- [ ] Visual smoke (Chrome MCP, ONE pre-warmed `pnpm dev`): load `/en/dashboard` (platform shell) and `/en` (marketing shell) in light AND dark — header active underline, sidebar active bar, footer gold divider all render; AA legible; nothing regressed.

## Self-Review (foundation, completed by plan author)
- **Master Design-Language coverage:** rust tokens (T1) · tracks warm remap single-source (T2) · `PageContainer`/`PageHeader` primitives + gold-divider motif (T3–T4) · shell warm redesign (T5–T8). ✓
- **No-Israf:** track-consumer migration deferred to each page cluster (foundation creates the module only). ✓
- **Type/name consistency:** `Track`/`getTrack`/`TRACKS` used identically in module + test; `rust`/`rust-deep` defined (T1) before `tracks.ts` consumes them (T2 depends on T1). Primitives' prop names match their tests. ✓
- **Placeholder scan:** every step has exact paths, real code, and a guard with expected output; the one computed value (`rust-deep`) has a verification step + fallback. ✓
- **a11y:** `rust-deep` AA-verified (T1 S2); active states preserve `aria-current`; no new motion without the existing reduced-motion guard. ✓
