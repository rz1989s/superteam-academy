import { describe, it, expect } from 'vitest';
import {
  challengeCategoryStyle,
  CHALLENGE_CATEGORY_STYLES,
  type ChallengeCategory,
} from '../challenge-categories';

describe('challenge-categories module', () => {
  it('styles all five categories', () => {
    expect(Object.keys(CHALLENGE_CATEGORY_STYLES)).toEqual([
      'solana-fundamentals',
      'defi',
      'nft-metaplex',
      'security',
      'token-extensions',
    ]);
  });

  it('uses AA-readable text tokens in every badge + stat class', () => {
    for (const c of Object.values(CHALLENGE_CATEGORY_STYLES)) {
      expect(c.badgeClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep)/);
      expect(c.statClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep)/);
    }
  });

  it('pairs each category badge + stat text with a bright dark: sibling', () => {
    const expected: Record<ChallengeCategory, string> = {
      'solana-fundamentals': 'dark:text-skyblue',
      defi: 'dark:text-gold',
      'nft-metaplex': 'dark:text-clay',
      security: 'dark:text-rust-bright',
      'token-extensions': 'dark:text-leaf',
    };
    for (const [cat, dark] of Object.entries(expected)) {
      expect(challengeCategoryStyle(cat).badgeClass).toContain(dark);
      expect(challengeCategoryStyle(cat).statClass).toContain(dark);
    }
  });

  it('contains no off-palette color names', () => {
    expect(JSON.stringify(CHALLENGE_CATEGORY_STYLES)).not.toMatch(
      /violet|purple|indigo|fuchsia|pink|rose|teal|slate|orange|emerald|amber/i,
    );
  });

  it('falls back to a valid style for an unknown category', () => {
    expect(challengeCategoryStyle('does-not-exist').badgeClass).toBe(
      CHALLENGE_CATEGORY_STYLES['solana-fundamentals'].badgeClass,
    );
  });
});
