export const ACHIEVEMENT_RARITIES = ['common', 'rare', 'epic', 'legendary'] as const;
export type AchievementRarity = (typeof ACHIEVEMENT_RARITIES)[number];

interface RarityStyle {
  /** Tinted medallion fill (decorative). */
  badgeClass: string;
  /** AA-readable brand icon color on the tint. */
  iconClass: string;
  /** AA-readable rarity label text. */
  textClass: string;
  /** Ring intensity escalates with rarity; no metallics. */
  ringClass: string;
}

export const ACHIEVEMENT_RARITY_STYLES: Record<AchievementRarity, RarityStyle> = {
  common: {
    badgeClass: 'bg-muted',
    iconClass: 'text-muted-foreground',
    textClass: 'text-muted-foreground',
    ringClass: '',
  },
  rare: {
    badgeClass: 'bg-leaf/20',
    iconClass: 'text-green-deep',
    textClass: 'text-green-deep',
    ringClass: 'ring-1 ring-leaf/40',
  },
  epic: {
    badgeClass: 'bg-clay/15',
    iconClass: 'text-clay-deep',
    textClass: 'text-clay-deep',
    ringClass: 'ring-2 ring-clay/40',
  },
  legendary: {
    badgeClass: 'bg-gold/20',
    iconClass: 'text-clay-deep',
    textClass: 'text-clay-deep',
    ringClass: 'ring-2 ring-gold/50',
  },
};

/** Resolve a rarity's brand medallion style; falls back to common. */
export function achievementRarityStyle(rarity: string): RarityStyle {
  return (
    ACHIEVEMENT_RARITY_STYLES[rarity as AchievementRarity] ??
    ACHIEVEMENT_RARITY_STYLES.common
  );
}
