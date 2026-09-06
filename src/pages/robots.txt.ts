import type { APIRoute } from "astro";

// Generated based on the `site` URL
export const GET: APIRoute = ({ site }) => {
   const sitemapURL = site
      ? new URL("sitemap-index.xml", site).href
      : undefined;

   const body = [
      "User-agent: *",
      "Allow: /",
      ...(sitemapURL ? ["", `Sitemap: ${sitemapURL}`] : []),
      "",
   ].join("\n");

   return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
   });
};
