import type { Credential } from '@/lib/solana/credentials';
import type { EnrollmentData, StreakState } from '@/lib/stores/user-store';
import type { LeaderboardEntry } from '@/lib/hooks/use-leaderboard';
import { calculateLevel, getLevelTitle } from '@/lib/solana/xp';

/**
 * Deterministic seed fixtures for the public demo. Returned by the data seams
 * (profile/leaderboard/credentials APIs + the user store) when isDemoMode().
 * No values touch the network — the demo never breaks and screenshots reproduce.
 */

/** Fixed devnet learner identity for the demo. Never signs (signing is disabled). */
export const DEMO_WALLET = 'ACAd3USj2sMV6drKcMY2wZtNkhVDHWpC4tfJe93hgqYn';

const DEMO_XP = 6400; // calculateLevel(6400) === 8 → "Master" (level-badge prestige tier)

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

// trackId is 0-indexed (0=Core, 1=DeFi, 2=NFT, 3=Security) per credential-attributes.
export const DEMO_CREDENTIALS: Credential[] = [
  {
    assetId: 'demo-cred-core',
    name: 'Introduction to Solana Development',
    uri: '',
    imageUrl: '',
    owner: DEMO_WALLET,
    collection: 'rector-academy',
    frozen: true,
    attributes: { trackId: 0, level: 1, coursesCompleted: 1, totalXp: 250 },
    createdAt: '2026-05-01T00:00:00Z',
  },
  {
    assetId: 'demo-cred-defi',
    name: 'Building a DEX with Anchor',
    uri: '',
    imageUrl: '',
    owner: DEMO_WALLET,
    collection: 'rector-academy',
    frozen: true,
    attributes: { trackId: 1, level: 2, coursesCompleted: 1, totalXp: 600 },
    createdAt: '2026-05-20T00:00:00Z',
  },
  {
    assetId: 'demo-cred-sec',
    name: 'Smart Contract Auditing',
    uri: '',
    imageUrl: '',
    owner: DEMO_WALLET,
    collection: 'rector-academy',
    frozen: true,
    attributes: { trackId: 3, level: 3, coursesCompleted: 1, totalXp: 900 },
    createdAt: '2026-06-10T00:00:00Z',
  },
];

// achievementId values — must exist in the achievements catalog (seedAchievements).
export const DEMO_ACHIEVEMENTS: string[] = [
  'first-lesson',
  'course-completer',
  'streak-7',
  'streak-30',
  'rust-rookie',
  'anchor-expert',
];

/** Plausible peers + the demo learner; sorted + ranked below (demo wallet = rank 2). */
const RAW_COHORT: Array<{ wallet: string; xpBalance: number; streak: number }> = [
  { wallet: 'GzARf4QfDD7GhjjVDR1BR6YMQKPKhhcUsuDxLokzLLao', xpBalance: 8100, streak: 21 },
  { wallet: DEMO_WALLET, xpBalance: DEMO_XP, streak: DEMO_STREAK.currentStreak },
  { wallet: 'GDnS8KCbKkZyLFZX2VS7FqaBqtL4m9dNwE7dpbSzy5KV', xpBalance: 4900, streak: 9 },
  { wallet: '4MAqAUieifbm2Hvej28fSiPWsShtvU58CNgSbzQWkyxu', xpBalance: 4200, streak: 15 },
  { wallet: '56Yoj8mMovQAgjqwpHM7UAhjTiQ7SpWSod1X62zcC3Kq', xpBalance: 3600, streak: 6 },
  { wallet: '5vGt9JqEwaDmPgbt2GF23qf3th2jYHAnhEPop2WpmfvN', xpBalance: 2900, streak: 4 },
  { wallet: 'CdPKhCyK4QomQGrWinsnoaMcnobTcr7fBwVicFDrvRGN', xpBalance: 2500, streak: 11 },
  { wallet: '7Tdov8ah5L398MRmcZfwwsJuY869cVYgrVze8czUL4Tg', xpBalance: 1900, streak: 3 },
  { wallet: 'CxmBZtty6RQpkuP3CCNz7xmr3gdxV6ofVgAHmSmfsz4U', xpBalance: 1600, streak: 8 },
  { wallet: 'AGhrY2gTzQ5UCCHyXVdwqkrHXZJraeus7MXDf6CwL7Sq', xpBalance: 1200, streak: 2 },
  { wallet: 'CQSd22uiZ4JaxHsMNVoVsxrV8bpmTdHHoSRVn5CvNGL2', xpBalance: 800, streak: 5 },
  { wallet: 'BCRWQrDZtca6y8Rg5cbGHSfmX1ue5MzFygvdxpB8NLk7', xpBalance: 400, streak: 1 },
];

export const DEMO_LEADERBOARD: LeaderboardEntry[] = [...RAW_COHORT]
  .sort((a, b) => b.xpBalance - a.xpBalance)
  .map((e, i) => ({
    wallet: e.wallet,
    xpBalance: e.xpBalance,
    level: calculateLevel(e.xpBalance),
    rank: i + 1,
    streak: e.streak,
  }));
