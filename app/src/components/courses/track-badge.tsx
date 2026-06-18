'use client';

import { GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TRACKS, ALL_TRACKS, type TrackId } from '@/lib/tracks';

interface TrackBadgeProps {
  trackId: number;
  trackSlug?: string;
  className?: string;
}

export function TrackBadge({ trackId, trackSlug, className }: TrackBadgeProps) {
  const track =
    TRACKS[String(trackId) as TrackId] ??
    (trackSlug ? ALL_TRACKS.find((t) => t.slug === trackSlug) : undefined);

  if (!track) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 border-border bg-muted text-muted-foreground',
          className,
        )}
      >
        <GraduationCap className="size-3" />
        General
      </Badge>
    );
  }

  const Icon = track.Icon;
  return (
    <Badge variant="outline" className={cn('gap-1.5', track.badgeClass, className)}>
      <Icon className="size-3" />
      {track.name}
    </Badge>
  );
}
