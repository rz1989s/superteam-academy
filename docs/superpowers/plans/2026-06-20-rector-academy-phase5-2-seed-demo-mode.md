# Phase 5 · Sub-plan 2 — Seed-Data Demo Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (CONTROLLER-INLINE — implement edits yourself, NEVER delegate to subagents) to implement this plan task-by-task. The controller cwd is the `core` twin repo; see Global Constraints. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Tier-1 page render a rich, populated demo identity with zero empty states — no wallet connection required — by adding an additive seed-data branch at each data seam.

**Architecture:** A single `NEXT_PUBLIC_DEMO_MODE` flag gates a new `src/lib/demo/` module (a flag helper, deterministic seed fixtures, and an auto-connecting demo wallet adapter). In demo mode the wallet adapter reports a fixed demo pubkey as connected, so all existing `useWallet().publicKey` consumers light up unchanged; the four data seams (`api/profile`, `api/leaderboard`, `lib/solana/credentials`, and the user-store's `fetchUserData`) return seed fixtures instead of reading Helius/on-chain. Every branch returns early and leaves the real-mode code path untouched.

**Tech Stack:** Next.js 16.1.6 (App Router), TypeScript, Zustand, `@solana/wallet-adapter-base` / `-react`, Vitest + `@testing-library/react`, pnpm (run from `app/`).

## Global Constraints

- **Working root:** all `pnpm`/path-relative commands run from `/Users/rector/local-dev/superteam-academy/app` (deploy root; no root `package.json`). The shell RESETS to `core` after every command — prefix each command with `cd /Users/rector/local-dev/superteam-academy/app &&`.
- **★ Twin-repo safety (load-bearing):** controller cwd = `core`, a structural twin. Before EVERY commit: `git -C /Users/rector/local-dev/superteam-academy rev-parse --show-toplevel` must end in `/superteam-academy`; commit with `git -C /Users/rector/local-dev/superteam-academy …`. After EVERY commit: `git -C /Users/rector/local-dev/core status --short` must show NOTHING academy. Never stage/commit in `core`.
- **Additive only:** every demo branch returns early; the existing real-mode (Helius/on-chain) path stays the untouched `else`.
- **Flag:** `isDemoMode()` reads `process.env.NEXT_PUBLIC_DEMO_MODE === 'true'`. Next inlines `NEXT_PUBLIC_*` at **build** time → the visual gate and any deploy MUST build with the flag set.
- **TDD:** RED → GREEN per task. One focused commit per task, conventional `type: description`, GPG-signed, **NO AI attribution** (no `Co-Authored-By` / "Generated with Claude").
- **Per-task gate:** `cd app && pnpm build` (green) + `npx tsc --noEmit` (clean) + the task's tests.
- **Durable ledger:** append progress to `/Users/rector/local-dev/superteam-academy/.git/sdd/progress.md`.

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/demo/index.ts` (new) | `isDemoMode()` flag helper — the single gate import |
| `src/lib/demo/seed.ts` (new) | Deterministic fixtures: `DEMO_WALLET`, `DEMO_PROFILE`, `DEMO_STREAK`, `DEMO_ENROLLMENTS`, `DEMO_CREDENTIALS`, `DEMO_ACHIEVEMENTS`, `DEMO_LEADERBOARD` |
| `src/lib/demo/wallet-adapter.ts` (new) | `DemoWalletAdapter` (auto-connect, fixed pubkey, signing disabled) + `DemoWalletName` |
| `src/lib/demo/__tests__/*.test.ts` (new) | Unit tests for the above |
| `src/app/api/profile/[wallet]/route.ts` (modify) | Demo branch → seed profile |
| `src/app/api/leaderboard/route.ts` (modify) | Demo branch → seed cohort |
| `src/lib/solana/credentials.ts` (modify) | Demo branch in `getCredentialsByOwner` + `getCredentialById` |
| `src/lib/stores/user-store.ts` (modify) | Demo branch in `fetchUserData` → populate from seed |
| `src/components/providers/wallet-provider.tsx` (modify) | Register + auto-select `DemoWalletAdapter` in demo mode |

---

## Task 1: Demo-mode flag helper

**Files:**
- Create: `src/lib/demo/index.ts`
- Test: `src/lib/demo/__tests__/index.test.ts`

**Interfaces:**
- Produces: `isDemoMode(): boolean` — true iff `process.env.NEXT_PUBLIC_DEMO_MODE === 'true'`.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, afterEach, vi } from 'vitest';
import { isDemoMode } from '../index';

describe('isDemoMode', () => {
  afterEach(() => { vi.unstubAllEnvs(); });

  it('is true when NEXT_PUBLIC_DEMO_MODE === "true"', () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
    expect(isDemoMode()).toBe(true);
  });

  it('is false when the flag is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', '');
    expect(isDemoMode()).toBe(false);
  });

  it('is false for any value other than "true"', () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', '1');
    expect(isDemoMode()).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails** — `cd /Users/rector/local-dev/superteam-academy/app && pnpm test:run src/lib/demo/__tests__/index.test.ts` → FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/demo/index.ts
/**
 * Whether the app runs in seed-data demo mode. Gated by the build-time
 * NEXT_PUBLIC_DEMO_MODE env var (Next inlines NEXT_PUBLIC_* at build).
 * In demo mode the data seams return deterministic seed fixtures instead
 * of reading Helius / on-chain state.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}
```

- [ ] **Step 4: Run test to verify it passes** — same command → PASS.

- [ ] **Step 5: Commit** — `feat: add isDemoMode flag helper for seed-data demo mode`

---

## Task 2: Seed fixtures

**Files:**
- Create: `src/lib/demo/seed.ts`
- Test: `src/lib/demo/__tests__/seed.test.ts`

**Interfaces:**
- Consumes: `Credential` from `@/lib/solana/credentials`; `EnrollmentData`, `StreakState` from `@/lib/stores/user-store`; `LeaderboardEntry` from `@/lib/hooks/use-leaderboard`; `calculateLevel`, `getLevelTitle` from `@/lib/solana/xp`.
- Produces:
  - `DEMO_WALLET: string` (base58 devnet pubkey)
  - `DEMO_PROFILE: { wallet: string; xp: number; level: number; levelTitle: string }`
  - `DEMO_STREAK: StreakState`
  - `DEMO_ENROLLMENTS: EnrollmentData[]`
  - `DEMO_CREDENTIALS: Credential[]`
  - `DEMO_ACHIEVEMENTS: string[]`
  - `DEMO_LEADERBOARD: LeaderboardEntry[]`

**Notes:**
- `DEMO_WALLET` must be a valid base58 pubkey (the test asserts `new PublicKey(DEMO_WALLET)` parses). Use a fixed devnet learner address.
- `DEMO_PROFILE.xp = 6400` → `calculateLevel(6400) = 8` (`Master`) → exercises the level-badge prestige tier (7–11 pips).
- `DEMO_LEADERBOARD` ranks the demo wallet **#2** (clay podium slot) so the podium gold/clay/rust ramp AND the "your rank" highlight both render; entries sorted by `xpBalance` desc with sequential `rank`.
- Achievement ids MUST exist in the achievements catalog (the test cross-checks against `seedAchievements`/the rarity catalog).
- Credentials use `frozen: true` (soulbound) and span ≥3 tracks (Core/DeFi/Security via `trackId` 0/1/3) so the credential gallery art shows multiple gradients.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import { calculateLevel, getLevelTitle } from '@/lib/solana/xp';
import {
  DEMO_WALLET, DEMO_PROFILE, DEMO_LEADERBOARD, DEMO_CREDENTIALS,
  DEMO_ACHIEVEMENTS, DEMO_ENROLLMENTS,
} from '../seed';

describe('demo seed fixtures', () => {
  it('DEMO_WALLET is a valid pubkey', () => {
    expect(() => new PublicKey(DEMO_WALLET)).not.toThrow();
  });

  it('DEMO_PROFILE level/title are derived from its xp', () => {
    expect(DEMO_PROFILE.level).toBe(calculateLevel(DEMO_PROFILE.xp));
    expect(DEMO_PROFILE.levelTitle).toBe(getLevelTitle(DEMO_PROFILE.level));
    expect(DEMO_PROFILE.wallet).toBe(DEMO_WALLET);
  });

  it('the demo wallet sits on the podium in the leaderboard with matching xp', () => {
    const me = DEMO_LEADERBOARD.find((e) => e.wallet === DEMO_WALLET);
    expect(me).toBeDefined();
    expect(me!.rank).toBeLessThanOrEqual(3);
    expect(me!.xpBalance).toBe(DEMO_PROFILE.xp);
  });

  it('leaderboard is sorted by xp desc with sequential ranks', () => {
    for (let i = 1; i < DEMO_LEADERBOARD.length; i++) {
      expect(DEMO_LEADERBOARD[i]!.xpBalance).toBeLessThanOrEqual(DEMO_LEADERBOARD[i - 1]!.xpBalance);
      expect(DEMO_LEADERBOARD[i]!.rank).toBe(DEMO_LEADERBOARD[i - 1]!.rank + 1);
    }
    expect(DEMO_LEADERBOARD[0]!.rank).toBe(1);
  });

  it('every credential is owned by the demo wallet and soulbound', () => {
    expect(DEMO_CREDENTIALS.length).toBeGreaterThanOrEqual(3);
    for (const c of DEMO_CREDENTIALS) {
      expect(c.owner).toBe(DEMO_WALLET);
      expect(c.frozen).toBe(true);
    }
  });

  it('has at least one enrollment and several achievements', () => {
    expect(DEMO_ENROLLMENTS.length).toBeGreaterThan(0);
    expect(DEMO_ACHIEVEMENTS.length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails** — `pnpm test:run src/lib/demo/__tests__/seed.test.ts` → FAIL (module not found).

- [ ] **Step 3: Write minimal implementation** — create `src/lib/demo/seed.ts`. Derive `level`/`levelTitle` from `xp` via the xp helpers (never hardcode them). Concrete shape:

```typescript
import type { Credential } from '@/lib/solana/credentials';
import type { EnrollmentData, StreakState } from '@/lib/stores/user-store';
import type { LeaderboardEntry } from '@/lib/hooks/use-leaderboard';
import { calculateLevel, getLevelTitle } from '@/lib/solana/xp';

/** Fixed devnet learner identity for the public demo. Never signs. */
export const DEMO_WALLET = 'ACAd3USj2sMV6drKcMY2wZtNkhVDHWpC4tfJe93hgqYn';

const DEMO_XP = 6400; // calculateLevel(6400) === 8 → "Master" (prestige tier)

export const DEMO_PROFILE = {
  wallet: DEMO_WALLET,
  xp: DEMO_XP,
  level: calculateLevel(DEMO_XP),
  levelTitle: getLevelTitle(calculateLevel(DEMO_XP)),
};

export const DEMO_STREAK: StreakState = {
  currentStreak: 12,
  longestStreak: 30,
  lastActiveDate: '2026-06-20',
  freezesAvailable: 1,
  freezeActiveDate: null,
};

export const DEMO_ENROLLMENTS: EnrollmentData[] = [
  { courseId: 'solana-101', completedLessons: 5, totalLessons: 5, progressPercent: 100, isFinalized: true },
  { courseId: 'defi-201', completedLessons: 3, totalLessons: 6, progressPercent: 50, isFinalized: false },
  { courseId: 'sec-301', completedLessons: 2, totalLessons: 7, progressPercent: 28, isFinalized: false },
];

// trackId: 0=Core, 1=DeFi, 3=Security (credential-attributes TRACK_NAMES, 0-indexed)
export const DEMO_CREDENTIALS: Credential[] = [
  { assetId: 'demo-cred-core', name: 'Introduction to Solana Development', uri: '', imageUrl: '',
    owner: DEMO_WALLET, collection: 'rector-academy', frozen: true,
    attributes: { trackId: 0, level: 1, coursesCompleted: 1, totalXp: 250 }, createdAt: '2026-05-01T00:00:00Z' },
  { assetId: 'demo-cred-defi', name: 'Building a DEX with Anchor', uri: '', imageUrl: '',
    owner: DEMO_WALLET, collection: 'rector-academy', frozen: true,
    attributes: { trackId: 1, level: 2, coursesCompleted: 1, totalXp: 600 }, createdAt: '2026-05-20T00:00:00Z' },
  { assetId: 'demo-cred-sec', name: 'Smart Contract Auditing', uri: '', imageUrl: '',
    owner: DEMO_WALLET, collection: 'rector-academy', frozen: true,
    attributes: { trackId: 3, level: 3, coursesCompleted: 1, totalXp: 900 }, createdAt: '2026-06-10T00:00:00Z' },
];

// Ids must exist in the achievements catalog (verified in the test against seedAchievements).
export const DEMO_ACHIEVEMENTS: string[] = ['first-course', 'streak-7', 'streak-30'];

const RAW_COHORT: Array<{ wallet: string; xpBalance: number; streak: number }> = [
  { wallet: '7nQ...top1', xpBalance: 8100, streak: 21 },   // rank 1 (gold) — replace with valid pubkeys
  { wallet: DEMO_WALLET, xpBalance: DEMO_XP, streak: DEMO_STREAK.currentStreak }, // rank 2 (clay)
  { wallet: '9xR...third', xpBalance: 4900, streak: 9 },   // rank 3 (rust)
  // …extend to ~12 plausible entries with descending xp…
];

export const DEMO_LEADERBOARD: LeaderboardEntry[] = [...RAW_COHORT]
  .sort((a, b) => b.xpBalance - a.xpBalance)
  .map((e, i) => ({ wallet: e.wallet, xpBalance: e.xpBalance, level: calculateLevel(e.xpBalance), rank: i + 1, streak: e.streak }));
```

> Execution note: replace the `7nQ...`/`9xR...` placeholders with **valid base58 pubkeys** (the leaderboard renders identicons from them and `/profile/[wallet]` must parse them). Extend the cohort to ~12 rows. The `new PublicKey()` parse is exercised for `DEMO_WALLET` in the test; add cohort wallets to that assertion when finalized.

- [ ] **Step 4: Run test to verify it passes** — `pnpm test:run src/lib/demo/__tests__/seed.test.ts` → PASS.

- [ ] **Step 5: Cross-check achievement ids exist** — add an assertion importing `seedAchievements` (from `@/lib/sanity/seed-data`) (or the achievements catalog) and asserting every `DEMO_ACHIEVEMENTS` id is present. Adjust ids to real catalog ids if any fail.

- [ ] **Step 6: Commit** — `feat: add demo seed fixtures (identity, credentials, leaderboard cohort)`

---

## Task 3: Profile API demo branch

**Files:**
- Modify: `src/app/api/profile/[wallet]/route.ts`
- Test: `src/app/api/profile/[wallet]/__tests__/route.test.ts` (create if absent — mirror the leaderboard route test)

**Interfaces:**
- Consumes: `isDemoMode` (T1), `DEMO_PROFILE`, `DEMO_LEADERBOARD` (T2), `calculateLevel`/`getLevelTitle`.
- Behavior: in demo mode, look up the requested wallet in `DEMO_LEADERBOARD`; if found return `{ wallet, xp: entry.xpBalance, level, levelTitle }`; otherwise return `DEMO_PROFILE` (keyed to the requested wallet). Invalid-pubkey 400 still applies first.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest';
import { GET } from '../route';
import { DEMO_WALLET, DEMO_PROFILE } from '@/lib/demo/seed';

afterEach(() => vi.unstubAllEnvs());

it('returns the seed profile for the demo wallet in demo mode', async () => {
  vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
  const res = await GET(new Request('http://x'), { params: Promise.resolve({ wallet: DEMO_WALLET }) });
  const body = await res.json();
  expect(body.xp).toBe(DEMO_PROFILE.xp);
  expect(body.level).toBe(DEMO_PROFILE.level);
  expect(body.wallet).toBe(DEMO_WALLET);
});
```

- [ ] **Step 2: Run test → FAIL** (`pnpm test:run src/app/api/profile/[wallet]/__tests__/route.test.ts`).

- [ ] **Step 3: Implement the demo branch** — after the pubkey-validation block, before the Helius `try`:

```typescript
import { isDemoMode } from '@/lib/demo';
import { DEMO_PROFILE, DEMO_LEADERBOARD } from '@/lib/demo/seed';
import { calculateLevel, getLevelTitle } from '@/lib/solana/xp';
// …inside GET, after walletPubkey validates:
if (isDemoMode()) {
  const entry = DEMO_LEADERBOARD.find((e) => e.wallet === wallet);
  const xp = entry ? entry.xpBalance : DEMO_PROFILE.xp;
  const level = calculateLevel(xp);
  return NextResponse.json({ wallet, xp, level, levelTitle: getLevelTitle(level) });
}
```

- [ ] **Step 4: Run test → PASS.**
- [ ] **Step 5: Commit** — `feat: serve seed profile from the profile API in demo mode`

---

## Task 4: Leaderboard API demo branch

**Files:**
- Modify: `src/app/api/leaderboard/route.ts`
- Test: `src/app/api/leaderboard/__tests__/route.test.ts` (exists — add a demo-mode case)

**Interfaces:** Consumes `isDemoMode` (T1), `DEMO_LEADERBOARD` (T2). Returns `{ entries: DEMO_LEADERBOARD, total }` (shape matches `LeaderboardData`, no `dasUnavailable`).

- [ ] **Step 1: Write the failing test**

```typescript
it('returns the seed cohort in demo mode', async () => {
  vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
  const res = await GET();
  const body = await res.json();
  expect(body.entries.length).toBeGreaterThanOrEqual(3);
  expect(body.entries[0].rank).toBe(1);
  expect(body.dasUnavailable).toBeUndefined();
});
```

- [ ] **Step 2: Run test → FAIL.**
- [ ] **Step 3: Implement** — at the very top of `GET()` (before the cache check):

```typescript
import { isDemoMode } from '@/lib/demo';
import { DEMO_LEADERBOARD } from '@/lib/demo/seed';
// …first lines of GET():
if (isDemoMode()) {
  return NextResponse.json({ entries: DEMO_LEADERBOARD, total: DEMO_LEADERBOARD.length });
}
```

- [ ] **Step 4: Run test → PASS.**
- [ ] **Step 5: Commit** — `feat: serve seed cohort from the leaderboard API in demo mode`

---

## Task 5: Credentials demo branch

**Files:**
- Modify: `src/lib/solana/credentials.ts` (`getCredentialsByOwner`, `getCredentialById`)
- Test: `src/lib/solana/__tests__/credentials.test.ts` (create if absent)

**Interfaces:** Consumes `isDemoMode` (T1), `DEMO_CREDENTIALS` (T2). `getCredentialsByOwner(owner)` in demo mode → `DEMO_CREDENTIALS` (filtered to `owner` when it matches `DEMO_WALLET`, else all). `getCredentialById(id)` → matching `DEMO_CREDENTIALS` entry or `null`.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCredentialsByOwner, getCredentialById } from '../credentials';
import { DEMO_WALLET, DEMO_CREDENTIALS } from '@/lib/demo/seed';
afterEach(() => vi.unstubAllEnvs());

it('returns seed credentials for the demo wallet in demo mode', async () => {
  vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
  const creds = await getCredentialsByOwner(DEMO_WALLET);
  expect(creds).toHaveLength(DEMO_CREDENTIALS.length);
});

it('resolves a single seed credential by id in demo mode', async () => {
  vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
  const c = await getCredentialById(DEMO_CREDENTIALS[0]!.assetId);
  expect(c?.assetId).toBe(DEMO_CREDENTIALS[0]!.assetId);
});
```

- [ ] **Step 2: Run test → FAIL.**
- [ ] **Step 3: Implement** — first lines of each function:

```typescript
import { isDemoMode } from '@/lib/demo';
import { DEMO_CREDENTIALS, DEMO_WALLET } from '@/lib/demo/seed';
// getCredentialsByOwner(ownerAddress):
if (isDemoMode()) {
  return ownerAddress === DEMO_WALLET ? DEMO_CREDENTIALS : DEMO_CREDENTIALS.filter((c) => c.owner === ownerAddress);
}
// getCredentialById(assetId):
if (isDemoMode()) {
  return DEMO_CREDENTIALS.find((c) => c.assetId === assetId) ?? null;
}
```

> Note: `verifyCredential` calls `getCredentialById`, so it inherits the demo branch with no change.

- [ ] **Step 4: Run test → PASS.**
- [ ] **Step 5: Commit** — `feat: serve seed credentials in demo mode`

---

## Task 6: user-store `fetchUserData` demo branch

**Files:**
- Modify: `src/lib/stores/user-store.ts`
- Test: `src/lib/stores/__tests__/user-store.test.ts` (add a demo-mode case; create if absent)

**Interfaces:** Consumes `isDemoMode` (T1) + all seed fixtures (T2). In demo mode, `fetchUserData(wallet)` sets `{ wallet, xpBalance: DEMO_PROFILE.xp, level, levelTitle, streak: DEMO_STREAK, credentials: DEMO_CREDENTIALS, achievements: DEMO_ACHIEVEMENTS, enrollments: Map(DEMO_ENROLLMENTS), isLoading:false, error:null }` and returns early.

- [ ] **Step 1: Write the failing test**

```typescript
it('populates from seed fixtures in demo mode', async () => {
  vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
  await useUserStore.getState().fetchUserData(new PublicKey(DEMO_WALLET));
  const s = useUserStore.getState();
  expect(s.xpBalance).toBe(DEMO_PROFILE.xp);
  expect(s.credentials).toHaveLength(DEMO_CREDENTIALS.length);
  expect(s.achievements).toEqual(DEMO_ACHIEVEMENTS);
  expect(s.enrollments.get('solana-101')?.isFinalized).toBe(true);
});
```

- [ ] **Step 2: Run test → FAIL.**
- [ ] **Step 3: Implement** — first lines of `fetchUserData`, before `set({ isLoading: true … })`:

```typescript
import { isDemoMode } from '@/lib/demo';
import { DEMO_PROFILE, DEMO_STREAK, DEMO_CREDENTIALS, DEMO_ACHIEVEMENTS, DEMO_ENROLLMENTS } from '@/lib/demo/seed';
// fetchUserData(wallet):
if (isDemoMode()) {
  set({
    wallet,
    xpBalance: DEMO_PROFILE.xp,
    level: DEMO_PROFILE.level,
    levelTitle: DEMO_PROFILE.levelTitle,
    streak: DEMO_STREAK,
    credentials: DEMO_CREDENTIALS,
    achievements: DEMO_ACHIEVEMENTS,
    enrollments: new Map(DEMO_ENROLLMENTS.map((e) => [e.courseId, e])),
    isLoading: false,
    error: null,
  });
  return;
}
```

- [ ] **Step 4: Run test → PASS.**
- [ ] **Step 5: Commit** — `feat: populate the user store from seed fixtures in demo mode`

---

## Task 7: Demo wallet adapter

**Files:**
- Create: `src/lib/demo/wallet-adapter.ts`
- Test: `src/lib/demo/__tests__/wallet-adapter.test.ts`

**Interfaces:**
- Produces: `DemoWalletName: WalletName<'Demo'>`; `class DemoWalletAdapter extends BaseMessageSignerWalletAdapter` with fixed `publicKey = new PublicKey(DEMO_WALLET)` after `connect()`. Abstract members to implement: `name`, `url`, `icon`, `readyState` (`WalletReadyState.Loadable`), `publicKey`, `connecting`, `supportedTransactionVersions` (`null`), `connect()`, `disconnect()`, `signTransaction()` (throws), `signMessage()` (throws). `BaseSignerWalletAdapter` supplies `sendTransaction` + `signAllTransactions`.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { DemoWalletAdapter, DemoWalletName } from '../wallet-adapter';
import { DEMO_WALLET } from '../seed';

it('connects to the demo wallet pubkey', async () => {
  const a = new DemoWalletAdapter();
  expect(a.name).toBe(DemoWalletName);
  expect(a.publicKey).toBeNull();
  await a.connect();
  expect(a.publicKey?.toBase58()).toBe(DEMO_WALLET);
  expect(a.connected).toBe(true);
});

it('refuses to sign (demo mode)', async () => {
  const a = new DemoWalletAdapter();
  await a.connect();
  await expect(a.signMessage(new Uint8Array([1]))).rejects.toThrow();
});
```

- [ ] **Step 2: Run test → FAIL.**

- [ ] **Step 3: Implement**

```typescript
import {
  BaseMessageSignerWalletAdapter, WalletReadyState, type WalletName,
} from '@solana/wallet-adapter-base';
import { PublicKey, type Transaction, type VersionedTransaction } from '@solana/web3.js';
import { DEMO_WALLET } from './seed';

export const DemoWalletName = 'Demo' as WalletName<'Demo'>;

/** Read-only auto-connecting adapter for the public demo. Cannot sign —
 *  all transaction-producing controls are hidden in demo mode (sub-plan 3). */
export class DemoWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = DemoWalletName;
  url = 'https://rectorspace.com';
  icon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4='; // 1x1 svg
  readonly supportedTransactionVersions = null;

  private _publicKey: PublicKey | null = null;
  private _connecting = false;

  get readyState(): WalletReadyState { return WalletReadyState.Loadable; }
  get publicKey(): PublicKey | null { return this._publicKey; }
  get connecting(): boolean { return this._connecting; }

  async connect(): Promise<void> {
    this._connecting = true;
    this._publicKey = new PublicKey(DEMO_WALLET);
    this._connecting = false;
    this.emit('connect', this._publicKey);
  }
  async disconnect(): Promise<void> {
    this._publicKey = null;
    this.emit('disconnect');
  }
  async signTransaction<T extends Transaction | VersionedTransaction>(): Promise<T> {
    throw new Error('Demo mode — signing is disabled');
  }
  async signMessage(): Promise<Uint8Array> {
    throw new Error('Demo mode — signing is disabled');
  }
}
```

- [ ] **Step 4: Run test → PASS.** (If `tsc` flags the abstract `signTransaction` generic, match the base signature exactly from `node_modules/@solana/wallet-adapter-base/lib/types/signer.d.ts`.)

- [ ] **Step 5: Commit** — `feat: add auto-connecting demo wallet adapter`

---

## Task 8: Wire the demo wallet into the provider

**Files:**
- Modify: `src/components/providers/wallet-provider.tsx`

**Interfaces:** Consumes `isDemoMode` (T1), `DemoWalletAdapter`/`DemoWalletName` (T7). In demo mode the provider registers the demo adapter and a child effect auto-selects it so `useWallet().publicKey` becomes `DEMO_WALLET` app-wide.

- [ ] **Step 1: Implement** (provider wiring is verified by the visual gate, not a unit test — it requires the wallet-adapter React context):

```tsx
'use client';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { HELIUS_RPC } from '@/lib/solana/constants';
import { isDemoMode } from '@/lib/demo';
import { DemoWalletAdapter, DemoWalletName } from '@/lib/demo/wallet-adapter';
import { useEffect } from 'react';

function DemoAutoConnect() {
  const { select, wallet, connect } = useWallet();
  useEffect(() => {
    if (!wallet) select(DemoWalletName);
  }, [wallet, select]);
  useEffect(() => {
    if (wallet?.adapter.name === DemoWalletName) { connect().catch(() => {}); }
  }, [wallet, connect]);
  return null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => HELIUS_RPC, []);
  const demo = isDemoMode();
  const wallets = useMemo(() => (demo ? [new DemoWalletAdapter()] : []), [demo]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        {demo && <DemoAutoConnect />}
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
```

- [ ] **Step 2: Build + typecheck** — `cd app && pnpm build && npx tsc --noEmit` → green/clean.
- [ ] **Step 3: Commit** — `feat: auto-connect the demo wallet in demo mode`

---

## Task 9: Part gate + visual verification (the payoff)

- [ ] **Step 1: Full unit gate** — `cd app && pnpm test:run` (all green; new demo tests included) + `npx tsc --noEmit` clean.
- [ ] **Step 2: Off-palette guard** — none expected (no new color classes); skip unless a fixture introduces UI.
- [ ] **Step 3: Build with the flag + serve** — `cd app && NEXT_PUBLIC_DEMO_MODE=true pnpm build && NEXT_PUBLIC_DEMO_MODE=true PORT=3000 pnpm start`.
- [ ] **Step 4: e2e** — in a second shell, `cd app && pnpm exec playwright test --project=chromium` (reuses :3000) → 36/36.
- [ ] **Step 5: Chrome MCP visual smoke, BOTH themes** — clear any prior service worker first (`navigator.serviceWorker.getRegistrations()` → unregister; `caches.keys()` → delete; reload). Verify the previously-unverifiable earned states now render:
  - `/en/dashboard` — populated quick-stats, streak (clay flame), continue-learning, recent activity.
  - `/en/profile` — own profile populated (no connect-CTA); stats-summary colored values; skill radar; **earned (tinted) achievement medallions**.
  - `/en/leaderboard` — **live podium gold/clay/rust**, demo wallet highlighted at rank 2.
  - `/en/credentials` — gallery with ≥3 track-art credentials; open one → credential detail art + certificate.
  - `/en/profile/<a cohort wallet>` — populated via the profile API seam.
  - **level-badge** shows the Master tier with prestige pips (level 8).
- [ ] **Step 6: Cleanup** — `lsof -ti:3000 | xargs kill`; close the Chrome tab.
- [ ] **Step 7: Read-only opus review** (general-purpose adversarial) over the sub-plan diff; resolve any Critical/Important.
- [ ] **Step 8: Append the SDD ledger** with the sub-plan-2 record; update memory/handoff.

---

## Self-Review (against the spec)

- **Spec §7 "seed data fills every Tier-1 page / no empty states":** covered by T2–T8 (profile, leaderboard, credentials, dashboard, profile/[wallet]) + the auto-demo identity (T7/T8).
- **Spec §7 "wallet-connect works on devnet":** the demo adapter connects on devnet (real adapter, signing disabled — signing controls are hidden in sub-plan 3, not here).
- **Spec §4.4 / §4.5 earned states:** rendered for the first time in T9 (podium, credential art, level tiers/pips, streak, medallions, colored stats).
- **Type consistency:** `LeaderboardEntry` (incl. optional `streak`), `Credential` (incl. optional `createdAt`), `EnrollmentData`, `StreakState` all imported from their source modules — no re-declared shapes.
- **Out of scope (deferred to later sub-plans):** hiding OAuth/CMS/minting + connect-CTA-in-demo polish (sub-plan 3), dark-mode polish (sub-plan 4), repo/domain/deploy (sub-plan 5).
