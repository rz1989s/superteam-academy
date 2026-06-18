'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DIFFICULTY_CONFIG = [
  {
    key: 'beginner' as const,
    className: 'border-leaf/30 bg-leaf/20 text-green-deep',
  },
  {
    key: 'intermediate' as const,
    className: 'border-gold/30 bg-gold/20 text-clay-deep',
  },
  {
    key: 'advanced' as const,
    className: 'border-rust/30 bg-rust/15 text-rust-deep',
  },
] as const;

interface DifficultyBadgeProps {
  difficulty: number;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const t = useTranslations('courses');

  const config = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG[0];

  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {t(config.key)}
    </Badge>
  );
}
