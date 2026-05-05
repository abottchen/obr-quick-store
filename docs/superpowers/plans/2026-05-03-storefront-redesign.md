# Storefront Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current purple-accented storefront UI with a stone-palette, fantasy-themed redesign that pulls every interaction decision from `mockup.html` (kept at the repo root as the design reference).

**Architecture:** No structural change to data flow — config and per-player carts remain in OBR room metadata, the catalog still loads via HTTP, and `cart.ts` / `metadata.ts` keep their existing public interfaces. The work is concentrated in three CSS-in-JS modules, the storefront UI module, and two HTML entry points (Google Fonts links). One small constants update aligns rarity/currency colors with the mockup.

**Tech Stack:** TypeScript + Vite + `@owlbear-rodeo/sdk`. CSS-in-JS strings injected into `<style>` tags at runtime. No CSS preprocessor, no test framework. Visual verification is manual (run `npm run dev`, sideload as an OBR extension, exercise as GM and player).

**Reference:** All CSS, animation keyframes, markup structure, and JS interaction logic in this plan is taken directly from `mockup.html` at the repo root. When in doubt, the mockup is the source of truth.

**Multi-user note:** The mockup uses a local `cart = {}` object and does targeted DOM updates without re-render. The real extension is metadata-driven — every cart change broadcasts via OBR room metadata, and the storefront re-renders from `onStoreDataChange`. Tasks 14–17 reconcile this: animations are triggered locally (immediate, optimistic) before the metadata round-trip, and a per-render diff against the previous cart drives slide-in / pulse classes on the next render.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Modify | Add Google Fonts `<link>` (Cinzel, Cormorant Garamond, Nunito Sans) |
| `store.html` | Modify | Add same Google Fonts `<link>` |
| `src/constants.ts` | Modify | Update `RARITY_COLORS` / `CURRENCY_COLORS` to mockup palette |
| `src/styles.ts` | Replace | New base palette (CSS variables), typography, body noise overlay, scrollbars, button/input resets |
| `src/styles-store.ts` | Replace | Storefront styles + all keyframe animations + coin icons + drawer + popup |
| `src/styles-config.ts` | Modify | Re-skin GM config panel to stone palette (smaller change) |
| `src/ui-store.ts` | Heavy modify | Restructure markup (toolbar, scroll-wrapper, drawer), add coin renderer, fly-particle, drawer logic, cart-diff animation tracking, redesigned description popup with interactive controls |
| `src/ui-config.ts` | Light modify | Switch heading color references from purple to stone (no structural change) |

Files **not** touched: `cart.ts`, `metadata.ts`, `catalog.ts`, `types.ts`, `main.ts`, `store.ts`, `names.ts`, `constants.ts` (only the two color maps). Public APIs unchanged.

---

## Task 1: Load Google Fonts

**Files:**
- Modify: `index.html`
- Modify: `store.html`

- [ ] **Step 1: Add fonts link to `index.html`**

Replace the `<head>` block with:

```html
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quick Store</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
```

- [ ] **Step 2: Add the same block to `store.html`**

Same three `<link>` lines, same place.

- [ ] **Step 3: Run dev server, confirm fonts load**

Run: `npm run dev`
Open the dev URL in a browser. Open DevTools → Network → filter "font". Refresh. Expect three font files (Cinzel, Cormorant Garamond, Nunito Sans) loaded with status 200.

- [ ] **Step 4: Commit**

```bash
git add index.html store.html
git commit -m "feat(ui): load Cinzel, Cormorant Garamond, Nunito Sans fonts"
```

---

## Task 2: Update rarity and currency color constants

**Files:**
- Modify: `src/constants.ts:8-21`

- [ ] **Step 1: Replace the two color maps**

In `src/constants.ts`, replace the existing `RARITY_COLORS` and `CURRENCY_COLORS` blocks with:

```ts
export const RARITY_COLORS: Record<string, string> = {
  common: "#7a7a7a",
  uncommon: "#4db87a",
  rare: "#4a9edb",
  "very rare": "#a87bdb",
  legendary: "#e8943a",
};

export const CURRENCY_COLORS: Record<string, string> = {
  gp: "#e8c84a",
  sp: "#b8b8b8",
  cp: "#c47d3a",
  pp: "#c8c8d4",
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/constants.ts
git commit -m "feat(ui): align rarity and currency colors with stone palette"
```

---

## Task 3: Replace base styles with stone palette and typography

**Files:**
- Replace: `src/styles.ts`

- [ ] **Step 1: Replace the entire file**

Overwrite `src/styles.ts` with:

```ts
export const BASE_STYLES = `
  :root {
    --bg-deepest: #1a1719;
    --bg-surface: #22201f;
    --bg-raised: #2c2926;
    --bg-elevated: #37332f;
    --bg-hover: #3f3a35;

    --stone-warm: #c4a882;
    --stone-light: #ddd0be;
    --stone-mid: #8a7e6f;

    --verdigris: #6faa8d;
    --verdigris-bright: #83c4a4;
    --verdigris-dim: #4a7d65;

    --terracotta: #c47a5a;
    --terracotta-dim: #9e5e42;

    --text-primary: #dcd5cb;
    --text-secondary: #9e9588;
    --text-dim: #665e54;

    --border: #3d3731;
    --border-light: #524a42;
    --border-warm: #5c4f3e;

    --danger: #c45c4f;
    --success: #6faa8d;

    --rarity-common: #7a7a7a;
    --rarity-uncommon: #4db87a;
    --rarity-rare: #4a9edb;
    --rarity-very-rare: #a87bdb;
    --rarity-legendary: #e8943a;

    --currency-gp: #e8c84a;
    --currency-sp: #b8b8b8;
    --currency-cp: #c47d3a;
    --currency-pp: #c8c8d4;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: #0f0e0d;
    color: var(--text-primary);
    font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    overflow: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    z-index: 9999;
  }

  h1, h2, h3 {
    font-family: 'Cinzel', serif;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
  }
  #app::-webkit-scrollbar { width: 6px; }
  #app::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  button {
    cursor: pointer;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Nunito Sans', sans-serif;
    transition: background 0.15s ease, opacity 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  button:hover { opacity: 0.9; }
  button:active { opacity: 0.75; }
  button:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-primary {
    background: var(--verdigris-dim);
    color: var(--text-primary);
    border: 1px solid var(--verdigris);
  }
  .btn-primary:hover {
    background: var(--verdigris);
    box-shadow: 0 0 8px rgba(111, 170, 141, 0.3);
  }
  .btn-secondary {
    background: var(--bg-raised);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  .btn-secondary:hover {
    background: var(--bg-elevated);
    border-color: var(--border-light);
    color: var(--text-primary);
  }
  .btn-danger {
    background: transparent;
    color: var(--danger);
    border: 1px solid var(--danger);
  }
  .btn-danger:hover {
    background: rgba(196, 92, 79, 0.12);
  }
  .btn-small {
    padding: 4px 10px;
    font-size: 12px;
  }

  input[type="text"],
  input[type="number"] {
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-primary);
    padding: 7px 10px;
    font-size: 13px;
    font-family: 'Nunito Sans', sans-serif;
    width: 100%;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  input[type="text"]:focus,
  input[type="number"]:focus {
    outline: none;
    border-color: var(--verdigris-dim);
    box-shadow: 0 0 0 3px rgba(111, 170, 141, 0.08);
  }
  input::placeholder { color: var(--text-dim); }

  label {
    font-size: 12px;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 4px;
  }

  .section { margin-bottom: 12px; }
  .section-title {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--stone-warm);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .input-row { display: flex; gap: 6px; align-items: center; }
  .input-row input { flex: 1; }

  .scrollable {
    overflow-y: auto;
    flex: 1;
  }
  .scrollable::-webkit-scrollbar { width: 7px; }
  .scrollable::-webkit-scrollbar-track { background: transparent; }
  .scrollable::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .scrollable::-webkit-scrollbar-thumb:hover { background: var(--border-light); }
`;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Visual smoke test**

Run `npm run dev`, open the dev URL. The blank app shell should now have a near-black background with a faint noise texture, and the body font should look like Nunito Sans. Nothing else needs to look right yet.

- [ ] **Step 4: Commit**

```bash
git add src/styles.ts
git commit -m "feat(ui): introduce stone-palette base styles and typography"
```

---

## Task 4: Re-skin the GM config panel

**Files:**
- Replace: `src/styles-config.ts`
- Light modify: `src/ui-config.ts`

- [ ] **Step 1: Replace `src/styles-config.ts` with:**

```ts
export const CONFIG_STYLES = `
  .config-header {
    margin: 12px 12px 16px;
  }
  .config-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .config-header h1 {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    color: var(--stone-light);
    margin-bottom: 2px;
  }
  .config-header p {
    font-size: 11px;
    color: var(--text-secondary);
    font-style: italic;
  }
  .config-header-actions {
    display: flex;
    gap: 4px;
  }
  .config-header-actions .btn-icon {
    background: transparent;
    color: var(--text-secondary);
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    line-height: 1;
    cursor: pointer;
    border: none;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .config-header-actions .btn-icon:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
  }
  .config-header-actions .btn-icon-primary { color: var(--verdigris-bright); }
  .config-header-actions .btn-icon-primary:hover {
    background: rgba(131, 196, 164, 0.12);
    color: var(--verdigris-bright);
  }
  .config-header-actions .btn-icon-danger { color: var(--danger); }
  .config-header-actions .btn-icon-danger:hover {
    background: rgba(196, 92, 79, 0.12);
    color: var(--danger);
  }

  .section { margin: 0 12px 12px; }

  .groupings-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .grouping-checkbox {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    cursor: pointer;
    color: var(--text-primary);
  }
  .grouping-checkbox input[type="checkbox"] {
    accent-color: var(--verdigris);
  }
  .no-catalog {
    color: var(--text-secondary);
    font-size: 12px;
    font-style: italic;
  }

  .store-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    margin: 0 12px 12px;
    border: 1px solid var(--border);
  }
  .store-status.open {
    background: rgba(111, 170, 141, 0.12);
    color: var(--verdigris-bright);
    border-color: rgba(111, 170, 141, 0.35);
  }
  .store-status.closed {
    background: var(--bg-raised);
    color: var(--text-secondary);
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .store-status.open .status-dot { background: var(--verdigris-bright); }
  .store-status.closed .status-dot { background: var(--text-dim); }

  .player-only-msg {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
  }
  .player-only-msg h2 {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    color: var(--stone-light);
    margin-bottom: 8px;
  }
`;
```

- [ ] **Step 2: `ui-config.ts` — no logic change is needed**

The existing JSX uses class names like `.section-title` and `.btn-secondary` which are already restyled by the base styles. Inline `style="color: #888"` on the "items loaded" caption (`src/ui-config.ts:65`) and inline `style="color: #888; font-size: 12px"` on the price `%` (`src/ui-config.ts:88`) currently pick a hard-coded grey that no longer matches the palette. Replace both `#888` occurrences with `var(--text-secondary)`:

In `src/ui-config.ts:65`, change:

```html
<div style="font-size: 11px; color: #888; margin-top: 4px;">${data.catalog.length} items loaded</div>
```

to:

```html
<div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${data.catalog.length} items loaded</div>
```

In `src/ui-config.ts:88`, change:

```html
<span style="color: #888; font-size: 12px; flex-shrink: 0">%</span>
```

to:

```html
<span style="color: var(--text-secondary); font-size: 12px; flex-shrink: 0">%</span>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Visual smoke test**

Run `npm run dev`, open as GM. The config panel should now show the stone palette: warm-stone heading, beige labels, verdigris play button, terracotta-toned stop button. No purple anywhere.

- [ ] **Step 5: Commit**

```bash
git add src/styles-config.ts src/ui-config.ts
git commit -m "feat(ui): re-skin GM config panel to stone palette"
```

---

## Task 5: Replace storefront styles (animations, layout, components)

**Files:**
- Replace: `src/styles-store.ts`

This is the largest single change. The new file embeds every keyframe and component from the mockup. Copy verbatim — the mockup is the source of truth.

- [ ] **Step 1: Replace `src/styles-store.ts` with:**

```ts
export const STORE_STYLES = `
  /* ===== Keyframes ===== */
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9) translateY(6px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes cartSlideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes flyToCart {
    0% { opacity: 1; transform: translate(0, 0) scale(1); }
    50% { opacity: 0.8; transform: translate(var(--fly-x, 0), var(--fly-y, -30px)) scale(0.6); }
    100% { opacity: 0; transform: translate(var(--fly-x, 0), var(--fly-y, 60px)) scale(0.3); }
  }
  @keyframes qtyPulse {
    0% { transform: scale(1); }
    40% { transform: scale(1.5); color: #a8f0ca; text-shadow: 0 0 8px rgba(131, 196, 164, 0.6); }
    100% { transform: scale(1); }
  }
  @keyframes qtyDecrease {
    0% { transform: scale(1); }
    40% { transform: scale(0.65); color: #ff8a7a; text-shadow: 0 0 8px rgba(196, 92, 79, 0.6); }
    100% { transform: scale(1); }
  }
  @keyframes goldPulseUp {
    0% { transform: scale(1); filter: brightness(1); }
    40% { transform: scale(1.12); filter: brightness(1.6); text-shadow: 0 0 6px rgba(232, 200, 74, 0.5); }
    100% { transform: scale(1); filter: brightness(1); }
  }
  @keyframes goldPulseDown {
    0% { transform: scale(1); filter: brightness(1); }
    40% { transform: scale(0.9); filter: brightness(1.6); text-shadow: 0 0 6px rgba(196, 92, 79, 0.5); }
    100% { transform: scale(1); filter: brightness(1); }
  }
  @keyframes rowFlash {
    0% { box-shadow: inset 0 0 0 1px var(--verdigris), 0 0 12px rgba(111, 170, 141, 0.2); }
    100% { box-shadow: inset 0 0 0 1px var(--border), 0 0 0px transparent; }
  }
  @keyframes cartCountBounce {
    0% { transform: scale(1); background: var(--verdigris-dim); }
    50% { transform: scale(1.4); background: var(--verdigris-bright); box-shadow: 0 0 10px rgba(131, 196, 164, 0.5); }
    100% { transform: scale(1); background: var(--verdigris-dim); }
  }
  @keyframes legendaryGlow {
    0%, 100% { box-shadow: 0 0 8px rgba(232, 148, 58, 0.35), 0 0 20px rgba(232, 148, 58, 0.15), inset 0 0 0 1px rgba(232, 148, 58, 0.2); }
    50% { box-shadow: 0 0 16px rgba(232, 148, 58, 0.55), 0 0 35px rgba(232, 148, 58, 0.25), inset 0 0 0 1px rgba(232, 148, 58, 0.35); }
  }
  @keyframes veryRareGlow {
    0%, 100% { box-shadow: 0 0 6px rgba(168, 123, 219, 0.25), 0 0 15px rgba(168, 123, 219, 0.1); }
    50% { box-shadow: 0 0 12px rgba(168, 123, 219, 0.45), 0 0 25px rgba(168, 123, 219, 0.15); }
  }
  @keyframes headerGradientShift {
    0% { background-position: 0% center; opacity: 0.4; }
    50% { background-position: 100% center; opacity: 0.75; }
    100% { background-position: 0% center; opacity: 0.4; }
  }
  @keyframes coinSheen {
    0% { transform: rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    30% { opacity: 0; }
    100% { transform: rotate(0deg); opacity: 0; }
  }
  @keyframes handleNudge {
    0% { transform: translateY(0); }
    30% { transform: translateY(-3px); }
    60% { transform: translateY(1px); }
    100% { transform: translateY(0); }
  }

  /* ===== Layout ===== */
  .storefront {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-surface);
  }

  .store-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    background: linear-gradient(180deg, var(--bg-raised) 0%, var(--bg-surface) 100%);
    border-bottom: 1px solid var(--border);
    position: relative;
    flex-shrink: 0;
  }
  .store-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--stone-mid) 10%,
      var(--stone-warm) 25%,
      var(--verdigris-bright) 50%,
      var(--stone-warm) 75%,
      var(--stone-mid) 90%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: headerGradientShift 7s ease-in-out infinite;
  }
  .store-header-info h1 {
    font-size: 22px;
    color: var(--stone-light);
    margin-bottom: 2px;
  }
  .store-header-info p {
    font-size: 13px;
    color: var(--stone-mid);
    font-style: italic;
  }
  .store-header-controls { display: flex; gap: 6px; }

  .btn-icon {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 18px;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1;
  }
  .btn-icon:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
  }

  .store-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }
  .store-body.minimized { display: none; }

  /* Toolbar (search + collapse-all) */
  .toolbar {
    display: flex;
    align-items: center;
    padding: 10px 18px;
    gap: 8px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .toolbar input {
    flex: 1;
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    padding: 9px 14px;
    font-size: 13px;
    font-family: 'Nunito Sans', sans-serif;
    transition: border-color 0.2s ease, box-shadow 0.3s ease;
  }
  .toolbar input:focus {
    outline: none;
    border-color: var(--verdigris-dim);
    box-shadow: 0 0 0 3px rgba(111, 170, 141, 0.08), inset 0 1px 3px rgba(0,0,0,0.2);
  }
  .toolbar input::placeholder { color: var(--text-dim); }

  .toolbar-btn {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-secondary);
    padding: 8px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    font-family: 'Nunito Sans', sans-serif;
    line-height: 1;
  }
  .toolbar-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--border-light);
    color: var(--text-primary);
  }

  .items-list-header {
    display: flex;
    align-items: center;
    padding: 7px 18px;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border);
    font-size: 10px;
    font-weight: 700;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    flex-shrink: 0;
  }
  .items-list-header .col-icon { width: 44px; flex-shrink: 0; }
  .items-list-header .col-name { flex: 1; padding-left: 10px; }
  .items-list-header .col-price { width: 100px; text-align: right; flex-shrink: 0; padding-right: 12px; }

  /* Items scroll wrapper with fade edges */
  .items-scroll-wrapper {
    flex: 1;
    min-height: 0;
    position: relative;
  }
  .items-scroll-wrapper::before,
  .items-scroll-wrapper::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 20px;
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .items-scroll-wrapper::before {
    top: 0;
    background: linear-gradient(to bottom, var(--bg-surface), transparent);
  }
  .items-scroll-wrapper::after {
    bottom: 0;
    background: linear-gradient(to top, var(--bg-surface), transparent);
  }
  .items-scroll-wrapper.fade-top::before { opacity: 1; }
  .items-scroll-wrapper.fade-bottom::after { opacity: 1; }

  .items-scroll {
    height: 100%;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
  .items-scroll::-webkit-scrollbar { width: 7px; }
  .items-scroll::-webkit-scrollbar-track { background: transparent; }
  .items-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .items-scroll::-webkit-scrollbar-thumb:hover { background: var(--border-light); }

  /* Group headers */
  .grouping-header {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--stone-warm);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 11px 18px 9px;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .grouping-header:hover {
    background: var(--bg-elevated);
    color: var(--stone-light);
  }
  .grouping-arrow {
    font-size: 9px;
    color: var(--stone-mid);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
  }
  .grouping-arrow.expanded { transform: rotate(90deg); }
  .grouping-count {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 11px;
    color: var(--text-dim);
    font-weight: 400;
    margin-left: auto;
  }

  .grouping-items {
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
  }
  .grouping-items.collapsed {
    max-height: 0 !important;
    opacity: 0;
  }

  /* Item rows */
  .item-row {
    display: flex;
    align-items: center;
    padding: 8px 14px;
    margin: 4px 10px;
    cursor: pointer;
    user-select: none;
    position: relative;
    border-left: 3px solid transparent;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-surface);
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
  .item-row:hover {
    background: var(--bg-raised);
    border-color: var(--stone-mid);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(184, 169, 146, 0.08);
    transform: translateY(-1px);
  }
  .item-row:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    background: var(--bg-elevated);
  }
  .item-row.flash { animation: rowFlash 0.6s ease; }

  .item-image {
    width: 36px;
    height: 36px;
    border-radius: 7px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Cinzel', serif;
    color: rgba(255, 255, 255, 0.7);
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.3s ease;
  }
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .item-row:hover .item-image {
    border-color: var(--border-light);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .item-name {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    padding-left: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-price {
    text-align: right;
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px;
    font-weight: 600;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    padding-right: 4px;
    transition: filter 0.2s ease, text-shadow 0.2s ease;
  }
  .item-row:hover .item-price {
    filter: brightness(1.3);
    text-shadow: 0 0 4px currentColor;
  }

  /* Rarity treatments on item rows */
  .item-row.rarity-uncommon { border-left: 3px solid var(--rarity-uncommon); }
  .item-row.rarity-rare {
    border-left: 3px solid var(--rarity-rare);
    background: linear-gradient(90deg, rgba(74, 158, 219, 0.03) 0%, transparent 40%);
  }
  .item-row.rarity-rare:hover { border-color: var(--rarity-rare); }
  .item-row.rarity-rare .item-image {
    border-color: rgba(74, 158, 219, 0.35);
    box-shadow: 0 0 8px rgba(74, 158, 219, 0.12);
  }
  .item-row.rarity-very-rare {
    border-left: 3px solid var(--rarity-very-rare);
    background: linear-gradient(90deg, rgba(168, 123, 219, 0.03) 0%, transparent 40%);
    animation: veryRareGlow 4s ease-in-out infinite;
  }
  .item-row.rarity-very-rare .item-image {
    border-color: rgba(168, 123, 219, 0.35);
    box-shadow: 0 0 8px rgba(168, 123, 219, 0.12);
  }
  .item-row.rarity-legendary {
    border-left: 3px solid var(--rarity-legendary);
    background: linear-gradient(90deg, rgba(232, 148, 58, 0.05) 0%, transparent 50%);
    animation: legendaryGlow 3s ease-in-out infinite;
  }
  .item-row.rarity-legendary:hover {
    border-color: var(--rarity-legendary);
    box-shadow: 0 2px 12px rgba(232, 148, 58, 0.25), inset 0 0 0 1px rgba(232, 148, 58, 0.15);
  }
  .item-row.rarity-legendary .item-image {
    border-color: rgba(232, 148, 58, 0.4);
    box-shadow: 0 0 10px rgba(232, 148, 58, 0.2);
  }

  /* ===== Cart drawer (bottom-sheet flex child) ===== */
  .cart-drawer {
    flex-shrink: 0;
    background: var(--bg-raised);
    border-top: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 350px;
    position: relative;
  }
  .cart-drawer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--verdigris-dim), var(--stone-warm), var(--verdigris-dim), transparent);
    opacity: 0.35;
  }
  .cart-drawer.collapsed { max-height: 52px; }

  .cart-drawer-handle {
    padding: 14px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    transition: background 0.15s ease;
  }
  .cart-drawer-handle:hover { background: var(--bg-elevated); }
  .cart-drawer-handle.nudge { animation: handleNudge 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
  .cart-drawer-handle-left { display: flex; align-items: center; gap: 10px; }

  .cart-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--stone-warm);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .cart-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background: var(--verdigris-dim);
    color: var(--text-primary);
    font-size: 11px;
    font-weight: 700;
    padding: 0 5px;
    transition: transform 0.2s ease;
  }
  .cart-count-badge.bounce { animation: cartCountBounce 0.3s ease; }

  .cart-total-preview {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--stone-light);
  }

  .cart-drawer-arrow {
    font-size: 10px;
    color: var(--stone-mid);
    transition: transform 0.3s ease;
    margin-left: 8px;
  }
  .cart-drawer.collapsed .cart-drawer-arrow { transform: rotate(180deg); }

  .cart-drawer-content {
    overflow-y: auto;
    padding: 0 20px 12px;
    flex: 1;
    min-height: 0;
  }
  .cart-drawer-content::-webkit-scrollbar { width: 6px; }
  .cart-drawer-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .cart-empty {
    font-size: 13px;
    color: var(--text-dim);
    font-style: italic;
    padding: 4px 0;
  }

  .cart-player-group { margin-bottom: 10px; }

  .cart-player-name {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--border);
  }
  .cart-player-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cart-item {
    display: flex;
    align-items: center;
    font-size: 13px;
    padding: 5px 8px 5px 12px;
    color: var(--text-primary);
    border-radius: 6px;
    transition: background 0.15s ease;
    border-left: 3px solid transparent;
  }
  .cart-item.slide-in { animation: cartSlideIn 0.25s ease both; }
  .cart-item:hover { background: var(--bg-elevated); }
  .cart-item-rarity-pip {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: 8px;
  }
  .cart-item-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 2px;
    margin: 0 8px;
  }
  .cart-qty-btn {
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    width: 22px;
    height: 22px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1;
    padding: 0;
  }
  .cart-qty-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--border-light);
    color: var(--text-primary);
  }
  .cart-qty-btn.minus:hover {
    border-color: var(--danger);
    color: var(--danger);
  }
  .cart-qty-btn.plus:hover {
    border-color: var(--verdigris);
    color: var(--verdigris);
  }
  .cart-qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .cart-item-qty {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    min-width: 22px;
    text-align: center;
    transition: transform 0.2s ease, color 0.2s ease;
  }
  .cart-item-qty.pulse-up { animation: qtyPulse 0.3s ease; }
  .cart-item-qty.pulse-down { animation: qtyDecrease 0.3s ease; }

  .cart-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    min-width: 60px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-size: 18px;
    display: inline-block;
  }
  .cart-item-price.pulse-gold-up { animation: goldPulseUp 0.35s ease; }
  .cart-item-price.pulse-gold-down { animation: goldPulseDown 0.35s ease; }

  .cart-subtotal {
    display: flex;
    justify-content: space-between;
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 600;
    padding: 6px 0 4px 15px;
    color: var(--text-secondary);
    border-top: 1px dashed var(--border);
    margin-top: 4px;
  }
  .cart-subtotal > span:first-child {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .cart-subtotal .pulse-gold-up { animation: goldPulseUp 0.35s ease; display: inline-block; }
  .cart-subtotal .pulse-gold-down { animation: goldPulseDown 0.35s ease; display: inline-block; }

  .cart-grand-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 600;
    padding: 10px 20px;
    color: var(--stone-light);
    border-top: 1px solid var(--border-light);
    background: var(--bg-elevated);
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }
  .cart-grand-total > span:first-child {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  .cart-grand-total .pulse-gold-up { animation: goldPulseUp 0.4s ease; display: inline-block; }
  .cart-grand-total .pulse-gold-down { animation: goldPulseDown 0.4s ease; display: inline-block; }

  /* Fly particle */
  .fly-particle {
    position: fixed;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: white;
    animation: flyToCart 0.45s cubic-bezier(0.4, 0, 0.6, 1) forwards;
  }

  /* ===== Description popup ===== */
  .description-popup {
    position: fixed;
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 0;
    width: 340px;
    z-index: 1000;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(184, 169, 146, 0.1);
    animation: scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.08) both;
    overflow: hidden;
  }
  .description-popup.rarity-legendary {
    border-color: rgba(232, 148, 58, 0.4);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 20px rgba(232, 148, 58, 0.25), 0 0 40px rgba(232, 148, 58, 0.1);
    animation: scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.08) both, legendaryGlow 3s ease-in-out infinite 0.2s;
  }
  .description-popup.rarity-very-rare {
    border-color: rgba(168, 123, 219, 0.35);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 16px rgba(168, 123, 219, 0.2), 0 0 30px rgba(168, 123, 219, 0.08);
    animation: scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.08) both, veryRareGlow 4s ease-in-out infinite 0.2s;
  }
  .description-popup.rarity-rare {
    border-color: rgba(74, 158, 219, 0.3);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 12px rgba(74, 158, 219, 0.15);
  }
  .description-popup.rarity-uncommon {
    border-color: rgba(77, 184, 122, 0.3);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 10px rgba(77, 184, 122, 0.12);
  }

  .desc-header {
    display: flex;
    gap: 14px;
    padding: 16px 18px;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border);
  }
  .desc-image {
    width: 52px;
    height: 52px;
    border-radius: 8px;
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-size: 20px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .desc-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .desc-header-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    min-width: 0;
  }
  .description-popup h3 {
    font-size: 15px;
    color: var(--stone-light);
    line-height: 1.2;
  }
  .desc-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .desc-type {
    font-size: 12px;
    color: var(--text-secondary);
  }
  .desc-rarity {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    padding: 1px 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.04);
    border: 1px solid currentColor;
    opacity: 0.85;
  }
  .desc-price-line { margin-top: 2px; }

  .desc-body-text {
    font-size: 13px;
    color: var(--text-primary);
    line-height: 1.7;
    padding: 14px 18px;
  }
  .desc-body-text::first-letter {
    font-family: 'Cinzel', serif;
    font-size: 2.4em;
    font-weight: 700;
    float: left;
    line-height: 0.85;
    margin-right: 6px;
    margin-top: 2px;
    color: var(--stone-light);
  }

  .desc-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 18px;
    border-top: 1px solid var(--border);
    background: var(--bg-raised);
  }
  .desc-add-btn {
    background: var(--verdigris-dim);
    border: 1px solid var(--verdigris);
    color: var(--text-primary);
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: 'Nunito Sans', sans-serif;
  }
  .desc-add-btn:hover {
    background: var(--verdigris);
    box-shadow: 0 0 8px rgba(111, 170, 141, 0.3);
  }
  .desc-qty-controls {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .desc-qty-btn {
    background: var(--bg-deepest);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    width: 26px;
    height: 26px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1;
    padding: 0;
  }
  .desc-qty-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--border-light);
    color: var(--text-primary);
  }
  .desc-qty-btn.minus:hover { border-color: var(--danger); color: var(--danger); }
  .desc-qty-btn.plus:hover { border-color: var(--verdigris); color: var(--verdigris); }
  .desc-qty-value {
    font-size: 14px;
    font-weight: 700;
    min-width: 24px;
    text-align: center;
    color: var(--verdigris-bright);
  }
  .desc-qty-value.pulse-up { animation: qtyPulse 0.3s ease; }
  .desc-qty-value.pulse-down { animation: qtyDecrease 0.3s ease; }
  .desc-qty-label {
    font-size: 11px;
    color: var(--text-dim);
    margin-left: 4px;
  }
  .desc-remove-all {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-dim);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: auto;
    font-family: 'Nunito Sans', sans-serif;
  }
  .desc-remove-all:hover {
    border-color: var(--danger);
    color: var(--danger);
    background: rgba(196, 92, 79, 0.08);
  }

  /* ===== Coins ===== */
  .coin {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'Cormorant Garamond', serif;
    font-size: inherit;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .coin-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
    position: relative;
    box-shadow: inset 0 -2px 3px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4);
    overflow: hidden;
  }
  .coin-icon::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -6px;
    width: 8px;
    height: 20px;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
    transform: rotate(20deg);
    animation: coinSheen 4s ease-in-out infinite;
    animation-delay: var(--sheen-delay, 0s);
  }
  .coin-icon-gp { background: radial-gradient(ellipse at 35% 30%, #ffe066, #d4a520 50%, #a67c00); }
  .coin-icon-sp { background: radial-gradient(ellipse at 35% 30%, #e8e8e8, #a8a8a8 50%, #787878); }
  .coin-icon-cp { background: radial-gradient(ellipse at 35% 30%, #e09050, #b87333 50%, #8a5522); }
  .coin-icon-pp { background: radial-gradient(ellipse at 35% 30%, #e8e8f0, #c0c0d0 50%, #9090a8); }

  .currency-gp { color: var(--currency-gp); }
  .currency-sp { color: var(--currency-sp); }
  .currency-cp { color: var(--currency-cp); }
  .currency-pp { color: var(--currency-pp); }
`;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Visual smoke test (will look broken)**

Run `npm run dev`. The storefront markup is still the old shape, so most of these styles won't have anything to attach to. That's expected — Tasks 6–11 build the new markup. Confirm only that the build still serves and the GM config panel still looks right.

- [ ] **Step 4: Commit**

```bash
git add src/styles-store.ts
git commit -m "feat(ui): replace storefront styles with stone-themed mockup CSS"
```

---

## Task 6: Add coin renderer and breakdown helpers in `ui-store.ts`

The mockup wraps every numeric price in a `.coin` span with a metallic gradient circle and an animated sheen. The shop already has `getPlayerBreakdown` / `getTotalBreakdown` in `cart.ts`, but `ui-store.ts` currently renders breakdowns as plain colored text via `currencySpan`. We replace `currencySpan` with `coinHtml` and rewrite `renderBreakdown` to call it.

**Files:**
- Modify: `src/ui-store.ts:40-52`

- [ ] **Step 1: Add coin counter and replace `currencySpan` / `renderBreakdown`**

In `src/ui-store.ts`, find this block (around line 40):

```ts
function currencySpan(amount: number, currency: string): string {
  const color = CURRENCY_COLORS[currency] ?? CURRENCY_COLORS.gp;
  return `<span style="color: ${color}">${amount} ${currency}</span>`;
}

function renderBreakdown(breakdown: CurrencyBreakdown): string {
  const parts: string[] = [];
  if (breakdown.pp > 0) parts.push(currencySpan(breakdown.pp, "pp"));
  if (breakdown.gp > 0) parts.push(currencySpan(breakdown.gp, "gp"));
  if (breakdown.sp > 0) parts.push(currencySpan(breakdown.sp, "sp"));
  if (breakdown.cp > 0) parts.push(currencySpan(breakdown.cp, "cp"));
  return parts.length > 0 ? parts.join(" ") : currencySpan(0, "gp");
}
```

Replace it with:

```ts
let coinCounter = 0;

function coinHtml(amount: number, currency: string): string {
  const delay = ((coinCounter++ * 0.7) % 4).toFixed(1);
  const color = CURRENCY_COLORS[currency] ?? CURRENCY_COLORS.gp;
  return `<span class="coin"><span class="coin-icon coin-icon-${currency}" style="--sheen-delay: ${delay}s"></span><span style="color: ${color}">${amount}</span></span>`;
}

function renderBreakdown(breakdown: CurrencyBreakdown): string {
  const parts: string[] = [];
  if (breakdown.pp > 0) parts.push(coinHtml(breakdown.pp, "pp"));
  if (breakdown.gp > 0) parts.push(coinHtml(breakdown.gp, "gp"));
  if (breakdown.sp > 0) parts.push(coinHtml(breakdown.sp, "sp"));
  if (breakdown.cp > 0) parts.push(coinHtml(breakdown.cp, "cp"));
  return parts.length > 0 ? parts.join(" ") : coinHtml(0, "gp");
}
```

The counter staggers `coinSheen` so all coins on screen don't pulse in unison.

- [ ] **Step 2: Update item-row price call site**

In `renderItemRows` (around `src/ui-store.ts:181`), find:

```ts
<span class="item-price">${currencySpan(price, item.currency ?? "gp")}</span>
```

Replace with:

```ts
<span class="item-price">${coinHtml(price, item.currency ?? "gp")}</span>
```

- [ ] **Step 3: Update cart-item price call site**

In `renderCart` (around `src/ui-store.ts:220`), find:

```ts
<span class="cart-item-price">${currencySpan(entry.itemPrice * entry.quantity, entry.itemCurrency ?? "gp")}</span>
```

Replace with:

```ts
<span class="cart-item-price">${coinHtml(entry.itemPrice * entry.quantity, entry.itemCurrency ?? "gp")}</span>
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/ui-store.ts
git commit -m "feat(ui): render prices as metallic coin icons with sheen"
```

---

## Task 7: Restructure storefront markup (toolbar, scroll wrapper, drawer)

This task replaces the body of `renderStorefront` (`src/ui-store.ts:72-139`) so the markup matches the mockup. The data shape and `getActiveItems` / `groupItemsByGrouping` helpers stay as-is. The `qty` column in `items-list-header` is removed (the mockup hides per-row cart count — the cart shows that data). The cart panel becomes a bottom-sheet drawer.

**Files:**
- Modify: `src/ui-store.ts:9-14` (module-level state)
- Modify: `src/ui-store.ts:72-139` (`renderStorefront`)

- [ ] **Step 1: Add drawer state to module-level vars**

Find at the top of `src/ui-store.ts` (lines 9–14):

```ts
let isMinimized = false;
let descriptionPopup: HTMLElement | null = null;
const collapsedGroups = new Set<string>();
let groupsInitialized = false;
let searchTerm = "";
```

Add two new vars below:

```ts
let isMinimized = false;
let descriptionPopup: HTMLElement | null = null;
const collapsedGroups = new Set<string>();
let groupsInitialized = false;
let searchTerm = "";
let drawerOpen = false;
let prevCartKey = ""; // signature of last cart render — drives slide-in animation
```

- [ ] **Step 2: Replace `renderStorefront` body**

Find `renderStorefront` (line 72) and replace its entire body (the `container.innerHTML = ...` block and surrounding logic) with:

```ts
function renderStorefront(
  container: HTMLElement,
  data: StoreData,
  isGM: boolean
): void {
  let items = getActiveItems(data);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    items = items.filter((item) =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  }
  const grouped = groupItemsByGrouping(items);
  const adjustment = data.config.priceAdjustment;

  const itemsScroll = container.querySelector<HTMLElement>(".items-scroll");
  const drawerContent = container.querySelector<HTMLElement>(".cart-drawer-content");
  const prevScroll = itemsScroll?.scrollTop ?? 0;
  const prevCartScroll = drawerContent?.scrollTop ?? 0;

  const totalQty = data.cart.entries.reduce((sum, e) => sum + e.quantity, 0);
  const totalBreakdown = renderBreakdown(getTotalBreakdown(data.cart.entries));
  const drawerCollapsedClass = drawerOpen && totalQty > 0 ? "" : "collapsed";

  container.innerHTML = `
    <div class="storefront">
      <div class="store-header">
        <div class="store-header-info">
          <h1>${escape(data.config.storeName || "Shop")}</h1>
          <p>${escape(data.config.npcName || "Shopkeeper")}</p>
        </div>
        <div class="store-header-controls">
          <button class="btn-icon" id="minimize-btn" title="${isMinimized ? "Maximize" : "Minimize"}">
            ${isMinimized ? "&#x25A1;" : "&#x2012;"}
          </button>
          <button class="btn-icon" id="close-store-btn" title="Close">&#x2715;</button>
        </div>
      </div>
      <div class="store-body ${isMinimized ? "minimized" : ""}">
        <div class="toolbar">
          <input type="text" id="search-input" placeholder="Search items..." value="${escapeAttr(searchTerm)}" />
          <button class="toolbar-btn" id="collapse-all-btn" title="Collapse / expand all groups">${allCollapsed(grouped) ? "&#x25BC; All" : "&#x25B6; All"}</button>
        </div>
        <div class="items-list-header">
          <span class="col-icon"></span>
          <span class="col-name">Name</span>
          <span class="col-price">Price</span>
        </div>
        <div class="items-scroll-wrapper" id="items-scroll-wrapper">
          <div class="items-scroll">
            ${renderItemRows(grouped, adjustment, data.cart.entries)}
          </div>
        </div>
        <div class="cart-drawer ${drawerCollapsedClass}" id="cart-drawer">
          <div class="cart-drawer-handle" id="cart-handle">
            <div class="cart-drawer-handle-left">
              <span class="cart-title">Cart</span>
              <span class="cart-count-badge" id="cart-count">${totalQty}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span class="cart-total-preview">${totalQty > 0 ? totalBreakdown : "&mdash;"}</span>
              <span class="cart-drawer-arrow">&#x25BC;</span>
            </div>
          </div>
          <div class="cart-drawer-content">
            ${renderCartContent(data.cart.entries)}
          </div>
          ${totalQty > 0 ? `<div class="cart-grand-total"><span>Total</span><span id="grand-total-value">${totalBreakdown}</span></div>` : ""}
        </div>
      </div>
    </div>
  `;

  const newItemsScroll = container.querySelector<HTMLElement>(".items-scroll");
  const newDrawerContent = container.querySelector<HTMLElement>(".cart-drawer-content");
  if (newItemsScroll) newItemsScroll.scrollTop = prevScroll;
  if (newDrawerContent) newDrawerContent.scrollTop = prevCartScroll;

  if (searchTerm) {
    const searchInput = container.querySelector<HTMLInputElement>("#search-input");
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(searchTerm.length, searchTerm.length);
    }
  }

  bindStorefrontEvents(container, data, isGM);
  initScrollFades(container);
}

function allCollapsed(grouped: Map<string, StoreItem[]>): boolean {
  if (grouped.size === 0) return false;
  for (const key of grouped.keys()) {
    if (!collapsedGroups.has(key)) return false;
  }
  return true;
}
```

Note that the GM-only "close store" header button has been removed from the storefront — that control belongs in the config panel. The X here just closes the popover for the local viewer. `isGM` is still passed through to `bindStorefrontEvents` for cart-remove permission checks.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: errors about `renderCartContent` and `initScrollFades` not yet existing, and `renderItemRows` signature mismatch (qty column removed). Tasks 8–10 add these.

- [ ] **Step 4: Do not commit yet** — the file does not compile. Continue to Task 8.

---

## Task 8: Rewrite `renderItemRows` for new card-style rows

**Files:**
- Modify: `src/ui-store.ts:141-189`

- [ ] **Step 1: Replace `renderItemRows`**

Replace the existing `renderItemRows` function (line 141) with:

```ts
function renderItemRows(
  grouped: Map<string, StoreItem[]>,
  adjustment: number,
  _cartEntries: CartEntry[]
): string {
  if (grouped.size === 0) {
    return `<p style="text-align: center; color: var(--text-dim); font-style: italic; padding: 20px;">No items available.</p>`;
  }

  if (!groupsInitialized) {
    for (const grouping of grouped.keys()) {
      collapsedGroups.add(grouping);
    }
    groupsInitialized = true;
  }

  let html = "";
  for (const [grouping, items] of grouped) {
    const isCollapsed = searchTerm ? false : collapsedGroups.has(grouping);
    const expandedClass = isCollapsed ? "" : "expanded";
    const maxH = isCollapsed ? "0" : `${items.length * 60 + 16}px`;

    html += `<div class="grouping-header" data-group="${escapeAttr(grouping)}">
      <span class="grouping-arrow ${expandedClass}">&#x25B6;</span>
      ${escape(grouping)}
      <span class="grouping-count">${items.length}</span>
    </div>`;
    html += `<div class="grouping-items ${isCollapsed ? "collapsed" : ""}" style="max-height: ${maxH};" data-group-items="${escapeAttr(grouping)}">`;

    for (const item of items) {
      const price = adjustPrice(item.price, adjustment);
      const rarityClass = item.rarity !== "common" ? ` rarity-${item.rarity.replace(" ", "-")}` : "";
      const rarityColor = RARITY_COLORS[item.rarity] ?? RARITY_COLORS.common;
      const letterColor = item.rarity !== "common" ? rarityColor : "rgba(255,255,255,0.6)";
      const imageContent = item.image
        ? `<img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" />`
        : item.name.charAt(0).toUpperCase();
      const imageStyle = item.rarity !== "common"
        ? `border-color: ${hexToRgba(rarityColor, 0.4)}; color: ${letterColor};`
        : `color: ${letterColor};`;

      html += `<div class="item-row${rarityClass}" data-item-name="${escapeAttr(item.name)}" data-item-price="${price}">
        <div class="item-image" style="${imageStyle}">${imageContent}</div>
        <span class="item-name">${escape(item.name)}</span>
        <span class="item-price">${coinHtml(price, item.currency ?? "gp")}</span>
      </div>`;
    }
    html += `</div>`;
  }
  return html;
}
```

The `qty` column on each row is gone — that information lives in the cart drawer.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: still failing on `renderCartContent` and `initScrollFades`. Continue.

---

## Task 9: Split `renderCart` into drawer-content renderer

The mockup separates the cart contents (player groups, line items, subtotal) from the grand total bar. We split `renderCart` into `renderCartContent`, returning only the inner HTML for `.cart-drawer-content`. The grand total is templated inline by `renderStorefront`. Cart items now have a rarity pip and `+`/`−` buttons.

**Files:**
- Modify: `src/ui-store.ts:191-243`

- [ ] **Step 1: Replace `renderCart` with `renderCartContent`**

Replace the existing `renderCart` function (line 191) with:

```ts
function renderCartContent(entries: CartEntry[]): string {
  if (entries.length === 0) {
    prevCartKey = "";
    return `<div class="cart-empty">The shopkeeper awaits your selection&hellip;</div>`;
  }

  const playerIds = [...new Set(entries.map((e) => e.playerId))];
  const cartKey = playerIds
    .map((pid) =>
      entries
        .filter((e) => e.playerId === pid)
        .map((e) => `${e.itemName}:${e.quantity}`)
        .join(",")
    )
    .join("|");

  // For each player+item pair, decide whether to apply slide-in based on whether it
  // existed in the previous cart key.
  const prevSet = new Set(prevCartKey.split(",").map((s) => s.split(":")[0]));

  let html = "";
  for (const pid of playerIds) {
    const playerEntries = entries.filter((e) => e.playerId === pid);
    const first = playerEntries[0];
    const subtotal = renderBreakdown(getPlayerBreakdown(entries, pid));

    html += `<div class="cart-player-group">`;
    html += `<div class="cart-player-name">
      <span class="cart-player-dot" style="background: ${escapeAttr(first.playerColor)}"></span>
      ${escape(first.playerName)}
    </div>`;

    for (const entry of playerEntries) {
      const item = currentCatalog.find((i) => i.name === entry.itemName);
      const rarity = item?.rarity ?? "common";
      const rarityColor = RARITY_COLORS[rarity] ?? RARITY_COLORS.common;
      const slideClass = prevSet.has(entry.itemName) ? "" : " slide-in";
      const pipShadow = rarity === "legendary" ? ` box-shadow: 0 0 4px ${rarityColor};` : "";

      html += `<div class="cart-item${slideClass}"
        data-cart-item="${escapeAttr(entry.itemName)}"
        data-cart-player="${escapeAttr(entry.playerId)}"
        style="border-left-color: ${rarityColor};">
        <span class="cart-item-rarity-pip" style="background: ${rarityColor};${pipShadow}"></span>
        <span class="cart-item-name">${escape(entry.itemName)}</span>
        <div class="cart-item-controls">
          <button class="cart-qty-btn minus" data-remove-item="${escapeAttr(entry.itemName)}" data-remove-player="${escapeAttr(entry.playerId)}">&minus;</button>
          <span class="cart-item-qty">${entry.quantity}</span>
          <button class="cart-qty-btn plus" data-add-item="${escapeAttr(entry.itemName)}" data-add-player="${escapeAttr(entry.playerId)}">+</button>
        </div>
        <span class="cart-item-price">${coinHtml(entry.itemPrice * entry.quantity, entry.itemCurrency ?? "gp")}</span>
      </div>`;
    }

    html += `<div class="cart-subtotal">
      <span>Subtotal</span>
      <span>${subtotal}</span>
    </div>`;
    html += `</div>`;
  }

  prevCartKey = cartKey;
  return html;
}
```

This needs a module-level `currentCatalog` so the cart can look up item rarity. Add this near the other module-level state at the top of the file:

```ts
let currentCatalog: StoreItem[] = [];
```

And in `renderStorefront`, after the line `let items = getActiveItems(data);`, set it:

```ts
currentCatalog = data.catalog;
```

- [ ] **Step 2: Remove the now-unused `renderCart` references**

The old `renderCart(data.cart.entries, adjustment)` call inside `renderStorefront` is gone (Task 7 already moved to inline templating). If your editor flags the `_adjustment` parameter, ignore it — `renderCart` no longer exists.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: still failing on `initScrollFades`. Continue.

---

## Task 10: Add scroll-fade edges and drawer toggle

**Files:**
- Modify: `src/ui-store.ts` — add `initScrollFades`, `openDrawer`, `closeDrawer`, `nudgeCartHandle`, `bounceCartCount`

- [ ] **Step 1: Add helper functions**

Add these helpers near the bottom of `src/ui-store.ts`, just above the existing `escape` helper:

```ts
function initScrollFades(container: HTMLElement): void {
  const wrapper = container.querySelector<HTMLElement>("#items-scroll-wrapper");
  const scrollEl = container.querySelector<HTMLElement>(".items-scroll");
  if (!wrapper || !scrollEl) return;

  const update = (): void => {
    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    wrapper.classList.toggle("fade-top", scrollTop > 10);
    wrapper.classList.toggle("fade-bottom", scrollTop < scrollHeight - clientHeight - 10);
  };

  scrollEl.addEventListener("scroll", update);
  // Initial check after layout
  setTimeout(update, 100);
}

function openDrawer(container: HTMLElement): void {
  drawerOpen = true;
  container.querySelector<HTMLElement>("#cart-drawer")?.classList.remove("collapsed");
}

function closeDrawer(container: HTMLElement): void {
  drawerOpen = false;
  container.querySelector<HTMLElement>("#cart-drawer")?.classList.add("collapsed");
}

function nudgeCartHandle(container: HTMLElement): void {
  if (drawerOpen) return;
  const handle = container.querySelector<HTMLElement>("#cart-handle");
  if (!handle) return;
  handle.classList.remove("nudge");
  void handle.offsetHeight; // restart animation
  handle.classList.add("nudge");
}

function bounceCartCount(container: HTMLElement): void {
  const badge = container.querySelector<HTMLElement>("#cart-count");
  if (!badge) return;
  badge.classList.remove("bounce");
  void badge.offsetHeight;
  badge.classList.add("bounce");
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean (assuming Tasks 7–9 are complete).

- [ ] **Step 3: Visual smoke test**

Run `npm run dev`, open storefront popover. The structural shell should render: header with animated gradient bar, toolbar with search and "Collapse All", items grouped under collapsible headers, cart drawer collapsed at bottom showing "Cart  0  —  ▼". Item click and cart `+`/`−` don't do anything yet — Task 11 wires those up.

- [ ] **Step 4: Commit**

```bash
git add src/ui-store.ts
git commit -m "feat(ui): restructure storefront into toolbar + scroll wrapper + drawer"
```

---

## Task 11: Wire storefront events (search, collapse, drawer, cart controls)

**Files:**
- Modify: `src/ui-store.ts:245-317` (`bindStorefrontEvents`)

- [ ] **Step 1: Replace `bindStorefrontEvents`**

Replace the entire `bindStorefrontEvents` function with:

```ts
function bindStorefrontEvents(
  container: HTMLElement,
  data: StoreData,
  isGM: boolean
): void {
  // Search
  container.querySelector<HTMLInputElement>("#search-input")?.addEventListener("input", (e) => {
    searchTerm = (e.target as HTMLInputElement).value;
    renderStorefront(container, data, isGM);
  });

  // Group expand/collapse
  container.querySelectorAll<HTMLElement>(".grouping-header").forEach((header) => {
    header.addEventListener("click", () => {
      const group = header.dataset.group!;
      if (collapsedGroups.has(group)) {
        collapsedGroups.delete(group);
      } else {
        collapsedGroups.add(group);
      }
      renderStorefront(container, data, isGM);
    });
  });

  // Collapse / expand all
  container.querySelector<HTMLElement>("#collapse-all-btn")?.addEventListener("click", () => {
    const grouped = groupItemsByGrouping(getActiveItems(data));
    if (allCollapsed(grouped)) {
      collapsedGroups.clear();
    } else {
      for (const g of grouped.keys()) collapsedGroups.add(g);
    }
    renderStorefront(container, data, isGM);
  });

  // Minimize button (popover resize)
  container.querySelector("#minimize-btn")?.addEventListener("click", async () => {
    isMinimized = !isMinimized;
    const baseUrl = new URL(".", document.location.href).href;
    await OBR.popover.open({
      id: POPOVER_STORE_ID,
      url: `${baseUrl}store.html`,
      height: isMinimized ? 110 : 950,
      width: 750,
      anchorPosition: { top: 50, left: window.innerWidth * 0.5 },
      anchorOrigin: { horizontal: "CENTER", vertical: "TOP" },
      disableClickAway: true,
      hidePaper: false,
    });
    renderStorefront(container, data, isGM);
  });

  // Close button (just closes the popover for the local viewer)
  container.querySelector("#close-store-btn")?.addEventListener("click", () => {
    OBR.popover.close(POPOVER_STORE_ID);
  });

  // Drawer toggle
  container.querySelector<HTMLElement>("#cart-handle")?.addEventListener("click", () => {
    if (drawerOpen) closeDrawer(container);
    else openDrawer(container);
  });

  // Item click → add to cart with fly + flash
  container.querySelectorAll<HTMLElement>(".item-row").forEach((row) => {
    row.addEventListener("click", async () => {
      const itemName = row.dataset.itemName!;
      const item = data.catalog.find((i) => i.name === itemName);
      if (!item) return;
      const price = adjustPrice(item.price, data.config.priceAdjustment);

      flashRow(row);
      flyToCart(row, container, RARITY_COLORS[item.rarity] ?? RARITY_COLORS.common);
      bounceCartCount(container);

      const wasEmpty = data.cart.entries.length === 0;
      await addToCart(item, price);
      if (wasEmpty) openDrawer(container);
      else nudgeCartHandle(container);
    });

    row.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const itemName = row.dataset.itemName!;
      const item = data.catalog.find((i) => i.name === itemName);
      if (!item) return;
      showDescription(item, e.clientX, e.clientY, data);
    });
  });

  // Cart `+` button
  container.querySelectorAll<HTMLButtonElement>(".cart-qty-btn.plus").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const itemName = btn.dataset.addItem!;
      const playerId = btn.dataset.addPlayer!;
      const role = await OBR.player.getRole();
      if (playerId !== OBR.player.id && role !== "GM") return;
      const item = data.catalog.find((i) => i.name === itemName);
      if (!item) return;
      const price = adjustPrice(item.price, data.config.priceAdjustment);
      bounceCartCount(container);
      await addToCart(item, price);
    });
  });

  // Cart `−` button
  container.querySelectorAll<HTMLButtonElement>(".cart-qty-btn.minus").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const itemName = btn.dataset.removeItem!;
      const playerId = btn.dataset.removePlayer!;
      const role = await OBR.player.getRole();
      if (playerId !== OBR.player.id && role !== "GM") return;
      bounceCartCount(container);
      await removeOneFromCart(itemName, playerId);
    });
  });
}

function flashRow(row: HTMLElement): void {
  row.classList.remove("flash");
  void row.offsetHeight;
  row.classList.add("flash");
}

function flyToCart(row: HTMLElement, container: HTMLElement, color: string): void {
  const rowRect = row.getBoundingClientRect();
  const drawer = container.querySelector<HTMLElement>("#cart-drawer");
  if (!drawer) return;
  const drawerRect = drawer.getBoundingClientRect();

  const particle = document.createElement("div");
  particle.className = "fly-particle";
  particle.style.left = `${rowRect.left + 24}px`;
  particle.style.top = `${rowRect.top + rowRect.height / 2 - 14}px`;
  particle.style.background = color;
  particle.style.setProperty("--fly-x", `${drawerRect.left + 80 - rowRect.left - 24}px`);
  particle.style.setProperty("--fly-y", `${drawerRect.top - rowRect.top}px`);
  particle.textContent = "+1";
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 450);
}
```

The cart `+`/`−` buttons enforce the same permission rule as the old remove button (own cart, or GM).

Note that `addToCart` (defined in `cart.ts`) accepts an unadjusted price and returns a Promise. The metadata broadcast will trigger `onStoreDataChange` → re-render. The local fly animation runs immediately for snappy feedback; the slide-in animation runs on the next render only for entries that weren't in `prevCartKey`.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Manual test**

Run `npm run dev`. As GM (or via two clients), exercise:
- Click an item → fly particle flies toward the drawer; row flashes; drawer auto-opens; cart count badge bounces.
- Click another item → fly particle; cart handle nudges (drawer was already open).
- Click `+` next to a cart line → quantity goes up; cart count bounces; no fly particle.
- Click `−` → quantity goes down; line removes when it hits zero.
- Search → filtered list expands all groups during search.
- Click a group header → that group toggles.
- Click `Collapse All` toolbar button → toggles between all collapsed and all expanded.

If anything misfires, trace event listeners — re-render happens after every metadata change, so listeners must be re-bound (the existing pattern handles this because we always call `bindStorefrontEvents` from `renderStorefront`).

- [ ] **Step 4: Commit**

```bash
git add src/ui-store.ts
git commit -m "feat(ui): wire fly-to-cart, drawer toggle, qty controls, collapse-all"
```

---

## Task 12: Pulse animation on cart quantity / price changes

The mockup pulses the qty digit (verdigris up, terracotta down) and the line price (gold up/down) when the cart `+`/`−` buttons fire. Because the real cart re-renders from metadata, we apply pulse classes after re-render based on a delta map.

**Files:**
- Modify: `src/ui-store.ts` — track previous qty per item, apply pulse classes post-render

- [ ] **Step 1: Add a delta tracker**

Near the other module-level state, add:

```ts
const prevQtyByItem: Map<string, number> = new Map(); // key: `${playerId}::${itemName}`
```

- [ ] **Step 2: Apply pulses at end of `renderStorefront`**

At the very bottom of `renderStorefront` (after `initScrollFades(container);`), add:

```ts
applyCartPulses(container, data.cart.entries);
```

- [ ] **Step 3: Add `applyCartPulses` helper**

Add near the other helpers in `src/ui-store.ts`:

```ts
function applyCartPulses(container: HTMLElement, entries: CartEntry[]): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    const key = `${entry.playerId}::${entry.itemName}`;
    seen.add(key);
    const prev = prevQtyByItem.get(key);
    if (prev !== undefined && prev !== entry.quantity) {
      const direction = entry.quantity > prev ? "up" : "down";
      const row = container.querySelector<HTMLElement>(
        `[data-cart-item="${cssEscape(entry.itemName)}"][data-cart-player="${cssEscape(entry.playerId)}"]`
      );
      if (row) {
        const qty = row.querySelector<HTMLElement>(".cart-item-qty");
        const price = row.querySelector<HTMLElement>(".cart-item-price");
        qty?.classList.add(direction === "up" ? "pulse-up" : "pulse-down");
        price?.classList.add(direction === "up" ? "pulse-gold-up" : "pulse-gold-down");
      }
      const grandTotal = container.querySelector<HTMLElement>("#grand-total-value");
      if (grandTotal) {
        grandTotal.classList.add(direction === "up" ? "pulse-gold-up" : "pulse-gold-down");
      }
    }
    prevQtyByItem.set(key, entry.quantity);
  }
  // Clean up entries that no longer exist
  for (const key of [...prevQtyByItem.keys()]) {
    if (!seen.has(key)) prevQtyByItem.delete(key);
  }
}

function cssEscape(value: string): string {
  return value.replace(/(["\\])/g, "\\$1");
}
```

The pulse classes don't need to be removed — they're attached to elements that get rebuilt on each render, so they only fire once per qty change.

- [ ] **Step 4: Manual test**

Reload. Click `+` on an existing cart line — the qty should briefly grow to 1.5x and turn pale verdigris, the line price should pulse gold-bright, and the grand total at the bottom should pulse gold. Click `−` — qty shrinks to 0.65x and turns terracotta, prices pulse the down variant.

- [ ] **Step 5: Commit**

```bash
git add src/ui-store.ts
git commit -m "feat(ui): pulse cart qty and prices on quantity changes"
```

---

## Task 13: Redesigned description popup with rarity glow and drop cap

**Files:**
- Modify: `src/ui-store.ts:319-356` (`showDescription`, `dismissDescription`)

- [ ] **Step 1: Replace `showDescription`**

Replace the existing function with:

```ts
function showDescription(
  item: StoreItem,
  x: number,
  y: number,
  data: StoreData
): void {
  dismissDescription();

  const color = RARITY_COLORS[item.rarity] ?? RARITY_COLORS.common;
  const popup = document.createElement("div");
  const rarityClass = item.rarity !== "common" ? ` rarity-${item.rarity.replace(" ", "-")}` : "";
  popup.className = `description-popup${rarityClass}`;

  const maxX = window.innerWidth - 360;
  const maxY = window.innerHeight - 280;
  popup.style.left = `${Math.min(x + 8, maxX)}px`;
  popup.style.top = `${Math.min(y + 8, maxY)}px`;

  const price = adjustPrice(item.price, data.config.priceAdjustment);
  const imageContent = item.image
    ? `<img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" />`
    : item.name.charAt(0).toUpperCase();
  const imageStyle = item.rarity !== "common"
    ? `border-color: ${hexToRgba(color, 0.4)}; color: ${color};`
    : `color: rgba(255,255,255,0.7);`;

  popup.innerHTML = `
    <div class="desc-header">
      <div class="desc-image" style="${imageStyle}">${imageContent}</div>
      <div class="desc-header-info">
        <h3>${escape(item.name)}</h3>
        <div class="desc-meta">
          <span class="desc-type">${escape(item.type)}</span>
          <span class="desc-rarity" style="color: ${color}; border-color: ${hexToRgba(color, 0.5)};">${escape(item.rarity)}</span>
        </div>
        <div class="desc-price-line">${coinHtml(price, item.currency ?? "gp")}</div>
      </div>
    </div>
    <p class="desc-body-text">${escape(item.description)}</p>
    <div class="desc-actions" data-desc-actions></div>
  `;

  document.body.appendChild(popup);
  descriptionPopup = popup;
  refreshDescActions(item, data);
}
```

- [ ] **Step 2: Add the actions renderer + binder**

Add these helpers below `showDescription`:

```ts
function refreshDescActions(item: StoreItem, data: StoreData): void {
  if (!descriptionPopup) return;
  const actions = descriptionPopup.querySelector<HTMLElement>("[data-desc-actions]");
  if (!actions) return;

  const myId = OBR.player.id;
  const myEntry = data.cart.entries.find((e) => e.itemName === item.name && e.playerId === myId);
  const qty = myEntry?.quantity ?? 0;

  if (qty === 0) {
    actions.innerHTML = `<button class="desc-add-btn" data-desc-add>+ Add to Cart</button>`;
  } else {
    actions.innerHTML = `
      <div class="desc-qty-controls">
        <button class="desc-qty-btn minus" data-desc-minus>&minus;</button>
        <span class="desc-qty-value">${qty}</span>
        <button class="desc-qty-btn plus" data-desc-plus>+</button>
      </div>
      <span class="desc-qty-label">in cart</span>
      <button class="desc-remove-all" data-desc-remove-all>Remove all</button>
    `;
  }

  const price = adjustPrice(item.price, data.config.priceAdjustment);

  actions.querySelector<HTMLButtonElement>("[data-desc-add]")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    await addToCart(item, price);
  });
  actions.querySelector<HTMLButtonElement>("[data-desc-plus]")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    await addToCart(item, price);
  });
  actions.querySelector<HTMLButtonElement>("[data-desc-minus]")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    await removeOneFromCart(item.name, myId);
  });
  actions.querySelector<HTMLButtonElement>("[data-desc-remove-all]")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (myEntry) {
      for (let i = 0; i < myEntry.quantity; i++) {
        await removeOneFromCart(item.name, myId);
      }
    }
  });
}

function dismissDescription(): void {
  if (descriptionPopup) {
    descriptionPopup.remove();
    descriptionPopup = null;
  }
}
```

- [ ] **Step 3: Refresh the actions when the cart changes**

When the cart re-renders, the popup's qty value goes stale. Inside `renderStorefront`, after `applyCartPulses(container, data.cart.entries);`, add:

```ts
if (descriptionPopup) {
  const itemName = descriptionPopup.dataset.itemName;
  const item = itemName ? data.catalog.find((i) => i.name === itemName) : null;
  if (item) refreshDescActions(item, data);
}
```

And in `showDescription`, store the item name on the popup element (right after `descriptionPopup = popup;`):

```ts
popup.dataset.itemName = item.name;
```

- [ ] **Step 4: Right-click on popup dismisses without browser context menu**

Replace the existing `document.addEventListener("click", dismissDescription);` line in `initStorefront` with:

```ts
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (descriptionPopup && !descriptionPopup.contains(target)) {
    dismissDescription();
  }
});

document.addEventListener("contextmenu", (e) => {
  if (!descriptionPopup) return;
  const target = e.target as HTMLElement;
  if (!target.closest(".item-row")) {
    e.preventDefault();
    dismissDescription();
  }
});
```

The first listener dismisses on left-click outside; the second blocks the browser context menu and dismisses on right-click anywhere except over an item row (right-clicking another item row keeps the natural behavior of opening that item's popup).

- [ ] **Step 5: Manual test**

Right-click an item: popup appears with rarity-colored glow on legendary/very rare/rare/uncommon, drop cap on the description body, header section with rarity badge, price coin, and an "Add to Cart" button. Click `+ Add to Cart` — button switches to `−  qty  +` controls plus a "Remove all" link. Click `+`/`−` — qty updates in popup and in cart drawer simultaneously. Right-click empty space → popup dismisses without the browser context menu appearing. Right-click another item row → first popup dismisses and the new one opens.

- [ ] **Step 6: Commit**

```bash
git add src/ui-store.ts
git commit -m "feat(ui): redesign description popup with rarity glow, drop cap, qty controls"
```

---

## Task 14: Open-store / close-store controls live in config panel only

The original storefront header had a close-store icon usable by the GM. The mockup-based redesign moves the open/close controls entirely to the GM config panel (where they already are), and the storefront `×` button is now just "close popover for this viewer". Verify the config panel's open/close still works.

**Files:**
- Read-only verify: `src/ui-config.ts:146-167`

- [ ] **Step 1: Verify the config panel still has working open/close**

The existing `bindConfigEvents` (`src/ui-config.ts:146-167`) handles `#open-store` and `#close-store`. No code change needed.

- [ ] **Step 2: Manual test**

As GM, click the play button in the config panel → storefront popover opens for everyone. Click the stop button → popover closes for everyone, all carts are cleared. Confirmed working: nothing to commit.

---

## Task 15: Final polish and end-to-end manual test

- [ ] **Step 1: Type-check the whole tree**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: clean dist output.

- [ ] **Step 3: Sideload and exercise as GM and player**

In OBR, sideload the dev URL. Exercise:
- GM opens store → storefront appears for GM and players.
- Item with `rarity: "legendary"` shows orange pulsing glow on the row, image, and (when right-clicked) popup.
- Item with `rarity: "very rare"` shows purple subtle glow.
- Search "potion" → filters items, all groups expanded for the duration.
- Click `Collapse All` → toggles.
- Player adds an item → fly-particle flies, drawer opens, cart shows their entry.
- A second player adds something → both players' carts visible in the drawer with their player-color dots.
- GM right-clicks any cart line's `−` → can decrement another player's cart entry.
- Mixed-currency cart (e.g., a `1 cp` item and a `5 sp` item) shows the breakdown coins in subtotal and grand total, with metallic gradients and animated sheen.
- Description popup right-click works for legendary item, drop cap is visible, "Add to Cart" / qty controls work and dismiss-on-right-click still suppresses the browser menu.
- Close button on storefront → closes popover for that viewer only.
- GM stop-store → closes popover for all, clears all carts.
- Re-open store → carts are empty, drawer shows "The shopkeeper awaits your selection…".

- [ ] **Step 4: Final tidy-up commit (only if touched anything)**

```bash
git add -A
git commit -m "chore: final tidy after storefront redesign"
```

---

## Out of scope (not in this plan)

- New catalog items or schema changes.
- Drag-and-drop add-to-cart (was discussed but rejected in favor of click + fly animation).
- Per-item sound effects.
- Touch / mobile-specific tweaks (extension is desktop-only via OBR).
- A separate "checkout" / "process purchase" step.
- Localization or RTL support.
