'use client';

import { useTranslations } from 'next-intl';
import { Award, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getTrack } from '@/lib/tracks';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CredentialPreviewProps {
  courseName: string;
  trackId: number;
  totalXp: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CredentialPreview({
  courseName,
  trackId,
  totalXp,
}: CredentialPreviewProps) {
  const t = useTranslations('courses');
  const track = getTrack(String(trackId));
  const trackName = track.name;
  const TrackIcon = track.Icon;

  return (
    <Card className="overflow-hidden py-0">
      {/* Card label */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <Award className="text-muted-foreground size-4" />
        <span className="text-sm font-semibold">{t('credential_earned')}</span>
      </div>

      <Separator />

      <CardContent className="flex flex-col items-center gap-4 px-4 py-6">
        {/* NFT mockup */}
        <div
          className={cn(
            'relative flex size-32 items-center justify-center rounded-2xl bg-gradient-to-br ring-4 ring-gold/40 sm:size-36',
            track.artGradient,
          )}
        >
          {/* Inner decoration */}
          <div className="absolute inset-2 rounded-xl border border-white/20" />
          <div className="relative flex flex-col items-center gap-1">
            <TrackIcon className="size-10 text-white sm:size-12" />
            <span className="text-[10px] font-bold tracking-wider text-white uppercase">
              {trackName}
            </span>
          </div>

          {/* Corner sparkle */}
          <Sparkles className="absolute -top-1.5 -right-1.5 size-5 text-gold drop-shadow-sm" />
        </div>

        {/* Course name */}
        <p className="text-center text-sm font-medium leading-tight">
          {courseName}
        </p>

        {/* Metadata */}
        <div className="bg-muted/50 flex w-full items-center justify-around rounded-lg px-3 py-2.5 text-center">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
              {t('track_label')}
            </span>
            <span className="text-xs font-semibold">{trackName}</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
              {t('xp')}
            </span>
            <span className="text-xs font-semibold tabular-nums">{totalXp}</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
              {t('type_label')}
            </span>
            <span className="text-xs font-semibold">Soulbound</span>
          </div>
        </div>

        {/* CTA text */}
        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          {t('complete_to_earn')}
        </p>
      </CardContent>
    </Card>
  );
}
