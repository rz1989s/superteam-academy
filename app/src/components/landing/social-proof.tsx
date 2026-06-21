'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Users } from 'lucide-react';

interface EcosystemTool {
  name: string;
  /** First letter displayed as the tile icon */
  initial: string;
  /** Brand-accent tile background (brown initial reads on all of these) */
  tile: string;
}

// The real tools RECTOR Academy is built with — no fabricated partnerships.
const ECOSYSTEM_TOOLS: EcosystemTool[] = [
  { name: 'Solana', initial: 'S', tile: 'bg-skyblue' },
  { name: 'Anchor', initial: 'A', tile: 'bg-gold' },
  { name: 'Metaplex', initial: 'M', tile: 'bg-clay' },
  { name: 'Helius', initial: 'H', tile: 'bg-leaf' },
];

interface StatItem {
  value: string;
  label: string;
}

// True facts about the demo — not invented user metrics.
const DEMO_FACTS: StatItem[] = [
  { value: '4', label: 'Learning Tracks' },
  { value: '100+', label: 'Lessons & Challenges' },
  { value: 'On-chain', label: 'XP Rewards' },
  { value: 'Soulbound', label: 'NFT Credentials' },
];

const DEMO_HIGHLIGHTS = [
  'Four learning tracks: Solana Core, DeFi, NFT, and Security',
  'Interactive coding challenges with an in-browser editor',
  'On-chain XP and soulbound NFT credentials on Solana devnet',
  'Built with Anchor, Metaplex, and Helius',
];

export function SocialProof() {
  const t = useTranslations('landing');

  return (
    <section
      className="py-16 md:py-24"
      aria-labelledby="social-proof-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            About this demo
          </span>
          <h2
            id="social-proof-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t('social_proof_title')}
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            An interactive demo of on-chain developer education — explore the
            tracks, challenges, and credentials end to end.
          </p>
        </div>

        {/* Demo facts */}
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {DEMO_FACTS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="my-12 border-t-2 border-gold/60" />

        {/* What this demo shows */}
        <Card className="border-2 border-brown/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">
              A clickable demo — explore it freely
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              RECTOR Academy is an interactive portfolio piece from RECTOR LABS,
              not a live platform. Connect a Solana devnet wallet and browse the
              full experience:
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {DEMO_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-deep dark:text-leaf" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Built with the Solana ecosystem */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="text-sm font-medium text-muted-foreground">
            Built with the Solana ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {ECOSYSTEM_TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="group flex items-center gap-2.5 rounded-xl border bg-card px-4 py-2.5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tool.tile} text-xs font-bold text-brown shadow-sm`}
                >
                  {tool.initial}
                </div>
                <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
