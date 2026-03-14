# CLAUDE.md — FerizyGo Design System Rules

This document defines how to work with the FerizyGo codebase when integrating
Figma designs via the Model Context Protocol. Read this before making any
layout, styling, or component changes.

---

## 1. Project Overview

**Type:** Vanilla HTML/CSS/JS — no framework, no bundler, no npm.

**Pages:**
| File | Script | Purpose |
|---|---|---|
| `index.html` | `script.js` | Registration form |
| `login.html` | `login.js` | Login form |
| `styles.css` | — | Shared design system (all pages) |

**Dev server:** `python3 -m http.server 8765` from the project root.
Verify with `curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/index.html`.

---

## 2. Design Tokens

All tokens are CSS custom properties defined in `:root` inside `styles.css` (lines 11–28).
There is no token transformation pipeline — values are used directly.

```css
/* styles.css — :root */
--ocean-dark:   #0a3d62;   /* Primary brand, headings, hover states */
--ocean-mid:    #0c5588;   /* Button gradient start */
--ocean-light:  #1a7abf;   /* Button gradient end, links, focus rings */
--accent:       #f0a500;   /* Reserved for future CTAs (not yet in use) */
--accent-hover: #d4920a;   /* Hover state for accent */
--text-primary: #1a202c;   /* Body text, labels */
--text-muted:   #718096;   /* Subtitles, placeholders, helper text */
--border:       #e2e8f0;   /* Input borders, dividers */
--error:        #e53e3e;   /* Validation errors, invalid state border */
--success:      #38a169;   /* Valid state border, success icon */
--bg-input:     #f7fafc;   /* Input/checkbox resting background */
--radius:       12px;      /* Card border-radius */
--radius-sm:    8px;       /* Input, button border-radius */
--shadow:       0 4px 24px rgba(0,0,0,0.08);
--shadow-lg:    0 8px 40px rgba(0,0,0,0.14);  /* Form card elevation */
--transition:   0.2s ease; /* All interactive transitions */
```

**Rule:** Never hard-code hex values that map to a token. Always use the CSS variable.
The one exception is the brand panel gradient, which references tokens inline:
```css
background: linear-gradient(142deg, var(--ocean-dark) 8.5%, var(--ocean-light) 91.5%);
```

---

## 3. Typography

**Font stack:** `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`

Inter is loaded from Google Fonts in every HTML `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
```

**Available weights loaded:** 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold).
Do not reference weights outside this set.

**Type scale (from styles.css):**
| Use | Size | Weight | Token/Value |
|---|---|---|---|
| Card heading `h2` | `1.75rem` (28px) | 800 | `--ocean-dark` |
| Brand tagline `h1` | `2.4rem` (38.4px) | 800 | white |
| Brand name | `1.6rem` (25.6px) | 700 | white |
| Brand description | `1rem` (16px) | 400 | `rgba(255,255,255,0.75)` |
| Feature item text | `0.95rem` | 500 | `rgba(255,255,255,0.9)` |
| Field label | `0.85rem` | 600 | `--text-primary` |
| Input text | `0.95rem` | 400 | `--text-primary` |
| Input placeholder | `0.95rem` | 400 | `#a0aec0` |
| Error message | `0.78rem` | 500 | `--error` |
| Form subtitle | `0.9rem` | 400 | `--text-muted` |
| Form footer | `0.875rem` | 400 | `--text-muted` |
| Link / forgot-link | inherit | 600 | `--ocean-light` |
| Success heading `h3` | `1.5rem` | 800 | `--ocean-dark` |
| Password strength label | `0.75rem` | 600 | dynamic (JS-set color) |

---

## 4. Layout System

### Two-Column Page Layout

Every page uses the same full-height split layout:

```
.page-wrapper          flex row, min-height: 100vh
├── .brand-panel       flex: 0 0 420px  (fixed width left column)
└── .form-panel        flex: 1          (fluid right column)
    └── .form-card     max-width: 900px, min-height: 800px
        ├── .form-inner       width: 400px, centered
        │   ├── .form-header
        │   ├── <form>
        │   └── .form-footer
        └── .success-overlay  position: absolute, inset: 0
```

### Key Measurements

| Element | Value |
|---|---|
| Brand panel fixed width | `420px` |
| Form card max-width | `900px` |
| Form card min-height | `800px` |
| Form card top padding | `56px` |
| Form card bottom padding | `40px` |
| Form inner width | `400px` |
| Gap between form sections | `28px` (`.form-inner` and `<form>`) |
| Gap inside `.field-group` | `6px` (label → input → error) |
| Brand panel left padding | `48px` |
| Brand features gap | `0.9rem` |
| Feature icon size | `36px × 36px` |

### Centering Pattern

The form card uses `display: flex; align-items: flex-start; justify-content: center`
with a fixed-width `.form-inner` child. Do not use absolute positioning to center the form.

---

## 5. Component Classes

All components are plain CSS classes in `styles.css`. There is no component library or framework.

### Field Group (reusable input pattern)

```html
<div class="field-group">
  <label for="fieldId">Label Text</label>
  <div class="input-wrapper">
    <span class="input-icon"><!-- 18×18 SVG --></span>
    <input type="text" id="fieldId" placeholder="..." />
    <!-- optional: toggle-password button for password fields -->
  </div>
  <span class="error-msg" id="fieldIdError"></span>
</div>
```

**Variant — label with inline link (e.g. "Forgot password?"):**
```html
<div class="field-group">
  <div class="field-label-row">
    <label for="fieldId">Label</label>
    <a href="#" class="forgot-link">Forgot password?</a>
  </div>
  <div class="input-wrapper">...</div>
  <span class="error-msg" id="fieldIdError"></span>
</div>
```

### Input States (JS-toggled)
```
.is-valid    → border: --success, background: white
.is-invalid  → border: --error, background: #fff5f5
:focus       → border: --ocean-light, box-shadow: 0 0 0 3px rgba(26,122,191,0.12)
```

### Checkbox (custom styled)

```html
<div class="field-group checkbox-group">
  <label class="checkbox-label">
    <input type="checkbox" id="fieldId" name="fieldId" />
    <span class="checkmark"></span>
    <span>Label text with optional <a href="#" class="link">link</a></span>
  </label>
  <span class="error-msg" id="fieldIdError"></span>
</div>
```

The native checkbox is visually hidden (`opacity: 0; width: 0; height: 0`).
The `.checkmark` span renders the custom 18×18 checkbox.
When checked: background and border both set to `--ocean-light`.

### Primary Button

```html
<button type="submit" class="btn-register" id="btnId">
  <span class="btn-text">Button Label</span>
  <span class="btn-loader" hidden>
    <!-- spinning SVG loader -->
  </span>
</button>
```

- Width: `100%`, Height: `45px`
- Gradient: `linear-gradient(173.55deg, var(--ocean-mid) 0%, var(--ocean-light) 100%)`
- Shadow: `0 4px 14px rgba(12,85,136,0.35)`
- Loading state: hide `.btn-text`, show `.btn-loader`, set `disabled`

**The class is named `.btn-register` but is used for all primary actions** (login, register, dashboard CTA). Do not create a new button class — reuse `.btn-register`.

### Links

```html
<a href="..." class="link">Link text</a>       <!-- standard: --ocean-light, semibold -->
<a href="#" class="forgot-link">Forgot?</a>    <!-- smaller: 0.8rem, same color -->
```

### Success Overlay

```html
<div class="success-overlay" id="successOverlay" hidden>
  <div class="success-content">
    <div class="success-icon"><!-- 40×40 SVG --></div>
    <h3>Title</h3>
    <p>Body text</p>
    <button class="btn-register">CTA</button>
  </div>
</div>
```

- Positioned `absolute; inset: 0` inside `.form-card`
- Only becomes `display: flex` via `.success-overlay:not([hidden])` — never set display directly
- The `[hidden]` attribute is the sole toggle; JS sets `successOverlay.hidden = false/true`
- Animates in via `@keyframes fadeIn` (opacity + scale)

---

## 6. Icons

**System:** Inline SVG only. No icon font, no sprite sheet, no external icon library.

**Spec:** All field icons are `18×18`, `viewBox="0 0 24 24"`, `stroke="currentColor"`,
`stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"`.

**Placement:** Icons sit inside `.input-icon` (absolute left: 12px) within `.input-wrapper`.
The icon inherits `color: var(--text-muted)` at rest, transitions to `--ocean-light` on focus
via `.input-wrapper:focus-within .input-icon`.

**Password toggle:** Uses `.eye-icon` class on the SVG. JS swaps its `innerHTML`
between "eye open" and "eye-slash" paths on click. The button gets class `.active`
when password is visible.

**Current field icons in use:**
| Field | Icon path description |
|---|---|
| Full Name | Person silhouette (path + circle) |
| Email | Envelope rect + diagonal path |
| Phone | Phone handset path |
| Password | Lock body (rect) + shackle (path) |
| Confirm Password | Shield path |

**Brand logo:** Inline SVG `48×48`, ferry/boat silhouette in white, inside `.brand-logo`.
No external image — do not replace with an `<img>` tag.

---

## 7. Animations

All animations are defined in `styles.css`:

| Name | Trigger | Effect |
|---|---|---|
| `pageEnter` | `.form-card` on load | `opacity: 0 + translateY(6px)` → normal, `0.35s ease` |
| `fadeIn` | `.success-overlay` when shown | `opacity + scale(0.97)` → normal, `0.35s ease` |
| `spin` | `.btn-loader svg` | Full rotation, `0.8s linear infinite` |
| Input focus ring | `:focus` on inputs | `box-shadow: 0 0 0 3px rgba(26,122,191,0.12)` |
| Button hover | `.btn-register:hover` | `translateY(-1px)` + deeper shadow |

---

## 8. Responsive Breakpoints

Three breakpoints, all in `styles.css` at the bottom:

| Breakpoint | Behaviour |
|---|---|
| `≤ 1100px` | Form card drops padding to `48px 40px`; `.form-inner` becomes `width: 100%; max-width: 480px` |
| `≤ 860px` | Page stacks vertically (`.page-wrapper` → `flex-direction: column`); brand panel becomes auto-height; features wrap to row |
| `≤ 480px` | Brand description and features hidden; card/header font sizes reduce |

---

## 9. JavaScript Patterns

Each page has its own isolated JS file. **Do not share state across files.**

### Validation Pattern

```js
const validators = {
  fieldName(val) {
    if (!val.trim()) return 'Field is required.';
    // additional checks...
    return ''; // empty string = valid
  }
};

function validateField(name) {
  const field = fields[name];
  const value = name === 'terms' ? field.checked : field.value;
  const msg   = validators[name](value);

  if (name !== 'terms') {
    field.classList.toggle('is-invalid', !!msg);
    field.classList.toggle('is-valid',   !msg && value !== '');
  }
  errors[name].textContent = msg;
  return !msg;
}
```

- Validation fires on `blur` for text inputs, `change` for checkboxes
- All fields validated together on submit; abort if any fail
- **Do not modify validators in `script.js`** — they encode business rules

### Submit + Loader Pattern

```js
btn.disabled = true;
btn.querySelector('.btn-text').hidden   = true;
btn.querySelector('.btn-loader').hidden = false;

await delay(1400); // simulated async

successOverlay.hidden = false;
```

### Validator Strictness by Page

| Rule | `script.js` (register) | `login.js` (login) |
|---|---|---|
| Password min length | 8 chars | 6 chars |
| Uppercase required | Yes | No |
| Number required | Yes | No |
| Password strength bar | Yes | No |
| Confirm password | Yes | No |
| Terms checkbox | Yes | No |

---

## 10. Figma ↔ Code Mapping

When reading a Figma frame for this project:

| Figma property | CSS equivalent |
|---|---|
| `fill: #0a3d62` | `var(--ocean-dark)` |
| `fill: #0c5588` | `var(--ocean-mid)` |
| `fill: #1a7abf` | `var(--ocean-light)` |
| `fill: #718096` | `var(--text-muted)` |
| `fill: #1a202c` | `var(--text-primary)` |
| `fill: #e2e8f0` | `var(--border)` |
| `fill: #f7fafc` | `var(--bg-input)` |
| `border-radius: 12` | `var(--radius)` |
| `border-radius: 8` | `var(--radius-sm)` |
| `font-weight: 800` | extrabold — headings and CTAs only |
| `font-weight: 600` | semibold — labels, links |
| `gap: 24` in Figma form | `28px` in code (intentional revision) |
| `left: 250px` in 900px card | `.form-inner { width: 400px }` centered in card |
| Button `173.55deg` gradient | `linear-gradient(173.55deg, var(--ocean-mid) 0%, var(--ocean-light) 100%)` |
| Wave SVG at bottom of brand panel | `.wave-bottom` absolute, `fill="white"` |

### Figma File Reference

- **File key:** `eYNN07pHZgSdVcBbsph96O`
- **File name:** ASDP-Exploration
- **Captured frames:**
  - `node-id=4:2` — Register page (original capture)
  - `node-id=10:2` — Register — FerizyGo v2 (latest implementation capture)

### Capture Workflow (HTML → Figma)

1. Start server: `python3 -m http.server 8765`
2. Add capture script to `<head>`: `<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>`
3. Call `mcp__figma__generate_figma_design` with `outputMode: "existingFile"` and `fileKey: "eYNN07pHZgSdVcBbsph96O"`
4. Open the hash URL in the browser
5. Poll with `captureId` every 5s until `completed`
6. Remove the capture script from HTML after completion

### Design → Code Workflow

1. Call `mcp__figma__get_design_context` with the node ID and file key
2. The tool returns React+Tailwind reference code — **convert it to vanilla HTML + CSS variables**
3. Map all Tailwind color values to the token table above
4. Never install Tailwind or any CSS framework
5. Never use inline `style=""` attributes — all styles go in `styles.css`

---

## 11. Rules Summary

- **No frameworks.** Vanilla HTML, CSS, JS only.
- **No bundler.** Files are served statically; no imports/exports (except `'use strict'`).
- **No external CSS libraries.** All styles live in `styles.css`.
- **One CSS file for all pages.** Add new classes to `styles.css`; never add `<style>` blocks to HTML.
- **Always use CSS tokens.** Never hard-code a color that has a `--variable` equivalent.
- **Inter font only.** Do not add other font families.
- **Inline SVG for icons.** No `<img>` for icons; no icon libraries.
- **`[hidden]` for overlay visibility.** Never toggle `display` directly on `.success-overlay`.
- **Do not modify `script.js` validators.** They encode registration business rules.
- **`.btn-register` is the universal primary button class.** Do not rename or duplicate it.
- **New pages follow the `index.html` + `login.html` pattern:** same `<head>` boilerplate, same two-column layout, page-specific JS file.
