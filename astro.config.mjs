import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://channel47.dev',
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    functionPerRoute: false,
    runtime: 'nodejs20.x'
  }),
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/ecosystem') &&
        !page.includes('/build') &&
        !page.includes('/hire') &&
        !page.includes('/coming-soon') &&
        !page.includes('/tools') &&
        !page.includes('/skills') &&
        !page.includes('/mcps') &&
        !page.includes('/plugins/paid-search') &&
        !page.includes('/plugins/frontend-craft') &&
        !page.includes('/plugins/google-ads') &&
        !page.includes('/plugins/microsoft-ads') &&
        !page.includes('/plugins/meta-ads') &&
        !page.includes('/labs')
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
