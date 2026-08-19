import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
   loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
   schema: z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // TODO: Replace with your name
      author: z.string().default("Astro boi"),
      ogImage: z.string().optional(),
      draft: z.boolean().default(false),
   }),
});

export const collections = { blog };
