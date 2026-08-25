---
name: create-icon
description: Create or edit an SVG icon component in src/assets/icons/. Use when adding a new icon, converting an SVG export (Figma, Lucide, Heroicons, etc.) into an .astro component, or fixing an existing icon's props, sizing, or color behavior.
---

# Creating an icon component

Icons live in `src/assets/icons/` as PascalCase `.astro` files (`ArrowRight.astro`)
and are imported via the alias:

```astro
import ArrowRight from "@assets/icons/ArrowRight.astro";
```

There are exactly two shapes. **Which one you use depends on how the paths paint —
that is the only difference between them.**

- Paths use `stroke` → stroke template (has a `stroke` prop)
- Paths use `fill` → fill template (no `stroke` prop)

Never give a fill-based icon a `stroke` prop. It would be dead API surface.

## Stroke template

Most UI icons. Copy this verbatim and replace only the `viewBox` (if not 24) and
the `<path>` elements.

```astro
---
interface Props {
   width?: number | string;
   height?: number | string;
   class?: string;
   stroke?: number;
   "aria-hidden"?: "true" | "false";
}
const {
   width = 24,
   height = 24,
   class: className,
   "aria-hidden": ariaHidden = "true",
   stroke = 2,
} = Astro.props;
---

<svg
   class={className}
   width={width}
   height={height}
   viewBox="0 0 24 24"
   fill="none"
   xmlns="http://www.w3.org/2000/svg"
   aria-hidden={ariaHidden}
>
   <path
      d="M5 12H19M12 19L19 12L12 5"
      stroke="currentColor"
      stroke-width={stroke}
      stroke-linecap="round"
      stroke-linejoin="round"></path>
</svg>
```

**Required** on every stroked `<path>`: `stroke="currentColor"` and
`stroke-width={stroke}`.

`stroke-linecap` and `stroke-linejoin` are a per-icon design choice, not a rule.
`round` suits most of the current set, but use whatever the artwork needs — just
apply the same choice to every path within a single icon.

## Fill template

Logos, wordmarks, and solid glyphs. Identical minus the `stroke` prop, and the
`viewBox` matches the artwork's real aspect ratio rather than being forced to 24.

```astro
---
interface Props {
   width?: number | string;
   height?: number | string;
   class?: string;
   "aria-hidden"?: "true" | "false";
}
const {
   width = 27,
   height = 10,
   class: className,
   "aria-hidden": ariaHidden = "true",
} = Astro.props;
---

<svg
   class={className}
   width={width}
   height={height}
   viewBox="0 0 27 10"
   fill="none"
   xmlns="http://www.w3.org/2000/svg"
   aria-hidden={ariaHidden}
>
   <path d="…" fill="currentColor"></path>
</svg>
```

The `viewBox` here is the artwork's real aspect ratio, and the `width`/`height`
defaults match it. See the sizing rule below — that pairing is required, not just
convention.

## Rules

**Color is always `currentColor`.** Never hardcode a hex, a `var(--color-*)`, or
`fill="black"`. The icon inherits from whatever it sits in, which is what makes it
work in both themes and inside buttons/links without extra rules.

**`fill="none"` stays on the `<svg>` element** in both templates, including
fill-based ones. Per-path `fill` overrides it; leaving it explicit stops a stray
default fill from filling a stroked shape.

**`aria-hidden` defaults to `"true"`.** Icons are decorative by default. If an icon
is the only content of a control, do not flip this — leave it hidden and give the
*control* an `aria-label`, or pair the icon with `<span class="u-sr-only">`.

**`width`/`height` defaults must equal the `viewBox` dimensions.** Both templates,
every icon. `viewBox="0 0 27 10"` means `width = 27, height = 10`. If they disagree
the icon renders at the wrong size with no props passed, and the failure is quiet —
`preserveAspectRatio` letterboxes the artwork rather than distorting it, so it looks
merely misplaced instead of obviously broken.

**24×24 is the preferred viewBox for UI icons**, since a shared grid keeps stroke
weights consistent across the set. It is a preference, not a requirement: use the
artwork's real dimensions when it isn't square, and match width/height to them.

**Keep prop and attribute order identical to the templates.** The set is currently
uniform; drift makes diffs noisy for no benefit.

## Sizing gotcha

`width` and `height` are rendered as **HTML attributes**, so an icon carries its own
intrinsic size. The global reset only sets `display: block; max-width: 100%` — which
caps but never grows it.

To make an icon fill its slot (logos, illustrations), add `u-svg-fluid`:

```astro
<Company class="u-svg-fluid" />
```

`u-svg-fluid` is `width: 100%; height: auto`. The `height: auto` is the load-bearing
half: without it the `height` attribute stays fixed while width grows, and
`preserveAspectRatio` fits the artwork to the smaller scale — so the icon silently
refuses to grow and you get mystery whitespace either side.

Do not add `u-svg-fluid` to normal UI icons; they should keep their intrinsic size.

## Converting an export

SVG exported from Figma or copied from an icon set needs normalizing:

1. Delete the export's own `width`/`height` — they become props.
2. Delete `<title>`, `<desc>`, `<defs>`, `<g>` wrappers, and `id`/`class` attributes
   the export added.
3. Replace every hardcoded `stroke="#000"` / `fill="#000"` with `currentColor`.
4. Replace the literal `stroke-width="2"` with `{stroke}`.
5. Keep the `viewBox`. If it is not `0 0 24 24` and this is a UI icon, rescale the
   artwork rather than shipping an odd viewBox.
6. Collapse multi-path outlines into one `<path>` where the `d` allows it.

## Before finishing

- [ ] Correct template chosen for how the paths paint
- [ ] No `stroke` prop on a fill-based icon
- [ ] All colors are `currentColor`
- [ ] `aria-hidden` defaults to `"true"`
- [ ] `width`/`height` defaults match the `viewBox`
- [ ] Renders at the right size with no props passed
- [ ] `npx astro check` passes
