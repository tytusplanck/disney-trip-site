import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'astro:env/server': fileURLToPath(new URL('./src/test/astro-env-server.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/middleware.ts',
        'src/lib/auth/**/*.ts',
        'src/lib/trips/**/*.ts',
        'src/pages/api/auth/**/*.ts',
      ],
      exclude: ['src/lib/trips/types.ts', 'src/test/**'],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
  },
});
