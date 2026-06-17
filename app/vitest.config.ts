import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
    css: false,
    server: {
      deps: {
        // next-intl must be inlined so vitest can transform it; without this
        // createNavigation (used in src/i18n/routing.ts) fails to resolve
        // next/navigation in the isolated jsdom environment.
        inline: ['next-intl'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // next-intl's createNavigation imports next/navigation at module load
      // time. We resolve it through Next's public package entry (rather than
      // a hardcoded internal path) so the alias survives Next upgrades.
      'next/navigation': require.resolve('next/navigation'),
    },
  },
});
