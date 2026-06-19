import { describe, it, expect } from 'vitest';
import {
  achievementRarityStyle,
  ACHIEVEMENT_RARITY_STYLES,
  ACHIEVEMENT_RARITIES,
} from '../achievements';

describe('achievements rarity module', () => {
  it('styles all four rarities in ascending order', () => {
    expect(ACHIEVEMENT_RARITIES).toEqual(['common', 'rare', 'epic', 'legendary']);
    expect(Object.keys(ACHIEVEMENT_RARITY_STYLES)).toEqual([
      'common',
      'rare',
      'epic',
      'legendary',
    ]);
  });

  it('uses AA-readable text tokens (or muted) for every icon + label', () => {
    for (const s of Object.values(ACHIEVEMENT_RARITY_STYLES)) {
      expect(s.iconClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep|muted-foreground)/);
      expect(s.textClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep|muted-foreground)/);
    }
  });

  it('escalates the ring with rarity (common has none, legendary has the strongest)', () => {
    expect(achievementRarityStyle('common').ringClass).toBe('');
    expect(achievementRarityStyle('legendary').ringClass).toContain('ring-2');
  });

  it('contains no off-palette color names', () => {
    expect(JSON.stringify(ACHIEVEMENT_RARITY_STYLES)).not.toMatch(
      /violet|purple|indigo|fuchsia|pink|rose|teal|cyan|slate|orange|emerald|amber|zinc|red-[0-9]|blue-[0-9]/i,
    );
  });

  it('falls back to common for an unknown rarity', () => {
    expect(achievementRarityStyle('does-not-exist').badgeClass).toBe(
      ACHIEVEMENT_RARITY_STYLES.common.badgeClass,
    );
  });
});
