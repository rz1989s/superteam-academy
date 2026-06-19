'use client';

import { useTranslations } from 'next-intl';
import { Clock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { difficultyClass } from '@/lib/difficulty';
import { challengeCategoryStyle } from '@/lib/challenge-categories';
import type { CodingChallenge } from '@/lib/challenges';

interface ChallengeBrowserCardProps {
  challenge: CodingChallenge;
  className?: string;
}

export function ChallengeBrowserCard({ challenge, className }: ChallengeBrowserCardProps) {
  const t = useTranslations('challenges_page');
  const category = challengeCategoryStyle(challenge.category);

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-lg border-l-4 border bg-card p-4 transition-colors hover:bg-accent/50',
        category.borderClass,
        className,
      )}
    >
      {/* Top row: category + difficulty */}
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className={cn('text-[10px]', category.badgeClass)}>
          {t(challenge.category.replace('-', '_') as 'solana_fundamentals' | 'defi' | 'nft_metaplex' | 'security' | 'token_extensions')}
        </Badge>
        <Badge variant="outline" className={cn('text-[10px]', difficultyClass(challenge.difficulty))}>
          {t(challenge.difficulty)}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-tight line-clamp-2">
        {challenge.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {challenge.description}
      </p>

      {/* Bottom row: language, XP, time */}
      <div className="mt-auto flex items-center gap-3 pt-1">
        <Badge variant="outline" className="text-[10px] font-mono">
          {challenge.language === 'rust' ? 'Rust' : 'TypeScript'}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Zap className="size-3 text-primary" />
          {challenge.xpReward}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {challenge.estimatedMinutes}m
        </span>
      </div>
    </div>
  );
}
