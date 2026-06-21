/**
 * Single-source level-tier ramp for `LevelBadge` (11 tiers matching
 * `LEVEL_TITLES` in `@/lib/solana/xp`). Brand-pure, AA, no metallics.
 *
 * Tiers 1-6 anchor to distinct brand hues; tiers 7-11 escalate within the
 * warm gold/clay/rust family by fill intensity + border + ring + prestige
 * pips (the brand runs out of distinct hues by design). Legend tops out with
 * a full-gold border + ring-2 gold/60 and a cream ring-offset inlay.
 */
export const LEVEL_TIERS = [
  'newcomer',
  'explorer',
  'builder',
  'developer',
  'engineer',
  'architect',
  'specialist',
  'expert',
  'master',
  'grandmaster',
  'legend',
] as const;

export type LevelTier = (typeof LEVEL_TIERS)[number];

interface LevelTierStyle {
  /** Tinted badge fill (decorative). */
  bg: string;
  /** Badge border (escalates with tier). */
  border: string;
  /** AA-readable brand text for the level number + title. */
  text: string;
  /** Ring escalates for prestige tiers (7-11); empty below. No metallics. */
  ring: string;
  /** Prestige dot count (tiers 7-11 → 1..5; 0 below). Rendered as a static aria-hidden dot row. */
  pips: number;
}

export const LEVEL_TIER_STYLES: Record<LevelTier, LevelTierStyle> = {
  newcomer: { bg: 'bg-muted', border: 'border-border', text: 'text-muted-foreground', ring: '', pips: 0 },
  explorer: { bg: 'bg-leaf/15', border: 'border-leaf/40', text: 'text-green-deep dark:text-leaf', ring: '', pips: 0 },
  builder: { bg: 'bg-skyblue/10', border: 'border-skyblue/40', text: 'text-link dark:text-skyblue', ring: '', pips: 0 },
  developer: { bg: 'bg-clay/15', border: 'border-clay/40', text: 'text-clay-deep dark:text-clay', ring: '', pips: 0 },
  engineer: { bg: 'bg-gold/20', border: 'border-gold/50', text: 'text-clay-deep dark:text-gold', ring: '', pips: 0 },
  architect: { bg: 'bg-rust/15', border: 'border-rust/40', text: 'text-rust-deep dark:text-rust-bright', ring: '', pips: 0 },
  specialist: { bg: 'bg-rust/20', border: 'border-rust/50', text: 'text-rust-deep dark:text-rust-bright', ring: 'ring-1 ring-rust/30', pips: 1 },
  expert: { bg: 'bg-clay/25', border: 'border-clay/60', text: 'text-clay-deep dark:text-clay', ring: 'ring-1 ring-clay/40', pips: 2 },
  master: { bg: 'bg-gold/25', border: 'border-gold/60', text: 'text-clay-deep dark:text-gold', ring: 'ring-2 ring-gold/40', pips: 3 },
  grandmaster: { bg: 'bg-gold/30', border: 'border-rust/60', text: 'text-clay-deep dark:text-gold', ring: 'ring-2 ring-rust/50', pips: 4 },
  legend: {
    bg: 'bg-gold/30',
    border: 'border-gold',
    text: 'text-clay-deep dark:text-gold',
    ring: 'ring-2 ring-gold/60 ring-offset-2 ring-offset-background',
    pips: 5,
  },
};

/** Resolve a level title (e.g. from `getLevelTitle`) to its brand tier style; falls back to newcomer. */
export function levelTierStyle(title: string): LevelTierStyle {
  return LEVEL_TIER_STYLES[title.toLowerCase() as LevelTier] ?? LEVEL_TIER_STYLES.newcomer;
}
