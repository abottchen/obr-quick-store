# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev      # Vite dev server (CORS configured for https://www.owlbear.rodeo)
npm run build    # tsc type-check + Vite bundle to dist/
npx tsc --noEmit # Type-check only
```

No test framework is configured.

## Architecture

This is an **Owlbear Rodeo extension** — a browser-based plugin for the OBR tabletop RPG platform. It provides GMs with an interactive storefront to sell items to players during sessions. The only runtime dependency is `@owlbear-rodeo/sdk`.

### Two Entry Points

The extension runs in two separate popover windows, each with its own HTML entry point and bootstrap module:

- **Config panel** (`index.html` → `src/main.ts`) — GM toolbar button opens this. GMs see store configuration (name, NPC, price adjustment, item group filters, open/close). Players see a "GM only" message. Also listens for broadcast messages to open the storefront popover.
- **Storefront** (`store.html` → `src/store.ts`) — Opened as a second popover when GM opens the store. Shows the item list and shared cart to all players.

### State Management

Config and cart state live in **OBR room metadata** under key `com.abottchen.obr-quick-store/data`, shaped as `QuickStoreMetadata` (defined in `types.ts`). The item catalog is **not** stored in room metadata (due to OBR's 16KB metadata limit) — it is fetched via HTTP from a configurable URL (default: `./data/items.json` on GitHub Pages). The `catalog.ts` module handles fetching, validation, and in-memory caching with cache-busting support. The composite `StoreData` type combines the fetched catalog with metadata for rendering.

Inter-client signaling (open/close store) uses OBR's broadcast channel (`com.abottchen.obr-quick-store/store-control`).

### Key Modules

| Module | Role |
|--------|------|
| `metadata.ts` | Get/set/subscribe to room metadata (config + cart) |
| `catalog.ts` | Fetch, validate, and cache the item catalog from a remote URL |
| `ui-config.ts` | GM config panel rendering and event binding |
| `ui-store.ts` | Storefront rendering: item list (grouped by `type`), cart, descriptions |
| `cart.ts` | Cart add/remove, currency conversion (pp/gp/sp/cp ↔ copper base), subtotals |
| `types.ts` | All shared interfaces (`StoreItem`, `QuickStoreMetadata`, `StoreData`, etc.) |
| `constants.ts` | Extension ID, rarity/currency color maps, default config, default catalog URL |
| `styles.ts`, `styles-config.ts`, `styles-store.ts` | CSS-in-JS strings injected at runtime |

### Data Model

- **`StoreItem.itemGrouping`** is a `string[]` — controls which items appear when a group is active (any match = shown). Items are *displayed* grouped by their `type` field, not by itemGrouping.
- **Price adjustment** is applied at render time (`basePrice * adjustment / 100`), not stored on cart entries.
- **Cart entries** are per-player (keyed by OBR `playerId`). All players see the full cart; GMs can remove any entry.

### Styling

Dark theme with rarity-colored item borders/gradients and currency-colored price text. Styles are string constants injected into `<style>` tags — no CSS files or preprocessors.

### Deployment

GitHub Pages at `abottchen.github.io/obr-quick-store`. Vite uses relative base path (`./`). Built output goes to `dist/`. Deployment is automated via GitHub Actions on push to `main`.
