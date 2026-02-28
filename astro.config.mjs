import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  env: {
    validateSecrets: true,
    schema: {
      SITE_PASSWORD: envField.string({
        context: 'server',
        access: 'secret',
        min: 1,
      }),
    },
  },
});
