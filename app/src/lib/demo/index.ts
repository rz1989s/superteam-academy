/**
 * Whether the app runs in seed-data demo mode. Gated by the build-time
 * NEXT_PUBLIC_DEMO_MODE env var (Next inlines NEXT_PUBLIC_* at build).
 *
 * In demo mode the data seams (profile/leaderboard/credentials APIs and the
 * user store) return deterministic seed fixtures instead of reading Helius /
 * on-chain state, and an auto-connecting demo wallet identifies the learner.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}
