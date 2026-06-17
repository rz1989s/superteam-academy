import { describe, it, expect } from 'vitest';
import { getCourseJsonLd } from '../json-ld';
import type { CourseWithMeta } from '@/lib/stores/course-store';

const course = {
  title: 'Test', description: 'd', difficulty: 0, estimatedHours: 1, lessonCount: 1,
} as CourseWithMeta;

describe('course JSON-LD language coverage', () => {
  it('lists Hindi alongside en/pt-BR/es', () => {
    const { inLanguage } = getCourseJsonLd(course);
    expect(inLanguage).toEqual(['en', 'pt-BR', 'es', 'hi']);
  });
});
