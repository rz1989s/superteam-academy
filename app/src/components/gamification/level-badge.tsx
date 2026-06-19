'use client';

import { cn } from '@/lib/utils';
import { levelTierStyle } from '@/lib/level-tiers';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LevelBadgeProps {
  level: number;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: { container: 'size-8', text: 'text-xs', title: 'text-[10px]' },
  md: { container: 'size-11', text: 'text-sm', title: 'text-xs' },
  lg: { container: 'size-14', text: 'text-lg', title: 'text-sm' },
} as const;

export function LevelBadge({ level, title, size = 'md', className }: LevelBadgeProps) {
  const tier = levelTierStyle(title);
  const dimensions = SIZE_MAP[size];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn('flex flex-col items-center gap-1', className)}>
          <div
            className={cn(
              'flex items-center justify-center rounded-full border-2 font-bold transition-transform hover:scale-105',
              tier.bg,
              tier.border,
              tier.text,
              tier.ring,
              dimensions.container,
              dimensions.text,
            )}
            role="img"
            aria-label={`Level ${level} - ${title}`}
          >
            {level}
          </div>
          <span
            className={cn(
              'font-medium leading-none',
              tier.text,
              dimensions.title,
            )}
          >
            {title}
          </span>
          {tier.pips > 0 && (
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: tier.pips }).map((_, i) => (
                <span
                  key={i}
                  className={cn('size-1 rounded-full bg-current', tier.text)}
                />
              ))}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Level {level} &middot; {title}
      </TooltipContent>
    </Tooltip>
  );
}
