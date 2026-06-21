import {
  Blocks,
  Coins,
  Image as ImageIcon,
  Shield,
  type LucideIcon,
} from 'lucide-react';

export type TrackId = '1' | '2' | '3' | '4';
export type TrackSlug = 'solana-core' | 'defi' | 'nft' | 'security';

export interface Track {
  id: TrackId;
  slug: TrackSlug;
  name: string;
  /** Lucide icon for this track. */
  Icon: LucideIcon;
  /** Brand accent token name (decorative fills/borders/rings). */
  accent: 'skyblue' | 'gold' | 'clay' | 'rust';
  /** Tinted badge: tint background + AA-readable -deep/link text. */
  badgeClass: string;
  /** Left-border accent (track cards). */
  borderClass: string;
  /** Light tint gradient for image placeholders with NO overlaid text. */
  tintGradient: string;
  /** AA-safe DARK gradient for surfaces that overlay WHITE text (hero, credential art). */
  artGradient: string;
  /** Raw hex pair mirroring artGradient — for the Canvas certificate (Canvas can't read CSS classes). */
  artHex: { from: string; to: string };
}

export const TRACKS: Record<TrackId, Track> = {
  '1': {
    id: '1',
    slug: 'solana-core',
    name: 'Solana Core',
    Icon: Blocks,
    accent: 'skyblue',
    badgeClass: 'bg-skyblue/10 text-link dark:text-skyblue',
    borderClass: 'border-l-skyblue',
    tintGradient: 'from-skyblue/20 to-skyblue/5',
    artGradient: 'from-link to-brown',
    artHex: { from: '#0D7390', to: '#3B2C22' },
  },
  '2': {
    id: '2',
    slug: 'defi',
    name: 'DeFi',
    Icon: Coins,
    accent: 'gold',
    badgeClass: 'bg-gold/20 text-clay-deep dark:text-gold',
    borderClass: 'border-l-gold',
    tintGradient: 'from-gold/20 to-gold/5',
    artGradient: 'from-clay-deep to-brown',
    artHex: { from: '#8A4A12', to: '#3B2C22' },
  },
  '3': {
    id: '3',
    slug: 'nft',
    name: 'NFT & Metaplex',
    Icon: ImageIcon,
    accent: 'clay',
    badgeClass: 'bg-clay/15 text-clay-deep dark:text-clay',
    borderClass: 'border-l-clay',
    tintGradient: 'from-clay/20 to-clay/5',
    artGradient: 'from-clay-deep to-rust-deep',
    artHex: { from: '#8A4A12', to: '#A23B22' },
  },
  '4': {
    id: '4',
    slug: 'security',
    name: 'Security',
    Icon: Shield,
    accent: 'rust',
    badgeClass: 'bg-rust/15 text-rust-deep dark:text-rust-bright',
    borderClass: 'border-l-rust',
    tintGradient: 'from-rust/15 to-rust/5',
    artGradient: 'from-rust-deep to-brown',
    artHex: { from: '#A23B22', to: '#3B2C22' },
  },
};

const BY_SLUG: Record<string, Track> = Object.fromEntries(
  Object.values(TRACKS).map((t) => [t.slug, t]),
);

export const ALL_TRACKS: Track[] = Object.values(TRACKS);

/** Resolve a track by id ('1'..'4') or slug; falls back to Solana Core. */
export function getTrack(idOrSlug: string): Track {
  return TRACKS[idOrSlug as TrackId] ?? BY_SLUG[idOrSlug] ?? TRACKS['1'];
}

/**
 * Resolve a track from a credential's 0-indexed `attributes.trackId`
 * (0=Core, 1=DeFi, 2=NFT, 3=Security, 4=Gaming). tracks.ts ids are 1-indexed
 * strings, so map numerically; unknown / Gaming / undefined fall back to Solana Core.
 */
const CREDENTIAL_TRACK_BY_NUMERIC: Record<number, TrackId> = {
  0: '1',
  1: '2',
  2: '3',
  3: '4',
};

export function getCredentialTrack(trackId?: number): Track {
  if (trackId === undefined) return TRACKS['1'];
  return TRACKS[CREDENTIAL_TRACK_BY_NUMERIC[trackId] ?? '1'];
}
