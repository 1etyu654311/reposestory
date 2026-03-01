// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://learn-new-idea.pages.dev',

    i18n: {
        locales: ['ar', 'en', 'es', 'fr'],
        defaultLocale: 'ar',
        routing: {
            prefixDefaultLocale: true,
        },
    },

    integrations: [
        tailwind(),
        mdx(),
        react(),
        sitemap({
            i18n: {
                defaultLocale: 'ar',
                locales: {
                    ar: 'ar',
                    en: 'en',
                    es: 'es',
                    fr: 'fr',
                },
            },
        }),
    ],

    markdown: {
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            },
        },
    },
});
