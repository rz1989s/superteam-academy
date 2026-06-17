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
}

export const TRACKS: Record<TrackId, Track> = {
  '1': {
    id: '1',
    slug: 'solana-core',
    name: 'Solana Core',
    Icon: Blocks,
    accent: 'skyblue',
    badgeClass: 'bg-skyblue/10 text-link',
    borderClass: 'border-l-skyblue',
    tintGradient: 'from-skyblue/20 to-skyblue/5',
  },
  '2': {
    id: '2',
    slug: 'defi',
    name: 'DeFi',
    Icon: Coins,
    accent: 'gold',
    badgeClass: 'bg-gold/20 text-clay-deep',
    borderClass: 'border-l-gold',
    tintGradient: 'from-gold/20 to-gold/5',
  },
  '3': {
    id: '3',
    slug: 'nft',
    name: 'NFT & Metaplex',
    Icon: ImageIcon,
    accent: 'clay',
    badgeClass: 'bg-clay/15 text-clay-deep',
    borderClass: 'border-l-clay',
    tintGradient: 'from-clay/20 to-clay/5',
  },
  '4': {
    id: '4',
    slug: 'security',
    name: 'Security',
    Icon: Shield,
    accent: 'rust',
    badgeClass: 'bg-rust/15 text-rust-deep',
    borderClass: 'border-l-rust',
    tintGradient: 'from-rust/15 to-rust/5',
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
