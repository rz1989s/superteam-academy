'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface XpToastProps {
  amount: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DISPLAY_DURATION_MS = 3000;

/**
 * Pre-computed sparkle particle positions.
 * Using deterministic values avoids impure Math.random() calls during render.
 */
const SPARKLE_PARTICLES = [
  { width: 5, height: 5, top: '32%', left: '18%', delay: '0s' },
  { width: 4, height: 4, top: '55%', left: '62%', delay: '0.3s' },
  { width: 6, height: 6, top: '40%', left: '82%', delay: '0.6s' },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Floating XP award toast with entrance/exit animation.
 * Renders as a fixed-position element rather than using sonner
 * for a custom branded appearance with gold/clay theming.
 */
export function XpToast({ amount }: XpToastProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit' | 'gone'>('enter');

  useEffect(() => {
    if (amount <= 0) return;

    // Enter -> visible
    const enterTimer = setTimeout(() => setPhase('visible'), 50);

    // Visible -> exit
    const exitTimer = setTimeout(() => setPhase('exit'), DISPLAY_DURATION_MS - 500);

    // Exit -> gone
    const goneTimer = setTimeout(() => setPhase('gone'), DISPLAY_DURATION_MS);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(goneTimer);
    };
  }, [amount]);

  if (phase === 'gone' || amount <= 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed top-6 right-6 z-[9998] flex items-center gap-2.5 rounded-xl border px-5 py-3 shadow-2xl transition-all duration-500 motion-reduce:transition-none',
        'border-gold/40 bg-gold/20',
        phase === 'enter' && 'translate-y-[-20px] scale-90 opacity-0',
        phase === 'visible' && 'translate-y-0 scale-100 opacity-100',
        phase === 'exit' && 'translate-y-[-10px] scale-95 opacity-0',
      )}
    >
      {/* Sparkle icon */}
      <div className="flex size-9 items-center justify-center rounded-full bg-gold shadow-inner">
        <Sparkles className="size-5 text-clay-deep" />
      </div>

      {/* XP amount — scale-bounce on the value for emphasis */}
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            'text-lg font-bold tabular-nums tracking-tight text-clay-deep dark:text-gold motion-reduce:animate-none',
            phase === 'visible' && 'animate-scale-bounce',
          )}
        >
          +{amount.toLocaleString()} XP
        </span>
        <span className="text-xs text-clay-deep dark:text-gold">
          Lesson completed
        </span>
      </div>

      {/* Decorative sparkle particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        {SPARKLE_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute animate-xp-sparkle rounded-full bg-gold/50"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes xp-sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) translateY(0);
          }
          50% {
            opacity: 1;
            transform: scale(1) translateY(-8px);
          }
        }
        .animate-xp-sparkle {
          animation: xp-sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
