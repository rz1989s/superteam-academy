# Phase 5 · Sub-plan 3 — Demo-Gating + Console Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (CONTROLLER-INLINE — implement edits yourself, NEVER delegate to subagents; twin-repo hazard). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make the demo "feel real, nothing broken" — hide demo-inappropriate surfaces (OAuth sign-in, Sanity CMS, on-chain signing actions), eliminate the stale-serving service worker, and get a clean browser console — with zero dead buttons and zero 401s.

**Architecture:** Reuse the `isDemoMode()` gate from sub-plan 2. Each gate is additive and demo-only: components/routes that need real secrets or on-chain signing either don't render, redirect, or short-circuit with a friendly demo message when `isDemoMode()`. The two pre-existing console errors are addressed at their source (authjs by not mounting the session layer in demo; next-themes #418 via systematic-debugging).

**Tech Stack:** Next.js 16.1.6 App Router, TypeScript, next-auth/react (authjs), next-themes, `@solana/wallet-adapter-react`, sonner toasts, Vitest, pnpm (from `app/`).

## Global Constraints

- **Working root:** `/Users/rector/local-dev/superteam-academy/app`; shell resets to `core` after each command → prefix every command with `cd /Users/rector/local-dev/superteam-academy/app &&`.
- **★ Twin-repo safety:** before every commit `git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel` ends in `/superteam-academy`; commit with `git -C …`; after every commit `git -C /Users/rector/local-dev/core status --short` shows nothing academy. Never stage/commit in `core`.
- **Additive + demo-only:** every gate is `if (isDemoMode()) …`; real (non-demo) behavior must be byte-unchanged.
- **Per-task gate:** `cd app && pnpm build` (green) + `npx tsc --noEmit` (clean) + any task tests.
- **Commits:** conventional `type: description`, one per task, GPG-signed, **NO AI attribution**.
- **Demo bar (spec §7):** zero empty states, zero dead buttons, zero 401s, clean console, both themes pixel-perfect.
- **Visual gate:** build with `NEXT_PUBLIC_DEMO_MODE=true` (NEXT_PUBLIC_* inlined at build); clear the stale SW (`navigator.serviceWorker` unregister + `caches` delete) before reading; **read the console** to confirm it's clean.

## Decisions (defaults — confirm at review)

- **Signing controls in demo mode:** keep the buttons visible but short-circuit the action with a friendly `toast.info('Demo mode', { description: '…' })` — no signing attempt, no error toast. (Alternative: hide them. Recommended: keep visible so the UI reads complete.)
- **Sanity studio (`/studio`):** `notFound()` in demo mode (it needs CMS creds and isn't linked from nav).
- **next-themes #418:** root-cause via systematic-debugging; fix if clean, otherwise document why it's benign + suppress at the boundary.
- **Admin/creator:** already URL-only (NOT in `NAV_ITEMS`) and locked by the authority gate (sub-plan 2). No nav links to hide; leave the "Unauthorized" page as the safe fallback (optionally `notFound()` in demo — folded into T3 if desired).

## File Structure

| File | Change |
|---|---|
| `src/components/providers/sw-provider.tsx` | skip SW registration in demo mode |
| `src/components/providers/auth-provider.tsx` | skip `SessionProvider` in demo mode |
| `src/components/layout/header.tsx` | gate `<SignInMenu/>` off in demo mode |
| `src/components/layout/mobile-nav.tsx` | gate `<SignInMenu/>` off in demo mode |
| `src/app/studio/[[...tool]]/page.tsx` | `notFound()` in demo mode |
| `src/components/courses/enroll-button.tsx` | demo short-circuit in `handleEnroll` |
| `src/components/lessons/lesson-complete-button.tsx` | demo short-circuit in the complete handler |
| `src/components/dashboard/claim-achievement-button.tsx` | demo short-circuit in the claim handler |
| `src/app/[locale]/layout.tsx` / `theme-provider.tsx` | #418 hydration fix (TBD by debugging) |

---

## Task 1: Disable the service worker in demo mode

**Files:** Modify `src/components/providers/sw-provider.tsx`. (No unit test — it's a `navigator.serviceWorker` effect; verified by the console/visual gate.)

The SW (`rca-v1-static`/`rca-v1-dynamic`) registers whenever `NODE_ENV==='production'`, which includes the demo build — it serves stale chunks across reloads and adds console noise. Skip it in demo mode.

- [ ] **Step 1: Implement** — add the demo guard at the top of the effect:

```tsx
import { isDemoMode } from '@/lib/demo';
// …inside useEffect, first line:
if (isDemoMode()) return;
if (!('serviceWorker' in navigator)) return;
```

- [ ] **Step 2: Build + tsc** — `cd app && pnpm build && npx tsc --noEmit` → green/clean.
- [ ] **Step 3: Commit** — `feat: skip the service worker in demo mode`

---

## Task 2: Hide OAuth sign-in + silence the authjs console error

**Files:** Modify `src/components/providers/auth-provider.tsx`, `src/components/layout/header.tsx`, `src/components/layout/mobile-nav.tsx`.

`SignInMenu` is the sole `useSession()` consumer; that hook (+ the `/api/auth/providers-status` fetch) triggers the authjs "server configuration" console error in a build with no OAuth env. The visible button already self-hides when no providers are configured, so the only remaining work is to stop the session layer from running in demo mode.

- [ ] **Step 1: Gate the SessionProvider** — `auth-provider.tsx`:

```tsx
import { isDemoMode } from '@/lib/demo';
// in the provider body, before returning <SessionProvider>:
if (isDemoMode()) return <>{children}</>;
```

- [ ] **Step 2: Gate the menu in the header** — `header.tsx`: replace `<SignInMenu />` with `{!isDemoMode() && <SignInMenu />}` (add `import { isDemoMode } from '@/lib/demo';`). The wallet-connect button already shows the connected demo identity, so no auth UI is needed.

- [ ] **Step 3: Gate the menu in mobile-nav** — `mobile-nav.tsx`: same `{!isDemoMode() && <SignInMenu />}` guard + import.

- [ ] **Step 4: Build + tsc** → green/clean.
- [ ] **Step 5: Commit** — `feat: hide OAuth sign-in and skip the session layer in demo mode`

---

## Task 3: Hide the Sanity studio (CMS) in demo mode

**Files:** Modify `src/app/studio/[[...tool]]/page.tsx`.

`/studio` renders `NextStudio` (live Sanity CMS), which needs creds and is out of scope for the demo. It isn't linked from nav, but direct-URL load should not expose it.

- [ ] **Step 1: Implement** — at the top of the studio page component, return `notFound()` in demo mode:

```tsx
import { notFound } from 'next/navigation';
import { isDemoMode } from '@/lib/demo';
// first line of the page component:
if (isDemoMode()) notFound();
```

> Note: the studio page is outside `[locale]`. Confirm it's a server component (so `notFound()` works); if it's `'use client'`, gate by rendering a `notFound()`-equivalent or redirect via `useRouter` in an effect — verify during execution.

- [ ] **Step 2: Build + tsc** → green/clean.
- [ ] **Step 3: Commit** — `feat: hide the Sanity studio in demo mode`

---

## Task 4: Demo-gate the on-chain signing controls (no dead buttons)

**Files:** Modify `src/components/courses/enroll-button.tsx`, `src/components/lessons/lesson-complete-button.tsx`, `src/components/dashboard/claim-achievement-button.tsx`.

In demo mode the wallet adapter's signing throws, so enroll / complete-lesson / claim-achievement would surface an error toast — a "dead button." Short-circuit each handler with a friendly demo message before the signing call. (The demo learner is already enrolled in 3 seeded courses, so most enroll buttons already show the enrolled state; this covers the rest + the lesson/claim actions.)

Pattern (apply in each handler, before the signing call):

```tsx
import { isDemoMode } from '@/lib/demo';
import { toast } from 'sonner';
// at the start of handleEnroll / handleComplete / handleClaim:
if (isDemoMode()) {
  toast.info(t('demo_mode_title'), { description: t('demo_mode_desc') });
  return;
}
```

- [ ] **Step 1: Add i18n copy** — add `demo_mode_title` ("Demo mode") and `demo_mode_desc` ("Sign-in and on-chain actions are disabled in this demo.") to the relevant namespaces in `src/messages/en.json` (and pt/es/hi, or fall back to en). Verify the exact namespaces each button uses (`courses`, `lesson`, the claim button's namespace) during execution.
- [ ] **Step 2: Gate `enroll-button.tsx`** — add the guard at the top of `handleEnroll` (read the file; insert before `await enroll(...)`).
- [ ] **Step 3: Gate `lesson-complete-button.tsx`** — same guard before `await completeLesson(...)`.
- [ ] **Step 4: Gate `claim-achievement-button.tsx`** — same guard before the `signTransaction` call.
- [ ] **Step 5: Build + tsc** → green/clean.
- [ ] **Step 6: Commit** — `feat: short-circuit on-chain actions with a demo message in demo mode`

---

## Task 5: Resolve the next-themes #418 hydration error (systematic-debugging)

**Files:** likely `src/app/[locale]/layout.tsx` and/or `src/components/providers/theme-provider.tsx` (exact fix determined by debugging).

The console shows React #418 (`args[]=HTML`) on every load. `<html suppressHydrationWarning>` is already set and the provider uses `attribute="class" enableSystem`. **Use superpowers:systematic-debugging** — reproduce, find the exact element whose SSR/client markup diverges (it may not be the theme at all), fix at root, and confirm the console is clean. If the root cause is a genuinely-benign next-themes script attribute, document why and ensure `suppressHydrationWarning` is on the exact mismatching element.

- [ ] **Step 1: Reproduce + instrument** — build with the flag, load a page, read the console; if minified, temporarily run a dev build or read the non-minified component tree to identify the mismatching element.
- [ ] **Step 2: Root-cause** — confirm whether it's next-themes (`<html>` class) or another SSR/client divergence (e.g., a `Date`/locale/`window` read during render).
- [ ] **Step 3: Fix at root** (e.g., correct `suppressHydrationWarning` placement, or gate a client-only read behind a mounted flag) + regression-guard if unit-testable.
- [ ] **Step 4: Verify** — clean console (no #418) on dashboard + one other route, both themes.
- [ ] **Step 5: Commit** — `fix: resolve the next-themes hydration mismatch` (message reflects the actual root cause)

---

## Task 6: Part gate + visual verification

- [ ] **Step 1: Unit gate** — `cd app && pnpm test:run` (all green) + `npx tsc --noEmit` clean.
- [ ] **Step 2: Build with flag + serve** — `NEXT_PUBLIC_DEMO_MODE=true pnpm build && NEXT_PUBLIC_DEMO_MODE=true PORT=3000 pnpm start`.
- [ ] **Step 3: e2e** — `pnpm exec playwright test --project=chromium` → 36/36.
- [ ] **Step 4: Chrome MCP, BOTH themes** — clear the SW first; then verify:
  - **Console is clean** (no authjs error, no #418, no SW noise) — read_console_messages with no/`error` filter.
  - **No OAuth UI** in header/mobile-nav; the demo identity shows instead.
  - `/studio` → 404 (hidden).
  - **No dead buttons:** click Enroll on a non-enrolled course, a lesson Complete, and a claim — each shows the friendly demo toast, no error.
  - Nav sweep: every `NAV_ITEMS` target resolves (no 401/404); `/admin` stays locked (no nav link).
- [ ] **Step 5: Cleanup** — `lsof -ti:3000 | xargs kill`; close the Chrome tab.
- [ ] **Step 6: Read-only opus review** over the sub-plan diff; resolve Critical/Important.
- [ ] **Step 7: Ledger** — append the sub-plan-3 record to `.git/sdd/progress.md`.

---

## Self-Review (against the spec)

- **Spec §7 "OAuth hidden":** T2. **"live Sanity CMS hidden":** T3. **"on-chain minting hidden / zero dead buttons":** T4. **"clean console":** T2 (authjs) + T5 (#418) + T1 (SW noise). **"zero 401s / every nav target resolves":** T6 audit.
- **Carry-from sub-plan 2:** SW stale-serving (T1), admin/creator entry points (already URL-only + locked; T3 note), 2 console errors (T2 + T5).
- **Additive-only:** every change is an `isDemoMode()` early-return/guard; non-demo behavior unchanged.
- **Out of scope (later):** dark-mode polish (sub-plan 4); fresh repo + domain + deploy (sub-plan 5); the sub-plan-2 nits (peer-profile, fixed dates).
