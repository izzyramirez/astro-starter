// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
   // bp-placeholder: Site URL. Feeds canonical tags, absolute OG image URLs,
   // robots.txt and the sitemap — set this before any deploy.
   site: "https://your-site.com",

   integrations: [sitemap()],

   fonts: [
      {
         provider: fontProviders.local(),
         name: "General Sans",
         cssVariable: "--font-primary",
         options: {
            variants: [
               {
                  src: ["./src/assets/fonts/GeneralSans-Regular.woff2"],
                  weight: "400",
                  style: "normal",
               },
               {
                  src: ["./src/assets/fonts/GeneralSans-Medium.woff2"],
                  weight: "500",
                  style: "normal",
               },
               {
                  src: ["./src/assets/fonts/GeneralSans-Semibold.woff2"],
                  weight: "600",
                  style: "normal",
               },
            ],
         },
      },
   ],

   vite: {
      resolve: {
         alias: {
            "@": "/src",
            "@components": "/src/components",
            "@layouts": "/src/layouts",
            "@scripts": "/src/scripts",
            "@styles": "/src/styles",
            "@assets": "/src/assets",
         },
      },
   },
});
