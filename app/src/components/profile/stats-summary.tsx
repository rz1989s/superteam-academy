'use client';

import {
  Zap,
  Shield,
  Flame,
  BookOpen,
  CheckCircle2,
  Award,
  Trophy,
  Target,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export interface ProfileStats {
  totalXp: number;
  level: number;
  levelTitle: string;
  xpProgress: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  coursesInProgress: number;
  lessonsCompleted: number;
  credentialsEarned: number;
  achievementCount: number;
  currentStreak: number;
  longestStreak: number;
}

interface StatsSummaryProps {
  stats: ProfileStats;
  isLoading?: boolean;
  className?: string;
}

interface StatItemProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  sublabel?: string;
  accent: string;
  children?: React.ReactNode;
}

function StatItem({ icon, iconBg, label, value, sublabel, accent, children }: StatItemProps) {
  return (
    <Card className="group relative overflow-hidden py-0 transition-shadow hover:shadow-md">
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110',
            iconBg,
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className={cn('text-xl font-bold tabular-nums leading-none', accent)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {sublabel && (
            <p className="text-[10px] text-muted-foreground">{sublabel}</p>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function StatItemSkeleton() {
  return (
    <Card className="py-0">
      <CardContent className="flex items-start gap-3 p-4">
        <Skeleton className="size-9 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsSummary({ stats, isLoading = false, className }: StatsSummaryProps) {
  const t = useTranslations('gamification');

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <StatItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-4', className)}>
      <StatItem
        icon={<Zap className="size-4 text-clay-deep" />}
        iconBg="bg-gold/20"
        label={t('xp')}
        value={stats.totalXp}
        accent="text-clay-deep"
      >
        <Progress value={stats.xpProgress} className="mt-1 h-1.5" />
      </StatItem>

      <StatItem
        icon={<Shield className="size-4 text-link" />}
        iconBg="bg-skyblue/10"
        label={t('level')}
        value={stats.level}
        sublabel={stats.levelTitle}
        accent="text-link"
      />

      <StatItem
        icon={
          <Flame
            className={cn(
              'size-4',
              stats.currentStreak > 0
                ? 'text-clay-deep'
                : 'text-muted-foreground',
            )}
            fill={stats.currentStreak > 0 ? 'currentColor' : 'none'}
          />
        }
        iconBg={cn(
          stats.currentStreak > 0
            ? 'bg-clay/15'
            : 'bg-muted',
        )}
        label={t('streak')}
        value={stats.currentStreak}
        sublabel={`Best: ${stats.longestStreak} days`}
        accent={cn(
          stats.currentStreak > 0
            ? 'text-clay-deep'
            : 'text-muted-foreground',
        )}
      />

      <StatItem
        icon={<BookOpen className="size-4 text-green-deep" />}
        iconBg="bg-leaf/20"
        label="Enrolled"
        value={stats.coursesEnrolled}
        sublabel={`${stats.coursesInProgress} in progress`}
        accent="text-green-deep"
      />

      <StatItem
        icon={<CheckCircle2 className="size-4 text-green-deep" />}
        iconBg="bg-leaf/20"
        label="Completed"
        value={stats.coursesCompleted}
        sublabel="courses"
        accent="text-green-deep"
      />

      <StatItem
        icon={<Target className="size-4 text-link" />}
        iconBg="bg-skyblue/10"
        label="Lessons"
        value={stats.lessonsCompleted}
        sublabel="completed"
        accent="text-link"
      />

      <StatItem
        icon={<Award className="size-4 text-clay-deep" />}
        iconBg="bg-clay/15"
        label="Credentials"
        value={stats.credentialsEarned}
        sublabel="on-chain NFTs"
        accent="text-clay-deep"
      />

      <StatItem
        icon={<Trophy className="size-4 text-rust-deep" />}
        iconBg="bg-rust/15"
        label="Achievements"
        value={stats.achievementCount}
        sublabel="unlocked"
        accent="text-rust-deep"
      />
    </div>
  );
}
