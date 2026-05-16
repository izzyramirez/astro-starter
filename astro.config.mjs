// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: Replace with your site URL before deploying
  site: 'https://your-site.com',

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'General Sans',
      cssVariable: '--font-primary',
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/GeneralSans-Regular.woff2'],
            weight: '400',
            style: 'normal',
          },
          {
            src: ['./src/assets/fonts/GeneralSans-Medium.woff2'],
            weight: '500',
            style: 'normal',
          },
        ],
      },
    },
  ],

  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@scripts': '/src/scripts',
        '@styles': '/src/styles',
        '@assets': '/src/assets',
      },
    },
  },
});
