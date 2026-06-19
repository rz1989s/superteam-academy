export type ChallengeCategory =
  | 'solana-fundamentals'
  | 'defi'
  | 'nft-metaplex'
  | 'security'
  | 'token-extensions';

interface CategoryStyle {
  /** Left-border accent (decorative bright fill). */
  borderClass: string;
  /** Tinted badge: tint bg + AA-readable -deep/link text. */
  badgeClass: string;
  /** AA-readable text for the large category stat number. */
  statClass: string;
}

export const CHALLENGE_CATEGORY_STYLES: Record<ChallengeCategory, CategoryStyle> = {
  'solana-fundamentals': {
    borderClass: 'border-l-skyblue',
    badgeClass: 'bg-skyblue/10 text-link',
    statClass: 'text-link',
  },
  defi: {
    borderClass: 'border-l-gold',
    badgeClass: 'bg-gold/20 text-clay-deep',
    statClass: 'text-clay-deep',
  },
  'nft-metaplex': {
    borderClass: 'border-l-clay',
    badgeClass: 'bg-clay/15 text-clay-deep',
    statClass: 'text-clay-deep',
  },
  security: {
    borderClass: 'border-l-rust',
    badgeClass: 'bg-rust/15 text-rust-deep',
    statClass: 'text-rust-deep',
  },
  'token-extensions': {
    borderClass: 'border-l-leaf',
    badgeClass: 'bg-leaf/20 text-green-deep',
    statClass: 'text-green-deep',
  },
};

/** Resolve a category's brand style; falls back to Solana Fundamentals. */
export function challengeCategoryStyle(category: string): CategoryStyle {
  return (
    CHALLENGE_CATEGORY_STYLES[category as ChallengeCategory] ??
    CHALLENGE_CATEGORY_STYLES['solana-fundamentals']
  );
}
