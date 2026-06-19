'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { difficultyClass, DIFFICULTY_LEVELS } from '@/lib/difficulty';

interface DifficultyBadgeProps {
  difficulty: number;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const t = useTranslations('courses');
  const key = DIFFICULTY_LEVELS[difficulty] ?? DIFFICULTY_LEVELS[0];

  return (
    <Badge variant="outline" className={cn(difficultyClass(difficulty), className)}>
      {t(key)}
    </Badge>
  );
}
