/**
 * Local stylelint rules that make the CSS conventions in AGENTS.md executable.
 *
 * Each rule here exists because the failure it catches is SILENT — the page
 * still renders, nothing errors, and the bug surfaces later in a context
 * (dark mode, a touch device, a component used somewhere new) where nobody
 * connects it back to the CSS that caused it.
 */
import stylelint from "stylelint";

const { createPlugin, utils } = stylelint;

const CANONICAL_ORDER = "base, component, utility";

/** postcss-html yields a Document (one Root per <style>); plain CSS yields a Root. */
function eachRoot(node, cb) {
   if (node.type === "document") node.nodes.forEach((n) => cb(n));
   else cb(node);
}

/** Is this node inside an `@layer { }` block? */
function isInsideLayer(node) {
   for (let p = node.parent; p; p = p.parent) {
      if (p.type === "atrule" && p.name.toLowerCase() === "layer" && p.nodes) {
         return true;
      }
   }
   return false;
}

/** Selectors inside @keyframes ("0%", "from") are not cascade rules. */
function isInsideKeyframes(node) {
   for (let p = node.parent; p; p = p.parent) {
      if (p.type === "atrule" && /keyframes$/i.test(p.name)) return true;
   }
   return false;
}

function normalizeParams(params) {
   return params.replace(/\s+/g, " ").trim();
}

/* ------------------------------------------------------------------ *
 * 1. starter/layer-order-required
 *
 * Layer priority is set by FIRST-DECLARATION order. A file whose first
 * mention of `component` is its own `@layer component { }` block ranks
 * component BELOW base — so the base reset (`button { all: unset }`,
 * `*:not(dialog) { margin: 0 }`) silently wipes out the component's styling.
 * ------------------------------------------------------------------ */
const layerOrderRequired = createPlugin(
   "starter/layer-order-required",
   (enabled) => (root, result) => {
      if (!enabled) return;

      eachRoot(root, (styleRoot) => {
         let orderIndex = -1;
         let firstBlockIndex = -1;
         let firstBlock = null;
         let i = 0;

         styleRoot.walkAtRules(/^layer$/i, (atRule) => {
            const isStatement = !atRule.nodes;
            if (
               isStatement &&
               normalizeParams(atRule.params) === CANONICAL_ORDER
            ) {
               if (orderIndex === -1) orderIndex = i;
            } else if (atRule.nodes) {
               if (firstBlockIndex === -1) {
                  firstBlockIndex = i;
                  firstBlock = atRule;
               }
            }
            i += 1;
         });

         if (firstBlockIndex === -1) return; // no layer blocks, nothing to order

         if (orderIndex === -1) {
            utils.report({
               message: `Missing "@layer ${CANONICAL_ORDER};" — without it this block's layer ranks below base, and the reset will wipe these styles.`,
               node: firstBlock,
               result,
               ruleName: "starter/layer-order-required",
            });
         } else if (orderIndex > firstBlockIndex) {
            utils.report({
               message: `"@layer ${CANONICAL_ORDER};" must come BEFORE any @layer block — order is set by first declaration.`,
               node: firstBlock,
               result,
               ruleName: "starter/layer-order-required",
            });
         }
      });
   },
);
layerOrderRequired.ruleName = "starter/layer-order-required";

/* ------------------------------------------------------------------ *
 * 2. starter/no-unlayered-rules
 *
 * Unlayered CSS beats every layered rule regardless of specificity. One
 * unlayered component style silently overrides the utility layer, and
 * `u-*` classes stop working on that element with no error anywhere.
 * ------------------------------------------------------------------ */
const noUnlayeredRules = createPlugin(
   "starter/no-unlayered-rules",
   (enabled) => (root, result) => {
      if (!enabled) return;

      eachRoot(root, (styleRoot) => {
         styleRoot.walkRules((rule) => {
            if (isInsideKeyframes(rule) || isInsideLayer(rule)) return;
            utils.report({
               message: `Unlayered rule "${rule.selector}" — unlayered CSS outranks every layered rule, so this silently defeats the utility layer. Wrap it in @layer base/component/utility.`,
               node: rule,
               result,
               ruleName: "starter/no-unlayered-rules",
            });
         });
      });
   },
);
noUnlayeredRules.ruleName = "starter/no-unlayered-rules";

/* ------------------------------------------------------------------ *
 * 3. starter/hover-requires-hover-media
 *
 * A bare :hover sticks on touch devices — the state latches after a tap
 * and stays until the user taps elsewhere. Invisible on desktop, where
 * it gets tested.
 * ------------------------------------------------------------------ */
const hoverRequiresHoverMedia = createPlugin(
   "starter/hover-requires-hover-media",
   (enabled) => (root, result) => {
      if (!enabled) return;

      eachRoot(root, (styleRoot) => {
         styleRoot.walkRules((rule) => {
            if (!/:hover\b/.test(rule.selector)) return;

            let guarded = false;
            for (let p = rule.parent; p; p = p.parent) {
               if (
                  p.type === "atrule" &&
                  p.name.toLowerCase() === "media" &&
                  /hover\s*:\s*hover/i.test(p.params)
               ) {
                  guarded = true;
                  break;
               }
            }

            if (!guarded) {
               utils.report({
                  message: `":hover" must sit inside "@media (hover: hover) and (pointer: fine)" — a bare :hover latches on touch devices.`,
                  node: rule,
                  result,
                  ruleName: "starter/hover-requires-hover-media",
               });
            }
         });
      });
   },
);
hoverRequiresHoverMedia.ruleName = "starter/hover-requires-hover-media";

export default [layerOrderRequired, noUnlayeredRules, hoverRequiresHoverMedia];
