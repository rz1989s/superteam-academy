import { describe, it, expect } from 'vitest';
import { levelTierStyle, LEVEL_TIER_STYLES, LEVEL_TIERS } from '../level-tiers';

describe('level-tiers module', () => {
  it('defines all eleven tiers in ascending order', () => {
    expect(LEVEL_TIERS).toEqual([
      'newcomer', 'explorer', 'builder', 'developer', 'engineer', 'architect',
      'specialist', 'expert', 'master', 'grandmaster', 'legend',
    ]);
    expect(Object.keys(LEVEL_TIER_STYLES)).toEqual([...LEVEL_TIERS]);
  });

  it('uses AA-readable text tokens (or muted) for every tier', () => {
    for (const s of Object.values(LEVEL_TIER_STYLES)) {
      expect(s.text).toMatch(/text-(link|clay-deep|rust-deep|green-deep|muted-foreground)/);
    }
  });

  it('pairs each tier text (except newcomer) with a bright dark: sibling by fill accent', () => {
    expect(levelTierStyle('explorer').text).toContain('dark:text-leaf');
    expect(levelTierStyle('builder').text).toContain('dark:text-skyblue');
    expect(levelTierStyle('developer').text).toContain('dark:text-clay');
    expect(levelTierStyle('expert').text).toContain('dark:text-clay');
    expect(levelTierStyle('engineer').text).toContain('dark:text-gold');
    expect(levelTierStyle('master').text).toContain('dark:text-gold');
    expect(levelTierStyle('grandmaster').text).toContain('dark:text-gold');
    expect(levelTierStyle('legend').text).toContain('dark:text-gold');
    expect(levelTierStyle('architect').text).toContain('dark:text-rust-bright');
    expect(levelTierStyle('specialist').text).toContain('dark:text-rust-bright');
    expect(levelTierStyle('newcomer').text).not.toContain('dark:');
  });

  it('escalates the ring across prestige tiers (1-6 none, 7-8 ring-1, 9-11 ring-2, legend offset)', () => {
    expect(levelTierStyle('newcomer').ring).toBe('');
    expect(levelTierStyle('architect').ring).toBe('');
    expect(levelTierStyle('specialist').ring).toContain('ring-1');
    expect(levelTierStyle('master').ring).toContain('ring-2');
    expect(levelTierStyle('legend').ring).toContain('ring-2');
    expect(levelTierStyle('legend').ring).toContain('ring-offset');
  });

  it('assigns prestige pips to tiers 7-11 only (1..5), none below', () => {
    expect(levelTierStyle('newcomer').pips).toBe(0);
    expect(levelTierStyle('architect').pips).toBe(0);
    expect(levelTierStyle('specialist').pips).toBe(1);
    expect(levelTierStyle('expert').pips).toBe(2);
    expect(levelTierStyle('master').pips).toBe(3);
    expect(levelTierStyle('grandmaster').pips).toBe(4);
    expect(levelTierStyle('legend').pips).toBe(5);
  });

  it('contains no off-palette or metallic color names', () => {
    expect(JSON.stringify(LEVEL_TIER_STYLES)).not.toMatch(
      /violet|purple|indigo|fuchsia|pink|rose|teal|cyan|slate|orange|emerald|amber|zinc|gray|silver|bronze|metal|red-[0-9]|blue-[0-9]|yellow-[0-9]/i,
    );
  });

  it('is case-insensitive and falls back to newcomer for an unknown title', () => {
    expect(levelTierStyle('LEGEND').border).toBe(LEVEL_TIER_STYLES.legend.border);
    expect(levelTierStyle('does-not-exist').bg).toBe(LEVEL_TIER_STYLES.newcomer.bg);
  });
});
