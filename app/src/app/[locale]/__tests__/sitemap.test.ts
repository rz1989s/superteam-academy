import { describe, it, expect } from 'vitest';
import sitemap from '../sitemap';
import { routing } from '@/i18n/routing';

describe('sitemap locale coverage', () => {
  it('emits entries for every routing locale', () => {
    const entries = sitemap();
    for (const locale of routing.locales) {
      // Use segment-boundary check to avoid false matches where the locale
      // string appears inside a path segment (e.g. "/en/courses/sahi" would
      // incorrectly satisfy includes("/hi")).
      const hasLocale = entries.some(
        (e) => e.url.includes(`/${locale}/`) || e.url.endsWith(`/${locale}`),
      );
      expect(hasLocale, `missing sitemap entries for locale "${locale}"`).toBe(true);
    }
  });
});
