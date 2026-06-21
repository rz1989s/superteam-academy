import { describe, it, expect } from 'vitest';
import { difficultyClass, DIFFICULTY_LEVELS } from '../difficulty';

describe('difficulty module', () => {
  it('maps the three levels to warm brand classification classes', () => {
    expect(difficultyClass('beginner')).toContain('text-green-deep');
    expect(difficultyClass('intermediate')).toContain('text-clay-deep');
    expect(difficultyClass('advanced')).toContain('text-rust-deep');
  });

  it('pairs each difficulty text with a bright dark: sibling', () => {
    expect(difficultyClass('beginner')).toContain('dark:text-leaf');
    expect(difficultyClass('intermediate')).toContain('dark:text-gold');
    expect(difficultyClass('advanced')).toContain('dark:text-rust-bright');
  });

  it('resolves a numeric index to the same class as its level name', () => {
    DIFFICULTY_LEVELS.forEach((level, i) => {
      expect(difficultyClass(i)).toBe(difficultyClass(level));
    });
  });

  it('uses no off-palette or status colors', () => {
    const all = DIFFICULTY_LEVELS.map((l) => difficultyClass(l)).join(' ');
    expect(all).not.toMatch(/emerald|amber|red-[0-9]|violet|fuchsia|rose|slate|orange/);
  });
});
