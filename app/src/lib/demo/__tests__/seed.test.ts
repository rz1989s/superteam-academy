import { describe, it, expect } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import { calculateLevel, getLevelTitle } from '@/lib/solana/xp';
import { seedAchievements } from '@/lib/sanity/seed-data';
import {
  DEMO_WALLET,
  DEMO_PROFILE,
  DEMO_LEADERBOARD,
  DEMO_CREDENTIALS,
  DEMO_ACHIEVEMENTS,
  DEMO_ENROLLMENTS,
} from '../seed';

describe('demo seed fixtures', () => {
  it('every leaderboard wallet (incl. DEMO_WALLET) is a valid pubkey', () => {
    expect(() => new PublicKey(DEMO_WALLET)).not.toThrow();
    for (const e of DEMO_LEADERBOARD) {
      expect(() => new PublicKey(e.wallet)).not.toThrow();
    }
  });

  it('DEMO_PROFILE level/title are derived from its xp', () => {
    expect(DEMO_PROFILE.level).toBe(calculateLevel(DEMO_PROFILE.xp));
    expect(DEMO_PROFILE.levelTitle).toBe(getLevelTitle(DEMO_PROFILE.level));
    expect(DEMO_PROFILE.wallet).toBe(DEMO_WALLET);
  });

  it('the demo wallet sits on the podium with matching xp', () => {
    const me = DEMO_LEADERBOARD.find((e) => e.wallet === DEMO_WALLET);
    expect(me).toBeDefined();
    expect(me!.rank).toBeLessThanOrEqual(3);
    expect(me!.xpBalance).toBe(DEMO_PROFILE.xp);
  });

  it('leaderboard is sorted by xp desc with sequential ranks', () => {
    expect(DEMO_LEADERBOARD[0]!.rank).toBe(1);
    for (let i = 1; i < DEMO_LEADERBOARD.length; i++) {
      expect(DEMO_LEADERBOARD[i]!.xpBalance).toBeLessThanOrEqual(
        DEMO_LEADERBOARD[i - 1]!.xpBalance,
      );
      expect(DEMO_LEADERBOARD[i]!.rank).toBe(DEMO_LEADERBOARD[i - 1]!.rank + 1);
    }
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

  it('every demo achievement id exists in the catalog', () => {
    const valid = new Set(seedAchievements.map((a) => a.achievementId));
    for (const id of DEMO_ACHIEVEMENTS) {
      expect(valid.has(id)).toBe(true);
    }
  });
});
