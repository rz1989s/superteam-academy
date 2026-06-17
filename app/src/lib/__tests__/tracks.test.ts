import { describe, it, expect } from 'vitest';
import { TRACKS, ALL_TRACKS, getTrack } from '../tracks';

describe('tracks module', () => {
  it('maps the four tracks to warm brand accents in order', () => {
    expect(ALL_TRACKS.map((t) => t.accent)).toEqual([
      'skyblue',
      'gold',
      'clay',
      'rust',
    ]);
  });

  it('uses AA-readable text tokens in every badge class', () => {
    for (const t of ALL_TRACKS) {
      expect(t.badgeClass).toMatch(/text-(link|clay-deep|rust-deep|green-deep)/);
    }
  });

  it('contains no off-palette color names', () => {
    expect(JSON.stringify(TRACKS)).not.toMatch(
      /violet|purple|indigo|fuchsia|pink|teal|9945FF|14F195/i,
    );
  });

  it('resolves by id and slug with a safe fallback to Solana Core', () => {
    expect(getTrack('1').slug).toBe('solana-core');
    expect(getTrack('security').id).toBe('4');
    expect(getTrack('does-not-exist').id).toBe('1');
  });
});
