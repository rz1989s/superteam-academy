'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BookOpen, Clock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DifficultyBadge } from '@/components/courses/difficulty-badge';
import { TrackBadge } from '@/components/courses/track-badge';
import { getTrack } from '@/lib/tracks';
import { cn } from '@/lib/utils';
import type { CourseWithMeta } from '@/lib/stores/course-store';

interface CourseCardProps {
  course: CourseWithMeta;
  enrollment?: {
    progressPercent: number;
    isFinalized: boolean;
  };
}

export function CourseCard({ course, enrollment }: CourseCardProps) {
  const t = useTranslations('courses');

  const track = getTrack(String(course.trackId));
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.isFinalized ?? false;

  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col gap-0 overflow-hidden border-2 border-brown/10 py-0 transition-all duration-200 group-hover:scale-[1.01] hover:border-skyblue/30 hover:shadow-md">
        {/* Brand tint header */}
        <div
          className={cn(
            'relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br',
            track.tintGradient,
          )}
        >
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt=""
              fill
              className="absolute inset-0 object-cover"
              unoptimized
            />
          ) : (
            <track.Icon className="size-10 text-foreground/20" />
          )}
          {/* XP pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            <Sparkles className="size-3 text-clay-deep dark:text-gold" />
            <span className="tabular-nums">{course.totalXp.toLocaleString()}</span>
          </div>
          {/* Completion badge (emerald = status, kept) */}
          {isCompleted && (
            <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
              <CheckCircle2 className="size-3.5" />
              {t('completed')}
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          {/* Brand badges (no white overrides — they sit on the card surface now) */}
          <div className="flex flex-wrap items-center gap-2">
            <TrackBadge trackId={course.trackId} trackSlug={course.trackSlug} />
            <DifficultyBadge difficulty={course.difficulty} />
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-base leading-tight font-semibold tracking-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {course.description}
          </p>

          {/* Stats row */}
          <div className="mt-auto flex items-center gap-4 text-xs">
            <StatItem icon={BookOpen} value={course.lessonCount} label={t('lessons')} />
            <StatItem icon={Clock} value={course.estimatedHours} label={t('hours')} />
            <StatItem icon={Sparkles} value={course.totalXp} label={t('xp')} />
          </div>

          {/* Progress (enrolled, not finalized) */}
          {isEnrolled && !isCompleted && (
            <div className="flex flex-col gap-1.5">
              <Progress value={enrollment.progressPercent} className="h-1.5" />
              <span className="text-muted-foreground text-xs">
                {t('progress', { percent: Math.round(enrollment.progressPercent) })}
              </span>
            </div>
          )}

          {/* CTA (completed = emerald status, kept) */}
          <Button
            variant={isEnrolled ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'mt-1 w-full gap-1.5 transition-colors',
              isCompleted && 'bg-emerald-600 text-white hover:bg-emerald-700',
            )}
            tabIndex={-1}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="size-3.5" />
                {t('completed')}
              </>
            ) : isEnrolled ? (
              <>
                {t('continue')}
                <ArrowRight className="size-3.5" />
              </>
            ) : (
              t('start')
            )}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div className="text-muted-foreground flex items-center gap-1">
      <Icon className="size-3.5" />
      <span className="font-medium tabular-nums">{value}</span>
      <span>{label}</span>
    </div>
  );
}
