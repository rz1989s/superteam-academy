'use client';

import { Trophy, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { achievementRarityStyle, type AchievementRarity } from '@/lib/achievements';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ClaimAchievementButton } from './claim-achievement-button';

interface RecentAchievementsProps {
  achievements: string[];
  isLoading: boolean;
  className?: string;
}

/**
 * Achievement metadata lookup.
 * In production this would come from the backend/CMS.
 * For now we provide a deterministic mapping based on ID.
 */
const ACHIEVEMENT_META: Record<string, { name: string; description: string; rarity: AchievementRarity }> = {
  'first-lesson': {
    name: 'First Steps',
    description: 'Completed your first lesson',
    rarity: 'common',
  },
  'first-course': {
    name: 'Scholar',
    description: 'Completed your first course',
    rarity: 'common',
  },
  'streak-7': {
    name: 'On Fire',
    description: '7-day learning streak',
    rarity: 'rare',
  },
  'streak-30': {
    name: 'Unstoppable',
    description: '30-day learning streak',
    rarity: 'epic',
  },
  'streak-100': {
    name: 'Legendary Streak',
    description: '100-day learning streak',
    rarity: 'legendary',
  },
  'xp-1000': {
    name: 'XP Hunter',
    description: 'Earned 1,000 XP',
    rarity: 'rare',
  },
  'xp-5000': {
    name: 'XP Legend',
    description: 'Earned 5,000 XP',
    rarity: 'legendary',
  },
  'first-credential': {
    name: 'Certified',
    description: 'Earned your first credential NFT',
    rarity: 'epic',
  },
  'all-beginner': {
    name: 'Foundation',
    description: 'Completed all beginner courses',
    rarity: 'rare',
  },
};

function getAchievementMeta(id: string) {
  return (
    ACHIEVEMENT_META[id] ?? {
      name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: 'Achievement unlocked',
      rarity: 'common' as AchievementRarity,
    }
  );
}

function AchievementBadge({ id }: { id: string }) {
  const meta = getAchievementMeta(id);
  const style = achievementRarityStyle(meta.rarity);

  return (
    <div className="flex flex-col items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div
              className={cn(
                'flex size-12 items-center justify-center rounded-full transition-transform group-hover:scale-110',
                style.badgeClass,
                style.ringClass,
              )}
            >
              <Trophy className={cn('size-5', style.iconClass)} />
            </div>
            <span className="max-w-[72px] truncate text-center text-[10px] font-medium text-muted-foreground">
              {meta.name}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-medium">{meta.name}</p>
          <p className="text-[10px] text-muted-foreground">{meta.description}</p>
        </TooltipContent>
      </Tooltip>
      <ClaimAchievementButton achievementId={id} earned />
    </div>
  );
}

function AchievementSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Skeleton className="size-12 rounded-full" />
      <Skeleton className="h-3 w-14" />
    </div>
  );
}

export function RecentAchievements({
  achievements,
  isLoading,
  className,
}: RecentAchievementsProps) {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  if (isLoading) {
    return (
      <Card className={cn('py-0', className)}>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm">{t('recent_achievements')}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex gap-4">
            <AchievementSkeleton />
            <AchievementSkeleton />
            <AchievementSkeleton />
            <AchievementSkeleton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('py-0', className)}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{t('recent_achievements')}</CardTitle>
          <Button variant="ghost" size="xs" asChild>
            <Link href="/profile">
              {tCommon('view_all')}
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-6 text-center">
            <Trophy className="size-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">No achievements yet</p>
              <p className="text-xs text-muted-foreground">
                Complete lessons and courses to earn badges
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-2">
              {achievements.map((id) => (
                <AchievementBadge key={id} id={id} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
