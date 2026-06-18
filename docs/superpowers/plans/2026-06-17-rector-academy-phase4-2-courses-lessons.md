# RECTOR Academy — Phase 4.2: Courses + Lessons (Sub-Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This sub-plan **inherits the master plan verbatim**: `docs/superpowers/plans/2026-06-17-rector-academy-phase4-tier1-redesigns.md` (Global Constraints + the Phase-4 Design Language). Read it first. Apply `superpowers:frontend-design` per page.

**Goal:** Redesign the three Courses + Lessons routes and their components to the locked RECTOR Academy design language — migrate every hardcoded track color onto the single-source `tracks.ts`, turn difficulty + lesson-type into brand classification, fix the white-on-gradient AA defects (course hero + credential mockup), and adopt the `PageHeader` recipe — so the catalog → detail → lesson flow reads cream/brown branded end-to-end.

**Architecture:** One foundation touch (`tracks.ts` gains a dark, AA-safe `artGradient` for white-text surfaces — pulled forward from cluster 4.5 because the course hero needs it now), then leaf-level badge/card components migrate to `tracks.ts`, then the two contained routes adopt `PageHeader` + a width cap, then the full-bleed lesson surface gets its type badges re-branded. The already-on-brand components are explicitly listed as verify-only.

**Tech Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript strict · Tailwind v4 (CSS-first `@theme`, no config) · shadcn/ui · next-themes · next-intl (en/pt/es/hi) · Vitest · Playwright · pnpm.

---

## Global Constraints (inherits master — load-bearing restatements + 4.2 deltas)

- **Working root:** all `pnpm`/path commands run from `/Users/rector/local-dev/superteam-academy/app`. Paths below are relative to that `app/` unless they start with `docs/`.
- **★ REPO-SAFETY (load-bearing — bit the foundation):** the SDD controller's cwd is the **`core` repo, a structural twin** (both are Next.js apps with `src/app/globals.css` + a brand `@theme`). A relative path silently edits the WRONG repo. MITIGATION for every task: use **absolute paths**; if the shell cwd is not the academy, `cd /Users/rector/local-dev/superteam-academy/app` first; **before each commit** confirm `git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel` ends in `superteam-academy`, and after each commit confirm `git -C /Users/rector/local-dev/core status` is still clean. The 4.2 files are academy-only (no `core` twin), so a mis-target would fail loud — but verify anyway.
- **Branch:** `chore/rector-academy-revival` (NOT main). Do NOT merge (final integration = fresh repo in Phase 5). Base HEAD: `b58c40f`.
- **Palette + tokens:** cream `#FFF7E1` bg · brown `#3B2C22` text · skyblue `#41CFFF` · gold `#F9C846` · clay `#E58C2E` · leaf `#A8E063` · rust `#C75A44`. Readable-on-cream text uses `-deep`/`link`: `link #0D7390` · `green-deep #3C6A12` · `clay-deep #8A4A12` · `rust-deep #A23B22`. **NEVER** define/use `--color-sky/yellow/red/green`. Bright tokens = decorative fills only.
- **Tracks = single source `src/lib/tracks.ts`.** Every consumer imports `getTrack`/`TRACKS`/`ALL_TRACKS`. Never re-hardcode a track hue. ★ Data note: `CourseWithMeta.trackId` is a **`number`** (1–4); `tracks.ts` is keyed by **string** `'1'..'4'` → always call `getTrack(String(course.trackId))`.
- **KEEP semantic STATUS colors — do NOT sweep:** completion/pass = emerald (course-completed badge + CTA, module checkmark, lesson-row completed states, enroll "Completed", prerequisite met, lesson-sidebar/complete-button), admonitions tip=emerald/warning=amber/info=blue (lesson-content), verification/arweave emerald, destructive errors, Monaco chrome (`#1e1e1e`/`#252526`/`#d4d4d4`/`#007acc`). Classification (track, difficulty, lesson-type) **does** go brand.
- **Icons:** Lucide only, no emoji. **Commits:** conventional `type: description`, **one per task**, **NO AI attribution**, GPG-signed. **No shortcuts:** preserve loading/error/empty states + a11y AA; verify dark each task.
- **zsh quoting:** quote any path containing `[locale]`/`(platform)` (e.g. `rg pat 'src/app/[locale]/(platform)/courses/page.tsx'`).
- **Testing rhythm (matches 4.0/4.1):** `tracks.ts` is unit-tested (full TDD). The visual components have no RTL suite — their per-task gate is **`pnpm build` green + `npx tsc --noEmit` clean + the file's off-palette guard returns no matches**; the **part gate** adds `pnpm test:run` + a prod-server Chrome-MCP visual smoke (light + dark).
- **Per-task gate:** `cd /Users/rector/local-dev/superteam-academy/app && pnpm build` (green) + `npx tsc --noEmit` (clean) + the task's off-palette guard (no matches).
- **Part gate (end of this sub-plan):** `pnpm test:run` = **375 passing** (374 today + 1 new tracks test) · cluster off-palette guards return zero (below) · prod-server visual smoke light+dark on all three routes · read-only opus review.
- **Dev/visual infra:** Turbopack `pnpm dev` first-compile HANGS here (>220s) → use the **prod server** for visual gates: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && PORT=3000 pnpm start` (responds ~0.1s), then Chrome MCP. Browser localStorage may hold a stale `theme=dark` — toggle to Light for the primary cream theme.

---

## 4.2-specific design decisions (read before executing)

1. **`artGradient` pulled forward from 4.5.** The master plan defers per-track *dark* art-gradients (for white-text surfaces) to the credentials sub-plan, but **course-header** (the detail hero) overlays white text on a track gradient **now**, so 4.2 adds one `artGradient` field to the `Track` type. Cluster 4.5 (certificate canvas) will consume the same field. Values (AA-verified — white text on the *lightest* stop ≥ 4.5:1; lightest is `link` at **5.42:1**, matching the landing's measured worst case):
   - Core (skyblue) → `from-link to-brown`
   - DeFi (gold) → `from-clay-deep to-brown`
   - NFT (clay) → `from-clay-deep to-rust-deep`
   - Security (rust) → `from-rust-deep to-brown`
   All four stops drawn from `{link, clay-deep, rust-deep, green-deep, brown}` (each ≥ 5.42:1 with white); the four gradients are mutually distinguishable.
2. **`PageContainer` deviation (documented).** The master plan says "wrap page content in `<PageContainer>`," but the `(platform)` shell `<main>` already pads (`p-6 lg:p-8`, see `src/app/[locale]/(platform)/layout.tsx:23`; the lesson view escapes it with `-m-6 lg:-m-8`). Adopting `PageContainer` (which adds its own `px-4 sm:px-6 lg:px-8`) would **double the horizontal gutter** (visible on tablet/mobile) and changing the shell would regress every not-yet-redesigned platform page. So contained 4.2 pages adopt **`PageHeader`** (the gold-divider title recipe — the visible win) and cap width with a **px-less `mx-auto w-full max-w-7xl` wrapper** (uses main's existing gutter, matches the landing's effective width). `PageContainer` is left for a Phase-5 shell refactor that moves the gutter off `<main>`. *(Same class of reviewer-confirmed deviation as 4.0's `text-primary` logo + 4.1's `text-brown` tiles.)*
3. **Completion stays emerald (status, kept).** Course-completed badge + CTA, lesson-row completed states, etc. are pass/status → NOT swept (master keep-list).
4. **Lesson-type → brand (classification).** `theory/code/quiz` are a *type* classification (not pass/fail status) → re-branded: theory `bg-skyblue/10 text-link`, code `bg-leaf/20 text-green-deep`, quiz `bg-gold/20 text-clay-deep`. (This removes the non-brand `blue-500` theory badge and the incidental emerald/amber on code/quiz, which were type labels, not status.)
5. **Ratings kept amber (verify-only).** `course-reviews` rating bars + the shared `ui/star-rating` primitive use the conventional amber rating color (decorative, like the kept-semantic set, and not a track/difficulty classification). Left untouched to avoid a half-swap of a shared primitive; revisit in Phase 5 if desired.

---

## File Structure

**Changed (9 tasks):**
- `src/lib/tracks.ts` + `src/lib/__tests__/tracks.test.ts` — add AA-safe `artGradient` (Task 1)
- `src/components/courses/track-badge.tsx` — single-source from `tracks.ts` (Task 2)
- `src/components/courses/difficulty-badge.tsx` — brand classification (Task 3)
- `src/components/courses/course-card.tsx` — brand-card redesign (Task 4)
- `src/app/[locale]/(platform)/courses/page.tsx` — `PageHeader` + width cap (Task 5)
- `src/components/courses/course-header.tsx` — dark `artGradient` hero, single-source (Task 6)
- `src/components/courses/credential-preview.tsx` — `artGradient` + gold ring/sparkle, single-source (Task 7)
- `src/components/courses/lesson-row.tsx` — brand lesson-type badges (Task 8)
- `src/app/[locale]/(platform)/courses/[courseId]/page.tsx` — width cap + full-surface visual verify (Task 9)

**Verify-only (no change — already on-brand; confirm at the part gate):**
- `src/components/courses/course-grid.tsx`, `filter-sidebar.tsx`, `search-bar.tsx`, `curriculum-list.tsx`, `module-accordion.tsx`, `prerequisite-card.tsx`, `enroll-button.tsx`, `course-reviews.tsx` (amber ratings kept) — palette-clean or semantic-only.
- `src/app/[locale]/(platform)/courses/layout.tsx` (metadata only).
- Lesson surface: `.../lessons/[lessonIndex]/page.tsx`, `src/components/lessons/lesson-content.tsx` (admonitions + Monaco kept), `lesson-sidebar.tsx` (primary + emerald completion), `lesson-complete-button.tsx` (emerald/destructive kept) — full-bleed layout unchanged.

---

## Task 1: `tracks.ts` — add AA-safe `artGradient` (TDD)

**Files:**
- Modify: `src/lib/tracks.ts`
- Test: `src/lib/__tests__/tracks.test.ts`

**Interfaces:**
- Produces: `Track.artGradient: string` (a `from-… to-…` Tailwind gradient of dark stops only) on every track; consumed by Tasks 6 (`course-header`) and 7 (`credential-preview`), and later by cluster 4.5.

- [ ] **Step 1: Write the failing test.** Append inside the `describe('tracks module', …)` block in `src/lib/__tests__/tracks.test.ts`:

```ts
  it('exposes an AA-safe dark artGradient (white text) for every track', () => {
    const DARK_STOP = /^(from|to|via)-(link|clay-deep|rust-deep|green-deep|brown)$/;
    for (const t of ALL_TRACKS) {
      const stops = t.artGradient.trim().split(/\s+/);
      expect(stops.length).toBeGreaterThanOrEqual(2);
      for (const s of stops) expect(s).toMatch(DARK_STOP);
    }
  });
```

- [ ] **Step 2: Run it — verify it fails.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/tracks.test.ts`
Expected: FAIL — `artGradient` is `undefined` (`Cannot read properties of undefined (reading 'trim')`).

- [ ] **Step 3: Add the field to the `Track` interface** in `src/lib/tracks.ts` (after the `tintGradient` doc/field, before the closing `}` of the interface):

```ts
  /** AA-safe DARK gradient for surfaces that overlay WHITE text (hero, credential art). */
  artGradient: string;
```

- [ ] **Step 4: Add the value to each track** in the `TRACKS` map (one line per track, after each `tintGradient`):

```ts
// '1' Solana Core:
    artGradient: 'from-link to-brown',
// '2' DeFi:
    artGradient: 'from-clay-deep to-brown',
// '3' NFT & Metaplex:
    artGradient: 'from-clay-deep to-rust-deep',
// '4' Security:
    artGradient: 'from-rust-deep to-brown',
```

- [ ] **Step 5: Run the tracks tests — verify they pass** (the existing "no off-palette color names" test must still pass: `link`/`clay-deep`/`rust-deep`/`brown` contain none of `violet|purple|indigo|fuchsia|pink|teal`).

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/__tests__/tracks.test.ts`
Expected: PASS (5/5 in this file).

- [ ] **Step 6: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 7: Commit** (verify repo first — see REPO-SAFETY):

```bash
git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel   # must end in /superteam-academy
git -C /Users/rector/local-dev/superteam-academy add app/src/lib/tracks.ts app/src/lib/__tests__/tracks.test.ts
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: add AA-safe dark artGradient to tracks module"
git -C /Users/rector/local-dev/core status   # must be clean
```

---

## Task 2: `track-badge.tsx` — single-source from `tracks.ts`

**Files:**
- Modify: `src/components/courses/track-badge.tsx`

**Interfaces:**
- Consumes: `TRACKS`, `ALL_TRACKS`, `TrackId` from `@/lib/tracks` (each `Track` has `Icon`, `name`, `badgeClass`).
- Produces: unchanged `<TrackBadge trackId={number} trackSlug?={string} className?={string} />` API (consumers in `course-card`, `course-header` keep working).

- [ ] **Step 1: Replace the whole file** with the single-source version (drops the local `TRACK_MAP`/`SLUG_TO_TRACK_ID` color maps; keeps a neutral "General" fallback for an unknown track so behavior is preserved):

```tsx
'use client';

import { GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TRACKS, ALL_TRACKS, type TrackId } from '@/lib/tracks';

interface TrackBadgeProps {
  trackId: number;
  trackSlug?: string;
  className?: string;
}

export function TrackBadge({ trackId, trackSlug, className }: TrackBadgeProps) {
  const track =
    TRACKS[String(trackId) as TrackId] ??
    (trackSlug ? ALL_TRACKS.find((t) => t.slug === trackSlug) : undefined);

  if (!track) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 border-border bg-muted text-muted-foreground',
          className,
        )}
      >
        <GraduationCap className="size-3" />
        General
      </Badge>
    );
  }

  const Icon = track.Icon;
  return (
    <Badge variant="outline" className={cn('gap-1.5', track.badgeClass, className)}>
      <Icon className="size-3" />
      {track.name}
    </Badge>
  );
}
```

*(Note: track names now come from the single source — the NFT badge reads "NFT & Metaplex" and the Security icon is `Shield` per `tracks.ts`. Intentional single-source consistency.)*

- [ ] **Step 2: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'purple|violet|indigo|fuchsia|pink|rose|teal|cyan|blue-[0-9]' src/components/courses/track-badge.tsx`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 4: Commit** (repo-safety checks as in Task 1, Step 7):

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/courses/track-badge.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: source track badge styling from the tracks module"
```

---

## Task 3: `difficulty-badge.tsx` — brand classification colors

**Files:**
- Modify: `src/components/courses/difficulty-badge.tsx`

- [ ] **Step 1: Replace the `DIFFICULTY_CONFIG` array** (lines 7–20) with brand classification classes (matches the master §Difficulty + the approved landing map):

```tsx
const DIFFICULTY_CONFIG = [
  {
    key: 'beginner' as const,
    className: 'border-leaf/30 bg-leaf/20 text-green-deep',
  },
  {
    key: 'intermediate' as const,
    className: 'border-gold/30 bg-gold/20 text-clay-deep',
  },
  {
    key: 'advanced' as const,
    className: 'border-rust/30 bg-rust/15 text-rust-deep',
  },
] as const;
```

*(Leave the rest of the file unchanged — `difficulty: number` index into the array, `t(config.key)`, the `<Badge variant="outline">` render.)*

- [ ] **Step 2: Off-palette guard — expect no matches** (difficulty is pure classification now; no emerald/amber/red/blue should remain):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'emerald|amber|red-[0-9]|blue-[0-9]|purple|violet|indigo|fuchsia|pink|rose|teal|cyan' src/components/courses/difficulty-badge.tsx`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/courses/difficulty-badge.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: re-brand difficulty badge to warm classification colors"
```

---

## Task 4: `course-card.tsx` — brand-card redesign (matches the approved landing card)

**Files:**
- Modify: `src/components/courses/course-card.tsx`

**Interfaces:**
- Consumes: `getTrack` from `@/lib/tracks`; the now-brand `TrackBadge`/`DifficultyBadge` (Tasks 2–3); `CourseWithMeta` (`trackId:number`, `trackSlug`, `difficulty:number`, `imageUrl`, `lessonCount`, `estimatedHours`, `totalXp`, `title`, `description`, `slug`).
- Produces: unchanged `<CourseCard course enrollment? />` API.

Replaces the dark vivid `TRACK_GRADIENTS` header (white badges on `bg-black/30`) with the approved brand card from `featured-courses.tsx`: a light `track.tintGradient` image header, an XP pill, brand badges in the body (no white overrides), and the existing stats/progress/CTA. **Completion stays emerald (status).**

- [ ] **Step 1: Replace the imports + the gradient consts + the component body.** Replace lines 1–148 (the imports through the end of `export function CourseCard`) with:

```tsx
'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BookOpen, Clock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DifficultyBadge } from '@/components/courses/difficulty-badge';
import { TrackBadge } from '@/components/courses/track-badge';
import { getTrack } from '@/lib/tracks';
import { cn } from '@/lib/utils';
import type { CourseWithMeta } from '@/lib/stores/course-store';

interface CourseCardProps {
  course: CourseWithMeta;
  enrollment?: {
    progressPercent: number;
    isFinalized: boolean;
  };
}

export function CourseCard({ course, enrollment }: CourseCardProps) {
  const t = useTranslations('courses');

  const track = getTrack(String(course.trackId));
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.isFinalized ?? false;

  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col gap-0 overflow-hidden border-2 border-brown/10 py-0 transition-all duration-200 group-hover:scale-[1.01] hover:border-skyblue/30 hover:shadow-md">
        {/* Brand tint header */}
        <div
          className={cn(
            'relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br',
            track.tintGradient,
          )}
        >
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt=""
              fill
              className="absolute inset-0 object-cover"
              unoptimized
            />
          ) : (
            <track.Icon className="size-10 text-foreground/20" />
          )}
          {/* XP pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            <Sparkles className="size-3 text-clay-deep" />
            <span className="tabular-nums">{course.totalXp.toLocaleString()}</span>
          </div>
          {/* Completion badge (emerald = status, kept) */}
          {isCompleted && (
            <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
              <CheckCircle2 className="size-3.5" />
              {t('completed')}
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          {/* Brand badges (no white overrides — they sit on the card surface now) */}
          <div className="flex flex-wrap items-center gap-2">
            <TrackBadge trackId={course.trackId} trackSlug={course.trackSlug} />
            <DifficultyBadge difficulty={course.difficulty} />
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-base leading-tight font-semibold tracking-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {course.description}
          </p>

          {/* Stats row */}
          <div className="mt-auto flex items-center gap-4 text-xs">
            <StatItem icon={BookOpen} value={course.lessonCount} label={t('lessons')} />
            <StatItem icon={Clock} value={course.estimatedHours} label={t('hours')} />
            <StatItem icon={Sparkles} value={course.totalXp} label={t('xp')} />
          </div>

          {/* Progress (enrolled, not finalized) */}
          {isEnrolled && !isCompleted && (
            <div className="flex flex-col gap-1.5">
              <Progress value={enrollment.progressPercent} className="h-1.5" />
              <span className="text-muted-foreground text-xs">
                {t('progress', { percent: Math.round(enrollment.progressPercent) })}
              </span>
            </div>
          )}

          {/* CTA (completed = emerald status, kept) */}
          <Button
            variant={isEnrolled ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'mt-1 w-full gap-1.5 transition-colors',
              isCompleted && 'bg-emerald-600 text-white hover:bg-emerald-700',
            )}
            tabIndex={-1}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="size-3.5" />
                {t('completed')}
              </>
            ) : isEnrolled ? (
              <>
                {t('continue')}
                <ArrowRight className="size-3.5" />
              </>
            ) : (
              t('start')
            )}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
```

*(Leave the `StatItem` helper at the bottom of the file unchanged.)*

- [ ] **Step 2: Off-palette guard — expect no matches** (emerald completion is kept and is not in the pattern):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'purple|violet|indigo|fuchsia|pink|rose|teal|cyan|blue-[0-9]' src/components/courses/course-card.tsx`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/courses/course-card.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: redesign course card to the warm brand-card recipe"
```

---

## Task 5: `courses/page.tsx` (catalog index) — `PageHeader` + width cap

**Files:**
- Modify: `src/app/[locale]/(platform)/courses/page.tsx`

- [ ] **Step 1: Add the import** (after the existing `Badge` import near the top):

```tsx
import { PageHeader } from '@/components/ui/page-header';
```

- [ ] **Step 2: Cap the page width.** Change the root wrapper (line 64) from:

```tsx
    <div className="flex flex-col gap-6">
```

to:

```tsx
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
```

- [ ] **Step 3: Replace the hand-rolled header** (lines 65–73, the `{/* Page header */}` block) with the `PageHeader` recipe (reuses the existing i18n keys — no new translations needed):

```tsx
      {/* Page header */}
      <PageHeader
        title={t('catalog_title')}
        description={t('catalog_description')}
      />
```

- [ ] **Step 4: Off-palette guard — expect no matches.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'purple|violet|indigo|fuchsia|pink|rose|teal|cyan|blue-[0-9]' 'src/app/[locale]/(platform)/courses/page.tsx'`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add 'app/src/app/[locale]/(platform)/courses/page.tsx'
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: adopt PageHeader and width cap on the courses catalog"
```

---

## Task 6: `course-header.tsx` — dark `artGradient` hero, single-source

**Files:**
- Modify: `src/components/courses/course-header.tsx`

**Interfaces:**
- Consumes: `getTrack` from `@/lib/tracks` (`Track.artGradient` from Task 1). White text + white-on-dark badges are correct on this dark hero and are KEPT.

- [ ] **Step 1: Add the import** (with the other `@/lib` imports near the top):

```tsx
import { getTrack } from '@/lib/tracks';
```

- [ ] **Step 2: Delete the hardcoded gradient block** (lines 23–34 — the `// Track gradient map …` comment, the `TRACK_GRADIENTS` const, and the `DEFAULT_GRADIENT` const).

- [ ] **Step 3: Resolve the gradient from the track.** Replace the body line that reads:

```tsx
  const gradient = TRACK_GRADIENTS[course.trackId] ?? DEFAULT_GRADIENT;
```

with:

```tsx
  const gradient = getTrack(String(course.trackId)).artGradient;
```

*(Everything else stays: the `bg-gradient-to-br … text-white` container, the decorative SVG dot overlay, the white-override `TrackBadge`/`DifficultyBadge`, the `StatPill`s, and `CreatorWallet` with its kept `text-emerald-300` copy-confirm. The hero is now an AA-safe dark brand gradient instead of vivid purple/blue/pink.)*

- [ ] **Step 4: Off-palette guard — expect no matches** (kept: `emerald-300` copy tick):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'purple|violet|indigo|fuchsia|pink|rose|teal|cyan|blue-[0-9]' src/components/courses/course-header.tsx`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/courses/course-header.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: re-brand course hero to an AA-safe dark track gradient"
```

---

## Task 7: `credential-preview.tsx` — `artGradient` + gold ring/sparkle, single-source

**Files:**
- Modify: `src/components/courses/credential-preview.tsx`

**Interfaces:**
- Consumes: `getTrack` from `@/lib/tracks` (`artGradient`, `name`, `Icon`).

- [ ] **Step 1: Replace the imports + the local maps.** Replace lines 1–42 (imports through the `TRACK_NAMES` const) with:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Award, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getTrack } from '@/lib/tracks';
```

- [ ] **Step 2: Resolve the track.** Replace the two resolver lines in the body:

```tsx
  const accent = CREDENTIAL_ACCENTS[trackId] ?? DEFAULT_ACCENT;
  const trackName = TRACK_NAMES[trackId] ?? 'General';
```

with:

```tsx
  const track = getTrack(String(trackId));
  const trackName = track.name;
  const TrackIcon = track.Icon;
```

- [ ] **Step 3: Re-skin the NFT mockup box.** Replace the mockup `<div>` (the element with `accent.gradient`/`accent.ring`) and its inner icon/sparkle so it uses the dark `artGradient`, a brand gold ring, the track icon, white text (AA-safe on the dark gradient), and a gold sparkle. Replace the block from `{/* NFT mockup */}` through its closing `</div>` (the `accent`-based outer box, lines ~78–97) with:

```tsx
        {/* NFT mockup */}
        <div
          className={cn(
            'relative flex size-32 items-center justify-center rounded-2xl bg-gradient-to-br ring-4 ring-gold/40 sm:size-36',
            track.artGradient,
          )}
        >
          {/* Inner decoration */}
          <div className="absolute inset-2 rounded-xl border border-white/20" />
          <div className="relative flex flex-col items-center gap-1">
            <TrackIcon className="size-10 text-white sm:size-12" />
            <span className="text-[10px] font-bold tracking-wider text-white uppercase">
              {trackName}
            </span>
          </div>

          {/* Corner sparkle */}
          <Sparkles className="absolute -top-1.5 -right-1.5 size-5 text-gold drop-shadow-sm" />
        </div>
```

*(Leave the rest unchanged: the `Award` card label, `Separator`, the metadata row using `trackName`/`totalXp`/"Soulbound", and the CTA text. Track-name label bumped from `text-white/70` to `text-white` for AA on the dark gradient.)*

- [ ] **Step 4: Off-palette guard — expect no matches** (all of `purple/blue/pink/orange/amber` removed):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'purple|violet|indigo|fuchsia|pink|rose|teal|cyan|blue-[0-9]|amber|orange' src/components/courses/credential-preview.tsx`
Expected: no matches (exit 1).

- [ ] **Step 5: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/courses/credential-preview.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: re-brand credential preview to the track art gradient"
```

---

## Task 8: `lesson-row.tsx` — brand lesson-type badges

**Files:**
- Modify: `src/components/courses/lesson-row.tsx`

- [ ] **Step 1: Replace the `LESSON_TYPE_CONFIG` className values** (lines 45–59) so theory/code/quiz are brand classification (keep the icons + labels; only the `className` strings change):

```tsx
  theory: {
    icon: BookOpen,
    label: 'Theory',
    className: 'border-skyblue/25 bg-skyblue/10 text-link',
  },
  code: {
    icon: Code2,
    label: 'Code',
    className: 'border-leaf/30 bg-leaf/20 text-green-deep',
  },
  quiz: {
    icon: HelpCircle,
    label: 'Quiz',
    className: 'border-gold/30 bg-gold/20 text-clay-deep',
  },
```

*(Leave the completed/locked number circle + the `text-emerald-*` completed states + `decoration-emerald-500/40` strikethrough untouched — those are status, kept.)*

- [ ] **Step 2: Off-palette guard — expect no matches** (the type badges are now brand; emerald completion stays and is excluded from the pattern):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'purple|violet|indigo|fuchsia|pink|rose|teal|cyan|blue-[0-9]|amber|red-[0-9]' src/components/courses/lesson-row.tsx`
Expected: no matches (exit 1).

- [ ] **Step 3: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 4: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add app/src/components/courses/lesson-row.tsx
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: re-brand lesson-type badges to classification colors"
```

---

## Task 9: `courses/[courseId]/page.tsx` — width cap + full-surface visual verify

**Files:**
- Modify: `src/app/[locale]/(platform)/courses/[courseId]/page.tsx`

- [ ] **Step 1: Cap the detail-page width.** Change the main return root (line 63) from:

```tsx
    <div className="flex flex-col gap-6">
```

to:

```tsx
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
```

- [ ] **Step 2: Match the loading skeleton width** (avoid a load→content layout shift). In `CourseDetailSkeleton()`, add `mx-auto w-full max-w-7xl` to its outermost wrapper `<div>`'s className (it currently begins `flex flex-col gap-6`).

- [ ] **Step 3: Off-palette guard — expect no matches** (kept: emerald arweave badge + emerald verification):

Run: `cd /Users/rector/local-dev/superteam-academy/app && rg -n 'purple|violet|indigo|fuchsia|pink|rose|teal|cyan|blue-[0-9]' 'src/app/[locale]/(platform)/courses/[courseId]/page.tsx'`
Expected: no matches (exit 1).

- [ ] **Step 4: Build + typecheck.**

Run: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && npx tsc --noEmit`
Expected: build green, tsc clean.

- [ ] **Step 5: Visual verify the whole detail surface** (prod server + Chrome MCP, light + dark). Start once: `cd /Users/rector/local-dev/superteam-academy/app && pnpm build && PORT=3000 pnpm start`. Open a real seeded course (e.g. `/en/courses/solana-101`). Confirm: dark AA-safe branded hero (no purple/blue/pink), brand track + difficulty badges, the credential preview card with the dark track art-gradient + gold ring/sparkle + readable white text, curriculum lesson-type badges in brand colors, and that dark theme is not broken (toggle). Capture the catalog (`/en/courses`) too (PageHeader gold divider + brand cards).

- [ ] **Step 6: Commit:**

```bash
git -C /Users/rector/local-dev/superteam-academy add 'app/src/app/[locale]/(platform)/courses/[courseId]/page.tsx'
git -C /Users/rector/local-dev/superteam-academy commit -m "feat: width-cap the course detail page"
```

---

## Part Gate (run after all 9 tasks — do NOT skip)

- [ ] **Unit tests:** `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run` → **375 passing** (374 + the new tracks test).
- [ ] **Cluster off-palette guard #1 (track/decorative intruders, all 4.2 surfaces):**
  `rg -n 'purple|violet|indigo|fuchsia|pink|rose|teal|cyan' src/components/courses src/components/lessons 'src/app/[locale]/(platform)/courses'` → **zero**.
- [ ] **Cluster off-palette guard #2 (non-semantic blue in course components):**
  `rg -n 'blue-[0-9]' src/components/courses` → **zero**. *(The kept info-admonition blue lives in `src/components/lessons/lesson-content.tsx` and is intentionally out of this scope.)*
- [ ] **Build + typecheck:** `pnpm build` green · `npx tsc --noEmit` clean.
- [ ] **Visual smoke (prod server, light + dark)** on all three routes: catalog index (`/en/courses`), course detail (`/en/courses/solana-101`), lesson view (`/en/courses/solana-101/lessons/0`). Confirm brand coherence + dark not broken + AA on the hero/credential white text.
- [ ] **e2e (if the dev server cooperates / in CI):** `pkill -f 'next dev'; pkill -f 'next-server'; lsof -ti:3000 | xargs kill -9` then one `pnpm exec playwright test --project=chromium` (36 passing). Infra-block is acceptable evidence-substitute per the master gate (precedent: 4.0/4.1).
- [ ] **Read-only opus review** of the cluster diff (`git -C /Users/rector/local-dev/superteam-academy diff b58c40f..HEAD -- app/`): track single-sourcing complete, no off-palette residue (minus kept-list), white-on-gradient AA holds, theme-adaptive, import hygiene, no AI attribution.
- [ ] **Update the SDD ledger** `/Users/rector/local-dev/superteam-academy/.git/sdd/progress.md` with the cluster result.

---

## Self-Review (against the master plan + recon)

1. **Track single-sourcing coverage:** every hardcoded track map found in recon is migrated — `course-card` (Task 4), `track-badge` (Task 2), `course-header` (Task 6), `credential-preview` (Task 7). ✓
2. **Master Appendix-A "deferred set" for 4.2** (course-card / course-header / credential-preview / track-badge / lesson-row) all have tasks. ✓
3. **AA white-on-gradient defects** (the recon-flagged `from-primary to-accent` + vivid track gradients overlaying white text) fixed via `artGradient` dark stops on hero (Task 6) + credential (Task 7); worst stop = `link` 5.42:1. ✓
4. **Difficulty + lesson-type → brand classification** (Tasks 3, 8); semantic status (emerald/amber/blue admonitions, completion, verification, Monaco, destructive) explicitly kept. ✓
5. **PageHeader recipe** adopted on the catalog (Task 5); `PageContainer` deviation documented with rationale. ✓
6. **No placeholders:** every code step shows complete code; every verify step is a runnable command with expected output. ✓
7. **Type consistency:** `getTrack(String(course.trackId))` used everywhere `trackId` is the numeric `CourseWithMeta` field; `Track.artGradient` defined in Task 1 before its Task 6/7 consumers. ✓
8. **Repo-safety** (twin `core`) baked into every commit step. ✓
9. **Right-sized tasks:** 9 independently buildable/guardable/committable units; ~11 components left verify-only with stated reasons (sound composition + palette-clean/semantic-only) — flag to RECTOR if deeper recomposition is wanted on any.
