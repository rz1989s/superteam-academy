export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

const DIFFICULTY_CLASS: Record<DifficultyLevel, string> = {
  beginner: 'border-leaf/30 bg-leaf/20 text-green-deep',
  intermediate: 'border-gold/30 bg-gold/20 text-clay-deep',
  advanced: 'border-rust/30 bg-rust/15 text-rust-deep',
};

/** Brand classification class for a difficulty, by level name or 0-based index. */
export function difficultyClass(level: DifficultyLevel | number): string {
  const key =
    typeof level === 'number' ? DIFFICULTY_LEVELS[level] ?? 'beginner' : level;
  return DIFFICULTY_CLASS[key] ?? DIFFICULTY_CLASS.beginner;
}
