import { describe, it, expect } from 'vitest';
import { TRACKS, ALL_TRACKS, getTrack, getCredentialTrack } from '../tracks';

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

  it('exposes an AA-safe dark artGradient (white text) for every track', () => {
    const DARK_STOP = /^(from|to|via)-(link|clay-deep|rust-deep|green-deep|brown)$/;
    for (const t of ALL_TRACKS) {
      const stops = t.artGradient.trim().split(/\s+/);
      expect(stops.length).toBeGreaterThanOrEqual(2);
      for (const s of stops) expect(s).toMatch(DARK_STOP);
    }
  });

  it('exposes a raw hex art pair (matching the brand palette) for every track', () => {
    const BRAND_HEX = /^#(0D7390|3B2C22|8A4A12|A23B22)$/;
    for (const t of ALL_TRACKS) {
      expect(t.artHex.from).toMatch(BRAND_HEX);
      expect(t.artHex.to).toMatch(BRAND_HEX);
    }
  });

  it('maps a 0-indexed credential trackId to the right track', () => {
    expect(getCredentialTrack(0).slug).toBe('solana-core');
    expect(getCredentialTrack(1).slug).toBe('defi');
    expect(getCredentialTrack(2).slug).toBe('nft');
    expect(getCredentialTrack(3).slug).toBe('security');
  });

  it('falls back to Solana Core for undefined / out-of-range credential trackId', () => {
    expect(getCredentialTrack(undefined).slug).toBe('solana-core');
    expect(getCredentialTrack(4).slug).toBe('solana-core');
    expect(getCredentialTrack(99).slug).toBe('solana-core');
  });
});
