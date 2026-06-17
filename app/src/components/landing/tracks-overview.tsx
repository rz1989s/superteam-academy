'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { getTrack, type TrackId } from '@/lib/tracks';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GraduationCap } from 'lucide-react';

interface Track {
  title: string;
  description: string;
  courseCount: number;
  difficultyRange: string;
  trackId: TrackId;
}

const TRACKS: Track[] = [
  {
    title: 'Solana Core',
    description: 'Accounts, transactions, PDAs, CPIs, and the Solana runtime. The essential foundation for every Solana developer.',
    courseCount: 8,
    difficultyRange: 'Beginner – Intermediate',
    trackId: '1',
  },
  {
    title: 'DeFi Development',
    description: 'AMMs, lending protocols, order books, and token economics. Build the financial primitives of tomorrow.',
    courseCount: 10,
    difficultyRange: 'Intermediate – Advanced',
    trackId: '2',
  },
  {
    title: 'NFT & Metaplex',
    description: 'Core NFTs, collections, candy machines, and marketplace integrations using the Metaplex standard.',
    courseCount: 6,
    difficultyRange: 'Beginner – Intermediate',
    trackId: '3',
  },
  {
    title: 'Security & Auditing',
    description: 'Vulnerability patterns, exploit analysis, secure coding practices, and formal verification techniques.',
    courseCount: 5,
    difficultyRange: 'Advanced',
    trackId: '4',
  },
];

export function TracksOverview() {
  const t = useTranslations('landing');

  return (
    <section className="py-16 md:py-24" aria-labelledby="tracks-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            Structured Learning
          </span>
          <h2
            id="tracks-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t('tracks_title')}
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Follow curated tracks from beginner to expert, or pick individual
            courses that match your goals.
          </p>
        </div>

        {/* Tracks grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {TRACKS.map((track) => {
            const td = getTrack(track.trackId);
            return (
              <Link key={track.title} href="/courses" className="group block h-full">
                <Card
                  className={cn(
                    'h-full border-2 border-brown/10 border-l-4 transition-all duration-200 hover:border-skyblue/30 hover:shadow-md',
                    td.borderClass,
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-xl',
                          td.badgeClass,
                        )}
                      >
                        <td.Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {track.courseCount} courses
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{track.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {track.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {track.difficultyRange}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-link">
                        Explore
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
