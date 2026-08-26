---
name: create-form
description: Write form markup for this project — inputs, textareas, selects, grouped controls, and error states inside the Form component. Use when adding or editing a form, adding a field to an existing form, wiring validation errors into markup, or fixing form layout/spacing that looks broken.
---

# Writing form markup

Two files own forms:

- `src/components/Form.astro` — the `<form>` wrapper, submit-state script, `error` prop
- `src/styles/form.css` — every form class, all scoped under `.form`

**`form.css` is the source of truth, and it is meant to be replaced.** This is a
starter template: the styling it ships is one reasonable take, and a project using it
may swap the whole thing for something simpler. What this skill is really about is the
markup contract — class names, semantics, and wiring — which survives a restyle. Read
`form.css` before relying on any layout claim below.

## Rules that hold regardless of styling

**Fields belong inside a `<Form>`.** Every selector in `form.css` is prefixed with
`.form`, so an `.input` outside one renders unstyled. That is deliberate — it keeps
inputs elsewhere in the app free to look however they want.

```astro
import Form from "@components/Form.astro";

<Form id="contact" error={errorMessage}>
   …fields…
   <Button type="submit" full>Send message</Button>
</Form>
```

`novalidate` defaults to `true` (we render our own errors). The component sets
`data-module="form"` itself — never add it by hand, it would double-bind the script.

**Every control needs an accessible name.** Either `id` + `<label for>`, or a `<label>`
wrapping the control. Placeholders are not labels.

**Controls that share one question are a group.** If several controls answer a single
prompt — "Please select inquiry type", "Which topics interest you?" — wrap them in a
`<fieldset>` with a `<legend>` as its first element child, so the prompt is announced
with each option. `role="group"` + `aria-labelledby` is an equally valid alternative
when a fieldset is inconvenient to style.

This is about grouping, not about control type. Radios almost always arrive as a
group. Checkboxes go either way: several checkboxes under one prompt are a group; a
standalone checkbox that asks its own question — a consent box, a toggle — is just a
labelled control and needs no fieldset.

**Errors are wired with three attributes.** `aria-invalid="true"` on the control,
`aria-describedby` pointing at the message's `id`, and that `id` on the message
element. Form-level errors go through the `error` prop rather than hand-written
markup; the component renders them with `role="alert"`.

**Echo submitted values back** (`value={…}`, `selected`, `checked`) so a failed submit
doesn't wipe what someone typed.

**Submit with `<Button type="submit">`.** The component flags the form with
`data-submitting` on submit and blocks a second one; the styling for that state
targets `.btn`.

## Base markup shapes

Class names are the contract between markup and `form.css`. Keep them even if the
styling changes underneath.

### Text input

```astro
<div class="input-group">
   <label class="input-label" for="contact-name">Full name</label>
   <input
      class="input"
      type="text"
      id="contact-name"
      name="name"
      placeholder="Jane Smith"
   />
</div>
```

### Textarea

```astro
<div class="input-group cc-textarea">
   <label class="input-label" for="contact-message">Message</label>
   <textarea
      class="input"
      id="contact-message"
      name="message"
      placeholder="Your message..."></textarea>
</div>
```

### Select

```astro
<div class="input-group cc-select">
   <label class="input-label" for="contact-budget">Budget</label>
   <select class="input" id="contact-budget" name="budget">
      <option value="" selected>Select a range…</option>
      <option value="sm">Under $5,000</option>
   </select>
   <span class="select-icon">
      <ChevronDown stroke={1.5} />
   </span>
</div>
```

The icon element carries its own sizing from `.select-icon`, so the icon component
takes no `width`/`height`. The placeholder option needs `value=""` — the placeholder
styling keys off it.

### Grouped controls

```astro
<fieldset class="input-group cc-choice">
   <legend class="choice-label">Please select inquiry type</legend>
   <div class="choice-list">
      <label class="choice-item">
         <input class="choice-input" type="radio" name="inquiry" value="general" checked />
         <span>General</span>
      </label>
   </div>
</fieldset>
```

### A single labelled control

```astro
<div class="input-group cc-choice">
   <label class="choice-item">
      <input class="choice-input" type="checkbox" name="newsletter" />
      <span>Subscribe to product updates and news</span>
   </label>
</div>
```

### Field error

```astro
<div class="input-group">
   <label class="input-label" for="contact-email">Email address</label>
   <input
      class="input"
      type="email"
      id="contact-email"
      name="email"
      value={submitted.email}
      aria-invalid="true"
      aria-describedby="contact-email-error"
   />
</div>
<span class="field-error" id="contact-email-error">Enter a valid email address.</span>
```

## Quirks of the current base styling

These follow from how `form.css` happens to lay fields out today. They explain
otherwise baffling symptoms — but if the styling has been reworked, check `form.css`
before treating any of them as law.

**`.input` is `position: absolute; inset: 0`**, filling its `.input-group`. So the
group holds only the label, the control, and (for selects) the icon. Put a field
error *inside* the group and the input covers it: the text is in the DOM, and
invisible. That is why the error template above places the message **after** the
group, not within it.

**`.input-group:has(+ .field-error)` collapses the group's bottom margin** so the
message tucks under its field. It only fires on an immediate next sibling.

**Group height comes from the label plus the group's bottom padding.** `cc-textarea`
opts out of that scheme — it returns the control to normal flow so the textarea can
grow, which is the whole reason the variant exists.

**`.select-icon` is `pointer-events: none` with `z-index: 1`**, so it paints over the
absolutely positioned select without swallowing clicks. Don't fix a mispositioned
chevron by dropping either.

## Adding new form CSS

New classes go in `src/styles/form.css`, prefixed with `.form`, inside
`@layer component`. Variants use the project's `cc-` prefix (`cc-textarea`,
`cc-select`, `cc-choice`). Flat descendant selectors, matching `prose.css` — not
nesting.

## Before finishing

- [ ] Every field is inside a `<Form>`
- [ ] Every control has a label or wrapping label
- [ ] Controls sharing one prompt are grouped with `<fieldset>` + `<legend>` first
- [ ] A standalone control is not wrapped in a pointless fieldset
- [ ] Field errors carry `aria-invalid` + `aria-describedby` matching the message `id`
- [ ] Form-level error passed as the `error` prop, not written as markup
- [ ] Submitted values echoed back so a failed submit doesn't clear the form
- [ ] Layout claims checked against `form.css` if the styling has changed
- [ ] `npx astro check` passes
