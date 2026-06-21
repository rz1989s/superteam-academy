'use client';

import { Zap, Shield, Flame, BookOpen, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface QuickStatsProps {
  xp: number;
  xpProgress: number;
  level: number;
  levelTitle: string;
  currentStreak: number;
  enrolledCount: number;
  rank: number | null;
  isLoading: boolean;
  className?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  accent: string;
  iconBg: string;
  children?: React.ReactNode;
}

function StatCard({ icon, label, value, sublabel, accent, iconBg, children }: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden py-0 transition-shadow hover:shadow-md">
      <CardContent className="flex items-start gap-4 p-4">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110',
            iconBg,
          )}
        >
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className={cn('text-xl font-bold tabular-nums leading-none', accent)}>
            {value}
          </p>
          {sublabel && (
            <p className="text-[11px] text-muted-foreground">{sublabel}</p>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="py-0">
      <CardContent className="flex items-start gap-4 p-4">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStats({
  xp,
  xpProgress,
  level,
  levelTitle,
  currentStreak,
  enrolledCount,
  rank,
  isLoading,
  className,
}: QuickStatsProps) {
  const t = useTranslations('gamification');
  const tLeaderboard = useTranslations('leaderboard');

  if (isLoading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-5', className)}>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-5', className)}>
      {/* Total XP */}
      <StatCard
        icon={<Zap className="size-5 text-clay-deep dark:text-gold" />}
        iconBg="bg-gold/20"
        label={t('xp')}
        value={xp.toLocaleString()}
        accent="text-clay-deep dark:text-gold"
      >
        <Progress value={xpProgress} className="mt-1.5 h-1.5" />
      </StatCard>

      {/* Current Level */}
      <StatCard
        icon={<Shield className="size-5 text-link dark:text-skyblue" />}
        iconBg="bg-skyblue/10"
        label={t('level')}
        value={level}
        sublabel={levelTitle}
        accent="text-link dark:text-skyblue"
      />

      {/* Day Streak */}
      <StatCard
        icon={
          <Flame
            className={cn(
              'size-5',
              currentStreak > 0
                ? 'text-clay-deep dark:text-clay'
                : 'text-muted-foreground',
            )}
            fill={currentStreak > 0 ? 'currentColor' : 'none'}
          />
        }
        iconBg={cn(
          currentStreak > 0
            ? 'bg-clay/15'
            : 'bg-muted',
        )}
        label={t('streak')}
        value={currentStreak}
        accent={cn(
          currentStreak > 0
            ? 'text-clay-deep dark:text-clay'
            : 'text-muted-foreground',
        )}
      />

      {/* Courses Enrolled */}
      <StatCard
        icon={<BookOpen className="size-5 text-green-deep dark:text-leaf" />}
        iconBg="bg-leaf/20"
        label="Courses"
        value={enrolledCount}
        accent="text-green-deep dark:text-leaf"
      />

      {/* Leaderboard Rank */}
      <StatCard
        icon={<Trophy className="size-5 text-rust-deep dark:text-rust-bright" />}
        iconBg="bg-rust/15"
        label={tLeaderboard('rank')}
        value={rank !== null ? `#${rank}` : '—'}
        accent="text-rust-deep dark:text-rust-bright"
      />
    </div>
  );
}
