# CLAUDE.md

Work-in-progress. Only the rules below are established — do not infer others.

## Rules

### CSS: every `<style>` tag must follow the `@layer` setup

The canonical layer order is declared in `src/styles/global.css`:

```css
@layer base, component, utility;
```

Any `<style>` tag added to an `.astro` file must re-declare that order and place
its rules in the appropriate layer:

```astro
<style is:global>
@layer base, component, utility;

@layer component {
  .my-thing { ... }
}
</style>
```

See `src/components/Button.astro` for the reference implementation.

**Both lines are required.** Layer priority is set by first-declaration order, so
without the `@layer base, component, utility;` line a component's `@layer component`
block declares `component` first, ranking it *below* `base` — and the base reset
(`button { all: unset }`, `*:not(dialog) { margin: 0 }`) silently wipes out the
component's styling.

The build minifier strips the order statement from the output. That is expected:
it reads the declaration, reorders the layer blocks to match, then drops it as
redundant. Its absence from `dist/` does not mean it was ignored.

Never leave rules unlayered. Unlayered CSS beats every layered rule regardless of
specificity, so an unlayered component style silently overrides the `utility`
layer and `u-*` classes stop working on it.

### CSS: `:hover` must be gated behind a hover-capable media query

Never write a bare `:hover` rule:

```css
@media (hover: hover) and (pointer: fine) {
  .my-thing:hover { ... }
}
```

The media query goes inside the `@layer` block, not around it.
