// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://itparkcapital.uz',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'uz',
    locales: ['uz', 'ru', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'uz',
        locales: {
          uz: 'uz-UZ',
          ru: 'ru-RU',
          en: 'en-US',
        },
      },
    }),
  ],
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
});
