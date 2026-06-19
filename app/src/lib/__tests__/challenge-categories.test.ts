import { describe, it, expect } from 'vitest';
import {
  challengeCategoryStyle,
  CHALLENGE_CATEGORY_STYLES,
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
