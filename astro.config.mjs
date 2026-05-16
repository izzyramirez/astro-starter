// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: Replace with your site URL before deploying
  site: 'https://your-site.com',

  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@scripts': '/src/scripts',
        '@styles': '/src/styles',
      },
    },
  },
});
