import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL,
  base: process.env.SITE_BASE_URL ?? '/',
  integrations: [react(), tailwind()]
});
