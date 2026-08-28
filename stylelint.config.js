/**
 * Makes the CSS rules in AGENTS.md executable instead of advisory.
 *
 * A rule belongs here only if the failure it catches is SILENT and it fires
 * near-zero times on correct code. Conventions that need human judgement
 * (which spacing token, when a raw length is fine) stay as prose in AGENTS.md
 * — a linter that cries wolf gets disabled, and then it guards nothing.
 */
const HEX = "/#[0-9a-fA-F]{3,8}/";

export default {
   plugins: ["./.stylelint/plugins.js"],

   /**
    * An escape hatch is fine; a silent one is not. These make every
    * `stylelint-disable` comment justify itself:
    *   - descriptionless: a disable with no `-- reason` fails the build
    *   - needless:        a disable that suppresses nothing fails the build
    *                      (catches stale ones left behind after code changed)
    *   - invalidScope:    a disable naming a rule we don't run fails the build
    */
   reportDescriptionlessDisables: true,
   reportNeedlessDisables: true,
   reportInvalidScopeDisables: true,

   overrides: [
      {
         files: ["**/*.astro"],
         customSyntax: "postcss-html",
      },
      {
         // tokens.css is the one legitimately unlayered file: it defines custom
         // properties on :root rather than styling anything, and it is where
         // every literal color in the system is supposed to live.
         files: ["src/styles/tokens.css"],
         rules: {
            "starter/no-unlayered-rules": null,
            "declaration-property-value-disallowed-list": null,
         },
      },
   ],

   rules: {
      "starter/layer-order-required": true,
      "starter/no-unlayered-rules": true,
      "starter/hover-requires-hover-media": true,

      /**
       * Hardcoded colors opt out of light-dark(). They render correctly in
       * light mode and silently break in dark — the build passes, astro check
       * passes, and a screenshot review in light mode sees nothing wrong.
       *
       * Scoped to theme-reactive properties only, so gradient stops, shadows,
       * and third-party brand colors stay legal. For a deliberate exception:
       *   // stylelint-disable-next-line declaration-property-value-disallowed-list -- Slack brand blue
       */
      "declaration-property-value-disallowed-list": {
         color: [HEX],
         "/^background/": [HEX],
         "/^border/": [HEX],
         "/^(fill|stroke)$/": [HEX],
         "/^(outline|text-decoration)-color$/": [HEX],
      },
   },
};
